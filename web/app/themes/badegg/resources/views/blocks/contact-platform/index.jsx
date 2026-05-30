import metadata from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { dateI18n, getSettings } from '@wordpress/date';
import AttachmentImage from "@blocks/-editor/AttachmentImage"

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
  Button,
  __experimentalSpacer as Spacer,
} from '@wordpress/components';

import {
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';

import { useState, useEffect } from '@wordpress/element';

registerBlockType(metadata.name, {
  edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps();
    const [ contactInfo, setContactInfo ] = useState({});

    const {
      heading,
      description,
      platformLink,
      logo,
      logo_url,
      logo_width,
      logo_height,
      logo_alt,
    } = attributes;

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

              <TextControl
                label={ __('Link', 'badegg') }
                type="url"
                value={ platformLink }
                onChange={ (value) => { setAttributes({ platformLink: value }) }}
                __nextHasNoMarginBottom
                __next40pxDefaultSize
              />

              <AttachmentImage imageId={ logo } />

              <MediaUploadCheck>
                <MediaUpload
                  onSelect={ (media) => {
                    setAttributes({
                      logo: media?.id,
                      logo_url: media?.sizes?.medium?.url || media?.url,
                      logo_width: media?.width,
                      logo_height: media?.height,
                      logo_alt: media?.alt,
                    })
                  }}
                  allowedTypes={ ['image'] }
                  value={ logo }
                  render={ ({ open }) => (
                    <>
                      <Spacer />

                      <Button
                        onClick={ open }
                        variant="primary"
                      >
                        { logo ?  __("Replace image", "badegg") :  __("Choose image", "badegg") }
                      </Button>

                      { logo != 0 && (
                        <Button
                          onClick={ () => setAttributes({
                              logo: 0,
                              logo_url: '',
                          }) }
                          isDestructive
                          variant="secondary"
                        >
                          { __("Remove image", "badegg") }
                        </Button>
                      )}
                    </>
                  )}
                />
              </MediaUploadCheck>

            </PanelBody>
          </Panel>
        </InspectorControls>

        <div className="contact-method-card contact-method-platform card-opaque inner inner-small">
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
            <AttachmentImage className="contact-method-platform-logo" imageId={ logo } />
          </div>
        </div>
      </div>
    );
  },
});
