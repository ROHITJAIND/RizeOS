// netlify/functions/api.js
const serverless = require('serverless-http');
const app = require('../../server/server'); // Path to your server.js file

module.exports.handler = serverless(app);