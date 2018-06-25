const questions = require('./output.json');

// Generate random id for questions list
const randomId = () => Math.floor(Math.random() * questions.length);

module.exports = {
	// Return random question
	ask: () => {
		const id = randomId();
		return {
			id,
			question: questions[id].question
		};
	},
	// Verify answer
	verify: (id, answer) => {
		const correctAnswer = questions[id].answer;

		if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
			return true;
		}
		return false;
	},
	// Show answer
	answer: id => questions[id].answer
};
