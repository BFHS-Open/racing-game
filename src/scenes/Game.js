import { Math, Scene, Physics } from 'phaser';

const Matter = Physics.Matter.Matter;

export class Game extends Scene
{

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.matter.world.setBounds(0, 0, 800, 600);
        this.matter.world.setGravity(0, 0);

        this.map = this.add.image(0, 0, 'map');
        this.map.setOrigin(0);

        //this.car = this.add.rectangle(0, 0, 25, 15, 0x00ff00)
        //this.matter.add.gameObject(this.car);

        let body = this.matter.bodies.rectangle(25, 25, 15, 25);

        this.car = this.matter.add.sprite(25, 25, 'car', null);
        this.car.setScale(0.05);
        this.car.setExistingBody(body);
        this.car.setCollisionCategory(0x0001)

        this.cameras.main.setBounds(0, 0, this.map.width, this.map.height);
        this.cameras.main.startFollow(this.car, true);
        this.cameras.main.setZoom(2);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.score = 0;
        this.scoreText = this.add.text(675, 550, 'Score: 0', {
            fontFamily: 'Arial Black', fontSize: 14, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'center'
        }).setScrollFactor(0);

        this.time.addEvent({
            delay: 1000,
            callback: this.incrementScore,
            callbackScope: this,
            loop: true
        });

        this.enemies = this.add.group(); 
        this.coins = this.add.group(); 

        this.pirateTimer = 3000;
        this.coinTimer = 2000;

        this.spawnPirateCat();
        this.spawnCoins();

