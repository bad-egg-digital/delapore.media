<?php

namespace App\PostTypes;

class Page
{
    public function __construct()
    {
        add_post_type_support( 'page', 'excerpt' );
    }
}
