export type AdminContactStatus = "NEW" | "READ" | "ARCHIVED";

export interface AdminContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: AdminContactStatus;
  locale: "es" | "en";
  createdAt: string;
}
