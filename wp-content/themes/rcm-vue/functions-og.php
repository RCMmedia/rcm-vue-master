<?php
// Remove all default WP template redirects/lookups
remove_action('template_redirect', 'redirect_canonical');

// Redirect all requests to index.php so the Vue app is loaded and 404s aren't thrown
function remove_redirects() {
    add_rewrite_rule('^/(.+)/?', 'index.php', 'top');
}
add_action('init', 'remove_redirects');

// Load scripts
function load_vue_scripts() {
    wp_enqueue_style('blankslate/app.css', get_template_directory_uri() . '/dist/styles/app.css', false, null);
    wp_enqueue_script('blankslate/manifest.js', get_template_directory_uri() . '/dist/scripts/manifest.js', null, null, true);
    wp_enqueue_script('blankslate/vendor.js', get_template_directory_uri() . '/dist/scripts/vendor.js', null, null, true);
    wp_enqueue_script('blankslate/app.js', get_template_directory_uri() . '/dist/scripts/app.js', null, null, true);
}
add_action('wp_enqueue_scripts', 'load_vue_scripts', 100);

//custom meta rest endpoint
function wp_rest_api_alter() {
    register_rest_field( 'user',
        'test',
        array(
          'get_callback'    => function($data, $field, $request, $type){
            if (function_exists('get_field')) {
                $post_id = 'user_'. get_current_user_id(); // user ID = 2
              return get_field('test', $post_id);
            }
            return [];
          },
          'update_callback' => null,
          'schema'          => null,
        )
    );
  }
  add_action( 'rest_api_init', 'wp_rest_api_alter');
  

  add_action("rest_api_init", function () {


    register_rest_field(
          "user", 
          "loyalty_item_1",
        [
            "get_callback" => function ($user, $field_name, $request, $object_type) {

                return get_user_meta($user["id"], $field_name, TRUE);

            },
            "update_callback" => function ($value, $user, $field_name, $request, $object_type) {

                update_user_meta($user->ID, $field_name, $value);

            },
        ]
    );


});

$length = 10;
$offer_id = substr(str_shuffle(md5(time())),0,$length);

$offer_id_base64 = base64_encode($offer_id);

//echo $randomString;

//$offer_id = higglypiggly; // variable in script to be passed coming from object (could be any variable.)  


add_filter('acf/load_field/name=offer_monday',
         function($field) use ($offer_id_base64) { 
          // the variable after 'use' ($member_id) indicates that it is the one to 'use' from the main script.  $field is coming from 'acf/load_field'.  
	     $field['default_value'] = $offer_id_base64;
	     return $field;
	 }
 );
 

//if field is empty then add fresh new value
add_filter('acf/update_value/name=offer_monday', 'my_acf_update_value', 10, 3);
 function my_acf_update_value($value, $post_id, $field) {
   if (empty($value)) {
     $value = $field['default_value'];
   }
   return $value;
 }

//add these values to head of the page on load
if ( ! is_admin() ) { // <------- check this if something is broken, tried adding this to load the script only on frontend and not an admin page. 

function my_head_input()
{
    ?>


    <script type="text/javascript">
    jQuery(document).ready(function(){
       var offer_id_value = $("#acf-field_5b858c49fd71f").val();
       var decoded_offer_id_value = window.atob(offer_id_value);
             $("#offer_id_field p").text("Decoded Offer ID= " + decoded_offer_id_value);
            //console.log(offer_id_value)
        });
    </script>
    <?php
}

add_action('acf/input/admin_head', 'my_head_input');
}

  // functions.php
  function add_extra_user_fields( $user ) {
    $args = array(
        'post_type' => 'loyalty',
        'posts_per_page' => -1,
    );
    $query = new WP_Query($args);
    ?>
    <h3>Availible <!-- Achievments --></h3>
   
    <?php $loyalty_post_id="";
    if ( $query->have_posts() ) : while ( $query->have_posts() ) : $query->the_post(); ?>
        <div>
            <label for="<?php the_ID(); ?>"><?php the_title(); ?></label>
            <input id="<?php the_ID(); ?>" type="text" value="<?php the_ID(); ?>">
        </div>
        <?php// $post_ids[] = get_the_ID(); ?>
        
    <?php endwhile; endif; ?>
   

    <?php 
    $args = array( 'post_type' => 'loyalty');

    $loop = new WP_Query( $args );
    while ( $loop->have_posts() ) : $loop->the_post(); ?>
        

         <div>
            <label for="">post <?php the_ID(); ?> value</label>
            <input id="user_points_<?php the_ID(); ?>" type="text" name="user_points" value="<?php echo esc_attr( get_user_meta( "'user_points_'. the_ID()", $user->ID ) ); ?>">
        </div>
    <?php endwhile;
    
    ?>

 
    <?php
    }
    
    add_action( 'show_user_profile', 'add_extra_user_fields' );
    add_action( 'edit_user_profile', 'add_extra_user_fields' );
    
    add_action( 'personal_options_update', 'save_extra_user_profile_fields' );
add_action( 'edit_user_profile_update', 'save_extra_user_profile_fields' );

function save_extra_user_profile_fields( $user ) {
    $args = array( 'post_type' => 'loyalty');

    $loop = new WP_Query( $args );
    while ( $loop->have_posts() ) : $loop->the_post(); ?>
        <?php $page_id_val ='user_points_'. the_ID(); ?>

         <?php update_user_meta( $user, $page_id_val , $_POST[$page_id_val] ); ?>
    <?php endwhile;
   
    //update_user_meta( $user, 'user_points' , $_POST['user_points'] );
   
}
    
   /*  add_action("rest_api_init", function () {


        register_rest_field(
              "user", 
              "user_value",
            [
                "get_callback" => function ($user, $field_name, $request, $object_type) {
    
                    return get_user_meta($user["id"], $field_name, TRUE);
    
                },
                "update_callback" => function ($value, $user, $field_name, $request, $object_type) {
    
                    update_user_meta($user->ID, $field_name, $value);
    
                },
            ]
        );
    
    
    }); */