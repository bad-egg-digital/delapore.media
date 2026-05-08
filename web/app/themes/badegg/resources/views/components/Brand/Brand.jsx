import './Brand.scss';
import { Link } from 'react-router-dom'
import Icon from '@images/delapore-square.jpg';

export default function Brand({ companyName }) {
  return (
    <Link to="/" className="brand">
      <i className="brand-icon"><img src={ Icon } alt="Delapore Rat" /></i>
      <span>{ companyName || 'Delapore Media' }</span>
    </Link>
  )
}
