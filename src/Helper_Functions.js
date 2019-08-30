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

