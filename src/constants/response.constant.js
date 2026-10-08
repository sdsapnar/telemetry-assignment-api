const ac = require('./app.constant');

exports.getResponseStructure = (status, message, data) => ({
  status,
  message,
  response: data || {}
});

exports.getParameterMissingResponse = (missingParams) =>
  this.getResponseStructure(ac.status.badRequest, `${ac.message.parameterMissing} ${missingParams.join(',')}`);

exports.getServerErrorResponse = (err) =>
  this.getResponseStructure(ac.status.internalServerError, `${err}`);

exports.getSuccessResponse = (message, data) => {
  let responseMessage = message;
  let responseData = data;
  if (message !== null && message !== undefined && data === undefined) {
    responseData = message;
    responseMessage = null;
  }
  return this.getResponseStructure(ac.status.success, responseMessage || ac.message.success, responseData);
};
