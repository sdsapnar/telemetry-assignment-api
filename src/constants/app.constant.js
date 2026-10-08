exports.status = {
  success: 200,
  successCreated: 201,
  successNoRecords: 204,
  badRequest: 400,
  unauthorized: 401,
  unauthenticated: 403,
  notFound: 404,
  sessionExpired: 440,
  unsupportedMediaType: 415,
  internalServerError: 500,
  conflict: 409
};

exports.message = {
  success: 'Success',
  failed: 'Failed',
  parameterMissing: 'Missing required parameter(s):',
  tokenMissing: 'Token missing',
  unauthorized: 'Unauthorized access',
  sessionExpired: 'Session expired',
  dbError: 'Database execution error'
};
