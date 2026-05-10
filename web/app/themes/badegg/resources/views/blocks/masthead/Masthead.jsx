import './style.scss'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Masthead( props ) {
  const { post, postType, attributes } = props
  const [ title, setTitle ] = useState('')
  const [ date, setDate ] = useState('')
  const [ categories, setCategories ] = useState({})
  const { hideCategories, hideDate } = attributes;

  useEffect(() => {
    if(postType === 'post') {
      const terms = post.terms.nodes
      const cats = terms.filter( node => node.taxonomyName === 'category')

      setDate( post.date )
      setCategories( cats )
      setTitle( post.title )
    }
  }, [ post, postType ])

  return (
    <div className="wp-block-badegg-masthead">
      { (!hideCategories || !hideDate) &&
        <div className={ `entry-meta ${ (!hideCategories && categories.length > 0) ? 'has-categories' : '' }` }>
          { (!hideCategories && categories.length > 0) && (
            <ul className="masthead-categories nolist">
              { categories.map((item, index) =>  (
                <li key={ index } className={ `category-${ item.slug }` }>
                  <Link to={ item.uri } rel="preload">
                    <span>{ item.name }</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          { !hideDate &&
            <time dateTime={ date }>
              {
                new Date(date).toLocaleDateString(
                  'en-US',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                )
              }
            </time>
          }
        </div>
      }

      <h1>{ title }</h1>
    </div>
  )
}
