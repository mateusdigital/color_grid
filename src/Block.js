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

        this.isOwned   = false;
        this.isVictory = false;

        this.force = null;

        this.rotation       = 0;
        this.targetRotation = 0;
    } // ctor

    setVictory()
    {
        setTimeout(()=>{
            this.isVictory = true;
            let MX = 3;
            let x = Math_RandomInt(-MX, MX);
            let y = -90 //Math_RandomInt(-60, -60);

            this.force = Vector_Create(x, y);
            this.acc   = 30;
            this.rotation = Math_Map(x, -MX, +MX, -MATH_PI, MATH_PI);
            this.v = Vector_Create(0, 0);
        }, Math_RandomInt(200, 1200));
    }

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
        if(this.changingColor) {
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
        }

        if(this.isVictory) {
            // this.force.x *= 0.9;
            this.force.y *= 0.9;

            let acc = this.acc + this.force.y;
            this.v.x = this.force.x;
            this.v.y += acc * dt;

            this.position.x += this.v.x * dt;
            this.position.y += this.v.y * dt;
        }

    } // update

    //--------------------------------------------------------------------------
    draw(s)
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

            Canvas_Scale(s);
            Canvas_Rotate(this.rotation);

            Canvas_SetFillStyle(color);
            Canvas_FillRoundedRect(-w/2, -h/2, w-1, h-1, w/6);
        Canvas_Pop();
    } // draw
}; // class Block
