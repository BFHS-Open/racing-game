import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        this.load.image('background', 'assets/bg.webp');
        this.load.image('map', 'assets/map.webp');
        this.load.image('car', 'assets/car.png');
        this.load.image('piratecat', 'assets/piratecat.webp');
        this.load.image('coin', 'assets/coin.webp');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
