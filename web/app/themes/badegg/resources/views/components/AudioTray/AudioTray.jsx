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
      audioTrayOffset: 0,
    }))

    setTimeout( () => {
      setAppContext(prevState => ({
        ...prevState,
        audioTrayTitle: '',
        audioTrayLink: '',
        audioTrayDate: '',
        audioTraySrc: '',
        audioTrayPresent: false,
      }));
    }, 300 )
  }

  if(audioTraySrc && audioTrayPresent) {
    return (
      <section
        className={ clsx(
          'audiotray',
          audioTrayVisible && 'audiotray-visible',
        ) }
      >
        <div className="section section-small container container-narrow">
          <div className="audiotray-inner">
            <button
              role="button"
              className="audiotray-close"
              onClick={ closeAudioTray }
              aria-label="close audio player"
            >
              <span className="visually-hidden">Close Audio Player</span>
              <IconClose />
            </button>
            <AudioPlayer
              className="audiotray-player"
              autoPlay
              src={ audioTraySrc }
              onPlay={e => console.log("onPlay")}
              // other props here
            />
          </div>
        </div>
      </section>
    )
  }
}
