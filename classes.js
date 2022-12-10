class GameItem {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    collideWith(item) {
        return (this.x < item.x + item.width
            && this.x + this.width > item.x
            && this.y < item.y + item.height
            && this.y + this.height > item.y);
    }
}

class Bullet extends GameItem {
    constructor(x, y, width, height, color, dy) {
        super(x, y, width, height, color);
        this.dy = dy;
    }

    update(x, y) {
        this.y += this.dy;
    }
}

class Spaceship extends GameItem {
    constructor(x, y, width, height, color, canvasHeight) {
        super(x, y, width, height, color);
        this.canvasHeight = canvasHeight;
        this.bulletWidth = 4;
        this.bulletHeight = 8;
        this.bulletColor = '#FFFF00';
        this.bullets = [];
    }

    draw(ctx) {
        super.draw(ctx);
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].draw(ctx);
            this.bullets[i].update(0, 0);

            // check whether bullet is not within boundaries
            if (this.bullets[i].y < 0 || this.bullets[i].y > this.canvasHeight) {
                this.bullets.splice(i, 1);
            }
        }
    }

    shoot(dy) {
        this.bullets.push(new Bullet(
            this.x + this.width / 2 - this.bulletWidth / 2,
            this.y - this.bulletHeight,
            this.bulletWidth,
            this.bulletHeight,
            this.bulletColor,
            dy
        ));
    }
}

class Player extends Spaceship {
    constructor(x, y, width, height, color, canvasHeight, canvasWidth) {
        super(x, y, width, height, color, canvasHeight);
        this.canvasWidth = canvasWidth;
    }

    update(dx, dy) {
        super.update(dx, dy);
        // ensure that Player cannot go beyond the leftmost side of the canvas
        if (this.x < 0) {
            this.x = 0;
        // if Player goes beyond the rightmost side of the canvas
        } else if (this.x + this.width > this.canvasWidth) {
            this.x = this.canvasWidth - this.width;
        }
    }
}

class Asteroid {
    constructor(x, y, width, height, color, noOfParts) {
        this.parts = [];
        // create Asteroid parts
        for (let i = 0; i < noOfParts; i++) {
            for (let j = 0; j < noOfParts; j++) {
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

    draw(ctx) {
        for (let i = 0; i < this.parts.length; i++) {
            this.parts[i].draw(ctx);
        }
    }

    collideWith(item) {
        for (let i = 0; i < this.parts.length; i++) {
            if (this.parts[i].collideWith(item)) {
                return true;
            }
        } return false;
    }

    removeOnCollide(item) {
        for (let i = 0; i < this.parts.length; i++) {
            if (this.parts[i].collideWith(item)) {
                this.parts.splice(i, 1);
                break;
            }
        }
    }
}