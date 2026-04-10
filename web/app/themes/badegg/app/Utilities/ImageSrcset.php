<?php

namespace App\Utilities;

class ImageSrcset
{
    public function __construct()
    {
        // add_filter('wp_generate_attachment_metadata', [$this, 'generate_filenames'], 10, 2);
    }

    public function add($args = [])
    {
        $args = wp_parse_args($args, $this->default_args());
        $multipliers = $this->multipliers();

        if(is_null($args['height'])) $args['height'] = $args['width'];
        if($args['sizes'] < 5) $multipliers = array_slice($multipliers, 0, $args['sizes']);

        foreach ( $multipliers as $slug => $scale ):
            add_image_size (
                $args['name'] . '-' . $slug,
                round((int)$args['width'] * $scale),
                round((int)$args['height'] * $scale),
                $args['crop']
            );
        endforeach;
    }

    public function default_args()
    {
        return [
            'name' => 'hero',
            'width' => 1920,
            'height' => null,
            'crop' => false,
            'sizes' => 5,
        ];
    }

    public function multipliers()
    {
        return [
            'xl' => 1,
            'lg' => 0.75,
            'md' => 0.52083333,
            'sm' => 0.33333333,
            'xs' => 0.20833333,
        ];
    }

    public function render($args = [])
    {
        global $_wp_additional_image_sizes;

        $default_args = [
            'name' => 'hero',
            'image' => null,
            'lazy' => true,
            'sizes' => 5,
            'class' => null,
        ];

        $args = wp_parse_args($args, $this->default_args());
        $name = $args['name'];
        $image = ($args['image']) ? $args['image'] : get_post_thumbnail_id();

        if(!$image) return false;

        $properties = @$_wp_additional_image_sizes[$name . '-xl'];
        $width = @$properties['width'];
        $height = @$properties['height'];

        $class = $name . '-image';
        if($args['class']) $class .= ' ' . $args['class'];

        ob_start();

        $full = wp_get_attachment_image_src($image, $name . '-xl');
        $lazy = wp_get_attachment_image_src($image, 'lazy');
        $alt = get_post_meta( $image, '_wp_attachment_image_alt', true );

        $srcsets = $this->srcset([ 'image' => $image, 'name' => $name ]);
        $srcset = $this->srcset_stringify($srcsets);

        $atts = [
            'class' => $class,
            'src' => $full[0],
            'srcset' => $srcset,
            'width' => $width,
            'height' => $height,
            'alt' => $alt,
        ];

        if($args['lazy']):
            $atts['class'] .= ' lazy';
            $atts['src'] = $lazy[0];
            $atts['srcset'] = null;
            $atts['data-src'] = $full[0];
            $atts['data-srcset'] = $srcset;
        endif;

    ?>

        <img
            <?php foreach($atts as $att => $value):
                if($value) echo $att . '="' . $value . '" ';
            endforeach; ?>
        />

    <?php
        return ob_get_clean();
    }

    public function srcset($args = [])
    {
        $default_args = [
            'image' => 0,
            'name' => 'hero',
            'sizes' => 5,
        ];

        $args = wp_parse_args($args, $this->default_args());
        $sizes = $this->multipliers();
        $image = $args['image'];

        if(!$image) return false;

        $srcsets = [];

        if($args['sizes'] < 5) $sizes = array_slice($sizes, 0, $args['sizes']);

        foreach($sizes as $size => $multiplier) {
            $image_size = $args['name'] . '-' . $size;
            $file = wp_get_attachment_image_src($image, $image_size);

            $srcsets[$size] = $this->srcset_size($file[0], $file[1], $file[2]);
        }

        return $srcsets;
    }

    public function srcset_size($file, $width = 0, $height = 0)
    {
        return [
            'url' => $file,
            'width' => $width,
            'height' => $height,
        ];
    }

    public function srcset_stringify($srcsets = [])
    {
        if(empty($srcsets)) return;

        $count = count($srcsets);
        $string = '';

        $x = 1;
        foreach($srcsets as $size => $srcset) {
            $string .= $srcset['url'] . ' ' . $srcset['width'] . 'w';

            if($x < $count) $string .= ', ';

            $x++;
        }

        return $string;
    }

    public function srcset_string($image, $name = 'hero', $sizes = 5)
    {
        if(!$image) return;

        $args = [
            'image' => $image,
            'name' => $name,
            'sizes' => $sizes,
        ];

        $srcsets = $this->srcset($args);
        $string = $this->srcset_stringify($srcsets);

        return $string;
    }

    public function generate_filenames($metadata, $attachment_id) {
        $upload_dir = wp_upload_dir();
        $base_dir   = trailingslashit($upload_dir['basedir']);
        $base_path  = trailingslashit(dirname($metadata['file']));

        if (!empty($metadata['sizes'])) {

            foreach ($metadata['sizes'] as $size_name => &$size_data) {

                $old_relative_path = $base_path . $size_data['file'];
                $old_full_path     = $base_dir . $old_relative_path;

                if (!file_exists($old_full_path)) {
                    continue;
                }

                $original_name = pathinfo($metadata['file'], PATHINFO_FILENAME);
                $extension     = pathinfo($size_data['file'], PATHINFO_EXTENSION);

                // New filename: original + size name
                $new_filename = $original_name . '-' . $size_name . '.' . $extension;
                $new_full_path = $base_dir . $base_path . $new_filename;

                // Rename file
                if (rename($old_full_path, $new_full_path)) {
                    $size_data['file'] = $new_filename;
                }
            }
        }

        return $metadata;

    }
}
