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
async function LoadTextures()
{
    let texturesPaths = arguments;
    let promise = new Promise((resolve, reject) => {
        let load_count      = texturesPaths.length;
        let loaded_textures = [];

        let callback = function() {
            if(--load_count <= 0) {
                resolve(loaded_textures);
            }
        };

        for(let i = 0; i < load_count; ++i) {
            let img = new Image();
            loaded_textures.push(img);

            img.onload = callback;
            img.src    = texturesPaths[i];
        }
    });
    return promise;
}
