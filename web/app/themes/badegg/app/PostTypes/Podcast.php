<?php

namespace App\PostTypes;
use BadEggCup\Tools;

class Podcast
{
    private $td = 'badegg';
    private $postType = 'podcast';
    private $taxonomy = 'category';

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
                'public' => true,
                'publicly_queryable' => true,
                'taxonomies' => [
                    $this->postType . '_' . $this->taxonomy,
                ],

                'show_in_rest' => true,
                'rest_base' => 'podcasts',
                'show_in_graphql' => true,
                'graphql_single_name' => 'Podcast',
                'graphql_plural_name' => 'Podcasts',
            ],
            [
                'singular' => __('Podcast Episode', $this->td),
                'plural' => __('Podcast Episodes', $this->td),
            ],
        );

        register_extended_taxonomy(
            $this->postType . '_' . $this->taxonomy, $this->postType,
            [
                'meta_box' => 'checkbox',
                'dashboard_glance' => true,
                'show_in_rest' => true,
                'graphql_single_name' => 'podcastCategory',
                'graphql_plural_name' => 'podcastCategories',
                'show_in_graphql' => true,
                'rewrite' => [
                    'with_front' => true,
                    'slug' => $rewrite . '/categories',
                ],
            ],
            [
                'singular' => __('Podcast Category', $this->td ),
                'plural'   => __('Podcast Categories', $this->td ),
            ],
        );
    }
}
