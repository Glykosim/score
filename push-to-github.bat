@echo off
setlocal EnableExtensions EnableDelayedExpansion

cd /d "%~dp0"

echo.
echo === Git status ===
git status --short
if errorlevel 1 goto :error

echo.
git diff --quiet
set HAS_CHANGES=%errorlevel%

if "%HAS_CHANGES%"=="0" (
    echo Ingen lokale endringer a committe.
) else (
    echo.
    set /p COMMIT_MSG=Commit-melding: 
    if "!COMMIT_MSG!"=="" set "COMMIT_MSG=Oppdater scoreverktøy"

    git add .
    if errorlevel 1 goto :error

    git commit -m "!COMMIT_MSG!"
    if errorlevel 1 goto :error
)

echo.
echo === Pusher til GitHub ===
git push origin main
if errorlevel 1 goto :error

echo.
echo Ferdig. Endringene er pushet til GitHub.
pause
exit /b 0

:error
echo.
echo Noe gikk galt. Se feilmeldingen over.
pause
exit /b 1
