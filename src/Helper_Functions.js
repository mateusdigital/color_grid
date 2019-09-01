//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Helper_Functions.js                                           //
//  Project   : color_grid                                                    //
//  Date      : Aug 30, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//   Helper functions and "hacks" used to create the game.                    //
//                                                                            //
//   The stuff here is used in a very "loose" way to check how the things     //
//   work in javascript without thinking too much about how structure them.   //
//                                                                            //
//   Eventually they will be moved (hopefully in a better way) to the BASE    //
//---------------------------------------------------------------------------~//

//------------------------------------------------------------------------------
function Img2Context(img)
{
    let c = document.createElement("canvas").getContext("2d");
    c.width         = img.width;
    c.height        = img.height;
    c.canvas.width  = img.width;
    c.canvas.height = img.height;

    c.drawImage(img, 0, 0);
    return c;
}

//------------------------------------------------------------------------------
async function LoadTextures()
{
    let texturesPaths = arguments;
    let promise = new Promise((resolve, reject) => {
        let load_count      = texturesPaths.length;
        let loaded_textures = [];

        let callback = function() {
            let path = this.name;
            loaded_textures[path] = Img2Context(this);

            if(--load_count <= 0) {
                resolve(loaded_textures);
            }
        };

        for(let i = 0; i < load_count; ++i) {
            let path = texturesPaths[i];

            let img = new Image();
            loaded_textures[path] = img;

            img.onload = callback;
            img.src    = path;
            img.name   = path;
        }
    });
    return promise;
}

//------------------------------------------------------------------------------
function CreateContext(width, height)
{
    let c = document.createElement("canvas").getContext("2d");
    c.width         = width;
    c.canvas.width  = width;
    c.height        = height;
    c.canvas.height = height;
    return c;
}


//------------------------------------------------------------------------------
let TEMP_CANVAS = null;
function TintImage(image, color)
{
    if(TEMP_CANVAS == null) {
        TEMP_CANVAS = CreateContext(image.width, image.height);
    }
    if(TEMP_CANVAS.width < image.width) {
        TEMP_CANVAS.width         = image.width;
        TEMP_CANVAS.canvas.width  = image.width;
    }
    if(TEMP_CANVAS.height < image.height) {
        TEMP_CANVAS.height        = image.height;
        TEMP_CANVAS.canvas.height = image.height;
    }

    Canvas_SetRenderTarget(TEMP_CANVAS);
        CurrContext.globalCompositeOperation = "source-over";
        CurrContext.fillRect(0, 0, image.width, image.height);

        Canvas_SetFillStyle(color);
        CurrContext.fillRect(0, 0, image.width, image.height);

        CurrContext.globalCompositeOperation = "destination-atop";
        CurrContext.drawImage(image.canvas, 0, 0);
    Canvas_SetRenderTarget(null);
}

//------------------------------------------------------------------------------
function DrawWithTint(img, dx, dy, dw, dh, tint)
{
    TintImage(img, tint);
    CurrContext.drawImage(
        TEMP_CANVAS.canvas,
        0, 0, img.width, img.height,
        dx, dy, dw, dh
    );
}

//------------------------------------------------------------------------------
function GetContextTransform()
{
    if(typeof(CurrContext.getTransform) == "function") {
        return CurrContext.getTransform();
    }

    if(CurrContext.currentTransform) {
        return CurrContext.currentTransform;
    }

    if(CurrContext.mozCurrentTransform) {
        return CurrContext.mozCurrentTransform;
    }
}
