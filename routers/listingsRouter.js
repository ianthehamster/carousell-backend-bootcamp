const express = require('express');
const router = express.Router();

const { auth } = require('express-oauth2-jwt-bearer');
const checkJwt = auth({
  audience: 'https://carousell/api',
  issuerBaseURL: `https://dev-fgriqckk06jvc0qc.au.auth0.com/`,
});

class ListingsRouter {
  constructor(controller, auth) {
    (this.controller = controller), (this.auth = auth);
  }

  routes() {
    // we will insert routes into here later on
    router.get('/', this.controller.getAll.bind(this.controller));
    router.post(
      '/',
      checkJwt,
      //   this.auth,
      this.controller.insertOne.bind(this.controller),
    );
    router.get('/:listingId', this.controller.getOne.bind(this.controller));
    router.put(
      '/:listingId',
      checkJwt,
      //   this.auth,
      this.controller.buyItem.bind(this.controller),
    );
    return router;
  }
}

module.exports = ListingsRouter;
