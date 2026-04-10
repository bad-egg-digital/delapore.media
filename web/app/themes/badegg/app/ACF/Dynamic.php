<?php

namespace App\ACF;
use ourcodeworld\NameThatColor\ColorInterpreter as NameThatColor;
use BadEggCup\Tools;

class Dynamic
{
    public function __construct()
    {
        if (class_exists('ACF')) {
            add_filter('acf/load_field/name=colour',                [ $this, 'load_colours' ]);
            add_filter('acf/load_field/name=bg_colour',             [ $this, 'load_colours' ]);
            add_filter('acf/load_field/name=tint',                  [ $this, 'load_tints' ]);
            add_filter('acf/load_field/name=bg_tint',               [ $this, 'load_tints' ]);
            add_filter('acf/load_field/name=container_width',       [ $this, 'container_width' ]);
            add_action('acf/input/admin_footer',                    [ $this, 'htmlSelectOption' ]);
        }
    }

    public function load_colours( $field )
    {
        $Colour = new Tools\Colour;
        $NameThatColour = new NameThatColor;

        $colours = $Colour->values();

        $field['choices'] = [
            '0' => __('None', 'badegg'),
        ];

        foreach($colours as $slug => $hex):
            $field['choices'][$slug] = '<i class="fas fa-circle" style="color: '. $hex .'"></i> ' . @$NameThatColour->name($hex)['name'];
        endforeach;

        return $field;

    }

    public function load_tints( $field )
    {
        $Colour = new Tools\Colour;
        $tints = $Colour->tints();

        $field['choices'] = [];

        foreach($tints as $slug => $hex):
            if($slug):
                $field['choices'][$slug] = ucfirst($slug);

            else:
                $field['choices'][0] =  __('None', 'badegg');
            endif;
        endforeach;

        return $field;
    }

    public function container_width( $field )
    {
        $field['choices'] = [
            0 => 'Auto',
            'narrow' => __('Narrow', 'badegg'),
            'small'  => __('Small', 'badegg'),
            'medium' => __('Medium', 'badegg'),
            'large'  => __('Large', 'badegg'),
            'full'   => __('Edge to edge', 'badegg'),
        ];

        return $field;
    }

    public function htmlSelectOption()
    { ?>

        <script type="text/javascript">
            <?php if(WP_ENV == 'development'): ?>
            console.log("Script loaded from sage/app/ACF/Dynamic.php");
            <?php endif; ?>

            (function($) {

                function my_custom_escaping_method( original_value){
                    return original_value;
                }

                acf.add_filter('select2_escape_markup', function( escaped_value, original_value, $select, settings, field, instance ){
                    console.log(field.data('name'));

                    const whitelist = [
                        'colour',
                        'bg_colour',
                    ];

                    // do something to the original_value to override the default escaping, then return it.
                    // this value should still have some kind of escaping for security, but you may wish to allow specific HTML.
                    if (whitelist.includes(field.data( 'name' ))) {
                        return my_custom_escaping_method( original_value );
                    }

                    // return
                    return escaped_value;
                });

            })(jQuery);

        </script>

    <?php }
}

