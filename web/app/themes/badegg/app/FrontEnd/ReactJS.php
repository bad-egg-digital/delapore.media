<?php

namespace App\FrontEnd;

class ReactJS
{
    public function __construct()
    {
        // add_action('template_redirect', [$this, 'disableRouting']);
        // add_action('rest_api_init', [$this, 'init']);
    }

    public function disableRouting()
    {
        if(is_admin()) {
            return;
        }

        return \Roots\view("layouts.app");
        exit;
    }

    public function init() {
        add_filter('rest_post_dispatch', function ($response) {
            $response->header('Cache-Control', 'public, max-age=300');
            return $response;
        });
    }
}
