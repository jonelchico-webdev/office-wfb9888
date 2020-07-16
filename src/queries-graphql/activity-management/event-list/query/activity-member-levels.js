import useQuery from '../../../../hooks/use-query'
import gql from 'graphql-tag'

const MEMBER_LEVELS_QUERRY = gql`query MemberLevelQuery {
        memberLevels(enabled: true) {
          edges {
            node {
              id
              name
              pk
            }
          } 
        } 
}`

const VIP_LEVELS_QUERRY = gql`query VIPLevelQuery {
  vipLevels(enabled: true) {
    edges {
      node {
        id
        name
        pk
      }
    } 
  } 
}`


export function useMemberLevels({ first, pk, rowsPerPage, after, before, status, mutation }) {
    let variables = {mutation, status, pk, first};
    return useQuery({ 
        query: MEMBER_LEVELS_QUERRY,
        variables,
        defs: [rowsPerPage, after, before, status, mutation, pk, first]
    })
}

export function useVipLevels({ first, pk, rowsPerPage, after, before, status, mutation }) {
  let variables = {mutation, status, pk, first};
  return useQuery({ 
      query: VIP_LEVELS_QUERRY,
      variables,
      defs: [rowsPerPage, after, before, status, mutation, pk, first]
  })
}