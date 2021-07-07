import React from 'react';
import { register, setSuccess } from '../../store/actions/register.action'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import AddressForm from './AddressForm';
import UserForm from './UserForm';

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
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

const steps = ['Informe dados pessoais', 'Escolha email e senha da conta'];

function getStepContent(step) {
    switch (step) {
        case 0:
            return <AddressForm />;
        case 1:
            return <UserForm />;
        default:
            throw new Error('Etapa desconhecida');
    }
}

export default function Checkout() {
    const dispatch = useDispatch();
    const { user, success } = useSelector(state => state.registerReducer);

    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    if (success === null) {
        dispatch(setSuccess(user));
        setActiveStep(0);
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar position="absolute" color="default" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" color="inherit" noWrap>
                        <Link color="inherit" href="https://alexpereira.net.br/" target="_blank"><b>Alex Pereira</b> | Cadastro de usuários</Link>
                    </Typography>
                </Toolbar>
            </AppBar>
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h4" align="center">
                        Cadastro
                    </Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <React.Fragment>
                        {getStepContent(activeStep)}
                        <div className="row">
                            <div className="col-6 d-flex justify-content-start">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    href="/"
                                    className={classes.button}
                                >
                                    Efetuar login
                                </Button>
                            </div>
                            <div className="col-6 d-flex justify-content-end">
                                <div className="">
                                    {activeStep !== 0 && (
                                        <Button onClick={handleBack} className={classes.button}>
                                            Voltar
                                        </Button>
                                    )}
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={activeStep === steps.length - 1 ? () => dispatch(register(user)) : handleNext}
                                        className={classes.button}

                                    >
                                        {activeStep === steps.length - 1 ? 'Cadastrar' : 'Continuar'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                </Paper>
                <Typography className="mb-5" variant="body2" color="textSecondary" align="center">
                    <Link color="inherit" href="https://alexpereira.net.br/" target="_blank">
                        Copyright © alexpereira.net.br {new Date().getFullYear()}
                    </Link>
                </Typography>
            </main>

            {(success) &&
                <Redirect to="/home" />
            }

        </React.Fragment>
    );
}
