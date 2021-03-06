const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const app = express()

const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || config.port))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // NOTE: Do something here to start the game
  // console.log(request.body);
  var reqData = request.body;


  // Response data
  const data = {
    "color": "#FF0000",
    "secondary_color": "#00FF00",
    "head_url": "http://placecage.com/c/100/100",
    "taunt": "Kept you waiting huh?",
}

  return response.json(data)
})

// --------Handle POST request to '/move'--------------//
app.post('/move', (request, response) => {
	data = processData(request);
  console.log(data);

  return response.json(data);
})

function processData(request) {
	data = {
		taunt: makeTaunt(),
		move: getMove(request)
	}
	return data;
}

function makeTaunt() {
	return "Metal Geeeeaaar!?"
}

function getMove(request) {
	const reqData = request.body;
	var grid = makeEmptyGrid(reqData);
	var apples = reqData.food.data;
	var enemys = reqData.snakes.data;
	var myself = reqData.you;

	// console.log(grid);
	// console.log(apples);
	// console.log(enemys);
	// console.log(myself);

	//MOVEMENT################################################################
  var choosePath = chooseDir(myself.body.data[0], apples[0]);
  var chooseTail = chooseDir(myself.body.data[0], myself.body.data[myself.body.data.length-1])

  function beDoggo(chaseTail, dogTreat){
  	if(myself.health > 50){
  		chaseTail;
  	} else {
  		dogTreat;
  	}
  }

  console.log(beDoggo(chooseTail, choosePath));

  




  //AVOID THINGS############################################################

 

	// printGrid(grid);

	return choosePath
}


function makeEmptyGrid(reqData) {
	let grid = [];
	for(i=0; i<reqData.width; i++){
		grid[i] = [];
		for(j=0; j<reqData.height; j++){
			grid[i][j] = {x: j, y: i, myHead: false, myBod: false, enemy: false, apple: false};
		}	
	}
	return grid;
}

// Change to accept a coord object
function neighbors(x, y){
	var neighbors = [{x: x+1 , y: y }, {x: x-1, y: y}, {x: x, y: y-1}, {x: x, y: y+1}];
	return neighbors;
}

function checker(grid, coord){
	return grid[coord.x][coord.y];
} 

function chooseDir(me, goal) {
	// console.log(me);
	// console.log(goal);
	if(me['y'] - goal['y'] > 0){
		return 'up';
	} else if(me['y'] - goal['y'] < 0){
		return 'down';
	} else if(me['x'] - goal['x'] > 0){
		return 'left';
	} else if(me['x'] - goal['x'] < 0){
		return 'right';
	}
}




// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
