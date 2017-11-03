// Zombulator by Benjamin Nesbit 
// CS 160 Exercise 20 - Collisions

var backgroundColor;

const MIN_SIZE = 10; 
const MAX_SIZE = 25;
const MAX_POPULATION = 50;
const LOWER_ZOMBIE_POP_BOUND = .35;
const UPPER_ZOMBIE_POP_BOUND = .6;
// Using these to create a percentage change based off max population. These are passed to
// the random function so we get between a 35% and 60% ratio, randomly.

const HUMAN_SPAWN_BOUND = 150;
const ZOMBIE_SPAWN_BOUND = 150;
// The distance from the respective boundaries that each human and zombie can spawn.

const MIN_HUMAN_HORIZONTAL_VELOCITY = -2;
const MAX_HUMAN_HORIZONTAL_VELOCITY = 2;
const NEG_HUMAN_Y = 1.0;
const POS_HUMAN_Y = 2.0;
const HUMAN_SPEED_MAX = 3.0;
const HUMAN_SPEED_MIN = 0.75;
// These are the constants that control the "Brownian motion" of the humans.
// Note that POS in the y category indicates the main direction we want the object moving.

const MIN_ZOMBIE_HORIZONTAL_VELOCITY = -2.25;
const MAX_ZOMBIE_HORIZONTAL_VELOCITY = 2.25;
const NEG_ZOMBIE_Y = 0.5;
const POS_ZOMBIE_Y = 1.75;
const ZOMBIE_SPEED_MAX = 2.0;
const ZOMBIE_SPEED_MIN = 0.5;
// These are the constants that control the "Brownian motion" of the zombies.
// Note that POS in the y category indicates the main direction we want the object moving.

var numberOfZombies = 0;
var numberOfSuperZombies = 0;
var numberOfHumans = 0;
var numberOfSuperHumans = 0;

var population = [];

function setup() {

  	createCanvas(windowWidth, windowHeight);
  	backgroundColor = color('darkgray');
  	
  	initializePopulation();
}

function draw() {

  	background(backgroundColor);
  	noStroke();

  	drawPopulation();
  	movePopulation();
  	trapPopulation();

  	drawText();

  	collisionDetect();
}

function initializePopulation() {
  	for (var i = 0; i < MAX_POPULATION; ++i) {
  		var humanoid_type = random(0, 100);
  		if (humanoid_type <= 5) {
  			population.push(initializeSuperZombie());
  			numberOfZombies++;
  			numberOfSuperZombies++;
  		} else if (humanoid_type <= 50) {
  			population.push(initializeZombie());
  			numberOfZombies++;
  		} else if (humanoid_type <= 95) {
  			population.push(initializeHuman());
  			numberOfHumans++;
  		} else {
  			population.push(initializeSuperHuman());
  			numberOfHumans++;
  			numberOfSuperHumans++;
  		}
  	}
}

function initializeZombie() {
	return {
		size: random(MIN_SIZE, MAX_SIZE),
		position: createVector((random(MAX_SIZE / 2, windowWidth - (MAX_SIZE / 2))), (random(MAX_SIZE / 2, ZOMBIE_SPAWN_BOUND))),
		color: color(random(200, 255), random(50, 100), random(50, 100), random(50, 150)),
		humanoid_type: 'zombie',
		velocity: createVector(random(MIN_ZOMBIE_HORIZONTAL_VELOCITY, MAX_ZOMBIE_HORIZONTAL_VELOCITY), random(ZOMBIE_SPEED_MIN, ZOMBIE_SPEED_MAX)),
		draw: function() {
			fill(this.color);
			ellipse(this.position.x, this.position.y, this.size, this.size);
		},
		move: function() {
     		this.position.add(this.velocity);
     		var acceleration = createVector(random(-2, 2), random(0, 1));
     		this.velocity.add(acceleration);
     		this.velocity.limit(2);
		},
		trap: function() {
			if ((this.position.x - this.size / 2) <= 0) {
 				this.position.x = this.size / 2;
 			}
 			if ((this.position.x + (this.size / 2)) >= windowWidth) {
 				this.position.x = windowWidth - (this.size / 2);
 			} // Side boundaries
 			if ((this.position.y + (this.size / 2)) >= windowHeight) {
 				this.position.y = (windowHeight - (this.size / 2));
 			} // Lower boundary
		},
		isZombie: function() {
			return this.humanoid_type == 'zombie' || this.humanoid_type == 'super zombie';
		}
	};
}

function initializeSuperZombie() {
	return {
		size: random(MAX_SIZE*1.5, MAX_SIZE*2), // BIGGER
		position: createVector((random(MAX_SIZE / 2, windowWidth - (MAX_SIZE / 2))), (random(MAX_SIZE / 2, ZOMBIE_SPAWN_BOUND))),
		color: color(random(200, 255), random(50, 100), random(50, 100), random(50, 150)),
		humanoid_type: 'super zombie',
		velocity: createVector(random(MIN_ZOMBIE_HORIZONTAL_VELOCITY, MAX_ZOMBIE_HORIZONTAL_VELOCITY), random(ZOMBIE_SPEED_MIN * 5, ZOMBIE_SPEED_MAX * 2)),
		draw: function() {
			fill(this.color);
			ellipse(this.position.x, this.position.y, this.size, this.size);
		},
		move: function() {
			this.position.add(this.velocity);
     		var acceleration = createVector(random(-3, 3), random(0, 2));
     		this.velocity.add(acceleration);
     		this.velocity.limit(3);
		},
		trap: function() {
			if ((this.position.x - this.size / 2) <= 0) {
 				this.position.x = this.size / 2;
 			}
 			if ((this.position.x + (this.size / 2)) >= windowWidth) {
 				this.position.x = windowWidth - (this.size / 2);
 			} // Side boundaries

 			if ((this.position.y + (this.size / 2)) >= windowHeight) {
 				this.position.y = (windowHeight - (this.size / 2));
 			} // Lower boundary
		},
		isZombie: function() {
			return this.humanoid_type == 'zombie' || this.humanoid_type == 'super zombie';
		}
	};
}

