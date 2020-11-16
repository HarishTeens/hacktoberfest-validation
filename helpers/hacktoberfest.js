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

const hasXDaysPassed=(node,x)=>{
  const timeStamp=new Date(node.createdAt);
  const diffTime=Math.abs(Date.now()-timeStamp);
  const diffDays=Math.ceil(diffTime/ (1000 * 60 * 60 * 24));
  return diffDays>=x;
}


const transformPRs=(nodes)=>{
    // PRs in October AND Public Repo
    const filter1=nodes.filter((each)=>{
        const timeStamp=new Date(each.createdAt);
        return ( timeStamp.getFullYear()=="2020"
              &&timeStamp.getMonth()=="9") 
              &&
              (each.repository.isPrivate==false);
    })
    
    // PR has label hacktoberfest-accepted 
    const filter2=filter1.filter((each)=>{
      return (
        each.labels.edges.filter(
          (edge)=>edge.node.name=="hacktoberfest-accepted")
          .length>0
        );
    })
    // repo has hacktoberfest Topic
    const filter3=filter1.filter((each)=>{      
      return (
        each.repository.repositoryTopics.edges.filter(
          (edge)=>edge.node.topic.name=="hacktoberfest")
          .length>0
        ) && (
          (each.merged===true)
          ||
          ( each.reviewDecision == "APPROVED" && hasXDaysPassed(each,14) )
        );
    })

    // PRs sent before the updated guidelines
    const filter4=filter1.filter((each)=>{
      const timeStamp=new Date(each.createdAt);
      return (
        parseInt(timeStamp.getDate())<5 
        && 
        each.labels.edges.filter(
          (edge)=>edge.node.name=="spam" || edge.node.name=="invalid")
          .length==0
        && hasXDaysPassed(each,7)        
        );
    })

    let PRset=new Set();
    [...filter2, ...filter3, ...filter4].forEach(each=>{
      PRset.add(each.id);
    })
    return PRset;

}



module.exports={
    fetchPRHistory,
    transformPRs
}