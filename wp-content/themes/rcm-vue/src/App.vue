<template>
  <div id="app">
    <div id="nav">
      <router-link to="/rcm-vue-master">Home</router-link> |
      <router-link to="/rcm-vue-master/about">About</router-link>
      <router-link to="/rcm-vue-master/loyalty">Loyalty</router-link>
      <a href="http://localhost/rcm-vue-master/wp-login.php">Login</a>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss" >
  @import './styles/app.scss';
</style>