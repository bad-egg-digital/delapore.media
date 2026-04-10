<?php

namespace App\View\Composers;

use Roots\Acorn\View\Composer;

class Index extends Composer
{
    /**
     * List of views served by this composer.
     *
     * @var array
     */
    protected static $views = [
        'index',
    ];

    /**
     * Retrieve the site name.
     */
    public function siteName(): string
    {
        return get_bloginfo('name', 'display');
    }

    public function with()
    {
        $postType = $this->get_archivePostType();

        $postTypeSlug = $postType->name;
        $pageForPosts = ($postTypeSlug == 'post') ? get_option('page_for_posts') : get_option('page_for_' . $postTypeSlug);

        return [
            'postType' => $postType,
            'page_for_posts' => $pageForPosts,
            'post' => get_post($pageForPosts),
        ];
    }

    public function get_archivePostType()
    {
        $structure = [
            'name' => '',
            'singular' => '',
            'plural' => '',
        ];

        $postType = null;

        if(is_home()) {
            $postType = get_post_type_object('post');
        } else {
            $postType = get_queried_object();
        }

        if(is_object($postType)) {
            return $postType;
        } else {
            return false;
        }
    }
}
