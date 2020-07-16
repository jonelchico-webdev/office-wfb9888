import React, { useState } from 'react';
import { Title, Loading } from '../../../components';
import {
    Paper,
    Grid,
    Typography,
    Button,
    FormControlLabel,
    RadioGroup,
    Radio,
    TextField,
} from '@material-ui/core';
import useLanguages from '../../../hooks/use-languages';
import { makeStyles } from '@material-ui/styles';
import { COPYWRITING_MANAGEMENT } from '../../../paths';
import EditorContainer from '../../member-management/editor';
import { useCopywritingManagementID } from '../../../queries-graphql/announcement-management/copywriting-management/copywriting-management-query'
import { COPYWRITING_ADD_MUTATION, COPYWRITING_MODIFY_MUTATION } from '../../../queries-graphql/announcement-management/copywriting-management/copywriting-management-mutation'
import { useMutation } from '@apollo/react-hooks'
import swal from 'sweetalert2';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    paper: {
        padding: theme.spacing(1)
    },
    padding: {
        padding: theme.spacing(2)
    },
    textfield: {
        backgroundColor: '#ffffff',
    },
}));

export default function CopywritingForm(props) {
    const classes = useStyles();
    const strings = useLanguages(COPYWRITING_MANAGEMENT);
    const { history } = props
    const id = history.location.pathname.split('/', 6)[5]
    const type = history.location.pathname.split('/', 6)[4]

    const [value, setValue] = React.useState({
        title: '',
        position: '',
        weight: null
    });

    const [content, setContent] = useState("");

    function handleChange(event) {
        event.persist();
        setValue(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
        }));
    };

    const [addMutation] = useMutation(COPYWRITING_ADD_MUTATION)
    const [modifyMutation] = useMutation(COPYWRITING_MODIFY_MUTATION)

    async function mutate() {
        if(type === "update") {
            const res = await modifyMutation({
                variables: {
                    id: id,
                    title: value.title === '' ? copywritingManagementID.node.title : value.title,
                    position: value.position === '' ? copywritingManagementID.node.position.toLowerCase() : value.position,
                    message: content !== "" ? content : copywritingManagementID.node.message,
                    weight: value.weight === null ? copywritingManagementID.node.weight : value.weight,
                    statusChangedBy: cookies.get('ID')
                }
            })

            if (res.data) {
                swal.fire({
                    position: 'center',
                    type: 'success',
                    title: '更新',
                    showConfirmButton: false,
                    timer: 1500
                })
                history.push(COPYWRITING_MANAGEMENT)
            }
        } else {
            const res = await addMutation({
                variables: {
                    title: value.title,
                    position: value.position,
                    message: content,
                    weight: value.weight,
                    createUser: cookies.get('ID')
                }
            })

            if (res.data) {
                swal.fire({
                    position: 'center',
                    type: 'success',
                    title: '加',
                    showConfirmButton: false,
                    timer: 1500
                })
                history.push(COPYWRITING_MANAGEMENT)
            }
        }
    }

    const { data, loading } = useCopywritingManagementID({
        id: id
    });

    if (loading) {
        return <Loading />
    }

    const copywritingManagementID = data.systemDocs.edges[0];

    return <Paper elevation={1} style={{ padding: 30 }}>
        <Title pageTitle={strings.newCopywriting} />
            <Grid container direction="row" justify="space-between" alignItems="center" spacing={1}>
                <Grid item>
                    <Grid container alignItems="center">
                        <Typography style={{ marginRight: 15 }}>{strings.copyName}: </Typography>
                        <TextField
                            style={{ width: 230 }}
                            onChange={handleChange}
                            name="title"
                            className={classes.textfield}
                            variant="outlined"
                            margin="dense"
                            placeholder={strings.pleaseEnter}
                            defaultValue={ type === "update" ? copywritingManagementID.node.title : value.title}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item container direction="row" alignItems="center">
                        <Typography style={{ marginRight: 15 }}>{strings.displayPosition}: </Typography>
                        <RadioGroup
                            aria-label="Deposit Offer Options"
                            name="position"
                            onChange={handleChange}
                            defaultValue={ type === "update" ? copywritingManagementID.node.position.toLowerCase() : value.position}
                        >
                            <Grid container justify="space-between">
                                <Grid>
                                    <FormControlLabel value="reg" control={<Radio required color="primary"/>} label="注册页" />
                                </Grid>
                                <Grid>
                                    <FormControlLabel value="up" control={<Radio required color="primary"/>} label="顶栏" />
                                </Grid>
                                <Grid>
                                    <FormControlLabel value="down" control={<Radio required color="primary"/>} label="底栏" />
                                </Grid>
                                <Grid>
                                    <FormControlLabel value="wel_email" control={<Radio required color="primary"/>} label="欢迎电邮" />
                                </Grid>
                            </Grid>
                        </RadioGroup>

                    </Grid>
                </Grid>
                <Grid container alignItems="center-start" spacing={1} style={{ marginTop: 10 }}>
                    <Grid item xs={12}>
                        <Typography>{strings.copyContent}: </Typography>
                        <EditorContainer defaultValue={ type === "update" ? copywritingManagementID.node.message : null} setContent={setContent}  />
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="flex-start" alignItems="center" spacing={1} style={{ marginTop: 10, marginBottom: 30 }}>
                    <Grid item>
                        <Typography>{strings.sortWeight}: </Typography>
                    </Grid>
                    <Grid item >
                        <TextField
                            style={{ width: 230 }}
                            className={classes.textfield}
                            variant="outlined"
                            margin="dense"
                            placeholder={strings.pleaseEnter}
                            name="weight"
                            type="number"
                            onChange={handleChange}
                            defaultValue={ type === "update" ? copywritingManagementID.node.weight : value.weight}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center" spacing={2} >
                    <Grid item>
                        <Button variant="outlined" onClick={() => history.push(COPYWRITING_MANAGEMENT)} color="primary">{strings.return}</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={() => mutate()}>
                            {strings.save}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
    </Paper>
}