import './Gallery.scss'

export default function Gallery(attributes) {
  const { name, innerBlocks } = attributes;

  return (
    <h3>{ name }</h3>
  )
}
