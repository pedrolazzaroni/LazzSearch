@echo off
echo === Atualizando script de scraping do LazzSearch ===

echo.
echo Verificando dependências Python...
python -c "import requests, bs4, lxml" > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Dependências Python não encontradas.
    echo Instalando dependências necessárias...
    pip install requests beautifulsoup4 lxml
)

echo.
echo Baixando versão mais recente do scraper...
curl -s -o temp-scraper.py https://raw.githubusercontent.com/lazzsearch/scraper-updates/main/scraper.py 2>nul
if %ERRORLEVEL% EQU 0 (
    if exist temp-scraper.py (
        echo Atualizando arquivo de script...
        if not exist server\scripts mkdir server\scripts
        move /y temp-scraper.py server\scripts\scraper.py > nul
        echo Script de scraping atualizado com sucesso!
    ) else (
        echo Não foi possível baixar o script atualizado.
        echo Executando o instalador padrão...
        call install-python-deps.bat
    )
) else (
    echo Erro ao conectar ao repositório remoto.
    echo Executando o instalador padrão como alternativa...
    call install-python-deps.bat
)

echo.
echo === Processo de atualização concluído ===
echo Você pode agora iniciar o LazzSearch com start.bat
echo.
pause
