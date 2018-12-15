<template>
  <div class="hello">
sub component text
<qrcode-reader @decode="onDecode" @init="onInit"><b>stuff here overlays the camera stream</b></qrcode-reader>
<button  v-on:click="doYouFire">click</button>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'loyalty_comp',
methods: {
  
    doYouFire: function (event){
     alert('i fired from a reference in child component, but i live in parent')
   },
 onDecode(content) {
   var vm = this;
      //this.paused = true;
      //console.log('qr code content= ' + content);
      
      console.log('content= '+ content)
      
      var parts =  content.split('/').reverse();
      console.log('parts= '+ parts[1])
      
      var res = content.match(/\A?perl=[^&]*/g);
      var res_formatted = res[0].replace("perl=", ""); 
      
      //alert(res[1]);
      console.log(res_formatted);
      
     /*  getpageID() */
     axios.get('/rcm-vue/wp-json/wp/v2/loyalty/?slug=' + parts[1]).then(function (response) {
          console.log(JSON.stringify(response));
          //console.log(JSON.parse(JSON.stringify(response)));
				  //set timeout so that waypoint waits until page has loaded before looking for element.
          
          var pageID = response.data[0].id;
          var offerSlug = response.data[0].slug;
          console.log('pageID= '+ pageID);
          vm.$router.push({ path: '/rcm-vue-master/loyalty/' + offerSlug + '/' ,params: { postID: pageID, postSlug: offerSlug }, query: { perl: res_formatted }})

          
			  });
      // ...
    },
    async onInit(promise) {
      // show loading indicator

      try {
        await promise;

        // successfully initialized
      } catch (error) {
        if (error.name === "NotAllowedError") {
          // user denied camera access permisson
        } else if (error.name === "NotFoundError") {
          // no suitable camera device installed
        } else if (error.name === "NotSupportedError") {
          // page is not served over HTTPS (or localhost)
        } else if (error.name === "NotReadableError") {
          // maybe camera is already in use
        } else if (error.name === "OverconstrainedError") {
          // passed constraints don't match any camera.
          // Did you requested the front camera although there is none?
        } else {
          // browser might be lacking features (WebRTC, ...)
        }
      } finally {
        // hide loading indicator
      }
    },


getpageID(){
    axios.get('/rcm-vue/wp-json/wp/v2/loyalty/' + parts[1]).then(response => vm.post = response.data).then(function (response) {
          //console.log(JSON.stringify(response));
          //console.log(JSON.parse(JSON.stringify(response)));
				  //set timeout so that waypoint waits until page has loaded before looking for element.
          
          var pageID = response.id
          var offerSlug = response.slug
          this.$router.push({ path: '/loyalty/'+ offerSlug,params: { postID: pageID, postSlug: offerSlug }, query: { perl: res_formatted }})

          
			  });

}

   },
   created(){
     /* var url = "http://localhost/rcm-vue/loyalty/item_3/?perl=ZGE3ZDZkMGNhMQ%3D%3D"
      var parts = url.split('/').reverse();
      console.log('parts= '+ parts[1]) */

   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