        this.createBoundaries();
    }

    incrementScore() {
        this.score++;
        this.scoreText.setText('Score: ' + this.score);
    }

    createBoundaries() {
        const walls = this.matter.world.setBounds(0, 0, this.map.width, this.map.height);
        
        this.matter.add.rectangle(290, 250, 130, 120, {
            isStatic: true,
        });

        this.matter.add.rectangle(230, 220, 100, 100, {
            isStatic: true,
        });

        this.matter.add.rectangle(350, 0, 350, 100, {
            isStatic: true,
        });

        this.matter.add.rectangle(350, 0, 150, 175, {
            isStatic: true,
        });

        this.matter.add.rectangle(325, 0, 250, 150, {
            isStatic: true,
        });

        this.matter.add.rectangle(325, 0, 100, 200, {
            isStatic: true,
        });

        this.matter.add.rectangle(0, 350, 100, 500, {
            isStatic: true,
        });

        this.matter.add.rectangle(0, 250, 170, 200, {
            isStatic: true,
        });

        this.matter.add.rectangle(450, 700, 1300, 200, {
            isStatic: true,
        });

        this.matter.add.rectangle(420, 700, 400, 250, {
            isStatic: true,
        });

        this.matter.add.rectangle(600, 0, 700, 75, {
            isStatic: true,
        });

        this.matter.add.rectangle(470, 450, 125, 125, {
            isStatic: true,
        });

        this.matter.add.rectangle(800, 450, 250, 175, {
            isStatic: true,
        });

        this.matter.add.rectangle(1200, 600, 450, 200, {
            isStatic: true,
        });

        this.matter.add.rectangle(1200, 0, 420, 300, {
            isStatic: true,
        });

        this.matter.add.rectangle(900, 0, 300, 200, {
            isStatic: true,
        });

        this.matter.add.rectangle(500, 200, 100, 100, {
            isStatic: true,
        });

        this.matter.add.rectangle(650, 130, 75, 75, {
            isStatic: true,
        });
    }

    spawnCoins() {
        let validSpot = false;
        let x, y;
        let attempts = 0;
        const maxAttempts = 100;

        while (!validSpot && attempts < maxAttempts) {
            x = Math.Between(50, this.map.width - 50);
            y = Math.Between(50, this.map.height - 50);

            // Create a candidate body (without adding it to the world)
            const candidate = Matter.Bodies.circle(x, y, 20, {
                isSensor: true,
                isStatic: true
            });

            // Check collisions against all bodies in the world
            const collisions = Matter.Query.collides(candidate, this.matter.world.localWorld.bodies);
            validSpot = (collisions.length === 0);
            attempts++;
        }

        if (validSpot) {
            const coin = this.add.circle(x, y, 10, 0xFFFF00);
            const coinBody = this.matter.add.circle(x, y, 10, {
                isSensor: true,
                isStatic: true
            });
            coin.setData('body', coinBody);
            coinBody.collisionGroup = -2;
            coinBody.gameObject = coin;
            this.coins.add(coin);
        }

        let newDelay = this.coinTimer - (this.score * 10);

        // Schedule the next pirate cat spawn:
        this.time.addEvent({
            delay: newDelay,
            callback: this.spawnCoins,
            callbackScope: this,
            loop: false
        });
    }

    spawnPirateCat() {
        const edge = Math.Between(0, 3);
        let x, y;
        
        switch(edge) {
            case 0: // Top
                x = Math.Between(0, this.map.width);
                y = -50;
                break;
            case 1: // Right
                x = this.map.width + 50;
                y = Math.Between(0, this.map.height);
                break;
            case 2: // Bottom
                x = Math.Between(0, this.map.width);
                y = this.map.height + 50;
                break;
            case 3: // Left
                x = -50;
                y = Math.Between(0, this.map.height);
                break;
        }

        const pirateCat = this.matter.add.sprite(x, y, 'piratecat', null, {
            frictionAir: 0,
            friction: 0,
            frictionStatic: 0,
            collisionFilter: {
                category: 0x0002,    // Set pirate cat's category
                mask: 0x0001         // Only collide with player (category 0x0001)
            }
        });
        pirateCat.setScale(0.1);
        pirateCat.setSensor(true);
        
        const angle = Math.Angle.Between(x, y, this.car.x, this.car.y);
        const randomDeviation = Math.DegToRad(Math.Between(-10, 10));
        const velocity = new Math.Vector2().setToPolar(angle + randomDeviation, Math.Between(2,4));
        
        pirateCat.setVelocity(velocity.x, velocity.y);
        this.enemies.add(pirateCat);

        let newDelay = this.pirateTimer - (this.score * 10);

        // Schedule the next pirate cat spawn:
        this.time.addEvent({
            delay: newDelay,
            callback: this.spawnPirateCat,
            callbackScope: this,
            loop: false
        });
    }

    handleCollision(car, other) {
        if (other.collisionGroup === -2) { // Coin collision
            this.score += 25;
            this.scoreText.setText('Score: ' + this.score);
            this.matter.world.remove(other);
            other.gameObject.destroy();
        } else if (other.gameObject && other.gameObject.texture.key === 'piratecat') {
            this.gameOver = true;
            this.scene.start('GameOver', { score: this.score });
        }
    }

    update ()
    {
        const driveForce = 0.0002;
        const turnRate = 0.05;

        // Forwards is -y
        const forward = this.matter.vector.rotate({ x: 0, y: -1 }, this.car.rotation);

        // Apply forwards force in the rotated forwards direction
        if (this.cursors.up.isDown) {
            this.car.applyForce(this.matter.vector.mult(forward, driveForce));
        } else if (this.cursors.down.isDown) {
            this.car.applyForce(this.matter.vector.mult(forward, -driveForce));
        }

        if (this.cursors.left.isDown) {
            this.car.setAngularVelocity(-turnRate);
        } else if (this.cursors.right.isDown) {
            this.car.setAngularVelocity(turnRate);
        } else {
            this.car.setAngularVelocity(0);
        } 

        const bodies = this.matter.world.localWorld.bodies;
        for (let i = 0; i < bodies.length; i++) {
            const body = bodies[i];
            if (this.matter.overlap(this.car.body, body)) {
                this.handleCollision(this.car, body);
            }
        }
    }
}
