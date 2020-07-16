import React, { useEffect, Fragment } from 'react';
import { Paper, Divider, Grid, Button, Typography, TextField } from '@material-ui/core';
import { Title, Loading } from '../../../components';
import { makeStyles } from '@material-ui/styles';
import useLanguages from '../../../hooks/use-languages';
import { PERSONAL_INFORMATION } from '../../../paths';
import InfoIcon from '@material-ui/icons/Info';
import { usePersonalInformationQuery, UPDATE_PERSONAL_INFORMATION_MUTATE, CHANGE_PASSWORD_MUTATE, ACCOUNT_FUNDS } from '../../../queries-graphql/system-management/personal-information'
import { useMutation } from '@apollo/react-hooks'
import swal from 'sweetalert2';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4, 12, 4, 12),
        '& > span': {
            margin: theme.spacing(2),
        },
    },
    padding: {
        padding: theme.spacing(2)
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    dense: {
        marginTop: theme.spacing(2),
    },
    button: {
        margin: theme.spacing(1),
    },
}));



function PersonalInformationQuery(username) {
    const { data, loading } = usePersonalInformationQuery({ username: username })
    if (loading) {
        return null
    }
    return data.users.edges[0]
}


export default function PersonalInformation(props) {
    const classes = useStyles();
    const strings = useLanguages(PERSONAL_INFORMATION);
    const [basicInformationBtn, setBasicInformationBtn] = React.useState(false)
    const [changePasswordBtn, setChangePasswordBtn] = React.useState(false)

    const { history } = props;

    const [newPassword, setNewPassword] = React.useState({
        passwordOld: '',
        password: '',
        confirmPassword: '',
    })

    const [filterValues, setFilterValues] = React.useState({
        id: null,
        username: null,
        name: null,
        phone: null,
        email: null,
    });


    const splitHistory = history.location.pathname.split('/', 4)
    const username = splitHistory[3]
    const personalInformation = PersonalInformationQuery(username)

    function handleFilterChange(event) {
        event.persist()
        setFilterValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
        }));
    }

    function handleNewPasswordChange(event) {
        event.persist()
        setNewPassword(oldNewPassword => ({
            ...oldNewPassword,
            [event.target.name]: event.target.value
        }))
    }



    const [updatePersonalInformation] = useMutation(UPDATE_PERSONAL_INFORMATION_MUTATE)
    const [mutatePassword] = useMutation(CHANGE_PASSWORD_MUTATE)

    useEffect(() => {
        if (personalInformation) {
            setFilterValues({
                ...filterValues,
                id: personalInformation.node.id,
                username: personalInformation.node.username,
                name: personalInformation.node.name,
                phone: personalInformation.node.phone,
                email: personalInformation.node.email,
            })
        }
    }, [personalInformation])

    function passwordClear() {
        setNewPassword({
            passwordOld: '',
            password: '',
            confirmPassword: '',
        })
    }

    async function saveBasicInformation() {
        setBasicInformationBtn(true)
        const res = await updatePersonalInformation({
            variables: filterValues
        })
        if (res.data.user.errors.length === 0) {
            swal.fire({
                position: 'center',
                type: 'success',
                title: strings.successUpdate,
                showConfirmButton: false,
                timer: 1500
            })
            setBasicInformationBtn(false)
        } else {
            swal.fire({
                position: 'center',
                type: 'error',
                title: res.data.user.errors[0].messages[0],
                showConfirmButton: false,
                timer: 1500
            })
            setBasicInformationBtn(false)
        }
    }

    async function saveNewPassword() {
        setChangePasswordBtn(true)
        let validPassword = true
        if (newPassword.password !== newPassword.confirmPassword) {
            validPassword = false
        }
        if (validPassword) {
            let noInputPassword = false
            if (newPassword.password !== '' || newPassword.confirmPassword !== '' || newPassword.passwordOld !== '') {
                var resPass = await mutatePassword({
                    variables: newPassword
                })

                if (resPass.data.ChangePassword.success === true) {
                    swal.fire({
                        position: 'center',
                        type: 'success',
                        title: strings.successUpdate,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    passwordClear()
                    setChangePasswordBtn(false)
                } else if (resPass.data.ChangePassword.success === false) {
                    noInputPassword = false
                    if (resPass.data.ChangePassword.errors[1] === "can only change the non staff account") {
                        swal.fire({
                            position: 'center',
                            type: 'error',
                            title: strings.errorUpdate1,
                            showConfirmButton: false,
                            timer: 1500
                        })
                        passwordClear()
                        setChangePasswordBtn(false)
                    } else if (resPass.data.ChangePassword.errors[1] === "Passwords can't be the same") {
                        swal.fire({
                            position: 'center',
                            type: 'error',
                            title: strings.errorPasswordCantBeTheSame,
                            showConfirmButton: false,
                            timer: 1500
                        })
                        passwordClear()
                        setChangePasswordBtn(false)
                    }
                }
            } else {
                swal.fire({
                    position: 'center',
                    type: 'error',
                    title: strings.errorNewPassword,
                    showConfirmButton: false,
                    timer: 1500
                })
                passwordClear()
                setChangePasswordBtn(false)
            }
        } else {
            swal.fire({
                position: 'center',
                type: 'error',
                title: strings.errorNewPassword,
                showConfirmButton: false,
                timer: 1500
            })
            passwordClear()
            setChangePasswordBtn(false)
        }
    }

    return <Paper >
        <Grid container justify="center" style={{ paddingTop: 12, paddingBottom: 12 }}>
            <Title pageTitle={strings.basicInformation} />

            {personalInformation !== null ?
                <Fragment>
                    
                <Grid item md={6}>

                    <Grid container className={classes.padding} style={{ marginRight: 12, marginLeft: 12 }} direction="column" justify="center" alignItems="center" spacing={2}>
                        <Grid item container alignItems="center" >
                            <InfoIcon color="primary" />
                            <Typography variant='h5' style={{ marginLeft: 12, fontWeight: "bold" }} >{strings.basicInformation}</Typography>
                        </Grid>

                        <Grid item alignItems="center" container >
                            <Grid item md={4}>
                                <Typography>{strings.username}</Typography>
                            </Grid>

                            <Grid item md={8}>
                                <TextField style={{ maxWidth: 250 }} type="text" name="username" value={filterValues.username} variant="outlined" margin="dense" onChange={handleFilterChange}/>
                            </Grid>
                        </Grid>

                        <Grid item alignItems="center" container >
                            <Grid item md={4}>
                                <Typography>{strings.name}</Typography>
                            </Grid>

                            <Grid item md={8}>
                                <TextField style={{ maxWidth: 250 }} type="text" name="name" value={filterValues.name} variant="outlined" margin="dense" onChange={handleFilterChange} />
                            </Grid>
                        </Grid>

                        <Grid item alignItems="center" container >
                            <Grid item md={4}>
                                <Typography>{strings.cellphoneNumber}</Typography>
                            </Grid>

                            <Grid item md={8}>
                                <TextField style={{ maxWidth: 250 }} type="number" name="phone" value={filterValues.phone} variant="outlined" margin="dense" onChange={handleFilterChange} />
                            </Grid>
                        </Grid>

                        <Grid item alignItems="center" container >
                            <Grid item md={4}>
                                <Typography>{strings.mailbox}</Typography>
                            </Grid>

                            <Grid item md={8}>
                                <TextField style={{ maxWidth: 250 }} type="text" name="email" value={filterValues.email} variant="outlined" margin="dense" onChange={handleFilterChange} />
                            </Grid>
                        </Grid>
                        <Grid item alignItems="center" >
                            <Button style={{ height: 30, minWidth: 250 }} disabled={basicInformationBtn} fullWidth color="primary" variant="contained" onClick={saveBasicInformation}>{strings.saveChanges}</Button>

                        </Grid>

                    </Grid>
                
                </Grid>

                    <Grid item md={12}> 
                        <Divider />

                    </Grid>
                    {/* END */}

                <Grid item md={6} >
                    <Grid container className={classes.padding} style={{ marginRight: 12, marginLeft: 12 }} direction="column" justify="center" alignItems="center" spacing={2}>
                        <Grid item container alignItems="center" >
                            <InfoIcon color="primary" />
                            <Typography variant='h5' style={{ marginLeft: 12, fontWeight: "bold" }} >{strings.changePassword}</Typography>
                        </Grid>

                        <Grid item alignItems="center" container >
                            <Grid item md={4}>
                                <Typography>{strings.currentPassword}</Typography>
                            </Grid>

                            <Grid item md={8}>
                                <TextField style={{ maxWidth: 250 }} type="password" name="passwordOld" value={newPassword.passwordOld} variant="outlined" margin="dense" onChange={handleNewPasswordChange} />
                            </Grid>
                        </Grid>

                        <Grid item alignItems="center" container >
                            <Grid item md={4}>
                                <Typography>{strings.newPassword}</Typography>
                            </Grid>

                            <Grid item md={8}>
                                <TextField style={{ maxWidth: 250 }} type="password" name="password" value={newPassword.password} variant="outlined" margin="dense" onChange={handleNewPasswordChange} />
                            </Grid>
                        </Grid>

                        <Grid item alignItems="center" container >
                            <Grid item md={4}>
                                <Typography>{strings.confirmPassword}</Typography>
                            </Grid>

                            <Grid item md={8}>
                                <TextField style={{ maxWidth: 250 }} type="password" name="confirmPassword" value={newPassword.confirmPassword} variant="outlined" margin="dense" onChange={handleNewPasswordChange} />
                            </Grid>
                        </Grid>
                        <Grid item alignItems="center" >
                            <Button style={{ height: 30, minWidth: 250 }} fullWidth color="primary" disabled={changePasswordBtn} variant="contained" onClick={saveNewPassword}>{strings.saveChanges}</Button>

                        </Grid>



                    </Grid>

                    {/* END */}

                    {/* <Grid container direction="column" alignItems="center" >
                <Grid  container alignItems="center" spacing={1}>
                    <InfoIcon color="primary" />
                    <Typography variant='h6' >{strings.googleValidator}</Typography>
                </Grid>

            </Grid>



            <Grid container direction="column" alignItems="center">

                <Grid  alignItems="center" container >
                    <Grid item md={2}>
                    </Grid>

                    <Grid item md={8} style={{ marginTop: '1rem' }}>
                        <Button style={{ height: 30 }} fullWidth color="primary" variant="contained">{strings.blindGoogleValidator}</Button>
                    </Grid>
                </Grid>

            </Grid>

            <Grid container direction="column" alignItems="center" >

                <Grid  container alignItems="center" spacing={1}>
                    <InfoIcon color="primary" />
                    <Typography >{strings.tips}:</Typography>
                </Grid>

                <Grid  container alignItems="center" spacing={1} style={{ marginTop: '1rem' }}>

                    <Grid item>
                        <Typography >
                            {strings.tipsTitle1}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography >
                            {strings.tipsTitle2}:
                        </Typography>
                    </Grid>

                </Grid>

                <Grid  container alignItems="center" spacing={1} style={{ marginTop: '1rem' }}>

                    <Grid item>
                        <Typography >
                            1. {strings.tips1}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography >
                            2. {strings.tips2}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography >
                            3. {strings.tips3}:
                        </Typography>
                    </Grid>

                </Grid>



            </Grid> */}

                </Grid>

                </Fragment>
                : <Loading />}

        </Grid>
    </Paper>
}