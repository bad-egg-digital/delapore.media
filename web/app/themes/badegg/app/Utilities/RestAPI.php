<?php

namespace App\Utilities;
use BadEggCup\Tools;
use ourcodeworld\NameThatColor\ColorInterpreter as NameThatColor;

class RestAPI
{
    public function __construct()
    {
        add_filter( 'wp_prepare_attachment_for_js', [$this, 'image_sizes'], 10, 3 );
        add_action( 'rest_api_init', [$this, 'blocks']);
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

    public function blocks( )
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
