import * as dormitory from './api/dormitory'
import * as managementClass from './api/managementClass'
import * as people from './api/people'
import * as login from './api/login'
import * as FastMale from './api/FastMale'
import * as EquipmentManagement from './api/EquipmentManagement'
import * as disciplinaryRecord from './api/disciplinaryRecord'
import * as Notice from './api/Notice'
import * as applicationRecord from './api/applicationRecord'
import * as Role from './api/Role'
import * as pliceNotesRecord from './api/pliceNotesRecord'
import * as Account from './api/Account'
import * as VistorNotesRecord from './api/VistorNotesRecord'
import * as DormitoryManagement from './api/DormitoryManagement'
import * as IndexPage from './api/IndexPage'
import * as ExportFile from './api/ExportFile'

export default {
  ...dormitory,
  ...managementClass,
  ...people,
  ...login,
  ...FastMale,
  ...EquipmentManagement,
  ...disciplinaryRecord,
  ...Notice,
  ...Role,
  ...applicationRecord,
  ...pliceNotesRecord,
  ...Account,
  ...VistorNotesRecord,
  ...DormitoryManagement,
  ...IndexPage,
  ...ExportFile
}
