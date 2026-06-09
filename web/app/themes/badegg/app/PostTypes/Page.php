<?php

namespace App\PostTypes;

class Page
{
    public function __construct()
    {
        add_post_type_support( 'page', 'excerpt' );
        add_filter( 'register_page_post_type_args', [$this, 'template'], 10, 2 );
    }

    public function template($args, $postType)
    {
        $Post = new Post;

        $args['template'] = [
            [
                'badegg/title',
            ],
            [
                'badegg/article',
                [
                    'hideSidebar' => true,
                    'container_width' => 'small',
                    'lock' => [
                        'move' => false,
                    ],
                ],
                [
                    [
                        'core/separator',
                        [
                            'className' => 'is-style-wide',
                        ]
                    ],
                    [
                        'core/paragraph',
                        [
                            'placeholder' => $Post->paragraphPlaceholders[rand(0,9)],
                            'lock' => [
                                'move' => true,
                                'remove' => true,
                            ]
                        ],
                    ],
                ],
            ],
            [
                'badegg/podcast-cta',
            ],
        ];

        return $args;
    }
}
