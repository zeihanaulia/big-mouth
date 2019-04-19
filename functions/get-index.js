/* jshint node: true */
"use strict";

const co = require("co");
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));
const Mustache = require("mustache");
const http = require("superagent-promise")(require("superagent"), Promise);
const aws4 = require("aws4");
const URL = require("url");
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
  let html = Mustache.render(template, { dayOfWeek, restaurants });

  return {
    statusCode: 200,
    body: html,
    headers: {
      "Content-Type": "text/html; charset=UTF-8"
    }
  };
});
