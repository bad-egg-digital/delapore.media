<?php

/**
 * Theme Blocks.
 */

namespace App\Blocks;

/**
 * Disable block styles in frontend
 */
add_filter( 'should_load_separate_core_block_assets', '__return_false', 99 );
add_filter( 'wp_img_tag_add_auto_sizes', '__return_false' );
add_action( 'init', __NAMESPACE__ . '\\remove_action_block_inline' );
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\disable_frontend_inline_css', 20 );
add_action( 'template_redirect', __NAMESPACE__ . '\\delete_block_support_inline_css' );

/**
 * block editor back end tweaks
 *  - Disable all core blocks except what we need as inner blocks
 *  - resources/js/editor.js handles hiding the inner blocks at the top level
 */
add_action( 'allowed_block_types_all', __NAMESPACE__ . '\\list_allowed', 100, 2 );
add_action( 'admin_init', __NAMESPACE__ . '\\admin_block_cleanup' );
add_filter( 'block_type_metadata', __NAMESPACE__ . '\\unset_core_supports' );

/**
 * Custom blocks
 */
add_filter( 'block_categories_all' , __NAMESPACE__ . '\\add_categories' );
add_filter( 'badegg_block_types_allow', __NAMESPACE__ . '\\allowed_list' );
add_action( 'init', __NAMESPACE__ . '\\auto_register' );

/**
 * Core Blocks
 */
add_filter( 'render_block_core/details', __NAMESPACE__ . '\\core_details_modified', 10, 2 );
add_filter( 'render_block_core/image', __NAMESPACE__ . '\\core_image_modified', 10, 2 );


function remove_action_block_inline()
{
    remove_action( 'wp_enqueue_scripts', 'wp_enqueue_global_styles' );
    remove_action( 'wp_enqueue_scripts', 'wp_enqueue_block_support_styles');
    remove_action( 'wp_footer', 'wp_enqueue_global_styles', 1 );
    remove_action( 'wp_body_open', 'wp_global_styles_render_svg_filters' );
}

function admin_block_cleanup()
{
    remove_action( 'enqueue_block_editor_assets', 'wp_enqueue_editor_block_directory_assets' );
}

function disable_frontend_inline_css()
{
    wp_dequeue_style( 'wp-block-library' );
    wp_dequeue_style( 'wp-block-library-theme' );
    wp_dequeue_style( 'classic-theme-styles' );
}

function delete_block_support_inline_css ()
{
	ob_start( function ( $html ) {
		return preg_replace(
			'#<style id=[\'"]core-block-supports-inline-css[\'"][^>]*>.*?</style>#s',
			'',
			$html
		);
	} );
}

function unset_core_supports($metadata){
    $name = $metadata['name'];

    if (str_starts_with($name, 'core/') ) {
        unset($metadata['supports']['color']);
        unset($metadata['supports']['typography']);
        unset($metadata['supports']['border']);
    }

    return $metadata;
}


function allowed_list($allowed){
    return array_merge($allowed, [
        // 'core/categories',
    ]);
}

function add_categories( $categories ) {

        // Adding a new category.
        $categories = array_merge([
            [
                'slug'  => 'badegg',
                'title' => __('Provided by Bad Egg Digital'),
            ],
            [
                'slug' => 'badegg-projects',
                'title' => __('Project Blocks'),
            ],
        ], $categories);

        return $categories;
}

function auto_register() {
    $blocks = glob(get_theme_file_path('resources/views/blocks/*/block.json'));

    foreach ($blocks as $block_json) {
        $json = json_decode(file_get_contents($block_json));

        if(!class_exists('ACF') && property_exists($json, 'acf')) continue;

        if(@$json->disabled) continue;

        $slug = basename(dirname($block_json));
        $blockPath = "resources/views/blocks/{$slug}";

        $viewScript = "{$blockPath}/view.js";
        $script = "{$blockPath}/script.js";
        $editorCSS = "{$blockPath}/editor.scss";
        $style = "{$blockPath}/style.scss";

        // editorStyle
        if (file_exists(get_theme_file_path($editorCSS))) {
            wp_register_style(
                "{$slug}-editor-style",
                \Vite::asset($editorCSS),
                [],
                null
            );
        }

        // script
        if(file_exists(get_theme_file_path($script))) {
            wp_register_script(
                "{$slug}-script",
                \Vite::asset($script),
                [],
                null,
                true
            );
        }

        // style
        if (file_exists(get_theme_file_path($style))) {
            wp_register_style(
                "{$slug}-style",
                \Vite::asset($style),
                [],
                null
            );
        }

        // viewScript
        if(file_exists(get_theme_file_path($viewScript))) {
            wp_register_script(
                "{$slug}-view-script",
                \Vite::asset($viewScript),
                [],
                null,
                true
            );
        }

        $props = [
            'editor_style'      => "{$slug}-editor-style",
            'style'             => "{$slug}-style",
            'script'            => "{$slug}-script",
            'view_script'       => "{$slug}-view-script",
        ];

        if(!property_exists($json, 'acf') && \Roots\view()->exists("blocks.{$slug}.render")) {
            $props['render_callback']   = function ($attributes, $content, $block) {
                $slug = basename($block->name);

                return \Roots\view("blocks.{$slug}.render", [
                    'attributes' => $attributes,
                    'content' => $content,
                    'block' => $block,
                ]);
            };
        }

        if(!property_exists($json, 'acf')) {
            $props['attributes'] = attributes((array)@$json->attributes);
        }

        register_block_type($block_json, $props);
    }
}

