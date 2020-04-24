// Put this file in path/to/plugin/amd/src
// You can call it anything you like
// require.config({
//     baseUrl: "src",
//     paths: {
//         "phaser": "../amd/build/phaser.min"
//     }
// });

define([], function () {

    return {
        init: function () {

            // Put whatever you like here. $ is available
            // to you as normal.
            //$(".someclass").change(function () {
            console.log("ok");
            alert("It changed!!");
            // });
            // var config = {
            //     type: Phaser.AUTO,
            //     width: 800,
            //     height: 600,
            //     scene: {
            //         preload: preload,
            //         create: create,
            //         update: update
            //     },
            //     parent: "mod_edugame_game"
            // };

            // new Phaser.Game(config);

            // function preload() {

            // }

            // function create() {
            // }

            // function update() {
            // }
        }
    };
});