import './style.scss'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TermList from '@views/components/TermList/TermList'

export default function Masthead( props ) {
  const { post, postType, attributes } = props
  const [ title, setTitle ] = useState('')
  const [ date, setDate ] = useState('')
  const [ terms, setTerms ] = useState({})
  const { hideCategories, hideDate } = attributes;

  useEffect(() => {
    if(post?.terms?.nodes) {
      setTerms( post.terms.nodes )
    }

    setDate( post.date )
    setTitle( post.title )

  }, [ post, postType ])

  return (
    <div className="wp-block-badegg-masthead">
      { (!hideCategories || !hideDate) &&
        <div className={ `entry-meta ${ (!hideCategories && terms.length > 0) ? 'has-categories' : '' }` }>
          { !hideCategories && (
            <TermList
              className="masthead-categories"
              items={ terms }
              isLoaded={ true }
            />
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
