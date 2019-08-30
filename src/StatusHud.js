class StatusHud
{
    constructor(x, y, w, h)
    {
        this.position = Vector_Create(x, y);
        this.size     = Vector_Create(w, h);
    } // ctor

    //--------------------------------------------------------------------------
    update(dt)
    {
        // this._updateHoverColorIndex();
    }

    //--------------------------------------------------------------------------
    draw()
    {
        Canvas_Push();
            // @todo(stdmatt): Debug draw...
            Canvas_Translate(this.position.x, this.position.y);
            Canvas_SetFillStyle("magenta");
            // Canvas_FillRect(0, 0, this.size.x, this.size.y);

            let gap         = 10;
            let icon_width  = (this.size.y - gap * 2);
            let icon_height = (this.size.y - gap * 2);

            let cog_x = gap;
            let cog_y = gap;
            DrawWithTint(textureCog, cog_x, cog_y, icon_width, icon_height, "white");

            let reload_x = this.size.x - icon_width - gap;;
            let reload_y = gap;
            // CurrContext.drawImage(textureReset, reload_x, reload_y, icon_width, icon_height);
        Canvas_Pop();
    } // draw

}; // class StatusHud
