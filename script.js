///////////////////////////////////////////////////////////////////////////
// Create the GameItem class with 5 properties and 3 methods
///////////////////////////////////////////////////////////////////////////
class GameItem {
    constructor(x, y, width, height, color) {
        // x and y define GameItem's position on x-axis and y-axis
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

///////////////////////////////////////////////////////////////////////////
// GameItem class method #1: draw
///////////////////////////////////////////////////////////////////////////
// draw the GameItem on the canvas
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

///////////////////////////////////////////////////////////////////////////
// GameItem class method #2: update
///////////////////////////////////////////////////////////////////////////
// update the GameItem's position on the canvas in x-axis and y-axis
// dx, dy make the coordinates relative to the absolute x, y coordinates
    update(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

///////////////////////////////////////////////////////////////////////////
// GameItem class method #3: collideWith
///////////////////////////////////////////////////////////////////////////
// check whether GameItem overlaps (collides) with another item
// collideWith will return 'true' when 4 conditions are ALL TRUE:
// see Google Sheet for illustrations of positive and negative examples

    collideWith(item) {
        // Positive example: GameItem is at 5 on x-axis
        // item has width of 3 and is at 4 on x-axis
        // item's total width spans from 4 to 6 on x-axis;
        // 5 < 4 + 3 --> TRUE

        // Negative example: same as positive example
        return (this.x < item.x + item.width
        
        // Positive example: GameItem is at 5 on x-axis and has width of 3
        // GameItem's total width spans from 5 to 7 on x-axis
        // item is at 4 on x-axis
        // 5 + 3 > 4 --> TRUE

        // Negative example: same as positive example
            && this.x + this.width > item.x
        
        // Positive example: GameItem is at 5 on y-axis
        // item has height of 3 and is at 7 on y-axis
        // item's total height spans from 7 to 9 on y-axis
        // 5 < 7 + 3 --> TRUE

        // Negative example: GameItem is at 4 on y-axis
        // item has height of 3 and is at 7 on y-axis
        // item's total height spans from 7 to 9 on y-axis
        // 4 < 7 + 3 --> TRUE
            && this.y < item.y + item.height
        
        // Positive example: GameItem is at 5 on y-axis and has height of 3
        // GameItem's total height spans from 5 to 7
        // item is at 7 on y-axis
        // 5 + 3 > 7 --> TRUE

        // Negative example: GameItem is at 4 on y-axis and has height of 3
        // GameItem's total height spans from 4 to 6
        // item is at 7 on y-axis
        // 4 + 3 > 7 --> FALSE
            && this.y + this.height > item.y);
    }
}


///////////////////////////////////////////////////////////////////////////
// Create the Bullet class as an extension of GameItem class
///////////////////////////////////////////////////////////////////////////
// create a new class Bullet which inherits properties and methods from GameItem class
class Bullet extends GameItem {
    // add a new property dy since Bullet only moves along y-axis
    constructor(x, y, width, height, color, dy) {
        super(x, y, width, height, color);
        // set dy to Bullet's relative position on y-axis
        this.dy = dy;
    }

    // override the update method defined in GameItem class
    // Bullet's y-axis position changes according to dy
    update(x, y) {
        this.y += this.dy;
    }
}

///////////////////////////////////////////////////////////////////////////
// Create the Spaceship class as an extension of GameItem class
///////////////////////////////////////////////////////////////////////////
// create a new class Spaceship which inherits properties and methods from GameItem class
class Spaceship extends GameItem {
    // add a new property canvasHeight
    constructor(x, y, width, height, color, canvasHeight) {
        super(x, y, width, height, color);
        // define canvasHeight as the boundaries of the bullets from Spaceship
        this.canvasHeight = canvasHeight;
        // add 3 more properties to define Bullet width, height and color
        this.bulletWidth = 4;
        this.bulletHeight = 8;
        this.bulletColor = '#FFFF00';
        // create empty array for bullets fired by Spaceship
        this.bullets = [];
    }

    // override the draw method previously defined in GameItem class
    draw(ctx) {
        super.draw(ctx);
        // draw Spaceship's bullets by creating a for-loop to loop through bullets array
        for (let i = 0; i < this.bullets.length; i++) {
            // call the draw method to draw out bullets on canvas
            this.bullets[i].draw(ctx);
            // call the update method to update bullet's position on canvas
            this.bullets[i].update(0, 0);

            // check whether bullet is not within boundaries
            // 1) bullet is below 0 on the y-axis (beyond the top of the canvas), OR
            // 2) bullet goes beyond the canvas height (beyond the bottom of the canvas)
            if (this.bullets[i].y < 0 || this.bullets[i].y > this.canvasHeight) {
                // remove bullet from array
                this.bullets.splice(i, 1);
            }
        }
    }

    // create shoot method to fire bullets from Spaceship
    shoot(dy) {
        // push a new Bullet class into bullets array
        this.bullets.push(new Bullet(
            // define properties of new Bullet
            this.x + this.width / 2 - this.bulletWidth / 2,
            this.y - this.bulletHeight,
            this.bulletWidth,
            this.bulletHeight,
            this.bulletColor,
            dy
        ));
    }
}

///////////////////////////////////////////////////////////////////////////
// Create the Player class as an extension of GameItem class
///////////////////////////////////////////////////////////////////////////
// create a new class Player which inherits properties and methods from Spaceship class
class Player extends Spaceship {
    // add a new property canvasWidth
    constructor(x, y, width, height, color, canvasHeight, canvasWidth) {
        super(x, y, width, height, color, canvasHeight);
        this.canvasWidth = canvasWidth;
    }

    // update Player's position
    update(dx, dy) {
        // call the update method from Spaceship class
        super.update(dx, dy);
        // ensure that player cannot go beyond 0 on x-axis (leftmost side of canvas)
        if (this.x < 0) {
            this.x = 0;
        // if Player goes beyond the canvas width (rightmost side of canvas)
        } else if (this.x + this.width > this.canvasWidth) {
        // set Player's position on x-axis to canvasWidth minus Player width
        // ensure that Player stay within canvas
            this.x = this.canvasWidth - this.width;
        }
    }
}

///////////////////////////////////////////////////////////////////////////
// Create the Asteroid class with 6 properties and 3 methods
///////////////////////////////////////////////////////////////////////////
class Asteroid {
    constructor(x, y, width, height, color, noOfParts) {
    // create an empty array for Asteroid parts
        this.parts = [];
    // create Asteroid parts
    // create for-loops to loop through parts array for as long as ...
    // ... shorter than noOfParts value (customizable in game object)
        for (let i = 0; i < noOfParts; i++) {
            for (let j = 0; j < noOfParts; j++) {
                // create new GameItem to push into parts array
                this.parts.push(new GameItem(
                    x + i * width,
                    y + j * height,
                    width,
                    height,
                    color
                ));
            }
        }
    }

///////////////////////////////////////////////////////////////////////////
// Asteroid class method #1: draw
///////////////////////////////////////////////////////////////////////////
// call the draw method to draw Asteroid on canvas
    draw(ctx) {
        for (let i = 0; i < this.parts.length; i++) {
            this.parts[i].draw(ctx);
        }
    }

///////////////////////////////////////////////////////////////////////////
// Asteroid class method #2: collideWith
///////////////////////////////////////////////////////////////////////////
// call the collideWith method to check if Asteroid collides with another GameItem
    collideWith(item) {
        // run a for-loop through parts array
        for (let i = 0; i < this.parts.length; i++) {
        // if any part collides with a GameItem, return true
            if (this.parts[i].collideWith(item)) {
                return true;
            }
        } return false;
    }

///////////////////////////////////////////////////////////////////////////
// Asteroid class method #2: collideWith
///////////////////////////////////////////////////////////////////////////
// create removeOnCollide method to remove GameItem when there is a collision
    removeOnCollide(item) {
        // run a for-loop through the parts array
        for (let i = 0; i < this.parts.length; i++) {
        // if any part collide with GameItem
            if (this.parts[i].collideWith(item)) {
            // remove from parts array
                this.parts.splice(i, 1);
            // end for-loop
                break;
            }
        }
    }
}



///////////////////////////////////////////////////////////////////////////
// Create the game object with _____ methods
///////////////////////////////////////////////////////////////////////////

const game = {};
// create blank 2d canvas
game.canvas = document.getElementById('canvas');
game.ctx = game.canvas.getContext('2d');
game.backgroundColor = '#000000';
/* default 16 */ game.speed = 16;

// Asteroid settings
game.asteroidColor = '#808080';
game.asteroidYPosition = game.canvas.height - 120;
/* default __ */ game.asteroidParts = 0;
/* default __ */ game.noOfAsteroids = 0;
/* default __ */ game.asteroidWidth = 0;
/* default __ */ game.asteroidHeight = 0;
/* default __ */ game.asteroidsSpace = 0;

// Player settings
game.playerColor = '#0099CC';
game.playerWidth = 30;
game.playerHeight = 30;

// Alien settings
game.alienSpace = 25;
game.alienWidth = 20;
game.alienHeight = 20;
game.alienColor = '#6CC417';
game.alienFireTimer = 0;
game.alienDirection = 1;
/* default __ */ game.aliensEachLine = 0;
/* default __ */ game.alienLines = 0;
game.totalAliens = game.aliensEachLine * game.alienLines;
/* default __ */ game.alienFireRate = 0;
/* default __ */ game.alienStep = 0;

///////////////////////////////////////////////////////////////////////////
// Customizable difficulty modes
///////////////////////////////////////////////////////////////////////////
// change settings to easy mode
const easyModeSettings = () => {
    game.asteroidParts = 5;
    game.noOfAsteroids = 8;
    game.asteroidWidth = 10;
    game.asteroidHeight = 10;
    game.asteroidsSpace = 90;

    game.aliensEachLine = 15;
    game.alienLines = 4;
    game.totalAliens = game.aliensEachLine * game.alienLines;
    game.alienFireRate = 80;
    game.alienStep = 10;
};

// change settings to medium mode
const mediumModeSettings = () => {
    game.asteroidParts = 5;
    game.noOfAsteroids = 8;
    game.asteroidWidth = 8;
    game.asteroidHeight = 8;
    game.asteroidsSpace = 90;

    game.aliensEachLine = 20;
    game.alienLines = 6;
    game.totalAliens = game.aliensEachLine * game.alienLines;
    game.alienFireRate = 60;
    game.alienStep = 10;
};

// start game in hard mode
const hardModeSettings = () => {
    game.asteroidParts = 5;
    game.noOfAsteroids = 8;
    game.asteroidWidth = 6;
    game.asteroidHeight = 6;
    game.asteroidsSpace = 90;

    game.aliensEachLine = 30;
    game.alienLines = 8;
    game.totalAliens = game.aliensEachLine * game.alienLines;
    game.alienFireRate = 40;
    game.alienStep = 10;
};

///////////////////////////////////////////////////////////////////////////
// game object method #1: update
///////////////////////////////////////////////////////////////////////////
// create update method to handle game loop
game.update = () => {
    // fill canvas background color
    game.ctx.fillStyle = game.backgroundColor;

    // draw canvas as a rectangle based on width, height
    game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

    // draw Player
    game.player.draw(game.ctx);

    // draw Asteroids
    for (let i = 0; i < game.asteroids.length; i++) {
        game.asteroids[i].draw(game.ctx);
    }

    // draw Aliens
    for (let i = 0; i< game.aliens.length; i++) {
        game.aliens[i].draw(game.ctx);
        game.aliens[i].update(game.alienDirection, 0);
    }

    // when Player has destroyed all Aliens
    if (game.aliens.length === 0) {
        alert(`CONGRATULATIONS! YOU WIN THE GAME!`)
        // return to main menu by refreshing page
        location.reload();
    }

///////////////////////////////////////////////////////////////////////////
// game object method #1: update --> define Alien movement
///////////////////////////////////////////////////////////////////////////
    if (game.alienDirection == 1) {
        // find Alien closest to right side of screen
        let closestToRightSideAlien = game.aliens[0];
    // start a for-loop to loop through aliens array
        for (let i = 1; i < game.aliens.length; i++) {
    // if Alien's x-axis position is more than rightmost Alien's position
            if (game.aliens[i].x > closestToRightSideAlien.x) {
    // set rightmost Alien to that Alien
                closestToRightSideAlien = game.aliens[i];
            }
    
        }
    // check whether rightmost Alien has reached ...
    // ... rightmost side of screen
        if (closestToRightSideAlien.x + closestToRightSideAlien.width > game.canvas.width) {
            // reverse the Aliens' moving direction
            game.alienDirection = -1;
            // move the Aliens downward (along y-axis only)
            for (let i = 0; i < game.aliens.length; i++) {
                game.aliens[i].update(0, game.alienStep);
            }
        }
    } else if (game.alienDirection == -1) {
        // find Alien closest to left side of screen
        let closestToLeftSideAlien = game.aliens[0];
        for (let i = 0; i < game.aliens.length; i++) {
            if (game.aliens[i].x < closestToLeftSideAlien.x) {
                closestToLeftSideAlien = game.aliens[i];
            }
        }
    // check whether leftmost Alien has reached ...
    // ... leftmost side of screen
        if (closestToLeftSideAlien.x < 0) {
            // reverse the Aliens' moving direction
            game.alienDirection = 1;
            // move the Aliens downward (along y-axis only)
            for (let i = 0; i < game.aliens.length; i++) {
                game.aliens[i].update(0, game.alienStep);
            }
        }
    }

///////////////////////////////////////////////////////////////////////////
// game object method #1: update --> define firing
///////////////////////////////////////////////////////////////////////////
// set alienFireTimer to a random number between 0 and 10
// default alienFireTimer is 0
    game.alienFireTimer += Math.random() * 10;
// if alienFireTimer is greater than alienFireRate (customizable)
    if (game.alienFireTimer > game.alienFireRate) {
    // set alienFireTimer to 0;
        game.alienFireTimer = 0;
        // randomly select an Alien from aliens array to shoot
        game.aliens[Math.floor(Math.random() * game.aliens.length)].shoot(5);
    }

// check whether Player bullet collide with Asteroid
// run a for-loop through Player's bullets array
    for (let i = 0; i < game.player.bullets.length; i++) {
    // run a for-loop through asteroids array
        for (let j = 0; j < game.asteroids.length; j++) {
        // if Player's bullet collide with Asteroid
            if (game.asteroids[j].collideWith(game.player.bullets[i])) {
            // remove part of Asteroid
                game.asteroids[j].removeOnCollide(game.player.bullets[i]);
            // remove Player's bullet
                game.player.bullets.splice(i, 1);
            // restart loop
                break;
            }
        }
    }

// check whether Alien bullet collide with Asteroid
// run a for-loop through aliens array
    for (let i = 0; i < game.aliens.length; i++) {
    // run a for-loop through aliens' bullets array
        for (let j = 0; j < game.aliens[i].bullets.length; j++) {
        // run a for-loop through asteroids array
            for (let k = 0; k < game.asteroids.length; k++) {
            // if Alien bullet collide with Asteroid
                if (game.asteroids[k].collideWith(game.aliens[i].bullets[j])) {
                // remove part of Asteroid
                    game.asteroids[k].removeOnCollide(game.aliens[i].bullets[j]);
                // remove Alien's bullet
                    game.aliens[i].bullets.splice(j, 1);
                // restart loop
                    break;
                }
            }
        }
    }

// check whether Player bullet collide with Alien
// run a for-loop through Player's bullets array  
    for (let i = 0; i < game.player.bullets.length; i++) {
        // run a for-loop through aliens array
        for (let j = 0; j < game.aliens.length; j++) {
        // if Player's bullet collide with Alien
            if (game.aliens[j].collideWith(game.player.bullets[i])) {
            // remove Alien from aliens array
                game.aliens.splice(j, 1);
            // print score onto scoreboard
            const scoreboard = document.getElementById('scoreboard');
            scoreboard.innerHTML = `Score: ${game.totalAliens - game.aliens.length} out of ${game.totalAliens}`;
            // remove Player's bullet from bullets array
                game.player.bullets.splice(i, 1);
            // restart loop
                break;
            }  
        }
    }

// check whether Alien bullet collide with Player
// run a for-loop through aliens array
    for (let i = 0; i < game.aliens.length; i++) {
    // run a for-loop through aliens' bullets array
        for (let j = 0; j < game.aliens[i].bullets.length; j++) {
        // if Alien's bullet collide with Player
            if (game.player.collideWith(game.aliens[i].bullets[j])) {
                // alert and give final score
                alert(`YOU ARE DEAD! YOUR FINAL SCORE IS ${game.totalAliens - game.aliens.length} out of ${game.totalAliens}!`);
                // return to main menu by refreshing page
                location.reload();
            }
        }
    }

// check whether Alien has reached Asteroids
// run a for-loop through aliens array
    for (let i = 0; i < game.aliens.length; i++) {
// if Alien's y-axis position is beyond Asteroid's y-axis position
// this means Alien has reached Asteroids
        if (game.aliens[i].y + game.aliens[i].height > game.asteroidYPosition) {
        // alert
        alert(`THE ALIENS HAVE OVERRUN YOUR POSITION! YOU ARE DEAD!`)
        // return to main menu by refreshing page
        location.reload();
        }
    }
    
}

///////////////////////////////////////////////////////////////////////////
// game object method #2: keydown
///////////////////////////////////////////////////////////////////////////
// create keydown method to assign keys to movement and firing
game.keydown = (event) => {
    // if keyCode 37 (left arrow key) or keyCode 65 ('A' key) is pressed
    if (event.keyCode === 37 || event.keyCode === 65) {
    // move player's position along x-axis by -5 (leftward)
        game.player.update(-5, 0);
    // if keyCode 39 (right arrow key) or keyCode 68 ('D' key) is pressed
    } else if (event.keyCode === 39 || event.keyCode === 68) {
    // move player's position along x-axis by 5 (rightward)
        game.player.update(5, 0);
    // if keyCode 32 (spacebar) is pressed
    } else if (event.keyCode === 32) {
    // the preventDefault prevents the start button from being pressed ...
    // ... when the spacebar is pressed
        event.preventDefault();
    // fire a bullet along y-axis by -5 (upward)
        game.player.shoot(-5);
    }
}

///////////////////////////////////////////////////////////////////////////
// game object method #3: init
///////////////////////////////////////////////////////////////////////////
// create init to start game according to defined settings
game.init = () => {
    // set the speed at which the game will update
    game.interval = setInterval(game.update, game.speed);

    // setup Player
    game.player = new Player(
    // properties: x, y, width, height, color, canvasHeight, canvasWidth
        game.canvas.width / 2 - 50,
        game.canvas.height - 50,
        game.playerWidth,
        game.playerHeight,
        game.playerColor,
        game.canvas.width
    );

    // setup Asteroids
    // create an empty array for asteroids
    game.asteroids = [];
    // run a for-loop to create as many Asteroids as defined in game object
    for (let i = 0; i < game.noOfAsteroids; i++) {
        game.asteroids.push(new Asteroid(
    // properties: x, y, width, height, color, noOfParts
            game.asteroidsSpace + i * game.asteroidsSpace,
            game.asteroidYPosition,
            game.asteroidWidth,
            game.asteroidHeight,
            game.asteroidColor,
            game.asteroidParts
        ));
    }

    // setup Aliens
    // create an empty array for aliens
    game.aliens = [];
    // run a for-loop to create as many Aliens as defined in game object
    for (let i = 0; i < game.alienLines; i++) {
        for (let j = 0; j < game.aliensEachLine; j++) {
            game.aliens.push(new Spaceship(
    // properties: x, y, width, height, color, canvasHeight
                game.alienSpace + j * game.alienSpace,
                game.alienSpace + i * game.alienSpace,
                game.alienWidth,
                game.alienHeight,
                game.alienColor,
            ));
        }
    }

}

///////////////////////////////////////////////////////////////////////////
// game object method #4: stop
///////////////////////////////////////////////////////////////////////////
// create stop method to clear game.interval defined in init method above
game.stop = () => {
    clearInterval(game.interval);
}

///////////////////////////////////////////////////////////////////////////
// game object method #5: different modes
///////////////////////////////////////////////////////////////////////////
// start game in easy mode
const easyMode = () => {
    easyModeSettings();
    return game.init();
};

// start game in medium mode
const mediumMode = () => {
    mediumModeSettings();
    return game.init();
};

// start game in hard mode
const hardMode = () => {
    hardModeSettings();
    return game.init();
};

///////////////////////////////////////////////////////////////////////////
// functions for buttons
///////////////////////////////////////////////////////////////////////////
// add a function to start game in easy mode when button is clicked
const allModeButtons = document.getElementById('mode-buttons-div');
const instructionsDiv = document.getElementById('instructions-div');
const h1SpaceInvaders = document.getElementById('spaceinvaders-h1');

const easyModeButton = document.getElementById('easy-mode-button');
easyModeButton.onclick = (event) => {
    allModeButtons.style.display = 'none';
    instructionsDiv.style.display = 'none';
    h1SpaceInvaders.style.display = 'none';
    return easyMode();
}

// add a function to start game in hard mode when button is clicked
const mediumModeButton = document.getElementById('medium-mode-button');
mediumModeButton.onclick = (event) => {
    allModeButtons.style.display = 'none';
    instructionsDiv.style.display = 'none';
    h1SpaceInvaders.style.display = 'none';
    return mediumMode();
}

// add a function to start game in hard mode when button is clicked
const hardModeButton = document.getElementById('hard-mode-button');
hardModeButton.onclick = (event) => {
    allModeButtons.style.display = 'none';
    instructionsDiv.style.display = 'none';
    h1SpaceInvaders.style.display = 'none';
    return hardMode();
}

// add a function to return to main menu when button is clicked
const mainMenu = document.getElementById('main-menu');
mainMenu.onclick = (event) => {
    location.reload();
}

// detect when player presses a key
window.onkeydown = game.keydown;