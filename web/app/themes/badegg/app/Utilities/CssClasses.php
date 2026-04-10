<?php

namespace App\Utilities;

class CssClasses {
    public function section($props = [], $name = 'unnamed', $knockout = false)
    {
        $defaults = [
            'padding_top' => null,
            'padding_bottom' => null,
            'bg_colour' => null,
            'bg_tint' => null,
            'contrast' => null,
            'bg_image' => null,
            'section_size' => 2,
        ];

        $props = wp_parse_args($props, $defaults);

        $section_sizes = [
            1 => 'small',
            2 => 'medium',
            3 => 'large',
        ];

        $classes = [
            'section-' . $section_sizes[$props['section_size']],
            'section-' . str_replace('/', '-', $name),
        ];

        if($props['bg_colour'])
            $classes[] = 'bg-' . $this->colourTint([
                'colour' => $props['bg_colour'],
                'tint' => $props['bg_tint'],
            ]);

        if(($props['contrast'] && $knockout))
            $classes[] = 'knockout';

        if(!$props['padding_top'])
            $classes[] = 'section-zero-top';

        if(!$props['padding_bottom'])
            $classes[] = 'section-zero-bottom';

        if($props['bg_image'])
            $classes[] = "has-bg-image";

        if($props['bg_image'])
            $classes[] = 'has-bg-image';

        return $classes;
    }

    public function container($args = [], $bg_props = [])
    {
        $args = wp_parse_args($args, [
            'width' => null,
            'location' => null,
            'section' => false,
            'align' => null,
            'wysiwyg' => false,
        ]);

        $bg_props = wp_parse_args($bg_props, [
            'bg_colour' => null,
            'bg_tint' => null,
            'contrast' => null,
        ]);

        $classes = [
            'container',
        ];

        if($args['width'])
            $classes[] = 'container-' . $args['width'];

        if($args['location'])
            $classes[] = $args['location'];

        if($args['section'])
            $classes[] = 'section';

        if(str_contains($args['location'], 'intro'))
            $classes[] = 'section-zero-top';

        if(str_contains($args['location'], 'footer'))
            $classes[] = 'section-zero-bottom';

        if($args['wysiwyg'])
            $classes[] = 'wysiwyg';

        if($args['align'])
            $classes[] = 'align-' . $args['align'];

        if(($bg_props['contrast']))
            $classes[] = 'knockout';

        return $classes;
    }

    public function button($args = [])
    {
        $default_args = [
            'colour' => null,
            'style' => null,
        ];

        $args = wp_parse_args($args, $default_args);

        $classes = [
            'button',
        ];

        if($args['colour']) $classes[] = $args['colour'];
        if($args['style']) $classes[] = $args['style'];

        return $classes;
    }

    public function colourTint($props = [])
    {
        if(@$props['colour']):
            $colour = $props['colour'];

            if($props['colour'] != 'black' && @$props['tint']):
                $colour .= '-' . $props['tint'];
            endif;
        else:
            $colour = 'white';
        endif;

        return $colour;
    }

    public function is_knockout_block($name = null)
    {
        $blacklist = [
            'badegg/acfdemo',
        ];

        if(in_array($name, $blacklist)):
            return false;
        else:
            return true;
        endif;
    }

    public function backgroundAtts($props = [])
    {
        $default_props = [
            'bg_image' => false,
            'bg_filter' => false,
            'bg_fit' => false,
            'bg_focal' => 0,
            'bg_opacity' => 50,
            'bg_fixed' => false,
            'bg_lazy' => true,
            'bg_width' => 100,
            'contrast' => false,
        ];

        $props = wp_parse_args($props, $default_props);

        $leftFocals = [ 'left-top', 'left-bottom', 'left'];
        $centerFocals = [ 'center', 'top', 'bottom'];
        $rightFocals = [ 'right-top', 'right', 'right-bottom'];

        $lazy = @wp_get_attachment_image_src($props['bg_image'], 'lazy');
        $hero = @wp_get_attachment_image_src($props['bg_image'], 'hero');
        $small = @wp_get_attachment_image_src($props['bg_image'], 'hero-sm');

        $atts = [
            'class' => 'bg-image bg-srcset',
            'style' => 'background-image: url(\''. $small[0] .'\');',
            'data-id' => $props['bg_image'],
            'data-name' => 'hero',
            'data-width' => $hero[1],
            'data-height' => $hero[2],
        ];

        if($props['bg_filter']) {
            $filter = ' bg-filter';

            if($props['contrast']) {
                $filter .= '-multiply';
            } else {
                $filter .= '-screen';
            }

            $atts['class'] .= $filter;
        }

        if($props['bg_fit'])
            $atts['class'] .= ' bg-contain';

        if($props['bg_fixed'])
            $atts['class'] .= ' bg-fixed';

        if($props['bg_lazy'] && !is_admin()) {
            $atts['class'] .= ' lazy';
            $atts['style'] = 'background-image: url(\''. $lazy[0] .'\');';
        }

        if($props['bg_opacity'])
            $atts['style'] .= " opacity: " . $props['bg_opacity'] * 0.01 . ";";

        if((int)$props['bg_width'] < 100)
            $atts['style'] .= " width: " . $props['bg_width'] . "%;";

        if($props['bg_focal'])
            $atts['style'] .= " background-position: " . str_replace('-', ' ', $props['bg_focal']) . ";";

        if($props['bg_focal'] && (int)$props['bg_width'] < 100) {
            if(in_array($props['bg_focal'], $centerFocals)) {
                $atts['style'] .= " left: auto; right: calc(50% - " . (int)$props['bg_width'] * 0.5 . "%);";

            } elseif(in_array($props['bg_focal'], $leftFocals)) {
                $atts['style'] .= " right: auto;";

            } elseif(in_array($props['bg_focal'], $rightFocals)) {
                $atts['style'] .= " left: auto;";
            }
        }

        return $atts;
    }

    public function ColourTintClass($colour = null, $tint = null)
    {
        $class = '';

        if($colour) {
            $class = $colour;

            if($tint && !in_array($tint, ['0', 0, 'white', 'black']))
                $class .= '-' . $tint;
        }

        return $class;
    }
}
