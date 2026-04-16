import './Separator.scss'
import clsx from 'clsx'

export default function Separator({ attributes }) {

  attributes = {
    ...attributes,
    className: clsx(
      'wp-block-separator',
      attributes.className,
    )
  }

  return (
    <hr { ...attributes } />
  )
}
