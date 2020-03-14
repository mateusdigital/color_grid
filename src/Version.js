//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const COLOR_GRID_VERSION_MAJOR = 1;
const COLOR_GRID_VERSION_MINOR = 0;
const COLOR_GRID_VERSION_BABY  = 0;

//----------------------------------------------------------------------------//
// Public Functions                                                           //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function GetVersion()
{
    return String_Cat(
        COLOR_GRID_VERSION_MAJOR, ".",
        COLOR_GRID_VERSION_MINOR, ".",
        COLOR_GRID_VERSION_BABY
    );
}
