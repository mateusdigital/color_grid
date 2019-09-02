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

//------------------------------------------------------------------------------
class GameOptions
{
    //--------------------------------------------------------------------------
    constructor()
    {
        // Colors
        this.colorsCount = 4;

        // Grid
        this.gridWidth  = Canvas_Width - 20;
        this.gridHeight = this.gridWidth;
        this.gridRows   = 10;
        this.gridCols   = 10;

        // Difficulty
        this.DifficultyModifier = 3.2;
    } // ctor
}; // class GameOptions
