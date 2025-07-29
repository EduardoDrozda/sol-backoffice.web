export type UserModel = {
  id: string;
  name: string;
  email: string;
  role?: {
    id?: string | null;
    name?: string | null;
  } | null;
  company_id: string | null;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}
