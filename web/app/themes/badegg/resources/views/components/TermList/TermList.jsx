import './TermList.scss'
import { Link, useLocation } from 'react-router-dom'
import parse from "html-react-parser"
import clsx from 'clsx'

export default function TermList( props) {
  const {
    className,
    items = [],
    primaryItem,
    postType,
    limit,
    isLoaded,
    state,
   } = props

  const location = useLocation()

  let itemList = items

  if(primaryItem) {
    // https://stackoverflow.com/a/36192641/10585540
    itemList.unshift(                               // add to the front of the array
      itemList.splice(                              // the result of deleting items
        itemList.findIndex(                         // starting with the index where
          item => item.slug === primaryItem.slug),  // the slug matches
      1)[0]                                         // and continuing for one item
    )
  }

  itemList = (limit && items.length > 0) ? items.slice(0, limit) : items

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
                  <Link to={ postType.uri } state={ state }>
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
                    (item.slug === primaryItem?.slug) && 'termlist-term-primary',
                  )

                  return (
                    <li key={ index } className={ termClass }>
                      <Link to={ item.uri } rel="preload" state={ state }>
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
