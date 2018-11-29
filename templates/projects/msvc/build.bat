@echo off

rem Configure the output file name.
rem %1 = Debug/Release, %2 = x86/x64
set out=<name:[\\/:*?"<>|],_>.exe
set dir=\%1\%2

rem Configure the compiler and linker options.
rem https://docs.microsoft.com/cpp/build/reference/compiler-options-listed-by-category
set CL=/EHsc /Fd"obj%dir%\\" /Fo"obj%dir%\\" /Fe"bin%dir%\%out%" /Iinclude /std:<standard>
set LINK=/LIBPATH:lib
if %1 == Debug (
    rem Configure additional options for debug.
    set _CL_=/MDd /Od /Zi
    set _LINK_=/DEBUG:FASTLINK
) else if %1 == Release (
    rem Configure additional options for release.
    set _CL_=/MD /O2 /DNDEBUG
    set _LINK_=/OPT:REF,ICF,LBR
)

set arg=x64
if /i "%PROCESSOR_ARCHITECTURE%" == "x86" if not defined PROCESSOR_ARCHITEW6432 set arg=x86
if not %2 == %arg% set arg=%arg%_%2
call "<msvc>" %arg%

if not exist "obj%dir%\" mkdir "obj%dir%\"
if not exist "bin%dir%\" mkdir "bin%dir%\"
cl.exe src\*.cpp

if "%3" == "run" if %errorlevel% == 0 (
    start "" cmd /c ""bin%dir%\%out%" & pause"
)
exit