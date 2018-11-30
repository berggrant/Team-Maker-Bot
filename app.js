const Discord = require('discord.js')
const client = new Discord.Client()

client.on('message', (receivedMessage) => {
  //no loops pls
  if (receivedMessage.author == client.user) {
    return
  }
  //sorting the message first, 0 is unrelated, 1 is an initial call, 2 is a response
  var messageClassification = 0;
  if (receivedMessage.content.includes(client.user.toString())) {
    if (receivedMessage.content.includes(",")) {
      //actual command
      messageClassification = 2;
    } else {
      //looking for prompt
      messageClassification = 1;
    }
  } else {
    messageClassification = 0;
  }


  // Check if the bot's user was tagged in the message
  if (messageClassification == 1) {
    // Send acknowledgement message, showing proper format
    receivedMessage.channel.send("Okay, who is playing?  Use the format 'Name(SR), '")
  } else if (messageClassification = 2) {
    //set initial value
    var numOfPlayers = 0;

    //get rid of blank space
    var trimmedMessage = receivedMessage.content.trim();

    //list of players, used later
    var playersWithSR = [];

    //gets rid of it's mention
    trimmedMessage = trimmedMessage.substring(22, trimmedMessage.length);

    //counts commas and adds one in order to account for no comma for the first name
    numOfPlayers = 1 + trimmedMessage.match(/,/g).length;

    //just for testing/general ease of use
    receivedMessage.channel.send(numOfPlayers + " players in game.");

    //putting people into the array
    for (let i = numOfPlayers; i > 1; i--) {
      commaSpot = trimmedMessage.indexOf(",");
      playersWithSR.push(trimmedMessage.slice(0, commaSpot));
      trimmedMessage = trimmedMessage.slice(commaSpot + 2);
    }

    //puts last person in array
    playersWithSR.push(trimmedMessage);

    //seperating names and SR
    var justPlayerNames = [];
    var justPlayerSR = [];
    for (let i = numOfPlayers; i > 0; i--) {
      var name = "";
      var SR = 0;
      var indexOfPar = 0;
      indexOfPar = playersWithSR[i - 1].indexOf("(");
      name = playersWithSR[i - 1].slice(0, indexOfPar);
      justPlayerNames.push(name);
      SR = playersWithSR[i - 1].slice(indexOfPar + 1, indexOfPar + 5);
      justPlayerSR.push(SR);
    }

    //creating combined array
    var combined = [];
    for (let i = 0; i < numOfPlayers; i++) {
      combined[i] = [justPlayerSR[i], justPlayerNames[i]];
    }

    //sorting array
    function sortFunction(a, b) {
      if (a[0] === b[0]) {
        return 0;
      } else {
        return (a[0] > b[0]) ? -1 : 1;
      }
    }

    combined.sort(sortFunction);

    //making teams YAY!
    var teamOne = [],
      teamTwo = [];
    var teamOneTotal = 0, teamTwoTotal = 0;
    for (let i = 0; i < numOfPlayers; i++) {
      if(teamTwoTotal >= teamOneTotal)
      {
        teamOne.push(combined[i][1]);
        teamOneTotal = teamOneTotal + combined[i][0];
        i++;
        teamTwo.push(combined[i][1]);
        teamTwoTotal = teamTwoTotal + combined [i][0];
      }
      else {
        teamTwo.push(combined[i][1]);
        teamTwoTotal = teamTwoTotal + combined[i][0];
        i++;
        teamOne.push(combined[i][1]);
        teamOneTotal = teamOneTotal + combined [i][0];
      }
    }

    //prints the teams :D
    receivedMessage.channel.send("**Team 1:** " + teamOne.toString() + " **Team 2:** " + teamTwo.toString());
  }

})

client.login("NTE3NDY1MzQ4NjU2NzI2MDM2.DuGEdw._sgezbz2xnk7DVrpARZHsscsQ6c")
