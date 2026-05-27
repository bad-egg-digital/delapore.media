import './BlockList.scss'
import { useEffect, useState } from 'react'
import Switchboard from '@views/components/Switchboard/Switchboard'

export default function BlockList({ id, postType, post }) {
  const [ blocks, setBlocks ] = useState(post?.blocks || [])
  const [ isLoaded, setIsLoaded ] = useState(false)

  const endpoint = `/wp-json/wp/v2/${ postType.graphqlPluralName.toLowerCase() }/${id}/blocks`

  useEffect( () => {
    if(id) {
      fetch( endpoint )
      .then( res => {
        if(!res.ok) throw new Error('Network error')
        return res.json()
      })
      .then( data => {
        setBlocks( data || [] );
        setIsLoaded( true );
      } )
      .catch((error) => {
        console.error('Error fetching blocks:', error)
        console.log(endpoint)
      });
    }

  }, [ endpoint ] )

  if(blocks.length > 0) {
    return (
      <div className="badegg-block-list">
        { blocks.map((block, index) => (
          <Switchboard  key={ index } index={ index } post={ post } postType={ postType } { ...block } />
        )) }
      </div>
    )
  }
}
