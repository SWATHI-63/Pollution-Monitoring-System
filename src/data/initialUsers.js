/**
 * Initial users data for User Management module
 * Note: Login accepts ANY valid email; these provide initial user management entries.
 */

export const INITIAL_USERS = [
  {
    id: 'usr-1',
    name: 'Admin Supervisor',
    email: 'admin@ecocomply.com',
    role: 'ADMIN',
    department: 'Environmental Safety & Compliance',
    status: 'ACTIVE',
    createdAt: '2026-01-15',
    lastLogin: '2026-09-11 12:45'
  },
  {
    id: 'usr-2',
    name: 'Swathi Ramanathan',
    email: 'swathi@example.com',
    role: 'EMPLOYEE',
    department: 'Plant Operations & Monitoring',
    status: 'ACTIVE',
    createdAt: '2026-02-10',
    lastLogin: '2026-09-11 11:20'
  },
  {
    id: 'usr-3',
    name: 'Karthik Raja',
    email: 'karthik.raja@industrial.org',
    role: 'EMPLOYEE',
    department: 'Water Treatment Division',
    status: 'ACTIVE',
    createdAt: '2026-03-01',
    lastLogin: '2026-09-10 16:50'
  },
  {
    id: 'usr-4',
    name: 'Elena Rostova',
    email: 'elena.rostova@eco-audit.net',
    role: 'EMPLOYEE',
    department: 'Field Audit & Sampling',
    status: 'INACTIVE',
    createdAt: '2026-04-12',
    lastLogin: '2026-08-20 09:15'
  }
];

