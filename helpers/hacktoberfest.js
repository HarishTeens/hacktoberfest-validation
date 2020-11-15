const { graphql } = require("@octokit/graphql");



const fetchPRHistory=async (nodeID,userToken)=>{
    const graphqlWithAuth = graphql.defaults({
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      });
    const { node: { pullRequests: { nodes} } } = await graphqlWithAuth(
        `
        query{
            node(id:"`+nodeID+`"){
              ... on User {
                pullRequests(states: [OPEN, MERGED, CLOSED] last: 100) {
                  nodes {
                    id
                    title
                    body
                    url
                    createdAt
                    merged
                    reviewDecision
                    repository {
                      databaseId
                      isPrivate
                      repositoryTopics(first: 100) {
                        edges {
                          node {
                            topic {
                              name
                            }
                          }
                        }
                      }
                    }
                    labels(first: 100) {
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
          }
        `,
      );
    
    return nodes;
    
}

const transformPRs=(nodes)=>{
    nodes.map((each)=>{
        
    })
}

module.exports={
    fetchPRHistory
}