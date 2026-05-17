import './TermList.scss'
import { Link, useLocation } from 'react-router-dom'
import parse from "html-react-parser"
import clsx from 'clsx'

export default function TermList( props) {
  const {
    className,
    items,
    active,
    contentType,
    limit,
    isLoaded,
   } = props

  const location = useLocation()
  let itemList = (items && items.length > 0) ? items.filter( value => Object.keys(value).length !== 0) : []

  if(limit && itemList.length > 0) itemList = itemList.slice(0, limit)

  return (
    <div className={ `termlist ${ className || '' }` }>
      <ul className="nolist">
        { isLoaded ? (
          <>
            { contentType &&
              <li className={ clsx(
                'termlist-item-all',
                (contentType.uri === location.pathname) && `active`,
              )}>
                { (contentType.uri === location.pathname) ? (
                  <span>All { contentType.label }</span>
                ):(
                  <Link to={ contentType.uri }>
                    All { contentType.label }
                  </Link>
                )}
              </li>
            }

            { itemList.length > 0 && (
              <>
                { itemList.map((item, index) =>  {
                  const isActive = location.pathname === item.uri ? true : false;

                  let termClass = clsx(
                    'termlist-term-' + item.slug,
                    (isActive) && `active`,
                  )

                  return (
                    <li key={ index } className={ termClass }>
                      <Link to={ item.uri } rel="preload">
                        { item.name }
                      </Link>
                    </li>
                  )

                })}
              </>
            )}
          </>
        ) : (
          <>
            { [...Array(limit || 3).keys()].map( x => {

              return (
                <li key={ `loading-term-${ x }` } className="termlist-term-loading">
                  <span className="loading-sweep">&nbsp;</span>
                </li>
              )

            })}
          </>
        )}

      </ul>
    </div>
  )
}
