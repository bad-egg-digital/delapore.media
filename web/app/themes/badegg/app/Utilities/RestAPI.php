<?php

namespace App\Utilities;
use BadEggCup\Tools;
use ourcodeworld\NameThatColor\ColorInterpreter as NameThatColor;

class RestAPI
{
    public function __construct()
    {
        add_action( 'wp_enqueue_scripts', [$this, 'localize']);
        add_filter( 'wp_prepare_attachment_for_js', [$this, 'image_sizes'], 10, 3 );
        add_action( 'rest_api_init', [$this, 'blockConfig']);
        add_action( 'rest_api_init', [$this, 'postBlockData']);
    }

    public function localize()
    {
        $siteURL = site_url();
        $homeURL = get_home_url();

        $graphqlSettings = get_option('graphql_general_settings');

        $graphqlEndpoint = ($graphqlSettings) ? $graphqlSettings['graphql_endpoint'] : '/graphql';

        $graphqlEndpointPrefix = ltrim(str_replace($homeURL, '', $siteURL), '/');

        if($graphqlEndpointPrefix) $graphqlEndpoint = $graphqlEndpointPrefix . '/' . $graphqlEndpoint;

        $data = [
            'siteURL' => $siteURL,
            'homeURL' => $homeURL,
            'graphql' => '/' . $graphqlEndpoint,
            'rest'      => str_replace($homeURL, '', get_rest_url()),
        ];

        ?>

<script>
    const badEggAPI = <?= json_encode($data) ?>;
</script>

        <?php
    }

    public function image_sizes( $response, $attachment, $meta )
    {
        if ( empty( $response['sizes'] ) || empty( $meta['sizes'] ) ) {
            return $response;
        }

        $custom_sizes = [ 'hero', 'lazy' ];

        foreach ( $custom_sizes as $size ) {
            if ( ! empty( $meta['sizes'][ $size ] ) ) {
                $response['sizes'][ $size ] = [
                    'url'         => wp_get_attachment_image_url( $attachment->ID, $size ),
                    'width'       => $meta['sizes'][ $size ]['width'],
                    'height'      => $meta['sizes'][ $size ]['height'],
                    'orientation' =>
                        $meta['sizes'][ $size ]['height'] > $meta['sizes'][ $size ]['width']
                            ? 'portrait'
                            : 'landscape',
                ];
            }
        }

        return $response;
    }

    public function postBlockData()
    {
        $postTypes = [
            'pages',
            'posts',
        ];

        foreach($postTypes as $postType) {
            register_rest_route('wp/v2', "/{$postType}/(?P<id>\d+)/blocks", [
                'methods'  => 'GET',
                'callback' => [$this, 'getPostBlockData'],
                'permission_callback' => '__return_true',
            ]);

            register_rest_route('wp/v2', "/{$postType}/(?P<id>\d+)/blocks/(?P<index>\d+)", [
                'methods'  => 'GET',
                'callback' => [$this, 'getPostBlockData'],
                'permission_callback' => '__return_true',
            ]);
        }
    }

    public function getPostBlockData($request)
    {
        $postID = $request['id'];
        $post = get_post($postID);

        $data = [];

        if($post && $post->post_content) {
            $Blocks = new Blocks;
            $content = $post->post_content;
            $data = $Blocks->blocksMap(parse_blocks($content), $postID);
        }

        if(isset($request['index'])) {
            $index = $request['index'];

            if($index < count($data)) {
                $data = $data[$index];
            } else {
                $data = [];
            }
        }

        return rest_ensure_response($data);
    }

    public function blockConfig( )
    {
        $restBase = 'badegg/v1';

        register_rest_route($restBase, '/blocks/config', [
            'methods' => 'GET',
            'callback' => [ $this, 'config'],
            'permission_callback' => function(){
                return true;
            },
        ]);
    }

    public function config()
    {
        return rest_ensure_response([
            'container' => $this->containerWidths(),
            'colours' => $this->colours(),
            'tints' => $this->tints(),
        ]);
    }

    public function containerWidths()
    {
        return [
            [ 'label' => __('Auto', 'badegg'),          'value' => 0        ],
            [ 'label' => __('Narrow', 'badegg'),        'value' => 'narrow' ],
            [ 'label' => __('Small', 'badegg'),         'value' => 'small'  ],
            [ 'label' => __('Medium', 'badegg'),        'value' => 'medium' ],
            [ 'label' => __('Large', 'badegg'),         'value' => 'large'  ],
            [ 'label' => __('Edge to edge', 'badegg'),  'value' => 'full'   ],
        ];
    }

    public function colours()
    {
        $palette = [];

        if(class_exists('\BadEggCup\Tools\Colour')) {
            $Colour = new Tools\Colour;
            $NameThatColour = new NameThatColor;


            $colours = $Colour->values();

            foreach($colours as $slug => $hex) {
                $palette[] = [
                    'name' => esc_html__(@$NameThatColour->name($hex)['name'], 'badegg'),
                    'slug' => $slug,
                    'color' => $hex,
                ];
            }
        }

        return $palette;
    }

    public function tints()
    {
        return [
            ['label' => __('Lightest',  'badegg'), 'value' => 'lightest'],
            ['label' => __('Lighter',   'badegg'), 'value' => 'lighter' ],
            ['label' => __('Light',     'badegg'), 'value' => 'light'   ],
            ['label' => __('None',      'badegg'), 'value' => 0         ],
            ['label' => __('Dark',      'badegg'), 'value' => 'dark'    ],
            ['label' => __('Darker',    'badegg'), 'value' => 'darker'  ],
            ['label' => __('Darkest',   'badegg'), 'value' => 'darkest' ],
        ];
    }
}
