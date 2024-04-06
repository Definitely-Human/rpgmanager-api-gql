export interface MailModuleOptions {
  apiKey: string;
  domain: string;
  fromEmail: string;
  isActive: boolean;
}

export interface EmailVar {
  key: string;
  value: string;
}
