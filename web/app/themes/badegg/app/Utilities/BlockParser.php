<?php

namespace App\Utilities;

class BlockParser extends \WP_Block_Parser
{
    /**
     * Parses a document and returns a list of block structures
     *
     * When encountering an invalid parse will return a best-effort
     * parse. In contrast to the specification parser this does not
     * return an error on invalid inputs.
     *
     * @param string $document Input document being parsed.
     *
     * @return WP_Block_Parser_Block[]
     */
    public function parse($document): array
    {
        $is_graphql_request = function_exists('is_graphql_request') && is_graphql_request();
        $is_rest_request    = defined('REST_REQUEST');

        // Don't modify the document if this is not a GraphQL or REST API request.
        if (!$is_graphql_request && !$is_rest_request) {
            return parent::parse($document);
        }

        $document_with_replacements = $this->replace_internal_link_url_domains($document);

        return parent::parse($document_with_replacements);
    }

    /**
     * Rewrite internal link URLs to point to the decoupled frontend app.
     *
     * @param string $document Input document being parsed.
     *
     * @return string $document Input document with internal link URL domains replaced.
     */
    private function replace_internal_link_url_domains(string $document): string
    {
        $homeURL = WP_HOME;

        return str_replace('href="' . $homeURL, 'data-internal-link="true" href="', $document);
    }
}

/**
 * Register a custom Gutenberg block parser.
 *
 * @return string Name of block parser class.
 */
add_filter('block_parser_class', fn (): string => __NAMESPACE__ . '\\BlockParser');
