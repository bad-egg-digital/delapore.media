import { useEffect, useState } from 'react'
import Socials from "@views/components/Socials/Socials"

export default function ContactSocials({ attributes }) {
  const {
    heading,
    description,
   } = attributes

  return (
    <div className="wp-block-contact-method contact-method-card contact-method-socials card-opaque inner inner-small">
      <h2 className="section-title">{ heading }</h2>
      <p>{ description }</p>
      <hr/>
      <div className="contact-method-card-detail">
        <Socials />
      </div>
    </div>
  )

}
