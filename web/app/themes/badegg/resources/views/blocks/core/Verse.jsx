import './Verse.scss'

export default function Verse(attributes) {
  const { name } = attributes;

  return (
    <h3>{ name }</h3>
  )
}
