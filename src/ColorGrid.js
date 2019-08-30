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
let gameOptions   = null;
let palette       = null;
let board         = null;
let colorSelector = null;
let statusHud     = null;

let textureCog   = null;
let textureReset = null;
let loaded       = false;


//----------------------------------------------------------------------------//
// Helper Functions                                                           //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function ResetGame()
{
    palette = new Palette(gameOptions.colorsCount);

    board = new Board(
        -gameOptions.gridWidth/2,  -gameOptions.gridHeight/2,
         gameOptions.gridWidth,     gameOptions.gridHeight,
         gameOptions.gridRows,      gameOptions.gridCols,
         gameOptions.colorsCount
    );

    colorSelector = new ColorSelectorHud(
        -Canvas_Width / 2,  Canvas_Edge_Bottom - 50,
         Canvas_Width,      50,
         gameOptions.colorsCount
    );
}

//------------------------------------------------------------------------------

//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
async function Setup()
{
    //
    // Load the textures - Game can't run without it...
    let loaded_textures = await LoadTextures(
        "./res/icon_cog.png",
        "./res/icon_reset.png"
    );
    textureCog   = loaded_textures["./res/icon_cog.png"];
    textureReset = loaded_textures["./res/icon_reset.png"];
    loaded = true;

    //
    // Create the objects that are need to be created only once.
    gameOptions = new GameOptions();
    statusHud   = new StatusHud(
        -Canvas_Width / 2, Canvas_Edge_Top,
         Canvas_Width,      50,
    );

    //
    // Create the objects that depends on options...
    ResetGame();
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
    Log("Mouse Click");
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
