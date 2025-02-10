import { Scene } from 'phaser';

let player;
let speed = 0;

export class Game extends Scene
{

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        player = this.add.rectangle(400, 300, 50, 100, 0x00ff00);

	this.physics.add.existing(player)
	player.body.setCollideWorldBounds(true);
        player.body.setBounce(20, 20);
        player.body.setSize(50, 100);
        player.body.setAllowRotation(true);
	player.body.setMaxSpeed(100);

        this.input.once('pointerdown', () => {
            this.scene.start('GameOver');
        });
    }

    update ()
    {
       let cursors = this.input.keyboard.createCursorKeys();

       if (cursors.left.isDown) {
           player.body.angularVelocity -= 3; 
       } 
       if (cursors.right.isDown) {
           player.body.angularVelocity += 3; 
       }

       if (cursors.up.isDown) {
          this.physics.velocityFromRotation(player.rotation - Math.PI / 2, speed += 10, player.body.velocity);
       } else if (cursors.down.isDown) {
          this.physics.velocityFromRotation(player.rotation - Math.PI / 2, speed += 10, player.body.velocity);
       } else {
           if (speed > 0) {
               speed = Math.max(0, speed - 0.5);
           } else if (speed < 0) {
               speed = Math.min(0, speed + 0.5);
           }
       }

       // Move the car based on its rotation
       this.physics.velocityFromRotation(player.rotation - Math.PI / 2, speed, player.body.velocity);

	console.log(speed);
    }
}