function initializeHuman() {
	return {
		size: random(MIN_SIZE, MAX_SIZE),
		position: createVector((random(MAX_SIZE / 2, windowWidth - (MAX_SIZE / 2))), (random(windowHeight - HUMAN_SPAWN_BOUND, windowHeight - (MAX_SIZE / 2)))),
		color: color(random(0, 30), random(0, 200), random(250, 255), random(50, 150)),
		humanoid_type: 'human',
		xSpeed: random(MIN_HUMAN_HORIZONTAL_VELOCITY, MAX_HUMAN_HORIZONTAL_VELOCITY),
		ySpeed: random(HUMAN_SPEED_MIN, HUMAN_SPEED_MAX),
		draw: function() {
			fill(this.color);
			ellipse(this.position.x, this.position.y, this.size, this.size);
		},
		move: function() {
			this.position.add((random(-1 * (this.xSpeed), this.xSpeed)), (-1 *random(-0.2 * (this.ySpeed), this.ySpeed)));
		},
		trap: function() {
			if ((this.position.x - (this.size / 2)) <= 0) {
 				this.position.x = this.size / 2;
 			}
 			if ((this.position.x + (this.size / 2)) >= windowWidth) {
 				this.position.x = windowWidth - (this.size / 2);
 			} // Side boundaries

 			if ((this.position.y - (this.size / 2)) <= 0) {
 				this.position.y = (this.size / 2);
 			} // Upper boundary
		},
		isZombie: function() {
			return this.humanoid_type == 'zombie' || this.humanoid_type == 'super zombie';
		}
	};
}

function initializeSuperHuman() {
	return {
		size: random(MAX_SIZE * 1.5, MAX_SIZE * 2), // BIGGER
		position: createVector((random(MAX_SIZE / 2, windowWidth - (MAX_SIZE / 2))), (random(windowHeight - HUMAN_SPAWN_BOUND, windowHeight - (MAX_SIZE / 2)))),
		color: color(random(0, 30), random(0, 200), random(250, 255), random(50, 150)),
		humanoid_type: 'super human',
		xSpeed: random(MIN_HUMAN_HORIZONTAL_VELOCITY, MAX_HUMAN_HORIZONTAL_VELOCITY),
		ySpeed: random(HUMAN_SPEED_MIN * 5, HUMAN_SPEED_MAX * 2), // FASTER
		draw: function() {
			fill(this.color);
			ellipse(this.position.x, this.position.y, this.size, this.size);
		},
		move: function() {
			this.position.add((random(-1 * (this.xSpeed), this.xSpeed)), (-1 *random(-0.1 * (this.ySpeed), this.ySpeed)));
		},
		trap: function() {
			if ((this.position.x - (this.size / 2)) <= 0) {
 				this.position.x = this.size / 2;
 			}
 			if ((this.position.x + (this.size / 2)) >= windowWidth) {
 				this.position.x = windowWidth - (this.size / 2);
 			} // Side boundaries

 			if ((this.position.y - (this.size / 2)) <= 0) {
 				this.position.y = (this.size / 2);
 			} // Upper boundary
		},
		isZombie: function() {
			return this.humanoid_type == 'zombie' || this.humanoid_type == 'super zombie';
		}
	};
}

function drawPopulation() {
 	for (var i = 0; i < MAX_POPULATION; ++i) {		
 		population[i].draw();
  	}
}

function movePopulation() {
	for (var i = 0; i < MAX_POPULATION; ++i) {	
 		population[i].move();
  	}
}

function trapPopulation() {
	 for (var i = 0; i < MAX_POPULATION; ++i) { 		
 		population[i].trap();
  	}
}

function drawText() {
	zombieText();
	humanText();
}

function zombieText() {
	fill(random(200, 255), random(50, 100), random(50, 100));
	text('Zombies: ' + numberOfZombies, windowWidth / 2, windowHeight / 4);
	text('Percentage of Hulk Zombies: ' + Math.round((numberOfSuperZombies/numberOfZombies) * 100) + '%', windowWidth / 2, (windowHeight / 4) + 11);
} // Displays the amount of zombies on the screen

function humanText() {
	fill(random(0, 30), random(0, 200), random(250, 255));
	text('Humans: ' + numberOfHumans, windowWidth / 2, windowHeight / 1.5);
	text('Percentage of Super Humans: ' + Math.round((numberOfSuperHumans/numberOfHumans) * 100) + '%', windowWidth / 2, (windowHeight / 1.5) + 11);
} // Displays the amount of humans on the screen

function collisionDetect() {
	for (var i = 0; i < MAX_POPULATION; ++i) {
		var zombie = population[i];
		if (zombie == undefined || !zombie.isZombie()) continue;

		for (var k = (i + 1); k < MAX_POPULATION; ++k) {
			var human = population[k];
			if (human.isZombie()) continue;

			if (zombie.position.dist(human.position) <= zombie.size/2 + human.size/2) {
				print("FIGHT");
			}

			// if (zombie.isTouching(human)) {
			// 	zombie.fight(human);
			// }
		}
	}
}