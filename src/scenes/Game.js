import { Scene } from 'phaser';

export class Game extends Scene
{

    constructor ()
    {
        super('Game');

        this.car = null;
        this.cursors = null;
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

        this.cameras.main.setBounds(0, 0, this.map.width, this.map.height);
        this.cameras.main.startFollow(this.car, true);
        this.cameras.main.setZoom(2);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.createBoundaries();
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
    }
}
