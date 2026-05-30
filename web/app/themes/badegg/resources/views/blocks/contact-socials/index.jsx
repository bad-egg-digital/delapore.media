import metadata from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { dateI18n, getSettings } from '@wordpress/date';
import { useState, useEffect } from '@wordpress/element';
import parse from "html-react-parser"

import {
  useBlockProps,
  InspectorControls,
  RichText,
} from '@wordpress/block-editor';

import {
	Panel,
	PanelBody,
  TextControl,
  TextareaControl,
  SelectControl,
} from '@wordpress/components';

registerBlockType(metadata.name, {
  edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps();
    const [ socials, setSocials ] = useState([]);

    const {
      heading,
      description,
    } = attributes;

    useEffect(() => {
      fetch(`/wp-json/badeggcup/v1/company/socials`)
        .then(response => response.json())
        .then(res => {
          setSocials(res);
        })
        .catch(error => console.error('Error fetching social channels:', error));
    }, [])

    return (
      <div { ...blockProps }>
        <InspectorControls>
          <Panel className="badegg-components-panel">
            <PanelBody title={ __("Text", "badegg") }>
              <TextControl
                label={ __('Heading', 'badegg') }
                value={ heading }
                onChange={ (value) => { setAttributes({ heading: value }) }}
                __nextHasNoMarginBottom
                __next40pxDefaultSize
              />

              <TextareaControl
                label={ __('Description', 'badegg') }
                value={ description }
                onChange={ (value) => { setAttributes({ description: value }) }}
                __nextHasNoMarginBottom
                __next40pxDefaultSize
              />

            </PanelBody>
          </Panel>
        </InspectorControls>

        <div className="contact-method-card contact-method-socials card-opaque inner inner-small">
          <RichText
            tagName="h2"
            className="section-title"
            value={ heading }
            placeholder={ __('Enter the heading', 'badegg') }
            onChange={ (value) => { setAttributes({ heading: value }) }}
          />
          <RichText
            tagName="p"
            value={ description }
            placeholder={ __('A short call to action', 'badegg') }
            onChange={ (value) => { setAttributes({ description: value }) }}
          />

          <hr/>

          <div className="contact-method-card-detail">
            { !socials ?
              <p>Please set your social channels under the <a href="#">Bad Egg Digital</a> menu.</p>
            :
              <ul className="socials nolist">
                { socials.map((item, index) => {
                  return (
                    <li key={ index } className={ `social-${ item.icon }` }>
                      <a href={ item.link } target="_blank" rel="noindex nofollow">
                        { parse(item.svg) }
                      </a>
                    </li>
                  )
                })}
              </ul>
            }
          </div>
        </div>
      </div>
    );
  },
});
