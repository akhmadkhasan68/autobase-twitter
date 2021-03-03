const config = require('./config');
const express = require('express');
const CronJob = require('cron').CronJob;
const app = express();
const _port = 8000;

const { TwitterBot } = require('./twitter-bot');
const twitterbot = new TwitterBot({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret,
});

const job = new CronJob(
    '*/1 * * * * *',
    doJob,
    null,
    true
);

function doJob(){
    console.log('onclick!');
};

// app.get('/adminProfile', async (req, res, next) => {
//     const admin = await twitterbot.getAdminUserInfo();
//     res.json(admin);
// });

app.get('/adminProfile', async (req, res, next) => {
    const admin = await twitterbot.getAdminUserInfo();
    res.json(admin);
});

app.listen(_port, () => { console.log(`runnig on port ${_port}`) });