// Put this file in path/to/plugin/amd/src
// You can call it anything you like
require.config({
    paths: {
        "Phaser": "https://cdnjs.cloudflare.com/ajax/libs/phaser/3.22.0/phaser.min"
    }
});

define(['Phaser', 'jquery', 'core/yui', 'core/notification', 'core/ajax'], function (Phaser, $, Y, notification, ajax) {

    return {
        init: function (q, qid) {

            class Cloud extends Phaser.Physics.Arcade.Sprite {
                constructor(scene, x, y, fraction, index) {
                    super(scene, x, y, fraction, index);
                    this.fraction = fraction;
                    this.index = index;

                    this.setTexture('cloud');
                    this.setPosition(x, y);
                    scene.add.existing(this);
                    scene.physics.add.existing(this, true);

                }
            }

            class GameScreen extends Phaser.Scene {
                constructor(data) {
                    super('GameScreen');
                    this.questions;
                    this.edugameId;
                    this.clouds;
                    this.ground;
                    this.player;
                    this.cursors;
                    this.score = 0;
                    this.scoreText;
                    this.questionText;
                    this.answersText = [];
                    this.level = 1;
                    this.corretMultipleAnswers = [];
                    this.showNewQuestion = false;
                    this.collider
                }
                init(data) {
                    this.questions = data.questions;
                    this.edugameId = data.edugameId;
                }

                preload() {

                }

                create() {
                    this.score = 0;
                    this.answersText = [];
                    this.level = 1;
                    this.corretMultipleAnswers = [];
                    this.showNewQuestion = false;
                    this.add.image(400, 300, 'sky');

                    this.clouds = this.add.group();
                    this.ground = this.add.sprite(400, 555, 'dirt')
                    this.physics.add.existing(this.ground, true);

                    this.player = this.physics.add.sprite(100, 400, 'player', 'character/idle.png');

                    this.player.setBounce(0.2);
                    this.player.setCollideWorldBounds(true);
                    var frameNames = this.anims.generateFrameNames('player', { start: 0, end: 17, prefix: 'character/', suffix: '.png' });
                    this.anims.create({
                        key: 'walk',
                        frames: frameNames,
                        frameRate: 20
                    });
                    this.anims.create({
                        key: 'idle',
                        frames: [{ key: 'player', frame: 'character/idle.png' }],
                        frameRate: 20
                    });
                    this.anims.create({
                        key: 'jump',
                        frames: [{ key: 'player', frame: 'character/jump.png' }],
                        frameRate: 20
                    });
                    console.log(JSON.stringify(this.questions))
                    this.physics.add.collider(this.player, this.ground);
                    //this.physics.add.overlap(this.player, this.clouds, this.touchCloud, null, this);
                    this.questionText = this.add.text(16, 530, this.questions[this.level - 1].question, { fontSize: "25px", fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
                    this.scoreText = this.add.text(16, 580, 'Rezultatas: 0', { fontSize: '20px', fill: '#fff' });

                    var gap = 800 / this.questions[this.level - 1].answers.length
                    var position = gap / 2;
                    if (this.questions[this.level - 1].type == 'truefalse') {
                        this.clouds.add(new Cloud(this, position, 50, this.questions[0].answers[0].fraction, 0))
                        this.answersText.push(
                            this.add.text(position, 50, this.questions[0].answers[0].text == "True" ? "Tiesa" : "Netiesa",
                                { fontSize: 25, fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setOrigin(0.5),

                        );
                        position += gap;
                        this.clouds.add(new Cloud(this, position, 50, this.questions[0].answers[1].fraction, 1))
                        this.answersText.push(
                            this.add.text(position, 50, this.questions[0].answers[1].text == "True" ? "Tiesa" : "Netiesa",
                                { fontSize: 25, fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setOrigin(0.5),
                        );
                    }
                    else {
                        var i;
                        for (i = 0; i < this.questions[this.level - 1].answers.length; i++) {
                            this.clouds.add(new Cloud(this, position, 50, this.questions[this.level - 1].answers[i].fraction, i))
                            var text = this.add.text(position, 50, this.questions[this.level - 1].answers[i].text, { fontSize: "25px", fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' })
                            text.setOrigin(0.5);
                            this.answersText.push(text)

                            if (this.questions[this.level - 1].answers[i].fraction > 0) {
                                this.corretMultipleAnswers.push(i);
                            }
                            position += gap;
                        }
                    }
                }
                update() {
                    this.cursors = this.input.keyboard.createCursorKeys();
                    if (this.cursors.left.isDown) {
                        this.player.setFlipX(true);
                        this.player.setVelocityX(-200);
                        this.player.anims.play('walk', true);

                    }
                    else if (this.cursors.right.isDown) {
                        this.player.setFlipX(false);
                        this.player.setVelocityX(200);
                        this.player.anims.play('walk', true);
                    }
                    else if (this.cursors.up.isDown) {
                        this.player.anims.play('jump', true);
                        if (this.player.body.blocked.down) {
                            this.player.setVelocityY(-600);
                        }
                    }
                    else {
                        this.player.setVelocityX(0);
                        this.player.anims.play('idle', true);
                    }

                    if (this.showNewQuestion) {
                        this.showNewQuestion = false;


                        this.time.addEvent({
                            delay: 1000,
                            callback: () => {
                                this.clouds.clear(true, true);
                                this.questionText.setText(this.questions[this.level - 1].question);
                                for (var i in this.answersText) {
                                    this.answersText[i].destroy();
                                }
                                this.answersText = [];
                                this.corretMultipleAnswers = [];

                                var gap = 800 / this.questions[this.level - 1].answers.length
                                var position = gap / 2;
                                if (this.questions[this.level - 1].type == 'truefalse') {
                                    this.clouds.add(new Cloud(this, position, 50, this.questions[0].answers[0].fraction, 0))
                                    this.answersText.push(
                                        this.add.text(position, 50, this.questions[0].answers[0].text == "True" ? "Tiesa" : "Netiesa",
                                            { fontSize: 25, fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setOrigin(0.5),
                                    );
                                    position += gap;
                                    this.clouds.add(new Cloud(this, position, 50, this.questions[0].answers[1].fraction, 1))
                                    this.answersText.push(
                                        this.add.text(position, 50, this.questions[0].answers[1].text == "True" ? "Tiesa" : "Netiesa",
                                            { fontSize: 25, fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setOrigin(0.5),
                                    );
                                }
                                else {
                                    var i;
                                    for (i = 0; i < this.questions[this.level - 1].answers.length; i++) {
                                        this.clouds.add(new Cloud(this, position, 50, this.questions[this.level - 1].answers[i].fraction, i))
                                        var text = this.add.text(position, 50, this.questions[this.level - 1].answers[i].text, { fontSize: "25px", fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' })
                                        text.setOrigin(0.5);
                                        this.answersText.push(text)

                                        if (!this.questions[this.level - 1].single) {
                                            if (this.questions[this.level - 1].answers[i].fraction > 0) {
                                                this.corretMultipleAnswers.push(i);
                                            }
                                        }
                                        position += gap;
                                    }
                                }
                                this.clouds.enableBody = true;
                                // if (this.collider != null) {
                                //     this.collider.destroy();
                                // }
                            },
                            loop: false
                        })
                    }

                    this.collider = this.physics.add.overlap(this.player, this.clouds, function (player, cloud) {
                        var fraction = parseFloat(cloud.fraction);
                        this.answersText[cloud.index].destroy()
                        this.score = (parseFloat(this.score) + fraction).toFixed(2);
                        cloud.destroy(true, true);
                        this.scoreText.setText('Rezultatas: ' + this.score);
                        if (fraction > 0) {
                            if (this.questions[this.level - 1].type == "multichoice" && this.corretMultipleAnswers.length > 1) {
                                var answerIndex = this.corretMultipleAnswers.findIndex(answerIndex => answerIndex == cloud.index);
                                this.corretMultipleAnswers = this.corretMultipleAnswers.splice(answerIndex, 1);
                            }
                            else {
                                if (this.level >= this.questions.length) {
                                    this.endGame();
                                }
                                else {
                                    this.level++;
                                    this.showNewQuestion = true;
                                }
                            }
                        }

                        // if (this.corretMultipleAnswers.length > 1) {
                        //     var answerIndex = this.corretMultipleAnswers.findIndex(answerIndex => answerIndex == cloud.index);
                        //     this.corretMultipleAnswers = this.corretMultipleAnswers.splice(answerIndex, 1);
                        // }
                        // else {
                        //     this.level++;
                        //     this.showNewQuestion = true;
                        // }
                        // if (this.questions[this.level - 1].type == "multichoice" && this.corretMultipleAnswers.length > 0 && cloud.fraction > 0) {
                        //     if (this.corretMultipleAnswers.length == 1) {
                        //         this.level++;
                        //         this.showNewQuestion = true;
                        //     }
                        //     else {
                        //         var answerIndex = this.corretMultipleAnswers.findIndex(answerIndex => answerIndex == cloud.index);
                        //         this.corretMultipleAnswers = this.corretMultipleAnswers.splice(answerIndex, 1);
                        //     }
                        // }
                        // else {
                        //     console.log("collider level " + this.level)
                        //     if (this.level >= this.questions.length) {
                        //         this.endGame();
                        //     }
                        //     else {
                        //         this.level++;
                        //         this.showNewQuestion = true;
                        //     }
                        // }
                    }, null, this)
                }

                // touchCloud(player, cloud) {
                //     this.answersText[cloud.index].destroy()
                //     this.score += parseFloat(cloud.fraction);
                //     cloud.destroy();
                //     this.scoreText.setText('Rezultatas: ' + this.score);
                //     if (this.corretMultipleAnswers.length > 1) {
                //         var answerIndex = this.corretMultipleAnswers.findIndex(answerIndex => answerIndex == cloud.index);
                //         this.corretMultipleAnswers = this.corretMultipleAnswers.splice(answerIndex, 1);
                //     }
                //     else {
                //         this.showNewQuestion = true;
                //     }
                //     if (this.questions[this.level - 1].type == "multichoice" && this.corretMultipleAnswers.length > 0 && cloud.fraction > 0) {
                //         if (this.corretMultipleAnswers.length == 1) {
                //             this.showNewQuestion = true;
                //         }
                //         else {
                //             var answerIndex = this.corretMultipleAnswers.findIndex(answerIndex => answerIndex == cloud.index);
                //             this.corretMultipleAnswers = this.corretMultipleAnswers.splice(answerIndex, 1);
                //         }
                //     }

                //     else {
                //         console.log("level " + this.level + " " + this.questions.length)
                //         if (this.level >= this.questions.length) {
                //             this.endGame();
                //         }
                //         else {
                //             this.showNewQuestion = true;
                //         }
                //     }
                // }

                endGame() {
                    var grade;
                    if (this.score > 0) {
                        grade = this.score * 10 / this.questions.length;
                        grade = Math.round(grade);
                    }
                    ajax.call([{
                        methodname: 'mod_edugame_add_score',
                        args: { edugameid: this.edugameId, score: Math.trunc(grade) },
                        fail: notification.exception
                    }]);
                    this.scene.start('ResultScreen',
                        {
                            questions: this.questions,
                            edugameId: this.edugameId,
                            score: grade
                        })
                }
            }

            class StartScreen extends Phaser.Scene {
                constructor() {
                    super('StartScreen');
                }

                preload() {
                    this.load.image('startGameButton', 'pix/gui/startGameIcon.png');
                    this.load.image('sky', 'pix/background.png');
                    this.load.image('cloud', 'pix/cloud.png');
                    this.load.multiatlas('player', 'pix/character.json', 'pix');
                    this.load.image('dirt', 'pix/dirt.png');
                }

                create(data) {
                    var button = this.add.image(400, 300, 'startGameButton')
                    button.setInteractive();
                    this.input.on('pointerup', function (pointer) {
                        this.scene.start('GameScreen', data);
                    }, this);
                }

                update() {

                }

            }

            class ResultScreen extends Phaser.Scene {
                constructor() {
                    super('ResultScreen');
                    this.score;
                    this.questions;
                    this.edugameId;
                }

                init(data) {
                    this.score = data.score;
                    this.questions = data.questions;
                    this.edugameId = data.edugameId;
                }

                preload() {

                }

                create() {
                    var resultText = this.add.text(400, 250, 'Rezultatas: ' + this.score, { fontSize: "25px", fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
                    resultText.setOrigin(0.5);
                    var button = this.add.image(400, 300, 'startGameButton');
                    button.setInteractive();
                    this.input.on('pointerup', function (pointer) {
                        this.scene.start('GameScreen',
                            {
                                questions: this.questions,
                                edugameId: this.edugameId,
                            });
                    }, this);
                }

                update() {

                }

            }

            var config = {
                type: Phaser.AUTO,
                width: 800,
                height: 600,
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { y: 300 },
                        debug: false
                    }
                },
                scene: [StartScreen, GameScreen, ResultScreen],
                parent: "mod_edugame_game"
            };

            const game = new Phaser.Game(config);
            game.scene.start('StartScreen', {
                questions: q,
                edugameId: qid
            })

        }
    };
});