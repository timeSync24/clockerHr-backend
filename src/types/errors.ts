// src\types\errors.ts

export interface ErrorDetail {
    code: string;
    message: string;
    statusCode: number;
  }
  
  export interface ErrorMap {
    [key: string]: ErrorDetail;
  }
  