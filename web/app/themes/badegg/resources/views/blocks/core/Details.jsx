import './Details.scss'

export default function Details(attributes) {
  const { name } = attributes;

  return (
    <h3>{ name }</h3>
  )
}
