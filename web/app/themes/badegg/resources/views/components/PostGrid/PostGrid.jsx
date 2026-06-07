import './PostGrid.scss'
import clsx from 'clsx'
import { queryArchive } from '@scripts/lib/graphql-queries'
import { AppContext } from '@views/layouts/AppContext'
import { useEffect, useState, useContext } from 'react'

import TermList from '@views/components/TermList/TermList'
import Posts from '@views/components/PostGrid/Posts'
import Card from '@views/components/Card/Card'

export default function PostGrid( props ) {
  const { appContext: { postTypes } } = useContext( AppContext )
  const [ posts, setPosts ] = useState([])
  const [ pageInfo, setPageInfo ] = useState({ endCursor: null, hasNextPage: true })
  const [ loading, setLoading ] = useState(false)
  const [ initialLoad, setInitialLoad ] = useState(false)

  const {
    postType,
    taxonomy,
    activeTerm,
  } = props

  const query = queryArchive( props )
  const terms = taxonomy?.connectedTerms?.nodes
  const primaryTaxonomy = postTypes.find( type => type.name === postType?.name)?.primaryTaxonomy?.graphqlSingleName || ''

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await fetch( badEggCupAPI.graphql, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          variables: { first: 12, after: pageInfo.endCursor }
        })
      });

      const result = await response.json();
      const data = result?.data?.[postType?.graphqlPluralName.toLowerCase()];

      if(data?.edges && data.edges.length > 0) {
        setPosts(prevPosts => [...prevPosts, ...data.edges.map(edge => edge.node)]);
        setPageInfo(data?.pageInfo);
        setLoading(false);
        setInitialLoad(true);
      } else {
        console.error('GraphQL query error:', result.errors);
        setLoading(false);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setLoading(false);
    }
  };

  const fetchMorePosts = () => {
    if (!loading && pageInfo.hasNextPage) {
      setLoading(true);
    }
  };

  useEffect(() => {
    setPosts([]);
    setPageInfo({ endCursor: null, hasNextPage: true});
  }, [ activeTerm, postType]);

  useEffect(() => {
    if (pageInfo.hasNextPage && !loading) {
      fetchData();
    }
  }, [ pageInfo, loading ]);

  const postGridClass = clsx(
    'section',
    'section-small',
    'section-zero-bottom',
    'postgrid',
    postType?.name && 'postgrid-' + postType?.name,
  )

  return (
    <section className="section section-postgrid">
      <div className="container container-large">

        <TermList
          key={ primaryTaxonomy }
          className="termlist-archive"
          items={ terms }
          postType={ postType }
          isLoaded={ true }
          state={{ preserveScroll: true }}
        />

        <Posts
          key={ postType?.name + activeTerm }
          posts={ posts }
          postType={ postType }
          primaryTaxonomy={ primaryTaxonomy }
          isLoaded={ initialLoad }
          showLoading={ true }
        />

      </div>
    </section>
  )
}
