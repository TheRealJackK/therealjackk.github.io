let crosshair, hitbox, zombies, humans, player, enemyCount, ammoSprite, bulletCasing

let map1 // Map File

let road, rSide, lSide, grass // Tiles

let screen = 0

let projectiles

let ammoCount = 15

let zombieSpeed = 0.5

let humanSpeed = 1

let healthPoints = 10

let score = 0

function preload() {
	map1 = loadStrings('maps/map1.txt')
	loadImage('assets/playerx64.png')
	loadImage('assets/crosshair.png')
	loadImage('assets/bullet.png')
	loadImage('assets/bullet-casing.png')
	loadImage('assets/zombie-slow.png')
	loadImage('assets/zombie-fast.png')
	loadImage('assets/grass.png')
	loadImage('assets/road.png')
	loadImage('assets/road-left.png')
	loadImage('assets/road-right.png')
}

function setup() {
	// new Canvas(1500, 900);
	createCanvas(1500, 900);

	// Tile Groups
	
	// Grass Tiles
	grass = new Group();
	grass.layer = 3
	grass.opacity = 0
	grass.collider = 'none'
	grass.w = width / 8;
	grass.h = height / 8;
	grass.tile = '1'
	grass.image = 'assets/grass.png'

	// Road left Tiles
	lSide = new Group();
	lSide.layer = 3
	lSide.opacity = 0
	lSide.collider = 'none';
	lSide.w = width / 8;
	lSide.h = height / 8;
	lSide.tile = '2';
	lSide.image = 'assets/road-left.png'

	// Road right Tiles
	rSide = new Group();
	rSide.layer = 3
	rSide.opacity = 0
	rSide.collider = 'none';
	rSide.w = width / 8;
	rSide.h = height / 8;
	rSide.tile = '3';
	rSide.image = 'assets/road-right.png'
	
	// Road Tiles
	road = new Group();
	road.layer = 3
	road.opacity = 0
	road.collider = 'none';
	road.w = width / 8;
	road.h = height / 8;
	road.tile = '4'
	road.image = 'assets/road.png'

	// Draw Tiles
    tilesGroup = new Tiles(
        map1,
        30,
        80,
        64,
        64
    );

	// Sprites

	// Crosshair
	crosshair = new Sprite();
	crosshair.layer = 4
	crosshair.diameter = 5;
	crosshair.image = 'assets/crosshair.png'
	crosshair.opacity = 0
	crosshair.collider = 'none'

	// Player
	player = new Sprite()
	player.layer = 3;
	player.image = 'assets/playerx64.png'
	player.opacity = 0
	player.diameter = 20;
	player.x = width / 2
	player.y = height - 50;
	player.collider = 'static'

	// Player hitbox
	hitbox = new Sprite()
	hitbox.layer = 2;
	hitbox.opacity = 0
	hitbox.stroke = 'none'
	hitbox.diameter = 50;
	hitbox.x = player.x
	hitbox.y = player.y
	hitbox.collider = 'static'

	// Ammo status box
	ammoSprite = new Sprite();
	ammoSprite.color = 'none'
	ammoSprite.stroke = 'none'
	ammoSprite.layer = 5
	ammoSprite.opacity = 0
	ammoSprite.collider = 'none'
	ammoSprite.textSize = 20

	// Projectiles Group
	projectiles = new Group()
	projectiles.image = 'assets/bullet.png';
	projectiles.diameter = 10;
	projectiles.life = 27.5
	projectiles.y = player.y - 30
	projectiles.vel.y = -20

	// Bullet casing
	bulletCasing = new Sprite();
	bulletCasing.image = 'assets/bullet-casing.png'
	bulletCasing.x = player.x 
	bulletCasing.y = player.y + 90
	bulletCasing.collider = 'none'
	bulletCasing.rotation = 360;
	bulletCasing.rotationSpeed = 10;

	// Enemy Groups
	zombies = new Group();
	zombies.image = 'assets/zombie-slow.png'

	humans = new Group();
	humans.image = 'assets/zombie-fast.png'
}

function draw() {
	// Game screen switching
	background('grey')

	// Check if health points are 0 before ending game
    if (healthPoints <= 0) {
        screen = 2;
    }

    if (screen == 0) {
        menuScreen();
    } else if (screen == 1) {
        gameScreen();
    } else if (screen == 2) {
        endScreen();
    }

}

