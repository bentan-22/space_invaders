const game = {};
game.canvas = document.getElementById('canvas');
game.ctx = game.canvas.getContext('2d');
game.backgroundColor = '#000000';
/* default 16 */ game.speed = 16;

// Asteroid settings
game.asteroidColor = '#808080';
game.asteroidYPosition = game.canvas.height - 120;
game.asteroidParts = 0;
game.noOfAsteroids = 0;
game.asteroidWidth = 0;
game.asteroidHeight = 0;
game.asteroidsSpace = 0;

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
game.aliensEachLine = 0;
game.alienLines = 0;
game.totalAliens = game.aliensEachLine * game.alienLines;
game.alienFireRate = 0;
game.alienStep = 0;

// Customizable mode settings
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


game.update = () => {
    game.ctx.fillStyle = game.backgroundColor;
    game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

    game.player.draw(game.ctx);

    for (let i = 0; i < game.asteroids.length; i++) {
        game.asteroids[i].draw(game.ctx);
    }

    for (let i = 0; i< game.aliens.length; i++) {
        game.aliens[i].draw(game.ctx);
        game.aliens[i].update(game.alienDirection, 0);
    }

    if (game.aliens.length === 0) {
        alert(`CONGRATULATIONS! YOU WIN THE GAME!`)
        location.reload();
    }

    if (game.alienDirection == 1) {
        // find Alien closest to right side of screen
        let closestToRightSideAlien = game.aliens[0];
        for (let i = 1; i < game.aliens.length; i++) {
    // if Alien's x-axis position is more than rightmost Alien's position
            if (game.aliens[i].x > closestToRightSideAlien.x) {
    // set rightmost Alien to that Alien
                closestToRightSideAlien = game.aliens[i];
            }
    
        }
    // check whether rightmost Alien has reached rightmost side of screen
        if (closestToRightSideAlien.x + closestToRightSideAlien.width > game.canvas.width) {
            // reverse the Aliens' moving direction
            game.alienDirection = -1;
            // move the Aliens downward
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
    // check whether leftmost Alien has reached leftmost side of screen
        if (closestToLeftSideAlien.x < 0) {
            // reverse the Aliens' moving direction
            game.alienDirection = 1;
            // move the Aliens downward
            for (let i = 0; i < game.aliens.length; i++) {
                game.aliens[i].update(0, game.alienStep);
            }
        }
    }

// set Alien's firing speed
    game.alienFireTimer += Math.random() * 10;
    if (game.alienFireTimer > game.alienFireRate) {
        game.alienFireTimer = 0;
        game.aliens[Math.floor(Math.random() * game.aliens.length)].shoot(5);
    }

// check whether Player bullet collides with Asteroid
    for (let i = 0; i < game.player.bullets.length; i++) {
        for (let j = 0; j < game.asteroids.length; j++) {
            if (game.asteroids[j].collideWith(game.player.bullets[i])) {
                game.asteroids[j].removeOnCollide(game.player.bullets[i]);
                game.player.bullets.splice(i, 1);
                break;
            }
        }
    }

// check whether Alien bullet collide with Asteroid
    for (let i = 0; i < game.aliens.length; i++) {
        for (let j = 0; j < game.aliens[i].bullets.length; j++) {
            for (let k = 0; k < game.asteroids.length; k++) {
                if (game.asteroids[k].collideWith(game.aliens[i].bullets[j])) {
                    game.asteroids[k].removeOnCollide(game.aliens[i].bullets[j]);
                    game.aliens[i].bullets.splice(j, 1);
                    break;
                }
            }
        }
    }

// check whether Player bullet collide with Alien
    for (let i = 0; i < game.player.bullets.length; i++) {
        for (let j = 0; j < game.aliens.length; j++) {
            if (game.aliens[j].collideWith(game.player.bullets[i])) {
                game.aliens.splice(j, 1);
                document.getElementById('scoreboard').innerHTML = `Score: ${game.totalAliens - game.aliens.length} out of ${game.totalAliens}`;
                game.player.bullets.splice(i, 1);
                break;
            }  
        }
    }

// check whether Alien bullet collide with Player
    for (let i = 0; i < game.aliens.length; i++) {
        for (let j = 0; j < game.aliens[i].bullets.length; j++) {
            if (game.player.collideWith(game.aliens[i].bullets[j])) {
                alert(`YOU ARE DEAD! YOUR FINAL SCORE IS ${game.totalAliens - game.aliens.length} out of ${game.totalAliens}!`);
                location.reload();
            }
        }
    }

// check whether Alien has reached Asteroids
    for (let i = 0; i < game.aliens.length; i++) {
        if (game.aliens[i].y + game.aliens[i].height > game.asteroidYPosition) {
        // alert
        alert(`THE ALIENS HAVE OVERRUN YOUR POSITION! YOU ARE DEAD!`)
        location.reload();
        }
    }
    
}

game.keydown = (event) => {
    if (event.keyCode === 37) {
        game.player.update(-5, 0);
    } else if (event.keyCode === 39) {
        game.player.update(5, 0);
    } else if (event.keyCode === 32) {
    // the preventDefault() prevents the start button from being pressed when the spacebar is pressed
        event.preventDefault();
        game.player.shoot(-5);
    }
}

game.init = () => {
    game.interval = setInterval(game.update, game.speed);

    game.player = new Player(
        game.canvas.width / 2 - 50,
        game.canvas.height - 50,
        game.playerWidth,
        game.playerHeight,
        game.playerColor,
        game.canvas.width
    );

    game.asteroids = [];
    for (let i = 0; i < game.noOfAsteroids; i++) {
        game.asteroids.push(new Asteroid(
            game.asteroidsSpace + i * game.asteroidsSpace,
            game.asteroidYPosition,
            game.asteroidWidth,
            game.asteroidHeight,
            game.asteroidColor,
            game.asteroidParts
        ));
    }

    game.aliens = [];
    for (let i = 0; i < game.alienLines; i++) {
        for (let j = 0; j < game.aliensEachLine; j++) {
            game.aliens.push(new Spaceship(
                game.alienSpace + j * game.alienSpace,
                game.alienSpace + i * game.alienSpace,
                game.alienWidth,
                game.alienHeight,
                game.alienColor,
            ));
        }
    }

}

game.stop = () => {
    clearInterval(game.interval);
}

const easyMode = () => {
    easyModeSettings();
    return game.init();
};
const mediumMode = () => {
    mediumModeSettings();
    return game.init();
};
const hardMode = () => {
    hardModeSettings();
    return game.init();
};

const allModeButtons = document.getElementById('mode-buttons-div');
const instructionsDiv = document.getElementById('instructions-div');
const h1SpaceInvaders = document.getElementById('spaceinvaders-h1');

const mainMenu = document.getElementById('main-menu');
mainMenu.onclick = (event) => {
    location.reload();
}

const easyModeButton = document.getElementById('easy-mode-button');
easyModeButton.onclick = (event) => {
    allModeButtons.style.display = 'none';
    instructionsDiv.style.display = 'none';
    h1SpaceInvaders.style.display = 'none';
    return easyMode();
}

const mediumModeButton = document.getElementById('medium-mode-button');
mediumModeButton.onclick = (event) => {
    allModeButtons.style.display = 'none';
    instructionsDiv.style.display = 'none';
    h1SpaceInvaders.style.display = 'none';
    return mediumMode();
}

const hardModeButton = document.getElementById('hard-mode-button');
hardModeButton.onclick = (event) => {
    allModeButtons.style.display = 'none';
    instructionsDiv.style.display = 'none';
    h1SpaceInvaders.style.display = 'none';
    return hardMode();
}

window.onkeydown = game.keydown;