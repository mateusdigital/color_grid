//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : UIButton.js                                                   //
//  Project   : color_grid                                                    //
//  Date      : Aug 31, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2019, 2020                                            //
//                                                                            //
//  Description :                                                             //
//   Implements a user interface button that can be                           //
//   interacted with the mouse.                                               //
//---------------------------------------------------------------------------~//

//------------------------------------------------------------------------------
class UIButton
{
    //--------------------------------------------------------------------------
    constructor(texture,
        srcColor, hoverColor, clickColor,
        position, size,
        callback)
    {
        this.texture    = texture;
        this.srcColor   = srcColor;
        this.hoverColor = hoverColor;
        this.clickColor = clickColor;
        this.currColor  = srcColor;

        this.position = Vector_Copy(position);
        this.size     = Vector_Copy(size);

        this.isMouseInside = false;

        this.callback = callback;
    } // ctor

    //--------------------------------------------------------------------------
    update(dt)
    {
        if(this.isMouseInside &&
           Mouse_IsClicked    &&
           !Utils_IsNullOrUndefined(this.callback))
        {
            this.callback(this);
        }
    } // update

    //--------------------------------------------------------------------------
    draw()
    {
        Canvas_Push();
            Canvas_Translate(this.position.x, this.position.y);

            // @XXX(stdmatt): Doing here because we don't have access to the
            // transform matrix on update method.
            this._updateMouseStatus();
            if(this.isMouseInside) {
                if(Mouse_IsDown) {
                    this.currColor = this.clickColor;
                } else {
                    this.currColor = this.hoverColor;
                }

            } else {
                this.currColor = this.srcColor;
            }
            DrawWithTint(this.texture, 0, 0, this.size.x, this.size.y, this.currColor);
        Canvas_Pop();
    } // draw

    //--------------------------------------------------------------------------
    _updateMouseStatus()
    {
        let t = GetContextTransform();
        let tx = t[4];
        let ty = t[5];

        let contains = Math_RectContainsPoint(
            tx, ty,
            this.size.x, this.size.y,
            Mouse_X, Mouse_Y
        );

        this.isMouseInside = contains;
    } // _updateMouseStatus
}; // class UIButton
