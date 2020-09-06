const gql = require("graphql-tag");

module.exports = gql`
  query ORIGINAL_TRILOGY {
    allFilms(first: 3) {
      edges {
        node {
          title
          characterConnection {
            edges {
              node {
                name
              }
            }
          }
        }
      }
    }
  }
`;
