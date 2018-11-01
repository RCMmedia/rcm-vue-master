<?php status_header(200); ?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js no-svg">
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="profile" href="http://gmpg.org/xfn/11">
  <?php wp_head(); ?>
</head>
<body>
<script>
	var  global_page_id = <?php global $post; echo $post->ID; ?>;
</script>
<script>
	var  root_site_path = "<?php echo $_SERVER['REQUEST_URI'] ?>";
</script>
  <div id="app"></div>
  <p style="display:none"> user point value: 
    <?php
   $user_id = 'user_'. get_current_user_id();
  the_field('loyalty_item_1', $user_id); 
  //gamipress_trigger_event()


  ?></p>

  <div>

  
  </div>
  
  <?php wp_footer(); ?>
</body>
</html>