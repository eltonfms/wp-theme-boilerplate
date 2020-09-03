<?php
/**
 * Theme Boilerplate functions and definitions
 *
 * @package Theme Boilerplate
 * @subpackage theme_boilerplate
 * @since 1.0
 */

/**
 * Styles CSS
 *
 */

function add_style_css() {
    wp_enqueue_style( 'style', get_template_directory_uri() . '/style.css' );
}

add_action('wp_enqueue_scripts', 'add_style_css');

?>