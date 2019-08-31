//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Block.js                                                      //
//  Project   : color_grid                                                    //
//  Date      : Aug 27, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//   Represents a color block in the color grid field.                        //
//---------------------------------------------------------------------------~//


//------------------------------------------------------------------------------
class Block
{
    //--------------------------------------------------------------------------
    constructor(x, y, w, h, colorIndex)
    {
        this.position = Vector_Create(x, y);
        this.size     = Vector_Create(w, h);

        this.colorIndex       = palette.getDefeatIndex();
        this.targetColorIndex = colorIndex;

        this.timeToChangeColor    = 0;
        this.maxTimeToChangeColor = Math_Random(0, 1);
        this.changingColor        = false;

        this.isEntryColorChange = true;
        this.changeColor(this.targetColorIndex);
    } // ctor

    //--------------------------------------------------------------------------
    changeColor(colorIndex)
    {
        if(this.targetColorIndex == colorIndex && !this.isEntryColorChange) {
            return;
        }

        this.timeToChangeColor = 0;
        this.targetColorIndex  = colorIndex;
        this.changingColor     = true;
    } // changeColor

    //--------------------------------------------------------------------------
    update(dt)
    {
        if(!this.changingColor) {
            return;
        }

        this.timeToChangeColor += dt
        if(this.timeToChangeColor >= this.maxTimeToChangeColor) {
            this.timeToChangeColor = this.maxTimeToChangeColor;
            this.colorIndex        = this.targetColorIndex;
            this.changingColor      = false;

            if(this.isEntryColorChange) {
                this.isEntryColorChange = false;
                this.maxTimeToChangeColor = 0.5;
            }
        }
    } // update

    //--------------------------------------------------------------------------
    draw(colorPreviewRatio)
    {
        let w = this.size.x;
        let h = this.size.y;

        Canvas_Push();
            Canvas_Translate(
                (this.position.x * this.size.x) + this.size.x / 2,
                (this.position.y * this.size.y) + this.size.y / 2
            );

            let color = palette.getColor(this.targetColorIndex);
            if(this.changingColor) {
                let srcColor = palette.getColor(this.colorIndex);
                let dstColor = color;

                color = chroma.mix(
                    srcColor,
                    dstColor,
                    this.timeToChangeColor / this.maxTimeToChangeColor
                );
            }

            Canvas_SetFillStyle(color);
            Canvas_FillRoundedRect(-w/2, -h/2, w-1, h-1, w/4);
        Canvas_Pop();
    } // draw
}; // class Block
