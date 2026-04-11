export interface Job {
  _id?: string;
  id?: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  salary: number;
  currency: string;
  description: string;
  isBookMarked?: boolean;
  user?: string;
  experienceLevel?: string;
  createdAt?: string;
  postedAt?: string;
  rating?: number;
  applicants?: number;
  responsibilities?: string[];
}

export type Page = 'home' | 'details' | 'login' | 'signup' | 'applications' | 'companies' | 'contact' | 'admin';
