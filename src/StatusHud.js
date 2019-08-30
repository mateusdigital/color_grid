class UIButton
{
    constructor(texture, srcColor, hoverColor, position, size, callback)
    {
        this.texture    = texture;
        this.srcColor   = srcColor;
        this.hoverColor = hoverColor;
        this.currColor  = srcColor;

        this.position = Vector_Copy(position);
        this.size     = Vector_Copy(size);

        this.isMouseInside = false;

        this.callback = callback;
    } // ctor


    update(dt)
    {
        if(this.isMouseInside &&
           Mouse_IsClicked    &&
           !Utils_IsNullOrUndefined(this.callback))
        {
            this.callback(this);
        }
    } // update

    draw()
    {
        Canvas_Push();
            Canvas_Translate(this.position.x, this.position.y);

            // @XXX(stdmatt): Doing here because we don't have access to the
            // transform matrix on update method.
            this._updateMouseStatus();
            if(this.isMouseInside) {
                this.currColor = this.hoverColor;
            } else {
                this.currColor = this.srcColor;
            }
            DrawWithTint(this.texture, 0, 0, this.size.x, this.size.y, this.currColor);
        Canvas_Pop();
    }


    _updateMouseStatus()
    {
        let t = CurrContext.getTransform();
        let tx = t.e;
        let ty = t.f;

        let contains = Math_RectContainsPoint(
            tx, ty,
            this.size.x, this.size.y,
            Mouse_X, Mouse_Y
        );

        this.isMouseInside = contains;
    }

}; // class UIButton

class StatusHud
{
    constructor(x, y, w, h)
    {
        this.position = Vector_Create(x, y);
        this.size     = Vector_Create(w, h);

        let gap         = 10;
        let icon_width  = (this.size.y - gap * 2);
        let icon_height = (this.size.y - gap * 2);

        // Cog Button
        let cog_position = Vector_Create(gap, gap);
        let cog_size     = Vector_Create(icon_width, icon_height);
        this.cogButton = new UIButton(
            textureCog,
            "white", "red",
            cog_position,
            cog_size,
            this.onCogClicked
        );

        // Reload Button
        let reload_position = Vector_Create(this.size.x - gap - icon_width, gap);
        let reload_size     = Vector_Create(icon_width, icon_height);
        this.reloadButton = new UIButton(
            textureReset,
            "white", "red",
            reload_position,
            reload_size,
            this.onReloadClicked
        );

    } // ctor

    //--------------------------------------------------------------------------
    update(dt)
    {
        this.cogButton   .update(dt);
        this.reloadButton.update(dt);
    }

    //--------------------------------------------------------------------------
    draw()
    {
        Canvas_Push();
            // @todo(stdmatt): Debug draw...
            Canvas_Translate(this.position.x, this.position.y);
            Canvas_SetFillStyle("magenta");
            // Canvas_FillRect(0, 0, this.size.x, this.size.y);

            this.cogButton   .draw();
            this.reloadButton.draw();
        Canvas_Pop();
    } // draw


    //--------------------------------------------------------------------------
    onCogClicked(b)
    {

    }

    //--------------------------------------------------------------------------
    onReloadClicked(b)
    {
        ResetGame();
    }
}; // class StatusHud
