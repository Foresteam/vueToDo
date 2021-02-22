<template>
    <ol>
        <TodoItem
            v-for="(todo, i) of todos.filter(e => filter == 'All' || filter == 'Completed' && e.completed || filter == 'Not completed' && !e.completed)"
            :key="todo"
            :todo="todo"
            :index="i"
            @remove-todo="id => $emit('remove-todo', id)"
            @update-completed="(todo, nv) => $emit('update-completed', todo, nv)"
        />
    </ol>
</template>
<script>
import TodoItem from '@/components/TodoItem';
export default {
    props: ['todos', 'filter'],
    components: {
        TodoItem
    }
}
</script>

<style scoped>
ol {
    width: 100%;
    margin-top: 5pt;
    padding-left: 0pt;
}
</style>