function displayValues() {
	// Health Points
	textSize(25)
	textAlign(LEFT)
	text('HP: ', width / 8 * 2, 35)
	text(healthPoints, width / 8 * 2 + 50, 35)

	// Display Ammunition
	text('Ammo: ', width / 8 * 3, 35)
	text(ammoCount, width / 8 * 3 + 85, 35)

	// Enemy Count
	text('Enemies: ', width / 8 * 4, 35)
	text(humans.length + zombies.length, width / 8 * 4 + 110, 35)
	
	// Display Score
	text('Score: ', width / 8 * 5, 35)
	text(score, width / 8 * 5 + 80, 35)

	// Display Ammunition Status on Player
	ammoSprite.x = player.x + 60
	ammoSprite.y = player.y - 30
	ammoSprite.opacity = 1
	if(ammoCount > 0) {
		ammoSprite.text = ammoCount;
		ammoSprite.w = 40
		ammoSprite.h = 20
	} else {
		ammoSprite.text = 'Reloading'
		ammoSprite.x = player.x + 70
		ammoSprite.w = 100;
	}
}

function gunPlay() {    
	// Move player sprite with mouse
	player.x = mouse.x
	hitbox.x = mouse.x

	crosshair.x = mouseX;
	crosshair.y = mouseY;

	// Shooting mechanic
	if(score <= 5000) {
		starterWeapon()
	} else if(score <= 20000) {
		shotgunUpgrade()
	} else if(score >= 20000) {
		akUpgrade()
	}
}

function detectCollision() {
	// Check for projectile collision with zombies
    zombies.forEach(zombie => {
        if (projectiles.overlaps(zombie)) {
            zombie.remove(); // Remove zombie on collision
			healthPoints = healthPoints + 0.25 // Add health points
			score = Math.trunc(score + healthPoints / 4 * zombieSpeed) // Add score
        }

		if(zombie.colliding(hitbox)) {
			background('red')
			
			// Change tile opacity
			grass.opacity = 0.4
			lSide.opacity = 0.4
			rSide.opacity = 0.4
			road.opacity = 0.4
		}
    });

	// Check for projectile collision with zombies
    humans.forEach(human => {
        if (projectiles.overlaps(human)) {
            human.remove(); // Remove zombie on collision
			healthPoints = healthPoints + 0.25 // Add health points
			score = Math.trunc(score + healthPoints / 4 * humanSpeed) // Add score
        }

		if(human.colliding(hitbox)) {
			background('red')

			// Change tile opacity
			grass.opacity = 0.4
			lSide.opacity = 0.4
			rSide.opacity = 0.4
			road.opacity = 0.4
		}
    });
}

function spawnEnemies(group, count, speed) {
    for (let i = 0; i < count; i++) {
        let enemy = new Sprite();
        enemy.diameter = 50;
        enemy.x = random(50, width - 50);
        enemy.y = random(50, height / 4 + 100);
        enemy.speed = speed;
		enemy.layer = 3
        group.add(enemy);
    }
}

function moveEnemies() {
	// Spawn and Respawn function
	if(zombies.length === 0 && humans.length === 0) {
		spawnEnemies(zombies, 5, zombieSpeed);
        spawnEnemies(humans, 5, humanSpeed);
        zombieSpeed += 0.1;
        humanSpeed += 0.1;

		// Spawn more enemies as the score gets higher
		if(score >= 1000) {
			spawnEnemies(zombies, 1, zombieSpeed);
			spawnEnemies(humans, 1, zombieSpeed);

			if (score >= 5000) {
				spawnEnemies(zombies, 5, zombieSpeed);
				spawnEnemies(humans, 3, zombieSpeed);

				if (score >= 10000) {
					spawnEnemies(zombies, 7, zombieSpeed);
					spawnEnemies(humans, 5, zombieSpeed);

					if (score >= 20000) {
						spawnEnemies(zombies, 10, zombieSpeed);
						spawnEnemies(humans, 5, zombieSpeed);

						if(score >= 50000) {
							spawnEnemies(zombies, 20, zombieSpeed);
							spawnEnemies(humans, 10, zombieSpeed);

							if(score >= 200000) {
								spawnEnemies(zombies, 50, zombieSpeed);
								spawnEnemies(humans, 25, zombieSpeed);
							}
						}
					}
				}
			}
		} 
	}

	// Move zombies towards the player
    zombies.forEach(zombie => {
        let zombieAngle = atan2(player.y - zombie.y, player.x - zombie.x);
        zombie.vel.x = cos(zombieAngle) * zombieSpeed;
        zombie.vel.y = sin(zombieAngle) * zombieSpeed;

		// Set sprite
		zombie.image = 'assets/zombie-slow.png'

		// Remove enemy if hits player and decrement health point
		if(zombie.collides(hitbox)) {
			zombie.remove()
			
			//Remove health points if ememy hits player
			healthPoints = healthPoints -1;
		}
    });

	// Move humans towards the player
	humans.forEach(human => {
		let humanAngle = atan2(player.y - human.y, player.x - human.x);
        human.vel.x = cos(humanAngle) * humanSpeed;
        human.vel.y = sin(humanAngle) * humanSpeed;

		// Set sprite
		human.image = 'assets/zombie-fast.png'

		// Remove enemy if hits player and decrement health point
		if(human.collides(hitbox)) {
			human.remove()

			//Remove health points if ememy hits player
			healthPoints = healthPoints - 1;
		}
	})
}

