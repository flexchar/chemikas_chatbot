const { reply, setStatus } = require('./sendMessage');

const { parseMessage } = require('./parseMessage');

// Test to myself
reply(
	1651171978329904,
	{
		text: `Boot by ${process.env.NAME} at ${new Date().toUTCString()}`
	},
	'NO_PUSH'
);

async function handleMessage(sender_psid, msg) {
	// Mark as seen
	setStatus(sender_psid, 2);
	let response;

	// Mark as typing
	setTimeout(setStatus, 350, sender_psid, 1);

	// check greeting is here and is confident
	// const questioniere = firstEntity(msg.nlp, 'questioniere');
	// if (questioniere && questioniere.confidence > 0.8) {
	response = { text: 'Hi there!' };
	// }

	// Checks if the message contains text
	// if (msg.text && msg.text.includes('klaus')) {
	// 	response = questionView(questioniere.ask());
	// } else {
	// 	response = {
	// 		text: `Tavo žinutė: "${msg.text}"`
	// 	};
	// }

	response = await parseMessage(msg.text, sender_psid);
	console.log('\n ► response', response.text || response);

	// Sends the response message
	setTimeout(reply, 750, sender_psid, response);
}

function handlePostback(sender_psid, received_postback) {
	let response;

	// Get the payload for the postback
	const { payload } = received_postback;

	response = { text: `Received postback: ${payload}` };
	// Set the response based on the postback payload
	if (payload === 'yes') {
		response = { text: 'Ačiū!' };
	} else if (payload === 'no') {
		response = { text: 'Oops, pabandyk išsiųsti kitą vaizdelį' };
	}
	// Send the message to acknowledge the postback
	reply(sender_psid, response);
}

module.exports = { handleMessage, handlePostback };
