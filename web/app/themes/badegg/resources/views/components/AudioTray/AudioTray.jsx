import './AudioTray.scss'
import clsx from 'clsx'
import AudioPlayer from 'react-h5-audio-player'
import { AppContext } from '@views/layouts/AppContext'
import { useContext } from 'react'
import IconClose from '@images/circle-xmark-solid-full.svg?react'

export default function AudioTray( props ) {
  const {
    appContext,
    setAppContext,
  } = useContext( AppContext )

  const {
    audioTrayTitle,
    audioTrayLink,
    audioTrayDate,
    audioTraySrc,
    audioTrayPresent,
    audioTrayVisible,
  } = appContext

  const closeAudioTray = () => {
    setAppContext(prevState => ({
      ...prevState,
      audioTrayVisible: false,
    }));

    setTimeout( () => {
      setAppContext(prevState => ({
        ...prevState,
        audioTrayPresent: false,
      }));
    }, 300 )
  }

  if(audioTraySrc && audioTrayPresent) {
    return (
      <section className={ `audiotray bg-primary` }>
        <button
          role="button"
          className="audiotray-close"
          onClick={ closeAudioTray }
          aria-label="close audio player"
        >
          <IconClose />
        </button>
        <div className="section section-small container container-large">
          <AudioPlayer
            autoPlay
            src={ audioTraySrc }
            onPlay={e => console.log("onPlay")}
            // other props here
          />
        </div>
      </section>
    )
  }
}
