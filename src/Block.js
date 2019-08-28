//------------------------------------------------------------------------------
class Block
{
    //--------------------------------------------------------------------------
    constructor(x, y, w, h, colorIndex)
    {
        this.position = Vector_Create(x, y);
        this.size     = Vector_Create(w, h);

        this.colorIndex       = colorIndex;
        this.targetColorIndex = colorIndex;

        this.timeToChangeColor    = 0;
        this.maxTimeToChangeColor = 0.5;
        this.changingColor        = false;
    } // ctor

    //--------------------------------------------------------------------------
    changeColor(colorIndex)
    {
        if(this.targetColorIndex == colorIndex) {
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
            this.changingColor     = false;
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
            Canvas_FillRect(-w/2, -h/2, w-1, h-1);
        Canvas_Pop();
    } // draw
}; // class Block
