const differenceInMinutes = require('date-fns/differenceInMinutes');
const db = require('../database');
const { getUserInfo } = require('../utils');

const addMessageSQL = 'INSERT INTO Messages SET TEXT = ?, UserName = ?, DATE = ?, Color = ?, Ip = ?, IsShowTime = ?';
let oldDate = new Date();

class ChatController {
  async broadcastMessage(webSocket, message) {
    webSocket.getWss('/api/liveMessages')?.clients?.forEach((client) => {
      client?.send(JSON.stringify(message));
    });
  }

  async addMessage(ws, req, webSocket) {
    ws.on('message', async (msg) => {
      const jsonMsg = JSON.parse(msg);
      const {
        color, username, event, text,
      } = getUserInfo(jsonMsg);
      if (event === 'connect') {
        return;
      }
      if (event === 'disconnect') {
        return;
      }
      const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const timeoutValue = differenceInMinutes(new Date(), oldDate) > 1 ? 1 : 0;
      const date = Date();
      if (timeoutValue) {
        oldDate = new Date();
      }
      const newMessage = [
        text,
        username,
        date,
        color,
        userIp,
        timeoutValue,
      ];
      const newRow = await db.query(addMessageSQL, newMessage);
      await this.broadcastMessage(webSocket, {
        event: 'message',
        text,
        username,
        date,
        color,
        id: newRow?.insertId,
        isShowTime: timeoutValue,
      });
    });
  }

  async getMessages(req, res) {
    const page = req?.body?.page ?? 0;
    const tCount = await db.query('SELECT COUNT(Id) FROM Messages');
    const allMessages = await db.query(`(SELECT * FROM Messages ORDER BY Id DESC LIMIT 200 OFFSET ${page * 200}) ORDER BY Id ASC`);
    const formattedMessages = allMessages?.map((el) => ({
      color: el?.Color,
      date: el?.DATE,
      id: el?.Id,
      username: el?.UserName,
      isShowTime: el?.IsShowTime,
      text: el?.TEXT,
    }));
    res.json({ totalCount: tCount[0]['COUNT(Id)'], messages: formattedMessages });
  }
}

module.exports = new ChatController();
