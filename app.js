/** @format */

// Bot Base setup and startup
const common = require("./common");

// Replace the console warn and info log with my custom ones
console.warn = common.printError;
console.info = common.printInfo;

console.info("Starting FoxTickets Discord bot...");

// Load Dependencies
console.info("Loading dependencies...");

// Load filesystem stuff
const fs = require("fs");

// Load console color stuff
const chalk = require("chalk");

// Load  discord.js module
const Discord = require("discord.js");
// Create new Discord client
const client = new Discord.Client();

const settingsFile = "./settings.json";
const storageFile = "./storage.json";

const defaultSetting = {
	_comment:
		"Go to https://discord.com/developers/applications and create a new application with a bot user. Paste the client ID and Bot Token and Server ID in this file.",
	__comment:
		"To add the bot to your server, got to this website and give the bot the administrator permission. https://discordapi.com/permissions.html",
	clientToken: "",
	botToken: "",
	serverSnowflake: "",
};

let settings = {};
let storage = {};

let allowBoot = true;

try {
	console.info("Checking config files...");

	if (!fs.existsSync(settingsFile)) {
		// Create default settings file
		allowBoot = false;

		const data = JSON.stringify(defaultSetting, null, 4);
		fs.writeFileSync(settingsFile, data);

		const error =
			"A default settings file has been created. Please fill out the settings file with the correct settings.";
		console.warn(error);
	} else {
		const rawdata = fs.readFileSync(settingsFile);
		settings = JSON.parse(rawdata);

		if (settings.clientToken == "") {
			allowBoot = false;
			console.warn("Client Token not set in settings file.");
		}

		if (settings.botToken == "") {
			allowBoot = false;
			console.warn("Bot Token not set in settings file.");
		}

		if (settings.serverSnowflake == "") {
			allowBoot = false;
			console.warn("Server Snowflake not set in settings file.");
		}
	}

	if (!fs.existsSync(storageFile)) {
		const data = JSON.stringify({});
		fs.writeFileSync(storageFile, data);
	} else {
		const rawdata = fs.readFileSync(storageFile);
		storage = JSON.parse(rawdata);
	}

	if (allowBoot) {
		console.info("✔ All checks passed, logging into Discord...");

		// todo
	} else {
		console.warn("Bot cannot boot until all above errors are solved.");
		process.exit(0);
	}
} catch (err) {
	console.error(err);
	process.exit(-1);
}

process.on("exit", function (code) {
	return console.log(`About to exit with code ${code}`);
});
