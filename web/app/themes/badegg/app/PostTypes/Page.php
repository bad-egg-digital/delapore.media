<?php

namespace App\PostTypes;

class Page
{

    private $td = 'badegg';
    private $postType = 'page';

    public function __construct()
    {
        add_post_type_support( 'page', 'excerpt' );
        add_filter( 'register_page_post_type_args', [$this, 'template'], 10, 2 );
        add_action('admin_menu', [$this, 'settings_page']);
        add_action('admin_init', [$this, 'settings_fields']);
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

        public function settings_page()
    {
        add_submenu_page(
            'edit.php?post_type=page',          // parent slug
            __('Page Settings', $this->td),     // page title
            __('Settings', $this->td),          // menu title
            'edit_others_posts',                // capability
            $this->postType . '-settings',      // page slug
            function()
            {
                $page = $this->postType . '-settings';
                $section = $this->postType . '-settings-fields';
                $field = $this->td . '_' . $this->postType . '_about_id';
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
        $field = $this->td . '_' . $this->postType . '_about_id';
        $value = get_option($field);

        add_settings_section( $section, null, null, $page );

        register_setting(
            $field,
            $field,
            [
                'sanitize_callback' => 'sanitize_text_field',
            ],
        );

        add_settings_field(
            $field,
            __('About Page', $this->td),
            function( $args ) use ($field, $value)
            {
                ob_start(); ?>
                    <select<?php foreach($args as $att => $value) { echo " $att='$value'"; } ?>>
                        <option value="0">Select a page</option>
                        <?php foreach(get_posts([
                            'post_type' => 'page',
                            'post_parent' => 0,
                            'orderby' => 'name',
                            'order' => 'ASC',
                        ]) as $page): ?>
                            <option
                                <?= ($page->ID == $value) ? 'selected' : null ?>
                                value="<?= $page->ID ?>"
                            >
                                <?= $page->post_title ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                <?php echo ob_get_clean();
            },
            $page,
            $section,
            [
                'type' => 'number',
                'id' => $field,
                'name' => $field,
                'value' => $value,
            ],
        );
    }
}
