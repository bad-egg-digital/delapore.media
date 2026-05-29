import Delibird from '@views/components/Delibird/Delibird';

export default function ContactDelibird({ attributes }) {
  const {
    heading,
    description,
   } = attributes

  return (
    <div className="wp-block-contact-method contact-method-card contact-method-delibird inner inner-small">
      <Delibird />
    </div>
  )

}
