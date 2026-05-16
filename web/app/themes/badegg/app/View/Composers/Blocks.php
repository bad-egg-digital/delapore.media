<?php

namespace App\View\Composers;

use Roots\Acorn\View\Composer;
use App\Utilities;

class Blocks extends Composer
{
    /**
     * List of views served by this composer.
     *
     * @var array
     */
    protected static $views = [
        'layouts.block-acf',
        'partials.block-*',
    ];

    /**
     * Data to be passed to view before rendering.
     *
     * @return array
     */
    public function with()
    {
        $context = [];

        if(class_exists('\BadEggCup\Tools\CssClasses')) {
            $context['CssClasses'] = new Utilities\CssClasses;
        }

        return $context;
    }
}
