<?php
/**
 * Install
 *
 * @package     GamiPress\Install
 * @since       1.1.0
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

function gamipress_install() {

    // Setup default GamiPress options
    if( gamipress_is_network_wide_active() ) {
        $gamipress_settings = ( $exists = get_site_option( 'gamipress_settings' ) ) ? $exists : array();
    } else {
        $gamipress_settings = ( $exists = get_option( 'gamipress_settings' ) ) ? $exists : array();
    }

    if ( empty( $gamipress_settings ) ) {

        $gamipress_settings['minimum_role'] = 'manage_options';
        $gamipress_settings['points_image_size'] = array( 'width' => 50, 'height' => 50 );
        $gamipress_settings['achievement_image_size'] = array( 'width' => 100, 'height' => 100 );
        $gamipress_settings['rank_image_size'] = array( 'width' => 100, 'height' => 100 );

        if( gamipress_is_network_wide_active() ) {
            update_site_option( 'gamipress_settings', $gamipress_settings );
        } else {
            update_option( 'gamipress_settings', $gamipress_settings );
        }
    }

    // Register GamiPress custom DB tables
    gamipress_register_custom_tables();

    // Register GamiPress post types and flush rewrite rules
    gamipress_flush_rewrite_rules();
}
