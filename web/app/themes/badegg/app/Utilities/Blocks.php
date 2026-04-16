<?php

namespace App\Utilities;

class Blocks
{
    public $prefix = 'badEgg';

    public function __construct()
    {

    }

    public function blocksMap($blocks = []) {
        $data = [];

        if($blocks && is_array($blocks)) {
            foreach ($blocks as $block) {
                $name = $block['blockName'];

                if(!$name) continue;

                $inner = [];


                if (!empty($block['innerBlocks']) && is_array($block['innerBlocks'])) {
                    $inner = $this->blocksMap($block['innerBlocks']);
                }

                $data[] =  [
                    'name'        => $name,
                    'attributes'  => $block['attrs'] ?? [],
                    'content'     => trim($this->unwrapBlock($block['innerHTML'])),
                    'rawContent'  => trim($block['innerHTML']),
                    'innerBlocks' => $inner,
                ];
            }
        }

        return $data;
    }

    public function unwrapBlock($html) {
        $html = trim($html);

        // Matches a single outer HTML tag wrapper
        if (preg_match('#^<([a-z0-9]+)([^>]*)>(.*)</\1>$#is', $html, $m)) {
            return $m[3];
        }

        return $html;
    }
}
