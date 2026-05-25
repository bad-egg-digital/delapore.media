export function querySingle( slug, postType, )
{
  let queryTerms = ''
  let queryBlocks = ''
  let queryWhere = ''
  let podcastFields = ''
  let primaryTerm = ''

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

  if(postType?.name === 'podcast') {
    podcastFields = `
      episodeAudio
      episodeContent
    `
  }

  if(['page', 'post', 'podcast'].includes(postType?.name)) {
    queryBlocks = `blocks {
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
    }`
  }

  let query = `
    {
      ${ postType?.graphqlSingleName?.toLowerCase() }(id: "${ slug || '/' }", idType: URI) {
        id
        slug
        title
        excerpt
        date
        databaseId
        ${ podcastFields }
        ${ queryBlocks }
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
      productPrice
      productOffsiteURL
      productCoverID
      productOffsiteURL
    `
  }

  let query = `
    {
      ${ postType.graphqlPluralName.toLowerCase() }${ queryWhere } {
        nodes {
          id
          slug
          title
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
            title
            content
            excerpt
            databaseId
            uri
            blocks {
              attributes
              content
              name
              rawContent
              innerBlocks {
                index
                name
                attributes
                content
                rawContent
              }
            }
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
