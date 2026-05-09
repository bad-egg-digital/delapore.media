import './Footer.scss';
import { AppContext } from '@views/layouts/AppContext'
import { useContext } from 'react'

import Brand from '@views/components/Brand/Brand';
import Socials from '@views/components/Socials/Socials';

export default function Footer() {
  const { appContext, setAppContext } = useContext( AppContext )
  const currentYear = new Date().getFullYear();

  return (
    <footer className="content-info section">
      <div className="container container-narrow align-centre">
        <Brand name={ appContext.companyName } tagline={ true } />
        <Socials />
        <p className="copyright">
          <span>&copy;{ ( currentYear == 2026 ) ? currentYear : '2026-' + currentYear } { appContext.company.nameLegal },</span>
          <span>All Rights Reserved</span>
        </p>
      </div>
    </footer>
  )
}
