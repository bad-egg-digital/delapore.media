// block.json's editorScript, loaded only in the block editor
import './style.scss'

import metadata from './block.json';
import clsx from 'clsx'
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
  TextControl,
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
    const [ taxonomyLabel, setTaxonomyLabel ] = useState('')

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
      subtitle,
      hideTerms,
      hideDate,
      hideTitlePrefix,
      hideSubtitle,
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
                __next40pxDefaultSize
                __nextHasNoMarginBottom
              />

              { !hideSubtitle &&
                <TextControl
                  label={ __('Subtitle', 'badegg') }
                  value={ subtitle }
                  onChange={(value) => setAttributes({ subtitle: value }) }
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
                label={ __('Hide Subtitle', 'badegg') }
                checked={ hideSubtitle }
                onChange={(value) => setAttributes({ hideSubtitle: value }) }
                __nextHasNoMarginBottom
              />
            </PanelBody>

            { !hideTerms &&
              <PanelBody title={ taxonomyLabel }>
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
              <PanelBody title={ __('Publish Date', 'badegg') } initialOpen={ false }>
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
                placeholder="The title prefix..."
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
          placeholder="The subtitle..."
          onChange={ (newTitle) => {
            wp.data.dispatch('core/editor').editPost({ title: newTitle });
          }}
        />

        { !hideSubtitle &&
          <RichText
            tagName="p"
            className="masthead-subtitle"
            value={ subtitle }
            placeholder="Enter the subtitle..."
            onChange={(value) => setAttributes({ subtitle: value }) }
          />
        }

      </div>
    );
  },
});
