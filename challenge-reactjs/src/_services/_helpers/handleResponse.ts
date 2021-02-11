import {authenticationService} from "../authenticationService";

export function handleResponse(response: Response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                // Auto logout if JWT is no longer valid
                authenticationService.logout();
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject({status: 401, error: error});
        }

        return data;
    });
}
