<?php

namespace App\Utilities;

class Uploads
{

    public function __construct()
    {
        // add_filter( 'admin_footer', [ $this, 'byURL' ]);
    }

    public function byURL( $url = '', $post_id = 0 )
    {
        if(!$url) return;

        // Load required WordPress files
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/media.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';

        // Download file to temp location
        $temp_file = download_url($url);

        // Check for download errors
        if (is_wp_error($temp_file)) {
            return $temp_file;
        }

        // Prepare array for media_handle_sideload()
        $file = array(
            'name'     => basename($url),
            'tmp_name' => $temp_file,
        );

        // Add file to Media Library
        $attachment_id = media_handle_sideload($file, $post_id);

        // Cleanup on error
        if (is_wp_error($attachment_id)) {
            @unlink($temp_file);
            return $attachment_id;
        }

        return $attachment_id;
    }

}
