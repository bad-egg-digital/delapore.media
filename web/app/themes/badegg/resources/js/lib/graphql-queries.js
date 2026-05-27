export function querySingle({ id = 0, slug, postType })
{
  let pageWhere = `id: "${ slug || '/' }", idType: URI`
  let queryTerms = ''
  let queryBlocks = ''
  let queryWhere = ''
  let podcastFields = ''
  let productFields = ''
  let primaryTerm = ''

  if(id) {
    pageWhere = `id: "${ id }", idType: DATABASE_ID`
  }

  if(postType?.primaryTaxonomy) {
    let primaryTaxonomy =  (postType?.name === 'post') ? 'category' : postType?.primaryTaxonomy?.graphqlSingleName

    queryWhere = `(where: {taxonomies: ${ primaryTaxonomy.toUpperCase() }})`

    primaryTerm = `${ primaryTaxonomy }PrimaryTerm {
      name
      slug
      uri
    }`
  }

  if(postType?.name !== 'page') {
    queryTerms = `terms${ queryWhere } {
      nodes {
        databaseId
        uri
        name
        slug
        taxonomyName
        count
      }
    }`
  }

  if(postType?.name === 'product') {
    productFields = `
      productCoverImage
      productCoverID
      productPrice
      productPriceDiscount
      productOffsiteURL
    `
  }

  if(postType?.name === 'podcast') {
    podcastFields = `
      episodeAudio
      episodeContent
    `
  }

  let query = `
    {
      ${ postType?.graphqlSingleName?.toLowerCase() }(${ pageWhere }) {
        id
        slug
        titlePrefix
        title
        subtitle
        excerpt
        date
        databaseId
        ${ productFields }
        ${ podcastFields }
        blocks {
          index
          name
          attributes
          content
          rawContent
          innerBlocks {
            index
            name
            attributes
            content
            rawContent
          }
        }
        ${ primaryTerm }
        ${ queryTerms }
      }
    }
  `;

  return query;
}

export function queryArchive({ postType, taxonomy, activeTerm })
{
  let queryWhere = ''
  let termsWhere = ''
  let podcastFields = ''
  let productFields = ''
  let primaryTerm = ''

  if(activeTerm && taxonomy?.graphqlSingleName) {
    queryWhere = `(where: { ${ taxonomy.graphqlSingleName }Name: "${ activeTerm }" })`
  }

  if(taxonomy && taxonomy?.graphqlSingleName) {
    termsWhere = `(where: { taxonomies: ${ taxonomy.graphqlSingleName.toUpperCase() } })`
    primaryTerm = `${ taxonomy.graphqlSingleName }PrimaryTerm {
      name
      slug
      uri
    }`
  }

  if(postType?.name === 'podcast') {
    podcastFields = `
      episodeAudio
      episodeContent
    `
  }

  if(postType?.name === 'product') {
    productFields = `
      productCoverImage
      productCoverID
      productPrice
      productPriceDiscount
      productOffsiteURL
    `
  }

  let query = `
    {
      ${ postType.graphqlPluralName.toLowerCase() }${ queryWhere } {
        nodes {
          id
          slug
          titlePrefix
          title
          subtitle
          excerpt
          date
          uri
          ${ podcastFields }
          ${ productFields }
          featuredImage {
            node {
              altText
              sourceUrl
              srcSet
              title
              mediaDetails {
                width
                height
              }
            }
          }
          terms${ termsWhere } {
            nodes {
              name
              slug
              uri
            }
          }
          ${ primaryTerm }
        }
      }
    }
  `

  return query
}

export function queryApp()
{
  let query = `
    {
      badEggCup {
        company {
          name
          nameLegal
          socials {
            icon
            link
            svg
          }
        }
      }
      menuItems(where: { location: PRIMARY_NAVIGATION }) {
        nodes {
          label
          path
        }
      }
      contentType(id: "page", idType: NAME) {
        name
        graphqlPluralName
        graphqlSingleName
      }
      contentTypes {
        nodes {
          name
          label
          uri
          graphqlSingleName
          graphqlPluralName
          pageForArchive {
            slug
            databaseId
          }
          primaryTaxonomy {
            name
            label
            uri
            graphqlSingleName
            graphqlPluralName
            connectedTerms {
              nodes {
                count
                name
                slug
                uri
              }
            }
          }
        }
      }
    }
  `

  return query;
}
