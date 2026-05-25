// block.json's editorScript, loaded only in the block editor
import '@blocks/masthead/style.scss'

import metadata from './block.json';
import clsx from 'clsx'
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { dateI18n, getSettings } from '@wordpress/date';
import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

import {
	Panel,
	PanelBody,
	ToggleControl,
  TextControl,
  TextareaControl,
  DateTimePicker,
  CheckboxControl,
} from '@wordpress/components';

registerBlockType(metadata.name, {
  edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps();
    const { formats } = getSettings();
    const { editPost } = useDispatch('core/editor');

    const postType = wp.data.select( 'core/editor' ).getCurrentPostType();
    const postDate = useSelect((select) => select('core/editor').getEditedPostAttribute('date'), []);
    const postTitle = useSelect((select) => select('core/editor').getEditedPostAttribute('title'), []);

    const [ taxonomy, setTaxonomy ] = useState('');
    const [ taxonomyBase, setTaxonomyBase ] = useState('');
    const [ taxonomyLabel, setTaxonomyLabel ] = useState('');

    useEffect(() => {
      fetch(`/wp-json/badeggcup/v1/post-types`)
        .then(response => response.json())
        .then(res => {
          const primaryTax = res?.hasArchive?.[postType]?.primaryTaxonomy;
          const primaryTaxBase = res?.hasArchive?.[postType]?.taxonomies?.[primaryTax]?.restBase;
          const primaryTaxLabel = res?.hasArchive?.[postType]?.taxonomies?.[primaryTax]?.label;

          setTaxonomy(primaryTax || '');
          setTaxonomyBase(primaryTaxBase || '');
          setTaxonomyLabel(primaryTaxLabel || '');

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

      editPost({ [ taxonomy ]: updatedTerms });
    };

    const {
      titlePrefix,
      attribution,
      hideTitlePrefix,
      hideTerms,
      hideDate,
      hideAttribution,
    } = attributes;

    return (
      <div { ...blockProps }>
        <InspectorControls>
          <Panel className="badegg-components-panel">
            <PanelBody>
              { !hideTitlePrefix &&
                <TextControl
                  label={ __('Title Prefix', 'badegg') }
                  value={ titlePrefix }
                  onChange={(value) => setAttributes({ titlePrefix: value }) }
                  __next40pxDefaultSize
                  __nextHasNoMarginBottom
                />
              }

              <TextareaControl
                label={ __('Title', 'badegg') }
                value={ postTitle }
                onChange={ (newTitle) => {
                  wp.data.dispatch('core/editor').editPost({ title: newTitle });
                }}
                __nextHasNoMarginBottom
                __next40pxDefaultSize
              />

              { !hideAttribution &&
                <TextControl
                  label={ __('Attribution', 'badegg') }
                  value={ attribution }
                  onChange={(value) => setAttributes({ attribution: value }) }
                  __next40pxDefaultSize
                  __nextHasNoMarginBottom
                />
              }

            </PanelBody>
            <PanelBody title={ __('Controls', 'badegg') }>
              <ToggleControl
                label={ `Hide ${ taxonomyLabel }` }
                checked={ hideTerms }
                onChange={(value) => setAttributes({ hideTerms: value }) }
                __nextHasNoMarginBottom
              />
              <ToggleControl
                label={ __('Hide Prefix', 'badegg') }
                checked={ hideTitlePrefix }
                onChange={(value) => setAttributes({ hideTitlePrefix: value }) }
                __nextHasNoMarginBottom
              />
              <ToggleControl
                label={ __('Hide Date', 'badegg') }
                checked={ hideDate }
                onChange={(value) => setAttributes({ hideDate: value }) }
                __nextHasNoMarginBottom
              />
              <ToggleControl
                label={ __('Hide Attribution', 'badegg') }
                checked={ hideAttribution }
                onChange={(value) => setAttributes({ hideAttribution: value }) }
                __nextHasNoMarginBottom
              />
            </PanelBody>
            <PanelBody title={ __('Publish Date', 'badegg') } initialOpen={ false }>
              { !hideDate &&
                <DateTimePicker
                  currentDate={ postDate }
                  onChange={ (date) => {
                    editPost({ date: date });
                  }}
                />
              }
            </PanelBody>
          </Panel>
        </InspectorControls>

        { (!hideTerms || !hideDate || !hideTitlePrefix) &&
          <div className="masthead-meta">
            { !hideTerms && selectedTerms.length > 0 &&
              <div className="termlist masthead-terms">
                <ul className="nolist">
                  { allTerms?.filter((term) => selectedTerms.includes(term.id)).map((term) =>
                    <li
                      key={ term.id }
                      className={ clsx(
                        'termlist-term-' + term.slug,
                      ) }
                    >
                      <a href="#">{ term.name }</a>
                    </li>
                  )}
                </ul>
              </div>
            }

            { !hideTitlePrefix &&
              <RichText
                tagName="p"
                className="masthead-prefix"
                value={ titlePrefix }
                placeholder="Episode Number"
                onChange={(value) => setAttributes({ titlePrefix: value }) }
              />
            }

            { !hideDate &&
              <time className="masthead-date" dateTime={ postDate }>
                { dateI18n( formats.date, postDate ) }
              </time>
            }
          </div>
        }

        <RichText
          tagName="h1"
          className="masthead-title"
          value={ postTitle }
          placeholder="Enter the post title..."
          onChange={ (newTitle) => {
            // Update the editor state with the new title
            wp.data.dispatch('core/editor').editPost({ title: newTitle });
          }}
        />

        { !hideAttribution &&
          <RichText
            tagName="p"
            className="masthead-subtitle"
            value={ attribution }
            placeholder="Enter the author name..."
            onChange={(value) => setAttributes({ attribution: value }) }
          />
        }

      </div>
    );
  },
});
