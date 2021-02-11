import {authenticationService} from "../authenticationService";
import {config} from "../../config";
import {handleResponse} from "./handleResponse";

export function handleGetRequest(path: string) {
    const jwtToken = authenticationService.getJwtToken();
    if(jwtToken === null)
        return Promise.reject({status: 401});

    const requestOptions = { method: 'GET', headers: { auth: `${jwtToken}` } };
    return fetch(`${config.apiUrl}${path}`, requestOptions).then(handleResponse);
}
