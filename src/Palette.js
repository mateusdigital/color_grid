//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : ColorSelectorHud.js                                           //
//  Project   : color_grid                                                    //
//  Date      : Aug 27, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//   Manages the current color scheme of the game.                            //
//---------------------------------------------------------------------------~//

//----------------------------------------------------------------------------//
// Palette                                                                    //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const PALETTE_INVALID_COLOR_INDEX = -1;

//------------------------------------------------------------------------------
class Palette
{
    //--------------------------------------------------------------------------
    constructor(colorsCount)
    {
        this.colors      = [];
        this.colorsCount = colorsCount;

        for(let i = 0; i < colorsCount; ++i) {
            let c = chroma.hsl(360 / colorsCount * i, 1, 0.5);
            this.colors.push(c);
        }
        this.colors.push(chroma("gray"));
    } // ctor

    //--------------------------------------------------------------------------
    getRandomIndex()
    {
        return Math_RandomInt(0, this.colorsCount);
    }

    //--------------------------------------------------------------------------
    getDefeatIndex()
    {
        return this.colorsCount;
    }

    //--------------------------------------------------------------------------
    getColor(i)
    {
        return this.colors[i];
    } // getColor
}; // class Palette
