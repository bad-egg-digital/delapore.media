<?php

namespace App\FrontEnd;

class EntryMeta
{
    public function __construct()
    {
        // add_shortcode('butt on', [$this, 'button']);
    }

    public function get_firstTerm($postID, $tax = '')
    {
        if(!$postID || !$tax) return false;

        $terms = wp_get_post_terms($postID, $tax);

        if($terms && is_array($terms)) {
            return $terms[0];
        } else {
            return false;
        }
    }
}
