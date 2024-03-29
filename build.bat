@echo off

if "%1" == "install" call :install %*
if "%1" == "build" call :build
if "%1" == "clean" call :clean
exit /b 0

:install
echo Installing...
call :build
for /d %%i in ("%USERPROFILE%\.vscode\extensions\%2.%3-*") do rmdir /q /s "%%i"
robocopy /e bin "%USERPROFILE%\.vscode\extensions\%2.%3-%4" 1>nul
call :clean
echo Installing Done.
goto :eof

:build
echo Building...
if not exist bin mkdir bin
call :copy CHANGELOG.md
call :copy extension.js
call :copy icon.png
call :copy package.json
call :copy README.md
call :copyfolder templates
echo Building Done.
goto :eof

:clean
echo Cleaning...
cd bin
rmdir /q /s . 2>nul
echo Cleaning Done.
goto :eof

:copy
copy /y %1 bin\%1 1>nul
goto :eof

:copyfolder
robocopy /e %1 bin\%1 1>nul
goto :eof