function list_inner()
{
    $file = file_get_contents(get_theme_file_path("resources/json/block-core-whitelist.json"));
    $json = json_decode($file);

    return $json;
}

function attributes($atts = [])
{
    $file = file_get_contents(get_theme_file_path("resources/json/block-attributes.json"));
    $json = json_decode($file, true);

    $atts = wp_parse_args($atts, $json);

    return $atts;
}

function list_all()
{
    $blocks = array_map(function($block) {
        $name = $block->name;

        return $block->name;

    }, \WP_Block_Type_Registry::get_instance()->get_all_registered());

    return array_values($blocks);
}

function list_custom()
{
    return array_filter(list_all(), function($value){
        if (str_starts_with($value, 'acf/') || str_starts_with($value, 'badegg/')) return $value;
    });
}

function list_allowed()
{
    $add_allowed = [];

    return array_merge(
        list_custom(),
        list_inner(),
        apply_filters('badegg_block_types_allow', $add_allowed),
    );
}

function render_acf($block, $content = '', $is_preview = false, $post_id = 0, $wp_block = false, $context = false) {
    $slug = basename($block['name']);
    $block['slug'] = $slug;

    $blade = \Roots\view(
        "blocks.{$slug}.render",
        [
            'block' => $block,
            'content' => $content,
            'is_preview' => $is_preview,
            'post_id' => $post_id,
            'wp_block' => $wp_block,
            'context' => $context,
        ],
    );

    if($blade) {
        echo $blade;
    } else {
        ob_start(); ?>

        <section class="section bg-error knockout">
            <div class="container container-small align-centre wysiwyg">
                <h2>Missing Blade Template</h2>
                <p>(resources/views/blocks/<?= $slug ?>/render.blade.php)</p>
            </div>
        </section>

        <?php echo ob_get_clean();
    }
}

function core_details_modified($content, $block)
{
    $content = str_replace('</summary>', '</summary><div class="wp-block-details__inner inner inner-zero-x wysiwyg">', $content);
    $content = str_replace('</details>', '</div></details>', $content);

    return $content;
}

function core_image_modified($content, $block)
{
    if(!$content) return '';

    $dom = new \DomDocument();
    $dom->strictErrorChecking = false;
    @$dom->loadHTML($content);

    $images = @$dom->getElementsByTagName('img');
    $figures = @$dom->getElementsByTagName('figure');

    if(!$figures) return $content;

    // get image data
    $imageID = @$block['attrs']['id'];
    $lazy = wp_get_attachment_image_src($imageID, 'lazy');
    $specifiedSize = @wp_get_attachment_image_src($imageID, $block['sizeSlug']);
    $large = wp_get_attachment_image_src($imageID, '2048x2048');

    // create lightbox link node
    $link = $dom->createElement('a');
    $link->setAttribute('class', 'badegg-lightbox');
    $link->setAttribute('target', '_blank');
    $link->setAttribute('role', 'button');
    $link->setAttribute('tabindex', '0');
    $link->setAttribute('aria-label', __('expand image', 'badegg'));

    foreach($images as $image) {
        // define new image attributes
        $src = $image->getAttribute('src');
        $srcset = $image->getAttribute('srcset');
        $class = $image->getAttribute('class');

        // set image attributes
        $image->setAttribute('src', $lazy[0]);
        $image->setAttribute('srcset', '');
        $image->setAttribute('data-src', $src);
        $image->setAttribute('data-srcset', $srcset);
        $image->setAttribute('class', $class . ' lazy');

        if($specifiedSize) {
            $image->setAttribute('width', $specifiedSize[1]);
            $image->setAttribute('height', $specifiedSize[2]);
        }

        // clone lightbox link
        $linkClone = $link->cloneNode();

        // set lightbox link attributes
        $linkClone->setAttribute('href', $large[0]);

        // replace image with lightbox link
        $image->parentNode->replaceChild($linkClone, $image);

        // append original image to lightbox link
        $linkClone->appendChild($image);
    }

    return $dom->saveHTML($figures[0]);
}
