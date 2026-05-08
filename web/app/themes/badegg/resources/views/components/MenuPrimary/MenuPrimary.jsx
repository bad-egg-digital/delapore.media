import './MenuPrimary.scss';
import { AppContext } from '@views/layouts/AppContext'
import { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function MenuPrimary({ items }) {
  const { appContext, setAppContext } = useContext( AppContext )
  const location = useLocation()

  const toggleMenu = () => {
    setTimeout( () => {
      setAppContext(prevState => ({
        ...prevState,
        menuOpen: !prevState.menuOpen,
      }));
    }, 300 )
  }

  return (
    <nav className="menu-primary">
      <ul className="nolist">
        {items.map((item, index) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <li key={ index } className={ `menu-item ${ isActive ? 'active' : '' }` }>
              <Link to={item.path} rel="preload" onClick={ toggleMenu }>
                <span>{item.label}</span>
              </Link>
            </li>
          )
        })}

      </ul>
    </nav>
  )
}
