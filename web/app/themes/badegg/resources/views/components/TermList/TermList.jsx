import './TermList.scss'
import { Link, useLocation } from 'react-router-dom'
import parse from "html-react-parser"
import clsx from 'clsx'

export default function TermList( props) {
  const {
    className,
    items = [],
    postType,
    limit,
    isLoaded,
   } = props

  const location = useLocation()
  const itemList = (limit && items.length > 0) ? items.slice(0, limit) : items

  return (
    <div className={ `termlist ${ className || '' }` }>
      <ul className="nolist">
        { isLoaded ? (
          <>
            { postType &&
              <li className={ clsx(
                'termlist-item-all',
                (postType.uri === location.pathname) && `active`,
              )}>
                { (postType.uri === location.pathname) ? (
                  <span>All { postType.label }</span>
                ):(
                  <Link to={ postType.uri }>
                    All { postType.label }
                  </Link>
                )}
              </li>
            }

            { itemList.length > 0 && (
              <>
                { itemList.map((item, index) =>  {
                  if('count' in item && item?.count < 1) return;

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
