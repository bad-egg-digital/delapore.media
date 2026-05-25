<?php

namespace App\Utilities;
use BadEggCup\Tools;
use BadEggCup\Data;
use WPGraphQL\Model\Taxonomy;
use WPGraphQL\Model\Term;

class GraphQL
{
    public $prefix = 'badEgg';

    public function __construct()
    {
        if(class_exists('WPGraphQL') && class_exists('\BadEggCup\Tools\Settings')) {
            add_filter( 'badeggcup_restapi_localize', [ $this, 'addGraphQL' ]);
            add_action( 'graphql_register_types', [$this, 'JSON']);
            add_action( 'graphql_register_types', [$this, 'archives']);
            add_action( 'graphql_register_types', [$this, 'taxonomies']);
            add_action( 'graphql_register_types', [$this, 'taxonomiesWhere']);
            add_action( 'graphql_register_types', [$this, 'blocks']);
            add_action( 'graphql_register_types', [$this, 'badeggcup']);
            add_action( 'graphql_register_types', [$this, 'podcast']);
            add_action( 'graphql_register_types', [$this, 'product']);
            add_action( 'graphql_register_types', [$this, 'autodescription']);

            add_action('admin_footer', function(){
                echo '<div style="margin-left: 200px">';

                $products = get_posts([
                    'post_type' => 'product',
                ]);

                // foreach($products as $product) {
                    // echo '<pre>',print_r(get_post_meta($product->ID)),'</pre>';
                    // echo '<pre>',print_r(get_post_type_object('post')),'</pre>';
                    echo '<pre>',print_r(get_taxonomy('category')),'</pre>';
                // }

                // echo '<pre>',print_r($postTypes),'</pre>';

                echo '</div>';
            });
        }
    }

    public function addGraphQL( $data )
    {
        $siteURL = $data['siteURL'] ?: site_url();
        $homeURL = $data['homeURL'] ?: get_home_url();

        $graphqlSettings = get_option('graphql_general_settings');
        $graphqlEndpoint = ($graphqlSettings) ? $graphqlSettings['graphql_endpoint'] : '/graphql';
        $graphqlEndpointPrefix = ltrim(str_replace($homeURL, '', $siteURL), '/');

        if($graphqlEndpointPrefix) $graphqlEndpoint = $graphqlEndpointPrefix . '/' . $graphqlEndpoint;


        $data['graphql'] = '/' . $graphqlEndpoint;

        return $data;
    }

    public function JSON()
    {
        register_graphql_scalar('JSON', [
            'description' => 'Arbitrary JSON value',
            'serialize' => fn($value) => $value,
            'parseValue' => fn($value) => $value,
            'parseLiteral' => fn($ast) => null,
        ]);
    }

    public function archives()
    {
        $Archives = new Data\Archives;
        $app_context = \WPGraphQL::get_app_context();
        $archiveIDs = $Archives->pagesForArchives();

        register_graphql_field( 'ContentType', 'pageForArchive', [
            'type'    => 'Page',
            'resolve' => function( $content_type ) use($app_context, $archiveIDs) {
                if($content_type->name == 'post') {
                    $archiveID = get_option('page_for_posts');
                } else {
                    $archiveID = @$archiveIDs[$content_type->name];
                }

                return $app_context->get_loader('post')->load_deferred($archiveID);
            },
        ]);

        register_graphql_object_type( 'PageForArchive', [
            'fields' => [
                'postType' => [
                    'type' => 'String',
                    'description' => 'The post type slug',
                ],
                'page' => [
                    'type' => 'Page',
                    'description' => 'The WP Post object for the assigned page.',
                ],
            ],
        ]);

        $pageForPosts = $app_context->get_loader('post')->load_deferred(get_option('page_for_posts'));

        $pagesForArchives = [
            [
                'postType' => 'post',
                'page' => $pageForPosts,
            ]
        ];

        foreach($archiveIDs as $postType => $pageID) {
            $pagesForArchives[] = [
                'postType' => $postType,
                'page' => ($pageID) ? $app_context->get_loader('post')->load_deferred($pageID) : null,
            ];
        }

        register_graphql_field( $this->prefix . 'Cup', 'pagesForArchives', [
            'type' => [ 'list_of' => 'PageForArchive' ],
            'description' => 'Pages assigned to post type archives.',
            'resolve' => function() use ($pagesForArchives) {
                return $pagesForArchives;
            },
        ]);
    }

