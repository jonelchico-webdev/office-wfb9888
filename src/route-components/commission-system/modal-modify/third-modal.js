import React, { useState, Fragment } from 'react';
import { Checkbox, Grid, Dialog, DialogContent, DialogTitle, TextField, Button, Typography } from '@material-ui/core';
import { useCommissionVendorRatioIdQuery } from '../../../queries-graphql/commission-system/commission-management';
import { GrowItem } from '../../../components'
import swal from 'sweetalert2';
import useLanguages from '../../../hooks/use-languages';
import { COMMISSION_MANAGEMENT_ADD } from '../../../paths';

// function useDataGames(){
// 	const {data, loading} = useGameTypesQuery({ mutate: true });
// 	if(loading) {  
// 		return [];
// 	}
//     // var games =  data.gameTypes.edges; 
    
//     let games = []

//     data.gameTypes.edges.map((o, index) => {
//         if(o.node.name !== "unknown") {
//             games.push(o)
//         }
//     })

//     return games;
// }

// function useDataGameVendor(gameID){
// 	const {data, loading} = useGameManagementVendorQuery({ gameType: "" });
// 	if(loading) {  
// 		return [];
//     }

//     // var gameVendors =  data.gameVendors.edges; 
//     let gameVendors = []

//     data.gameVendors.edges.map((o, index) => {
//         if(o.node.gameType) {
//             gameVendors.push(o)
//         }
//     })

//     return gameVendors;
// }

// function useDataGamesVendorCommission(id, mutate) {
//     const {data, loading} = useCommissionGameTypeQuery({ commission: id, mutation: mutate })
//     if(loading) {
//         return [];
//     }

//     var commissionGameVendors = data.commissionGameTypeVendors.edges;

//     return commissionGameVendors;
// }

function useDataGamesVendorRatioCommission(id, mutate) {
    const {data, loading} = useCommissionVendorRatioIdQuery({ commissionRule: id, mutation: mutate })
    if(loading) {
        return [];
    }

    var commissionGameVendorsRatio = data.commissionGameTypeVendorRatios.edges;

    return commissionGameVendorsRatio;
}

