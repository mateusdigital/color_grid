//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : ColorGrid.js                                                  //
//  Project   : color_grid                                                    //
//  Date      : Aug 15, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//   Just a simple Color Grid game...                                         //
//---------------------------------------------------------------------------~//


//----------------------------------------------------------------------------//
// Globals                                                                    //
//----------------------------------------------------------------------------//

let palette;
let board;


//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Setup()
{
    palette = new Palette();
    board = new Board(-100, -100, 200, 200, 10, 10, 2);
}

//------------------------------------------------------------------------------
function Draw(dt)
{
    Canvas_ClearWindow("#030303");

    board.update(dt);
    board.draw();
}


//----------------------------------------------------------------------------//
// Input                                                                      //
//----------------------------------------------------------------------------//
function MouseDown()
{
    mouseIsDown = true;
    mouseClick = false;
}

function MouseUp()
{
    mouseIsDown  = false;
    mouseIsClick = false;
}

function MouseClick()
{
    mouseClick = true;
    board.click();
}


Canvas_Setup({
    main_title        : "Simple Snake",
    main_date         : "Aug 10, 2019",
    main_version      : "v0.0.1",
    main_instructions : "<br><b>arrow keys</b> to move the snake<br><b>R</b> to start a new game.",
    main_link: "<a href=\"http://stdmatt.com/demos/startfield.html\">More info</a>"
});

//----------------------------------------------------------------------------//
// Entry Point                                                                //
//----------------------------------------------------------------------------//
