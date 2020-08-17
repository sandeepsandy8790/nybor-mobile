import { map } from 'rxjs/operators';

// Import RxJs required methods
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';

import { TokenHelper } from './TokenHelper';

/* Registry of all the routes our app uses */
export class ServiceRegistry {

  
    public static MOBILE_LOGIN = 'login';
    public static VALIDATE_OTP='validate-otp';
    public static UPDATE_PROFILE='updateProfile';
    public static UPDATE_KYC_FILE="kyc/kyc-file";
    public static UPDATE_KYC = 'kyc/kyc-update';
    public static GET_AADHAR_BY_ID ='aadhar/get-aadhar-by-id'
}

export enum HttpProtocol {
    get,
    post
}




@Injectable()
export class ServiceProxy {

    constructor(private http: HttpClient) { this.HTTPError = new EventEmitter(); }
    /* URL */
     public BASE_URL = 'http://localhost:3080'


  

    /* Event Emitters */
    public HTTPError: EventEmitter<any> = new EventEmitter();
    public networkError: EventEmitter<any> = new EventEmitter();


    public Request(route: ServiceRegistry, data: any, protocol: HttpProtocol) {

        const url: string = this.FormURI(route);
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Basic ' + TokenHelper.GetLoginToken());
        if (protocol === HttpProtocol.get) {

            const value = this.http.post(url, data, { headers }).pipe(map(this.extractData));
            return value;
        } else {
            const value = this.http.post(url, data, { headers }).pipe(map(this.extractData));
            return value;
        }
    }

    /**
     * Singular Request resolve promise over HTTP
     * Resolving a Promise is mildly cleaner than Observables
     * Though Observables are the future, they dont offer
     * anything better than Promise.
     */
    public SingleRequest(route: ServiceRegistry, data: any, protocol: HttpProtocol = HttpProtocol.post) {

        const url: string = this.FormURI(route);
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Basic ' + TokenHelper.GetLoginToken());
        // this.createAuthorizationHeader(headers);
        if (protocol === HttpProtocol.get) {
            return this.http.post(url, data, { headers });
        } else {
            return this.http.post(url, data, { headers }).pipe(map(this.extractData));
        }

    }

    public LoadRemotefile(route: ServiceRegistry) {
        const url = this.FormURI(route);
        const headers = new HttpHeaders();
        return this.http.post(url, null, { headers }).pipe(map(res => res));

    }

    private extractData(res) {

        return res;
        // let body = res.json();
        // return body || { };
    }

    public FormURI(route: ServiceRegistry): string {
        return this.BASE_URL + '/' + route;
    }



}
