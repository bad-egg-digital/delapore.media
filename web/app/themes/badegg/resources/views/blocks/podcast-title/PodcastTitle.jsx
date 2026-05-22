import './style.scss'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TermList from '@views/components/TermList/TermList'

export default function PodcastTitle( props ) {
  const { post, postType, attributes } = props
  const [ title, setTitle ] = useState('')
  const [ date, setDate ] = useState('')

  const {
    titlePrefix,
    attribution,
    hideTitlePrefix,
    hideDate,
    hideAttribution,
  } = attributes;

  useEffect(() => {
    setDate( post.date )
    setTitle( post.title )

  }, [ post, postType ])

  return (
    <div className="wp-block-badegg-podcast-title">
      { (!hideTitlePrefix || !hideDate) &&
        <div className={ `entry-meta ${ (!hideTitlePrefix && titlePrefix) ? 'has-prefix' : '' }` }>
          { !hideTitlePrefix && (
            <p className="podcast-title-prefix">{ titlePrefix }</p>
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

      { (!hideAttribution || attribution) &&
        <p className="podcast-title-subtitle">{ attribution }</p>
      }
    </div>
  )
}
