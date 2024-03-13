const { auth } = require('express-oauth2-jwt-bearer');
const checkJwt = auth({
  audience: 'https://carousell/api',
  issuerBaseURL: `https://dev-fgriqckk06jvc0qc.au.auth0.com/`,
});

module.exports = checkJwt;
