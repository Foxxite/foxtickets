/** @format */

const chalk = require("chalk");

module.exports = {
	printError: function (message) {
		// Split up message to fit between block
		const newError = addNewlines(message);

		// Print error
		console.log(chalk.red("============================================"));
		console.log("");
		console.log(chalk.yellowBright(newError));
		console.log("");
		console.log(chalk.red("============================================"));
	},

	printInfo: function (message) {
		console.log(chalk.greenBright(message));
	},
};

function addNewlines(str) {
	let result = "";
	while (str.length > 0) {
		result += str.substring(0, 42) + "\n";
		str = str.substring(42).trim();
	}
	return result.trim();
}
