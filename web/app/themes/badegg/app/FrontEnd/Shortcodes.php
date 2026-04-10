<?php

namespace App\FrontEnd;

class Shortcodes
{
    public function __construct()
    {
        add_shortcode('button', [$this, 'button']);
        add_shortcode('br', [$this, 'br']);
    }

    public function button($atts)
    {
        $atts = shortcode_atts([
            'href' => '#',
            'text' => __('click here', 'badegg'),
            'colour' => 'tertiary',
            'class' => '',
            'size' => '',
            'target' => '',
            'rel' => '',
        ], $atts );

        $classes = [
            'btn',
            $atts['colour'],
        ];

        if($atts['class']) $classes[] = $atts['class'];
        if($atts['size']) $classes[] = $atts['size'];

        $attributes = [
            'href' => $atts['href'],
            'class' => implode(' ', $classes),
        ];

        if($atts['target']) $attributes['target'] = $atts['target'];
        if($atts['rel']) $attributes['rel'] = $atts['rel'];

        $html = '';

            ob_start(); ?>

                <p class="shortcode-btn"><a<?php foreach($attributes as $att => $value) { echo ' ' . $att . '="' . $value . '"'; } ?>><?= $atts['text'] ?></a></p>

            <?php $html = ob_get_clean();


        return $html;
    }

    public function br($atts)
    {
        return '<br/>';
    }
}
