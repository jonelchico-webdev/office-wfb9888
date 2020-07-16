import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const PAY_VENDOR = gql`
    query PayVendorQuery{
        payVendor {
            edges {
                node {
                    id
                    pk
                    name
                    weight
                }
            }
        }
    }
`

export default function usePayVendorQuery({ mutation }) {
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
        query: PAY_VENDOR,
        variables,
        defs: [mutation]
    })
}