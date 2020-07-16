// import ApolloLink from "apollo-boost"
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import { HttpLink } from 'apollo-link-http';
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from 'apollo-link-context';
// import gql from 'graphql-tag';
import Cookies from 'universal-cookie';
// import { useEffect } from 'react';
import { ApolloLink } from 'apollo-link';


const cookies = new Cookies();

const cache = new InMemoryCache();

// const link = new HttpLink({
//   uri: process.env.REACT_APP_API_URL + "/graphql/",
//   // uri: "https://test.office.xlm999.com:6389/graphql/",
//   // uri: "https://192.168.254.20:8001/graphql/",
// })

const uploadLink = createUploadLink({
  uri: process.env.REACT_APP_API_URL
})

const authLink = setContext((_, { headers }) => {

  const token = cookies.get('JWT');
  const csrf_token = cookies.get('csrf_token')

  return {
    headers: {
      ...headers,
      Authorization: token ? `JWT ${token}` : "",
      // 'Cookie':"csrftoken=%s" % csrf_token, 
      'X-CSRFToken': csrf_token,
    },
    uri: process.env.REACT_APP_API_URL + "/graphql/",
  }
});

const myClient = new ApolloClient({
  cache,
  // link: authLink.concat(link),
  link: ApolloLink.from([ authLink, uploadLink])
  // credentials: 'include'
})

myClient.defaultOptions = {
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
};

export default myClient