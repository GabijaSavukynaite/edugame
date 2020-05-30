// Put this file in path/to/plugin/amd/src
// You can call it anything you like
require.config({
    paths: {
        "Phaser": "https://cdnjs.cloudflare.com/ajax/libs/phaser/3.22.0/phaser.min"
    }
});

// https://phaser.discourse.group/t/is-it-possible-to-use-phaser-3-with-amd-requirejs-and-typescript/2961/5

define(['Phaser', 'jquery', 'core/yui', 'core/notification', 'core/ajax'], function (Phaser, $, Y, notification, ajax) {

    return {
        init: function (q, qid) {

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
                scene: {
                    preload: preload,
                    create: create,
                    update: update
                },
                parent: "mod_edugame_game"
            };

            new Phaser.Game(config);

            var questions = q;
            var edugameId = qid;
            var clouds;
            var player;
            var cursors;
            var score = 0;
            var scoreText;
            //var questionText;
            var answersText = [];
            //var level = 1;


            // var questions = [
            //     {
            //         question: "klausimas1 ", answers: [
            //             { answer: "atsakymas1" },
            //             { answer: "atsakymas2" },
            //             { answer: "atsakymas3" }
            //         ]
            //     },
            //     {
            //         question: "klausimas2 ", answers: [
            //             { answer: "atsakymas4" },
            //             { answer: "atsakymas5" },
            //             { answer: "atsakymas6" }
            //         ]
            //     },
            //     {
            //         question: "klausimas3 ", answers: [
            //             { answer: "atsakymas7" },
            //             { answer: "atsakymas8" },
            //             { answer: "atsakymas9" }
            //         ]
            //     }
            // ]

            function preload() {
                this.load.image('sky', 'pix/Background.png');
                this.load.image('cloud', 'pix/gui/cloud.png');
                this.load.multiatlas('player', 'pix/runner2.json', 'pix');
            }

            function create() {
                this.add.image(400, 300, 'sky');

                clouds = this.physics.add.staticGroup();

                var position = 50;
                for (var i = 0; i < questions[0].answers.length; i++) {
                    clouds.create(position, 50, 'cloud');
                    answersText.push(this.add.text(position, 0, questions[0].answers[i].answer,
                        { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }));
                    position += 280;
                }

                player = this.physics.add.sprite(100, 450, 'player', 'character/run/05.png');

                player.setBounce(0.2);
                player.setCollideWorldBounds(true);

                // questionText = this.add.text(0, 0, questions[0].question,
                //     { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });


                const frameNames = [
                    { key: 'player', frame: 'character/run/05.png' },
                    { key: 'player', frame: 'character/run/01.png' },
                    { key: 'player', frame: 'character/run/02.png' },
                    { key: 'player', frame: 'character/run/03.png' },
                    { key: 'player', frame: 'character/run/04.png' },
                    { key: 'player', frame: 'character/run/05.png' },
                ];
                this.anims.create({ key: 'walk', frames: frameNames, frameRate: 20 });
                this.physics.add.overlap(player, clouds, touchCloud, null, this);
                scoreText = this.add.text(16, 16, 'score: 4', { fontSize: '32px', fill: '#000' });
            }

            function update() {
                cursors = this.input.keyboard.createCursorKeys();
                if (cursors.left.isDown) {
                    player.setFlipX(true);
                    player.setVelocityX(-200);
                    player.anims.play('walk', true);

                }
                else if (cursors.right.isDown) {
                    player.setFlipX(false);
                    player.setVelocityX(200);
                    player.anims.play('walk', true);
                }
                else {
                    player.setVelocityX(0);
                }

                if (cursors.up.isDown && player.body.blocked.down) {
                    player.setVelocityY(-730);
                }
            }

            function touchCloud(player, cloud) {
                console.log("touchCloud"); // eslint-disable-line no-console
                cloud.disableBody(true, true);

                score += 15;
                scoreText.setText('Score: ' + score);
                // level++;
                // if (level > questions.length) {
                endGame();
                // }
                // else {
                //     questionText = this.add.text(0, 0, questions[level - 1].question,
                // { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
                //     for (var i in answersText) {
                //         answersText[i].destroy();
                //     }
                //     answersText = []
                //     var position = 50
                //     for (var i in questions[level - 1].answers) {
                //         answersText.push(this.add.text(position, 0, questions[level - 1].answers[i].answer,
                // { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }))
                //         position += 280
                //     }
                // }
            }

            function endGame() {
                console.log("endGame id: " + edugameId);// eslint-disable-line no-console
                ajax.call([{
                    methodname: 'mod_edugame_add_score',
                    args: { edugameid: edugameId, score: score },
                    fail: notification.exception
                }]);
            }

        }
    };
});