import './_header.scss';
import Logo from '@images/logo-delapore-media.png';

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  const [ headerLoaded, setHeaderLoaded ] = useState(false)
  const [ companyName, setCompanyName] = useState('Loading...')
  const [ items, setItems] = useState([{ label: 'Home', path: '/' }])

  useEffect(() => {
    fetch( badEggAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        {
          badEggCup {
            company {
              name
            }
          }
          menuItems(where: { location: PRIMARY_NAVIGATION }) {
            nodes {
              label
              path
            }
          }
        }
      ` }),
    })
      .then(res => res.json())
      .then(res => {
        setItems(res.data.menuItems.nodes)
        setCompanyName(res.data.badEggCup.company.name)
        setHeaderLoaded(true);
      })
  }, [])

  if(items) {
    return (
      <header className="menu-fixed">
        <div className="container inner inner-zero-x">
          <Link to="/" className="brand">
            <img src={ Logo } alt={ companyName } />
          </Link>

          <nav>
            <ul className="nolist">
              {items.map((item, index) => (
                <li key={ index }>
                  <Link  to={item.path}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    )
  }
}
