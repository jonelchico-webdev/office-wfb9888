import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const WALLET_MANAGEMENT_GQL = gql`query WalletManagementGql($first: Int, $last: Int, 
    $after: String, $before: String){
    gameWallets(deletedFlag: false, first: $first, last: $last, after: $after, before: $before) {
        edges {
            node {
                id
                name
                weight
                category
                maintance
                description
                picUrlPc
                picUrlMobile
                type
                enabled
                pk
            }
        } 
        totalCount
        pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
        }
    } 
}`

export default function useWalletManagementGql({ rowsPerPage, after, before, mutation }) {
    let variables = {mutation, rowsPerPage, before, after};

    return useQuery({ 
        query: WALLET_MANAGEMENT_GQL,
        variables,
        defs: [rowsPerPage, after, before, mutation]
    })
}