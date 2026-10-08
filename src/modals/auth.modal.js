const { mockUsers, mockMenus, activeSessions } = require('../data/mock-data');

function findUserByEmail(email) {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  return mockUsers.find(u => u.user_email.toLowerCase() === normalized);
}

function verifyPassword(user, password) {
  if (!user || !password) return false;
  return user.password === password;
}

exports.validateEmailLLogin = async (request) => {
  const { email, password } = request;
  const user = findUserByEmail(email);

  if (user && verifyPassword(user, password)) {
    return {
      return_value: 1,
      message: 'Credentials verified successfully.'
    };
  }

  return {
    return_value: 0,
    message: 'Invalid email address or password.'
  };
};

exports.userEmailLogin = async (request) => {
  const { email, password } = request;
  const user = findUserByEmail(email);

  if (user && verifyPassword(user, password)) {
    return {
      return_value: 1,
      message: 'Login successful.',
      user_id: user.user_id
    };
  }

  return {
    return_value: 0,
    message: 'Authentication failed. Please verify your credentials.'
  };
};

exports.setUserToken = async (request) => {
  const { userId, activeToken, tokenValidUpto, deviceId } = request;
  activeSessions.set(Number(userId), {
    active_token: activeToken,
    token_valid_upto: tokenValidUpto,
    device_id: deviceId
  });
  return { return_value: 1, message: 'Session token stored successfully.' };
};

exports.updateUserLogout = async (request) => {
  const { email } = request;
  const user = findUserByEmail(email);
  if (user) {
    activeSessions.delete(Number(user.user_id));
  }
  return { return_value: 1, message: 'Logged out successfully.' };
};

exports.getActiveToken = async (userId) => {
  const session = activeSessions.get(Number(userId));
  return session || null;
};

exports.getUserProfile = async (request) => {
  const { user_id } = request;
  const user = mockUsers.find(u => u.user_id === Number(user_id));
  if (!user) return null;
  const { password, ...safeProfile } = user;
  return safeProfile;
};

exports.getUsersByEmail = async (request) => {
  const { email } = request;
  const user = findUserByEmail(email);
  if (!user) return null;
  const { password, ...safeProfile } = user;
  return safeProfile;
};

exports.getNavigations = async (request) => {
  const roleId = Number(request.role_id) || 1;
  return mockMenus
    .filter(menu => menu.roles.includes(roleId))
    .map(menu => ({
      id: menu.id,
      parent_id: menu.parent_id,
      display_order: menu.display_order,
      title: menu.title,
      link: menu.link,
      icon: menu.icon
    }));
};

exports.updateUserProfile = async (request) => {
  const { userId, userName, mobile, profilePhoto } = request;
  const user = mockUsers.find(u => u.user_id === Number(userId));
  if (user) {
    if (userName) user.user_name = userName;
    if (mobile !== undefined) user.mobile = mobile;
    if (profilePhoto !== undefined) user.profile_photo = profilePhoto;
    return { return_value: 1, message: 'Profile updated successfully.' };
  }
  return { return_value: 0, message: 'User not found.' };
};
