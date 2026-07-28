# Auren Price Calculator

Calculadora profissional de precificação para Dropshipping — Chrome/Brave (Manifest V3). Calcula preço de venda, margem, ROI, ROAS e CPA em tempo real a partir dos custos do produto e das taxas do mercado (gateway, checkout, IOF, imposto, marketing, despesas extras).

Stack: **Manifest V3 · React 18 · TypeScript · Vite · TailwindCSS · Chrome Storage API**.

## Instalação

Pré-requisito: Node.js 18+.

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Abre um servidor Vite normal no navegador (não como extensão). O popup roda como uma página web comum: o `storage` cai automaticamente para `localStorage` quando `chrome.storage` não está disponível (veja [src/storage/chromeStorage.ts](src/storage/chromeStorage.ts)), então todo o fluxo de cálculo, perfis e persistência funciona igual fora da extensão — ideal para iterar rápido na UI sem recarregar a extensão a cada mudança.

## Build de produção

```bash
npm run build
```

Gera a pasta `dist/` pronta para carregar no Chrome: `index.html` + assets do popup, `manifest.json` e os ícones (`icons/icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`) são copiados automaticamente pelo `vite-plugin-static-copy` (config em [vite.config.ts](vite.config.ts)).

Outros scripts úteis:

```bash
npm run typecheck   # tsc -b, sem gerar dist
npm run lint         # ESLint (zero warnings tolerados)
npm run format       # Prettier
npm run icons        # regenera os PNGs do ícone (scripts/generate-icons.mjs)
npm run preview      # serve o build de produção localmente
```

## Como carregar no Chrome (Load unpacked)

1. Rode `npm run build`.
2. Abra `chrome://extensions` (ou `brave://extensions` no Brave).
3. Ative **Modo do desenvolvedor** (canto superior direito).
4. Clique em **Carregar sem compactação** (Load unpacked).
5. Selecione a pasta `dist/` gerada pelo build.
6. Fixe o ícone da extensão na barra do navegador e clique para abrir o popup (420×700px).

Sempre que alterar o código, rode `npm run build` de novo e clique no botão de recarregar (⟳) do card da extensão em `chrome://extensions`.

## Estrutura do projeto

```
src/
  types/         Tipos TypeScript compartilhados (Profile, CalculatorInputs/Results, Simulator, SmartMarkup, Storage, Currency)
  constants/     Perfis padrão (Brasil/México/EUA/Europa), faixas de margem, chaves de storage, moedas suportadas
  utils/
    calculations/  Motores de cálculo puros (pricingCalculator, simulatorCalculator, smartMarkupCalculator)
    format.ts      Formatação de moeda/percentual/multiplicador/data (pt-BR, vírgula decimal)
    currency.ts    Conversão entre moedas, símbolo e locale de cada moeda
    numberInput.ts Sanitização de digitação (bloqueia letras, aceita vírgula/ponto)
    clamp.ts       Clamp de percentuais 0–100
  storage/       Wrapper sobre chrome.storage.local (com fallback localStorage) + load/save do estado
  services/
    profileService.ts       CRUD de perfis (criar, duplicar, resetar, aplicar taxas)
    exportImportService.ts  Exportar/Importar JSON com validação de schema
    clipboardService.ts     Copiar resultados formatados para a área de transferência
    ExchangeRateService.ts  Busca e cacheia a cotação (AwesomeAPI) — único módulo que fala com a API
    scrapers/                Interfaces + stubs para captura futura de preços (AliExpress, CJ, 1688, Amazon)
    currency/                 Stub legado (não usado) de conversão para os scrapers — não confundir com ExchangeRateService.ts
  context/
    CalculatorContext.tsx  Fonte única de verdade da Calculadora (perfis, custos, taxas, resultados calculados)
    CurrencyContext.tsx    Moeda base, cotações em cache e função de conversão, compartilhados por todas as abas
  hooks/         useSimulator, useSmartMarkup, useToast
  components/
    ui/           Primitivos reutilizáveis (Button, Card, NumberField, MoneyField, PercentField, Select, Tabs, Badge, Toast, Spinner...)
    icons/         Ícones SVG inline (sem dependência externa)
    layout/        AppShell, Header, BaseCurrencySelector (seletor de "Moeda Base")
    currency/      ExchangeRateCard — painel "Cotação" (taxas, última atualização, botão Atualizar)
    calculator/    Formulários e painel de resultados da aba Calculadora
    simulator/     Formulário e resultados da aba Simulador
    smartMarkup/   Formulário e resultados da aba Markup Inteligente
  pages/         Uma página por aba (CalculatorPage, SimulatorPage, SmartMarkupPage)
  App.tsx        Composição das abas + CurrencyProvider + CalculatorProvider
  main.tsx       Entry point (React root + fontes)
manifest.json    Manifest V3 (popup + ícones + permissão "storage" + host_permission da AwesomeAPI)
scripts/generate-icons.mjs  Gera os PNGs do ícone (pngjs, sem dependência nativa)
```

