const podcastFields = `
  episodeAudio
  episodeContent
`;

const productFields = `
  productCoverImage
  productCoverID
  productPrice
  productPriceDiscount
  productOffsiteURL
`;

export function querySingle({ id = 0, slug, postType })
{
  let pageWhere = `id: "${ slug || '/' }", idType: URI`
  let queryTerms = ''
  let queryBlocks = ''
  let queryWhere = ''
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
        ${ postType?.name === 'podcast' ? podcastFields : '' }
        ${ postType?.name === 'product' ? productFields : '' }
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
        autodescription {
          title
          description
          canonicalUri
          ogTitle
          ogDescription
          ogImage
          ogImageHeight
          ogImageWidth
        }
      }
    }
  `;

  return query;
}

export function queryArchive({ postType, taxonomy, activeTerm })
{
  let queryWhereTax = ''
  let termsWhere = ''
  let primaryTerm = ''
  let queryArchiveTerms = ''

  if(activeTerm && taxonomy?.graphqlSingleName) {
    queryWhereTax = `${ taxonomy.graphqlSingleName }Name: "${ activeTerm }"`
  }

  if(taxonomy && taxonomy?.graphqlSingleName) {
    queryArchiveTerms = `
      ${ taxonomy.graphqlPluralName } (
        first: 100
        where: {
          orderby: COUNT,
          order: DESC
        }
      ) {
        nodes {
          count
          name
          slug
          uri
        }
      }
    `;
    termsWhere = `(where: { taxonomies: ${ taxonomy.graphqlSingleName.toUpperCase() } })`
    primaryTerm = `${ taxonomy.graphqlSingleName }PrimaryTerm {
      name
      slug
      uri
    }`
  }

  let query = `
    query GetPosts( $first: Int!, $after: String ) {
      ${ postType.graphqlPluralName.toLowerCase() }(
        first: $first,
        after: $after,
        where: {
          orderby: {
            field: DATE,
            order: DESC
          }
          ${ queryWhereTax }
        }
      ) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          cursor
          node {
            id
            slug
            titlePrefix
            title
            subtitle
            excerpt
            date
            uri
            ${ postType?.name === 'podcast' ? podcastFields : '' }
            ${ postType?.name === 'product' ? productFields : '' }
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
      ${ queryArchiveTerms }
    }
  `

  return query
}

export function queryFrontCover({ about, podcast }) {
  let aboutQuery = '';
  let podcastQuery = '';

  if(about) {
    aboutQuery = `
      about:page(id: "${ about }", idType: DATABASE_ID) {
        slug
        titlePrefix
        title
        subtitle
        excerpt
        uri
      }
    `
  }

  if(podcast) {
    podcastQuery = `
      podcast:page(id: "${ podcast }", idType: DATABASE_ID) {
        slug
        titlePrefix
        title
        subtitle
        excerpt
        uri
      }
    `
  }

  if(about || podcast) {
    return `{
        podcasts(first: 3) {
        nodes {
          date
          title
          slug
          uri
          episodeAudio
        }
      }
      ${ aboutQuery }
      ${ podcastQuery }
    }`
  }
}

export function queryBlockPostGrid( props )
{
  const {
    linkedPageID,
    source,
    currentPost,
    postType,
    hideFirst,
  } = props;

  const dateObject = new Date(currentPost?.date || '');
  const year = dateObject.getFullYear();
  const month = dateObject.getMonth() + 1;
  const day = dateObject.getDate();

  let queryLinkedPage = '';
  let queryPosts = '';
  let termsWhere = '';
  let primaryTerm = '';
  let queryBeforeAfter = '';
  let queryLatest = '';

  if(postType?.primaryTaxonomy && postType?.primaryTaxonomy?.graphqlSingleName) {
    termsWhere = `(
      where: {
        taxonomies: ${ postType.primaryTaxonomy.graphqlSingleName.toUpperCase() }
      }
    )`;

    primaryTerm = `${ postType?.primaryTaxonomy.graphqlSingleName }PrimaryTerm {
      name
      slug
      uri
    }`;
  }

  let nodes = `nodes {
    id
    slug
    titlePrefix
    title
    subtitle
    excerpt
    date
    uri
    ${ postType?.name === 'podcast' ? podcastFields : '' }
    ${ postType?.name === 'product' ? productFields : '' }
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
  }`;

  switch (source) {
    case 'beforeAfter':
      queryPosts = `
        before: ${ postType.graphqlPluralName.toLowerCase() }(
          first: 2
          where: {
            orderby: {
              field: DATE,
              order: DESC
            },
            dateQuery: {
              before: {
                day: ${ day },
                month: ${ month },
                year: ${ year }
              }
            }
          }
        ) {
          ${ nodes }
        }
        after: ${ postType.graphqlPluralName.toLowerCase() }(
          first: 2
          where: {
            orderby: {
              field: DATE,
              order: DESC
            },
            dateQuery: {
              after: {
                day: ${ day },
                month: ${ month },
                year: ${ year }
              }
            }
          }
        ) {
          ${ nodes }
        }
      `;

      break;

    case 'latest':
      queryPosts = `
        latest: ${ postType.graphqlPluralName.toLowerCase() }(
          first: ${ hideFirst ? '4' : '3' }
          where: {
            orderby: {
              field: DATE
              order: DESC
            }
            notIn: [ ${ currentPost?.databaseId } ]
          }
        ) {
          ${ nodes }
        }
      `;

      break;

    case 'related':
      if(postType?.primaryTaxonomy?.graphqlSingleName) {
        let tax = postType?.primaryTaxonomy?.graphqlSingleName;
        let term = currentPost?.[ tax + 'PrimaryTerm']?.slug;

        queryPosts = `
          related: ${ postType.graphqlPluralName.toLowerCase() }(
            where: {
              ${ tax }Name: "${ term }"
              orderby: {
                field: DATE
                order: DESC
              }
              notIn: [ ${ currentPost?.databaseId } ]
            }
          ){
            ${ nodes }
          }
        `;
      }

      break;

    default:
  }

  queryLinkedPage = `
    linkedPage:page(id: "${ linkedPageID }", idType: DATABASE_ID) {
      uri
    }
  `;

  const query = `{
    ${ queryLinkedPage }
    ${ queryPosts }
  }`;

  return query;
}

export const queryApp = `
{
  badEggCup {
    company {
      name
      nameLegal
      tel
      email
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
  posts(first: 1) {
    nodes {
      id
      slug
      titlePrefix
      title
      subtitle
      excerpt
      date
      uri
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
      terms(where: {taxonomies: CATEGORY}) {
        nodes {
          name
          slug
          uri
        }
      }
      categoryPrimaryTerm {
        name
        slug
        uri
      }
    }
  }
  podcasts(first: 3) {
    nodes {
      episodeAudio
      episodeContent
      date
      title
      titlePrefix
      uri
      slug
    }
  }
  readingSettings {
    pageForPosts
  }
}`;
