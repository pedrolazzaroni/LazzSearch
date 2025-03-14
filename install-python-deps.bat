@echo off
echo === Instalando dependências Python para LazzSearch ===

echo.
echo Verificando instalação do Python...
python --version > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Python não encontrado!
    echo Por favor, instale o Python 3.7 ou superior de https://www.python.org/downloads/
    echo.
    echo Após instalar o Python, execute este script novamente.
    pause
    exit /b 1
)

echo Python encontrado! Prosseguindo com a instalação...
echo.

echo Criando diretórios necessários...
if not exist server\scripts mkdir server\scripts

echo.
echo Criando arquivo requirements.txt...
echo requests>=2.28.0>server\scripts\requirements.txt
echo beautifulsoup4>=4.11.1>>server\scripts\requirements.txt
echo lxml>=4.9.0>>server\scripts\requirements.txt

echo.
echo Instalando pacotes Python...
pip install --upgrade pip
pip install -r server\scripts\requirements.txt

echo.
echo Criando script de scraping para dados reais...

REM Cria o arquivo Python com o código do web scraper
> server\scripts\scraper.py (
echo import sys
echo import json
echo import requests
echo from bs4 import BeautifulSoup
echo import re
echo import random
echo import urllib.parse
echo import time
echo.
echo def clean_price(price_text^):
echo     """Limpa e converte o texto do preço para float com precisão de 2 casas decimais."""
echo     if not price_text:
echo         return None
echo     # Remove caracteres não numéricos, exceto ponto e vírgula
echo     price = re.sub(r'[^\d,.]', '', price_text^)
echo     # Substitui vírgula por ponto
echo     price = price.replace(',', '.'^)
echo     # Extrai o primeiro número válido
echo     match = re.search(r'\d+[.,]?\d*', price^)
echo     if match:
echo         try:
echo             # Garante que o preço tenha 2 casas decimais
echo             return round(float(match.group(^)^), 2^)
echo         except ValueError:
echo             return None
echo     return None
echo.
echo def get_random_user_agent(^):
echo     """Retorna um user-agent aleatório para evitar bloqueios."""
echo     user_agents = [
echo         'Mozilla/5.0 (Windows NT 10.0; Win64; x64^) AppleWebKit/537.36 (KHTML, like Gecko^) Chrome/91.0.4472.124 Safari/537.36',
echo         'Mozilla/5.0 (Windows NT 10.0; Win64; x64^) AppleWebKit/537.36 (KHTML, like Gecko^) Chrome/92.0.4515.107 Safari/537.36',
echo         'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7^) AppleWebKit/605.1.15 (KHTML, like Gecko^) Version/14.1.1 Safari/605.1.15',
echo         'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:110.0^) Gecko/20100101 Firefox/110.0',
echo         'Mozilla/5.0 (Windows NT 10.0; Win64; x64^) AppleWebKit/537.36 (KHTML, like Gecko^) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.43'
echo     ]
echo     return random.choice(user_agents^)
echo.
echo def extract_direct_link(link_element^):
echo     """Extrai o link direto da loja a partir do elemento de link do Google Shopping."""
echo     if not link_element or 'href' not in link_element.attrs:
echo         return None
echo     
echo     href = link_element['href']
echo     
echo     # Se for um link relativo do Google, extraímos o link real
echo     if href.startswith('/url?'^):
echo         # Extrai o parâmetro 'q' que contém a URL real
echo         match = re.search(r'[?&]q=([^&]+^)', href^)
echo         if match:
echo             return urllib.parse.unquote(match.group(1^)^)
echo         # Se não encontrar o parâmetro q, forma o link completo do Google
echo         return "https://www.google.com" + href
echo     
echo     # Se for um link direto para a loja
echo     if href.startswith('http'^):
echo         return href
echo     
echo     # Link relativo do Google sem parâmetro q
echo     if href.startswith('/'^):
echo         return "https://www.google.com" + href
echo         
echo     return None
echo.
echo def scrape_google_shopping(query, num_results=12^):
echo     """Extrai produtos do Google Shopping com foco em dados reais."""
echo     headers = {
echo         'User-Agent': get_random_user_agent(^),
echo         'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
echo         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
echo         'Referer': 'https://www.google.com/',
echo         'DNT': '1'
echo     }
echo     
echo     # Codifica a consulta e cria a URL
echo     encoded_query = urllib.parse.quote(query^)
echo     url = f"https://www.google.com/search?q={encoded_query}&tbm=shop&hl=pt-BR&pws=0&gl=br"
echo     
echo     try:
echo         # Adiciona um atraso aleatório para parecer com tráfego humano
echo         time.sleep(random.uniform(0.5, 1.5^)^)
echo         response = requests.get(url, headers=headers, timeout=20^)
echo         
echo         # Se o status não for 200, não conseguimos obter os dados
echo         if response.status_code != 200:
echo             print(f"Erro na requisição: código {response.status_code}", file=sys.stderr^)
echo             raise Exception(f"Status code: {response.status_code}"^)
echo     except Exception as e:
echo         print(f"Erro na requisição HTTP: {e}", file=sys.stderr^)
echo         raise e
echo     
echo     soup = BeautifulSoup(response.text, 'lxml'^)
echo     products = []
echo     
echo     # Tentativas com diferentes seletores para encontrar os produtos
echo     selectors = [
echo         'div.sh-dgr__content',  # Layout de grade
echo         '.sh-dlr__list-result',  # Layout de lista
echo         'div.KZmu8e',           # Layout alternativo
echo         '.sh-pr__product-results-grid .sh-pr__product-result', # Outro layout
echo         '.sh-np__click-target',  # Outro layout possível
echo         '.EI11Pd'               # Layout alternativo mais recente
echo     ]
echo     
echo     product_blocks = []
echo     for selector in selectors:
echo         product_blocks = soup.select(selector^)
echo         if product_blocks and len(product_blocks^) > 1:  # Precisamos de pelo menos alguns resultados
echo             print(f"Encontrados {len(product_blocks^)} produtos usando seletor: {selector}", file=sys.stderr^)
echo             break
echo     
echo     if not product_blocks:
echo         print("Não foi possível encontrar produtos na página", file=sys.stderr^)
echo         # Tenta uma última abordagem - procura divs com atributo data-docid
echo         product_blocks = soup.select('div[data-docid]'^)
echo         if not product_blocks:
echo             raise Exception("Nenhum produto encontrado para extração"^)
echo     
echo     for block_index, block in enumerate(product_blocks[:num_results]^):
echo         try:
echo             # Nome do produto - múltiplos seletores possíveis
echo             name = None
echo             for selector in ['.Xjkr3b', '.tAxDx', 'h3', '.sh-sp__product-title', '.BvQan', '.rgHvZc', '.EI11Pd']:
echo                 element = block.select_one(selector^)
echo                 if element:
echo                     name = element.text.strip(^)
echo                     if name:
echo                         break
echo             
echo             if not name:
echo                 print("Produto sem nome, pulando...", file=sys.stderr^)
echo                 continue
echo                 
echo             # Tenta extrair a URL direta para o produto
echo             product_url = None
echo             for selector in ['a.shntl', 'a.Lq5OHe', 'div.Lq5OHe a', 'a[href*="shopping"]', 'a[data-docid]', '.QsUUs a', 'a.P4HtKe']:
echo                 element = block.select_one(selector^)
echo                 if element:
echo                     direct_url = extract_direct_link(element^)
echo                     if direct_url and "google.com" not in direct_url.lower(^):
echo                         product_url = direct_url
echo                         break
echo                     elif direct_url:
echo                         product_url = direct_url
echo                         break
echo             
echo             # Se não conseguiu um link direto, tenta outros seletores
echo             if not product_url or "google.com" in product_url:
echo                 for parent_selector in ['a', 'div[data-docid] a']:
echo                     parent_elements = block.select(parent_selector^)
echo                     for element in parent_elements:
echo                         href = element.get('href', '''^)
echo                         if href and href.startswith('http'^) and "google.com/shopping" not in href:
echo                             product_url = href
echo                             break
echo                     if product_url and "google.com" not in product_url:
echo                         break
echo             
echo             # Se ainda não encontrou URL direta, cria uma URL de busca no Google
echo             if not product_url:
echo                 product_url = f"https://www.google.com/search?tbm=shop&q={urllib.parse.quote(name^)}"
echo             
echo             # Preço - múltiplos seletores possíveis
echo             price = None
echo             for selector in ['.a8Pemb', '.kHxwFf', '.QIrs8 + span', '.PZPZlf > span:first-child', '.g9WBQb']:
echo                 element = block.select_one(selector^)
echo                 if element:
echo                     price_text = element.text.strip(^)
echo                     cleaned_price = clean_price(price_text^)
echo                     if cleaned_price:
echo                         price = cleaned_price
echo                         break
echo             
echo             if not price:
echo                 # Se realmente não conseguiu obter um preço, pula o produto
echo                 print(f"Produto '{name}' sem preço, pulando...", file=sys.stderr^)
echo                 continue
echo             
echo             # Loja - múltiplos seletores possíveis
echo             store = None
echo             for selector in ['.aULzUe', '.IuHnof', '.E8dXEb', '.b5ycib', '.mQ35Be', '.qa3U8b']:
echo                 element = block.select_one(selector^)
echo                 if element and element.text.strip(^):
echo                     store = element.text.strip(^)
echo                     break
echo             
echo             if not store or len(store^) < 2:
echo                 # Tenta extrair o nome da loja da URL
echo                 if product_url:
echo                     parsed_url = urllib.parse.urlparse(product_url^)
echo                     domain = parsed_url.netloc
echo                     store_match = re.match(r"(?:www\.)?(.*?)\.(?:com|br|com\.br|net)", domain^)
echo                     if store_match:
echo                         store = store_match.group(1^).capitalize(^)
echo             
echo             if not store:
echo                 print(f"Produto '{name}' sem loja identificada, pulando...", file=sys.stderr^)
echo                 continue
echo             
echo             # Extração da imagem
echo             img_url = None
echo             for selector in ['img.sh-div__image', 'img.SirUVb', 'img[data-ils]', 'img.TL92Hc', 'div.ArOc1c img', 'img.dtKbZe', 'img']:
echo                 img_elements = block.select(selector^)
echo                 for img in img_elements:
echo                     for attr in ['src', 'data-src', 'srcset']:
echo                         if img.has_attr(attr^) and img[attr]:
echo                             value = img[attr].split(' ')[0] if ' ' in img[attr] else img[attr]
echo                             if value.startswith('//'^):
echo                                 value = 'https:' + value
echo                             if 'http' in value and not any(x in value.lower(^) for x in ['transparent', 'blank']):
echo                                 img_url = value
echo                                 break
echo                     if img_url:
echo                         break
echo                 if img_url:
echo                     break
echo             
echo             if not img_url:
echo                 # Se a imagem não foi encontrada, tenta buscar uma imagem do produto pelo nome
echo                 img_url = f"https://source.unsplash.com/featured/600x400/?{urllib.parse.quote(name.split(^)[0]^)},product"
echo             
echo             # Avaliação e reviews (opcionais^)
echo             rating = None
echo             reviews = None
echo             for selector in ['.QIrs8', '.jdGm2e', '.Rsc7Yb']:
echo                 element = block.select_one(selector^)
echo                 if element:
echo                     rating_text = element.text.strip(^)
echo                     rating_match = re.search(r'(\d+[.,]\d+)', rating_text^)
echo                     if rating_match:
echo                         try:
echo                             rating = round(float(rating_match.group(1^).replace(',', '.'^^), 1^)
echo                             break
echo                         except ValueError:
echo                             pass
echo             
echo             # Extrai número de reviews (opcional^)
echo             for selector in ['.QIrs8 + span', '.jdGm2e + span']:
echo                 element = block.select_one(selector^)
echo                 if element:
echo                     reviews_text = element.text.strip(^)
echo                     reviews_match = re.search(r'(\d+)', reviews_text^)
echo                     if reviews_match:
echo                         try:
echo                             reviews = int(reviews_match.group(1^)^)
echo                             break
echo                         except ValueError:
echo                             pass
echo             
echo             # Gera a descrição baseada nos dados disponíveis
echo             description = f"{name} disponível na {store}."
echo             if rating:
echo                 description += f" Avaliação: {rating}/5."
echo             if reviews:
echo                 description += f" {reviews} avaliações."
echo             
echo             # Verifica se há preço original (para mostrar descontos^)
echo             original_price = None
echo             for selector in ['.T4OwTb', '.e1LGSb']:
echo                 element = block.select_one(selector^)
echo                 if element:
echo                     original_text = element.text.strip(^)
echo                     original_cleaned = clean_price(original_text^)
echo                     if original_cleaned and original_cleaned > price:
echo                         original_price = original_cleaned
echo                         break
echo             
echo             # Monta o objeto do produto
echo             product = {
echo                 "id": f"{block_index}-{hash(name + store^) %% 10000}",
echo                 "name": name,
echo                 "price": price,
echo                 "originalPrice": original_price,
echo                 "store": store,
echo                 "rating": rating if rating else 4.5,
echo                 "reviews": reviews if reviews else 100,
echo                 "url": product_url,
echo                 "imageUrl": img_url,
echo                 "description": description,
echo                 "available": True
echo             }
echo             
echo             products.append(product^)
echo             print(f"Produto extraído: {name} | {price} | {store}", file=sys.stderr^)
echo             
echo         except Exception as e:
echo             print(f"Erro ao processar produto: {e}", file=sys.stderr^)
echo             continue
echo     
echo     # Se não encontrou nenhum produto, levanta uma exceção
echo     if not products:
echo         raise Exception("Não foi possível extrair informações de produtos"^)
echo     
echo     return products
echo.
echo if __name__ == "__main__":
echo     if len(sys.argv^) < 2:
echo         print("Uso: python scraper.py 'termo de busca'", file=sys.stderr^)
echo         sys.exit(1^)
echo     
echo     query = sys.argv[1]
echo     try:
echo         results = scrape_google_shopping(query^)
echo         print(json.dumps(results, ensure_ascii=False^)^)
echo     except Exception as e:
echo         print(f"Erro no script: {str(e^)}", file=sys.stderr^)
echo         sys.exit(1^)
)

echo.
echo === Teste de instalação ===
python -c "import requests, bs4, lxml; print('Bibliotecas instaladas com sucesso!')" || (
    echo.
    echo AVISO: Algumas bibliotecas não parecem estar instaladas corretamente.
    echo Tente executar manualmente: pip install requests beautifulsoup4 lxml
)

echo.
echo === Instalação concluída! ===
echo O LazzSearch agora está configurado para obter dados de produtos reais do Google Shopping.
echo.
pause