**Clean Architecture**: `types` e `utils/calculations` não dependem de React nem de storage — são funções puras testáveis isoladamente. `storage`/`services` não sabem nada de UI. `context` conecta storage + cálculo ao React. `components`/`pages` só consomem o context e chamam services — nenhuma regra de negócio mora em componente.

## Como adicionar novas funcionalidades

- **Novo campo de custo/taxa**: adicione o campo em [src/types/calculator.ts](src/types/calculator.ts) (`CalculatorInputs`), inclua a fórmula em [src/utils/calculations/pricingCalculator.ts](src/utils/calculations/pricingCalculator.ts), e adicione o campo em [src/components/calculator/FeesForm.tsx](src/components/calculator/FeesForm.tsx) (ou `CostForm.tsx`). Se for um percentual editável por perfil, inclua também em `ProfileFees` ([src/types/profile.ts](src/types/profile.ts)) e nos presets em [src/constants/defaultProfiles.ts](src/constants/defaultProfiles.ts).
- **Nova aba**: crie a página em `src/pages/`, o(s) componente(s) em `src/components/<nome-da-aba>/`, registre a aba em `TABS` e no switch de conteúdo em [src/App.tsx](src/App.tsx).
- **Captura automática de preços (AliExpress, CJ Dropshipping, 1688, Amazon)**: as interfaces já existem em [src/services/scrapers/](src/services/scrapers/) (`ProductScraper`, `ScrapedProduct`). Para ativar: (1) implemente `scrape(document)` no scraper correspondente lendo o DOM/JSON da página, (2) registre um `content_scripts` no `manifest.json` apontando para o domínio do marketplace, (3) crie um content script que roda `findScraperForUrl(location.href)?.scrape(document)` e envia o resultado ao popup via `chrome.runtime.sendMessage`. Nenhuma mudança é necessária no motor de cálculo — o resultado do scraper alimenta os mesmos campos `productCost`/`shipping` do `CalculatorContext`.
- **Multi-moeda (BRL/USD/MXN)**: ver seção [Câmbio de Moedas](#câmbio-de-moedas) abaixo.
- **Histórico de cálculos / comparação de cenários / dashboard**: adicione um novo slice de estado em `AurenStorageSchema` ([src/types/storage.ts](src/types/storage.ts)), persista via `saveState`/`loadState` ([src/storage/profileStorage.ts](src/storage/profileStorage.ts)), e crie uma nova aba seguindo o padrão de "Nova aba" acima.
- **Sincronização entre dispositivos**: troque `chrome.storage.local` por `chrome.storage.sync` em [src/storage/chromeStorage.ts](src/storage/chromeStorage.ts) (respeitando o limite de ~100KB do `sync`) — nenhum outro arquivo depende da API do Chrome diretamente.

## Fórmulas implementadas

Todas em [src/utils/calculations/pricingCalculator.ts](src/utils/calculations/pricingCalculator.ts):

```
Custo Produto     = produto + frete
Preço Venda       = (produto + frete) × markup
Gateway/Checkout/IOF/Imposto/Marketing/Extras = preçoVenda × percentual%
Lucro Líquido     = preçoVenda − produto − frete − gateway − checkout − iof − imposto − marketing − extras
Margem            = lucro ÷ preçoVenda
CPA Máximo        = lucro líquido
CPA Ideal         = CPA Máximo × 0.80
Break Even ROAS   = preçoVenda ÷ CPA Máximo
```

Indicador de margem: 🟢 Excelente (≥35%) · 🟡 Boa (≥25%) · 🟠 Atenção (≥15%) · 🔴 Não recomendado (<15%).

## Perfis

Brasil, México, Estados Unidos e Europa vêm pré-configurados com taxas de gateway/checkout/IOF/imposto/marketing/markup de mercado (100% editáveis). Cada perfil guarda seu próprio conjunto de taxas; **Produto** e **Frete** são compartilhados entre perfis (é o custo real do produto que você está analisando, independente de qual mercado está simulando).

- **Salvar Perfil**: grava as taxas editadas no perfil ativo.
- **Novo Perfil**: cria um perfil customizado a partir das taxas atuais (editadas ou não).
- **Duplicar Perfil**: clona o perfil ativo (já salvo) com um novo nome.
- **Excluir Perfil**: remove o perfil ativo (pede confirmação inline; bloqueado se for o único perfil restante).
- **Resetar**: restaura as taxas do perfil para o preset original (perfis Brasil/México/EUA/Europa) ou para zero (perfis customizados).

## Câmbio de Moedas

Cada campo monetário (Produto, Frete, Investimento, CPA, Lucro Desejado) tem seu próprio seletor de moeda (BRL/USD/MXN). A **Moeda Base**, selecionada na barra fixa no topo da extensão, define em que moeda todos os resultados (Calculadora, Simulador, Markup Inteligente) são exibidos — qualquer campo numa moeda diferente é convertido automaticamente antes do cálculo.

### Como funciona o cache

[src/services/ExchangeRateService.ts](src/services/ExchangeRateService.ts) é o único lugar que fala com a API de cotação. Ele busca os pares `USD-BRL`, `MXN-BRL` e `USD-MXN` na [AwesomeAPI](https://economia.awesomeapi.com.br/) (gratuita) e grava o resultado em `chrome.storage.local` sob a chave `auren_exchange_rate_cache`, no formato `{ exchangeRates, lastUpdate }`.

- **Ao abrir a extensão**: se não existe cache, busca da API; se existe e tem menos de 30 minutos, usa o cache; se passou de 30 minutos, busca uma cotação nova automaticamente.
- **Se a API falhar**: continua usando o último cache salvo, sem interromper o app.
- **Se nunca houve cache e a API falha**: o card "Cotação" mostra "Não foi possível atualizar as cotações." com um botão para tentar novamente.
- Nenhum componente React faz `fetch` diretamente — tudo passa por `getExchangeRates()`.

### Como atualizar a cotação

O botão **Atualizar Cotação** (no card "Cotação", sempre visível acima das abas) chama `getExchangeRates({ force: true })`, ignorando o TTL de 30 minutos e buscando um valor novo na hora. Os campos do formulário nunca disparam uma busca — só a abertura da extensão e esse botão.

### Como adicionar uma moeda nova

1. Adicione um item em `CURRENCIES` em [src/constants/currencies.ts](src/constants/currencies.ts) (`code`, `label`, `flag`, `locale`).
2. Adicione o par da moeda nova contra BRL na URL da AwesomeAPI em `ExchangeRateService.ts` (ex. `,EUR-BRL`) — a conversão entre quaisquer moedas usa BRL como pivô ([src/utils/currency.ts](src/utils/currency.ts)), então um novo par contra BRL já habilita conversão com todas as moedas existentes.
3. Pronto — `MoneyField`, `formatCurrency` e o card "Cotação" já leem de `CURRENCIES` dinamicamente, nenhum outro arquivo precisa mudar.

### Como trocar de API no futuro

Troque a implementação de `fetchExchangeRates()` em [src/services/ExchangeRateService.ts](src/services/ExchangeRateService.ts) — é o único módulo que conhece o formato de resposta da AwesomeAPI. Basta continuar devolvendo um `ExchangeCache` (`{ exchangeRates: ExchangeRate[], lastUpdate }`) que nada mais no app precisa mudar.

## Armazenamento

Todo o estado (perfis, perfil ativo, último produto/frete usados e suas moedas) é salvo automaticamente em `chrome.storage.local` a cada alteração — não há botão "salvar estado global" porque isso já acontece em tempo real. O botão **Salvar Perfil** é especificamente sobre gravar as edições de taxas no perfil selecionado. A Moeda Base e o cache de cotação são salvos separadamente, sob as chaves `auren_currency_settings` e `auren_exchange_rate_cache`.
