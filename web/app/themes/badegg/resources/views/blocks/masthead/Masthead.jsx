import './style.scss'
import { AppContext } from '@views/layouts/AppContext'
import { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import TermList from '@views/components/TermList/TermList'

export default function Masthead( props ) {
  const { appContext: { postTypes } } = useContext( AppContext )
  const { post, postType, attributes } = props
  const { titlePrefix, title, subtitle, date, terms: { nodes = {}} } = post

  const {
    hideTerms,
    hideDate,
    hideTitlePrefix,
    hideSubtitle,
  } = attributes;

  const primaryTaxonomy = postTypes.find( type => type.name === postType?.name)?.primaryTaxonomy?.graphqlSingleName

  return (
    <div className="wp-block-badegg-masthead">
      { (!hideTerms || !hideDate || !hideTitlePrefix) &&
        <div className="masthead-meta">

          { !hideTerms && nodes.length > 0 && (
            <TermList
              className="masthead-terms"
              items={ nodes }
              primaryItem={ primaryTaxonomy && post?.[ primaryTaxonomy + 'PrimaryTerm' ] }
              isLoaded={ true }
            />
          )}

          { !hideTitlePrefix && titlePrefix &&
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
