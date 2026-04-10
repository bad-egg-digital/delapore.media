<?php

namespace App\PostTypes;

class Post
{
    public function __construct()
    {
        add_filter( 'register_post_post_type_args', [$this, 'rewrite'], 10, 2 );
        add_filter( 'pre_post_link', [$this, 'permalink'], 10, 3);
        add_filter( 'post_type_labels_post', [$this, 'labels']);
    }

    public function rewrite($args, $postType)
    {
        $args['rewrite']['slug'] = $this->slug();
        $args['rewrite']['with_front'] = false;

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
        $postsPageID = get_option('page_for_posts');
        $postsPage = ($postsPageID) ? get_post($postsPageID) : null;

        if ( $postsPage ) {
            $labels->singular_name = $postsPage->post_title . ' ' . $labels->singular_name;
            $labels->name = $postsPage->post_title . ' ' . $labels->name;
            $labels->menu_name = $postsPage->post_title;
        }

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
