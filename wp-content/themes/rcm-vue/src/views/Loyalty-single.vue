<template>
  <div class="loyalty">
    <div class="left">
      <!-- <img width="150" src="../assets/logo.png"> -->
      <h1>Title of single</h1>
      <p>paragraph text here </p>
      <!-- <button @click="auth('google')">Google</button>
      <button @click="hello('google').login();">Google 2</button>
      <button @click="hello('facebook').login();">Facebook</button> -->
      <!-- <input id="loyalty_value" type="number"/> -->
      <!-- <button @click="addPoint" class="save">Save Value</button> -->

      <hr>
      <div class="post-list-wrap"> 
	      <div class="single-post"  v-if="post" >
			    <div>offer title: {{ post.title.rendered }}</div>
          <div>offer id: {{ post.id }}</div>
          <div>offer slug: {{ post.slug }}</div>
          <div>offer PERL: {{ post.acf.offer_code }}</div>
          <div>offer Max Value: {{ post.acf.max_value }}</div>
           
          <div v-if="user">USER Value: {{ user }}</div>

          
          <router-link :to="{ name: 'load-qr-reader' }">
           Redeem
          </router-link>
			    <!-- <router-link :to="{ name: 'post', params: { postID: post.id }}">
           Read More
          </router-link> -->
		    </div><!-- single-post -->
	    </div><!-- post-list-wrap -->
    </div>


    
   
  </div>
</template>
<script>
// @ is an alias to /src
import axios from 'axios'
//import VueAxios from 'vue-axios'
import $ from "jquery";
//import load_qr_reader from "../components/load_qr_reader.vue";


