import '@views/components/PostGrid/PostGrid.scss'
import './style.scss'

import parse from "html-react-parser"
import { AppContext } from '@views/layouts/AppContext'
import { useContext, useState, useEffect, useRef } from 'react'
import { CSSTransition } from 'react-transition-group';

import Block from '@views/layouts/Block'
import Posts from '@views/components/PostGrid/Posts'
import { Link, useLocation } from 'react-router-dom'
import { queryBlockPostGrid } from "@scripts/lib/graphql-queries"

export default function PostGrid( props ) {
  const { post, postType, attributes } = props
  const { aboutPageID, podcastPageID } = attributes
  const { appContext, setAppContext } = useContext( AppContext )
  const nodeRef = useRef(null);
  const [ linkedPage, setLinkedPage ] = useState({});
  const [ posts, setPosts ] = useState([]);
  const [ isLoaded, setIsLoaded ] = useState(false);

  const {
    heading,
    blurb,
    selectPostType,
    postSource = 'latest',
    linkedPageID,
    linkedPageButton,
    allButton,
    hideFirst,
  } = attributes;

  const selectPostTypeObj = appContext?.postTypes.find( type => type.name === selectPostType ) || {}

  const query = queryBlockPostGrid({
    currentPost: post,
    postType: selectPostTypeObj,
    source: postSource,
    linkedPageID: linkedPageID,
    hideFirst: hideFirst,
  })

  useEffect(() => {
    fetch( badEggCupAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    })
      .then(res => res.json())
      .then(res => {
        let items = []

        if(postSource === 'beforeAfter') {
          if(res?.data?.after?.nodes)
            items = items.concat(res.data.after.nodes);

          if(res?.data?.before?.nodes)
            items = items.concat(res.data.before.nodes);

          if(items.length > 3) {
            items = items.slice(0, 3);
          }
        }

        if('related' in res?.data) {
          items = items.concat(res.data.related.nodes);
        }

        if('latest' in res?.data) {
          items = items.concat(res.data.latest.nodes);

          if(hideFirst) {
            items = items.slice(1);
          }
        }

        setLinkedPage(res?.data?.linkedPage);
        setPosts(items);
        setIsLoaded(true);
      })
      .catch( error => {
        console.error('Error fetching page:', error)
        console.log(query)
      })
  }, [])

  if(posts.length > 0 && isLoaded) {
    return (
      <Block className="wp-block-badegg-postgrid" attributes={ attributes }>
        { heading &&
          <div className="titlebar titlebar-embellished align-centre inner inner-bottom wysiwyg">
            <h2>{ heading }</h2>
            { blurb &&
              <p>{ blurb }</p>
            }
          </div>
        }

        <div className="section-postgrid">
          <Posts
            posts={ posts }
            postType={ postType }
            primaryTaxonomy={ postType?.primaryTaxonomy }
            isLoaded={ isLoaded }
            showLoading={ true }
          />
        </div>

        { selectPostType &&
          <div className="footerbar align-centre inner inner-top wysiwyg">
            <div className="btn-wrap">
              <Link to={ `/${ selectPostTypeObj?.pageForArchive?.slug }/` } className="btn primary">{ allButton || 'View all' }</Link>

              { linkedPage && 'uri' in linkedPage &&
                <Link to={ linkedPage.uri } className="btn white outline">{ linkedPageButton || 'Learn more' }</Link>
              }
            </div>
          </div>
        }
      </Block>
    )
  }
}
