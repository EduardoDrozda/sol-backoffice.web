import { PermissionModel } from "./permission.model";

export type RoleModel = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  permissions: Pick<PermissionModel, 'id' | 'name'>[];
}
