<?php

namespace App\FrontEnd;

class ReactJS
{
    public function __construct()
    {
        add_action('template_redirect', [$this, 'disableRouting']);
        add_action('init', [$this, 'fixRefresh']);
    }

    public function disableRouting()
    {
        if(!is_admin()) {
            return \Roots\view("layouts.app");
            exit;
        }
    }

    public function fixRefresh()
    {
        add_rewrite_rule('^.*$', 'index.php', 'top');
    }
}
