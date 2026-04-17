<?php

namespace App\Utilities;

class Blocks
{
    public $prefix = 'badEgg';

    public function __construct()
    {

    }

    public function blocksMap($blocks = [], $postID = null) {
        $data = [];

        if($blocks && is_array($blocks)) {
            foreach ($blocks as $block) {
                $name = $block['blockName'];

                if(!$name) continue;

                $inner = [];


                if (!empty($block['innerBlocks']) && is_array($block['innerBlocks'])) {
                    $inner = $this->blocksMap($block['innerBlocks'], $postID);
                }

                $props = [
                    'name'        => $name,
                    'attributes'  => $block['attrs'] ?? [],
                    'content'     => trim($this->unwrapBlock($block['innerHTML'])),
                    'rawContent'  => trim($block['innerHTML']),
                    'innerBlocks' => $inner,
                ];

                if($name == 'core/post-featured-image') {
                    $feat = get_post_thumbnail_id($postID);

                    if($feat) {
                        $metadata = wp_get_attachment_metadata($feat);
                        $size = @$block['attrs']['sizeSlug'];

                        $img = wp_get_attachment_image_src($feat, $size);

                        $imgAttributes =  [
                            'alt'           => get_post_meta( $feat, '_wp_attachment_image_alt', true ),
                            'title'         => get_post_field( 'post_title',   $feat ),
                            'className'     => 'wp-image-' . $feat,
                            'src'           => $img[0],
                            'width'         => $img[1],
                            'height'        => $img[2],
                        ];

                        $props['attributes']['thumbnail'] = [
                            'attributes'    => $imgAttributes,
                            'caption'       => get_post_field( 'post_excerpt', $feat ),
                            'description'   => get_post_field( 'post_content', $feat ),
                            'sizes'         => $metadata['sizes'],
                        ];
                    }
                }

                $data[] =  $props;
            }
        }

        return $data;
    }

    public function unwrapBlock($html) {
        $html = trim($html);

        // Matches a single outer HTML tag wrapper
        if (preg_match('#^<([a-z0-9]+)([^>]*)>(.*)</\1>$#is', $html, $m)) {
            return $m[3];
        }

        return $html;
    }
}
