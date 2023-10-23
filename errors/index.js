const CustomAPIError = require("./custom-api");
const UnauthenticatedError = require("./InternalServerError");
const NotFoundError = require("./not-found").default;
const BadRequestError = require("./bad-request");
const InternalServerError = require("./InternalServerError");

module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  InternalServerError,
};
