'use strict';
module.exports = (app) => {
  const externalData = require('../controllers/externalDataController');

  app
    .route('/api/external-data/get-bitly-link-data')
    .post(externalData.get_bitly_link_data);
};
