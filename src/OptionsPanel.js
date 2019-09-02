
class OptionsPanel
{
    //--------------------------------------------------------------------------
    constructor()
    {
        // Transform
        this.currX   = this._getOffscreenPosition();
        this.startX  = null;
        this.targetX = null;

        // UI
        this._buildColorSliderUI();
        this._buildSizeSliderUI ();
        this._buildSaveUI       ();
        this._buildCreditsUI    ();

        // Animation
        this.animationTimer = new Timer(0.3);
        this.isAnimating    = false;
        this.isVisible      = false;

        // State
        this.desiredRows   = -1;
        this.desiredCols   = -1;
        this.desiredColors = -1;
    } // ctor

    //--------------------------------------------------------------------------
    show()
    {
        this.startX  = this._getOffscreenPosition();
        this.targetX = this._getInScreenPosition ();

        this.animationTimer.start();
        this.isAnimating = true;

        this._updateState();
        this._updateUI   ();
    } // show

    //--------------------------------------------------------------------------
    hide()
    {
        this.startX  = this._getInScreenPosition ();
        this.targetX = this._getOffscreenPosition();

        this.animationTimer.start();
        this.isAnimating = true;
    } // hide

    //--------------------------------------------------------------------------
    update(dt)
    {
        this.isVisible = this.currX > this._getOffscreenPosition();
        if(this.isAnimating) {
            this.animationTimer.update(dt);
            if(this.animationTimer.isDone) {
                this.isAnimating = false;
            }

            this.currX = Math_Lerp(this.startX, this.targetX, this.animationTimer.ratio);
        } else {
            if(this.isVisible) {
                this.saveButton  .update(dt);
                this.colorsSlider.update(dt);
                this.sizeSlider  .update(dt);
            }
        }
    } // update

    //--------------------------------------------------------------------------
    draw()
    {
        if(!this.isVisible) {
            return;
        }

        Canvas_Push();
            Canvas_Translate(this.currX, 0);
            Canvas_ClearRect(
                -Canvas_Width  / 2,
                -Canvas_Height / 2,
                Canvas_Width,
                Canvas_Height,
                palette.getBackgroundColor()
            );

            this.colorsSlider.draw();
            this.sizeSlider  .draw();

            Canvas_SetFillStyle("white");
            this.colorsLabel.draw();
            this.sizeLabel  .draw();

            this.saveButton.draw();
            Canvas_SetFillStyle("White");
            this.saveLabel.draw();

            Canvas_Push();
                Canvas_Translate(0, 80);
                for(let i = 0; i < this.texts.length; ++i) {
                    this.texts[i].draw();
                }
            Canvas_Pop();
        Canvas_Pop();
    } // draw

    //--------------------------------------------------------------------------
    _getInScreenPosition()
    {
        return 0;
    } // _getInScreenPosition

    //--------------------------------------------------------------------------
    _getOffscreenPosition()
    {
        return Canvas_Edge_Left * 2;
    } // _getOffscreenPosition

    //--------------------------------------------------------------------------
    _buildColorSliderUI()
    {
        this.colorsSlider = new UISlider(
            chroma("red"),   chroma("gray"),
            chroma("white"), chroma("white").darken(2),
            Vector_Create(0, Canvas_Edge_Top + 50),
            Vector_Create(200, 5),
            (s, value) => {
                let count = Math_Int(Math_Map(
                    value,
                    0, 1,
                    GAME_OPTIONS_MIN_COLORS,
                    GAME_OPTIONS_MAX_COLORS
                ));

                // Update the Text.
                let str = String_Cat("Colors: ", count);
                this.colorsLabel.setString(str);

                // Save the value.
                this.desiredColors = count;
            }
        );
        this.colorsLabel = new UIText(
            "colors",
            Vector_Create(
                this.colorsSlider.position.x,
                this.colorsSlider.position.y + this.colorsSlider.size.y + 15
            ),
            16, "arial"
        );
    } // _buildColorSliderUI

    //--------------------------------------------------------------------------
    _buildSizeSliderUI()
    {
        this.sizeSlider = new UISlider(
            chroma("red"),   chroma("gray"),
            chroma("white"), chroma("white").darken(2),
            Vector_Create(0, this.colorsLabel.position.y + this.colorsLabel.height + 30),
            Vector_Create(200, 5),
            (s, value) => {
                let count = Math_Int(Math_Map(
                    value,
                    0, 1,
                    GAME_OPTIONS_MIN_ROWS,
                    GAME_OPTIONS_MAX_ROWS
                ));

                // Update the Text.
                let str = String_Cat("Size: ", count);
                this.sizeLabel.setString(str);

                // Save the value.
                this.desiredCols = count;
                this.desiredRows = count;
            }
        );
        this.sizeLabel = new UIText(
            "size",
            Vector_Create(
                this.sizeSlider.position.x,
                this.sizeSlider.position.y + this.sizeSlider.size.y + 15
            ),
            16, "arial"
        );
    } // _buildSizeSliderUI

    //--------------------------------------------------------------------------
    _buildSaveUI()
    {
        let button_context = CreateContext(200, 50);
        Canvas_SetRenderTarget(button_context);
            Canvas_SetFillStyle("white");
            Canvas_FillRoundedRect(0, 0, 200, 50, 10);
        Canvas_SetRenderTarget(null);

        this.saveButton = new UIButton(
            button_context,
            chroma("red"),
            chroma("red").brighten(1),
            chroma("red").brighten(2),
            Vector_Create(-100, -60),
            Vector_Create(200, 50),
            ()=>{
                gameOptions.applyOptions(
                    this.desiredColors,
                    this.desiredRows,
                    this.desiredCols,
                );
                ResetGame();
                this.hide();
            }
        );

        this.saveLabel = new UIText(
            "SAVE",
            Vector_Create(0, -39),
            20,
            "arial"
        );
    } // _buildSaveUI

    //--------------------------------------------------------------------------
    _buildCreditsUI()
    {
        this.texts = [];

        let t = null;
        t = new UIText("Created by:", Vector_Create(0, 0), 10, "arial");
        this.texts.push(t);
        t = new UIText("stdmatt", Vector_Create(0, 20), 16, "arial");
        this.texts.push(t);

        t = new UIText("Thanks to:", Vector_Create(0, 50), 10, "arial");
        this.texts.push(t);
        t = new UIText("alex", Vector_Create(0, 70), 16, "arial");
        this.texts.push(t);

        t = new UIText("Thanks for playing!", Vector_Create(0, 120), 20, "arial");
        this.texts.push(t);
    } // _buildCreditsUI

    _updateState()
    {
        this.desiredRows   = gameOptions.gridCols;
        this.desiredCols   = gameOptions.gridCols;
        this.desiredColors = gameOptions.colorsCount;

        Log(this.desiredRows, this.desiredCols, this.desiredColors);
    }

    _updateUI()
    {
        let sv = Math_Map(
            this.desiredRows,
            GAME_OPTIONS_MIN_ROWS,
            GAME_OPTIONS_MAX_ROWS,
            0, 1
        );
        this.sizeSlider.updateValue(sv);

        let cv = Math_Map(
            this.desiredColors,
            GAME_OPTIONS_MIN_COLORS,
            GAME_OPTIONS_MAX_COLORS,
            0, 1
        );
        this.colorsSlider.updateValue(cv);
    }
}; // class OptionsPanel
