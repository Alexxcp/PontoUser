import React from 'react'
import { change, login, socialite, _index } from '../../store/actions/auth.action'
import { Redirect } from 'react-router-dom'
import { Typography, Link as LinkStyle, TextField, Button, FormControlLabel, Avatar, CssBaseline, Checkbox, Grid, Box, Container } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import { FaGithub } from 'react-icons/fa'
import queryString from 'query-string';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


export default function Auth(props) {
    let params = queryString.parse(props.location.search);
    const classes = useStyles();
    const dispatch = useDispatch();
    const { credentials, success, socialiteRedirect, socialiteDispat } = useSelector(state => state.authReducer)
    if (params.code && socialiteDispat) {
        credentials.socialite = params.code
        dispatch(login(credentials))
    }

    React.useEffect(() => {
        index();
    }, [])

    const index = () => {
        dispatch(_index())
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>

                </Avatar>
                <Typography component="h1" variant="h5">
                    Olá visitante, efetue o login
                </Typography>
                <div className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="login"
                        label="Email, CPF ou PIS"
                        name="login"
                        autoComplete="login"
                        autoFocus
                        value={credentials.login}
                        onChange={text => dispatch(change({ login: text.target.value }))}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Senha"
                        type="password"
                        id="password"
                        autoComplete="password"
                        value={credentials.password}
                        onChange={text => dispatch(change({ password: text.target.value }))}
                    />
                    <FormControlLabel
                        control={<Checkbox checked={credentials.remember} value={credentials.remember} onChange={() => dispatch(change({ remember: !credentials.remember }))} color="primary" />}
                        label="Lembrar senha"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={() => dispatch(login(credentials))}
                    >
                        Acessar
                    </Button>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        className="mb-4"
                        startIcon={<FaGithub />}
                        onClick={() => dispatch(socialite(credentials))}
                    >
                        Fazer login com o GitHub
                    </Button>

                    <Grid container
                        direction="column"
                        alignItems="center"
                    >
                        <Grid item>
                            <LinkStyle href="/register" variant="body2">
                                {"Não tem uma conta? Registre-se"}
                            </LinkStyle>
                        </Grid>
                    </Grid>
                </div>

                {(success) && <Redirect to="/home" />}
                {(socialiteRedirect) && window.location.assign(socialiteRedirect)}

            </div>
            <Box mt={8}>
                <Typography variant="body2" color="textSecondary" align="center">
                    <LinkStyle color="inherit" href="https://alexpereira.net.br/" target="_blank">
                        Copyright © alexpereira.net.br {new Date().getFullYear()}
                    </LinkStyle>
                </Typography>
            </Box>
        </Container>
    )
}
