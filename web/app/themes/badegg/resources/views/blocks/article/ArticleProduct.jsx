import clsx from 'clsx'
import isUriValid from "@scripts/lib/isUriValid";

export default function ArticleProduct({ coverFile, coverSrc, price, discount, link, editor = false }) {

  const productLink = isUriValid(link) ? new URL(link) : {}

  return (
    <div
      className={
        clsx(
          'article-sidebar-block',
          'article-sidebar-block-product',
          'inner',
          'inner-small',
        )
      }
    >
      <div className="product-image">
        { editor ?
          <img src={ coverSrc } />
        :
          <img { ...coverFile } />
        }
      </div>

      <p className={ clsx(
        'product-pricing',
        discount && 'product-pricing-discounted',
      )}>
        <span className={ clsx(
          'product-pricing-current',
          discount && 'strikethrough',
        )}>{ price }</span>

        { discount &&
          <span className="product-pricing-discount">
            { discount }
          </span>
        }
      </p>

      { 'href' in productLink &&
        <div className="product-link">
          <a
            className="btn primary big"
            href={ productLink.href }
            target="_blank"
          >
            Buy Now
          </a>

          <p>{ productLink?.hostname }</p>
        </div>
      }

    </div>
  )
}
