/** @format */

// Bot Base setup and startup
const common = require("./common");
// Load console color stuff
const chalk = require("chalk");

// Replace the console warn and info log with my custom ones
console.warn = common.printError;
console.info = common.printInfo;

console.log(chalk.bold.rgb(255, 123, 0)("Starting FoxTickets Discord bot..."));

// Load Dependencies
console.info("- Loading dependencies...");

// Load filesystem stuff
const fs = require("fs");

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
	console.info("- Checking config files...");

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

		// login to Discord with your app's token
		client.login(settings.botToken);

		// when the client is ready, run this code
		// this event will only trigger one time after logging in
		client.once("ready", () => {
			console.info("✔ Connected to Discord");

			const guilds = client.guilds.cache;

			console.warn("Leaving all guilds that don't match ID in settings.json to prevent problems...");

			guilds.each((guild) => {
				if (guild.id != settings.serverSnowflake) {
					guild.leave();
				}
			});

			// If storage is empty, run first setup.
			if (Object.keys(storage).length === 0 && storage.constructor === Object) {
				firstSetup(guilds);
			}
		});
	} else {
		console.warn("Bot cannot boot until all above errors are solved.");
		process.exit(0);
	}
} catch (err) {
	console.error(err);
	process.exit(-1);
}

function firstSetup(guilds) {
	console.info("Running first setup, send private message to server owner...");
	// Todo

	const guild = guilds.first();

	const serverOwner = client.users.cache.get(guild.ownerID);

	serverOwner.send("First Setup");
}

function saveStorage() {
	const data = JSON.stringify(storage);
	fs.writeFileSync(storageFile, data);
}

process.on("exit", function (code) {
	return console.log(`About to exit with code ${code}`);
});
