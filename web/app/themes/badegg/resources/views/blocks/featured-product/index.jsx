// block.json's editorScript, loaded only in the block editor
import './style.scss'

import metadata from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import clsx from "clsx";
import parse from "html-react-parser";
import { dateI18n, getSettings } from '@wordpress/date';
import { useEffect, useState } from '@wordpress/element';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import AttachmentImage from "@blocks/-editor/AttachmentImage"
import CTA from "@views/components/CTA/CTA"

import {
	Panel,
	PanelBody,
  ToggleControl,
  SelectControl,
} from '@wordpress/components';

registerBlockType(metadata.name, {
  edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps();
    const [ products, setProducts ] = useState([]);
    const [ productSelections, setProductSelections ] = useState([]);
    const [ selectedProduct, setSelectedProduct ] = useState({});
    const [ selectedProductTerm, setSelectedProductTerm ] = useState({});

    const {
      specific = false,
      productID = 0,
    } = attributes;

    useEffect(() => {
      async function fetchPosts() {
        try {
          const [ getProducts ] = await Promise.all([
            apiFetch({ path: '/wp/v2/products' }),
          ]);

          let list = [{
            value: 0,
            label: __('Use latest product', 'badegg'),
          }];

          if(getProducts.length > 0) {
            Object.entries(getProducts).map( ([index, product]) =>
              list.push({
                value: Number(product.id),
                label: product?.title?.rendered,
              })
            );

            setProducts(getProducts);
            setProductSelections(list);
          }

        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }

      fetchPosts();
    }, []);

    useEffect(() => {
      let queryID = (specific && productID) ? productID : products?.[0]?.id;

      if(queryID) {
        async function fetchPost() {
          try {
            const [ product ] = await Promise.all([
              apiFetch({ path: `/wp/v2/products/${ queryID }` }),
            ]);

            setSelectedProduct(product);

          } catch (error) {
            console.error('Error fetching posts:', error);
          }
        }

        fetchPost();
      }
    }, [ specific, products, productID ]);

    useEffect(() => {
      let termID = 0;

      if(selectedProduct?.meta?._primary_term_product_category) {
        termID = selectedProduct.meta._primary_term_product_category;
      } else if (selectedProduct?.productCategories && selectedProduct?.productCategories.length > 0) {
        termID = selectedProduct.productCategories[0];
      }

      if(termID) {
        async function fetchTerm() {
          try {
            const [ term ] = await Promise.all([
              apiFetch({ path: `/wp/v2/productCategories/${ termID }` }),
            ]);

            setSelectedProductTerm(term);

          } catch (error) {
            console.error('Error fetching posts:', error);
          }
        }

        fetchTerm();
      }
    }, [ selectedProduct ]);

    return (
      <div { ...blockProps }>
        <InspectorControls>
          <Panel className="badegg-components-panel">
            <PanelBody title={ __("Controls", "badegg") }>
              <ToggleControl
                label={ __('Choose a specific product', 'badegg') }
                checked={ specific }
                onChange={(value) => setAttributes({ specific: value }) }
                __nextHasNoMarginBottom
              />
              { specific &&
                <SelectControl
                  label={ __("Link to a page", "badegg") }
                  value={ Number(productID) }
                  options={ productSelections }
                  onChange={ (value) => setAttributes({ productID: Number(value) }) }
                  __next40pxDefaultSize={ true }
                  __nextHasNoMarginBottom={ true }
                />
              }
            </PanelBody>
          </Panel>
        </InspectorControls>

        <CTA className="cta-block-product" hasColumns={ true }>
          { selectedProduct?.meta?.product_context_id ?
            <div className="cta-block-column cta-block-image has-shadow">
              <AttachmentImage imageId={ selectedProduct.meta.product_context_id } />
            </div>
          : null }

          <div className="cta-block-column cta-block-content">
            { (selectedProductTerm || selectedProduct?.meta?.titlePrefix) ?
              <p className="cta-block-content-prefix">
                { selectedProductTerm ? `${ selectedProductTerm.name }: ` : '' }
                { selectedProduct?.meta?.titlePrefix }
              </p>
            : null }

            <h2 className="cta-block-content-heading">{ selectedProduct?.title?.rendered }</h2>

            { selectedProduct?.meta?.subtitle &&
              <p className="cta-block-content-subtitle">{  selectedProduct.meta.subtitle }</p>
            }

            { selectedProduct?.excerpt &&
              <div className="cta-block-content-excerpt">
                { parse(selectedProduct.excerpt.rendered) }
              </div>
            }

            <div className="cta-block-action">
              { selectedProduct?.meta?.product_price ?
                <p className={ clsx(
                  'product-pricing',
                  selectedProduct?.meta?.product_price_discount && 'product-pricing-discounted',
                )}>
                  <span className={ clsx(
                    'product-pricing-current',
                    selectedProduct?.meta?.product_price_discount && 'strikethrough',
                  )}>
                    { selectedProduct.meta.product_price }
                  </span>

                  { selectedProduct?.meta?.product_price_discount ?
                    <span className="product-pricing-discount">
                      { selectedProduct.meta.product_price_discount }
                    </span>
                  : null }
                </p>
              : null }

              <div className="btn-wrap">
                { selectedProduct?.meta?.product_offsite_url ?
                  <span className="btn primary">Buy Now</span>
                : null }

                <span className="btn white outline">Learn More</span>
              </div>

            </div>
          </div>
        </CTA>
      </div>
    );
  },
});
