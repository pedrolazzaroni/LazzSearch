@echo off
echo === Iniciando LazzSearch ===

echo.
echo === Verificando ambiente ===
python --version > nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Python encontrado! O sistema usará web scraping para buscar produtos reais.
    
    REM Verifica se o script Python existe
    if not exist server\scripts\scraper.py (
        echo Criando diretório de scripts...
        if not exist server\scripts mkdir server\scripts
        
        echo Copiando script de scraping...
        copy NUL server\scripts\scraper.py > nul
        
        echo Falha ao encontrar script de scraping. O sistema funcionará em modo de fallback.
    ) else (
        echo Script de scraping encontrado.
    )
    
    REM Verifica se requirements.txt existe e instala dependências
    if exist server\scripts\requirements.txt (
        echo Instalando dependências Python...
        pip install -r server\scripts\requirements.txt > nul 2>&1
        if %ERRORLEVEL% EQU 0 (
            echo Dependências Python instaladas com sucesso.
        ) else (
            echo Aviso: Falha ao instalar algumas dependências Python.
            echo O sistema tentará funcionar com as bibliotecas disponíveis.
        )
    )
) else (
    echo Python não encontrado. O sistema funcionará em modo de fallback sem web scraping.
    echo Para habilitar a busca de produtos reais, instale o Python 3.7 ou superior.
)

echo.
echo === Iniciando servidor ===
start cmd /k "cd server && npm start"
timeout /t 3

echo.
echo === Iniciando cliente ===
start cmd /k "cd client && npm start"

echo.
echo === Serviços iniciados em janelas separadas ===
echo Servidor: http://localhost:5000
echo Cliente: http://localhost:3000
echo.
pause
