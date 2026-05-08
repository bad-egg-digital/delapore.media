import './Brand.scss';
import { useContext } from 'react'
import { Link } from 'react-router-dom'

import { AppContext } from '@views/layouts/AppContext'
import Icon from '@images/delapore-square.jpg';

export default function Brand({ companyName }) {
  const { appContext, setAppContext } = useContext( AppContext )

  const toggleMenu = () => {
    setTimeout( () => {
      setAppContext(prevState => ({
        ...prevState,
        menuOpen: !prevState.menuOpen,
      }));
    }, 300 )
  }

  return (
    <Link to="/" className="brand" onClick={ toggleMenu }>
      <i className="brand-icon"><img src={ Icon } alt="Delapore Rat" /></i>
      <span>{ companyName || 'Delapore Media' }</span>
    </Link>
  )
}
