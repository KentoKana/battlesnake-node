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
app.set('port', (process.env.PORT || 9001))

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
    "color": '#FF8C00',
    "head_url": 'http://www.placecage.com/c/200/200', // optional, but encouraged!
    "taunt": "KEPT YOU WAITING HUH?", // optional, but encouraged!
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
	return "taunty mc taunt"
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



  //AVOID THINGS############################################################

	// printGrid(grid);

	return choosePath
}


function makeEmptyGrid(reqData) {
	let grid = [];
	for(i=0; i<reqData.width; i++){
		grid[i] = [];
		for(j=0; j<reqData.height; j++){
			grid[i][j] = {x: j, y: i};
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
	return grid[coord.y][coord.y];
}

function printGrid(grid) {

}

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
