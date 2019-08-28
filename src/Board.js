//----------------------------------------------------------------------------//
// Helper Functions                                                           //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function GetSurroundCoords(v)
{
    let coords = [];
    for(let i = -1; i <= +1; ++i) {
        let yy = v.y + i;
        for(let i = -j; j <= +j; ++j) {
            let xx = v.x + j;

            if(yy == vy && xx == v.x) { // Don't want the same coord.
                continue;
            }
            coords.push(Vector_Create(xx, yy));
        }
    }

    return coords;
}

//------------------------------------------------------------------------------
function GetAdjacentCoords(v)
{
    let coords = [];
    coords.push(Vector_Create(v.x -1, v.y +0));
    coords.push(Vector_Create(v.x +0, v.y -1));
    coords.push(Vector_Create(v.x +1, v.y +0));
    coords.push(Vector_Create(v.x +0, v.y +1));
    return coords;
}


//----------------------------------------------------------------------------//
// Board                                                                      //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class Board
{
    //--------------------------------------------------------------------------
    constructor(x, y, w, h, r, c, colorsCount)
    {
        this.position    = Vector_Create (x, y);
        this.size        = Vector_Create (w, h);
        this.blockSize   = Vector_Create (r, c);
        this.blocks      = Array_Create2D(r, c);
        this.colorsCount = colorsCount;

        this.ownedBlocks        = [];
        this.selectedColorIndex = PALETTE_INVALID_COLOR_INDEX;

        this.state         = GAME_STATE_CONTINUE;
        this.movesCount    = 0;
        this.maxMovesCount = 100;

        this._initializeBlocks();
    } // ctor

    //--------------------------------------------------------------------------
    changeColor(colorIndex)
    {
        if(this.selectedColorIndex == colorIndex) {
            return;
        }

        this.selectedColorIndex = colorIndex;
        this._floodFill(colorIndex);

    } // changeColor


    //--------------------------------------------------------------------------
    update(dt)
    {
        for(let i = 0; i < this.ownedBlocks.length; ++i) {
            let block = this.ownedBlocks[i];
            block.update(dt);
        }
    } // update

    //--------------------------------------------------------------------------
    draw()
    {
        Canvas_Push();
            Canvas_Translate(this.position.x, this.position.y);
            for(let y = 0; y < this.blockSize.y; ++y) {
                for(let x = 0; x < this.blockSize.x; ++x) {
                    this.blocks[y][x].draw();
                }
            }
        Canvas_Pop();
    } // draw

    //--------------------------------------------------------------------------
    _isValidCoord(v)
    {
        return v.x >= 0 && v.x < this.blockSize.x
            && v.y >= 0 && v.y < this.blockSize.y;
    } //_isValidCoord

    //--------------------------------------------------------------------------
    _floodFill(desiredColor)
    {
        for(let i = 0; i < this.ownedBlocks.length; ++i) {
            let curr_block      = this.ownedBlocks[i];
            let adjacent_coords = GetAdjacentCoords(curr_block.position);

            for(let j = 0; j < adjacent_coords.length; ++j) {
                let test_coord = adjacent_coords[j];
                // Out of bounds...
                if(!this._isValidCoord(test_coord)) {
                    continue;
                }

                let test_block = this._getBlockAtCoord(test_coord);
                // Not same color...
                if(test_block.targetColorIndex != desiredColor) {
                    continue;
                }

                // Already processed...
                let processed = Array_Contains(this.ownedBlocks, function(item) {
                    return Vector_Equals(item.position, test_block.position);
                });
                if(processed) {
                    continue;
                }
                this.ownedBlocks.push(test_block);
            }

            curr_block.changeColor(desiredColor)
        }

    } // _floodFill

    //--------------------------------------------------------------------------
    _getBlockAtCoord(coord)
    {
        return this.blocks[coord.y][coord.x];
    }

    //--------------------------------------------------------------------------
    _initializeBlocks()
    {
        let block_width  = this.size.x / this.blockSize.x;
        let block_height = this.size.y / this.blockSize.y;

        for(let i = 0; i < this.blockSize.y; ++i) {
            for(let j = 0; j < this.blockSize.x; ++j) {
                let color_index = Math_RandomInt(0, this.colorsCount);
                let b = new Block(j, i, block_width, block_height, color_index);

                this.blocks[i][j] = b;
            }
        }

        this.ownedBlocks.push(this.blocks[0][0]); // left most is always owned.
        this.changeColor(this.blocks[0][0].targetColorIndex);
    } // _initializeBlocks()
}; // class Board
