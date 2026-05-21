<?php

namespace App\Utilities;
use SimplePie\SimplePie;
use Alley\WP\Block_Converter\Block_Converter;

class PodcastRSS
{

    public function __construct()
    {
        // add_action( 'admin_footer', [ $this, 'importEpisodes' ]);
        add_action('admin_footer', function(){

            // echo '<div style="margin-left: 200px">'.ABSPATH.'</div>';
        });
    }

    public function importEpisodes($args = [])
    {
        $Uploads = new Uploads;

        $args = wp_parse_args($args, $this->defaultArgs());

        $data = $this->parseRSS($args);
        if(!$data) return;

        foreach($data as $index => $props) {
            $postArgs = [
                'post_type'    => 'podcast',
                'post_title'   => $props['title'],
                'post_name'    => $props['slug'],
                'post_date'    => $props['date'],
                'post_content' => $this->generateContent($props['content']),
                'post_status'  => 'publish',
                'post_author'  => get_current_user_id(),
                'meta_input'   => [
                    'podcast_import_id'         => $props['id'],
                    'podcast_audio_id'          => null,
                    'podcast_audio_source_url'  => null,
                    'podcast_placeholder_image' => null,
                ],
            ];

            $existing = get_page_by_path($props['slug'], OBJECT, 'podcast');
            $existingID = @$existing->ID ?: 0;
            $postArgs['ID'] = $existingID;

            if(get_post_meta($existingID, 'podcast_audio_source_url', true) !== $props['media']) {
                $audioID = $Uploads->byURL($props['media']);

                if($audioID) {
                    $postArgs['meta_input']['podcast_audio_id'] = $audioID;
                    $postArgs['meta_input']['podcast_audio_source_url'] = $props['media'];
                }
            }

            if(!get_post_thumbnail_id($existingID) && !get_post_meta($existingID, 'podcast_placeholder_image', true)) {
                $attachmentID = $Uploads->byURL("https://static.photos/bokeh/1200x630.jpg");

                if($attachmentID) {
                    $postArgs['_thumbnail_id'] = $attachmentID;
                    $postArgs['meta_input']['podcast_placeholder_image'] = true;
                }
            }

            $postID = wp_insert_post($postArgs);
        }
    }

    public function generateContent($content = '')
    {
        if(!$content) return;

        $converter = new Block_Converter( $content );
        $blocks = $converter->convert();

        ob_start(); ?>

        <!-- wp:badegg/article {"container_width":"large", "sidebar":true} -->

        <?= $blocks ?>

        <!-- /wp:badegg/article -->

        <?php $html = ob_get_clean();



        return $html;

    }

    public function parseRSS($args = [])
    {
        $args = wp_parse_args($args, $this->defaultArgs());

        if(!$args['feed'] || !wp_http_validate_url($args['feed'])) return [];

        $cacheDir = WP_CONTENT_DIR . '/cache/simplepie';
        if(!file_exists($cacheDir))  mkdir( $cacheDir,  0755, true );

        $feed = new SimplePie();
        $feed->set_feed_url($args['feed']);
        $feed->set_cache_location( $cacheDir );

        // Initialize and parse the feed
        $feed->init();
        $feed->handle_content_type();

        if (!$feed->get_item_quantity()) return [];

        $items = [];
        foreach ($feed->get_items() as $item) {

            $categories = $item->get_categories();
            $media = $item->get_enclosure();

            $props = [
                'id'          => $item->get_id(),
                'title'       => $item->get_title(),
                'content'     => $item->get_content(),
                'date'        => $item->get_date('Y-m-d H:i:s'),
                'link'        => $item->get_permalink(),
                'media'       => '',
                'duration'    => '',
                'slug'        => '',
                'categories'  => [],
            ];

            if($props['link'] && wp_http_validate_url($props['link'])) {
                $props['slug'] = str_replace('/', '', parse_url($props['link'])['path']);
            }

            if($media) {
                $mediaLink = $media->get_link();

                if(wp_http_validate_url($mediaLink)) {
                    $parsedMedia = parse_url($mediaLink);
                    $props['media'] = $parsedMedia['scheme'] . ':' . '//' . $parsedMedia['host'] . '/' . $parsedMedia['path'];
                }
            }

            if($categories) {
                $props['categories'] = array_map(function($category) {
                    return $category->get_label();
                });
            }

            $items[] = $props;
        }

        return $items;
    }

    public function defaultArgs() {
        return [
            'feed' => get_option('badegg_podcast_libsyn_rss_url'),
        ];
    }

}