     public function taxonomies()
    {
        $Archives = new Data\Archives;
        $setTaxonomies = $Archives->primaryTaxonomies();

        register_graphql_field( 'ContentType', 'primaryTaxonomy', [
            'type'    => 'Taxonomy',
            'resolve' => function( $content_type ) use($setTaxonomies) {
                if($content_type->name == 'post') {
                    $taxonomy = 'category';
                } else {
                    $taxonomy = @$setTaxonomies[$content_type->name];
                }

                return ($taxonomy) ? new Taxonomy(get_taxonomy($taxonomy)) : null;
            },
        ]);

        register_graphql_object_type( 'primaryTaxonomy', [
            'fields' => [
                'postType' => [
                    'type' => 'String',
                    'description' => 'The post type slug',
                ],
                'taxonomy' => [
                    'type' => 'Taxonomy',
                    'description' => 'The WP Taxonomy object for the assigned taxonomy.',
                ],
            ],
        ]);

        $primaryTaxonomies = [];
        foreach($setTaxonomies as $postType => $taxonomyName) {
            if($taxonomyName) {
                $primaryTaxonomies[] = [
                    'postType' => $postType,
                    'taxonomy' => ($taxonomyName) ? new Taxonomy(get_taxonomy($taxonomyName)) : null,
                ];
            }
        }

        register_graphql_field( $this->prefix . 'Cup', 'primaryTaxonomies', [
            'type' => [ 'list_of' => 'primaryTaxonomy' ],
            'description' => 'Taxonomies set as the primary for a post type.',
            'resolve' => function() use ($primaryTaxonomies) {
                return $primaryTaxonomies;
            },
        ]);

        register_graphql_field( 'Taxonomy', 'uri', [
            'type' => 'String',
            'resolve' => function( $taxonomy ) {
                $tax = get_taxonomy( $taxonomy->name );
                $rewrite = $tax->rewrite['slug'];

                return ($rewrite) ? '/' . $rewrite : null;
            }
        ]);
    }

    // https://stackoverflow.com/a/76356744/10585540
    public function taxonomiesWhere()
    {
        $postTypes = get_post_types([
            'show_in_graphql' => true,
            '_builtin' => false,
            'taxonomies' => true,
        ], 'objects');

        foreach($postTypes as $postType => $props) {
            $taxonomies = @$props->taxonomies;
            $postTypeSingular = @$props->graphql_single_name;

            foreach($taxonomies as $taxonomyName) {
                $taxonomy = get_taxonomy($taxonomyName);
                $taxonomySingular = $taxonomy->graphql_single_name;
                $taxonomySingularLabel = $taxonomy->labels->singular_name;

                register_graphql_field(
                    'RootQueryTo' . ucfirst($postTypeSingular) . 'ConnectionWhereArgs',
                    $taxonomySingular . 'Name',
                    [
                        'type' => [ 'list_of' => 'String' ],
                        'description' => __('Filter by post objects that have the specific ' . $taxonomySingularLabel, 'badegg'),
                    ],
                );
            }
        }
    }

    public function blocks()
    {
        register_graphql_object_type('Block', [
            'description' => 'Gutenberg block node',
            'fields' => [
                'index'         => [ 'type' => 'Number' ],
                'name'          => [ 'type' => 'String' ],
                'attributes'    => [ 'type' => 'JSON'   ],
                'content'       => [ 'type' => 'string' ],
                'rawContent'    => [ 'type' => 'string' ],
                'innerBlocks'   => [ 'type' => ['list_of' => 'Block'] ],
            ],
        ]);

        $postTypes = get_post_types([
            'show_in_graphql' => true,
            'show_in_rest' => true,
        ], 'objects');

        $postTypes = array_filter( $postTypes, fn($postType) => !in_array( $postType->name, [ 'attachment' ] ));

        $resolver = function ($post){
            $Blocks = new Data\Blocks;
            $content = $post->contentRaw ?? get_post_field('post_content', $post->databaseId);

            if (!$content)  return [];

            $parsed = parse_blocks($content);

            return $Blocks->blocksMap($parsed);
        };

        foreach($postTypes as $postType => $props) {
            register_graphql_field($props->graphql_single_name, 'blocks', [
                'type'    => ['list_of' => 'Block'],
                'resolve' => $resolver,
            ]);
        }
    }

