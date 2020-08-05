export class Iaadhar{
    id?:string;
    mobileNumber?:string;
    fullName?:string;
    dateofBirth?:string;
    gender?:IGender;
    image?:string;
    accountCreated?:Date;
    profileCompletion:boolean;
    profilePercentage?:number;
    idProof?:string;
  
}

export interface IResponse {
    result?; // deliberately left un assigned to hold mongo cursor
    status?: STATUS;
    token?: string;
    error?: string;
}

export enum STATUS {
    OK,
    IOERROR,
    AUTHERROR,
    ZERO,
    IDLE_STATE,
    FIRST_TIME_LOGIN,
    ACCOUNT_INACTIVE,
    NO_ACCOUNT,
    UPDATE_REQUIRED


}

export class IGender {
    id: number;
    gender: string;
    selected: boolean;
  }