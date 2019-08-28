//------------------------------------------------------------------------------
class ColorSelectorHud
{
    //--------------------------------------------------------------------------
    constructor(x, y, w, h, colorsCount)
    {
        this.position    = Vector_Create(x, y);
        this.size        = Vector_Create(w, h);
        this.colorsCount = colorsCount;

        this.colorBlocks    = [];
        this.colorBlockSize = null;

        this.hoveredColorIndex = PALETTE_INVALID_COLOR_INDEX;
        this._createColorBlocks();
    } // ctor

    //--------------------------------------------------------------------------
    update(dt)
    {
        this._updateHoverColorIndex();
    }

    //--------------------------------------------------------------------------
    draw()
    {
        Canvas_Push();
            // @todo(stdmatt): Debug draw...
            Canvas_Translate(this.position.x, this.position.y);
            Canvas_SetFillStyle("magenta");
            Canvas_FillRect(0, 0, this.size.x, this.size.y);

            for(let i = 0; i < this.colorsCount; ++i) {
                Canvas_SetFillStyle(palette.getColor(i));
                Canvas_FillRect(
                    this.colorBlocks[i].x, this.colorBlocks[i].y,
                    this.colorBlockSize.x, this.colorBlockSize.y
                );
            }

        Canvas_Pop();
    } // draw

    //--------------------------------------------------------------------------
    _createColorBlocks()
    {
        let gap = 10;
        let max_block_width = (this.size.x / this.colorsCount);
        this.colorBlockSize = Vector_Create(max_block_width, this.size.y - gap);

        for(let i = 0; i < this.colorsCount; ++i) {
            let v = (i) * 1/(this.colorsCount);
            let x = (max_block_width) * i;
            let y = (this.size.y/2) - (this.colorBlockSize.y / 2);

            let p = Vector_Create(x, y);
            this.colorBlocks.push(p);
        }
    } // _createColorBlocks

    //--------------------------------------------------------------------------
    _updateHoverColorIndex()
    {
        this.hoveredColorIndex = PALETTE_INVALID_COLOR_INDEX;
        let contains = Math_RectContainsPoint(
            this.position.x, this.position.y,
            this.size.x,     this.size.y,
            Mouse_World_X,   Mouse_World_Y
        );

        if(!contains) {
            return;
        }

        let offx = this.position.x;
        let offy = this.position.y;
        for(let i = 0; i < this.colorsCount; ++i) {
            contains = Math_RectContainsPoint(
                this.colorBlocks[i].x + offx, this.colorBlocks[i].y + offy,
                this.colorBlockSize.x,        this.colorBlockSize.y,
                Mouse_World_X,                Mouse_World_Y
            );

            if(contains) {
                this.hoveredColorIndex = i;
                return;
            }
        }
    } // _updateHoverColorIndex
}; // class ColorSelectorHud
