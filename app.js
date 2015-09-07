var Slack = require('slack-client');
var http = require('http');

var token = process.env.SLACK_API_TOKEN;
var autoReconnect = true;
var autoMark = true;

var slack = new Slack(token, autoReconnect, autoMark);

slack.on('open', function() {
  console.log('Welcome to Slack. You are @' + slack.self.name + ' of ' + slack.team.name);
});

function onMessageToEdwardSnowden (message) {
  // do not listen to bots
  if (message.subtype === 'bot_message') {
    return;
  }

  function randomHexColor() {
    return Math.random().toString(16).substring(2, 2+6);
  }

  var text = message.text;
  var anonymousUser = randomUsername();
  var someColor = randomHexColor();
  var anonymousIcon = 'http://placehold.it/80/' + someColor + '/'+ someColor;

  var response = {
    text: text,
    username: 'anonymous',
    icon_url: anonymousIcon
  };

  // post message to #random
  var anonymousChannel = slack.getChannelByName('testing');
  anonymousChannel.postMessage(response);
}

slack.on('message', function (message) {
  var channelGroupOrDM = slack.getChannelGroupOrDMByID(message.channel);
  if (channelGroupOrDM.is_im) {
    onMessageToEdwardSnowden(message);
  }
});

slack.on('error', function (error) {
  console.error('Error:', error);
});

slack.login();

// I don't want this app to crash in case someone sends an HTTP request, so lets implement a simple server
//Lets define a port we want to listen to
const PORT = process.env.PORT || 3000;

//We need a function which handles requests and send response
function handleRequest(request, response){
    response.end('quote');
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log('Server listening on: http://localhost:%s', PORT);
});
