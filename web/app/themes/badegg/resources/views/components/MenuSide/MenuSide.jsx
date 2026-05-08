import './MenuSide.scss';
import { AppContext } from '@views/layouts/AppContext'
import { useContext } from 'react'

import Brand from '@views/components/Brand/Brand';
import MenuPrimary from '@views/components/MenuPrimary/MenuPrimary';

export default function MenuSide({ items, companyName }) {
  const { appContext, setAppContext } = useContext( AppContext )

  const toggleMenu = () => {
    setAppContext(prevState => ({
      ...prevState,
      menuOpen: !prevState.menuOpen,
    }));
  }

  return (
    <>
      <nav className="menu-side" >
        <div className="inner">
          <Brand name={ companyName } />
          <MenuPrimary items={ items } />
        </div>
      </nav>
      { appContext.menuOpen && (
        <div className="menu-side-closer" onClick={ toggleMenu }/>
      )}
    </>
  )
}
