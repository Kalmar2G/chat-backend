const Router = require('express');
const expressWs = require('express-ws');
const chatController = require('../controllers/chatController');

const getRouter = (webSocket) => {
  const router = new Router();
  expressWs(router);
  router.post('/allMessages', chatController.getMessages);
  router.ws('/liveMessages', (res, req) => chatController.addMessage(res, req, webSocket));
  return router;
};

module.exports = {
  getRouter,
};
