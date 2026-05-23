import './AudioPlay.scss'
import IconPlay from '@images/circle-play-solid-full.svg?react'
import { AppContext } from '@views/layouts/AppContext'
import { useContext } from 'react'

export default function AudioPlay( props ) {
  const { appContext, setAppContext } = useContext( AppContext )

  const {
    postTitle,
    postLink,
    postDate,
    length_formatted,
    uri,
    hideLabel,
  } = props

  const loadAudioTray = () => {
    setAppContext(prevState => ({
      ...prevState,
      audioTrayTitle: postTitle,
      audioTrayLink: postLink,
      audioTrayDate: postDate,
      audioTraySrc: uri,
      audioTrayPresent: true,
    }))

    setTimeout( () => {
      setAppContext(prevState => ({
        ...prevState,
        audioTrayVisible: true,
      }));
    }, 300 )
  }

  return (
    <button
      className="block audioplay"
      aria-label="Play podcast episode audio"
      onClick={ loadAudioTray }
    >
      <IconPlay />

      { !hideLabel &&
        <>
          <span>Play Episode</span>

          { length_formatted &&
            <small>{ length_formatted }</small>
          }
        </>
      }
    </button>
  )
}
