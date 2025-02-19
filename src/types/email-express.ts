import { ColumnMapping } from './column-mapping';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EmailHistory {
  id: string;
  templateId: string;
  templateName: string;
  recipients: number;
  status: 'success' | 'error';
  date: string;
  error?: string;
}

export interface ImportedData {
  headers: string[];
  rows: Record<string, string>[];
  mapping: ColumnMapping;
}

export interface SmtpConfig {
  id: string;
  name: string;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromName: string;
  fromEmail: string;
  isDefault: boolean;
}

export interface PreviewData {
  subject: string;
  content: string;
  to: string;
  attachments: File[];
  from: string;
}