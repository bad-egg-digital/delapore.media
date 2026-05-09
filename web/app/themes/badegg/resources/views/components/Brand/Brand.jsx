import './Brand.scss';
import { AppContext } from '@views/layouts/AppContext'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import Icon from '@images/delapore-square.jpg';

export default function Brand({ tagline, icon }) {
  const { appContext, setAppContext } = useContext( AppContext )

  return (
    <Link to="/" className="brand">
      { icon && <i className="brand-icon"><img src={ Icon } alt="Delapore Rat" /></i> }
      <div>
        <span>{ appContext.companyName || 'Delapore Media' }</span>
        { tagline && <small>Toward Verisimilitude in Tabletop Role-Playing</small> }
      </div>
    </Link>
  )
}
