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

        this.ownedIndexes        = [];
        this.nonOwnedIndexes     = [];
        this.previewOwnedIndexes = [];
        this.previewNonOwnedIndexes = [];

        this.selectedColorIndex = PALETTE_INVALID_COLOR_INDEX;

        this.previewTime      = 0;
        this.maxPreviewTime   = 0.3;
        this.previewTimeRatio = 0;
        this.isPreviewing     = false;

        this._initializeBlocks();
    } // ctor


    //--------------------------------------------------------------------------
    // Preview Flood Fill
    previewFloodFill(colorIndex)
    {
        // Trying to flood fill that same stuff as before...
        if(colorIndex == PALETTE_INVALID_COLOR_INDEX ||
           colorIndex == this.selectedColorIndex)
        {
            return;
        }

        this.resetPreviewFloodFill();

        // Make the preview owned indexes with all indexes
        // that might be affected if player chooses this color.
        this.previewOwnedIndexes = this._floodFill(this.ownedIndexes, colorIndex)
        for(let i = 0; i < this.previewOwnedIndexes.length; ++i) {
            let block_index = this.previewOwnedIndexes[i];
            let block       = this._getBlockAtIndex(block_index);
        }


        // Make the preview non owned indexes with all indexes
        // in board that are not affected if player choses this color.
        for(let i = 0; i < this.nonOwnedIndexes.length; ++i) {
            let non_owned_index = this.nonOwnedIndexes[i];
            let contains = Array_Contains(this.previewOwnedIndexes, function(item) {
                return item == non_owned_index;
            });

            if(!contains) {
                this.previewNonOwnedIndexes.push(non_owned_index);
            }
        }
    } // previewFloodFill

    //--------------------------------------------------------------------------
    resetPreviewFloodFill()
    {
        if(!this.isPreviewing) {
            this.previewTime  = 0;
        }
        this.isPreviewing = true;

        this.previewOwnedIndexes    = [];
        this.previewNonOwnedIndexes = [];
    } // resetPreviewFoodFill

    //--------------------------------------------------------------------------
    // Color Change
    changeColor(colorIndex)
    {
        if(this.selectedColorIndex == colorIndex) {
            return;
        }

        // We have 2 options here...
        //   1 - We have a previous flood fill data, so just
        //       make the owned / now-owned indexes to refer to that.
        //       We don't need to calculate again.
        //
        //   2 - We don't have the previous flood fill data, so we need
        //       to calculate it.
        if(this.previewOwnedIndexes.length == 0) {
            this.previewFloodFill(colorIndex);
        }

        // Update the indexes...
        this.ownedIndexes    = this.previewOwnedIndexes;
        this.nonOwnedIndexes = this.previewNonOwnedIndexes;
        // debugger;
        this.resetPreviewFloodFill();


        // Update the select color.
        this.selectedColorIndex = colorIndex;

        // Update the color blocks.
        for(let i = 0; i < this.ownedIndexes.length; ++i) {
            let block_index = this.ownedIndexes[i];
            let block       = this._getBlockAtIndex(block_index);

            block.changeColor(colorIndex);
        }
    } // changeColor



    //--------------------------------------------------------------------------
    _makeBlockIndexOwned(index)
    {
        // Add the index to the owned.
        this.ownedIndexes.push(index);

        // Remove it from the non owned.
        for(let i = 0; i < this.nonOwnedIndexes.length; ++i) {
            if(this.nonOwnedIndexes[i] == index) {
                Array_RemoveAt(this.nonOwnedIndexes, i);
                return;
            }
        }
    } // _makeBlockIndexOwned


    //--------------------------------------------------------------------------
    update(dt)
    {
        if(this.isPreviewing) {
            this.previewTime += dt;
            if(this.previewTime >= this.maxPreviewTime) {
                this.previewTime  = this.maxPreviewTime;
                this.isPreviewing = false;
            }

            let r = (this.previewTime / this.maxPreviewTime);
            let a = Math_Map(r, -1, 1, -MATH_PI, MATH_PI);
            let v = Math_Sin(a);
            let vv = Math_Map(v, 0, +1, 1, 0.8);

            // Log(r, v);
            this.previewTimeRatio = vv;
        }


        for(let i = 0; i < this.ownedIndexes.length; ++i) {
            let block_index = this.ownedIndexes[i];
            let block       = this._getBlockAtIndex(block_index);

            block.update(dt);
        }

        // for(let i = 0; i < this.blockSize.y; ++i) {
        //     for(let j = 0; j < this.blockSize.x; ++j) {
        //         this.blocks[i][j].update(dt);
        //     }
        // }
    } // update

    //--------------------------------------------------------------------------
    draw()
    {
        Canvas_Push();
            Canvas_Translate(this.position.x, this.position.y);
            // @todo(stdmatt): Debug draw...
            // Canvas_SetFillStyle("cyan");
            // Canvas_FillRect(
            //     0, 0, this.size.x, this.size.y
            // )

            if(this.previewOwnedIndexes.length != 0){
                this._drawWithPreview();
            } else {
                this._drawWithNoPreview();
            }
        Canvas_Pop();
    } // draw

    _drawWithNoPreview()
    {
        for(let i = 0; i < this.ownedIndexes.length; ++i) {
            let block_index = this.ownedIndexes[i];
            let block       = this._getBlockAtIndex(block_index);
            block.draw(this.previewTimeRatio);
        }

        for(let i = 0; i < this.nonOwnedIndexes.length; ++i) {
            let block_index = this.nonOwnedIndexes[i];
            let block       = this._getBlockAtIndex(block_index);
            block.draw(1);
        }
    }

    _drawWithPreview()
    {
        for(let i = 0; i < this.previewOwnedIndexes.length; ++i) {
            let block = this._getBlockAtIndex(this.previewOwnedIndexes[i]);
            block.draw(this.previewTimeRatio);
        }

        for(let i = 0; i < this.previewNonOwnedIndexes.length; ++i) {
            let block_index = this.previewNonOwnedIndexes[i];
            let block       = this._getBlockAtIndex(block_index);
            block.draw(1);
        }
    }

    //--------------------------------------------------------------------------
    _isValidCoord(v)
    {
        return v.x >= 0 && v.x < this.blockSize.x
            && v.y >= 0 && v.y < this.blockSize.y;
    }

    //--------------------------------------------------------------------------
    _floodFill(indexes, desiredColor)
    {
        let affected_indexes = [];
        for(let i = 0; i < indexes.length; ++i) {
            affected_indexes.push(indexes[i]);
        }

        for(let i = 0; i < affected_indexes.length; ++i) {
            let curr_index      = affected_indexes[i];
            let curr_coord      = this._indexToCoord(curr_index);
            let adjacent_coords = GetAdjacentCoords(curr_coord);

            // Log("Curr Coord:", curr_coord.x, curr_coord.y);
            for(let j = 0; j < adjacent_coords.length; ++j) {
                let test_coord = adjacent_coords[j];
                let test_index = this._coordToIndex(test_coord);
                // Log("Test Coord:", test_coord.x, test_coord.y);

                // Out of bounds...
                if(!this._isValidCoord(test_coord)) {
                    // Log("Out of bounds...");
                    continue;
                }

                // Already processed...
                let processed = Array_Contains(affected_indexes,function(item) {
                    return item == test_index;
                });
                if(processed) {
                    // Log("Found...");
                    continue;
                }

                // Not same color
                let block = this._getBlockAtCoord(test_coord);
                if(block.targetColorIndex != desiredColor) {
                    // Log("Not same color...");
                    continue;
                }

                affected_indexes.push(test_index);
            }
        }

        return affected_indexes;
    }

    //--------------------------------------------------------------------------
    _getBlockAtIndex(index)
    {
        let c = this._indexToCoord(index);
        return this._getBlockAtCoord(c);
    }

    //--------------------------------------------------------------------------
    _getBlockAtCoord(coord)
    {
        return this.blocks[coord.y][coord.x];
    }

    //--------------------------------------------------------------------------
    _coordToIndex(v)
    {
        return (v.y * this.blockSize.x) + v.x;
    }

    //--------------------------------------------------------------------------
    _indexToCoord(i)
    {
        return Vector_Create(
            Math_IntMod(i, this.blockSize.x),
            Math_IntDiv(i, this.blockSize.x)
        );
    }

    //--------------------------------------------------------------------------
    _initializeBlocks()
    {
        let block_width  = this.size.x / this.blockSize.x;
        let block_height = this.size.y / this.blockSize.y;

        let index = 0;
        for(let i = 0; i < this.blockSize.y; ++i) {
            for(let j = 0; j < this.blockSize.x; ++j) {
                let color_index = Math_RandomInt(0, this.colorsCount);
                let b = new Block(j, i, block_width, block_height, color_index);

                this.blocks[i][j] = b;
                this.nonOwnedIndexes.push(index);
                ++index;
            }
        }

        this.ownedIndexes.push(0); // left most is always owned.
        this.changeColor(this._getBlockAtIndex(0).targetColorIndex);
    } // _initializeBlocks()
}; // class Board
