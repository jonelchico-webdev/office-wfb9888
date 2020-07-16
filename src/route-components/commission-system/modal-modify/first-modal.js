import React, { useState, Fragment } from 'react';
import { Checkbox, Grid, Dialog, DialogContent, DialogTitle, Button, FormControlLabel } from '@material-ui/core';
import useAgentListQuery from '../../../queries-graphql/commission-system/affiliate-agents';
import useLanguages from '../../../hooks/use-languages';
import { COMMISSION_MANAGEMENT_ADD } from '../../../paths';
import { Loading } from '../../../components';

// const useStyles = makeStyles(theme => ({
// 	root: {
// 		position: 'relative'
// 	},
// 	padding: {
// 		padding: theme.spacing(2),
// 		'& div + div': {
// 			marginTop: theme.spacing(1)
// 		}
// 	},
// 	closeIcon: {
// 		position: 'absolute',
// 		top: 8,
// 		right: 8
// 	}
// }));

function useAgentList(){
	const {data, loading} = useAgentListQuery({ level: 0 });
	if(loading) {  
		return [];
    }

    var agents =  data.affiliateProfiles.edges; 

    return agents;
}

export default function FirstModal({open, setOpen, agentLine}) {
    const strings = useLanguages(COMMISSION_MANAGEMENT_ADD);
    const agents = useAgentList()

    const [refresh, setRefresh] = useState(false)
    const [checkBoxCount, setCheckBoxCount] = useState(0)

    function handleClose() {
        setOpen(false)
        // if(checkBoxCount < 1) {
        //     setButtonDisabled(true)
        // }
    }

    function save(event) {
        event.preventDefault()
        setOpen(false)
        // if(checkBoxCount > 0) {
        //     setButtonDisabled(false)
        // }
    }

    function agentLineHandler(event) {
        event.persist()
        const id = event.target.id

        if(!agentLine.includes(id)) {
            agentLine.push(id)
            setCheckBoxCount(checkBoxCount + 1)
        } else {
            let index = agentLine.indexOf(id)
            if (index > -1) {
                agentLine.splice(index, 1)
                setCheckBoxCount(checkBoxCount - 1)
            }
        }
        setRefresh(!refresh)
    }

    return  <Dialog 
                // fullWidth={true}
                maxWidth={180}
                open={open} 
                onClose={handleClose} 
                aria-labelledby="form-dialog-title"
            >
                <form onSubmit={save}>
                <DialogTitle id="form-dialog-title">{strings.agent}</DialogTitle>
                <DialogContent>
            
                <Grid container spacing={2} justify="center" alignItems='center' style={{ backgroundColor: '#E3E9F0'}}>
                        {
                            agents.length === 0 ?
                            <Loading/>
                            :
                            agents.map((o) => 
                            <Fragment>
                                <Grid container style={{ maxWidth: 300 }} alignItems="center">
                                    <Grid item>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={Boolean(agentLine.find((agentId) => { return agentId === o.node.id ? true : false }))}
                                                    id={o.node.id}
                                                    onChange={agentLineHandler}
                                                    value="checkedB"
                                                    color="primary"
                                                    key={o.node.id}
                                                />
                                            }
                                            label={o.node.user.username}
                                            labelPlacement="end"
                                        />
                                    </Grid>
                                </Grid>
                            </Fragment>
                                
                                // <Fragment>
                                //     <Grid container alignItems="center">
                                //         <Grid item style={{ paddingLeft: '4rem' }}>
                                //             <Checkbox
                                //                 checked={true}
                                //                 id={o}
                                //                 name={o}
                                //                 // onChange={commissionGameVendorHandler}
                                //                 value="checkedB"
                                //                 color="primary"
                                //                 inputProps={{
                                //                 'aria-label': 'secondary checkbox',
                                //                 }}
                                //             />
                                //         </Grid>

                                //         <Grid item>
                                //             <Typography>{o}</Typography>
                                //         </Grid>
                                //     </Grid>
                                // </Fragment>
                            )
                        }
                </Grid>

                </DialogContent>
                
                <Grid style={{paddingTop: 30, marginBottom: 30}} direction="column" alignItems="center" container>
                    <Grid item>
                        <Button style={{width: 110, marginRight:20, height: 30}} color="primary" variant="contained" type="submit">Save</Button>
                        <Button style={{width: 110, marginRight:20, height: 30}} color="primary" variant="contained" onClick={handleClose}>Cancel</Button>
                    </Grid>
                </Grid>

                </form>
            </Dialog>
}