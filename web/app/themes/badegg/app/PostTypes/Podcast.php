<?php

namespace App\PostTypes;

class Podcast
{
    private $td = 'badegg';
    private $postType = 'podcast';

    public function __construct()
    {
        add_action('init', [$this, 'register']);
    }

    public function register()
    {
        register_extended_post_type(
            $this->postType,
            [
                'menu_position' => 4,
                'supports' => [
                    'title',
                    'editor',
                    'excerpt',
                    'thumbnail',
                    'page-attributes',
                ],
                'menu_icon' => 'dashicons-controls-volumeon',
                'show_in_rest' => true,
                'rest_base' => 'podcasts',
                'archive' => [
                    'nopaging' => true,
                ],
                'rewrite' => [
                    'slug' => 'podcast',
                ],
                'labels' => [
                    'menu_name' => __('Podcast', $this->td),
                    'all_items' => __('All Episodes', $this->td),
                    'add_new_item' => __('Add Episode', $this->td),
                ],
                'show_in_graphql' => true,
                'graphql_single_name' => 'podcast',
                'graphql_plural_name' => 'podcasts',
                'public' => true,
                'publicly_queryable' => true,
            ],
            [
                'singular' => __('Podcast Episode', $this->td),
                'plural' => __('Podcast Episodes', $this->td),
            ],
        );
    }
}
