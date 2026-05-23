// block.json's editorScript, loaded only in the block editor
import './style.scss'

import metadata from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { dateI18n, getSettings } from '@wordpress/date';
import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

import {
  useBlockProps,
  RichText,
  InspectorControls,
  BlockControls,
  AlignmentToolbar,
} from '@wordpress/block-editor';

import {
	Panel,
	PanelBody,
	ToggleControl,
  TextareaControl,
  DateTimePicker,
  CheckboxControl,
} from '@wordpress/components';


registerBlockType(metadata.name, {
  edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps();
    const { formats } = getSettings();
    const { editPost } = useDispatch('core/editor');

    const postType = wp.data.select( 'core/editor' ).getCurrentPostType();
    const postDate = useSelect((select) => select('core/editor').getEditedPostAttribute('date'), []);
    const postTitle = useSelect((select) => select('core/editor').getEditedPostAttribute('title'), []);

    const [ taxonomy, setTaxonomy ] = useState('')
    const [ taxonomyBase, setTaxonomyBase ] = useState('')

    useEffect(() => {
      fetch(`/wp-json/badeggcup/v1/post-types`)
        .then(response => response.json())
        .then(res => {
          const primaryTax = res?.hasArchive?.[postType]?.primaryTaxonomy;
          const primaryTaxBase = res?.hasArchive?.[postType]?.taxonomies?.[primaryTax]?.restBase;

          setTaxonomy(primaryTax || '');
          setTaxonomyBase(primaryTaxBase || '');

        })
        .catch(error => console.error('Error fetching post types:', error));
    }, [ postType ])

    const taxArgs = { per_page: -1, orderby: 'name', order: 'asc' };
		const selectedTerms = useSelect((select) => select('core/editor').getEditedPostAttribute(taxonomyBase), [ taxonomyBase ]) || [];
    const allTerms = useSelect((select) => select('core').getEntityRecords('taxonomy', taxonomy, taxArgs ), [ taxonomy ]) || [];

    const toggleTerm = (termID, checked) => {
      let updatedTerms;

      if (checked) {
        updatedTerms = [
          ...selectedTerms,
          termID,
        ];
      } else {
        updatedTerms = selectedTerms.filter(
          (id) => id !== termID
        );
      }

      editPost({
        [ taxonomy ]: updatedTerms,
      });
    };

    const {
      hideCategories,
      hideDate,
    } = attributes;

    return (
      <div { ...blockProps }>
        <InspectorControls>
          <Panel className="badegg-components-panel">
            <PanelBody>
              { (postType === 'post') &&
                <ToggleControl
                  label={ __('Hide Categories', 'badegg') }
                  checked={ hideCategories }
                  onChange={(value) => setAttributes({ hideCategories: value }) }
                  __nextHasNoMarginBottom
                />
              }
              <ToggleControl
                label={ __('Hide Date', 'badegg') }
                checked={ hideDate }
                onChange={(value) => setAttributes({ hideDate: value }) }
                __nextHasNoMarginBottom
              />
            </PanelBody>
            { postType === 'post' && !hideCategories &&
              <PanelBody title={ __('Categories', 'badegg') }>
                { allTerms?.map((category) => (
                  <CheckboxControl
                    key={category.id}
                    label={category.name}
                    checked={selectedTerms.includes(category.id)}
                    onChange={(checked) => {
                      toggleTerm(category.id, checked);
                    }}
                    __nextHasNoMarginBottom
                  />
                ))}
              </PanelBody>
            }

            { !hideDate &&
              <PanelBody title={ __('Publish Date', 'badegg') }>
                <DateTimePicker
                  currentDate={ postDate }
                  onChange={ (date) => {
                    editPost({ date: date });
                  }}
                />
              </PanelBody>
            }
          </Panel>
        </InspectorControls>

        { (!hideCategories || !hideDate) &&
          <div className={ `entry-meta ${ (!hideCategories) ? 'has-categories' : '' }` }>
            { !hideCategories &&
              <div className="termlist masthead-categories ">
                <ul className="nolist">
                  { allTerms?.filter((term) => selectedTerms.includes(term.id)).map((term) =>
                    <li key={ term.id } className={ `category-${ term.slug }` }><a href="#">{ term.name }</a></li>
                  )}
                </ul>
              </div>
            }

            { !hideDate &&
              <time dateTime={ postDate }>
                { dateI18n( formats.date, postDate ) }
              </time>
            }

          </div>
        }

        <RichText
          tagName="h1"
          value={ postTitle }
          placeholder="Enter the post title..."
          onChange={ (newTitle) => {
            // Update the editor state with the new title
            wp.data.dispatch('core/editor').editPost({ title: newTitle });
          }}
        />

      </div>
    );
  },
});
