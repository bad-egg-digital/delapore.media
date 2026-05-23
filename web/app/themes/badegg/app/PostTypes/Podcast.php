<?php

namespace App\PostTypes;
use BadEggCup\Tools;

class Podcast
{
    private $td = 'badegg';
    private $postType = 'podcast';
    private $taxonomy = 'category';

    public function __construct()
    {
        add_action('init', [$this, 'register']);
        add_action('admin_menu', [$this, 'settings_page']);
        add_action('admin_init', [$this, 'settings_fields']);
    }

    public function register()
    {
        $Settings = new Tools\Settings;
        $archiveID = $Settings->lookup($this->postType, 'pagesForArchives');
        $rewrite = ($archiveID) ? get_post_field( 'post_name', $archiveID ) : $this->postType;

        register_extended_post_type(
            $this->postType,
            [
                'menu_position' => 4,
                'supports' => [
                    'title',
                    'editor',
                    'excerpt',
                    'thumbnail',
                    'page-attributes',
                    'custom-fields',
                ],
                'menu_icon' => 'dashicons-controls-volumeon',
                'archive' => [
                    'nopaging' => true,
                ],
                'rewrite' => [
                    'slug' => $rewrite,
                ],
                'labels' => [
                    'menu_name' => __('Podcast', $this->td),
                    'all_items' => __('All Episodes', $this->td),
                    'add_new_item' => __('Add Episode', $this->td),
                ],
                'public' => true,
                'publicly_queryable' => true,
                'taxonomies' => [
                    $this->postType . '_' . $this->taxonomy,
                ],

                'show_in_rest' => true,
                'rest_base' => 'podcasts',
                'show_in_graphql' => true,
                'graphql_single_name' => 'Podcast',
                'graphql_plural_name' => 'Podcasts',
                'template' => $this->template(),
            ],
            [
                'singular' => __('Podcast Episode', $this->td),
                'plural' => __('Podcast Episodes', $this->td),
            ],
        );

        register_extended_taxonomy(
            $this->postType . '_' . $this->taxonomy, $this->postType,
            [
                // 'meta_box' => 'checkbox',
                'dashboard_glance' => true,
                'show_in_rest' => true,
                'rest_base' => 'podcastCategories',
                'graphql_single_name' => 'podcastCategory',
                'graphql_plural_name' => 'podcastCategories',
                'show_in_graphql' => true,
                'rewrite' => [
                    'with_front' => true,
                    'slug' => $rewrite . '/categories',
                ],
            ],
            [
                'singular' => __('Podcast Category', $this->td ),
                'plural'   => __('Podcast Categories', $this->td ),
            ],
        );

        register_post_meta( $this->postType, $this->postType . '_audio_id', [
            'show_in_rest' => true,
            'single' => true,
            'type' => 'number',
            'sanitize_callback' => 'wp_kses_post',
        ]);

        register_post_meta( $this->postType, $this->postType . '_content', [
            'show_in_rest' => true,
            'single' => true,
            'type' => 'string',
            'sanitize_callback' => 'wp_kses_post',
        ]);
    }

    public function template()
    {
        return [
            [
                'badegg/article',
                [
                    'lock' => [
                        'move' => false,
                        'remove' => false,
                    ],
                    'sidebarSwitch' => true,
                    'hideTOC' => true,
                ],
                [
                    [
                        'badegg/podcast-title',
                        [
                            'lock' => [
                                'move' => false,
                                'remove' => false,
                            ],
                            'titlePrefix' => 'Episode',
                            'attribution' => 'with Stephen E. Wall',
                        ],
                    ],
                    [
                        'badegg/excerpt',
                        [
                            'lock' => [
                                'move' => false,
                                'remove' => true,
                            ],
                        ],
                    ],
                    [
                        'core/heading',
                        [
                            'placeholder' => 'Show Notes:',
                            'lock' => [
                                'move' => false,
                                'remove' => true,
                            ],
                        ],
                    ],
                    [
                        'core/paragraph',
                        [
                            'placeholder' => 'Start typing...',
                        ],
                    ],
                ],
            ],
        ];
    }

    public function settings_page()
    {
        add_submenu_page(
            'edit.php?post_type=podcast',       // parent slug
            __('Podcast Settings', $this->td),  // page title
            __('Settings', $this->td),          // menu title
            'edit_others_posts',                // capability
            $this->postType . '-settings',      // page slug
            function()
            {
                $page = $this->postType . '-settings';
                $section = $this->postType . '-settings-fields';
                $field = $this->td . '_' . $this->postType . '_libsyn_rss_url';
                $value = get_option($field);
            ?>
                <h1><?=esc_html(get_admin_page_title()) ?></h1>

                <?php settings_errors(); ?>

                <form action="options.php" method="post">
                    <?php
                        settings_fields($field);
                        do_settings_sections($page);
                        submit_button(__('Save Changes', $this->td));
                    ?>
                </form>
            <?php
            }
        );
    }

    public function settings_fields()
    {
        $page = $this->postType . '-settings';
        $section = $this->postType . '-settings-fields';
        $field = $this->td . '_' . $this->postType . '_libsyn_rss_url';

        add_settings_section( $section, null, null, $page );

        register_setting(
            $field,
            $field,
            [
                'sanitize_callback' => function($input){
                    return esc_url_raw($input);
                },
            ],
        );

        add_settings_field(
            $field,
            __('Libsyn RSS URL', $this->td),
            function( $args ) use ($field)
            {
                ob_start(); ?>
                    <input<?php foreach($args as $att => $value) { echo " $att='$value'"; } ?> />
                <?php echo ob_get_clean();
            },
            $page,
            $section,
            [
                'type' => 'url',
                'id' => $field,
                'name' => $field,
                'value' => get_option($field),
                'placeholder' => 'https://rss.libsyn.com/shows/{XXXXXX}/destinations/{XXXXXXX}.xml',
                'style' => 'width: calc(100% - 1em)',
            ],
        );
    }
}
