<template>
    <li v-bind:class="{done: todo.completed}">
        <table>
            <tr>
                <td>
                    {{ index + 1 + '.' }}
                    <label>
                        <input type="checkbox" :checked="todo.completed" @change="$emit('update-completed', todo, !todo.completed)">{{ todo.text }}
                    </label>
                </td>
                <td class="floater">
                    <input type="button" value="X" @click="$emit('remove-todo', todo.id)">
                </td>
            </tr>
        </table>
    </li>
</template>

<script>
export default {
    props: ['todo', 'index'],
    methods: {
        fuck() {
            // this.todo.completed = !this.todo.completed;
        }
    }
}
</script>

<style scoped>
li {
    text-align: left;
    list-style: none;
    padding-bottom: 5pt;
    border-bottom: 1px solid black;
    margin-top: 5pt;
    word-wrap: break-word;
    width: 100%;
}
li table {
    width: 100%;
    vertical-align: top;
}
.floater {
    margin-left: 5pt;
    float: right;
    display: block;
}

.done {
    text-decoration: line-through;
}
</style>