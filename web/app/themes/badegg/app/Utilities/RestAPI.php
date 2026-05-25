<?php

namespace App\Utilities;

class RestAPI
{

    public function __construct()
    {
        add_filter( 'badeggcup_restapi_blocks', [ $this, 'blocks' ]);
        add_filter( 'init', [ $this, 'metaFields' ]);
    }

    public function blocks( $postTypes )
    {
        $builtin = [
            'pages',
            'posts',
        ];

        $customTypes = get_post_types([
            'show_in_rest' => true,
            '_builtin' => false,
        ], 'objects');

        $types = [];

        foreach($customTypes as $slug => $type) {
            $types[] = $type->rest_base;
        }

        $postTypes = array_merge($postTypes, $builtin, $types);

        return $postTypes;
    }

    public function metaFields(){
        $postTypes = get_post_types([
            'show_in_graphql' => true,
            'show_in_rest' => true,
        ], 'objects');

        $postTypes = array_filter( $postTypes, fn($postType) => !in_array( $postType->name, [ 'attachment' ] ));

        foreach($postTypes as $postType => $props) {

            $fields = [
                'titlePrefix' => 'string',
                'subtitle'    => 'string',
            ];

            foreach($fields as $field => $type) {
                register_graphql_field($props->graphql_single_name, $field, [
                    'type'    => $type,
                    'resolve' => fn($post) => get_post_meta($post->databaseId, $field, true) ?: null,
                ]);

                register_post_meta( $postType, $field, [
                    'show_in_rest' => true,
                    'single' => true,
                    'type' => $type,
                    'sanitize_callback' => 'wp_kses_post',
                ]);
            }
        }
    }
}
