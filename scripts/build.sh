#!/usr/bin/env bash
##~---------------------------------------------------------------------------##
##                        _      _                 _   _                      ##
##                    ___| |_ __| |_ __ ___   __ _| |_| |_                    ##
##                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   ##
##                   \__ \ || (_| | | | | | | (_| | |_| |_                    ##
##                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   ##
##                                                                            ##
##  File      : build.sh                                                      ##
##  Project   : color_grid                                                    ##
##  Date      : Mar 14, 2020                                                  ##
##  License   : GPLv3                                                         ##
##  Author    : stdmatt <stdmatt@pixelwizards.io>                             ##
##  Copyright : stdmatt 2020                                                  ##
##                                                                            ##
##  Description :                                                             ##
##                                                                            ##
##---------------------------------------------------------------------------~##

##----------------------------------------------------------------------------##
## Imports                                                                    ##
##----------------------------------------------------------------------------##
source /usr/local/src/stdmatt/shellscript_utils/main.sh


##----------------------------------------------------------------------------##
## Variables                                                                  ##
##----------------------------------------------------------------------------##
PROJECT_NAME="color grid";
PROJECT_PACKAGE_NAME="color_grid";

SCRIPT_DIR="$(pw_get_script_dir)";
ROOT_DIR="$(pw_abspath "${SCRIPT_DIR}/..")";
BUILD_DIR="${ROOT_DIR}/build";
DIST_DIR="${ROOT_DIR}/dist";
TO_COPY="libs/ src/ res/ css/ img/ index.html";


##----------------------------------------------------------------------------##
## Script                                                                     ##
##----------------------------------------------------------------------------##
#
# Build
echo "Cleaning build directory";
rm    -rf "$BUILD_DIR";
mkdir -p  "$BUILD_DIR";


echo "Copying files to build directory";
for ITEM in $TO_COPY; do
    cp -R "${ROOT_DIR}/${ITEM}" "${BUILD_DIR}";
done;

find ${BUILD_DIR} -iname ".git*" -exec rm -rf {} \;


##
## Dist
test -z "$(pw_getopt_exists "--dist" "$@")" && exit;
echo "Creating the distribution artifact!!!";

FINAL_VERSION=$(bump-the-version  \
    "${ROOT_DIR}/src/Version.js"     \
    "const COLOR_GRID_VERSION"       \
    show                             \
);

echo "Cleaning dist directory";
rm    -rf "$DIST_DIR";
mkdir -p  "$DIST_DIR";

echo "Creating zip file";
ZIP_FILENAME="${PROJECT_PACKAGE_NAME}_v${FINAL_VERSION}.zip";
cd ${BUILD_DIR}
zip -r "${ZIP_FILENAME}" ".";
mv "${ZIP_FILENAME}" ${DIST_DIR};
cd -
