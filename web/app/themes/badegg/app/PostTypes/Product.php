<?php

namespace App\PostTypes;
use BadEggCup\Tools;

class Product
{
    private $td = 'badegg';
    private $postType = 'product';
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
        $rewrite = ($archiveID) ? get_post_field( 'post_name', $archiveID ) : $this->postType;

        register_extended_post_type(
            $this->postType,
            [
                'menu_position' => 5,
                'supports' => [
                    'title',
                    'editor',
                    'excerpt',
                    'thumbnail',
                    'page-attributes',
                ],
                'menu_icon' => 'dashicons-cart',
                'archive' => [
                    'nopaging' => true,
                ],
                'rewrite' => [
                    'slug' => $rewrite,
                ],
                'labels' => [
                    'menu_name' => __('Shop', $this->td),
                ],
                'show_in_rest' => true,
                'public' => true,
                'publicly_queryable' => true,
                'taxonomies' => [
                    $this->postType . '_' . $this->taxonomy,
                ],

                'rest_base' => 'products',
                'show_in_graphql' => true,
                'graphql_single_name' => 'Product',
                'graphql_plural_name' => 'Products',
            ],
        );

        register_extended_taxonomy(
            $this->postType . '_' . $this->taxonomy, $this->postType,
            [
                // 'meta_box' => 'checkbox',
                'dashboard_glance' => true,
                'show_in_rest' => true,
                'graphql_single_name' => 'productCategory',
                'graphql_plural_name' => 'productCategories',
                'show_in_graphql' => true,
                'rewrite' => [
                    'with_front' => true,
                    'slug' => $rewrite . '/categories',
                ]
            ],
            [
                'singular' => __('Product Category', $this->td ),
                'plural'   => __('Product Categories', $this->td ),
            ],
        );
    }
}
