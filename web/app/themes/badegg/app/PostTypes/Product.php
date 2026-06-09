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
        add_filter( 'graphql_post_object_connection_query_args', [$this, 'graphqlTaxQuery'], 10, 5);
        add_action( 'graphql_register_types', [$this, 'product']);
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
                'template' => $this->template(),
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
            'context_id'     => 'number',
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

        register_post_meta( $this->postType, '_primary_term_product_category', [
            'show_in_rest' => true,
            'single' => true,
            'type' => 'number',
            'sanitize_callback' => 'wp_kses_post',
        ]);
    }

    public function template()
    {
        $Post = new Post;

        return [
            [
                'badegg/article',
                [
                    'lock' => [
                        'move' => false,
                        'remove' => false,
                    ],
                    'sidebarSwitch' => true,
                    'sidebarSwitch' => true,
                ],
                [
                    [
                        'badegg/masthead',
                        [
                            'lock' => [
                                'move' => false,
                                'remove' => false,
                            ]
                        ],
                    ],
                    [
                        'core/separator',
                        [
                            'className' => 'is-style-wide',
                        ]
                    ],
                    [
                        'badegg/excerpt',
                        [
                            'lock' => [
                                'move' => false,
                                'remove' => true,
                            ],
                        ],
                    ],
                    [
                        'core/paragraph',
                        [
                            'placeholder' => $Post->paragraphPlaceholders[rand(0,9)],
                        ],
                    ],
                ],
            ],
            [
                'badegg/podcast-cta',
            ],
        ];
    }

    public function graphqlTaxQuery( $query_args, $source, $args, $context, $info ) {

        $taxQuery = [];
        $where = @$args['where'] ?: [];
        $key = 'productCategoryName';

        if(!isset($where[$key])) return $query_args;

        $taxQuery[] = [
            'taxonomy' => 'product_category',
            'field' => 'slug',
            'terms' => (array) $where[$key],
        ];

        if(!empty($taxQuery)) {
            $query_args['tax_query'] = $taxQuery;
        }

        return $query_args;
    }

    public function product()
    {
        $fields = [
            'CoverID'        => [ 'meta' => 'cover_id',       'type' => 'Number'   ],
            'Price'          => [ 'meta' => 'price',          'type' => 'String'   ],
            'PriceDiscount'  => [ 'meta' => 'price_discount', 'type' => 'String'   ],
            'OffsiteURL'     => [ 'meta' => 'offsite_url',    'type' => 'String'   ],
        ];

        foreach($fields as $field => $props) {
            register_graphql_field( 'Product', 'product' . $field, [
                'type' => $props['type'],
                'resolve' => fn( $post ) => get_post_meta( $post->databaseId, 'product_' . $props['meta'], true ) ?: null,
            ]);
        }

        $imageFields = [
            'CoverImage'   => [ 'meta' => 'cover_id',   'type' => 'JSON' ],
            'ContextImage' => [ 'meta' => 'context_id', 'type' => 'JSON' ],
        ];

        foreach($imageFields as $field => $props) {
            register_graphql_field( 'Product', 'product' . $field, [
                'type' => $props['type'],
                'resolve' => function( $content_type ) use ($props) {
                    $imageID = get_post_meta($content_type->databaseId, 'product_' . $props['meta'], true);

                    if($imageID) {
                        $image = wp_get_attachment_image_src($imageID, 'full');

                        return [
                            'alt' => get_post_meta($imageID, '_wp_attachment_image_alt', true),
                            'title' => get_post_field('post_title', $imageID),
                            'srcSet' => wp_get_attachment_image_srcset($imageID, 'full'),
                            'src' => wp_get_attachment_image_src($imageID, 'medium')[0],
                            'width' => $image[1],
                            'height' => $image[2],
                        ];

                    } else {
                        return null;
                    }
                },
            ]);
        }
    }
}
