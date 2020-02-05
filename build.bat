call npm run build
call xcopy weights docs\weights\ /s /f /h
call xcopy masks docs\masks\ /s /f /h
call xcopy assets docs\assets\ /s /f /h