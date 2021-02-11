import { handleResponse } from './_helpers/handleResponse';
import {config} from "../config";

export const authenticationService = {
    login,
    logout,
    getJwtToken,
    isLoggedIn,
};

interface jwtToken {
    "jwt-token": string;
}

function login(email: string, password: string) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "email": email, "password": password })
    };

    return fetch(`${config.apiUrl}auth/login`, requestOptions)
        .then(handleResponse)
        .then(jwt => {
            //Store JWT token in localstorage
            localStorage.setItem('jwt-token', jwt["jwt-token"]);
            return jwt;
        });
}

function getJwtToken(){
    return localStorage.getItem('jwt-token');
}

function isLoggedIn(){
    return getJwtToken() !== null;
}

function logout() {
    //Remove stored JWT token in localstorage
    localStorage.removeItem('jwt-token');
}
