import React, { useState, Fragment } from 'react';
import { Checkbox, Grid, Dialog, DialogContent, DialogTitle, Button, FormControlLabel } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/styles';
import useAgentListQuery from '../../../../queries-graphql/commission-system/affiliate-agents';
import useLanguages from '../../../../hooks/use-languages';
import { COMMISSION_MANAGEMENT_ADD } from '../../../../paths';
import Loading  from '../../../../components/loading';

const useStyles = makeStyles(theme => ({
	root: {
		position: 'relative'
	},
	padding: {
		padding: theme.spacing(2),
		'& div + div': {
			marginTop: theme.spacing(1)
		}
	},
	closeIcon: {
		position: 'absolute',
		top: 8,
		right: 8
	}
}));

function useAgentList(){
	const {data, loading} = useAgentListQuery({ mutation: false });
	if(loading) {  
		return [];
    }

    var agents =  data.affiliateProfiles.edges; 

    return agents;
}

export default function AgentLineModal({open, setOpen, agentLine}) {
    const strings = useLanguages(COMMISSION_MANAGEMENT_ADD);
    const agents = useAgentList()

    const [refresh, setRefresh] = useState(false)

    function handleClose() {
        setOpen(false)
    }

    function save(event) {
        event.preventDefault()
        setOpen(false)
    }

    function agentLineHandler(event) {
        event.persist()
        const id = event.target.id

        if(!agentLine.includes(id)) {
            agentLine.push(id)
        } else {
            let index = agentLine.indexOf(id)
            if (index > -1) {
                agentLine.splice(index, 1)
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
                                                    checked={Boolean(agentLine.find((id) => { return id == o.node.pk ? true : false }))}
                                                    id={o.node.pk}
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
                            )
                        } 
                </Grid>

                </DialogContent>
                
                <Grid style={{paddingTop: 30, marginBottom: 30}} direction="column" alignItems="center" container>
                    <Grid item>
                        <Button style={{width: 110, marginRight:20, height: 30}} color="primary" variant="contained" type="submit">{strings.save}</Button>
                        <Button style={{width: 110, marginRight:20, height: 30}} color="primary" variant="contained" onClick={handleClose}>{strings.cancel}</Button>
                    </Grid>
                </Grid>

                </form>
            </Dialog>
}