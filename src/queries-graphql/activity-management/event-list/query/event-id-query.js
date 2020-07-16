import useQuery from '../../../../hooks/use-query'
import gql from 'graphql-tag'

const GAME_EVENT_ID_QUERY = gql`
query GameEventList($id: ID!) {
    gameEvent(id: $id) {
        title
        eventWay
        eventType{
            name
            enabled
            id
            pk
        }
        giveTime
        giveCondition
        eventWay
        giveTypes
        giveawayTypes
        weight
        devices
        devicesTypes
        startAt
        endAt
        content
        picUrlPc
        picUrlMobile
        picEvent
        content
        rewardAmount
        rewardAmountPercentRatio
        registerToday
        ipLimitOncePerday
        depositToday
        bindingMobilePhonenumber
        accountLimitOncePerday
        accountLimitOnceOnly
        eventLevelLimit
        eventLevelLimitContent{
            edges{
                node{
                    id
                    name
                    pk
                }
            }
        }
        eventVipLimit
        eventVipLimitContent{
            edges{
                node{
                    id
                    name
                    pk
                }
            }
        }
        eventGameLimit
        eventGameLimitContent{
            edges{
                node{
                    id
                    name
                    pk
                    gameType{
                        pk
                        name
                        id
                    }
                }
            }
        }
        eventGameVendorLimitContent{
            edges{
              node{
                id
                name
                pk
                gameType{
                  id
                  pk
                  name
                }
              }
            }
          }
        eventUplineLimit
        eventUplineLimitContent{
            edges{
                node{
                    id
                    pk
                    user{
                        id
                        pk
                    }
                }
            }
        }
    }
  }
`

export default function useGameEventModify({ after, before, rowsPerPage, mutation, id }) {
    let variables = {mutation, after, rowsPerPage, before, id};

    return useQuery({ 
        query:  GAME_EVENT_ID_QUERY,
        variables,
        defs: [mutation, rowsPerPage, after, before, id]
    })
} 