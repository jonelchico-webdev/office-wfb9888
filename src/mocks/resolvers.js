import {casual, summaries} from './data';

const resolvers = {
	Query: {
		summaries: () => summaries,
	},

	Mutation: {
		login: (_, {username, password, code}) => {
			return {
				token: casual.uuid,
				user: {
					firstname: casual.first_name,
					lastname: casual.last_name
				}
			}
		}
	},

	// Author: {
	// 	posts: author => posts.filter(o => o.authorId === author.id)
	// },

	// Post: {
	// 	author: post => authors.find(o => o.id === post.authorId)
	// },
};

export default resolvers;