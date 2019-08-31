//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : UIText.js                                                     //
//  Project   : color_grid                                                    //
//  Date      : Aug 28, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//

//----------------------------------------------------------------------------//
class UIText
{
    //--------------------------------------------------------------------------
    constructor(str, position, fontSize, font)
    {
        this.str      = str;
        this.position = Vector_Copy(position);

        this.fontSize = fontSize;
        this.font     = font;
        this.fontStr  = String_Cat(fontSize, "pt ", font);

        Canvas_Push();
            CurrContext.font = this.fontStr;
            this.width  = CurrContext.measureText(str).width;
            this.height = parseInt(CurrContext.font);
        Canvas_Pop();
    } // ctor

    draw()
    {
        Canvas_Push();
            Canvas_Translate(this.position.x, this.position.y);
            CurrContext.font = this.fontStr;
            CurrContext.fillText(this.str, -this.width / 2, this.height / 2);
        Canvas_Pop();
    } // draw
}; // class Text
