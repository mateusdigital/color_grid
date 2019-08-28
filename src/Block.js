//------------------------------------------------------------------------------
class Block
{
    //--------------------------------------------------------------------------
    constructor(x, y, w, h, color)
    {
        this.position = Vector_Create(x, y);
        this.size     = Vector_Create(w, h);

        this.color       = color;
        this.targetColor = color;

        this.timeToChangeColor    = 0;
        this.maxTimeToChangeColor = 2;

        this.done = false;

        this.owned = false;
    } // ctor

    //--------------------------------------------------------------------------
    update(dt)
    {
        if(this.done) {
            return;
        }

        if(this.timeToChangeColor >= this.maxTimeToChangeColor) {
            this.color = this.targetColor;
            this.done  = true;
        }

        this.timeToChangeColor += dt
    } // update

    //--------------------------------------------------------------------------
    draw(colorModifier, ratio)
    {
        let w = this.size.x;
        let h = this.size.y;

        // if(this.owned) {
        //     let s = Math_Map(Math_Sin(Time_Total), -1, 1, 0.8, 1.0);
        //     w = this.size.x * s;
        //     h = this.size.y * s;
        // }
        Canvas_Push();
            Canvas_Translate(
                (this.position.x * this.size.x) + this.size.x / 2,
                (this.position.y * this.size.y) + this.size.y / 2
            );

            let color = palette.getColor(this.color);
            // if(colorModifier != PALETTE_INVALID_COLOR_INDEX){
                // color = palette.getColor(colorModifier);
                color = color.set('hsl.l', Math_Map(ratio, 0, 1, 1, 0.5));
            // }
            Canvas_SetFillStyle(color);
            Canvas_FillRect(-w/2, -h/2, w-1, h-1);
        Canvas_Pop();
    } // draw
}; // class Block
