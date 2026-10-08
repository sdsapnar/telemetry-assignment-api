const mockUsers = [
  {
    user_id: 1,
    client_id: 1,
    role_id: 1,
    user_name: 'Administrator',
    user_email: 'admin@telemetry-assignment.com',
    role_name: 'Software Engineer',
    client_name: 'Information Technology',
    password: 'Admin@123',
    profile_photo: null,
    mobile: '+91 9876543210'
  },
  {
    user_id: 2,
    client_id: 1,
    role_id: 2,
    user_name: 'Field Technician',
    user_email: 'operator@telemetry-assignment.com',
    role_name: 'Systems Operator',
    client_name: 'Service Division',
    password: 'Operator@123',
    profile_photo: null,
    mobile: '+91 9876543211'
  }
];

const mockMenus = [
  {
    id: 1,
    parent_id: null,
    display_order: 1,
    title: 'Telemetry Dashboard',
    link: '/dashboard',
    icon: 'mat_outline:dashboard',
    roles: [1, 2]
  },
  {
    id: 2,
    parent_id: null,
    display_order: 2,
    title: 'Live Trend Analysis',
    link: '/trends',
    icon: 'mat_outline:show_chart',
    roles: [1, 2]
  },
  {
    id: 3,
    parent_id: null,
    display_order: 3,
    title: 'Data Export & Logs',
    link: '/export',
    icon: 'heroicons_outline:arrow-down-tray',
    roles: [1, 2]
  }
];

const activeSessions = new Map();

module.exports = {
  mockUsers,
  mockMenus,
  activeSessions
};
