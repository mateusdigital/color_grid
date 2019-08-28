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

    let color_count = 4;
    let width  = Canvas_Width - 20;
    let height = width;
    let rows = 20;
    let cols = 20;
    board         = new Board(-width/2, -height/2, width, height, rows, cols, color_count);
    colorSelector = new ColorSelectorHud(
        -Canvas_Width / 2, Canvas_Edge_Bottom - 50,
        Canvas_Width,      50,
        color_count
    );
}


//------------------------------------------------------------------------------
function Draw(dt)
{
    Canvas_ClearWindow("#030303");

    colorSelector.update(dt);
    board.update(dt);

    if(colorSelector.hoveredColorIndex != colorSelector.previousHoveredColorIndex) {
        board.previewFloodFill(colorSelector.hoveredColorIndex);
    }

    board.draw();
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
    if(colorSelector.hoveredColorIndex != PALETTE_INVALID_COLOR_INDEX) {
        board.changeColor(colorSelector.hoveredColorIndex);
    }
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
