<?php

namespace App\View\Composers;

use Roots\Acorn\View\Composer;
use BadEggCup\Tools;

class Socials extends Composer
{
    /**
     * List of views served by this composer.
     *
     * @var array
     */
    protected static $views = [
        'components.socials',
    ];

    /**
     * Data to be passed to view before rendering.
     *
     * @return array
     */
    public function with()
    {
        return [
            'socials' => $this->Socials(),
        ];
    }

    public function Socials()
    {
        if(class_exists('\BadEggCup\Tools\Settings') && current_theme_supports('badeggcup-companySocials')) {
            $Settings = new Tools\Settings;

            return $Settings->companySocials();
        }
    }
}
