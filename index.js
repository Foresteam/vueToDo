const express = require('express');
const bodyParser = require('body-parser');
const expressWs = require('express-ws');
const fs = require('fs');
const et = require('./core/etemporal'); // Temporal (Enternal) solution

const db = new et.DB('todos.json');
const sm = new et.SocketMaster();

const app = express();
expressWs(app);

app.use(bodyParser.json());
app.use(express.static('./dist'));
app.use((rq, rs, next) => { // for debugging. Release build doen't need this
    rs.set('Access-Control-Allow-Origin', '*');
    rs.set('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.post('/actions/:action', (rq, rs) => {
    switch (rq.params.action) {
        case 'addTodo':
            var todo = rq.body.ntodo;
            if (!todo) {
                rs.end();
                return;
            }

            db.self.push(todo);
            db.save();
            rs.end();

            sm.broadcast({
                action: 'addTodo',
                data: todo
            });
            return;
        case 'removeTodo':
            var id = rq.body.id;
            db.self.splice(db.self.findIndex(e => e.id == id), 1);
            db.save();
            
            sm.broadcast({
                action: 'removeTodo',
                data: id
            });
            rs.end();
            return;
        case 'updateTodo':
            var { id, completed } = rq.body;
            db.self.find(e => e.id == id).completed = completed;
            db.save();
            sm.broadcast({
                action: 'updateTodo',
                data: { id, completed }
            });
            rs.end();
            return;
    }
});

app.ws('/', (ws, rq) => { //accepting sockets
    sm.enslave(ws); // enslave this sweet one
    // sending entire todos
    ws.send(JSON.stringify({
        action: 'loadTodos',
        data: db.self
    }));
});

app.listen(1337);