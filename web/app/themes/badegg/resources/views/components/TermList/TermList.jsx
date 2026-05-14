import './TermList.scss'
import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'

export default function TermList({ className, items, active, contentType, limit }) {
  const location = useLocation()
  let itemList = (items.length > 0) ? items.filter( value => Object.keys(value).length !== 0) : []

  if(limit) itemList = itemList.slice(0, limit)

  if(itemList.length > 0) {
    return (
      <div className={ `termlist ${ className || '' }` }>
        <ul className="nolist">
          { contentType &&
            <li className={ clsx(
              'termlist-item-all',
              (contentType.uri === location.pathname) && `active`,
            )}>
              <Link to={ contentType.uri }>
                <span>All { contentType.label }</span>
              </Link>
            </li>
          }

          { itemList.map((item, index) =>  {
            const isActive = location.pathname === item.uri ? true : false;

            let termClass = clsx(
              'termlist-term-' + item.slug,
              (isActive) && `active`,
            )

            return (
              <li key={ index } className={ termClass }>
                <Link to={ item.uri } rel="preload">
                  <span>{ item.name }</span>
                </Link>
              </li>
            )

          })}
        </ul>
      </div>
    )
  }
}
