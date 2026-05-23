import './style.scss'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TermList from '@views/components/TermList/TermList'

export default function Masthead( props ) {
  const { post, postType, attributes } = props
  const [ title, setTitle ] = useState('')
  const [ date, setDate ] = useState('')
  const [ terms, setTerms ] = useState({})

  const {
    titlePrefix,
    subtitle,
    hideTerms,
    hideDate,
    hideTitlePrefix,
    hideSubtitle,
  } = attributes;

  useEffect(() => {
    if(post?.terms?.nodes) {
      setTerms( post.terms.nodes )
    }

    setDate( post.date )
    setTitle( post.title )

  }, [ post, postType ])

  return (
    <div className="wp-block-badegg-masthead">
      { (!hideTerms || !hideDate || !hideTitlePrefix) &&
        <div className="masthead-meta">

          { !hideTerms && (
            <TermList
              className="masthead-terms"
              items={ terms }
              isLoaded={ true }
            />
          )}

          { !hideTitlePrefix &&
            <p className="masthead-prefix">{ titlePrefix }</p>
          }

          { !hideDate &&
            <time className="masthead-date" dateTime={ date }>
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

      <h1 className="masthead-title">{ title }</h1>

      { !hideSubtitle &&
        <p className="masthead-subtitle">{ subtitle }</p>
      }
    </div>
  )
}
