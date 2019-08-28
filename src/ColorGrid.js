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
let colorSelector;


//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Setup()
{
    palette = new Palette();

    // let color_count = 8;
    board         = new Board(-100, -100, 200, 200, 10, 10, color_count);


}
let color_count = 2;
//------------------------------------------------------------------------------
function Draw(dt)
{
    Canvas_ClearWindow("#030303");

    board.update(dt);
    board.draw();


    colorSelector = new ColorSelectorHud(
        -Canvas_Width / 2, Canvas_Edge_Bottom - 50,
        Canvas_Width,      50,
        color_count
    );

    colorSelector.update(dt);
    colorSelector.draw();
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
