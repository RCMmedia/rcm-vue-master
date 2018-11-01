<template>
  <div class="loyalty">
    <div class="left">
      <!-- <img width="150" src="../assets/logo.png"> -->
      <h1>List <!-- of Offers --></h1>
      <p>paragraph text here </p>

      <!-- <button @click="auth('google')">Google</button>
      <button @click="hello('google').login();">Google 2</button>
      <button @click="hello('facebook').login();">Facebook</button> -->
      <input id="loyalty_value" type="number"/>
      <button @click="addPoint" class="save">Save Value</button>
    </div>

    <div class="right">
      <qrcode-reader @decode="onDecode" @init="onInit"><b>stuff here overlays the camera stream</b></qrcode-reader>
      <div class="post-list-wrap">
	      <div class="single-post" v-for="post in posts" :key="post.id">
			    <div>{{ post.title.rendered }}</div>
		
			    <router-link :to="{ name: 'loyalty-single' , params: { postID: post.id, postSlug: post.slug }}">
           View Offer |ID = {{post.id}} | Slug = {{post.slug}}
          </router-link>
		    </div><!-- single-post -->
	    </div><!-- post-list-wrap -->
    </div>
    
   
  </div>
</template>
<script>
// @ is an alias to /src
import axios from 'axios'
import VueAxios from 'vue-axios'
import $ from "jquery";

export default {
  name: "loyalty",
  data: function () {
        return {
            posts:[]
        }
        
    },
  methods: {
    addPoint: function() {
      let newTitle = document.querySelector("#loyalty_value").value;

      var myData = { acf: { loyalty_item_1: newTitle } };
      console.log("submitted: " + newTitle);
      $.ajax({
        url: WPsettings.root + "wp/v2/users/" + WPsettings.current_user_ID,
        method: "POST",
        //dataType: "json",
        beforeSend: function(xhr) {
          xhr.setRequestHeader("X-WP-Nonce", WPsettings.nonce);
        },
        data: {
          // myData
          // "acf": {"loyalty_item_1": newTitle}

          acf: {
            loyalty_item_1: newTitle
          },
          loyalty_item_1: newTitle,
          test: newTitle,
          post_meta_fields: {
            35: newTitle
          }

        }
      });
    },
    onDecode(content) {
      this.paused = true;
      console.log(content);
      //alert(content);

      $.ajax({
        url: WPsettings.root + "wp/v2/users/" + WPsettings.current_user_ID,
        method: "get",
        //dataType: "json",
        beforeSend: function(xhr) {
          xhr.setRequestHeader("X-WP-Nonce", WPsettings.nonce);
        },
        success: function(data) {
          var loyalty_item_1_increment = data.loyalty_item_1++;
          alert("vue value = " + loyalty_item_1_increment++);
          alert("incremented value" + data.loyalty_item_1);
          $.ajax({
            url: WPsettings.root + "wp/v2/users/" + WPsettings.current_user_ID,
            method: "POST",
            //dataType: "json",

            beforeSend: function(xhr) {
              xhr.setRequestHeader("X-WP-Nonce", WPsettings.nonce);
            },
            data: {
              // myData
              // "acf": {"loyalty_item_1": newTitle}

              // "acf": {
              //     "loyalty_item_1": newTitle
              // },
              loyalty_item_1: loyalty_item_1_increment++
              /* test:newTitle */
            }
          });
        }
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
    }
  },
  created: function() {
    console.log('global_page_id ='+ global_page_id );
    var vm = this;
    function loadLoyaltyItems(){
      axios.get('/rcm-vue/wp-json/wp/v2/loyalty').then(response => vm.posts = response.data).then(function (response) {
				console.log(response);
  		});;
      
      //console.log(response);
    }

    function loyaltyVerifcationCheck() {
      $.ajax({
        url: WPsettings.root + "wp/v2/pages/" + WPsettings.loylaty_config,
        method: "get",
        //dataType: "json",
        beforeSend: function(xhr) {
          xhr.setRequestHeader("X-WP-Nonce", WPsettings.nonce);
        },
        success: function(data) {
          var offer_duration = data.acf.set_duration;
          var offer_active_status = data.acf.active;
          var offer_offer_monday = data.acf.offer_monday;
          //console.log('offerduration= '+ offer_duration)

          //gather URL parameters
          function getUrlVars() {
            var vars = {};
            var parts = window.location.href.replace(
              /[?&]+([^=&]+)=([^&]*)/gi,
              function(m, key, value) {
                vars[key] = value;
              }
            );
            return vars;
          }

          //get cookie value

          if (document.cookie.indexOf("perl") > -1) {
            var cookieValue = document.cookie.replace(
              /(?:(?:^|.*;\s*)perl\s*\=\s*([^;]*).*$)|^.*$/,
              "$1"
            );

            console.log("cookie is set = " + cookieValue);
            alert(
              "Sorry, you have already redeemed this loyalty point, please wait until tomorrow "
            );
            //var encodedData = window.btoa(perl); // encode a string
          } else {
            console.log("no cookie present, setting cookie now...");
            var perl = getUrlVars()["perl"];
            if (perl != "" || perl == null) { //make sure querystring is not empty or null
              var decodedPerl = window.atob(perl); //decode perl 
              console.log("perl= " + decodedPerl); // show the string

              //set expiration date to end of day for points that can be redeemed once a day
              var currentDate = new Date();
              var expirationDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() + 1,0,0,0
              );
              //set cookie
              document.cookie ="perl=" + decodedPerl + ";expires=" + expirationDate + ";path=/";
              //console.log(document.cookie);

              
              console.log("offerduration= " + offer_duration);
              
            }
          }
        }
      });
    }
    function redeemPoint(){
      
    }

    //loyaltyVerifcationCheck();
    loadLoyaltyItems();
  }
};
</script>


<style scoped lang="scss">
.loyalty {
  display: flex;
  flex-direction: column;

  .left {
    width: 50%;
    margin-bottom: 50px
  }
  .right {
    width: 50%;
  }
}
.single-post {background:#ddd;margin-bottom:10px;padding:10px}
</style>