export default {
  name: "loyalty",
  /* components: {
      'loadQR': load_qr_reader
    }, */
  data: function () {
    return {
      post: null,
      user: null
    }
  },
  props: ["postID", "postSlug"],

  methods: {
    doYouFire: function (event){
      alert('i fired from a reference in child component, but i live in parent');
    }
    
 
   
  },
 created () {

   

    console.log('created fire');
    console.log('global_page_id ='+ global_page_id );
    console.log('postid= '+ this.$route.params.postID);

    var getPageID = this.$route.params.postID;
    if (getPageID !== undefined && getPageID !== null) {
      var routePageID = getPageID
    } else {
      var routePageID = global_page_id
    }
    var vm = this;
    var _offerSlug ;
    var _offerCode ;
    var _userValue;

    function loadLoyaltyItems(callback){
      console.log('running loadLoyaltyItems() now...');
      if(typeof WPsettings != 'undefined'){ //check if user is logged in

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

      //axios.get('/rcm-vue-master/wp-json/wp/v2/loyalty/' + routePageID).then(response => {this.post = response.data});
      
     
        axios.get('/rcm-vue-master/wp-json/wp/v2/loyalty/' + routePageID).then(response => vm.post = response.data).then(function (response) {
          //console.log(JSON.stringify(response));
          console.log(JSON.parse(JSON.stringify(response)));
				  //set timeout so that waypoint waits until page has loaded before looking for element.
          
          var maxValue = response.acf.max_value
          var offerSlug = response.slug
           _offerSlug = offerSlug
          var isActive = response.acf.active
          var offerCode = response.acf.offer_code
          _offerCode = offerCode

          console.log('slug= ' + offerSlug);

          if(typeof isActive != 'undefined' && isActive == 'ON'){
            //getCurrentUserPoint();
            console.log('offer is active');
            var perl = getUrlVars()["perl"];//get perl from getUrlVars() function
            var perlUrlDecoded = decodeURIComponent(perl) //decode the PERL url parameter to be able to compare in next line
            if ( perlUrlDecoded == offerCode) {                

            } else {
              //alert('PERL DOES NOT MATCH!!')
              console.log('no PERL in URL')
            }
          } else {
            alert('offer is inactive'); //make sure this fires, test it
          }
          callback();
			  });
        //var offerSlug = post.slug
      
      
      //console.log(response);
      } else {
        alert('not logged, replace alert with something else')
      }//end login check
      
    } //end loadLoyaltyItems()
    
    loadLoyaltyItems(getCurrentUserPoint);

    function getCurrentUserPoint(){
      console.log('running getCurrentUserPoint() now...');
      var offerSlug2 = _offerSlug;
      console.log('offerSlug2 from getCurrentUserPoint() = ' + offerSlug2);

      if(typeof WPsettings != 'undefined'){ //check if user is logged in
      $.ajax({
        url: WPsettings.root + "wp/v2/users/" + WPsettings.current_user_ID,
        method: "get",
        dataType: "json",
        beforeSend: function(xhr) {
          xhr.setRequestHeader("X-WP-Nonce", WPsettings.nonce);
        },
        success: function(data) {
          //user = this.data
          vm.user = data.custom_user_point_value[offerSlug2][0];
          console.log('success= ' + offerSlug2);
          //var offer_duration = data.acf.set_duration;
          _userValue = data.custom_user_point_value[offerSlug2];
          console.log('user value= ' + _userValue);
          //var offer_active_status = data.acf.active;
          //var offer_offer_monday = data.acf.offer_monday;
          //console.log('offerduration= '+ offer_duration)
          
          
          loyaltyVerifcationCheck(addPoint);

          
        }
      });
      } else {
        alert('not logged in (show login popup or notification)  ');
      }

    }

    function loyaltyVerifcationCheck(callback) {
      console.log('running loyaltyVerifcationCheck() now...');
      var _offerSlug2 = _offerSlug //redifine var to work with this function kinda like a global function
      var _offerCode2 = _offerCode
      console.log('offerCode from loyaltyVerifcationCheck()= ' + _offerCode2);
      console.log('offerSlug from loyaltyVerifcationCheck()= ' + _offerSlug2);
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
             //make sure querystring is not empty or null
              //var decodedPerl = window.atob(perl); //decode perl 
              console.log("perl= " + perl); // show the string

              //set expiration date to end of day for points that can be redeemed once a day
              var currentDate = new Date();
              var expirationDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() + 1,0,0,0
              );
              //set cookie
              document.cookie ="perl=" + perl + ";expires=" + expirationDate + ";path=/";
              //console.log(document.cookie);

              
              //console.log("offerduration= " + offer_duration);
              //addPoint()
              
            
            
          }
          callback();
    } // end loyaltyVerifcationCheck()

    
    function addPoint(){
          var _userValue2 = _userValue
          console.log('running addPoint() now...');
          var _offerSlug2 = _offerSlug;

          
          console.log('_offerSlug2 from addPoint()= ' + _offerSlug2);
          //alert("vue value = " + loyalty_item_1_increment++);
          console.log("user value from addPoint()" + _userValue2);
          var _userValue2_increment = ++_userValue2;
          console.log("user value incremented by 1= " + _userValue2_increment);
          var data =   {custom_user_point_value : { "item_3" : _userValue2_increment }};
          $.ajax({
            url: WPsettings.root + "wp/v2/users/" + WPsettings.current_user_ID,
            method: "POST",
            contentType: 'application/json',
            dataType: 'json',
            //data: JSON.stringify(data),
            beforeSend: function(xhr) {
              xhr.setRequestHeader("X-WP-Nonce", WPsettings.nonce);
            },
            data: {
              // myData
              // "acf": {"loyalty_item_1": newTitle}

              // "acf": {
              //     "loyalty_item_1": newTitle
              // },
              custom_user_point_value : {
                item_3: _userValue2_increment
              }
              
              //data.custom_user_point_value[offerSlug2]: loyalty_item_1_increment++

            }
          });
    }

    
    
    
  }
};
</script>


<style scoped lang="scss">
.loyalty {
  display: flex;

  .left {
    width: 50%;
  }
  .right {
    width: 50%;
  }
}
</style>
