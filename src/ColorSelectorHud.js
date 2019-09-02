//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : ColorSelectorHud.js                                           //
//  Project   : color_grid                                                    //
//  Date      : Aug 28, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//   Implements the bottom hud to change the colors in game.                  //
//---------------------------------------------------------------------------~//

//------------------------------------------------------------------------------
class ColorSelectorHud
{
    //--------------------------------------------------------------------------
    constructor(x, y, w, h, colorsCount)
    {
        this.position    = Vector_Create(x, y);
        this.size        = Vector_Create(w, h);
        this.colorsCount = colorsCount;

        this.colorButtons = []
        this._createColorBlocks();
    } // ctor

    //--------------------------------------------------------------------------
    update(dt)
    {
        for(let i = 0; i < this.colorButtons.length; ++i) {
            let b = this.colorButtons[i];
            b.update(dt);
        }
    }

    //--------------------------------------------------------------------------
    draw()
    {
        Canvas_Push();
            Canvas_Translate(this.position.x, this.position.y);
            // Canvas_SetFillStyle("magenta");
            // Canvas_FillRect(0, 0, this.size.x, this.size.y);

            for(let i = 0; i < this.colorButtons.length; ++i) {
                let b = this.colorButtons[i];
                b.draw();
            }
        Canvas_Pop();
    } // draw

    //--------------------------------------------------------------------------
    _createColorBlocks()
    {
        let gap  = 10;
        let size = Vector_Create(this.size.y - gap, this.size.y - gap);

        for(let i = 0; i < this.colorsCount; ++i) {
            let c = CreateContext(size.x, size.y);
            Canvas_SetRenderTarget(c);
                Canvas_SetFillStyle("white");
                Canvas_FillRoundedRect(0, 0, size.x, size.y, 10);
            Canvas_SetRenderTarget(null);


            let px    = 1 / (this.colorsCount + 1);
            let rx    = px * (i+1);
            let pos_x = (rx * this.size.x) - (size.x / 2);

            let b = new UIButton(
                c,
                palette.getColor(i),
                palette.getColor(i).darken(1),
                palette.getColor(i).darken(2),
                Vector_Create(pos_x, gap/2),
                size,
                ()=>{
                    // @NOTE(stdmat): JS is such a messy language, but I
                    // like to be able to do this... Is cheesy but I liked ;D
                    board.changeColor(i);
                }
            );
            this.colorButtons.push(b);
        }
    } // _createColorBlocks
}; // class ColorSelectorHud
