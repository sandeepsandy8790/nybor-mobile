import { Injectable } from '@angular/core';



@Injectable()
export class TokenHelper {
    constructor( private storage: Storage) {
    this.storage.get(this.key).then((val) => {
        this.userEmail = val;
        console.log(this.userEmail);
  });
}
        static USER_DETAILS = 'User@!&!&&';
        private  static LOGIN_IDENTIFIER = 'mickeymouse';
        key = 'email';
        userEmail: any;

        public static SaveLoginToken(data: string) {
            window.localStorage.setItem(this.LOGIN_IDENTIFIER, data);
        }
        public static SaveUserDetails(data: string) {
            window.localStorage.setItem(this.USER_DETAILS, JSON.stringify(data));
        }
       
        public static GetUserDetails() {
       
            return window.localStorage.getItem(this.USER_DETAILS);
        }
     
        public static GetLoginToken() {
    
            return window.localStorage.getItem(this.LOGIN_IDENTIFIER);
        }
        public static RemoveUserDetails() {
            window.localStorage.removeItem(this.USER_DETAILS);
        }
        public static RemoveLoginToken() {
            window.localStorage.removeItem(this.LOGIN_IDENTIFIER);
        }
       

}
