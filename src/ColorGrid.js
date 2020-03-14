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
let optionsPanel  = null;

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

    const canvas_min_size   = Math_Min(Canvas_Width, Canvas_Height);
    const status_hud_height = 50;
    const colors_hud_height = status_hud_height + 20;
    const huds_total_height = (status_hud_height + colors_hud_height);
    const board_gap_to_hud  = 30;
    let   board_size        = 0;

    // Calculate the max board size, so it will fit on the screen no
    // matter the resolution of the game.
    // Landscape
    if(Canvas_Width > Canvas_Height) {
        board_size = canvas_min_size - huds_total_height;
    }
    // Portrait
    else {
        board_size = canvas_min_size;
    }
    board_size -= board_gap_to_hud;
    const board_half_size = (board_size * 0.5);

    statusHud = new StatusHud(
        -Canvas_Half_Width,
        Canvas_Edge_Top,
        Canvas_Width,
        status_hud_height,
    );

    board = new Board(
        -board_half_size,
        -board_half_size,
        board_size,
        board_size,
        gameOptions.gridRows,
        gameOptions.gridCols,
        gameOptions.colorsCount
    );

    colorSelector = new ColorSelectorHud(
        -Canvas_Half_Width,
        Canvas_Edge_Bottom - colors_hud_height,
        Canvas_Width,
        colors_hud_height,
        gameOptions.colorsCount
    );

    optionsPanel = new OptionsPanel();
    statusHud.updateMovesCount();
}

//------------------------------------------------------------------------------
function ShowOptionsPanel()
{
    optionsPanel.show();
}

//------------------------------------------------------------------------------
function InitializeCanvas()
{
    //
    // Configure the Canvas.
    const parent        = document.getElementById("canvas_div");
    const parent_width  = parent.clientWidth;
    const parent_height = parent.clientHeight;

    const max_side = Math_Max(parent_width, parent_height);
    const min_side = Math_Min(parent_width, parent_height);

    const ratio = min_side / max_side;

    // Landscape
    if(parent_width > parent_height) {
        Canvas_CreateCanvas(800, 800 * ratio, parent);
    }
    // Portrait
    else {
        Canvas_CreateCanvas(800 * ratio, 800, parent);
    }

    Canvas.style.width  = "100%";
    Canvas.style.height = "100%";

    //
    // Add information.
    // const info = document.createElement("p");
    // info.innerHTML = String_Cat(
    //     PROJECT_TITLE,
    //     PROJECT_DATE,
    //     PROJECT_VERSION,
    //     PROJECT_INSTRUCTIONS,
    //     PROJECT_LINK,
    // )
    // parent.appendChild(info);
}

//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
async function Setup()
{
    InitializeCanvas();
    Random_Seed(null);
    Input_InstallBasicMouseHandler(Canvas);

    //
    // Load the textures - Game can't run without it...
    let loaded_textures = await LoadTextures(
        "./res/icon_cog.png",
        "./res/icon_reset.png"
    );
    textureCog   = loaded_textures["./res/icon_cog.png"];
    textureReset = loaded_textures["./res/icon_reset.png"];
    loaded       = true;

    //
    // Create the Game.
    gameOptions = new GameOptions();
    ResetGame();

    //
    // Start the rendering loop.
    Canvas_Start();
}

//------------------------------------------------------------------------------
function Draw(dt)
{
    if(!loaded) {
        return;
    }
    Canvas_ClearWindow(palette.getBackgroundColor());

    if(optionsPanel.isAnimating || optionsPanel.isVisible) {
        optionsPanel.update(dt);
    } else {
        colorSelector.update(dt);
        statusHud    .update(dt);
        board        .update(dt);
    }

    colorSelector.draw();
    statusHud    .draw();
    board        .draw();
    optionsPanel .draw();

    if(board.isDone) {
        ResetGame();
    }

    // @XXX(stdmatt): This is a extremely ugly hack that we need to do
    // because we don't ahve proper input handling in the mcow_js_core yet.
    // So we need to manually reset the state of the Mouse_IsClicked otherwise
    // it will remain clicked forever.
    Mouse_IsClicked = false;
}


// Canvas_Setup({
//     main_title        : "Simple Snake",
//     main_date         : "Aug 10, 2019",
//     main_version      : "v0.0.1",
//     main_instructions : "<br><b>arrow keys</b> to move the snake<br><b>R</b> to start a new game.",
//     main_link: "<a href=\"http://stdmatt.com/demos/startfield.html\">More info</a>"
// });

//----------------------------------------------------------------------------//
// Entry Point                                                                //
//----------------------------------------------------------------------------//
Setup();
