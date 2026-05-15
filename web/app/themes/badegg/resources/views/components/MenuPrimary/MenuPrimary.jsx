import './MenuPrimary.scss';
import { AppContext } from '@views/layouts/AppContext'
import { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function MenuPrimary({ items }) {
  const { appContext, setAppContext } = useContext( AppContext )
  const location = useLocation()

  const closeMenu = () => {
    setTimeout( () => {
      setAppContext(prevState => ({
        ...prevState,
        menuOpen: false,
      }));
    }, 300 )
  }

  if(appContext?.menuPrimaryData) {
    return (
      <nav className="menu-primary">
        <ul className="nolist">
          { appContext.menuPrimaryData.map((item, index) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <li key={ index } className={ `menu-item ${ isActive ? 'active' : '' }` }>
                <Link viewTransition to={item.path} rel="preload" onClick={ closeMenu } >
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}

        </ul>
      </nav>
    )
  }
}
