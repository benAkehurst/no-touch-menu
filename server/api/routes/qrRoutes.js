'use strict';

module.exports = (app) => {
  const qrController = require('../controllers/qrController');

  app
    .route('/api/qr/generate-qr-code/:requesterId')
    .get(qrController.generate_qr_code);
};
