//----------------------------------------------------------------------------//
// Palette                                                                    //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const PALETTE_INVALID_COLOR_INDEX = -1;

//------------------------------------------------------------------------------
class Palette
{
    //--------------------------------------------------------------------------
    constructor(colorsCount)
    {
        this.colors      = [];
        this.colorsCount = colorsCount;

        for(let i = 0; i < colorsCount; ++i) {
            let c = chroma.hsl(360 / colorsCount * i, 1, 0.5);
            this.colors.push(c);
        }
        this.colors.push(chroma("gray"));
    } // ctor

    //--------------------------------------------------------------------------
    getRandomIndex()
    {
        return Math_RandomInt(0, this.colorsCount);
    }

    //--------------------------------------------------------------------------
    getDefeatIndex()
    {
        return this.colorsCount;
    }

    //--------------------------------------------------------------------------
    getColor(i)
    {
        return this.colors[i];
    } // getColor
}; // class Palette
