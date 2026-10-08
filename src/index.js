require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { ac, rs } = require('./constants');
const telemetryService = require('./services/telemetry.service');

const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({
    origin: (process.env.UI_ORIGIN || 'http://localhost:4200,http://127.0.0.1:4200')
        .split(',')
        .map((origin) => origin.trim()),
    credentials: true
}));
app.use(helmet());
app.use(bodyParser.json({ limit: '10mb' }));
app.use('/api', routes);

app.use('*', (req, res) => {
    res.status(ac.status.notFound).send(
        rs.getResponseStructure(ac.status.notFound, '404 Route Not found')
    );
});

const port = process.env.PORT || 7200;
const server = app.listen(port, () => {
    console.log(`Telemetry Controller API listening on port ${port}`);
});

process.on('SIGINT', () => {
    telemetryService.stopSimulation();
    server.close(() => process.exit(0));
});

module.exports = { app, server };
