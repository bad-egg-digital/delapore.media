// block.json's editorScript, loaded only in the block editor
import './style.scss'

import metadata from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { dateI18n, getSettings } from '@wordpress/date';

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

import {
  useSelect,
  useDispatch,
} from '@wordpress/data';

registerBlockType(metadata.name, {
  edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps();
    const { formats } = getSettings();
    const { editPost } = useDispatch('core/editor');

    const postType = wp.data.select( 'core/editor' ).getCurrentPostType();
    const postDate = useSelect((select) => select('core/editor').getEditedPostAttribute('date'), []);
    const postTitle = useSelect((select) => select('core/editor').getEditedPostAttribute('title'), []);

    const selectedCategories = (postType === 'post') ? useSelect( (select) => select('core/editor').getEditedPostAttribute('categories'), [] ) : {};

    const allCategories = (postType === 'post') ? useSelect(
      (select) => select('core').getEntityRecords(
        'taxonomy',
        'category',
        {
          per_page: -1,
          orderby: 'name',
          order: 'asc',
        }
      ),
      []
    ) : {};

    const toggleCategory = (categoryId, checked) => {
      let updatedCategories;

      if (checked) {
        updatedCategories = [
          ...selectedCategories,
          categoryId,
        ];
      } else {
        updatedCategories = selectedCategories.filter(
          (id) => id !== categoryId
        );
      }

      editPost({
        categories: updatedCategories,
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
                { allCategories?.map((category) => (
                  <CheckboxControl
                    key={category.id}
                    label={category.name}
                    checked={selectedCategories.includes(category.id)}
                    onChange={(checked) => {
                      toggleCategory(category.id, checked);
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
            { postType === 'post' && !hideCategories &&
              <div className="termlist masthead-categories ">
                <ul className="nolist">
                  { allCategories?.filter( (cat) => selectedCategories.includes(cat.id) )
                    .map((cat) => (
                      <li key={ cat.id } className={ `category-${ cat.slug }` }>
                        <a href="#">{ cat.name }</a>
                      </li>
                    ))}
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
