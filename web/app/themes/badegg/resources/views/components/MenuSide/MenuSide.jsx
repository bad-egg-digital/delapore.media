import './MenuSide.scss';
import { AppContext } from '@views/layouts/AppContext'
import { useContext } from 'react'

import Brand from '@views/components/Brand/Brand'
import MenuPrimary from '@views/components/MenuPrimary/MenuPrimary'
import IconClose from '@images/circle-xmark-solid-full.svg?react'
import Socials from '@views/components/Socials/Socials'

export default function MenuSide({ items, companyName }) {
  const { appContext, setAppContext } = useContext( AppContext )

  const closeMenu = () => {
    setAppContext(prevState => ({
      ...prevState,
      menuOpen: false,
    }));
  }

  return (
    <>
      <nav className="menu-side inner">
        <button role="button" className="block menu-side-close" onClick={ closeMenu } aria-label="close menu">
          <IconClose />
        </button>
        <div onClick={ closeMenu } >
          <Brand name={ companyName } icon={ true } />
        </div>
        <MenuPrimary items={ items } />
        <Socials />
      </nav>
      <div className="menu-side-closer" onClick={ closeMenu }/>
    </>
  )
}
