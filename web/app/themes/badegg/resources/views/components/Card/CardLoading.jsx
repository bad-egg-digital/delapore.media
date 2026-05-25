import clsx from 'clsx'
import parse from "html-react-parser"
import { Link } from 'react-router-dom'
import TermList from '@views/components/TermList/TermList'

export default function CardLoading( props ) {

  const className = clsx(
    'card',
    'card-loading',
    'rounded',
    'border border-thinnest border-grey-lighter-a',
  )

  return (
    <article className={ className }>
      <header className="card-featured border border-grey-lighter-a border-bottom border-thinnest">
        <div className="card-featured-placeholder loading-sweep" />
      </header>
      <div className="card-content inner inner-small">
        <TermList className="card-terms" limit={ 2 } isLoaded={ false } />
        <h2 className="loading-sweep bg-grey-lightest-a">&nbsp;</h2>
        <div className="card-excerpt wysiwyg">
          <p>
            <span className="loading-sweep bg-grey-lightest-a">&nbsp;</span>
            <span className="loading-sweep bg-grey-lightest-a">&nbsp;</span>
          </p>
        </div>
      </div>
      <footer className="inner inner-small inner-unset-top">
        <span className="loading-sweep bg-grey-lightest-a card-more">&nbsp;</span>
      </footer>
    </article>
  )
}
