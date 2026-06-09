<?php

namespace App\Utilities;
use SimplePie\SimplePie;
use Alley\WP\Block_Converter\Block_Converter;
use WP_CLI;

class PodcastRSS
{

    public function __construct()
    {
       if(class_exists('WP_CLI')) {
           WP_CLI::add_command( 'badegg-podcast-import', [ $this, 'importCLI' ] );
       }
    }

    public function importCLI() {
        $imports = $this->importEpisodes([ 'cli' => true ]);

        if($imports) {
            WP_CLI::log('Successfully imported/updated ' . count($imports) . ' podcast episodes.');
            WP_CLI::success( 'Podcast import complete.' );
        } else {
            WP_CLI::error( 'No new imports' );
        }

    }

    public function importEpisodes($args = [])
    {
        $Uploads = new Uploads;

        $args = wp_parse_args($args, $this->defaultArgs());
        $cli = $args['cli'];

        if($cli) WP_CLI::log('Retrieving podcast data from RSS');

        $data = $this->parseRSS($args);

        if(!$data) {
            if($cli) WP_CLI::log('No data found.');
            return;
        }

        WP_CLI::log( count($data) . ' items retrieved.');

        $imports = [];

        $x = 1;
        foreach($data as $index => $props) {
            $num = 'Import #' . $x;

            if($cli) WP_CLI::log('Processing ' . $num);

            $postArgs = [
                'post_type'    => 'podcast',
                'post_title'   => $props['title'],
                'post_name'    => $props['slug'],
                'post_date'    => $props['date'],
                'post_status'  => 'publish',
                'post_author'  => get_current_user_id(),
            ];

            $existing = get_page_by_path($props['slug'], OBJECT, 'podcast');

            if($existing && $cli) {
                if($cli) WP_CLI::log($num . ': Episode previously imported.');
            }

            $existingID = @$existing->ID ?: 0;
            $existingAudioSource = get_post_meta($existingID, 'podcast_audio_source_url', true);
            $existingAudioID = get_post_meta($existingID, 'podcast_audio_id', true);
            $existingAudioURL = wp_get_attachment_url($existingAudioID);

            $postArgs['ID'] = $existingID;

            if($cli) WP_CLI::log($num . ': Existing Audio Source: ' . $existingAudioSource);
            if($cli) WP_CLI::log($num . ': RSS Audio source: ' . $props['media']);

            if(!$existing || !$existing->post_content) {
                $postArgs['post_content'] = $this->contentTemplate();
            }

            $postID = wp_insert_post($postArgs);

            if(!$postID) {
                if($cli) WP_CLI::log($num . ': Error adding podcast. Skipping.');
                continue;
            }

            update_post_meta($postID, 'podcast_content', $props['content']);

            if(!$existingAudioURL || ($existingAudioSource !== $props['media'])) {
                if($cli) WP_CLI::log($num . ': Uploading audio file.');
                $audioID = $Uploads->byURL($props['media']);

                if($audioID) {
                    update_post_meta($postID, 'podcast_audio_id', $audioID);
                    update_post_meta($postID, 'podcast_audio_source_url', $props['media']);

                    if($cli) WP_CLI::log($num . ': Successfully attached audio file to episode.');
                }

            } else {
                if($cli) WP_CLI::log($num . ': Audio source filenames match. Skipping audio attachment.');
            }

            $imports[] = $postID;

            $x++;

            if($cli) WP_CLI::log('-----');
        }

        return $imports;
    }

    public function contentTemplate()
    {
        $aboutPage = get_page_by_path('about');
        ob_start();
?>

<!-- wp:badegg/article {"sidebarSwitch":true,"hideTOC":true} -->
<!-- wp:badegg/podcast-title {"titlePrefix":"Episode","attribution":"with Stephen E. Wall"} /-->

<!-- wp:badegg/excerpt /-->

<!-- wp:separator {"className":"is-style-wide"} -->
<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide"/>
<!-- /wp:separator -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Show Notes:</h2>
<!-- /wp:heading -->

<!-- wp:badegg/podcast-content /-->
<!-- /wp:badegg/article -->
<!-- wp:badegg/featured-product /-->
<?php if($aboutPage): ?>
<!-- wp:badegg/postgrid {"background_colour":"black","background_hex":"#000000","linkedPageID":<?= $aboutPage->ID ?>,"linkedPageButton":"About Delapore","selectPostType":"podcast","postSource":"beforeAfter","heading":"More Episodes","allButton":"See all episodes"} /-->
<?php endif; ?>

<?php
        $template = ob_get_clean();

        return $template;
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
            'cli' => false,
            'force' => false,
        ];
    }

}
