import metadata from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { dateI18n, getSettings } from '@wordpress/date';

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

import { useState, useEffect } from '@wordpress/element';

registerBlockType(metadata.name, {
  edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps();
    const [ contactInfo, setContactInfo ] = useState({});

    const {
      heading,
      description,
      method,
    } = attributes;

    useEffect(() => {
      fetch(`/wp-json/badeggcup/v1/company`)
        .then(response => response.json())
        .then(res => {
          setContactInfo(res);
        })
        .catch(error => console.error('Error fetching contact info:', error));
    }, [ method ])

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

              <SelectControl
                label={ __("Contact Method", "badegg") }
                value={ method }
                options={[
                  { label: 'Please select a method.', value: '' },
                  { label: 'Email',     value: 'email' },
                  { label: 'Telephone', value: 'tel'   },
                ]}
                onChange={ (value) => setAttributes({ method: value }) }
                __next40pxDefaultSize={ true }
                __nextHasNoMarginBottom={ true }
              />

            </PanelBody>
          </Panel>
        </InspectorControls>

        <div className="contact-method-card contact-method-single card-opaque inner inner-small">
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
            { !contactInfo?.[method] ?
              <p>Please select a method on the sidebar and ensure it is defined under the <a href="#">Bad Egg Digital</a> menu.</p>
            :
              <p>
                { method === 'email' &&
                  <a href={ `mailto:${ contactInfo.email }` }>{ contactInfo.email }</a>
                }

                { method === 'tel' &&
                  <a href={ `tel:${ contactInfo.tel }` }>{ contactInfo.tel }</a>
                }
              </p>
            }
          </div>
        </div>
      </div>
    );
  },
});
