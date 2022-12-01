const express = require('express');
const cors = require('cors');

const app = express();
const expressWs = require('express-ws')(app);

const { getRouter } = require('./routes/chatRoutes');

const PORT = process.env.PORT || 3001;

const chatRouter = getRouter(expressWs);

app.use(express.json());
app.use(cors());
app.use('/api', chatRouter);

app.listen(PORT, () => console.log('server is working on port', PORT));
