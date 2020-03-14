//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : GameOptions.js                                                //
//  Project   : color_grid                                                    //
//  Date      : Aug 31, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//   Current game options.                                                    //
//---------------------------------------------------------------------------~//

//----------------------------------------------------------------------------//
// Game Options                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const GAME_OPTIONS_MIN_COLORS     = 3;
const GAME_OPTIONS_MAX_COLORS     = 6;
const GAME_OPTIONS_DEFAULT_COLORS = 4;

const GAME_OPTIONS_MIN_ROWS     =  5;
const GAME_OPTIONS_MAX_ROWS     = 20;
const GAME_OPTIONS_DEFAULT_ROWS = 10;

const GAME_OPTIONS_MIN_COLS     =  5;
const GAME_OPTIONS_MAX_COLS     = 20;
const GAME_OPTIONS_DEFAULT_COLS = 10;

const GAME_OPTIONS_DIFFICULTY_MODIFIER = 3.2;

//------------------------------------------------------------------------------
class GameOptions
{
    //--------------------------------------------------------------------------
    constructor()
    {
        // Colors
        this.colorsCount = GAME_OPTIONS_DEFAULT_COLORS;

        // Grid
        this.gridRows = GAME_OPTIONS_DEFAULT_ROWS;
        this.gridCols = GAME_OPTIONS_DEFAULT_COLS;

        // Difficulty
        this.DifficultyModifier = 3.2;

        // State
        this.isDirty = false;
    } // ctor


    //--------------------------------------------------------------------------
    applyOptions(colors, rows, cols)
    {
        if(colors != this.colorsCount) {
            this.colorsCount = colors;
            this.isDirty     = true;
        }

        if(rows != this.gridRows) {
            this.gridRows = rows;
            this.isDirty  = true;
        }

        if(cols != this.gridCols) {
            this.gridCols = cols;
            this.isDirty  = true;
        }
    } // applyOptions
}; // class GameOptions
