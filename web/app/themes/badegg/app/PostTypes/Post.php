<?php

namespace App\PostTypes;

class Post
{
    public function __construct()
    {
        add_filter( 'register_post_post_type_args', [$this, 'rewrite'], 10, 2 );
        add_filter( 'register_post_post_type_args', [$this, 'template'], 10, 2 );
        add_filter( 'pre_post_link', [$this, 'permalink'], 10, 3);
        add_filter( 'post_type_labels_post', [$this, 'labels']);
    }

    private $paragraphPlaceholders = [
        'It was the day my grandmother exploded.',
        'All happy families are alike; each unhappy family is unhappy in its own way.',
        'I\'m pretty much fucked. That’s my considered opinion.',
        'There was a hand in the darkness, and it held a knife.',
        'It was a bright cold day in April, and the clocks were striking thirteen.',
        'Far out in the uncharted backwaters of the unfashionable end of the western spiral arm of the Galaxy lies a small unregarded yellow sun. Orbiting this at a distance of roughly ninety-two million miles is an utterly insignificant little blue green planet whose ape-descended life forms are so amazingly primitive that they still think digital watches are a pretty neat idea.',
        'There was no possibility of taking a walk that day.',
        'If you really want to hear about it, the first thing you’ll probably want to know is where I was born, and what my lousy childhood was like, and how my parents were occupied and all before they had me, and all that David Copperfield kind of crap, but I don’t feel like going into it, if you want to know the truth.',
        'Into the face of the young man who sat on the terrace of the Hotel Magnifique at Cannes there had crept a look of furtive shame, the shifty, hangdog look which announces that an Englishman is about to talk French.',
        'Many years later, as he faced the firing squad, Colonel Aureliano Buendía was to remember that distant afternoon when his father took him to discover ice.',
    ];

    public function rewrite($args, $postType)
    {
        $args['rewrite']['slug'] = $this->slug();
        $args['rewrite']['with_front'] = false;
        $args['menu_icon'] = 'dashicons-align-right';

        return $args;
    }

    public function template($args, $postType)
    {
        $args['template'] = [
            [
                'badegg/article',
                [
                    'lock' => [
                        'move' => true,
                        'remove' => true,
                    ],
                    'sidebar' => true,
                ],
                [
                    [
                        'badegg/masthead',
                        [
                            'lock' => [
                                'move' => false,
                                'remove' => false,
                            ]
                        ],
                    ],
                    [
                        'core/post-featured-image',
                        [
                            'sizeSlug' => 'medium',
                            'className' => 'rounded',
                            'lock' => [
                                'move' => true,
                                'remove' => true,
                            ]
                        ],
                    ],
                    [
                        'core/paragraph',
                        [
                            'placeholder' => $this->paragraphPlaceholders[rand(0,9)],
                        ],
                    ],
                    [
                        'badegg/excerpt',
                        [
                            'lock' => [
                                'move' => true,
                                'remove' => true,
                            ],
                        ]
                    ],

                ],
            ],
        ];

        return $args;
    }

    public function permalink($permalink, $post, $leavename)
    {
        if (get_post_type($post) == 'post')
            return $this->slug() . $permalink;
        else
            return $permalink;
    }

    public function labels($labels)
    {
        $labels->singular_name = __('Article', 'badegg');
        $labels->name = __('Articles', 'badegg');
        $labels->menu_name = __('Articles', 'badegg');

        return $labels;
    }

    public function slug()
    {
        $page_for_posts = get_option('page_for_posts');

        if(!$page_for_posts) return;

        $slug_for_posts = get_post_field('post_name', $page_for_posts);

        return $slug_for_posts;
    }
}
