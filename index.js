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
  // response.send(request.body);




  // Response data
  const data = {
    color: '#DFFF00',
    head_url: 'http://www.placecage.com/c/200/200', // optional, but encouraged!
    taunt: "Let's do thisss thang!", // optional, but encouraged!

  }

  return response.json(data)
})

// --------Handle POST request to '/move'--------------//
app.post('/move', (request, response) => {
  // NOTE: Do something here to generate your move
  const reqData = request.body;


  //GRID DIMENSION
  const gridDim = [reqData['width'], reqData['height']];

  //FOOD
  const food = reqData.food.data
  function getFoodCoord(prepend){
  	var arr = [];
  	for(i=0;i<food.length;i++){
  		arr[i] = food[i];
  	}
  	return arr;
  }
  let foodCoord =  getFoodCoord();
  // console.log(foodCoord[0]['y'])


  //MY SNAKE
  const me = reqData.you
  function mySnake(prepend) {
  	var arr = [];
  	for(i=0;i<me.body.data.length;i++){
  		arr[i] = me.body.data[i];
  	}
  	return arr;
  }
  //mySnakeCoord[0] is snake head.
  let mySnakeCoord = mySnake(me);
  // console.log(mySnakeCoord[0]['x'])

  
  //ENEMY
  var snakes = reqData.snakes.data
  function enemySnakeCoord(prepend){
  	var data = [];
   	for(i=0;i<prepend.length;i++){
  		data[i] = prepend[i].body.data;
  	}
  	return data;
  }
  var enemySnake = enemySnakeCoord(snakes);
  // console.log(enemySnake[0][0]['x']);

  //MOVEMENT
  function chooseDir(prependSnake, prependGoal){
  	var direction = {
  		'up': prependSnake[0]['y'] - prependGoal[0]['y'] > 0,
  		'down': prependSnake[0]['y'] - prependGoal[0]['y'] < 0,
  		'left': prependSnake[0]['x'] - prependGoal[0]['x'] > 0,
  		'right': prependSnake[0]['x'] - prependGoal[0]['x'] < 0
	  };
	  return direction;
  }

  var dirToFood = chooseDir(mySnakeCoord, foodCoord);
  console.log(dirToFood.up);
  console.log(dirToFood.down);
  console.log(dirToFood.left);
  console.log(dirToFood.right);

  function move(towards){
  	while(false){
	  	if(towards.up = true){
	  		mySnakeCoord[0]['y'] -= 1;
	  	} else if(towards.down = true){
	  		mySnakeCoord[0]['y'] += 1;
	  	} else if(towards.left = true){
	  		mySnakeCoord[0]['x'] -= 1;
	  	} else if(towards.right = true){
	  		mySnakeCoord[0]['x'] += 1;
	  	} else{
	  		break;
	  	}
	  }
	  return [mySnakeCoord[0]['x'], mySnakeCoord[0]['y']]
	}

	console.log(move(dirToFood))


  // Response data
  const data = {
    move: 'up', // one of: ['up','down','left','right']
    taunt: 'Outta my way, snake!', // optional, but encouraged!
  }

  return response.json(data)
})

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
