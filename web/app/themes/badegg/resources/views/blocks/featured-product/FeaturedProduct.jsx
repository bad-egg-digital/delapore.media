import './style.scss'
import { useEffect, useState, useRef } from 'react'
import parse from "html-react-parser"
import clsx from "clsx"
import isUriValid from "@scripts/lib/isUriValid"
import { Link } from "react-router-dom"
import CTA from "@views/components/CTA/CTA"

export default function FeaturedProduct( props ) {
  const { post, attributes: { specific, productID } } = props
  const nodeRef = useRef(null)
  const [ product, setProduct ] = useState('')
  const [ productLink, setProductLink ] = useState({})
  const [ isLoaded, setIsLoaded ] = useState(false)

  let query = `
    {
      products(${ productID ? `where: {in: "${ productID }"},` : '' } first: 1) {
        nodes {
          titlePrefix
          title
          subtitle
          excerpt
          uri
          productPrice
          productPriceDiscount
          productOffsiteURL
          productContextImage
          productCategoryPrimaryTerm {
            name
          }
        }
      }
    }
  `;

  useEffect(() => {
    fetch( badEggCupAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    })
      .then(res => res.json())
      .then(res => {
        let first = res?.data?.products?.nodes?.[0]

        setProduct(first || {})

        if(first?.productOffsiteURL) {
          setProductLink(isUriValid(first.productOffsiteURL) ? new URL(first.productOffsiteURL) : {})
        }

        setIsLoaded(true)

      })
      .catch( error => {
        console.error('Error fetching page:', error)
        console.log(query)
      })
  }, [ productID ])

  return (
    <div className="wp-block-badegg-featured-product" ref={ nodeRef }>
      <CTA className="cta-block-product" hasColumns={ true }>
        { product?.productContextImage ?
          <div className="cta-block-column cta-block-image has-shadow">
            <img loading="lazy" { ...product.productContextImage } />
          </div>
        : null }
        <div className="cta-block-column cta-block-content">
          { (product?.productCategoryPrimaryTerm || product?.titlePrefix) ?
            <p className="cta-block-content-prefix">
              { product?.productCategoryPrimaryTerm ?
                `${ product.productCategoryPrimaryTerm.name }: `
              : ''}
              { product?.titlePrefix }
            </p>
          : null }

          <h2 className="cta-block-content-heading">{ product?.title }</h2>

          { product?.subtitle &&
            <p className="cta-block-content-subtitle">{ product.subtitle }</p>
          }

          { product?.excerpt &&
            <div className="cta-block-content-excerpt">
              { parse( product.excerpt ) }
            </div>
          }

          <div className="cta-block-action">
            { product?.productPrice ?
              <p className={ clsx(
                'product-pricing',
                product?.productPriceDiscount && 'product-pricing-discounted',
              )}>
                <span className={ clsx(
                  'product-pricing-current',
                  product?.productPriceDiscount && 'strikethrough',
                )}>
                  { product.productPrice }
                </span>

                { product?.productPriceDiscount ?
                  <span className="product-pricing-discount">
                    { product.productPriceDiscount }
                  </span>
                : null }
              </p>
            : null }

            <div className="btn-wrap">
              { 'href' in productLink ?
                <a href={ productLink.href } target="_blank" className="btn primary">Buy Now</a>
              : null }

              <Link to={ product.uri } className="btn white outline">Learn More</Link>
            </div>

          </div>
        </div>
      </CTA>
    </div>
  )
}
