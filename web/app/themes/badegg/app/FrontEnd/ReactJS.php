<?php

namespace App\FrontEnd;

class ReactJS
{
    public function __construct()
    {
        add_action('wp_enqueue_scripts', [$this, 'localize']);
        add_action('graphql_register_types', [$this, 'addGraphqlTypes']);
        // add_action('template_redirect', [$this, 'disableRouting']);
        // add_action('rest_api_init', [$this, 'init']);
    }

    public function localize()
    {
        $siteURL = site_url();
        $homeURL = get_home_url();

        $graphqlSettings = get_option('graphql_general_settings');

        $graphqlEndpoint = ($graphqlSettings) ? $graphqlSettings['graphql_endpoint'] : '/graphql';

        $graphqlEndpointPrefix = ltrim(str_replace($homeURL, '', $siteURL), '/');

        if($graphqlEndpointPrefix) $graphqlEndpoint = $graphqlEndpointPrefix . '/' . $graphqlEndpoint;

        $data = [
            'siteURL' => $siteURL,
            'homeURL' => $homeURL,
            'graphql' => '/' . $graphqlEndpoint,
        ];

        ?>

<script>
    const badEggAPI = <?= json_encode($data) ?>;
</script>

        <?php
    }

    public function addGraphqlTypes()
    {

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
