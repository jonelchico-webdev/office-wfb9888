import { useState, useEffect } from 'react';
import gql from 'graphql-tag'

export function useDeposit(arrUserId) {

    const buffer = `mutation{
        deposit {
            errors {
                field
                messages
            }
        }
    }`
    // console.log(buffer)
    const [render, setRender] = useState([])
    const [batchMutation, setBatchMutation] = useState(buffer)

    // console.log(batchMutation, 'kjsdkdjslasdjkldjkldad')
    const [joinMutate, setJoinMutate] = useState(null)
    const startBatchMutate = `mutation(
        $amount: Float, 
        $auditType: String, 
        $auditAmount: Float,
        $depositType: String,
        $manualType: String,
        $userNote: String,
        $internalNote: String
    ) {`

    useEffect(() => {
        let batch = []
        // let secondBatch
        if(arrUserId.length !== 0) {
            // console.log(arrUserId, 'asdkjaldas')
            arrUserId.map((value, index ) => {
                let num = index + 1;
                let user = value
                // batch.push
                batch.push(`mutation` + num + `:deposit(input: {
                    user:"` + user + `" ` +
                    `amount: $amount
                    auditType: $auditType, 
                    auditAmount: $auditAmount,
                    depositType: $depositType,
                    manualType: $manualType,
                    userNote: $userNote,
                    internalNote: $internalNote
                }) {
                    clientMutationId
                    errors {
                        field
                        messages
                    }
                }`)
            })
        }
        setJoinMutate(batch.join());
        
    }, [arrUserId])
    
    useEffect(() => {
        if(joinMutate) {
            setRender(startBatchMutate+joinMutate+`}`)
        }
    }, [arrUserId, joinMutate])

    useEffect(() => {
        if(render.length !== 0) {
            setBatchMutation(render)
        }
    }, [render])
    const MANUAL_DEPOSIT_MUTATE = gql`${batchMutation}`
    return {
        MANUAL_DEPOSIT_MUTATE
    }

}
