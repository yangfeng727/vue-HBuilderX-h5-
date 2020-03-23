<template>
  <div id="app" ref="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    methods: {},
    created () {
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /*margin-top: 60px;*/
    position: absolute;
    top: 0;
    bottom: 0;
    overflow-y: auto;
    width: 100%;
    height: 100%;
    background-color: #f2f2f2;
  }

  /*html{*/
  /*background-color:#f2f2f2;*/
  /*}*/
</style>
