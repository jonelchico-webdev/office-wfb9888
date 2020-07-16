import React, { useState, useEffect, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { CircularProgress, Paper, Grid, FormControl, Typography, TextField, Button, IconButton, Box } from '@material-ui/core';
import { Refresh, PersonOutline, LockOutlined } from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/styles';
import useLanguages from '../hooks/use-languages';
import { LOGIN } from '../paths';
import Title from '../components/title';
import Cookies from 'universal-cookie';
import { Error } from '@material-ui/icons'
import { GET_CAPTCHA, LOGIN_MUTATE, LOGIN_VALIDATE } from '../queries-graphql/use-login'
import { useMutation } from '@apollo/react-hooks'
import swal from 'sweetalert2';

function LoggingIn ()  {
    const strings = useLanguages(LOGIN);

    return <Fragment>
        {
            strings.loggingIn
        }
        <CircularProgress
            disableShrink
            color="#eaeef4"
            size={15}
            style={{marginLeft: 10}}
        /> 
        </Fragment>
}
 
const useStyles = makeStyles(theme => ({
    paper: {
        width: '480px',
        padding: theme.spacing(6),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
        left: '50%',
        top: '50%',
    },
    error: {
        backgroundColor: "#BA2525",
    },

    hoverPointer: {
        cursor: 'pointer'
    }
}));

export default function Login({ history }) {
    const classes = useStyles();
    const theme = useTheme();
    const strings = useLanguages(LOGIN);
    const stringsError = useLanguages('error')
    
    const [values, setValues] = React.useState({
        username: '',
        password: '',
        verificationCode: '',
        captchaCode: '',
        captchaKey: '',
        errorCaptcha: null,
        errorPassword: null,
        show: false,
    });

    function handleChange(event) {
        event.persist()
        setValues({ ...values, [event.target.name]: event.target.value })
    };
    const [isLoading, setIsLoading] = useState(false)
    const [loginValidate] = useMutation(LOGIN_VALIDATE)
    const [login] = useMutation(LOGIN_MUTATE)
    const [captcha] = useMutation(GET_CAPTCHA)
    const cookies = new Cookies();
    const [captchaValue, setcaptchaValue] = useState({
        captchaImg: '',
        captchaKey: ''
    })
    
    const [countdown, setCountdown] = useState(30)
    const [count, setCount] = useState(0)
    const [errorMessage, setErrorMessage] = useState("")

    async function captchaGet() {
        const res = await captcha()
        setcaptchaValue({
            captchaImg: res.data.GetCaptcha.imagePath,
            captchaKey: res.data.GetCaptcha.captchaKey
        })
        setCountdown(30)
        setValues(oldValues => ({
            ...oldValues,
            captchaCode: '',
        }));
    }

    function btnCaptchaGet() {
        captchaGet()
        setValues({
            ...values,
            captchaCode: '',
            errorCaptcha: null
        })
    }

    useEffect(() => {
        captchaGet()
    }, [])

    useEffect(() => {
        if(captchaValue.captchaImg !== "captcha_verify_disbaled") {
            const interval = setInterval(() => {
                if (isLoading) {
                    setCount(count + 1);
                    if (count > 5) {
                        setIsLoading(false);
                        setCount(0);
                        setCountdown(30);
                        setErrorMessage(stringsError.networkTimeout)
                        captchaGet()
                    }
                }
                else if (countdown > 0) {
                    setCountdown(countdown - 1)
                } else if (countdown === 0) {
                    setCountdown(30)
                    captchaGet()
                } 
            }, 1000);
            return () => clearInterval(interval);
            
        }
    }, [countdown, count])

    async function signIn(event) {
        setIsLoading(true)
        
        event.preventDefault();
        try {
            const res = await loginValidate({
                variables: {
                    username: values.username,
                    password: values.password,
                    captcha: values.captchaCode,
                    captchaKey: captchaValue.captchaKey
                }
            })

            if (res.data.LoginGetValidate.errors) {
                let error = res.data.LoginGetValidate.errors[1].toString()

                if(error === "Account is not exists") {					
                    setErrorMessage(stringsError.accountIsNotExists)
                    setIsLoading(false)
                } 
                if(error === "Incorrect credentials") {					
                    setErrorMessage(stringsError.incorrectCredentials)
                    setIsLoading(false)
                }
                if(error === "Account is been disabled") {
                    setErrorMessage(stringsError.accountIsBeenDisabled)
                    setIsLoading(false)
                }
                if(error === "Unknown Account error") {
                    setErrorMessage(stringsError.unknownAccountError)
                    setIsLoading(false)
                }
                if(error === "Captcha Incorrect") {					
                    setErrorMessage(stringsError.captchaIncorrect)
                    setIsLoading(false)
				} 
				if(error === "No Captcha Data,Please Get a Captcha First.") {
                    setErrorMessage(stringsError.noCaptchaDataPleaseGetACaptchaFirst)
                    setIsLoading(false)
                }
                setValues({
                    ...values,
                    errorCaptcha: errorMessage,
                    errorPassword: null,
                    captchaCode: '',
                    captchaKey: ''
                })
                if (res.data.LoginGetValidate.errors[0] === "Captcha") {
                    
                    captchaGet()
                } 
            } else {
                setIsLoading(true)
                setValues({
                    ...values,
                    errorCaptcha: null,
                    errorPassword: null
                })
            }

            if (res.data.LoginGetValidate.success === true) {
                const token = await login({
                    variables: {
                        username: values.username,
                        password: values.password,
                        appAutoLogin: false
                    }
                })
                if(token.data.loginBackend.errors) {
                    swal.fire({
                        position: 'center',
                        type: 'warning',
                        title: stringsError.agentAccount + res.data.LoginGetValidate.username,
                        text: stringsError.description,
                        confirmButtonText: strings.ok,
                        showConfirmButton: true
                    }).then((result) => {
                        if(result.value) {
                            setIsLoading(false)
                        }
                    })
                } else {
                    cookies.set('JWT', token.data.loginBackend.token, { path: '/' })
                    cookies.set('userType', token.data.loginBackend.profile.userType, { path: '/' })
                    cookies.set('Username', values.username, { path: '/' })
                    cookies.set('Logged', 'true', { path: '/' })
                    history.push('/')
                }
            }
        } catch (e) {
            btnCaptchaGet()
        }
    }
    
    if (cookies.get('Logged') != null) {
        return <Redirect to="/" />
    }

    async function getCsrfToken() {
        const res = await fetch(`${'process.env.REACT_APP_API_URL'}/csrf_token`, {
            method: "POST",
            // body: JSON.stringify(csrfToken)
            // credentials: 'include'
        });
        const data = await res.text()
        cookies.set('csrf_token', data, { path: '/' })
    }

    return <Fragment>
    {/* <video autoPlay loop
    style={{ 
        position: "fixed",
        right: 0,
        bottom: 0,
        height: "100%",
        minWidth: "100%",
        // minHeight: "100%"
        objectFit: "cover"
    }}
    >
        <source src={backgroundVideo}  type="video/mp4"/>
    </video> */}
    <Paper className={classes.paper} elevation={2}>
        <form onSubmit={signIn}>
            <Title pageTitle={strings.login} />

            <FormControl fullWidth={true}>
                <Grid container direction="column" spacing={2} alignContent="center">
                    <Grid item style={{ marginBottom: 15 }}>
                        <Typography variant="h3" color="primary">{strings.login}</Typography>
                    </Grid>
                    {/* <Button onClick={getCsrfToken}>TRY</Button> */}
                    {values.errorPassword ?
                        <Fragment>
                            <Grid container alignItems="center">
                                <Box mx="auto">
                                    <Typography color="error">
                                        <Error fontSize="inherit" />
                                        &nbsp;
									{values.errorPassword}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Fragment> :
                        null}

                    {errorMessage ?
                        <Fragment>
                            <Grid container alignItems="center">
                                <Box mx="auto">
                                    <Typography color="error">
                                        <Error fontSize="inherit" />
                                        &nbsp;
								{errorMessage}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Fragment> :
                        null}
                    <Grid item container >
                        <Paper style={{ backgroundColor: "white", width: "100%", border: 1 }}>
                            <Grid container direction="row" alignItems="center" spacing={2} alignContent="center" style={{ height: 60 }}>
                                <Grid item md={2} >
                                    <Box pl={1} >
                                        <PersonOutline htmlColor={theme.palette.text.secondary} />
                                    </Box>
                                </Grid>
                                <Grid item md={10}>
                                    <TextField
                                        disabled={isLoading}
                                        required
                                        id="username"
                                        name="username"
                                        fullWidth={true}
                                        placeholder={strings.username}
                                        value={values.username}
                                        onChange={handleChange}
                                        InputProps={{
                                            disableUnderline: true
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item container>
                        <Paper style={{ backgroundColor: "white", width: "100%", border: 1 }}>
                            <Grid container direction="row" alignItems="center" spacing={2} alignContent="center" style={{ height: 60 }}>
                                <Grid item md={2}>
                                    <Box pl={1} >
                                        <LockOutlined htmlColor={theme.palette.text.secondary} />
                                    </Box>
                                </Grid>
                                <Grid item md={10}>
                                    <TextField
                                        disabled={isLoading}
                                        required
                                        id="password"
                                        name="password"
                                        type="password"
                                        fullWidth={true}
                                        placeholder={strings.password}
                                        value={values.password}
                                        onChange={handleChange}
                                        InputProps={{
                                            disableUnderline: true
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    {
                        captchaValue.captchaImg === "captcha_verify_disbaled" || captchaValue.captchaImg === "" ? null :
                        <Grid item container direction="row" alignItems="center" spacing={1}>
                        <Grid item xs={6} sm={6} md={6} style={{ maxHeight: 40 }}>
                            <Paper style={{ backgroundColor: "white",  border: 1 }}>
                                <Grid container direction="row" alignItems="center" spacing={2} alignContent="center" style={{ maxHeight: 38 }} >
                                    <Grid item xs={3} sm={3} md={3} >
                                        <Box pl={1} >
                                            <IconButton onClick={btnCaptchaGet} size="small">
                                                <Refresh htmlColor={theme.palette.text.secondary} />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={7} sm={7}  md={7} >
                                        <Box pl={1} >
                                        <TextField
                                            disabled={isLoading}
                                            required
                                            id="captcha"
                                            name="captchaCode"
                                            placeholder={strings.captcha}
                                            value={values.captchaCode}
                                            onChange={handleChange}
                                            InputProps={{
                                                disableUnderline: true
                                            }}
                                        />
                                        </Box>
                                    </Grid>

                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} container direction="row" alignItems="center" style={{ maxHeight: 60 }}>
                            <Grid item>
                                <Button disabled={isLoading} onClick={btnCaptchaGet} style={{ marginRight: 10 }}>
                                    <img
                                        // src={`${process.env.REACT_APP_API_URL}/${captchaValue.captchaImg}`}

                                        src={`${process.env.REACT_APP_API_URL}/${captchaValue.captchaImg}`}
                                        // src={`https://test.office.xlm999.com:6389/${captchaValue.captchaImg}`}
                                        style={{ maxWidth: 96, maxHeight: 40 }}
                                        border={1}
                                        onClick={() => btnCaptchaGet()}
                                        className={classes.hoverPointer}
                                    />
                                </Button>
                            </Grid>
                            <Grid item>
                                <Typography style={{ color: isLoading ? 'gray' : 'blue' }}>
                                    {countdown}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    }

                    <Grid item style={{marginTop: 15}}>
                        <Button 
                            disabled={isLoading}
                            color="primary" 
                            size="medium" 
                            variant="contained" 
                            fullWidth={true} 
                            type="submit"
                        >
                            {isLoading ? <LoggingIn />   : strings.login}
                        </Button>
                    </Grid>

                </Grid>
            </FormControl>
        </form>
    </Paper>
    </Fragment>
}