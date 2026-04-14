import './Image.scss'

export default function Image(attributes) {
  const { name } = attributes;

  return (
    <h3>{ name }</h3>
  )
}
