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
app.set('port', (process.env.PORT || configure.port))

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
	var reqData = request.body;
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
	var neighbor = neighbors(myself.body.data[0].x, myself.body.data[0].y);
	var checkBod = checker(grid, myself.body.data[1]);
	// console.log(checkBod);
	var filler = fillGrid(reqData, grid);
	console.log(filler);



  //AVOID THINGS############################################################

  function fillGrid(reqData, emptyGrid){
  	for(i=0;i<reqData.height;i++){
  		for(j=0;j<reqData.width;j++){
  			if(checkBod.x === emptyGrid[i][j].x && checkBod.y === emptyGrid[i][j].y){
  				emptyGrid[i][j].myBod = true
  			}
  		}
  	}
  	return emptyGrid;
  }


	function chooseDir(me, goal) {
		// console.log(me);
		// console.log(goal);
		for(i=0;i<reqData.height;i++){
			for(j=0;j<reqData.width;j++){
				if(grid[i][j].myBod !== true && me['y'] - goal['y'] > 0){
					return 'up';
				} else if(grid[i][j].myBod !== true && me['y'] - goal['y'] < 0){
					return 'down';
				} else if(grid[i][j].myBod !== true && me['x'] - goal['x'] > 0){
					return 'left';
				} else if(grid[i][j].myBod !== true && me['x'] - goal['x'] < 0){
					return 'right';
				}
			}
		}
	}

	// printGrid(grid);

	return choosePath;
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





// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
	console.log('Server listening on port %s', app.get('port'))
})