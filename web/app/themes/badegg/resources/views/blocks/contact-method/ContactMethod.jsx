import { useEffect, useState } from 'react'
import { AppContext } from '@views/layouts/AppContext'
import { useContext } from 'react'

export default function ContactMethod({ attributes }) {
  const { appContext, setAppContext } = useContext( AppContext )

  const {
    heading,
    description,
    method,
   } = attributes

  if(method && appContext?.company?.[method]) {
    return (
      <div className="contact-method-card contact-method-single card-opaque inner inner-small">
        <h2 className="section-title">{ heading }</h2>
        <p>{ description }</p>
        <hr/>
        <div className="contact-method-card-detail">
          { method === 'email' &&
            <p><a href={ `mailto:${ appContext.company.email }`} >{ appContext.company.email }</a></p>
          }

          { method === 'tel' &&
            <p><a href={ `tel:${ appContext.company.tel }`} >{ appContext.company.tel }</a></p>
          }
        </div>
      </div>
    )
  }
}
