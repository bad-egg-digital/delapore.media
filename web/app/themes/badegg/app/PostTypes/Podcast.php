<?php

namespace App\PostTypes;
use BadEggCup\Tools;

class Podcast
{
    private $td = 'badegg';
    private $postType = 'podcast';
    private $taxonomy = 'podcast_category';

    public function __construct()
    {
        add_action('init', [$this, 'register']);
    }

    public function register()
    {
        $Settings = new Tools\Settings;
        $archiveID = $Settings->lookup($this->postType, 'pagesForArchives');
        $rewrite = ($archiveID) ? get_post_field( 'post_name', $archiveID ) : $this->postType;

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
                    'slug' => $rewrite,
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

        register_extended_taxonomy(
            $this->taxonomy, $this->postType,
            [
                'meta_box' => 'checkbox',
                'dashboard_glance' => true,
                'show_in_rest' => true,
                'graphql_single_name' => 'podcastCategory',
                'graphql_plural_name' => 'podcastCategories',
                'show_in_graphql' => true,
            ],
            [
                'singular' => __('Podcast Category', $this->td ),
                'plural'   => __('Podcast Categories', $this->td ),
                'slug'     => 'podcast/categories',
            ],
        );
    }
}
