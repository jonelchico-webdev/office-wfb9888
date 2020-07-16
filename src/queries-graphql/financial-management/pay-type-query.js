import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const PAY_TYPE_QUERY = gql`
  query PayType{
    payType {
      edges {
        node {
          id
          pk
          name
        }
      }
    }
  }
`

export default function usePayTypeQuery({ mutation }) {
    let variables = {mutation};
    // if(fromDate) variables.fromDate = fromDate;
    // if(toDate) variables.toDate = toDate;
    // if(after) {
    //     variables.first = rowsPerPage;
    //     variables.after = after;
    // }
    // if(before) {
    //     variables.last = rowsPerPage;
    //     variables.before = before;
    // }
    // if(!after && !before) {
    //     variables.first = rowsPerPage;
    // }
    return useQuery({ 
        query: PAY_TYPE_QUERY,
        variables,
        defs: [mutation]
    })
}