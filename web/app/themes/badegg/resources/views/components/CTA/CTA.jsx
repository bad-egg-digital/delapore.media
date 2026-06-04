import './CTA.scss'
import clsx from 'clsx'


export default function CTA({ className, hasColumns, children }){

  const classNames = clsx(
    "cta-block",
    "bg-secondary-darker",
    "section",
    "section-large",
    className,
  )

  const innerClassNames = clsx(
    "cta-block-inner",
    hasColumns && "cta-block-columns",
  )

  return (
    <div className={ classNames }>
      <div className="container container-large">
        <div className={ innerClassNames }>
          { children }
        </div>
      </div>
    </div>
  )
}
