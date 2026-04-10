<?php

namespace App\Utilities;

class VideoSrcset
{
    public function sizes($video_srcset = [])
    {
        if(empty($video_srcset)) return false;

        $sizes = [];

        foreach($video_srcset as $size => $video):
            if($video):
                $sizes[$size] = $video['width'];
            endif;
        endforeach;

        if(!empty($sizes)):
            return json_encode($sizes);
        else:
            return false;
        endif;
    }

    public function smallest($video_srcset = [])
    {
        if(empty($video_srcset)) return false;

        $smallest = null;

        foreach($video_srcset as $size => $video):
            if($smallest) continue;
            if($video) $smallest = $size;
        endforeach;

        return $smallest;
    }
}
