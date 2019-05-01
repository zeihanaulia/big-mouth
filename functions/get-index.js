/* jshint node: true */
"use strict";

const co = require("co");
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));
const Mustache = require("mustache");
const http = require("superagent-promise")(require("superagent"), Promise);
const aws4 = require("aws4");
const URL = require("url");

// https://docs.aws.amazon.com/lambda/latest/dg/lambda-environment-variables.html
const awsRegion = process.env.AWS_REGION;
const cognitoUserPoolId = process.env.cognito_user_pool_id;
const cognitoClientId = process.env.cognito_client_id;

const restauranApiRoot = process.env.restaurant_api;
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

var html;

function* loadHtml() {
  if (!html) {
    html = yield fs.readFileAsync("static/index.html", "utf-8");
  }
  return html;
}

function* getRestaurants() {
  let url = URL.parse(restauranApiRoot);
  let opts = {
    host: url.hostname,
    path: url.pathname
  };

  aws4.sign(opts);

  return (yield http
    .get(restauranApiRoot)
    .set("Host", opts.headers.Host)
    .set("X-Amz-Date", opts.headers["X-Amz-Date"])
    .set("Authorization", opts.headers.Authorization)
    .set("X-Amz-Security-Token", opts.headers["X-Amz-Security-Token"])).body;
}

module.exports.handler = co.wrap(function*(event) {
  let template = yield loadHtml();
  let restaurants = yield getRestaurants();
  let dayOfWeek = days[new Date().getDay()];
  let view = {
    dayOfWeek,
    restaurants,
    awsRegion,
    cognitoUserPoolId,
    cognitoClientId,
    searchUrl: `${restauranApiRoot}/search`
  };
  let html = Mustache.render(template, view);

  return {
    statusCode: 200,
    body: html,
    headers: {
      "Content-Type": "text/html; charset=UTF-8"
    }
  };
});
