require('dotenv').config();

const {
	handleMessage,
	handlePostback
} = require('./controllers/handleMessage');
const bodyParser = require('body-parser');
const bot = require('express')();

const { PORT = 3001 } = process.env;

bot.use(bodyParser.json());
bot.use(
	bodyParser.urlencoded({
		extended: true
	})
);

bot.listen(PORT, () => {
	console.log(`Server is listening on ${PORT}`);
});

bot.post('/webhook', (req, res) => {
	const { body } = req;

	console.log(`\nIncoming request`);

	if (body.object === 'page') {
		body.entry.forEach(el => {
			if (!('messaging' in el)) return res.status(200);
			const webhookEvent = el.messaging[0];

			// Get the sender PSID
			const sender_psid = webhookEvent.sender.id;
			console.log(`Sender PSID: ${sender_psid}`);

			// Check if the event is a message or postback and
			// pass the event to the appropriate handler function
			if (webhookEvent.message) {
				return handleMessage(sender_psid, webhookEvent.message);
			} else if (webhookEvent.postback) {
				return handlePostback(sender_psid, webhookEvent.postback);
			}
		});
		return res.status(200).send('EVENT_RECEIVED');
	}
	return res.sendStatus(400);
});

// Adds support for GET requests to our webhook
bot.get('/webhook', (req, res) => {
	const { VERIFY_TOKEN } = process.env;

	// Parse the query params
	const mode = req.query['hub.mode'],
		token = req.query['hub.verify_token'],
		challenge = req.query['hub.challenge'];

	// Checks if a token and mode is in the query string of the request
	if (mode && token) {
		// Checks the mode and token sent is correct
		if (mode === 'subscribe' && token === VERIFY_TOKEN) {
			// Responds with the challenge token from the request
			console.log('WEBHOOK_VERIFIED');
			res.status(200).send(challenge);
		} else {
			// Responds with '403 Forbidden' if verify tokens do not match
			res.sendStatus(403);
		}
	}
});

bot.get('/', (req, res) => {
	res.send('Up!');
});
bot.get('/privacy-policy', (req, res) => {
	res.send('Privacy Policy temporary!');
});
