import React, { useState, Fragment } from 'react';
import { Checkbox, Grid, Dialog, DialogContent, DialogTitle, TextField, Button, Typography } from '@material-ui/core';
import { useGameTypesQuery, useGameManagementVendorQuery } from '../../../queries-graphql/game-management/use-game-management';
import { useCommissionGameTypeQuery } from '../../../queries-graphql/commission-system/commission-management';
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

//     data.gameTypes.edges.map((o) => {
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

function useDataGamesVendorCommission(id, mutate) {
    const {data, loading} = useCommissionGameTypeQuery({ commission: id, mutation: mutate })
    if(loading) {
        return [];
    }

    var commissionGameVendors = data.commissionGameTypeVendors.edges;

    return commissionGameVendors;
}

export default function ThirdModal({id, open, setOpen, mutate, dataValue}) {
    const strings = useLanguages(COMMISSION_MANAGEMENT_ADD);
    const commissionVendors = useDataGamesVendorCommission(id, mutate)
    var commissionVendorsNew = [...new Set(commissionVendors.map(o => o.node.gameType.name))]
    // console.log(commissionVendors)
    const [values, setValues] = useState([])
    const [disabled, setDisabled] = useState([])

    function handleClose() {
        setOpen(false)
    }

    function dataValueHandler(event) {
        event.persist()
        let gameId = event.target.id
        let key = event.target.name
        let value = values[`value${key}`]

        if(!dataValue.find(o => o.gameTypeID === gameId)) {
            dataValue.push({value: value, gameTypeID: gameId, enabled: true})
        } else {
            let index = dataValue.findIndex(o => o.gameTypeID === gameId) 
            if (index > -1) {
                dataValue.splice(index, 1)
            }
        }
    }

    function valueHandler(event) {
        event.persist()
        if(values[event.target.name] && event.target.value > 5 ) {
            event.target.value = 5
        }
        setValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value
        }))

        setDisabled(oldValues => ({
            ...oldValues,
            [event.target.name]: false
        }))
    }

    function handleSave() {
        setOpen(false)
        swal.fire({
            position: 'center',
            type: 'success',
            title: '佣金游戏供应商比率已添加',
            showConfirmButton: false,
            timer: 1500
        })
    }

    return  <Dialog
                maxWidth={180}
                open={open} 
                onClose={handleClose} 
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">{strings.pleaseSelectGame}</DialogTitle>
                <DialogContent>
            
                <Grid container>
                    {commissionVendorsNew.map((o) => {
                        return <Fragment>
                            { o ? <Fragment>
                            <Grid container alignItems='center' style={{ backgroundColor: '#E3E9F0'}}>
                                <Grid item>
                                    <Typography>{o}</Typography>
                                </Grid>  
                            </Grid>

                            <Grid container alignItems="center" justify="center">
                                {commissionVendors.map((vendors, idx) => 
                                    vendors.node.gameType.name === o ?
                                    <Fragment>
                                    <Grid container style={{ maxWidth: 400 }} alignItems="center">
                                    <Grid item style={{ marginLeft: "1rem" }}>
                                        <Checkbox
                                            // disabled={disabled[`value${idx}`] === false ? false : true}
                                            id={vendors.node.id}
                                            // name={vendors.node.commission.name}
                                            name={idx}
                                            onChange={dataValueHandler}
                                            // value={values[`value${idx}`] ? values[`value${idx}`] : ""}
                                            color="primary"
                                            inputProps={{
                                            'aria-label': 'secondary checkbox',
                                            }}
                                        />
                                    </Grid>

                                    <Grid item>
                                        <Typography>{vendors.node.gameVendor.name}</Typography>
                                    </Grid>
                                    
                                    <GrowItem/>

                                    <Grid item alignItems="center" style={{ marginLeft: "1rem" }}>
                                        <TextField 
                                            type="number" 
                                            variant="outlined" 
                                            margin="dense" 
                                            onChange={valueHandler}
                                            // value={values[`value${idx}`] ? values[`value${idx}`] : ""}
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
                                )}
                            </Grid>
                            </Fragment>
                            :
                            null
                            }
                        </Fragment>
                    })}
                </Grid>
                
                </DialogContent>
                
                <Grid style={{paddingTop: 30, marginBottom: 30}} direction="column" alignItems="center" container>
                    <Grid item>
                        <Button style={{width: 110, marginRight:20, height: 30}} color="primary" variant="contained" onClick={handleSave}>Save</Button>
                        <Button style={{width: 110, marginRight:20, height: 30}} color="primary" variant="contained" onClick={handleClose}>Cancel</Button>
                    </Grid>
                </Grid>

            </Dialog>
}