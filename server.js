const http = require('http');
require('dotenv').config();
const app = require('./src/app');

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, process.env.HOST, () => {
  console.log('Server started successfully');
  console.log(`Server listening at port http://${process.env.HOST}:${PORT}/`);
});