export type UserModel = {
  id: string;
  name: string;
  email: string;
  role?: {
    id?: string | null;
    name?: string | null;
  } | null;
  company_id: string | null;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
