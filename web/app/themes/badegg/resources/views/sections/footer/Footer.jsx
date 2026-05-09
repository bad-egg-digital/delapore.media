import './Footer.scss';
import { AppContext } from '@views/layouts/AppContext'
import { useContext } from 'react'

import Brand from '@views/components/Brand/Brand';
import Socials from '@views/components/Socials/Socials';

export default function Footer() {
  const { appContext, setAppContext } = useContext( AppContext )

  return (
    <footer className="content-info bg-black section">
      <div className="container container-small align-centre">
        <Brand name={ appContext.companyName } tagline={ true } />
        <Socials />
      </div>
    </footer>
  )
}
