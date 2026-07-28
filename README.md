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
  types/         Tipos TypeScript compartilhados (Profile, CalculatorInputs/Results, Simulator, SmartMarkup, Storage)
  constants/     Perfis padrão (Brasil/México/EUA/Europa), faixas de margem, chaves de storage
  utils/
    calculations/  Motores de cálculo puros (pricingCalculator, simulatorCalculator, smartMarkupCalculator)
    format.ts      Formatação de moeda/percentual/multiplicador (pt-BR, vírgula decimal)
    numberInput.ts Sanitização de digitação (bloqueia letras, aceita vírgula/ponto)
    clamp.ts       Clamp de percentuais 0–100
  storage/       Wrapper sobre chrome.storage.local (com fallback localStorage) + load/save do estado
  services/
    profileService.ts       CRUD de perfis (criar, duplicar, resetar, aplicar taxas)
    exportImportService.ts  Exportar/Importar JSON com validação de schema
    clipboardService.ts     Copiar resultados formatados para a área de transferência
    scrapers/                Interfaces + stubs para captura futura de preços (AliExpress, CJ, 1688, Amazon)
    currency/                 Stub de conversão de moeda (USD/CNY/EUR → BRL, BRL → MXN)
  context/       CalculatorContext — fonte única de verdade (perfis, custos, taxas, resultados calculados)
  hooks/         useSimulator, useSmartMarkup, useToast
  components/
    ui/           Primitivos reutilizáveis (Button, Card, NumberField, PercentField, Select, Tabs, Badge, Toast...)
    icons/         Ícones SVG inline (sem dependência externa)
    layout/        AppShell, Header
    calculator/    Formulários e painel de resultados da aba Calculadora
    simulator/     Formulário e resultados da aba Simulador
    smartMarkup/   Formulário e resultados da aba Markup Inteligente
  pages/         Uma página por aba (CalculatorPage, SimulatorPage, SmartMarkupPage)
  App.tsx        Composição das abas + CalculatorProvider
  main.tsx       Entry point (React root + fontes)
manifest.json    Manifest V3 (popup + ícones + permissão "storage")
scripts/generate-icons.mjs  Gera os PNGs do ícone (pngjs, sem dependência nativa)
```

**Clean Architecture**: `types` e `utils/calculations` não dependem de React nem de storage — são funções puras testáveis isoladamente. `storage`/`services` não sabem nada de UI. `context` conecta storage + cálculo ao React. `components`/`pages` só consomem o context e chamam services — nenhuma regra de negócio mora em componente.

## Como adicionar novas funcionalidades

- **Novo campo de custo/taxa**: adicione o campo em [src/types/calculator.ts](src/types/calculator.ts) (`CalculatorInputs`), inclua a fórmula em [src/utils/calculations/pricingCalculator.ts](src/utils/calculations/pricingCalculator.ts), e adicione o campo em [src/components/calculator/FeesForm.tsx](src/components/calculator/FeesForm.tsx) (ou `CostForm.tsx`). Se for um percentual editável por perfil, inclua também em `ProfileFees` ([src/types/profile.ts](src/types/profile.ts)) e nos presets em [src/constants/defaultProfiles.ts](src/constants/defaultProfiles.ts).
- **Nova aba**: crie a página em `src/pages/`, o(s) componente(s) em `src/components/<nome-da-aba>/`, registre a aba em `TABS` e no switch de conteúdo em [src/App.tsx](src/App.tsx).
- **Captura automática de preços (AliExpress, CJ Dropshipping, 1688, Amazon)**: as interfaces já existem em [src/services/scrapers/](src/services/scrapers/) (`ProductScraper`, `ScrapedProduct`). Para ativar: (1) implemente `scrape(document)` no scraper correspondente lendo o DOM/JSON da página, (2) registre um `content_scripts` no `manifest.json` apontando para o domínio do marketplace, (3) crie um content script que roda `findScraperForUrl(location.href)?.scrape(document)` e envia o resultado ao popup via `chrome.runtime.sendMessage`. Nenhuma mudança é necessária no motor de cálculo — o resultado do scraper alimenta os mesmos campos `productCost`/`shipping` do `CalculatorContext`.
- **Conversão de moeda (USD/CNY/EUR → BRL, BRL → MXN)**: o stub em [src/services/currency/currencyService.ts](src/services/currency/currencyService.ts) já expõe `convertAmount`/`getConversionRate` com taxas fixas de fallback. Troque `FALLBACK_RATES` por uma chamada de API real (ex. exchangerate.host) com cache em `chrome.storage.local` — nenhum outro arquivo precisa mudar, pois o resto do app já consome essas funções pela assinatura pública.
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

## Armazenamento

Todo o estado (perfis, perfil ativo, último produto/frete usados) é salvo automaticamente em `chrome.storage.local` a cada alteração — não há botão "salvar estado global" porque isso já acontece em tempo real. O botão **Salvar Perfil** é especificamente sobre gravar as edições de taxas no perfil selecionado.
