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
                    'custom-fields',
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
                'dashboard_glance'    => true,
                'show_in_rest'        => true,
                'rest_base'           => 'productCategories',
                'graphql_single_name' => 'productCategory',
                'graphql_plural_name' => 'productCategories',
                'show_in_graphql'     => true,
            ],
            [
                'singular' => __('Product Category', $this->td ),
                'plural'   => __('Product Categories', $this->td ),
                'slug'     => $rewrite . '-categories',
            ],
        );

        $metaFields = [
            'cover_id'       => 'number',
            'price'          => 'string',
            'price_discount' => 'string',
            'offsite_url'    => 'string',
        ];

        foreach($metaFields as $key => $type) {
            register_post_meta( $this->postType, $this->postType . '_' . $key, [
                'show_in_rest' => true,
                'single' => true,
                'type' => $type,
                'sanitize_callback' => 'wp_kses_post',
            ]);
        }
    }
}
