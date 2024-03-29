module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Set Bot Game",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Bot Client Control",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	return `${data.gameName}${data.gameLink ? ' [' + data.gameLink + ']' : ''}`;
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["gameName", "gameLink"],

//---------------------------------------------------------------------
// Command HTML
//
// This function returns a string containing the HTML used for
// editting actions. 
//
// The "isEvent" parameter will be true if this action is being used
// for an event. Due to their nature, events lack certain information, 
// so edit the HTML to reflect this.
//
// The "data" parameter stores constants for select elements to use. 
// Each is an array: index 0 for commands, index 1 for events.
// The names are: sendTargets, members, roles, channels, 
//                messages, servers, variables
//---------------------------------------------------------------------

html: function(isEvent, data) {
	return `
<div style="width: 90%;">
	Game Name:<br>
	<input id="gameName" class="round" type="text">
</div><br>
<div style="width: 90%;">
	Twitch Stream Link:<br>
	<input id="gameLink" class="round" type="text" placeholder="Leave blank to disallow!">
</div>
`
},

//---------------------------------------------------------------------
// Action Editor Init Code
//
// When the HTML is first applied to the action editor, this code
// is also run. This helps add modifications or setup reactionary
// functions for the DOM elements.
//---------------------------------------------------------------------

init: function() {
},

//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter, 
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

action: function(cache) {
	const botClient = this.getDBM().Bot.bot.user;
	const data = cache.actions[cache.index];
	const game = this.evalMessage(data.gameName, cache);
	const link = this.evalMessage(data.gameLink, cache);
	if(botClient && botClient.setPresence) {
		if(link) {
			botClient.setPresence({ game: { name: game, type: 0, url: link } }).then(function() {
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else {
			botClient.setPresence({ game: { name: game, type: 0 } }).then(function() {
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		}
	} else {
		this.callNextAction(cache);
	}
},

//---------------------------------------------------------------------
// Action Bot Mod
//
// Upon initialization of the bot, this code is run. Using the bot's
// DBM namespace, one can add/modify existing functions if necessary.
// In order to reduce conflictions between mods, be sure to alias
// functions you wish to overwrite.
//---------------------------------------------------------------------

mod: function(DBM) {
}

}; // End of module
