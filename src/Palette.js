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

        // for(let i = 0; i < colorsCount; ++i) {
        //     let c = chroma.hsl(360 / colorsCount * i, 1, 0.5);
        //     this.colors.push(c);
        // }

        this._getPaletteColors();
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


    //--------------------------------------------------------------------------
    _getPaletteColors()
    {
        let palettes = [

            // [ "#FF9671", "#E57B89", "#B56D97", "#7D6592", "#4B597A", "#2F4858",]
            ["#FF9671", "#F27D88", "#D26F9D", "#A36AAA", "#6967A9", "#1B6299"],
            ["#7D90F2", "#E089E4", "#FF8ABC", "#FFA38D", "#FFCD6B", "#F9F871"]
        ];

        let pal_index = Math_RandomInt(0, palettes.length);
        let colors    = palettes[pal_index];
        for(let i = 0; i < colors.length; ++i) {
            let row   = colors[i];
            let color = chroma(row);
            this.colors.push(color);
        }

        this.colors.sort(() => Math.random() - 0.5);
    }
}; // class Palette