    public function badeggcup()
    {
        $Settings = new Tools\Settings;

        register_graphql_object_type( $this->prefix . 'Address', [
            'fields' => [
                'line1'    => [ 'type' => 'string' ],
                'line2'    => [ 'type' => 'string' ],
                'line3'    => [ 'type' => 'string' ],
                'line4'    => [ 'type' => 'string' ],
                'city'     => [ 'type' => 'string' ],
                'county'   => [ 'type' => 'string' ],
                'postCode' => [ 'type' => 'string' ],
                'country'  => [ 'type' => 'string' ],
            ],
        ]);

        register_graphql_object_type( $this->prefix . 'SocialItem', [
            'fields' => [
                'icon' => [ 'type' => 'string' ],
                'link' => [ 'type' => 'string' ],
                'svg' => [ 'type' => 'string' ],
            ],
        ]);

        register_graphql_object_type( $this->prefix . 'Company', [
            'fields' => $this->companyFields(),
        ]);

        $fields = [];

        if(current_theme_supports('badeggcup-colours')) {
            $fields['colours'] = [
                'type' => ['list_of' => 'String'],
                'resolve' => fn() => $Settings->lookup('colours'),
            ];
        }

        if(current_theme_supports('badeggcup-company')) {
            $fields['company'] = [
                'type' => $this->prefix . 'Company',
                'resolve' => fn() => $Settings->lookup('company'),
            ];
        }

        if(current_theme_supports('badeggcup-companySocials')) {
            $fields['socials'] = [
                'type' => ['list_of' => $this->prefix . 'SocialItem'],
                'resolve' => fn() => $Settings->lookup('socials', 'company'),
            ];
        }

        register_graphql_object_type( $this->prefix . 'Cup', ['fields' => $fields]);

        register_graphql_field('RootQuery', $this->prefix . 'Cup', [
            'type' => $this->prefix . 'Cup',
            'resolve' => fn() => true,
        ]);
    }

    public function companyFields()
    {
        $companyFields = [
            'name' => [ 'type' => 'string' ],
            'nameLegal' => [ 'type' => 'string' ],
            'number' => [ 'type' => 'string' ],
            'tel' => [ 'type' => 'string' ],
            'email' => [ 'type' => 'string' ],
        ];

        if(current_theme_supports('badeggcup-companyAddress')) {
            $companyFields['address'] = [ 'type' => $this->prefix . 'Address'];
        }

        if(current_theme_supports('badeggcup-companyAddressMailing')) {
            $companyFields['addressMailing'] = [ 'type' => $this->prefix . 'Address'];
        }

        if(current_theme_supports('badeggcup-companySocials')) {
            $companyFields['socials'] = [ 'type' => [ 'list_of' => $this->prefix . 'SocialItem'] ];
        }

        return $companyFields;
    }

    public function podcast()
    {
        register_graphql_field( 'Podcast', 'episodeContent', [
            'type' => 'String',
            'description' => __('Imported content from RSS feed', 'badegg'),
            'resolve' => function( $post ) {
                return get_post_meta( $post->databaseId, 'podcast_content', true );
            }
        ]);

        register_graphql_field( 'Podcast', 'episodeAudio', [
            'type' => 'JSON',
            'description' => __('Audio attachment', 'badegg'),
            'resolve' => function( $post ) {
                $audioID = get_post_meta( $post->databaseId, 'podcast_audio_id', true );

                if(!$audioID) return null;

                $audioMetadata = wp_get_attachment_metadata($audioID);
                $audioURL = wp_make_link_relative(wp_get_attachment_url( $audioID ));
                $audioMetadata['uri'] = $audioURL ?: null;

                return $audioMetadata;

            }
        ]);
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
    }

    public function autodescription()
    {
        $postTypes = get_post_types([
            'show_in_graphql' => true,
            'taxonomies' => true,
        ], 'objects');

        foreach($postTypes as $postType => $props) {
            $taxonomies = @$props->taxonomies;
            $postTypeSingular = @$props->graphql_single_name;

            foreach($taxonomies as $taxonomyName) {
                $taxonomy = get_taxonomy($taxonomyName);
                $taxonomySingular = @$taxonomy->graphql_single_name ?: $taxonomyName;
                $taxonomySingularLabel = @$taxonomy->labels->singular_name ?: ucfirst($taxonomyName);

                register_graphql_field($props->graphql_single_name, $taxonomySingular . 'PrimaryTerm', [
                    'type'    => 'TermNode',
                    'resolve' => function( $content_type ) use($taxonomyName) {
                        $primaryTermID = get_post_meta($content_type->databaseId, '_primary_term_' . $taxonomyName, true);
                        $primaryTerm = ($primaryTermID) ? get_term($primaryTermID) : null;

                        if($primaryTerm) {
                            return new Term($primaryTerm);
                        } else {
                            $postTerms = wp_get_post_terms($content_type->databaseId, $taxonomyName);

                            if($postTerms && count($postTerms) > 0) {
                                return new Term($postTerms[0]);
                            }
                        }

                        return null;
                    },
                ]);
            }
        }
    }
}
