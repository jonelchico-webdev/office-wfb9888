import React, { useState } from 'react';
import {Redirect, Link} from 'react-router-dom'
import { CssBaseline } from '@material-ui/core';
import { ApolloProvider, withApollo } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import { createHttpLink } from 'apollo-link-http';
import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter } from 'react-router-dom';
import AppLayout from './components/app-layout';
import schema from './mocks';
import { resolvers, typeDefs } from './resolvers';
import theme from './theme';
import { LanguageContext, EN, ZHT } from './language-context';
import { ClientContext } from './client-context';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import myClient from './client';
import gql from 'graphql-tag';
import { ApolloProvider as ApolloHooksProvider } from "@apollo/react-hooks";
import Cookies from 'universal-cookie';

const apolloCache = new InMemoryCache();
const cookies = new Cookies();
// const link = new createHttpLink({
// 	uri: 'http://93.157.63.50:8000/graphql/'
// })

// const client = new ApolloClient({
// 	cache: apolloCache,
// 	link

// 	// link: createHttpLink({ uri: '/graphql/' })
// });

export const mockClient = new ApolloClient({
	cache: apolloCache,
	link: new SchemaLink({ schema }),
	resolvers,
	typeDefs
});

apolloCache.writeData({
	data: {
		isLoggedIn: !!localStorage.getItem('token'),
	},
});

function App() {
	const [language, setLanguage] = useState(ZHT);
	// const [language, setLanguage] = useState(EN);	
	return (
		<ApolloProvider client={myClient}>
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<LanguageContext.Provider value={{ language, setLanguage }}>
						<ClientContext.Provider value={{ myClient, mockClient }}>
							<ApolloHooksProvider client={myClient}>
								<CssBaseline />			
								<AppLayout />
							</ApolloHooksProvider>
						</ClientContext.Provider>
					</LanguageContext.Provider>
				</ThemeProvider>
			</BrowserRouter>
		</ApolloProvider>
	);
}

export default App;