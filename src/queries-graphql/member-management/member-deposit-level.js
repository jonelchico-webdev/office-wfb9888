import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const MEMBER_DEPOSIT_LEVEL = gql`
    query MemberDepositLevel($first: Int, $after: String, $before: String, $last: Int ){
        memberLevels(first: $first, last: $last, after: $after, before: $before){
            edges {
                node {
                    pk
                    id
                    name
                    totalDeposits
                    totalDepositAmount
                    totalDepositAmount
                    depositLimit
                    bankTransferDepositLimit
                    totalWithdrawals
                    withdrawalType
                    totalWithdrawalAmount
                    withdrawalLimit
                    withdrawalHours
                    withdrawalHoursTimes
                    withdrawalHoursTimesCount
                    withdrawalFeeType
                    withdrawalFeeFixedAmount
                    withdrawalFeeProportionalPercent
                    withdrawalFeeProportionalCapAmount
                    createdAt
                    updatedAt
                    userSet {
                        edges {
                            node {
                                id
                                isActive
                                isStaff
                            }
                        }
                    }
                    gameeventSet {
                        edges {
                            node {
                                id
                                title
                                eventWay
                                eventType
                            }
                        }
                    }
                    depositruleSet {
                        edges {
                            node {
                                id
                            }
                        }
                    }
                    pushnotificationSet {
                        edges {
                            node {
                                id
                            }
                        }
                    }
                }
            }
            totalCount
            startCursorNum
            endCursorNum
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
        }
    }
`

const MEMBER_DEPOSIT_LEVEL_ID = gql`
    query MemberDepositLevelID($id: ID!){
        memberLevel(id: $id) {
            pk
            id
            name
            totalDeposits
            totalDepositAmount
            totalDepositAmount
            depositLimit
            bankTransferDepositLimit
            totalWithdrawals
            totalWithdrawalAmount
            withdrawalType
            withdrawalLimit
            withdrawalHours
            withdrawalHoursTimes
            withdrawalHoursTimesCount
            withdrawalFeeType
            withdrawalFeeFixedAmount
            withdrawalFeeProportionalPercent
            withdrawalFeeProportionalCapAmount
            createdAt
            updatedAt
        }
    }
`

export const ADD_MEMBER_LEVEL = gql`
    mutation memberlevel($name : String!, $totalDepositAmount: Int, $totalDeposits: Int, $totalWithdrawalAmount: Int, $totalWithdrawals: Int
            $depositLimit: Int, $bankTransferDepositLimit: Int, $withdrawalLimit: Int, $withdrawalType: String, $withdrawalHours: Int, $withdrawalHoursTimes: Int, 
            $withdrawalHoursTimesCount: Int, $withdrawalFeeType: String, $withdrawalFeeFixedAmount: Int, $withdrawalFeeProportionalPercent: Int, $withdrawalFeeProportionalCapAmount: Int
        ){
        memberLevel(input:{
            name: $name
            totalDepositAmount: $totalDepositAmount
            totalDeposits: $totalDeposits
            totalWithdrawalAmount: $totalWithdrawalAmount
            totalWithdrawals: $totalWithdrawals
            depositLimit: $depositLimit
            bankTransferDepositLimit: $bankTransferDepositLimit
            withdrawalLimit: $withdrawalLimit
            withdrawalType: $withdrawalType
            withdrawalHours: $withdrawalHours
            withdrawalHoursTimes: $withdrawalHoursTimes
            withdrawalHoursTimesCount: $withdrawalHoursTimesCount
            withdrawalFeeType: $withdrawalFeeType
            withdrawalFeeFixedAmount: $withdrawalFeeFixedAmount
            withdrawalFeeProportionalPercent: $withdrawalFeeProportionalPercent
            withdrawalFeeProportionalCapAmount: $withdrawalFeeProportionalCapAmount
        }){
            clientMutationId
            errors{
                field
                messages
            }
            memberLevel{
                pk
                id
                name
            }
        }
    }
`

export const UPDATE_MEMBER_LEVEL = gql`
    mutation memberlevel($id: ID, $name : String!, $totalDepositAmount: Int, $totalDeposits: Int, $totalWithdrawalAmount: Int, $totalWithdrawals: Int
            $depositLimit: Int, $bankTransferDepositLimit: Int, $withdrawalLimit: Int, $withdrawalType: String, $withdrawalHours: Int, $withdrawalHoursTimes: Int, 
            $withdrawalHoursTimesCount: Int, $withdrawalFeeType: String, $withdrawalFeeFixedAmount: Int, $withdrawalFeeProportionalPercent: Int, $withdrawalFeeProportionalCapAmount: Int
        ){
        memberLevel(input:{
            id: $id
            name: $name
            totalDepositAmount: $totalDepositAmount
            totalDeposits: $totalDeposits
            totalWithdrawalAmount: $totalWithdrawalAmount
            totalWithdrawals: $totalWithdrawals
            depositLimit: $depositLimit
            bankTransferDepositLimit: $bankTransferDepositLimit
            withdrawalLimit: $withdrawalLimit
            withdrawalType: $withdrawalType
            withdrawalHours: $withdrawalHours
            withdrawalHoursTimes: $withdrawalHoursTimes
            withdrawalHoursTimesCount: $withdrawalHoursTimesCount
            withdrawalFeeType: $withdrawalFeeType
            withdrawalFeeFixedAmount: $withdrawalFeeFixedAmount
            withdrawalFeeProportionalPercent: $withdrawalFeeProportionalPercent
            withdrawalFeeProportionalCapAmount: $withdrawalFeeProportionalCapAmount
        }){
            clientMutationId
            errors{
                field
                messages
            }
            memberLevel{
                pk
                id
                name
            }
        }
    }
`

export default function useMemberDepositLevel({mutation, before, after, rowsPerPage}){
	let variables = {mutation, before, after, rowsPerPage};
    // if (fromDate) variables.fromDate = fromDate;
    // if (toDate) variables.toDate = toDate;
    if (after) {
        variables.first = rowsPerPage;
        variables.after = after;
    }
    if (before) {
        variables.last = rowsPerPage;
        variables.before = before;
    }
    if (!after && !before) {
        variables.first = rowsPerPage;
    }
    return useQuery({
        query: MEMBER_DEPOSIT_LEVEL,
        variables,
        defs: [mutation, before, after, rowsPerPage]
    })
}

export function useMemberDepositLevelID({id}){
    let variables = {id}; 
    return useQuery({
        query: MEMBER_DEPOSIT_LEVEL_ID,
        variables,
        defs: [id]
    })
}