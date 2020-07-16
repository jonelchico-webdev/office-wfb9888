import React, { useState, Fragment } from 'react';
import { Checkbox, Grid, Dialog, DialogContent, DialogTitle, Button, Typography } from '@material-ui/core';
import { useGameTypesQuery, useGameManagementVendorQuery } from '../../../queries-graphql/game-management/use-game-management';
import useLanguages from '../../../hooks/use-languages';
import { COMMISSION_MANAGEMENT_ADD } from '../../../paths';


function useDataGames(){
	const {data, loading} = useGameTypesQuery({ mutate: true });
	if(loading) {  
		return [];
    }
    // var games =  data.gameTypes.edges; 

    let games = []

    data.gameTypes.edges.map((o) => {
        if(o.node.name !== "unknown") {
            games.push(o)
        }
    })
    
    return games;
}

function useDataGameVendor(){
	const {data, loading} = useGameManagementVendorQuery({ gameType: "" });
	if(loading) {  
		return [];
	}
    // var gameVendors =  data.gameVendors.edges; 
    let gameVendors = []

    data.gameVendors.edges.map((o) => {
        if(o.node.gameType) {
            return gameVendors.push(o)
        }
    })

    return gameVendors;
}

export default function SecondModal({open, setOpen, commissionGame, commissionGameVendor, addCommissionVendors}) {
    const strings = useLanguages(COMMISSION_MANAGEMENT_ADD);

    const games = useDataGames()
    const vendors = useDataGameVendor()

    const [refresh, setRefresh] = useState(false)

    // function commissionGameHandler(event) {
    //     event.persist()
    //     const id = event.target.id

    //     if(!commissionGame.includes(id)) {
    //         commissionGame.push(id)
    //     } else {
    //         let index = commissionGame.indexOf(id)
    //         if (index > -1) {
    //             commissionGame.splice(index, 1)
    //         }
    //     }
    //     setRefresh(!refresh)
    // }

    function commissionGameVendorHandler(event) {
        event.persist()
        let id = event.target.id
        const name = event.target.name

        if(!commissionGameVendor.find(o => o.vendorID === id)) {
            commissionGameVendor.push({vendorID: id, gameTypeID: name})
        } else {
            let index = commissionGameVendor.findIndex(o => o.vendorID === id) 
            if (index > -1) {
                commissionGameVendor.splice(index, 1)
            }
        }

        setRefresh(!refresh)
    }

    function handleClose() {
        setOpen(false)
    }

    return  <Dialog 
                // fullWidth={true}
                maxWidth={180}
                open={open} 
                onClose={handleClose} 
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">{strings.pleaseSelectGame}</DialogTitle>
                <DialogContent>
            
                <Grid container>
                    {games.map((game, idx) => <Fragment>
                        <Grid container alignItems='center' style={{ backgroundColor: '#E3E9F0'}}>
                            {/* <Grid item>
                                <Checkbox
                                    checked={Boolean(commissionGame.find((id) => { return id === game.node.id ? true : false }))}
                                    id={game.node.id}
                                    onChange={commissionGameHandler}
                                    value="checkedB"
                                    color="primary"
                                    inputProps={{
                                    'aria-label': 'secondary checkbox',
                                    }}
                                />
                            </Grid> */}
                            <Grid item>
                                <Typography>{game.node.name}</Typography>
                            </Grid>  
                        </Grid>
                       
                        <Grid container alignItems="center" justify="center">
                        {vendors.map((vendor) => <Fragment>
                            {game.node.id === vendor.node.gameType.id ?
                                <Fragment>
                                <Grid container style={{ maxWidth: 300 }} alignItems="center">
                                    <Grid item style={{ pmarginLeft: "1rem" }}>
                                        <Checkbox
                                            // disabled={Boolean(commissionGame.find((id) => { return id === vendor.node.gameType.id ? false : true }))}
                                            checked={Boolean(commissionGameVendor.find((o) => { return o.vendorID === vendor.node.id ? true : false }))}
                                            id={vendor.node.id}
                                            name={vendor.node.gameType.id}
                                            onChange={commissionGameVendorHandler}
                                            value="checkedB"
                                            color="primary"
                                            inputProps={{
                                            'aria-label': 'secondary checkbox',
                                            }}
                                        />
                                    </Grid>

                                    <Grid item>
                                        <Typography>{vendor.node.name}</Typography>
                                    </Grid>
                                </Grid>
                                </Fragment>
                                :
                                null
                            }
                            </Fragment>
                        )}  
                        </Grid>    
                    </Fragment>
                    )} 
                </Grid>

                </DialogContent>
                
                <Grid style={{paddingTop: 30, marginBottom: 30}} direction="column" alignItems="center" container>
                    <Grid item>
                        <Button style={{width: 110, marginRight:20, height: 30}} color="primary" variant="contained" onClick={addCommissionVendors}>Save</Button>
                        <Button style={{width: 110, marginRight:20, height: 30}} color="primary" variant="contained" onClick={handleClose}>Cancel</Button>
                    </Grid>
                </Grid>

            </Dialog>
}