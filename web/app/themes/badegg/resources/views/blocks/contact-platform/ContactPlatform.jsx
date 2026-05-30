import isUriValid from "@scripts/lib/isUriValid"

export default function ContactPlatform({ attributes }) {
  const {
    heading,
    description,
    logo_url,
    logo_alt,
    logo_width,
    logo_height,
    platformLink,
  } = attributes

  const Link = ({ children }) => {
    return (
      <a href={ platformLink } target="_blank" rel="noopen nofollow">
        { children }
      </a>
    )
  }

  const Logo = () => {
    return (
      <img
        className="contact-method-platform-logo"
        src={ logo_url }
        width={ logo_width }
        height={ logo_height }
        alt={ logo_alt }
        loading="lazy"
      />
    )
  }

  return (
    <div className="wp-block-contact-method contact-method-card contact-method-platform card-opaque inner inner-small">
      <h2 className="section-title">{ heading }</h2>
      <p>{ description }</p>
      <hr/>
      <div className="contact-method-card-detail">

        { platformLink && isUriValid(platformLink) ? (
          <Link><Logo/></Link>
        ) : (
          <Logo />
        )}

      </div>
    </div>
  )

}
