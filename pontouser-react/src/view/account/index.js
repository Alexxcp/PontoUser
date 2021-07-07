import React from 'react'
import Header from '../header'
import {Redirect} from 'react-router-dom'
import { update, deleteUser } from '../../store/actions/account.action'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import AddressForm from './AddressForm';

const useStyles = makeStyles((theme) => ({
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    stepper: {
        padding: theme.spacing(3, 0, 5),
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
}));

export default function Checkout() {
    const dispatch = useDispatch();
    const { user, userdelete } = useSelector(state => state.accountReducer);

    const classes = useStyles();

    return (
        <React.Fragment>
            <Header title="Minha conta" />
            <CssBaseline />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography className="mb-5 mt-4" component="h1" variant="h4" align="center">
                        {user.status_register ? 'Minha conta' : 'Finalizar cadastro'}
                    </Typography>
                    <AddressForm />
                    <div className="row">
                        <div className="col-6 d-flex justify-content-start">
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => dispatch(deleteUser(user))}
                                className={classes.button}
                            >
                                Excluir conta
                            </Button>
                        </div>
                        <div className="col-6 d-flex justify-content-end">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => dispatch(update(user))}
                                className={classes.button}
                            >
                                Salvar
                            </Button>
                        </div>
                    </div>
                </Paper>
                <Typography className="mb-5" variant="body2" color="textSecondary" align="center">
                    <Link color="inherit" href="https://alexpereira.net.br/" target="_blank">
                        Copyright © alexpereira.net.br {new Date().getFullYear()}
                    </Link>
                </Typography>
            </main>

            {(userdelete) && <Redirect to="/" />}
        </React.Fragment>
    );
}
