<template>
  <div class="about">
    <img src="../assets/rcm-brand-logo.png">
    <h1>This is an about page</h1>
    asdfasdfs
    <aboutComp/>
  </div>
</template>
<script>
// @ is an alias to /src
import aboutComp from '../components/about_comp.vue'

export default {
  name: 'about',
  components: {
    aboutComp
  }
}
</script>
