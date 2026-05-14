import './TermList.scss'
import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'

export default function TermList({ className, items, active, contentType }) {
  const location = useLocation()

  if(items.length > 0) {
    return (
      <div className={ `termlist ${ className }` }>
        <ul className="nolist">
          { contentType &&
            <li className={ clsx(
              'termlist-item-all',
              (contentType.uri === location.pathname) && `active`,
            )}>
              <Link to={ contentType.uri }>
                <span>{ contentType.label }</span>
              </Link>
            </li>
          }

          { items.map((item, index) =>  {
            const isActive = location.pathname === item.uri ? true : false;

            let termClass = clsx(
              'termlist-term-' + item.slug,
              (isActive) && `active`,
            )

            if('name' in item) {
              return (
                <li key={ index } className={ termClass }>
                  <Link to={ item.uri } rel="preload">
                    <span>{ item.name }</span>
                  </Link>
                </li>
              )
            }

          })}
        </ul>
      </div>
    )
  }
}
