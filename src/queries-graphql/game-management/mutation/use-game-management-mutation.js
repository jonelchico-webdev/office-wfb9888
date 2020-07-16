import { useState, useEffect } from 'react';
import gql from 'graphql-tag'

export const GAME_MANAGEMENT_VENDOR_STATUS_MUTATE = gql`
mutation gameManagementVendorStatusMutate($id: ID, $status: Boolean) {
	gameVendor(input: {
    id: $id
    enabled: $status
  }) {
    clientMutationId
    errors
    {
      field
      messages
    }
  }

}`

export const GAME_MANAGEMENT_VENDOR_WEIGHT_MUTATE = gql`
mutation gameManagementVendorStatusMutate($id: ID, $weight: Int) {
	gameVendor(input: {
    id: $id
    weight: $weight
  }) {
    clientMutationId
    errors
    {
      field
      messages
    }
  }

}`


export function useGames(gameData) {

  const buffer = `mutation{
    game {
      errors
      {
        field
        message
      }
    }
  }`
  const [gameDataMutate, setGameDataMutate] = useState(null)
  const [render, setRender] = useState(null)
  const [render2, setRender2] = useState(null)
  const [redo, setRedo] = useState(true)
  const [joinMutate, setJoinMutate] = useState(null)
  const [batchMutation, setBatchMutation] = useState(buffer)
  useEffect(() => {
    let mutate = []
    if (gameDataMutate) {
      gameDataMutate.map((value, index) => {
        let num = index + 1
        return mutate.push(`mutation` + num + `:game(input: {
          id:"`+ value.node.id + `" ` +
          `name:"` + value.node.name + `" ` +
          `enabled:` + value.node.enabled + ` ` +
          `weight:` + value.node.weight +
          `}) {
          clientMutationId
          errors
          {
            field
            messages
          }
        }`)
      })
    }




    
    setJoinMutate(mutate.join())


  }, [gameDataMutate, gameData, redo])



  useEffect(() => {

    if (joinMutate) {
      setRender(joinMutate.toString())

    } else {
      setRender(joinMutate)

    }

  }, [joinMutate,])

  

  useEffect(() => {

    if (render) {
      setRender2("mutation{" + render + "}")

    }

  }, [render])

  useEffect(() => {

    if (render2) {
      setBatchMutation(render2)

    }
  }, [render2])

  const GAME_MANAGEMENT_BATCH_MUTATION = gql`${batchMutation} `

  return {
    GAME_MANAGEMENT_BATCH_MUTATION,
    setGameDataMutate,
    setRedo,
    redo,
    joinMutate
  }
}
