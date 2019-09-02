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

const BLOCK_VICTORY_ANIM_TIME_MIN = 1.0;
const BLOCK_VICTORY_ANIM_TIME_MAX = 1.8;

const BLOCK_DEFEAT_ANIM_START_DELAY_MIN = 0.0;
const BLOCK_DEFEAT_ANIM_START_DELAY_MAX = 1.5;

const BLOCK_DEFEAT_ANIM_TIME_MIN = 0.5;
const BLOCK_DEFEAT_ANIM_TIME_MAX = 1.5;


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
        this.victoryAnimationTimer      = this._calcVictoryAnimationTime      ();
        this.victoryAnimationForce      = this._randomVictoryAnimationForce   ();
        this.victoryAnimationAngle      = this._calcVictoryRotationAngle      ();
        this.victoryAnimationVelocity   = Vector_Create(0, 0);


        // Defeat Animation.
        this.isPlayingDefeatAnimation  = false;
        this.defeatAnimationDelayTimer = this._calcDefeatAnimationStartDelay();
        this.defeatAnimationTimer      = this._calcDefeatAnimationTime      ();
    } // ctor


    setVictory()
    {
        this.isPlayingVictoryAnimation = true;
        this.victoryAnimationDelayTimer.start();
    }

    setDefeat()
    {
        this.isPlayingDefeatAnimation = true;
        this.defeatAnimationDelayTimer.start();
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
        //
        // Change Color.
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

        //
        // Victory Animation.
        if(this.isPlayingVictoryAnimation) {
            this.victoryAnimationDelayTimer.update(dt);
            if(this.victoryAnimationDelayTimer.isDone) {
                if(!this.victoryAnimationTimer.started) {
                    this.victoryAnimationTimer.start();
                } else {
                    if(this.victoryAnimationTimer.isDone) {
                        this.isDone = true;
                    }

                    this.victoryAnimationTimer.update(dt);
                    this.victoryAnimationForce.y *= 0.9; // decay...
                    let acc = 30 + this.victoryAnimationForce.y;

                    this.victoryAnimationVelocity.x = this.victoryAnimationForce.x;
                    this.victoryAnimationVelocity.y += acc * dt;

                    this.position.x += this.victoryAnimationVelocity.x * dt;
                    this.position.y += this.victoryAnimationVelocity.y * dt;

                    this.rotation += this.victoryAnimationAngle * dt;
                }
            }
        }

        //
        // Defeat Animation.
        if(this.isPlayingDefeatAnimation) {
            this.defeatAnimationDelayTimer.update(dt);
            if(this.defeatAnimationDelayTimer.isDone) {
                if(!this.defeatAnimationTimer.started) {
                    this.defeatAnimationTimer.start();
                } else {
                    this.defeatAnimationTimer.update(dt);
                    if(this.defeatAnimationTimer.isDone) {
                        this.isDone = true;
                    }
                }
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
            // Victory Animation
            if(this.isPlayingVictoryAnimation) {
                let c = this.victoryAnimationTimer.current;
                let d = this.victoryAnimationTimer.duration;

                s = Math_Map(c, 0, d, 1, 0.3);
            }

            //
            // Defeat Animation.
            if(this.isPlayingDefeatAnimation) {
                color = chroma.mix(color, "black", this.defeatAnimationTimer.ratio);
                s = 1 - this.defeatAnimationTimer.ratio;
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
        return this._buildRandomTimer(
            BLOCK_VICTORY_ANIM_START_DELAY_MIN,
            BLOCK_VICTORY_ANIM_START_DELAY_MAX
        );
    } // _calcVictoryAnimationStartDelay

    //--------------------------------------------------------------------------
    _calcVictoryAnimationTime()
    {
        return this._buildRandomTimer(
            BLOCK_VICTORY_ANIM_TIME_MIN,
            BLOCK_VICTORY_ANIM_TIME_MAX
        );
    } // _calcVictoryAnimationStartDelay

    //--------------------------------------------------------------------------
    _calcDefeatAnimationStartDelay()
    {
        return this._buildRandomTimer(
            BLOCK_DEFEAT_ANIM_START_DELAY_MIN,
            BLOCK_DEFEAT_ANIM_START_DELAY_MAX
        );
    } // _calcDefeatAnimationStartDelay

    //--------------------------------------------------------------------------
    _calcDefeatAnimationTime()
    {
        return this._buildRandomTimer(
            BLOCK_DEFEAT_ANIM_TIME_MIN,
            BLOCK_DEFEAT_ANIM_TIME_MAX
        );
    } // _calcDefeatAnimationStartDelay

    //--------------------------------------------------------------------------
    _calcVictoryRotationAngle()
    {
        return Math_Map(
            this.victoryAnimationForce.x,
            BLOCK_VICTORY_ANIM_FORCE_MIN_X,
            BLOCK_VICTORY_ANIM_FORCE_MAX_X,
            BLOCK_VICTORY_ANIM_ANGLE_MIN,
            BLOCK_VICTORY_ANIM_ANGLE_MAX
        );
    } // _calcVictoryRotationAngle

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

    //--------------------------------------------------------------------------
    _buildRandomTimer(m, M)
    {
        let t = Math_Random(m, M);
        return new Timer(t);
    } // _buildRandomTimer
}; // class Block
