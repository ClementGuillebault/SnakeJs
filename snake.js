/**
 * Game class
 */
class Game {
    /**
     * Constructors
     */
    constructor() {
        this.width     = 640;
        this.height    = 480;
        this.snakeSize = 3;
        this.fps       = 60;
        this.direction = 39;
        this.score     = 0;

        this.context   = null;
        this.snake     = null;
        this.food      = null;

        this.keyboard  = new Keyboard();
        this.snake     = new Snake(this.snakeSize);
        this.food      = new Food();

        this.initContext();
    }

    /**
     * Restart game
     */
    restart() {
        this.score        = 0;
        this.keyboard.key = 39;

        this.snake.snake.splice(0);

        this.snake.init();
    }
    /**
     * Run game
     */
    run() {
        this.snake.init();
        this.food.init(this.width, this.height);

        this.drawGame(this.snake, this.food);

        setInterval(()=> {
            this.drawGame(this.snake, this.food);
        }, this.fps);
    }

    /**
     * Get context from canvas
     */
    initContext() {
        this.context = document.getElementById('game').getContext('2d');
    }

    /**
     * Core function
     * @param {object} snake
     * @param {object} food
     */
    drawGame(snake, food) {
        let keyPress = this.keyboard.getKey();

        if (typeof(keyPress) !== 'undefined') {
            this.direction = keyPress;
        }

        Draw.drawLevel(
            this.context,
            this.width,
            this.height
        );

        let positionSnakeX = snake.snake[0].x;
        let positionSnakeY = snake.snake[0].y;

        switch (this.direction) {
            case 39:
                positionSnakeX++;
                break;
            case 37:
                positionSnakeX--;
                break;
            case 38:
                positionSnakeY--;
                break;
            case 40:
                positionSnakeY++;
                break;
        }

        if (this.outOfRange(positionSnakeX, positionSnakeY)) {
            console.log('Perdu');
            console.log('score: ' + this.score);
            this.restart();
            return;
        }

        let tail = {};

        if (positionSnakeX == food.food.x
            && positionSnakeY == food.food.y) {
            tail = {x: positionSnakeX, y: positionSnakeY};
            food.init(this.width, this.height);
            this.score++;
        }
        else {
            tail   = snake.snake.pop();
            tail.x = positionSnakeX;
            tail.y = positionSnakeY;
        }
        snake.snake.unshift(tail);

        for (let i = 0; i < snake.snake.length; i++) {
            Draw.draw(
                snake.snake[i].x,
                snake.snake[i].y,
                this.context
            );
        }

        Draw.draw(food.food.x, food.food.y, this.context);
    }
    /**
     * Check if snake touching border
     * @param {integer} x
     * @param {integer} y
     * @return {boolean}
     */
    outOfRange(x, y) {
        if ((x > (this.width - 10) / 10) || (x < 0) ||
            (y > (this.height - 10) / 10) || (y < 0)) {
                return true;
        }
        return false;
    }
}

/**
 *
 */
class Draw {
    /**
     * Draw arc
     * @param {integer} x
     * @param {integer} y
     * @param {object} context
     */
    static draw(x, y, context) {
        context.fillStyle = 'rgb(170, 170, 170)';
        context.beginPath();
        context.arc(
            (x * 10 + 6),
            (y * 10 + 6),
            5,
            0,
            2 * Math.PI,
            false
        );
        context.fill();
    }

    /**
     * Draw canvas and border
     * @param {object} context
     * @param {integer} width
     * @param {integer} height
     */
    static drawLevel(context, width, height) {
        context.fillStyle = 'white';
        context.fillRect(0, 0, width, height);

        context.strokeStyle = 'blue';
        context.strokeRect(0, 0, width, height);
    }
}

/**
 * Food class
 */
class Food {
    /**
     * Constructor
     */
    constructor() {
        this.food = {};
    }

    /**
     * Initialise food with random value
     * @param {*} width
     * @param {*} height
     */
    init(width, height) {
        this.food = {
            x: Math.round(Math.random() * (width - 10) / 12),
            y: Math.round(Math.random() * (height - 10) / 12)
        };
    }
}

/**
 * Snake class
 */
class Snake {
    /**
     * Constructor
     * @param {integer} snakeSize
     */
    constructor(snakeSize) {
        this.snakeSize = snakeSize;
        this.snake = [];
    }

    /**
     * Inialise snake with start value
     */
    init() {
        for (let i = 0; i < this.snakeSize; i++) {
            this.snake[i] = {x: i, y: 0};
        }
    }
}

/**
 * Keyboard class
 */
class Keyboard {
    /**
     * Constructor
     */
    constructor() {
        this.keyboardEvent();
    }
    /**
     * Keyboard event for snake direction
     */
    keyboardEvent() {
        window.addEventListener('keydown', (event) => {
            if (event.defaultPrevented) {
                return;
            }
            this.key = event.which;
        });
    }

    /**
     * Getter
     * @return {integer} key
     */
    getKey() {
        return this.key;
    }
    /**
     * Setter
     * @param {integer} value
     */
    setKey(value) {
        this.key = value;
    }
}

window.onload = () => {
    let game = new Game();
    game.run();
};
