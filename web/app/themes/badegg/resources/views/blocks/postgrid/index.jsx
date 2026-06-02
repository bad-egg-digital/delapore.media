// block.json's editorScript, loaded only in the block editor
import './style.scss'
import metadata from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';
import { dateI18n, getSettings } from '@wordpress/date';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import parse from "html-react-parser"
import IconPlay from '@images/circle-play-solid-full.svg?react'
import AttachmentImage from "@blocks/-editor/AttachmentImage"
import { useSelect, useDispatch } from '@wordpress/data';

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

import { containerClassNames, sectionClassNames } from '@scripts/lib/classNames';
import BlockSettings from '@blocks/-editor/BlockSettings';
import CardLoading from "@views/components/Card/CardLoading";

registerBlockType(metadata.name, {
  edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps();
    const postType = wp.data.select( 'core/editor' ).getCurrentPostType();
    const postDate = useSelect((select) => select('core/editor').getEditedPostAttribute('date'), []);
    const { formats } = getSettings();
    blockProps.className = sectionClassNames(attributes, blockProps.className).join(' ');
    const [ loading, setLoading ] = useState( true );
    const [ posts, setPosts ] = useState([]);
    const [ pageSelections, setPageSelections ] = useState([]);
    const [ postTypes, setPostTypes ] = useState({});
    const [ postTypeSelections, setPostTypeSelections ] = useState([]);

    const {
      heading,
      blurb,
      selectPostType = postType,
      postSource,
      allButton,
      linkedPageID,
      linkedPageButton,
    } = attributes;

    useEffect(() => {
      async function fetchPosts() {
        try {
          const [ pages, types ] = await Promise.all([
            apiFetch({ path: '/wp/v2/pages?orderby=title&order=asc&parent=0' }),
            apiFetch({ path: '/badeggcup/v1/post-types' }),
          ]);

          if(pages.length > 0) {
            let pageList = [
              { value: "", label: __('Select a page', 'badegg') },
            ];

            Object.entries(pages).map( ([index, page]) =>
              pageList.push({ value: Number(page.id), label: page?.title?.rendered }));

            setPageSelections(pageList);
          }

          if('hasArchive' in types) {
            setPostTypes(types.hasArchive);

            let typeList = [
              { value: "", label: __('Select a type', 'badegg') }
            ];

            Object.entries(types.hasArchive).map( ([type, props]) =>
              typeList.push({ value: type, label: props?.label }));

            setPostTypeSelections(typeList);
          }

        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setLoading(false);
        }
      }

      fetchPosts();
    }, []);

    return (
      <div { ...blockProps }>
        <InspectorControls>
          <Panel className="badegg-components-panel">
            <PanelBody title={ __("Text", "badegg") }>
              <TextControl
                label={ __('Heading', 'badegg') }
                value={ heading }
                onChange={(value) => setAttributes({ heading: value }) }
                __nextHasNoMarginBottom
                __next40pxDefaultSize
              />
              { heading &&
                <TextareaControl
                  label={ __('Blurb', 'badegg') }
                  value={ blurb }
                  onChange={(value) => setAttributes({ blurb: value }) }
                  __nextHasNoMarginBottom
                  __next40pxDefaultSize
                />
              }

              { (pageSelections && pageSelections.length > 0) ?
                <TextControl
                  label={ __('See all button', 'badegg') }
                  value={ allButton }
                  onChange={(value) => setAttributes({ allButton: value }) }
                  __nextHasNoMarginBottom
                  __next40pxDefaultSize
                />
              : null }
            </PanelBody>
            <PanelBody title={ __("Controls", "badegg") }>
              { (pageSelections && pageSelections.length > 0) ?
                <>
                  <SelectControl
                    label={ __("Link to a page", "badegg") }
                    value={ Number(linkedPageID) }
                    options={ pageSelections }
                    onChange={ (value) => setAttributes({ linkedPageID: Number(value) }) }
                    __next40pxDefaultSize={ true }
                    __nextHasNoMarginBottom={ true }
                  />

                  { (linkedPageID && linkedPageID > 0) ?
                    <TextControl
                      label={ __('Page button text', 'badegg') }
                      value={ linkedPageButton }
                      onChange={(value) => setAttributes({ linkedPageButton: value }) }
                      __nextHasNoMarginBottom
                      __next40pxDefaultSize
                    />
                  : null }
                </>
              : null }

              { (postTypeSelections && postTypeSelections.length > 0) ?
                <>
                  <SelectControl
                    label={ __("Select a post type", "badegg") }
                    value={ selectPostType }
                    options={ postTypeSelections }
                    onChange={ (value) => setAttributes({ selectPostType: value }) }
                    __next40pxDefaultSize={ true }
                    __nextHasNoMarginBottom={ true }
                  />

                  { selectPostType &&
                    <SelectControl
                      label={ __("Source of posts", "badegg") }
                      value={ postSource }
                      options={[
                        { value: "latest",       label: __(`Latest ${ postTypes?.[selectPostType]?.label || 'Posts' }`, 'badegg') },
                        { value: "beforeAfter",  label: __('Before & After',    'badegg') },
                        { value: "terms",        label: __('Shared categories', 'badegg') },
                      ]}
                      onChange={ (value) => setAttributes({ postSource: value }) }
                      __next40pxDefaultSize={ true }
                      __nextHasNoMarginBottom={ true }
                    />
                  }
                </>
              : null }
            </PanelBody>

            <BlockSettings
              attributes={ attributes }
              setAttributes={ setAttributes }
            />
          </Panel>
        </InspectorControls>

        <div className={ containerClassNames(attributes, []).join(' ') }>
          <div className="titlebar titlebar-embellished align-centre inner inner-bottom wysiwyg">
            <RichText
              tagName="h2"
              value={ heading }
              placeholder={ __('Enter the heading', 'badegg') }
              onChange={(value) => setAttributes({ heading: value }) }
            />
            { heading &&
              <RichText
                tagName="p"
                value={ blurb }
                placeholder={ __('An optional blurb', 'badegg') }
                onChange={(value) => setAttributes({ blurb: value }) }
              />
            }
          </div>


          <div className="container container-narrow align-centre">
            <div className="card-opaque inner-small wysiwyg">
              <p>The { postTypes?.[selectPostType]?.label.toLowerCase() } will appear here on the front end.</p>
            </div>
          </div>

          <div className="footerbar align-centre inner inner-top wysiwyg">
            <div className="btn-wrap">

              <RichText
                tagName="span"
                className="btn primary"
                value={ allButton || 'See all' }
                placeholder={ __('See all', 'badegg') }
                onChange={(value) => setAttributes({ allButton: value }) }
              />

              { (linkedPageID && linkedPageID > 0) ?
                <RichText
                  tagName="span"
                  className="btn outline white"
                  value={ linkedPageButton || 'See all' }
                  placeholder={ __('Visit page', 'badegg') }
                  onChange={(value) => setAttributes({ linkedPageButton: value }) }
                />
              : null }
            </div>
          </div>
        </div>
      </div>
    );
  },
});
