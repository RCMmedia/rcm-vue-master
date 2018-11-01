<template>
  <div id="app">
    <div id="nav">
      <router-link to="/rcm-vue">Home</router-link> |
      <router-link to="/rcm-vue/about">About</router-link>
      <router-link to="/rcm-vue/loyalty">Loyalty</router-link>
      <a href="http://localhost/rcm-vue/wp-login.php">Login</a>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss" >
  @import './styles/app.scss';
</style>