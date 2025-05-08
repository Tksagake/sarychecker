export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type PersonalInfo = {
  firstName: string;
  secondName: string;
  phone: string;
  email: string;
  idNumber: string;
  country: string;
  county: string;
  physicalAddress: string;
};

export type DocumentInfo = {
  goodConduct: File[] | null;
  driversLicense: File[] | null;
  logBook: File[] | null;
  insurance: File[] | null;
};

export type ConsentInfo = {
  consentGiven: boolean;
  consentDate?: Date;
};

export type FormData = {
  personalInfo: PersonalInfo;
  documentInfo: DocumentInfo;
  consentInfo: ConsentInfo;
  userId?: string;
  applicationId?: string;
  formProgress?: number;
  lastSaved?: Date;
};