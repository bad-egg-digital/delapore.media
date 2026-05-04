import './FeaturedImage.scss'

export default function FeaturedImage({ attributes }) {
  const { thumbnail } = attributes

  return (
    <figure className={ `wp-block-image wp-block-post-featured-image ${ attributes?.sizeSlug && 'size-' + attributes.sizeSlug }` }>
      <img { ...thumbnail.attributes  } />
    </figure>
  )
}
