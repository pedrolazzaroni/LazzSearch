# Guia do Usuário LazzSearch

## Introdução

O LazzSearch é uma ferramenta de busca e comparação de preços online. Ela consulta dados reais do Google Shopping para apresentar ofertas atualizadas de diversas lojas.

## Requisitos

Para o funcionamento completo com dados reais, você precisa ter:

1. **Node.js** (versão 14 ou superior)
2. **Python** (versão 3.7 ou superior)
3. As bibliotecas Python necessárias (instaladas automaticamente com `install-python-deps.bat`)

## Instalação

1. **Clonagem do repositório**:
   - Clone ou faça download deste repositório
   - Navegue até a pasta do projeto

2. **Instale as dependências**:
   - Execute `install-python-deps.bat` para instalar as dependências Python
   - Execute `cd server && npm install` para instalar as dependências do servidor
   - Execute `cd client && npm install` para instalar as dependências do cliente

## Uso

### Iniciando a aplicação

1. **Método simples**: Execute `start.bat` para iniciar tanto o servidor quanto o cliente
2. **Método manual**:
   - Em uma janela de comando, execute `cd server && npm start`
   - Em outra janela de comando, execute `cd client && npm start`

### Realizando buscas

1. Digite um termo de busca na barra de pesquisa da página principal
2. Pressione Enter ou clique no ícone de lupa
3. Aguarde enquanto o sistema busca produtos reais no Google Shopping

### Interpretando os resultados

- **Preço**: O valor atual do produto na loja indicada
- **Preço original**: Quando disponível, indica o preço anterior (riscado)
- **Loja**: Nome do estabelecimento que vende o produto
- **Avaliações**: Classificação de 0 a 5 estrelas quando disponível

### Filtragem e ordenação

- Use os controles na parte superior dos resultados para:
  - Ordenar por menor preço, maior preço, melhor avaliação ou relevância
  - Filtrar os resultados por loja específica

### Acesso às ofertas

Ao clicar em um produto ou no botão "Ver oferta", você será redirecionado para a página da loja onde o produto está sendo vendido.

## Solução de problemas

### Os resultados de busca não são mostrados

- Verifique se o Python está instalado corretamente
- Execute `install-python-deps.bat` novamente para reinstalar as dependências
- Confira se sua conexão com a internet está funcionando

### As imagens dos produtos não aparecem

- Algumas lojas podem bloquear o acesso direto às imagens
- O sistema tentará encontrar imagens alternativas automaticamente

### Dados desatualizados

- Clique no botão "Limpar Cache" nas ferramentas de desenvolvedor
  (ative clicando três vezes rapidamente no logo LazzSearch)
- Faça uma nova busca para obter os dados mais recentes

## Observações importantes

- O LazzSearch usa web scraping para obter dados em tempo real
- Não armazenamos informações permanentes sobre usuários ou buscas
- A ferramenta é para uso educacional e pessoal apenas
