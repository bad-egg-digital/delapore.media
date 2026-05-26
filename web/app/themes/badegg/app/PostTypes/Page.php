<?php

namespace App\PostTypes;

class Page
{
    public function __construct()
    {
        add_post_type_support( 'page', 'excerpt' );
        add_filter( 'register_page_post_type_args', [$this, 'args'], 10, 2 );
        add_action( 'pre_get_posts', [$this, 'order'], 10, 2 );
    }

    public function args($args)
    {
        $args['hierarchical'] = false;

        return $args;
    }

    public function order($query)
    {
        if ( !is_admin() || !$query->is_main_query() ) {
            return;
        }

        $screen = get_current_screen();
        // change 'book' with your real CPT name
        if ( $screen->base === 'edit' && $screen->post_type === 'page' ) {
            $query->set('orderby', 'menu_order');
            $query->set('order', 'ASC');
        }
    }
}
