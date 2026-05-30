import clsx from 'clsx'
import { AppContext } from '@views/layouts/AppContext'
import { useContext } from 'react'
import parse from "html-react-parser"
import { Link } from 'react-router-dom'
import TermList from '@views/components/TermList/TermList'
import isUriValid from "@scripts/lib/isUriValid";

export default function CardProduct( props ) {
  const { appContext: { postTypes } } = useContext( AppContext )

  const {
    postType,
    slug,
    terms,
    titlePrefix,
    title,
    subtitle,
    excerpt,
    uri,
    featuredImage,
    isLoaded,
    taxonomy,
    productPrice,
    productPriceDiscount,
    productOffsiteURL,
  } = props

  const className = clsx(
    'card',
    postType && 'card-' + postType,
    'rounded',
    'bg-white',
  )

  const primaryTaxonomy = postTypes.find( type => type.name === postType)?.primaryTaxonomy?.graphqlSingleName
  const productLink = isUriValid(productOffsiteURL) ? new URL(productOffsiteURL) : {}

  return (
    <article className={ className }>
      <header className="card-featured bg-grey-darker ">
        { featuredImage ? (
          <img
            loading="lazy"
            src={featuredImage?.node?.sourceUrl }
            srcSet={ featuredImage?.node?.srcSet }
            alt={ featuredImage?.node?.altText }
            width={ featuredImage?.node?.mediaDetails?.width }
            height={ featuredImage?.node?.mediaDetails?.height }
          />
        ) : (
          <div className="card-featured-placeholder" />
        )
        }
      </header>
      <div className="card-content inner inner-small">
        <div className="card-meta">
          <TermList
            className="card-terms"
            items={ terms?.nodes }
            primaryItem={ primaryTaxonomy && props?.[ primaryTaxonomy + 'PrimaryTerm' ] }
            limit={ 1 }
            isLoaded={ isLoaded }
            state={{ preserveScroll: true }}
          />

          { titlePrefix && <p className="card-title-prefix secondary-darkest">{ titlePrefix }</p> }
        </div>

        <h2 className="card-title">{ title }</h2>
        { subtitle && <p className="card-subtitle grey">{ subtitle }</p> }
        { excerpt && <div className="card-excerpt wysiwyg">{ parse(excerpt) }</div> }
      </div>
      <footer className="inner inner-small inner-unset-top">
        { productPrice &&
          <p className={ clsx(
            'card-product-pricing',
            productPriceDiscount && 'card-product-pricing-discounted',
          )}>
            <span className={ clsx(
              'card-product-pricing-current',
              productPriceDiscount && 'strikethrough',
            )}>{ productPrice }</span>

            { productPriceDiscount &&
              <span className="card-product-pricing-discount">
                { productPriceDiscount }
              </span>
            }
          </p>
        }
        <div className="btn-wrap">
          { 'href' in productLink &&
            <a href={ productLink } target="_blank" className="btn primary">Buy Now</a>
          }
          <Link to={ uri } className="btn outline">Learn More</Link>
        </div>
      </footer>
    </article>
  )
}
