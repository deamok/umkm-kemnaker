<?php
/**
 * SaleCraft Ecommerce V2 functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package salecraft-ecommerce-v2
 * @since salecraft-ecommerce-v2 1.0
 */

function salecraft_ecommerce_v2_scripts() {

    wp_enqueue_script( 'owl.carousel-js', get_stylesheet_directory_uri(). '/js/owl.carousel.js', array('jquery'),wp_get_theme()->get( 'Version' ) ,true );

    wp_enqueue_script( 'salecraft-ecommerce-v2-scripts', get_stylesheet_directory_uri() . '/js/theme.js', array('jquery'),wp_get_theme()->get( 'Version' ) ,true );
}
add_action( 'wp_enqueue_scripts', 'salecraft_ecommerce_v2_scripts' );

function bee_real_estate_styles() {
	wp_enqueue_style( 'salecraft-ecommerce-v2-style-parent', get_template_directory_uri() . '/style.css' );

	wp_enqueue_style( 'salecraft-ecommerce-v2-basic-style', get_stylesheet_uri() );

    wp_enqueue_style( 'owl.carousel-style', get_stylesheet_directory_uri().'/css/owl.carousel.css', array(),wp_get_theme()->get( 'Version' ) );
}
add_action( 'wp_enqueue_scripts', 'bee_real_estate_styles' );

// Remove Admin Notice
function salecraft_ecommerce_v2_remove_notice() {
    if ( get_option( 'salecraft_ecommerce_admin_notice_welcome' ) != 1 ) {
        update_option( 'salecraft_ecommerce_admin_notice_welcome', 1 );
    }
}
add_action( 'init', 'salecraft_ecommerce_v2_remove_notice', 999 );

// Remove Getting Started page
function salecraft_ecommerce_v2_remove_action() {
    remove_submenu_page(
        'themes.php',
        'salecraft-ecommerce'
    );
}
add_action( 'admin_menu', 'salecraft_ecommerce_v2_remove_action', 999 );

// Remove Customizer
function salecraft_ecommerce_v2_remove_customizer_action() {
    remove_action( 'customize_register','salecraft_ecommerce_customize_register' );
}
add_action( 'init', 'salecraft_ecommerce_v2_remove_customizer_action');