import './BlockList.scss'
import { useEffect, useState } from 'react'
import Switchboard from '@views/components/Switchboard/Switchboard'

export default function BlockList({ id, postType, post }) {
  const [ blocks, setBlocks ] = useState(post.blocks)
  const [ isLoaded, setIsLoaded ] = useState(false)

  const endpoint = `/wp-json/wp/v2/${ postType.graphqlPluralName }/${id}/blocks`

  useEffect( () => {
    fetch( endpoint )
      .then( res => {
        if(!res.ok) throw new Error('Network error')
        return res.json()
      })
      .then( data => {
        setBlocks( Array.isArray(data) ? data : [] );
        setIsLoaded( true );
      } )
      .catch(() => {
        setBlocks([]);
        setIsLoaded( true );
      } );
  }, [ endpoint ] )

  if(Array.isArray(blocks) && blocks.length > 0) {
    return (
      <div className="badegg-block-list">
        { blocks.map((block, index) => (
          <Switchboard  key={ index } index={ index } post={ post } postType={ postType } { ...block } />
        )) }
      </div>
    )
  }
}
