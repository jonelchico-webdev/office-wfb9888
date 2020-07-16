import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'


const GAME_MANAGEMENT_QUERY = gql`query GameManagementQuery( $gameType: ID, $first: Int, $last: Int, $after: String, $before: String) {
	games(gameType:$gameType, first: $first, last: $last, after: $after, before: $before) {
		edges {
			node {
				id
				pk
        		name
				enabled
				weight
				gameType {
					name
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
}`

const GAME_MANAGEMENT_WITH_VENDOR_QUERY = gql`query GameManagementWithVendorQuery( $gameType: ID, $name: String, $vendor: ID $first: Int, $last: Int, $after: String, $before: String) {
	games(gameType:$gameType, name_Icontains: $name, vendor: $vendor, first: $first, last: $last, after: $after, before: $before) {
		edges {
			node {
				id
				pk
        		name
				enabled
				weight
				gameType {
					name
				}
				vendor {
					name
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
}`

const GAME_MANAGEMENT_VENDOR_BY_TYPE_QUERY = gql`query GameManagementVendorByTypeQuery($gameType: String!) {
	gameVendorByTypes(gameType:$gameType ) {
		typeByVendorList
	}
}`

const GAME_MANAGEMENT_VENDOR_QUERY = gql`query GameManagementVendorQuery($gameType: ID!, $first: Int, $last: Int, $after: String, $before: String) {
	gameVendors(gameType: $gameType, first: $first, last: $last, after: $after, before: $before) {
		edges {
			node {
				id
				pk
				name
				weight
				enabled
				gameType {
					id
					name
				}
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

const GAME_TYPES_QUERY = gql`query {
	gameTypes {
	  edges {
		node {
		  id
		  name
		  pk
		}
	  }
	}
}`

//******************FOR**EXPORT**FUNCTIONS******************//

export function useGameManagementQuery({ gameType, rowsPerPage, after, before }) {
	let variables = { gameType, after, before };
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
		query: GAME_MANAGEMENT_QUERY,
		variables,
		defs: [gameType, rowsPerPage, after, before]
	})
}

export function useGameManagementWithVendorQuery({ gameType, vendor, name, rowsPerPage, after, before, mutated, page}) {
	let variables = { gameType, name, vendor, after, before };
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
		query: GAME_MANAGEMENT_WITH_VENDOR_QUERY,
		variables,
		defs: [gameType,name,  vendor, rowsPerPage, after, before, mutated, page]
	})
}


export function useGameManagementVendorByTypeQuery({ gameType, mutate, open, }) {
	let variables = { gameType };
	return useQuery({
		query: GAME_MANAGEMENT_VENDOR_BY_TYPE_QUERY,
		variables,
		defs: [gameType, mutate, open]
	})
}

export function useGameManagementVendorQuery({ gameType, mutate, open, rowsPerPage, after, before, }) {
	
	let variables = { gameType, after, before }
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
		query: GAME_MANAGEMENT_VENDOR_QUERY,
		variables,
		defs: [gameType, mutate, open, rowsPerPage, after, before, ]
	})
}

export function useGameTypesQuery({ mutate }) {
	let variables = {mutate}
	return useQuery({
		query: GAME_TYPES_QUERY,
		variables,
		defs: [mutate]
	})
}