function menuScreen() {
	background('grey')

	text('Press Space To Start', width / 2, height / 2)
	textAlign('center')
	textSize(30)

	if(kb.presses(' ')) {
		screen = 1
	}
}

function gameScreen() {
	displayValues();

	cursor('none')

	// Change sprite opacity
	crosshair.opacity = 1
	player.opacity = 1

	// Change tile opacity
	grass.opacity = 1
	lSide.opacity = 1
	rSide.opacity = 1
	road.opacity = 1

	gunPlay();

	detectCollision();

	moveEnemies();
}

function endScreen() {
	background('grey')

	cursor(ARROW)

	textAlign('center')
	textSize(50)
	text('Score', width / 2, height / 4)
	text(score,  width / 2, height / 2)
	textSize(30)
	text('Reload Page To Restart', width / 2, height / 1.5 )

	crosshair.opacity = 0
	player.opacity = 0
	ammoSprite.opacity = 0
	zombies.remove()
	humans.remove()
	
	// Change tile opacity
	grass.opacity = 0
	lSide.opacity = 0
	rSide.opacity = 0
	road.opacity = 0
}

function starterWeapon() {
	if(mouse.pressed() && ammoCount > 0) {
		// Remove 1 ammo
		ammoCount = ammoCount - 1
		// Create new projectile in group
		let newProjectile = new projectiles.Sprite()
		// Move projecile in accordance to player
		newProjectile.x = player.x

		// Automatic Reload
		if(ammoCount <= 0) {
			setTimeout(() => {
				ammoCount = ammoCount + 15
			}, 1000)
		}

		// Bullet casing
		bulletCasing.y = player.y - 10
		bulletCasing.x = player.x + 10
		bulletCasing.vel.y = -2
		bulletCasing.vel.x = 2
		if(bulletCasing.y >= height / 10) {
			bulletCasing.vel.y = 3
		}
	}
}

function shotgunUpgrade() {
	if(mouse.pressed() && ammoCount > 0) {
		// Change player sprite
		player.image = 'assets/player-shotgun.png'

		// Remove 3 ammo
		ammoCount = ammoCount - 1

		// Change range
		projectiles.life = 20;

		// Projectile
		let newProjectile = new projectiles.Sprite()
		newProjectile.x = player.x
		
		// Second Projectile
		let newProjectile1 = new projectiles.Sprite()
		newProjectile1.x = player.x -7
		newProjectile1.vel.x = -2
		
		// Third Projectile
		let newProjectile2 = new projectiles.Sprite()
		newProjectile2.x = player.x +7
		newProjectile2.vel.x = +2

		// Automatic Reload
		if(ammoCount <= 0) {
			setTimeout(() => {
				ammoCount = ammoCount + 8
			}, 1500)
		}

		// Bullet casing
		bulletCasing.y = player.y - 10
		bulletCasing.x = player.x + 10
		bulletCasing.vel.y = -2
		bulletCasing.vel.x = 2
		if(bulletCasing.y >= height / 10) {
			bulletCasing.vel.y = 3
		}
	}
}

function akUpgrade() {
	// Change player sprite
	player.image = 'assets/player-ak.png'

	if(mouse.pressing() && ammoCount > 0) {
		// Remove 1 ammo
		ammoCount = ammoCount - 1

		// Change range
		projectiles.life = 35;
		
		// Projectile
		let newProjectile = new projectiles.Sprite()
		newProjectile.x = player.x

		// Automatic Reload
		if(ammoCount <= 0) {
			setTimeout(() => {
				ammoCount = ammoCount + 30
			}, 2500)
		}

		// Bullet casing
		bulletCasing.y = player.y - 10
		bulletCasing.x = player.x + 10
		bulletCasing.vel.y = -2
		bulletCasing.vel.x = 2
		if(bulletCasing.y >= height / 10) {
			bulletCasing.vel.y = 3
		}
	}
}