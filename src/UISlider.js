//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : UISlider.js                                                   //
//  Project   : color_grid                                                    //
//  Date      : 02, Sep 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//   Implements a user interface slider that can be                           //
//   interacted with the mouse.                                               //
//---------------------------------------------------------------------------~//

//------------------------------------------------------------------------------
class UISlider
{
    //--------------------------------------------------------------------------
    constructor(
        fillColor, sliderColor, handleColor,
        position, size,
        callback)
    {
        this.fillColor       = fillColor;
        this.sliderColor     = sliderColor;
        this.handleColor     = handleColor;
        this.currHandleColor = handleColor;

        this.position = Vector_Copy(position);
        this.size     = Vector_Copy(size);

        this.isMouseInside = false;
        this.callback      = callback;

        this.value       = 0.5;
        this.originalValue = 0.5;
        this.firstPress  = false;
        this.firstPressX = null;
    } // ctor

    //--------------------------------------------------------------------------
    update(dt)
    {
        if(this.isMouseInside) {
            if(Mouse_IsDown && !this.firstPress) {
                this.firstPress  = true;
                this.firstPressX = Mouse_X;
            }
        }

        if(!Mouse_IsDown) {
            this.firstPress  = false;
            this.firstPressX = null;
            this.originalValue = this.value;
        }

        if(this.firstPressX != null) {
            let diff = (Mouse_X - this.firstPressX) / this.size.x;
            this.value = Math_Clamp(0, 1, this.originalValue + diff);
        }

    } // update

    //--------------------------------------------------------------------------
    draw()
    {
        Canvas_Push();
            Canvas_Translate(this.position.x, this.position.y);

            let w = this.size.x;
            let h = this.size.y;
            let hw = (w / 2);
            let hh = (h / 2);

            Canvas_SetStrokeSize("magenta");

            // Back
            Canvas_SetFillStyle(this.sliderColor);
            Canvas_FillRect(-hw, -hh, w, h);


            // Fill
            let fill_w = (w * this.value);
            let fill_x = -hw;
            Canvas_SetFillStyle(this.fillColor);
            Canvas_FillRect(fill_x, -hh, fill_w, h);

            // Handle
            let handle_w = (h * 3);
            let handle_h = (h * 3);
            let handle_x = fill_x + fill_w - (handle_w / 2);
            let handle_y = -hh * 3
            Canvas_SetFillStyle(this.currHandleColor);
            Canvas_FillRect(handle_x, handle_y, handle_w, handle_h);


            let t  = GetContextTransform();
            let tx = t[4];
            let ty = t[5];
            let contains = Math_RectContainsPoint(
                tx + handle_x,  ty + handle_y,
                handle_w,       handle_h,
                Mouse_X,        Mouse_Y
            );
            this.isMouseInside = contains;
        Canvas_Pop();
    } // draw

    //--------------------------------------------------------------------------
    _updateMouseStatus()
    {

    } // _updateMouseStatus
}; // class UIButton
