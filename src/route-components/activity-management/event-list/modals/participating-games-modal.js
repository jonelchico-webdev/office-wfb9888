import React, { useState, Fragment } from 'react';
import { Checkbox, Grid, Dialog, DialogContent, DialogTitle, Button, Typography } from '@material-ui/core';
import { useGameTypesQuery, useGameManagementVendorQuery } from '../../../../queries-graphql/game-management/use-game-management';
import { useGameQuery } from '../../../../queries-graphql/activity-management/event-list/query/games-query';

function useDataGamesType(){
	const {data, loading} = useGameTypesQuery({ mutate: true });
	if(loading) {  
		return [];
    }
    // var gameVendors =  data.gameTypes.edges; 

    let gameVendors = []

    data.gameTypes.edges.map((o) => {
        if(o.node.name !== "unknown") {
            gameVendors.push(o)
        }
    })
    
    return gameVendors;
}

// function useDataGameVendor(gameID){
// 	const {data, loading} = useGameManagementVendorQuery({ gameType: "" });
// 	if(loading) {  
// 		return [];
// 	}
//     // var gameVendors =  data.gameVendors.edges; 
//     let gameVendors = []

//     data.gameVendors.edges.map((o, index) => {
//         if(o.node.gameType) {
//             gameVendors.push(o)
//         }
//     })

//     return gameVendors;
// }

function useDataGames(){
	const {data, loading} = useGameQuery({ mutation: true });
	if(loading) {  
		return [];
    }
    
    var games =  data.gameVendors.edges; 

    return games;
}

export default function SecondModal({open, setOpen, commissionGame, commissionGamePk, strings}) {

    const gameTypes = useDataGamesType()
    const games = useDataGames()

    const [refresh, setRefresh] = useState(false)

    function commissionGameHandler(event) {
        event.persist()
        const id = event.target.id

        if(!commissionGame.includes(id)) {
            commissionGame.push(id)
        } else {
            let index = commissionGame.indexOf(id)
            if (index > -1) {
                commissionGame.splice(index, 1)
            }
        }
        setRefresh(!refresh)
    }
    
    function commissionGamePkHandler(event) {
        event.persist()
        let id = event.target.id
        const pk = event.target.value

        if(!commissionGamePk.includes(pk)) {
            commissionGamePk.push(pk)
        } else {
            let index = commissionGamePk.indexOf(pk)
            if (index > -1) {
                commissionGamePk.splice(index, 1)
            }
        }
        setRefresh(!refresh)
    }
    console.log(commissionGamePk, 'asd')
    // function commissionGameVendorHandler(event) {
    //     event.persist()
    //     let id = event.target.id
    //     const name = event.target.name
    //     let pk = event.target.value

    //     if(!commissionGameVendor.find(o => o.gameId === id)) {
    //         commissionGameVendor.push({gameId: id, gameTypeID: name, pk: pk})
    //     } else {
    //         let index = commissionGameVendor.findIndex(o => o.gameId === id) 
    //         if (index > -1) {
    //             commissionGameVendor.splice(index, 1)
    //         }
    //     }
    //     setRefresh(!refresh)
    // }

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
                <DialogTitle id="form-dialog-title">{strings.pleaseSelectGames}</DialogTitle>
                <DialogContent>
            
                <Grid container>
                    {gameTypes.map((game, idx) => <Fragment>
                        <Grid container alignItems='center' style={{ backgroundColor: '#E3E9F0'}}>
                            <Grid item>
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
                            </Grid>
                            <Grid item>
                                <Typography>{
                                    game.node.name === "chess" ? strings.chess
                                    : game.node.name === "esport" ? strings.esport
                                    : game.node.name === "electronic" ? strings.electronic
                                    : game.node.name === "fishing" ? strings.fishing
                                    : game.node.name === "video" ? strings.video
                                    : game.node.name === "sport" ? strings.sport
                                    : game.node.name === "lottery" ? strings.lottery
                                    : strings.sports
                                } </Typography>
                            </Grid>  
                        </Grid>
                        
                        {
                            // commissionGame.map((o) => 
                            //     o === game.node.id ?
                                <Grid container alignItems="center" justify="center">
                                    {games.map((x) => <Fragment>
                                        {game.node.id === x.node.gameType.id ?
                                            <Fragment>
                                            <Grid container style={{ maxWidth: 300 }} alignItems="center">
                                                <Grid item style={{ pmarginLeft: "1rem" }}>
                                                    <Checkbox
                                                        // disabled={Boolean(commissionGame.find((id) => { return id === vendor.node.gameType.id ? false : true }))}
                                                        checked={Boolean(commissionGamePk.find((o) => { return o == x.node.pk ? true : false }))}
                                                        id={x.node.id}
                                                        name={x.node.gameType.id}
                                                        onChange={commissionGamePkHandler}
                                                        value={x.node.pk}
                                                        color="primary"
                                                        inputProps={{
                                                        'aria-label': 'secondary checkbox',
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item>
                                                    <Typography>{x.node.name}</Typography>
                                                </Grid>
                                            </Grid>
                                            </Fragment>
                                            :
                                            null
                                        }
                                        </Fragment>
                                    )}  
                                </Grid>  
                                // :
                                // null
                            // )
                        }
                        {/* <Grid hidden={commissionGame.length > 0 ? Boolean(commissionGame.find((id) => { return id === game.node.id ? false : true })) : true }> */}
                            
                        {/* </Grid> */}
                    </Fragment>
                    )} 
                </Grid>

                </DialogContent>
                
                <Grid style={{paddingTop: 30, marginBottom: 30}} direction="column" alignItems="center" container>
                    <Grid item>
                        <Button style={{width: 110, marginRight:20, height: 30}} color="primary" variant="contained" onClick={handleClose}>{strings.save}</Button>
                        <Button style={{width: 110, marginRight:20, height: 30}} color="primary" variant="contained" onClick={handleClose}>{strings.cancel}</Button>
                    </Grid>
                </Grid>

            </Dialog>
}