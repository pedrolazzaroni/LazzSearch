@echo off
echo === Limpando Cache do LazzSearch ===

echo.
echo Verificando se o servidor está em execução...
netstat -ano | findstr :5000 > nul
if %ERRORLEVEL% EQU 0 (
    echo Servidor encontrado na porta 5000.
    echo Enviando solicitação para limpar o cache...
    
    REM Tenta limpar o cache via API
    curl -s http://localhost:5000/api/admin/clear-cache > nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo Cache limpo com sucesso!
    ) else (
        echo Não foi possível acessar a API de limpeza de cache.
        echo Verifique se o servidor está funcionando corretamente.
    )
) else (
    echo Servidor não está em execução na porta 5000.
    echo Inicie o servidor primeiro com start.bat ou "cd server && npm start"
)

echo.
echo Limpando cache local do navegador...
echo Para limpar completamente o cache do navegador:
echo 1. Pressione Ctrl+Shift+Delete no seu navegador
echo 2. Selecione "Cookies e dados de sites"
echo 3. Limpe os dados para o site localhost:3000
echo.
pause
