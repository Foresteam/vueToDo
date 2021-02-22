const express = require('express');
const bodyParser = require('body-parser');
const expressWs = require('express-ws');
const fs = require('fs');

const app = express();
expressWs(app);

class DB {
    constructor(file) {
        this.path = file;
        if (fs.statSync(file))
            this.self = JSON.parse(fs.readFileSync(file, 'utf-8'));
        else
            this.self = [];
    }
    save() {
        fs.writeFileSync(this.path, JSON.stringify(this.self, null, 4), 'utf-8');
    }
}
const db = new DB('todos.json');

class SocketMaster {
    constructor() {
        this.slaves = [];
        this.nslave = 0;
    }
    broadcast(msg) {
        if (typeof msg == 'object')
            msg = JSON.stringify(msg);
        else if (typeof msg != 'string')
            msg = String(msg);

        for (let slave of this.slaves)
            if (slave.alive)
                slave.send(msg);
    }
    punish() {
        let bastards = [];
        for (let islave in this.slaves)
            if (!this.slaves[islave].alive)
                bastards.push(islave);
        for (let ibastard of bastards.reverse())
            this.slaves.splice(ibastard, 1);
    }
    enslave(slave) {
        this.punish();
        slave.id = this.nslave;
        slave.alive = true;
        slave.onclose = () => slave.alive = false;
        this.nslave++;
        this.slaves.push(slave);
    }
}
const sm = new SocketMaster();

app.use(bodyParser.json());
app.use(express.static('./dist'));
app.use((rq, rs, next) => {
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

app.ws('/', (ws, rq) => {
    sm.enslave(ws);
    //sending entire todos
    ws.send(JSON.stringify({
        action: 'loadTodos',
        data: db.self
    }));
});

app.listen(1337);