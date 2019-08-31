//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Board.js                                                      //
//  Project   : color_grid                                                    //
//  Date      : Aug 27, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//   Represents the color grid board.                                         //
//---------------------------------------------------------------------------~//

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
const GAME_STATE_CONTINUE = 0;
const GAME_STATE_VICTORY  = 1;
const GAME_STATE_DEFEAT   = 2;


//------------------------------------------------------------------------------
class Board
{
    //--------------------------------------------------------------------------
    constructor(x, y, w, h, r, c, colorsCount)
    {
        this.position    = Vector_Create (x, y);
        this.size        = Vector_Create (w, h);
        this.blocksCount = Vector_Create (r, c);
        this.blocks      = Array_Create2D(r, c);
        this.colorsCount = colorsCount;

        this.ownedBlocks        = [];
        this.selectedColorIndex = PALETTE_INVALID_COLOR_INDEX;

        this.state         = GAME_STATE_CONTINUE;
        this.movesCount    = 0;
        this.maxMovesCount = this.blocksCount.x * this.blocksCount.y;

        this.canChangeColors = true;

        this._initializeBlocks();
    } // ctor

    //--------------------------------------------------------------------------
    changeColor(colorIndex)
    {
        if(this.selectedColorIndex == colorIndex ||
           this.state != GAME_STATE_CONTINUE     ||
           !this.canChangeColors)
        {
            return;
        }

        this.selectedColorIndex = colorIndex;
        this._floodFill(colorIndex);

        ++this.movesCount;
        if(this.movesCount > this.maxMovesCount) {
            this.state = GAME_STATE_DEFEAT;
            this._setAllBlocksToBeOwnedAndDefeated();
        } else if(this.ownedBlocks.length == this.blocksCount.x * this.blocksCount.y) {
            this.state = GAME_STATE_VICTORY;
        }
    } // changeColor


    //--------------------------------------------------------------------------
    update(dt)
    {
        this.canChangeColors = true;
        for(let i = 0; i < this.ownedBlocks.length; ++i) {
            let block = this.ownedBlocks[i];
            block.update(dt);
            if(block.changingColor) {
                this.canChangeColors = false;
            }

            if(this.state == GAME_STATE_VICTORY && !block.changingColor) {
                this.changeColor(palette.getRandomIndex());
            }
        }
    } // update

    //--------------------------------------------------------------------------
    draw()
    {
        Canvas_Push();
            Canvas_Translate(this.position.x, this.position.y);
            for(let y = 0; y < this.blocksCount.y; ++y) {
                for(let x = 0; x < this.blocksCount.x; ++x) {
                    this.blocks[y][x].draw();
                }
            }
        Canvas_Pop();
    } // draw

    //--------------------------------------------------------------------------
    _isValidCoord(v)
    {
        return v.x >= 0 && v.x < this.blocksCount.x
            && v.y >= 0 && v.y < this.blocksCount.y;
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
        let block_width  = this.size.x / this.blocksCount.x;
        let block_height = this.size.y / this.blocksCount.y;

        for(let i = 0; i < this.blocksCount.y; ++i) {
            for(let j = 0; j < this.blocksCount.x; ++j) {
                let color_index = Math_RandomInt(0, this.colorsCount);
                let b = new Block(j, i, block_width, block_height, color_index);

                this.blocks[i][j] = b;
            }
        }

        this.ownedBlocks.push(this.blocks[0][0]); // left most is always owned.
        this.changeColor(this.blocks[0][0].targetColorIndex);
    } // _initializeBlocks()

    //--------------------------------------------------------------------------
    _setAllBlocksToBeOwnedAndDefeated()
    {
        this.ownedBlocks = [];
        for(let y = 0; y < this.blocksCount.y; ++y) {
            for(let x = 0; x < this.blocksCount.x; ++x) {
                let block = this.blocks[y][x];
                block.changeColor(palette.getDefeatIndex());

                this.ownedBlocks.push(block);
            }
        }
    } // _setAllBlocksToBeOwnedAndDefeated
}; // class Board
