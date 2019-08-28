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
    draw()
    {
        let w = this.size.x;
        let h = this.size.y;
        let x = this.position.x * w;
        let y = this.position.y * h;

        Canvas_Push();
            Canvas_Translate(x, y);

            Canvas_SetFillStyle(palette.getColor(this.color));
            Canvas_FillRect(0, 0, w-1, h-1);
        Canvas_Pop();
    } // draw
}; // class Block
