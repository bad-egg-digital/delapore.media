<?php

namespace App\Utilities;

class RestAPI
{

    public function __construct()
    {
        add_filter( 'badeggcup_restapi_blocks', [ $this, 'blocks' ]);
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

}
