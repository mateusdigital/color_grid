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
    board = new Board(
        -gameOptions.gridWidth/2,  -gameOptions.gridHeight/2,
         gameOptions.gridWidth,     gameOptions.gridHeight,
         gameOptions.gridRows,      gameOptions.gridCols,
         gameOptions.colorsCount
    );

    colorSelector = new ColorSelectorHud(
        -Canvas_Width / 2,  Canvas_Edge_Bottom - 60,
         Canvas_Width,      50,
         gameOptions.colorsCount
    );

    statusHud.updateMovesCount();
}

//------------------------------------------------------------------------------
function ShowOptionsPanel()
{
    optionsPanel.show();
}

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
    loaded = true;

    //
    // Create the objects that are need to be created only once.
    gameOptions = new GameOptions();
    statusHud   = new StatusHud(
        -Canvas_Width / 2, Canvas_Edge_Top,
         Canvas_Width,     50,
    );

    //
    // Create the objects that depends on options...
    ResetGame();
    optionsPanel = new OptionsPanel();

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
    optionsPanel.draw();

    if(board.isDone) {
        ResetGame();
    }
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
