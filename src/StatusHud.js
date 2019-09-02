//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : StatusHud.js                                                  //
//  Project   : color_grid                                                    //
//  Date      : Aug 28, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//   Implements the top hud of the game.                                      //
//---------------------------------------------------------------------------~//

//------------------------------------------------------------------------------
class StatusHud
{
    //--------------------------------------------------------------------------
    constructor(x, y, w, h)
    {
        this.position = Vector_Create(x, y);
        this.size     = Vector_Create(w, h);

        let gap         = 10;
        let icon_width  = (this.size.y - gap * 2);
        let icon_height = (this.size.y - gap * 2);

        // Cog Button
        let cog_position = Vector_Create(gap, gap);
        let cog_size     = Vector_Create(icon_width, icon_height);
        this.cogButton = new UIButton(
            textureCog,
            chroma("white"),
            chroma("white").darken(2),
            chroma("white").darken(3),
            cog_position,
            cog_size,
            this.onCogClicked
        );

        // Reload Button
        let reload_position = Vector_Create(this.size.x - gap - icon_width, gap);
        let reload_size     = Vector_Create(icon_width, icon_height);
        this.reloadButton = new UIButton(
            textureReset,
            chroma("white"),
            chroma("white").darken(2),
            chroma("white").darken(3),
            reload_position,
            reload_size,
            this.onReloadClicked
        );

        // Score
        this.lastScore = -1;
        this.scoreText = null;
    } // ctor

    //--------------------------------------------------------------------------
    update(dt)
    {
        this.cogButton   .update(dt);
        this.reloadButton.update(dt);

        if(board.movesCount != this.lastScore) {
            this.lastScore = board.movesCount;
            this.updateMovesCount();
        }
    }

    //--------------------------------------------------------------------------
    draw()
    {
        Canvas_Push();
            // @todo(stdmatt): Debug draw...
            Canvas_Translate(this.position.x, this.position.y);

            // Canvas_FillRect(0, 0, this.size.x, this.size.y);

            this.cogButton   .draw();
            this.reloadButton.draw();

            Canvas_SetFillStyle("white");
            this.scoreText.draw();
        Canvas_Pop();
    } // draw

    updateMovesCount()
    {
        let count = board.movesCount-1;
        let max   = board.maxMovesCount;
        let str   = String_Cat(count, " / ", max);

        // @notice(stdmatt): Lame but quick... Best way would be just to
        // update the string contents...
        let score_position = Vector_Create(this.size.x / 2, this.size.y / 2);
        this.scoreText = new UIText(str, score_position, 20, "arial");
    }

    //--------------------------------------------------------------------------
    onCogClicked(b)
    {

    }

    //--------------------------------------------------------------------------
    onReloadClicked(b)
    {
        ResetGame();
    }
}; // class StatusHud
