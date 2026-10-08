exports.isAllParametersPresent = (values) => {
  const [jsonData = {}, ...parameters] = values;
  return parameters.filter((parameter) => parameter && (jsonData[parameter] === undefined || jsonData[parameter] === ''));
};
