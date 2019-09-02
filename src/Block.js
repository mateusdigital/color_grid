//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Block.js                                                      //
//  Project   : color_grid                                                    //
//  Date      : Aug 27, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//   Represents a color block in the color grid field.                        //
//---------------------------------------------------------------------------~//

//----------------------------------------------------------------------------//
// Block                                                                      //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const BLOCK_VICTORY_ANIM_FORCE_MIN_X = -3;
const BLOCK_VICTORY_ANIM_FORCE_MAX_X = +3;

const BLOCK_VICTORY_ANIM_FORCE_MIN_Y = -120;
const BLOCK_VICTORY_ANIM_FORCE_MAX_Y = -90;

const BLOCK_VICTORY_ANIM_ANGLE_MIN = -MATH_PI;
const BLOCK_VICTORY_ANIM_ANGLE_MAX = +MATH_PI;

const BLOCK_VICTORY_ANIM_START_DELAY_MIN = 0.5;
const BLOCK_VICTORY_ANIM_START_DELAY_MAX = 1.5;


//------------------------------------------------------------------------------
class Block
{
    //--------------------------------------------------------------------------
    constructor(x, y, w, h, colorIndex)
    {
        // Transform
        this.position = Vector_Create(x, y);
        this.size     = Vector_Create(w, h);
        this.rotation = 0;

        // Color
        this.colorIndex       = palette.getDefeatIndex();
        this.targetColorIndex = colorIndex;

        this.changeColorTimer = new Timer(Math_Random(0, 1));
        this.changingColor        = false;
        this.isEntryColorChange   = true;

        this.changeColor(this.targetColorIndex);

        this.isOwned = false;

        // Victory Animation.
        this.isPlayingVictoryAnimation  = false;
        this.victoryAnimationDelayTimer = this._calcVictoryAnimationStartDelay();
        this.victoryAnimationForce      = this._randomVictoryAnimationForce   ();
        this.victoryAnimationAngle      = this._calcEndRotationAngle          ();
        this.victoryAnimationVelocity   = Vector_Create(0, 0);
        this.victoryAnimationTime       = 0;
        this.victoryAnimationMaxTime    = 1;
    } // ctor

    setVictory()
    {
        this.isPlayingVictoryAnimation = true;
        this.victoryAnimationDelayTimer.start();
    }

    //--------------------------------------------------------------------------
    changeColor(colorIndex)
    {
        if(this.targetColorIndex == colorIndex &&
           !this.isEntryColorChange)
        {
            return;
        }

        this.changeColorTimer.start();

        this.targetColorIndex = colorIndex;
        this.changingColor    = true;
    } // changeColor

    //--------------------------------------------------------------------------
    update(dt)
    {
        if(this.changingColor) {
            this.changeColorTimer.update(dt);
            if(this.changeColorTimer.isDone) {
                this.colorIndex        = this.targetColorIndex;
                this.changingColor      = false;

                if(this.isEntryColorChange) {
                    this.isEntryColorChange = false;
                    this.changeColorTimer.duration = 0.5;
                }
            }
        }

        if(this.isPlayingVictoryAnimation) {
            this.victoryAnimationDelayTimer.update(dt);
            if(this.victoryAnimationDelayTimer.isDone) {
                this.victoryAnimationTime += dt;
                if(this.victoryAnimationTime >= this.victoryAnimationMaxTime) {
                    this.victoryAnimationTime = this.victoryAnimationMaxTime;
                    // done..
                }

                this.victoryAnimationForce.y *= 0.9; // decay...
                let acc = 30 + this.victoryAnimationForce.y;

                this.victoryAnimationVelocity.x = this.victoryAnimationForce.x;
                this.victoryAnimationVelocity.y += acc * dt;

                this.position.x += this.victoryAnimationVelocity.x * dt;
                this.position.y += this.victoryAnimationVelocity.y * dt;

                this.rotation += this.victoryAnimationAngle * dt;
            }
        }
    } // update

    //--------------------------------------------------------------------------
    draw(s)
    {
        let w = this.size.x;
        let h = this.size.y;

        Canvas_Push();
            Canvas_Translate(
                (this.position.x * this.size.x) + this.size.x / 2,
                (this.position.y * this.size.y) + this.size.y / 2
            );

            let color = palette.getColor(this.targetColorIndex);
            //
            // Changing color
            if(this.changingColor) {
                let srcColor = palette.getColor(this.colorIndex);
                let dstColor = color;

                color = chroma.mix(srcColor, dstColor, this.changeColorTimer.ratio);
            }

            //
            // Ending Animation
            if(this.isPlayingVictoryAnimation) {
                s = Math_Map(this.victoryAnimationTime, 0, this.victoryAnimationMaxTime, 1, 0.5);
            }

            Canvas_Scale(s);
            Canvas_Rotate(this.rotation);

            Canvas_SetFillStyle(color);
            Canvas_FillRoundedRect(-w/2, -h/2, w-1, h-1, w/6);
        Canvas_Pop();
    } // draw


    //--------------------------------------------------------------------------
    _calcVictoryAnimationStartDelay()
    {
        let t = Math_Random(
            BLOCK_VICTORY_ANIM_START_DELAY_MIN,
            BLOCK_VICTORY_ANIM_START_DELAY_MAX
        );

        return new Timer(t);
    } // _calcVictoryAnimationStartDelay

    //--------------------------------------------------------------------------
    _calcEndRotationAngle()
    {
        return Math_Map(
            this.victoryAnimationForce.x,
            BLOCK_VICTORY_ANIM_FORCE_MIN_X,
            BLOCK_VICTORY_ANIM_FORCE_MAX_X,
            BLOCK_VICTORY_ANIM_ANGLE_MIN,
            BLOCK_VICTORY_ANIM_ANGLE_MAX
        );
    } // _calcEndRotationAngle

    //--------------------------------------------------------------------------
    _randomVictoryAnimationForce()
    {
        let x = Math_RandomInt(
            BLOCK_VICTORY_ANIM_FORCE_MIN_X,
            BLOCK_VICTORY_ANIM_FORCE_MAX_X
        );
        let y = Math_RandomInt(
            BLOCK_VICTORY_ANIM_FORCE_MIN_Y,
            BLOCK_VICTORY_ANIM_FORCE_MAX_Y
        );

        return Vector_Create(x, y);
    } // _randomVictoryAnimationForce

}; // class Block
