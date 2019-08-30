//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : ColorGrid.js                                                  //
//  Project   : color_grid                                                    //
//  Date      : Aug 27, 2019                                                  //
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
let statusHud;

let textureCog   = null;
let textureReset = null;
let loaded       = false;


//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
async function Setup()
{
    let loaded_textures = await LoadTextures(
        "./res/icon_cog.png",
        "./res/icon_reset.png"
    );
    textureCog   = loaded_textures["./res/icon_cog.png"];
    textureReset = loaded_textures["./res/icon_reset.png"];
    loaded = true;

    let color_count = 5;
    let width  = Canvas_Width - 20;
    let height = width;
    let rows = 5;
    let cols = 5;

    palette = new Palette(color_count);

    board = new Board(
        -width/2,  -height/2,
         width,     height,
         rows,      cols,
         color_count
    );

    statusHud = new StatusHud(
        -Canvas_Width / 2, Canvas_Edge_Top,
        Canvas_Width,      50,
    );
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
    if(!loaded) {
        return;
    }

    colorSelector.update(dt);
    statusHud    .update(dt);
    board        .update(dt);

    colorSelector.draw();
    statusHud    .draw();
    board        .draw();
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
