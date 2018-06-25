const { Wit, log } = require('node-wit');

const questioniere = require('../models/questioniere');
const questionView = require('../views/question').default;

const { findOrCreateSession, sessions, setSession } = require('./session');

const wit = new Wit({
	accessToken: process.env.WIT_TOKEN,
	logger: new log.Logger(log.INFO)
});

const text = text => ({
	text
});

const round = (num, prescision = 2) =>
	Math.round(num * prescision) / prescision;

const hasAnswer = session =>
	'question' in session && session.question ? session.question : false;

function parseMessage(msg, sender) {
	console.log('\n ► msg', msg);

	// Track session
	const sessionId = findOrCreateSession(sender);
	const session = sessions[sessionId].context;

	// User session
	console.log('\n Session', session);

	const answerId = hasAnswer(session);

	if (answerId) {
		if (msg.toLowerCase().includes('kita')) {
			const asked = questioniere.ask();
			setSession(sessionId, 'question', asked.id);
			return questionView(asked);
		}
		if (msg.toLowerCase().includes('nežinau')) {
			setSession(sessionId, 'question', null);
			return text(`Atsakymas ${questioniere.answer(answerId)}`);
		}
		if (questioniere.verify(answerId, msg)) {
			setSession(sessionId, 'question', null);
			return text('Super! Atsakymas teisingas! O tu protingas!');
		}
		return text('Deja, atsakymas netoks... Bandyk dar kartą!');
	}

	return wit
		.message(msg)
		.then(({ entities }) => {
			// You can customize your response to these entities
			console.log('\n ► entities', entities);

			const entity = Object.keys(entities)[0];
			const { intent } = entities;
			const { confidence } = entities[entity][0];

			// Greeting
			if (entity === 'greeting' && round(confidence) >= 0.79) {
				return text(`Labas, aš esu robotas Chemikas. Kuo galiu padėti?`);
			}

			// Quiz question
			if (
				intent &&
				(intent[0].value === 'ask_question' ||
					intent[0].value === 'questioniere') &&
				round(intent[0].confidence) >= 0.79
			) {
				const asked = questioniere.ask();
				setSession(sessionId, 'question', asked.id);
				return questionView(asked);
			}

			// Information about elements
			// if (entity === 'wikipedia_search_query' && round(confidence) > 0.79)
			// 	return text(
			// 		`informacija apie ${entities.wikipedia_search_query[0].value}`
			// 	);

			// Fallback reply
			return text(
				`We've received your message: ${msg}. Your entity is ${entity} with a confidence of ${Math.round(
					confidence,
					2
				)}`
			);
		})
		.catch(err => {
			console.error('Oops! Got an error from Wit: ', err.stack || err);
			return text(`Oops! Got an error from Wit: ${err.stack || err}`);
		});
}

module.exports = {
	parseMessage
};
