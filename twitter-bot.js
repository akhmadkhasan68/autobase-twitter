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
                    console.log(reciveMessage);
                    resolve(reciveMessage);
                }
            });
        });
    }
}

module.exports = { TwitterBot };