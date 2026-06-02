import './Footer.scss';
import { AppContext } from '@views/layouts/AppContext'
import { useContext, useEffect, useState } from 'react'
import clsx from 'clsx'

import Brand from '@views/components/Brand/Brand';
import Socials from '@views/components/Socials/Socials';

export default function Footer({ isLoaded }) {
  const currentYear = new Date().getFullYear();
  const { appContext, setAppContext } = useContext( AppContext )
  const [ audioTrayOffset, setAudioTrayOffset ] = useState(0)

  useEffect( () => {
    const audioTrayHeight = () => {
      const audioTray = document.querySelector('.audiotray');
      return (audioTray) ? audioTray.offsetHeight : 0;
    }

    setAudioTrayOffset(audioTrayHeight);
  }, [ appContext?.audioTrayPresent ])

  return (
    <footer
      style={{ paddingBottom: audioTrayOffset || 0 }}
      className={clsx(
        'content-info',
        !isLoaded && 'loading-nudge-down'
      )}
    >
      <div className="section container container-narrow align-centre">
        <Brand name={ appContext?.companyName } tagline={ true } />
        <Socials />
        <p className="copyright">
          <span>&copy;{ ( currentYear == 2026 ) ? currentYear : '2026-' + currentYear } { appContext?.company?.nameLegal || '' },</span>
          <span>All Rights Reserved</span>
        </p>
      </div>
    </footer>
  )
}
