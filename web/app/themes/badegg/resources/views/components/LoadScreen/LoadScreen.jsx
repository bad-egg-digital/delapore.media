import './LoadScreen.scss'
import clsx from 'clsx'
import Delibird from '@views/components/Delibird/Delibird'
import { useEffect, useState } from 'react'

export default function LoadScreen({ isLoaded }) {
  const [ isRendered, setIsRendered ] = useState( true )

  useEffect(() => {
    setTimeout( () => {
      setIsRendered( !isLoaded )
    }, 300 )
  }, [ isLoaded ])

  if(isRendered) {
    return (
      <div className={ clsx(
        'load-screen',
        !isLoaded && 'load-screen-loading',
        'align-centre',
        'inner',
      )}>
        <div>
          <Delibird />
          <p>Loading</p>
        </div>
      </div>
    )
  }
}
