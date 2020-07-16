import gql from 'graphql-tag';

export const typeDefs = gql`
	type Tab {
		id: String!
		data: String!
	}
	extend type Query {
		isLoggedIn: Boolean!
		isDrawerOpen: Boolean!
		languageCode: String!
		tabs: [Tab!]
	}
`;

export const resolvers = {
	
};