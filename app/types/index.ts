export interface QrCodeResponse {
    status: number;
    qrCodeLink: string;
    qrcode: string;
    deeplink: string;
  }
  
  export interface StatusCheckResponse {
    message: string;
    nfc_tag?: string;
    chip_type?: string;
    product_id?: string;
    product_name?: string;
    status: number;
  }