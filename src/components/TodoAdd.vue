<template>
    <div class="add">
        <input type="text" placeholder="Enter a todo text" v-model="value">
        <input type="button" @click="$emit('add-todo', value); value = ''" value="Add">
    </div>
</template>

<script>
export default {
    data: () => ({
        value: ''
    }),
    methods: {
    }
}
</script>

<style scoped>
.add {
    display: flex;
    justify-content: center;
    margin-bottom: 5pt;
}
input[type="button"] {
    width: 100px;
}
input[type="text"] {
    flex-grow: 100;
}
</style>