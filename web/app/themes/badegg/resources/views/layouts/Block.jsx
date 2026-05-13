import { containerClassNames, sectionClassNames } from '@scripts/lib/classNames'

export default function Block( { className, attributes, children, innerRef } ) {

  let atts = {
    className: sectionClassNames(
      attributes,
      attributes?.className,
      [ className ],
    ).join(' ')
  }

  return (
    <section { ...atts } ref={ innerRef }>
      <div className={ containerClassNames( attributes, []).join(' ') }>
        { children }
      </div>
    </section>
  )
}
