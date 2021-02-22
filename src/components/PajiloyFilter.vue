<template>
    <select v-model="filter" @change="$emit('filter-change', filter)">
        <option v-for="f of filterNames" :key="f">
            {{ f }}
        </option>
    </select>
</template>

<script>
export default {
    props: ['filterNames'],
    data: () => ({
        filter: 'All'
    }),
    methods: {
    }
}
</script>

<style scoped>
select {
    margin-top: 5pt;
    margin-bottom: 5pt;
}
</style>