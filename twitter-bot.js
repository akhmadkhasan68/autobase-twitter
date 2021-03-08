const Twit = require('twit');

class TwitterBot {
    constructor(props)
    {
        this.T = new Twit({
            consumer_key: props.consumer_key,
            consumer_secret: props.consumer_secret,
            access_token: props.access_token,
            access_token_secret: props.access_token_secret,
        });

        this.triggerWord = props.triggerWord;
    }

    getAdminUserInfo = () => {
        return new Promise((resolve, reject) => {
            this.T.get('account/verify_credentials', { skip_status: true })
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                })
        });

    }

    getReciveMessage = (messages, admin_id) => {
        return messages.filter(msg => msg.message_create.sender_id !== admin_id);
    }

    getUnnecessaryMessages = (reciveMessage, trigger) => {
        return reciveMessage.filter(msg => {
            const message = msg.message_create.message_data.text;
            const words = this.getEachWord(message);
            return !words.includes(trigger);
        });
    }

    getTriggerMessages = (reciveMessage, trigger) => {
        return reciveMessage.filter(msg => {
            const message = msg.message_create.message_data.text;
            const words = this.getEachWord(message);
            return words.includes(trigger);
        });
    }

    getEachWord = (message) => {
        let words = [];
        let finalWords = [];
        const separatorEnter = message.split('\n');
        separatorEnter.forEach(line => words = [...words, ...line.split(' ')]);
        words.forEach(word => {
            const splitComma = word.split(',');
            finalWords = [...finalWords, ...splitComma];
        });
        return finalWords;
    }

    getDirectMessage = (admin_id) => {
        return new Promise((resolve, reject) => {
            this.T.get('direct_messages/events/list', (error, data) => {
                if(error)
                {
                    reject(error);
                }
                else
                {
                    const messages = data.events;
                    const reciveMessage = this.getReciveMessage(messages, admin_id);
                    const unnecessaryMessages = this.getUnnecessaryMessages(reciveMessage, this.triggerWord);
                    const triggerMessages = this.getTriggerMessages(reciveMessage, this.triggerWord);
                    console.log(JSON.stringify(triggerMessages, null, 3), 'triiger msg<<');
                }
            });
        });
    }
}

module.exports = { TwitterBot };