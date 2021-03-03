const config = require('./config');
const express = require('express');
const CronJob = require('cron').CronJob;
const app = express();
const _port = 8000;

const { TwitterBot } = require('./twitter-bot');
const bot = new TwitterBot({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret,
});

const job = new CronJob(
    '*/1 * * * * *',
    doJob,
    null,
    false
);

async function doJob(){
    const authenticatedProfile = await bot.getAdminUserInfo();
    const admin_id = authenticatedProfile.data.id_str;
    const dm = await bot.getDirectMessage(admin_id);
    for(const message of dm)
    {
        console.log(message.message_create);
    }
};

app.get('/trigger', async (req, res, next) => {
    job.fireOnTick();
    res.json('halo');
});

app.listen(_port, () => { console.log(`runnig on port ${_port}`) });