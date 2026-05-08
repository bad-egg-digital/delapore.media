import './MenuToggle.scss';
import { AppContext } from '@views/layouts/AppContext'
import { useContext } from 'react'

export default function MenuToggle( props ) {
  const { appContext, setAppContext } = useContext( AppContext )

  const toggleMenu = () => {
    setAppContext(prevState => ({
      ...prevState,
      menuOpen: !prevState.menuOpen,
    }));
  }

  return (
    <button
      className={ `block menu-toggle ${ appContext.menuOpen ? 'menu-open' : '' }` }
      type="button" command="toggle-popover"
      aria-expanded={ appContext.menuOpen ? true : false }
      aria-controls="menu-side"
      onClick={ toggleMenu }
    >
      <span className="menu-toggle-label">Menu</span>
      <span className="menu-toggle-hamburger"><i/><i/><i/></span>
    </button>
  )
}
