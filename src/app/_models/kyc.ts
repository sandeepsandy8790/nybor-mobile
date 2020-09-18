export class IKYC{
    id?:string;
    aadharID?:string
    documentType?:number;
    fileInput?:string;
}

export enum IKYCSTATUS {
    PENDDING,
    VERIFIED,
    FAMILY_KYC
  }