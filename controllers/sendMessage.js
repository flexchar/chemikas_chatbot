require('dotenv').config();
const { URL } = require('url');
const axios = require('axios');

const { ACCESS_TOKEN } = process.env;
const PUSH_URL = new URL('https://graph.facebook.com/v2.6/me/messages');
PUSH_URL.searchParams.append('access_token', ACCESS_TOKEN);

// Send the reply to Messenger Platform
const push = body => {
	axios({
		url: PUSH_URL.href,
		data: body,
		method: 'post'
	})
		.then(res => {
			console.log('message succesfully sent!');
		})
		.catch(err => {
			console.log(`\nUnable to send message. | ${err}`);
			const res =
				err.response.data.error.message ||
				err.response.data.error ||
				err.response.data ||
				err.response;
			console.log(res);
		});
};
// Methods Docs available at
// https://developers.facebook.com/docs/messenger-platform/reference/send-api/

// Send message to recipient
const reply = (sender_psid, response, type = 'REGULAR') =>
	// Construct the message body
	push({
		messaging_type: 'RESPONSE',
		notification_type: type,
		recipient: {
			id: sender_psid
		},
		message: response
	});

// Send message to recipient
const setStatus = (recipient, status = null) => {
	let type;
	switch (status) {
		case 0:
			type = 'typing_off';
			break;
		case 1:
			type = 'typing_on';
			break;
		case 2:
			type = 'mark_seen';
			break;
		default:
			type = 'typing_on';
	}
	push({
		recipient: {
			id: recipient
		},
		sender_action: type
	});
};

module.exports = {
	reply,
	setStatus
};
