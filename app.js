let canvas = document.querySelector('#canvas-background-animation');

class NoiseAnimation {

    constructor(canvas, fullScreen = false) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');

        if(fullScreen)
        {
            this.canvas.height = window.innerHeight;
            this.canvas.width = window.innerWidth;
        }

        this.render();
    }

    getCtx()
    {
        return this.ctx;
    }

    clearCanvas()
    {
        this.getCtx().clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    validValue(val, max, min = 0)
    {
        return (val < max && val > min);
    }

    getRandomValue(r, max)
    {
        return Math.min(Math.random() * max, max - r);
    }

    getRandomNoise(defaultValue, maxNoiseValue = 1)
    {
        return defaultValue + ((Math.random() * (maxNoiseValue * 2)) - maxNoiseValue);
    }

    getValidRandomNoise(val, valChange, max, maxSpeed = 2)
    {
        let randomNoise = this.getRandomNoise(valChange);

        randomNoise = Math.max(Math.min(randomNoise, maxSpeed), -maxSpeed);

        if(!this.validValue(val + randomNoise, max))
            randomNoise = -randomNoise;

        return randomNoise;
    }

    makeRandomCircles(r = 4, count = 200)
    {
        let shapes = [];

        for(let i = 0;i < count;i++)
        {
            let shape = {
                type: 'circle',
                x: this.getRandomValue(r, this.canvas.width),
                y: this.getRandomValue(r, this.canvas.height),
                xChange: 0,
                yChange: 0,
                r: this.getRandomNoise(r) * 10,
            };

            shapes.push(shape);
        }

        return shapes;
    }

    drawCircle(shape)
    {
        this.getCtx().beginPath();
        this.getCtx().fillStyle = 'black';
        this.getCtx().arc(shape.x, shape.y, shape.r, 0, 2 * Math.PI);
        this.getCtx().fill();
    }

    drawShapes(shapes = this.shapes)
    {
        shapes.forEach(shape => {
            switch (shape.type) {
                case ('circle'):
                    this.drawCircle(shape);
                    break;
                default:
                    break;
            };
        });
    }

    noiseLocationUpdateCircles(shapes)
    {
        shapes.forEach((shape, i) => {
            shape.x += shape.xChange;
            shape.y += shape.yChange;

            shape.xChange = this.getValidRandomNoise(shape.x, shape.xChange, this.canvas.width);
            shape.yChange = this.getValidRandomNoise(shape.y, shape.yChange, this.canvas.height);

            shapes[i] = shape;
        });

        return shapes;
    }

    render(timeFrame = 40)
    {
        this.shapes = this.makeRandomCircles();

        let renderTimeFrame = setInterval(() => {
            this.clearCanvas();

            this.shapes = this.noiseLocationUpdateCircles(this.shapes);

            this.drawShapes();
        }, timeFrame);
    }

}

function startPageAnimations()
{
    new NoiseAnimation(canvas, true);
}

startPageAnimations();