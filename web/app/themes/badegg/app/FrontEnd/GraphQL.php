<?php

namespace App\FrontEnd;
use BadEggCup\Tools;

class GraphQL
{
    public $prefix = 'badEgg';

    public function __construct()
    {
        if(class_exists('WPGraphQL')) {
            add_action( 'graphql_register_types', [$this, 'rootQuery']);
            add_action( 'graphql_register_types', [$this, 'archives']);
            add_action( 'graphql_register_types', [$this, 'badeggcup']);
        }
    }

    public function rootQuery()
    {
        register_graphql_field('RootQuery', $this->prefix, [
            'type' => $this->prefix,
            'resolve' => fn() => true,
        ]);
    }

    public function archives()
    {
        $postTypes = ['post'];

        $customPostTypes = get_post_types([
            'has_archive' => true,
        ], 'names');

        $postTypes = array_merge($postTypes, $customPostTypes);

        $fields = [];

        if($postTypes) {
            foreach($postTypes as $postType) {
                $fields[$postType] = [
                    'type' => 'Page',
                    'description' => "The page set for the archive.",
                    'resolve' => fn() => $this->archiveObject($postType),
                ];
            }
        }

        register_graphql_object_type( $this->prefix . 'ArchiveObjects', [
            'description' => 'Post archive objects',
            'fields' => $fields,
        ]);

        register_graphql_object_type( $this->prefix, [
            'description' => 'Theme-specific data',
            'fields' => [
                'archiveObjects' => [
                    'type' => $this->prefix . 'ArchiveObjects',
                    'resolve' => fn() => true,
                ],
            ],
        ]);
    }

    public function archiveObject($postType = '')
    {
        if(!$postType) return;

        $optionKey = ($postType === 'post') ? 'page_for_posts' : 'page_for_' . $postType;
        $pageID = get_option($optionKey);
        $page = ($pageID) ? get_post($pageID) : null;

        $app_context = \WPGraphQL::get_app_context();

        if($page) {
            return $app_context->get_loader('post')->load_deferred($pageID);;
        } else {
            return;
        }
    }

    public function badeggcup()
    {
        $Settings = new Tools\Settings;

        register_graphql_object_type( $this->prefix . 'Address', [
            'fields' => [
                'line1' => [ 'type' => 'string' ],
                'line2' => [ 'type' => 'string' ],
                'line3' => [ 'type' => 'string' ],
                'line4' => [ 'type' => 'string' ],
                'city' => [ 'type' => 'string' ],
                'county' => [ 'type' => 'string' ],
                'postCode' => [ 'type' => 'string' ],
                'country' => [ 'type' => 'string' ],
            ],
        ]);

        register_graphql_object_type( $this->prefix . 'SocialItem', [
            'fields' => [
                'icon' => [ 'type' => 'string' ],
                'link' => [ 'type' => 'string' ],
                'svg' => [ 'type' => 'string' ],
            ],
        ]);

        register_graphql_object_type( $this->prefix . 'Company', [
            'fields' => $this->companyFields(),
        ]);

        $fields = [];

        if(current_theme_supports('badeggcup-colours')) {
            $fields['colours'] = [
                'type' => ['list_of' => 'String'],
                'resolve' => fn() => $Settings->lookup('colours'),
            ];
        }

        if(current_theme_supports('badeggcup-company')) {
            $fields['company'] = [
                'type' => $this->prefix . 'Company',
                'resolve' => fn() => $Settings->lookup('company'),
            ];
        }

        if(current_theme_supports('badeggcup-companySocials')) {
            $fields['socials'] = [
                'type' => ['list_of' => $this->prefix . 'SocialItem'],
                'resolve' => fn() => $Settings->lookup('socials', 'company'),
            ];
        }

        register_graphql_object_type( $this->prefix . 'Cup', ['fields' => $fields]);

        register_graphql_field('RootQuery', $this->prefix . 'Cup', [
            'type' => $this->prefix . 'Cup',
            'resolve' => fn() => true,
        ]);
    }

    public function companyFields()
    {
        $companyFields = [
            'name' => [ 'type' => 'string' ],
            'nameLegal' => [ 'type' => 'string' ],
            'number' => [ 'type' => 'string' ],
            'tel' => [ 'type' => 'string' ],
            'email' => [ 'type' => 'string' ],
        ];

        if(current_theme_supports('badeggcup-companyAddress')) {
            $companyFields['address'] = [ 'type' => $this->prefix . 'Address'];
        }

        if(current_theme_supports('badeggcup-companyAddressMailing')) {
            $companyFields['addressMailing'] = [ 'type' => $this->prefix . 'Address'];
        }

        if(current_theme_supports('badeggcup-companySocials')) {
            $companyFields['socials'] = [ 'type' => [ 'list_of' => $this->prefix . 'SocialItem'] ];
        }

        return $companyFields;
    }
}
