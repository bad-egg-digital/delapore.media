<?php

namespace App\PostTypes;

class Example
{
    public function __construct()
    {
        // add_action('init', [$this, 'register']);
    }

    public function register()
    {
        $td = 'sage';
        $postType = 'example';

        register_extended_post_type(
            $postType,
            [
                'menu_position' => 28,
                'supports' => [
                    'title',
                    'page-attributes',
                ],
                'menu_icon' => 'dashicons-info',
                'rewrite' => false,
                'has_archive' => false,
                'publicly_queryable' => false,
                'exclude_from_search' => true,
                'capability_type' => 'page',
                'show_in_nav_menus' => false,
            ],
        );
    }
}
