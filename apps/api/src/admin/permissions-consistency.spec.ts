import { PERMISSIONS as apiPermissions, STAFF_ROLES as apiStaffRoles } from './permissions';
import {
  PERMISSIONS as webPermissions,
  STAFF_ROLES as webStaffRoles,
} from '../../../web/src/lib/admin-permissions';

describe('admin permission-map consistency', () => {
  it('keeps API and web STAFF_ROLES identical', () => {
    expect(webStaffRoles).toEqual(apiStaffRoles);
  });

  it('keeps API and web PERMISSIONS identical', () => {
    expect(webPermissions).toEqual(apiPermissions);
  });
});
