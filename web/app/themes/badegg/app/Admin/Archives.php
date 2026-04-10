<?php

namespace App\Admin;

class Archives
{
    public function __construct()
    {
        // add_action( 'pre_get_posts', [$this, 'mainQuery'], 1);
    }

    public function primaryTaxonomy($postType = null)
    {
        switch($postType):
            case 'post':
                return 'category';
            case 'project':
                return 'project_category';
            default:
                return null;
        endswitch;
    }

    public function mainQuery($query)
    {
        if(!$query->is_main_query() || is_admin()) return;

        if($query->is_home()):
            // Default Post Page
        endif;
    }
}
