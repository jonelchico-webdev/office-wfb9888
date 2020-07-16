
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Typography, Modal, Button, Paper, Grid, Divider} from '@material-ui/core';
import useLanguages from '../hooks/use-languages';
import {COMMON} from '../paths';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const useStyles = makeStyles(theme => ({
	paper: {
		position: 'absolute',
		width: 400,

		padding: theme.spacing(2),
		outline: 'none',
		top: `50%`,
		left: `50%`,
		transform: `translate(-50%, -50%)`
	},
	actions: {
		paddingTop: theme.spacing(2)
    },
    toggleContainer: {
        margin: theme.spacing(2, 0),
        width: '100%'
    },
}));

export default function SimpleModal({open, setOpen}) {
	const strings = useLanguages(COMMON);
	const handleClose = () => {
		setOpen(false);
    };
    
    const [alignment, setAlignment] = React.useState('left');
    const [formats, setFormats] = React.useState(() => ['bold']);

    const handleFormat = (event, newFormats) => {
        setFormats(newFormats);
    };

    const handleAlignment = (event, newAlignment) => {
        setAlignment(newAlignment);
    };
    
	const classes = useStyles();
	return (
		<Modal
			aria-labelledby="modal-title"
			aria-describedby="modal-description"
			open={open}
			onClose={handleClose}
		>
            <Paper className={classes.paper}>
                {/* <Grid container justify="flex-end" alignItems="flex-end">
                    <IconButton size="small" onClick={handleClose}>
                        <CloseIcon style={{fontSize: 8}}/>
                    </IconButton>
                </Grid>
                <Grid container >
                    <Grid item>
                        <Typography id="modal-title" style={{ fontSize: "2em"}}>
                            ABCDEFG
                        </Typography>
                        <hr/>
                    </Grid>
                    <Grid container>
                        <Typography variant="body2" id="simple-modal-description">
                            <div className={classes.toggleContainer}>
                                <ToggleButtonGroup
                                    value={alignment}
                                    exclusive
                                    onChange={handleAlignment}
                                    aria-label="text alignment"
                                    fullWidth
                                >
                                    <ToggleButton value="left" aria-label="left aligned">
                                    <Button> Picture 1 <br/> abcdef</Button>
                                    </ToggleButton>
                                    <ToggleButton value="right" aria-label="right aligned">
                                    <Button> Picture 2 <br/> abcdef</Button>
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </div>
                        </Typography>
                    
                    </Grid>
                </Grid>
                <Grid container justify="flex-end" spacing={1} className={classes.actions}>
                    <Grid item><Button variant="outlined" onClick={handleClose}>{strings.cancel}</Button></Grid>
                    <Grid item><Button variant="contained" color="primary">{strings.continue}</Button></Grid>
                </Grid> */}
                <Grid container>
                    <Typography style={{ fontSize: "1em" }}>
                        ABCDEFG
                    </Typography>
                </Grid>
                <Divider light="true"/>
                <Grid container className={classes.toggleContainer}>
                    {/* <Typography variant="body2" id="simple-modal-description"> */}
                            <Grid container>
                                <ToggleButtonGroup
                                    value={alignment}
                                    exclusive
                                    onChange={handleAlignment}
                                    aria-label="text alignment"
                                >
                                    <ToggleButton value="left" aria-label="left aligned">
                                    <Button> Picture 1 <br/> abcdef</Button>
                                    </ToggleButton>
                                    <ToggleButton value="right" aria-label="right aligned">
                                    <Button> Picture 2 <br/> abcdef</Button>
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                    {/* </Typography>
                     */}
                </Grid>
            </Paper>
		</Modal>
	);
}
