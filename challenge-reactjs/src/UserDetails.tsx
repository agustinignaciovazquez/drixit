import React, {useEffect, useReducer} from "react";
import {History, LocationState} from "history";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {handleGetRequest} from "./_services/_helpers/handleRequest";
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
    })
);

interface UserDetailsProps {
    history: History<LocationState>;
}

type State = {
    userDetails: string | null //replace string with user interface
};

const initialState: State = {
    userDetails: null,
};

type Action = {type: 'setUserDetails', payload: string}

const reducer = (state: State, action: Action): State => {
    switch(action.type){
        case 'setUserDetails':
            return {
                ...state,
                userDetails: action.payload
            };
    }
}

const UserDetails = (props: UserDetailsProps) => {
    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer,initialState);

    useEffect(()=>{
        handleGetRequest("users/me").then(response => {
            dispatch({type:'setUserDetails', payload: JSON.stringify(response)})
        }).catch(err => {
            if(err.status === 401)
                props.history.push("/");
            //console.log(err);
        })
    }, []);

    if(state.userDetails === null)
        return (<div>Loading</div>);

    return(<div>{state.userDetails}</div>);
}

export default UserDetails;
