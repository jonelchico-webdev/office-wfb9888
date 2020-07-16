import gql from "graphql-tag";

export const ADD_ACTIVITY_TYPE_MUTATION=gql`
    mutation add_activity_type(
      $name:String,
      $description:String,
      $weight:Int,
    ){
      gameEventType(
        input:{
          name:$name,
          description:$description,
          weight:$weight,
          enabled:true
        }
      ){
        clientMutationId
            errors{
                field
                messages
            }
            gameEventType{
                id
                name
            }
      }
}
`;

export const UPDATE_ACTIVITY_TYPE_MUTATION=gql`
    mutation modify_activity_type(
      $id:ID,
      $name:String,
      $description:String,
      $weight:Int,
    ){
      gameEventType(
        input:{
          id:$id,
          name:$name,
          description:$description,
          weight:$weight,
          enabled:true
        }
      ){
        clientMutationId
            errors{
                field
                messages
            }
            gameEventType{
                id
                name
            }
      }
}
`;

export const GAME_EVENT_TYPE_STATUS_MUTATION = gql` 
mutation GameEventAdd(
    $id: ID,
    $enabled: Boolean
) {
    gameEventType(input:{
        id: $id
        enabled: $enabled
    }) {
        clientMutationId
        errors{
            field
            messages
        }
        gameEventType{
            id
            name
        }
    }
}
`

export const DELETE_ACTIVITY_TYPE_MUTATION=gql`
    mutation add_activity_type(
      $id:ID,
    ){
      gameEventType(
        input:{
          name:$name,
          description:$description,
          weight:$weight,
          enabled:true
        }
      ){
        clientMutationId
            errors{
                field
                messages
            }
            gameEventType{
                id
                name
            }
      }
}
`;