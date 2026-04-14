import './_header.scss';
import Logo from '@images/logo-delapore-media.png';
import { Link } from 'react-router-dom'

export default function Header({ items, companyName }) {

  return (
    <header className="menu-fixed">
      <div className="container inner inner-zero-x">
        <Link to="/" className="brand">
          <img src={ Logo } alt={ companyName || 'Delapore Media' } />
        </Link>

        <nav>
          <ul className="nolist">
            {items.map((item, index) => (
              <li key={ index }>
                <Link to={item.path} rel="preload">{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

      </div>
    </header>
  )
}
