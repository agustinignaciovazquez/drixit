import React, { useReducer, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import {authenticationService} from "./_services/authenticationService";
import { History, LocationState } from "history";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            //display: 'flex',
            flexWrap: 'wrap',
            width: 500,
            margin: `${theme.spacing(0)} auto`
        },
        loginBtn: {
            marginTop: theme.spacing(2),
            flexGrow: 1
        },
        header: {
            textAlign: 'center',
            background: '#212121',
            color: '#fff'
        },
        card: {
            marginTop: theme.spacing(10)
        }
    })
);


interface LoginProps {
    history: History<LocationState>;
}

type State = {
    email: string,
    password: string,
    isMailValid: boolean,
    isLoginSuccess: boolean,
    isButtonDisabled: boolean,
    isError: boolean,
    errorString: string,
};

const initialState: State = {
    email: "",
    password: "",
    isMailValid: false,
    isLoginSuccess: false,
    isButtonDisabled: true,
    isError: false,
    errorString: "",
};

type Action = {type: 'setEmail', payload: string} |
            {type: 'setPassword', payload: string} |
            {type: 'setIsMailValid', payload: boolean} |
            {type: 'setIsLoginSuccess', payload: boolean} |
            {type: 'setIsButtonDisabled', payload: boolean} |
            {type: 'setIsError', payload: {isError: boolean, errorString: string}};

const reducer = (state: State, action: Action): State => {
    switch(action.type){
        case 'setEmail':
            return {
                ...state,
                email: action.payload
            };
        case 'setPassword':
            return {
                ...state,
                password: action.payload
            };
        case 'setIsMailValid':
            return {
                ...state,
                isMailValid: action.payload
            };
        case 'setIsLoginSuccess':
            return {
                ...state,
                isLoginSuccess: action.payload
            };
        case 'setIsButtonDisabled':
            return {
                ...state,
                isButtonDisabled: action.payload
            };
        case 'setIsError':
            return {
                ...state,
                isError: action.payload.isError,
                errorString: action.payload.errorString
            };

    }
}

const Login = (props: LoginProps) => {
    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer,initialState);

    useEffect(()=>{
        if(authenticationService.isLoggedIn())
            props.history.push('/me');
    }, [])

    useEffect(() => {
        if (state.isMailValid && state.password.trim()) {
            dispatch({
                type: 'setIsButtonDisabled',
                payload: false
            });
        } else {
            dispatch({
                type: 'setIsButtonDisabled',
                payload: true
            });
        }
    }, [state.isMailValid, state.password]);

    const handleLogin = () => {
        authenticationService.login(state.email,state.password)
            .then(jwt =>{
                props.history.push('/me');
            }).catch(err => {
                dispatch({
                    type: 'setIsError',
                    payload: {isError: true, errorString: "Wrong email or password"}
                });
            });
    }

    const checkEmailFormat = (email: String): boolean =>{
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const dispatchEmailState = ():boolean => {
        const isMailValid: boolean = checkEmailFormat(state.email);
        const errorString: string = isMailValid? "" : "Invalid mail";

        dispatch({
            type: 'setIsMailValid',
            payload: isMailValid
        });

        dispatch({
            type: 'setIsError',
            payload: {isError: !isMailValid, errorString: errorString}
        });
        return isMailValid;
    }

    const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) =>{
        dispatchEmailState();
    }

    const handleEmailKeyPress = (event: React.KeyboardEvent) => {
        if (event.keyCode === 13 || event.which === 13) {
            event.preventDefault();
            dispatchEmailState() || state.isButtonDisabled || handleLogin();
        }
    };

    const handlePasswordKeyPress = (event: React.KeyboardEvent) => {
        if (event.keyCode === 13 || event.which === 13) {
            event.preventDefault();
            state.isButtonDisabled || handleLogin();
        }
    };

    const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> =
        (event) => {
            dispatch({
                type: 'setEmail',
                payload: event.target.value
            });
        };

    const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> =
        (event) => {
            dispatch({
                type: 'setPassword',
                payload: event.target.value
            });
        }

    return (
        <form className={classes.container} noValidate autoComplete="off">
            <Card className={classes.card}>
                <CardHeader className={classes.header} title="Login App" />
                <CardContent>
                    <div>
                        <TextField
                            error={state.isError}
                            fullWidth
                            id="email"
                            type="email"
                            label="Email"
                            placeholder="Email"
                            margin="normal"
                            helperText={state.errorString}
                            onChange={handleEmailChange}
                            onKeyPress={handleEmailKeyPress}
                            onBlur={handleOnBlur}
                        />
                        {state.isMailValid &&
                            <TextField
                                error={state.isError}
                                fullWidth
                                id="password"
                                type="password"
                                label="Password"
                                placeholder="Password"
                                margin="normal"
                                onChange={handlePasswordChange}
                                onKeyPress={handlePasswordKeyPress}
                            />
                        }
                    </div>
                </CardContent>
                <CardActions>
                    <Button
                        variant="contained"
                        size="large"
                        color="secondary"
                        className={classes.loginBtn}
                        onClick={handleLogin}
                        disabled={state.isButtonDisabled}>
                        Login
                    </Button>
                </CardActions>
            </Card>
        </form>
    );
}

export default Login;

