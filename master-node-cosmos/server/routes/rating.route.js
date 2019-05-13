let ratingContoller = require('../controllers/rating.controller');
let ratingValidation = require('../validations/rating.validation');


module.exports = (server) => {
  server.post('/ratings', ratingValidation.addRating, ratingContoller.addRating);
};