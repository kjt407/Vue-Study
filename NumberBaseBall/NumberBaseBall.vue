<template>
    <div>
        <h1>{{result}}</h1>
        <form v-on:submit="onSubmit">
            <input ref="answer" maxlength="4" v-model="inputValue" type="text">
        </form>
        <div>시도: {{}}</div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                inputValue: '',
                result: '',
            }
        },
        methods: {
            onSubmit(e) {
                e.preventDefault();
            }
        },
    }
</script>

<style>
</style>