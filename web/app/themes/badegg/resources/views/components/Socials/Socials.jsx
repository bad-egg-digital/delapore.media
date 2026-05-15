import './Socials.scss';
import { AppContext } from '@views/layouts/AppContext'
import { useContext } from 'react'
import parse from "html-react-parser"

export default function MenuSide() {
  const { appContext, setAppContext } = useContext( AppContext )

  if(appContext?.company?.socials) {
    return (
      <ul className="socials nolist">
        { appContext.company.socials.map((item, index) => {
          return (
            <li key={ index } className={ `social-${ item.icon }` }>
              <a href={ item.link } target="_blank" rel="noindex nofollow">
                { parse(item.svg) }
              </a>
            </li>
          )
        })}
      </ul>
    )
  }
}
