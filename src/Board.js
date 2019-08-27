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

function GetAdjacentCoords(v)
{
    let coords = [];
    coords.push(Vector_Create(v.x -1, v.y +0));
    coords.push(Vector_Create(v.x +0, v.y -1));
    coords.push(Vector_Create(v.x +1, v.y +0));
    coords.push(Vector_Create(v.x +0, v.y +1));
    return coords;
}

class Board
{
    constructor(x, y, w, h, r, c, colorsCount)
    {
        this.position    = Vector_Create (x, y);
        this.size        = Vector_Create (w, h);
        this.blockSize   = Vector_Create (r, c);
        this.blocks      = Array_Create2D(r, c);
        this.colorsCount = colorsCount;
        this.ownedCoords = [];

        this._initializeBlocks();
        {
            let coord = Vector_Create(0,0);
            let color = this.blocks[coord.y][coord.x].targetColor;
            this.ownedCoords.push(coord);
            this.changeColor(color);
        }
    } // ctor


    changeColor(colorIndex)
    {
        let affected_coords = this._floodFill(this.ownedCoords, colorIndex);
        for(let i = 0; i < affected_coords.length; ++i) {
            let c = affected_coords[i];

            this.ownedCoords.push(c);

            this.blocks[c.y][c.x].color       = colorIndex;
            this.blocks[c.y][c.x].targetColor = colorIndex;
        }
    } // changeColor

    update(dt)
    {
        for(let i = 0; i < this.blockSize.y; ++i) {
            for(let j = 0; j < this.blockSize.x; ++j) {
                this.blocks[i][j].update(dt);
            }
        }
    } // update

    draw()
    {
        Canvas_Push();
            Canvas_Translate(this.position.x, this.position.y);

            for(let i = 0; i < this.blockSize.y; ++i) {
                for(let j = 0; j < this.blockSize.x; ++j) {
                    this.blocks[i][j].draw();
                }
            }
        Canvas_Pop();
    } // draw



    _isValidCoord(v)
    {
        return v.x >= 0 && v.x < this.blockSize.x
            && v.y >= 0 && v.y < this.blockSize.y;
    }

    _floodFill(coords, desiredColor)
    {
        let affected_coords = [];
        for(let i = 0; i < coords.length; ++i) {
            affected_coords.push(Vector_Copy(coords[i]));
        }

        for(let i = 0; i < affected_coords.length; ++i) {
            let curr_coord      = affected_coords[i];
            let adjacent_coords = GetAdjacentCoords(curr_coord);

            // Log("Curr Coord:", curr_coord.x, curr_coord.y);
            for(let j = 0; j < adjacent_coords.length; ++j) {
                let test_coord = adjacent_coords[j];
                // Log("Test Coord:", test_coord.x, test_coord.y);

                // Out of bounds...
                if(!this._isValidCoord(test_coord)) {
                    // Log("Out of bounds...");
                    continue;
                }

                // Already processed...
                let processed = affected_coords.find(function(item) {
                    return Vector_Equals(item, test_coord);
                });
                if(processed != undefined) {
                    // Log("Found...");
                    continue;
                }

                // Not same color
                let block = this.blocks[test_coord.y][test_coord.x];
                if(block.targetColor != desiredColor) {
                    // Log("Not same color...");
                    continue;
                }

                affected_coords.push(test_coord);
            }
        }

        return affected_coords;
    }

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
    } // _initializeBlocks()

}; // class Board
