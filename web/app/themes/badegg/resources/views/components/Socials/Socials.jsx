import './Socials.scss';
import { useEffect, useState } from 'react'
import parse from "html-react-parser"

export default function MenuSide() {
  const [ socials, setSocials ] = useState({})
  const [ isLoaded, setIsLoaded ] = useState(false)

  useEffect(() => {
    fetch( badEggAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        {
          badEggCup {
            company {
              socials {
                icon
                link
                svg
              }
            }
          }
        }
      ` }),
    })
      .then(res => res.json())
      .then(res => {
        setSocials(res.data.badEggCup.company.socials)
        setIsLoaded(true)
      })
  }, [])

  return (
    <ul className="socials nolist">
      { isLoaded && (
        <>
          { socials.map((item, index) => {
            return (
              <li key={ index } className={ `social-${ item.icon }` }>
                <a href={ item.link } target="_blank" rel="noindex nofollow">
                  { parse(item.svg) }
                </a>
              </li>
            )
          })}
        </>
      )}
    </ul>
  )
}