export default function ThirdModal({ mutate, setMutate, open, setOpen, disabled, setDisabled, dataValue, commissionGameTypeVendors, commissionRuleId, updateCommissionRatios }) {
    const strings = useLanguages(COMMISSION_MANAGEMENT_ADD);
    const commissionGameVendorsRatio = useDataGamesVendorRatioCommission(commissionRuleId, mutate)
    // var commissionGameVendorsRatioGameTypes = [...new Set(commissionGameVendorsRatio.map(o => o.node.gameType.name))]
    var commissionGameTypeVendorNames = [...new Set(commissionGameTypeVendors.map(o => o.node.gameType.name))]
    const [values, setValues] = useState([])
    

    function handleClose() {
        setOpen(false)
    }

    const dataValueHandler = (id) => (event) => {
        event.persist()
        let gameId = event.target.id
        let statusEnable = event.target.checked
        let amount = event.target.value
        
        if(!dataValue.find(o => o.id === id) || !dataValue.find(o => o.gameTypeID === gameId)) {
            dataValue.push({
                value: amount, 
                gameTypeID: gameId, 
                enabled: statusEnable, 
                id: id
            })
        } else {
            let index = dataValue.findIndex(o => o.id === id)
            if (index >= 0) {
                dataValue[index].enabled = statusEnable
                dataValue[index].id = id
            }
        }

        setDisabled(oldValues => ({
            ...oldValues,
            [event.target.name]: statusEnable
        }))
        setMutate(!mutate)
    }

    const valueHandler = (gameId, status, id) => (event) => {
        event.persist()
        let valueAmount = event.target.value

        if(values[event.target.name] && event.target.value >= 5 ) {
            valueAmount = 5
        }
        setValues(oldValues => ({
            ...oldValues,
            [event.target.name]: valueAmount
        }))
        if(!dataValue.find(o => o.id === id) || !dataValue.find(o => o.gameTypeID === gameId)) {
            dataValue.push({
                value: valueAmount, 
                gameTypeID: gameId, 
                enabled: status, 
                id: id
            })
        } else {
            let index = dataValue.findIndex(o => o.id === id)
            if(index >= 0) {
                dataValue[index].value = event.target.value
            }
        }
        setMutate(!mutate)
    }

    // function handleSave() {
    //     setOpen(false)
    //     swal.fire({
    //         position: 'center',
    //         type: 'success',
    //         title: 'Commission Game Vendor Ratios Added',
    //         showConfirmButton: false,
    //         timer: 1500
    //     })
    // }

    return  <Dialog
                maxWidth={180}
                open={open} 
                onClose={handleClose} 
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">{strings.pleaseSelectGame}</DialogTitle>
                <DialogContent>
                    
                <Grid container>
                    {
                        commissionGameTypeVendorNames.map((o, idx) => 
                        {
                            return <Fragment>
                            <Grid container alignItems="center" style={{ backgroundColor: '#E3E9F0'}}>
                                <Grid item>
                                    <Typography>{o}</Typography>
                                </Grid>
                            </Grid>
                                {
                                    <Grid container alignItems="center" justify="center">
                                        {
                                            commissionGameVendorsRatio.length !== 0 ?
                                            commissionGameTypeVendors.map((x, idx) => {
                                                let test = null
                                                let idCommissionRatio = null
                                                let enabled = null
                                                let amount = null
                                                commissionGameVendorsRatio.map(o => {
                                                    if(o.node.vendor.id === x.node.gameVendor.id ) {
                                                        test = o.node.value
                                                        idCommissionRatio = o.node.id
                                                        enabled = o.node.enabled
                                                        amount = o.node.value
                                                    }
                                                })

                                                return x.node.gameType.name === o && x.node.enabled === true ? 
                                                <Fragment>
                                                    <Grid container style={{ maxWidth: 400 }} alignItems="center">
                                                        <Grid item style={{ marginLeft: "1rem" }}>
                                                            <Checkbox
                                                                defaultChecked={enabled}
                                                                id={x.node.id}
                                                                name={`value${idx}`}
                                                                value={amount}
                                                                onChange={dataValueHandler(idCommissionRatio)}
                                                                color="primary"
                                                                inputProps={{
                                                                'aria-label': 'secondary checkbox',
                                                                }}
                                                            />
                                                        </Grid>

                                                        <Grid item>
                                                            <Typography>{x.node.gameVendor.name}</Typography>
                                                        </Grid>

                                                        <GrowItem/>

                                                        <Grid item alignItems="center" style={{ marginLeft: "1rem" }}>
                                                            <TextField 
                                                                id={x.node.id}
                                                                // disabled={disabled[`value${idx}`] === false ? true : false}
                                                                disabled={
                                                                    disabled[`value${idx}`] ?
                                                                    disabled[`value${idx}`] === false ? true : false
                                                                    :
                                                                    !enabled
                                                                }
                                                                type="number" 
                                                                variant="outlined" 
                                                                margin="dense" 
                                                                onChange={valueHandler(x.node.id, true, idCommissionRatio)}
                                                                // value={
                                                                //     values[`value${idx}`] ? 
                                                                //     values[`value${idx}`] 
                                                                //     : 
                                                                //     test
                                                                // }
                                                                defaultValue={test}
                                                                name={`value${idx}`}
                                                                style={{ maxWidth: 80 }}
                                                                inputProps={{
                                                                    min: ".0001", 
                                                                    max: "5",
                                                                    step: ".01"
                                                                }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Fragment>
                                                :
                                                null
                                            })
                                            :
                                            commissionGameTypeVendors.map((x, idx) => {
                                                return x.node.gameType.name === o && x.node.enabled === true ? 
                                                <Fragment>
                                                    <Grid container style={{ maxWidth: 400 }} alignItems="center">
                                                        <Grid item style={{ marginLeft: "1rem" }}>
                                                            <Checkbox
                                                                defaultChecked={x.node.enabled}
                                                                id={x.node.id}
                                                                name={`value${idx}`}
                                                                onChange={dataValueHandler}
                                                                color="primary"
                                                                inputProps={{
                                                                'aria-label': 'secondary checkbox',
                                                                }}
                                                            />
                                                        </Grid>

                                                        <Grid item>
                                                            <Typography>{x.node.gameVendor.name}</Typography>
                                                        </Grid>

                                                        <GrowItem/>

                                                        <Grid item alignItems="center" style={{ marginLeft: "1rem" }}>
                                                            <TextField 
                                                                id={x.node.id}
                                                                // disabled={disabled[value${idx}] === false ? true : false}
                                                                disabled={
                                                                    disabled[`value${idx}`] ?
                                                                    disabled[`value${idx}`] === false ? true : false
                                                                    :
                                                                    !x.node.enabled
                                                                }
                                                                type="number" 
                                                                variant="outlined" 
                                                                margin="dense" 
                                                                onChange={valueHandler(x.node.id, true, null)}
                                                                value={values[`value${idx}`]}
                                                                name={`value${idx}`}
                                                                style={{ maxWidth: 80 }}
                                                                inputProps={{
                                                                    min: ".0001", 
                                                                    max: "5",
                                                                    step: ".01"
                                                                }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Fragment>
                                                :
                                                null
                                            })
                                        }
                                    </Grid>
                                }
                            </Fragment>
                        }  
                        )
                    }
                </Grid>
                
                </DialogContent>
                
                <Grid style={{paddingTop: 30, marginBottom: 30}} direction="column" alignItems="center" container>
                    <Grid item>
                        <Button style={{width: 110, marginRight:20, height: 30}} color="primary" variant="contained" onClick={updateCommissionRatios}>Save</Button>
                        <Button style={{width: 110, marginRight:20, height: 30}} color="primary" variant="contained" onClick={handleClose}>Cancel</Button>
                    </Grid>
                </Grid>

            </Dialog>
}