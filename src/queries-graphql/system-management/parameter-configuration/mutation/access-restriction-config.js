
import gql from 'graphql-tag'


export const ADD_CONFIG = gql`
    mutation Mconfig($ipWhitelistFrontend: String, $ipBlacklistFrontend: String, $ipWhitelistBackend: String, $ipBlacklistBackend: String ){
        configuration(input:{
        ipWhitelistFrontend: $ipWhitelistFrontend
        ipBlacklistFrontend: $ipBlacklistFrontend
        ipWhitelistBackend: $ipWhitelistBackend
        ipBlacklistBackend: $ipBlacklistBackend
        }){
        configuration {
            ipWhitelistFrontend
            ipBlacklistFrontend
            ipWhitelistBackend
            ipBlacklistBackend
            }
        }
    }
`