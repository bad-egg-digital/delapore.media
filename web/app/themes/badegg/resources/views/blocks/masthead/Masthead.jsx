import './style.scss'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Masthead( props ) {
  const { post, postType } = props

  const [ title, setTitle ] = useState('')
  const [ date, setDate ] = useState('')
  const [ categories, setCategories ] = useState({})

  useEffect(() => {
    if(postType === 'post') {
      const terms = post.terms.nodes
      const cats = terms.filter( node => node.taxonomyName === 'category')
      const published = new Date(post.date)

      const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }

      setDate( published.toLocaleDateString('en-US', dateOptions))
      setCategories( cats )
      setTitle( post.title )
    }
  }, [ post, postType ])

  return (
    <div className="wp-block-badegg-masthead">
      <div className="entry-meta">
        { categories.length > 0 && (
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

        <time>{ date }</time>
      </div>

      <h1>{ title }</h1>
    </div>
  )
}
