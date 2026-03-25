# Wireframes - Sistema de Gestão de Imóveis Ailos Light

## 🗺️ Sitemap & Navegação

```
GESTÃO DE IMÓVEIS AILOS
│
├─ 📊 Dashboard / Lista de Imóveis (/)
│  ├─ Filtros e Busca
│  ├─ KPIs (4 cards)
│  └─ Tabela/Cards de Imóveis
│
├─ ➕ Cadastro de Imóvel (/novo)
│  ├─ Etapa 1: Dados Básicos
│  ├─ Etapa 2: Localização
│  └─ Etapa 3: Documentos
│
├─ 🏠 Perfil do Imóvel (/:id)
│  ├─ Tab: Resumo
│  ├─ Tab: Leilão → /leilao
│  ├─ Tab: Negociação → /negociacao
│  ├─ Tab: Jurídico (blog interno)
│  ├─ Tab: Manutenção/Precificação → /manutencao-precificacao
│  ├─ Tab: Comercial → /comercial
│  ├─ Tab: Venda → /venda
│  ├─ Tab: Pós-Venda → /pos-venda
│  └─ Tab: Solicitações (fiscais/reavaliação)
│
└─ 📝 Registro de Atualização (/atualizar)
   └─ Form de update rápido
```

---

## 1️⃣ DASHBOARD / LISTA DE IMÓVEIS

### Layout Visual (Desktop 1440px)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR (280px)                   TOPBAR (fixed, height: 64px)                  │
│ ┌───────────────┐  ┌──────────────────────────────────────────────────────────┐│
│ │               │  │ [🔍 Buscar imóveis, atualizações...]         [🔔] [👤]  ││
│ │ Logo Ailos    │  └──────────────────────────────────────────────────────────┘│
│ │               │                                                                │
│ ├───────────────┤  ┌──────────────────────────────────────────────────────────┐│
│ │               │  │ GESTÃO DE IMÓVEIS                                         ││
│ │ ● Dashboard   │  │ A partir de Leilão                                        ││
│ │ ○ Solicitações│  │                                                            ││
│ │ ○ Relatórios  │  │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         ││
│ │ ○ Configurar  │  │ │ Etapa ▼     │ │ SLA ▼       │ │ Responsável ▼│        ││
│ │               │  │ └─────────────┘ └─────────────┘ └─────────────┘         ││
│ │               │  │                                                            ││
│ │ + Cadastrar   │  │ [☐ Em Liminar]  [☐ Solicitação Fiscal]  [Limpar Filtros] ││
│ │   Imóvel      │  └──────────────────────────────────────────────────────────┘│
│ │               │                                                                │
│ │ 📝 Registrar  │  ┌──────────────────────────────────────────────────────────┐│
│ │   Atualização │  │ 📊 INDICADORES (KPIs)                                    ││
│ │               │  │                                                            ││
│ └───────────────┘  │ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────┐││
│                    │ │ Total      │ │ SLA        │ │ Em         │ │Solicit. │││
│  bg: azul-100     │ │ Imóveis    │ │ Vencido    │ │ Liminar    │ │ Fiscal  │││
│  gradiente sutil  │ │            │ │            │ │            │ │         │││
│                    │ │    08      │ │    01      │ │    01      │ │   01    │││
│                    │ │            │ │            │ │            │ │         │││
│                    │ │ [Home]     │ │ [Clock]    │ │ [Scale]    │ │[FileW]  │││
│                    │ │ cinza-600  │ │ vermelho   │ │ turquesa   │ │azul-cl. │││
│                    │ └────────────┘ └────────────┘ └────────────┘ └─────────┘││
│                    │   bg: branco    bg: vermelh-50 bg: turq-50   bg: azul-50 ││
│                    │   border suave  border sutil   border sutil  border      ││
│                    └──────────────────────────────────────────────────────────┘│
│                                                                                  │
│                    ┌──────────────────────────────────────────────────────────┐│
│                    │ 📋 IMÓVEIS (Tabela)                                       ││
│                    │ ┌──────────────────────────────────────────────────────┐ ││
│                    │ │ bg: cinza-50                                          │ ││
│                    │ │ [Imóvel] [Etapa] [SLA] [Responsável] [Tags] [Ações]  │ ││
│                    │ ├──────────────────────────────────────────────────────┤ ││
│                    │ │ bg: branco | hover: azul-50                           │ ││
│                    │ │ [IMG]  IMV-2024-001      Leilão        🟡 Próx. Venc  │ ││
│                    │ │        R. Palmeiras,1234 Leilões Obrig  23d restantes │ ││
│                    │ │        São Paulo - SP    Maria Silva                  │ ││
│                    │ │                                          [⚠️ Pend.Fisc]│ ││
│                    │ │                          [Abrir] [Atualizar] [Docs]   │ ││
│                    │ ├──────────────────────────────────────────────────────┤ ││
│                    │ │ [IMG]  IMV-2023-045      Neg. Não Amig  🔴 Vencido   │ ││
│                    │ │        R. Consolação,567 Reintegração   -16d atraso  │ ││
│                    │ │        São Paulo - SP    Carlos Oliveira              │ ││
│                    │ │                                          [🚨 Liminar] │ ││
│                    │ │                          [Abrir] [Atualizar] [Docs]   │ ││
│                    │ ├──────────────────────────────────────────────────────┤ ││
│                    │ │ ... mais 6 linhas ...                                 │ ││
│                    │ └──────────────────────────────────────────────────────┘ ││
│                    │ [< Anterior]  [1] [2] 3 [4] [5]  [Próximo >]            ││
│                    └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘

PALETA VISUAL:
- Fundo app: cinza-25 (#FAFAFA)
- Sidebar: azul-100 (#E1EBF0) com gradiente sutil para azul-50
- Cards KPI: branco com borders suaves (cinza-100)
- Tabela header: cinza-50
- Tabela linhas: branco, hover azul-50
- Badges SLA: verde-50/amarelo-50/vermelho-50 com texto escuro
- Tags: turquesa-50, azul-claro-50 com bordas sutis
```

### Mobile (375px)
```
┌───────────────────────────────────┐
│ ☰  GESTÃO IMÓVEIS      [🔔] [👤] │ ← Topbar fixo
├───────────────────────────────────┤
│ [🔍 Buscar...]                    │
│ [Filtros ▼]                       │
├───────────────────────────────────┤
│ KPIs em Grid 2×2                  │
│ ┌──────────┐ ┌──────────┐        │
│ │ Total: 8 │ │ SLA: 1   │        │
│ └──────────┘ └──────────┘        │
│ ┌──────────┐ ┌──────────┐        │
│ │ Limin: 1 │ │ Fisc: 1  │        │
│ └──────────┘ └──────────┘        │
├───────────────────────────────────┤
│ ┌─────────────────────────────┐  │
│ │ [IMG] IMV-2024-001          │  │
│ │ R. Palmeiras, 1234          │  │
│ │ São Paulo - SP              │  │
│ │                             │  │
│ │ Leilão • Leilões Obrig.     │  │
│ │ 🟡 Próx. Venc. • 23d        │  │
│ │ Maria Silva                 │  │
│ │ [⚠️ Pendência Fiscal]       │  │
│ │                             │  │
│ │        [Abrir Imóvel]       │  │
│ └─────────────────────────────┘  │
│                                   │
│ ┌─────────────────────────────┐  │
│ │ [IMG] IMV-2023-045 ...      │  │
│ └─────────────────────────────┘  │
└───────────────────────────────────┘
```

---

## 2️⃣ CADASTRO DE IMÓVEL (3 ETAPAS)

### Etapa 1: Dados Básicos

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ← Voltar          CADASTRO DE NOVO IMÓVEL                    [Etapa 1 de 3]    │
│                   Preencha as informações básicas do imóvel                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   PROGRESSO (bg: branco, border: cinza-100, radius: 12px, padding: 24px)       │
│   ┌────────────────────────────────────────────────────────────────────────┐   │
│   │ ●─────────────○─────────────○                                          │   │
│   │ Dados Básicos  Localização   Documentos                                │   │
│   │ azul-500       cinza-300     cinza-300                                 │   │
│   └────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   ┌────────────────────────────────────────────────────────────────────────┐   │
│   │ 🏠 INFORMAÇÕES BÁSICAS                                                 │   │
│   │                                                                         │   │
│   │ ┌────────────────────────┐ ┌────────────────────────┐                 │   │
│   │ │ Código do Imóvel *     │ │ Tipo de Imóvel *       │                 │   │
│   │ │ [IMV-2024-___]         │ │ [▼ Apartamento]        │                 │   │
│   │ │ (cinza-400 placeholder)│ │                        │                 │   │
│   │ └────────────────────────┘ └────────────────────────┘                 │   │
│   │ text-sm, cinza-500: "Código único de identificação"                   │   │
│   │                                                                         │   │
│   │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                  │   │
│   │ │ Área (m²)│ │ Quartos  │ │ Banheiros│ │ Vagas    │                  │   │
│   │ │ [___] *  │ │ [___]    │ │ [___]    │ │ [___]    │                  │   │
│   │ └──────────┘ └──────────┘ └──────────┘ └──────────┘                  │   │
│   │                                                                         │   │
│   │ ┌────────────────────────┐ ┌────────────────────────┐                 │   │
│   │ │ Valor Avaliação (R$) * │ │ Data da Avaliação *    │                 │   │
│   │ │ [_____________]        │ │ [__/__/____]           │                 │   │
│   │ └────────────────────────┘ └────────────────────────┘                 │   │
│   │ text-sm: "Conforme laudo de avaliação"                                │   │
│   │                                                                         │   │
│   │ ┌────────────────────────┐ ┌────────────────────────┐                 │   │
│   │ │ Nº Matrícula *         │ │ Cartório Registro *    │                 │   │
│   │ │ [_____________]        │ │ [1º RI de São Paulo]   │                 │   │
│   │ └────────────────────────┘ └────────────────────────┘                 │   │
│   │                                                                         │   │
│   │ Descrição do Imóvel                                                    │   │
│   │ ┌──────────────────────────────────────────────────────────────────┐  │   │
│   │ │ [Textarea - 4 linhas]                                             │  │   │
│   │ └──────────────────────────────────────────────────────────────────┘  │   │
│   │                                                                         │   │
│   │ Foto Principal                                                          │   │
│   │ ┌────────────────────────────────────┐                                │   │
│   │ │ [Upload área - dashed border]      │                                │   │
│   │ │ 📤 Clique ou arraste a foto        │                                │   │
│   │ │ (azul-100 bg, azul-300 border)     │                                │   │
│   │ └────────────────────────────────────┘                                │   │
│   │ text-sm, cinza-500: "Formatos: JPG, PNG • Máx: 5MB"                  │   │
│   └────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   ┌────────────────────────────────────────────────────────────────────────┐   │
│   │ bg: azul-50, border-left: 4px azul-500, radius: 8px, padding: 16px    │   │
│   │ ℹ️ Importante                                                          │   │
│   │ Ao cadastrar o imóvel, ele iniciará na etapa "Leilão - Leilões        │   │
│   │ Obrigatórios". Você deverá cadastrar os leilões na sequência.          │   │
│   └────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   [Cancelar (outline)]           [Próxima Etapa: Localização → (primary)]      │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3️⃣ PERFIL DO IMÓVEL - VISÃO GERAL

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ← Voltar Lista    IMV-2024-001                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ CABEÇALHO (bg: branco, border: cinza-100, radius: 12px, padding: 24px)    │ │
│ │                                                                             │ │
│ │ [IMG]  IMV-2024-001                                  🟡 Próximo Vencimento│ │
│ │ 120px  Rua das Palmeiras, 1234, Apto 501             23 dias restantes    │ │
│ │        São Paulo - SP                                                      │ │
│ │                                                       Responsável:         │ │
│ │        [Apartamento] [85m²] [R$ 450.000]             Maria Silva          │ │
│ │                                                                             │ │
│ │        [⚠️ Pendência Fiscal]                         [📝 Registrar Update]│ │
│ │        turquesa-50 bg                                azul-500 button       │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ STEPPER DO FLUXO (bg: branco, border: cinza-100, radius: 12px)            │ │
│ │                                                                             │ │
│ │ ●═══════●───────○───────○───────○───────○───────○                         │ │
│ │ Leilão  Neg.Am. Neg.NA  Manut.  Comerc. Venda   Pós-V                     │ │
│ │ azul-500 azul-500 cinza-300                                                │ │
│ │ └─ Leilões Obrigatórios (sub-etapa ativa)                                 │ │
│ │    text-sm, azul-600                                                       │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ TABS (border-bottom: 2px cinza-100)                                        │ │
│ │ [Resumo] [Leilão] [Negociação] [Jurídico] [Manut/Prec] [Comercial]        │ │
│ │ [Venda] [Pós-Venda] [Solicitações]                                         │ │
│ │ Ativa: border-bottom: 3px azul-500, color: azul-600, font-weight: 600     │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ 📊 ABA: RESUMO                                                             │ │
│ │                                                                             │ │
│ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                       │ │
│ │ │ ETAPA ATUAL  │ │ PRÓX. PASSOS │ │ ALERTAS      │                       │ │
│ │ │              │ │              │ │              │                       │ │
│ │ │ Leilão       │ │ • Aguardar   │ │ ⚠️ Pendência │                       │ │
│ │ │ Leilões      │ │   2º leilão  │ │ Fiscal       │                       │ │
│ │ │ Obrigatórios │ │ • Publicar   │ │              │                       │ │
│ │ │              │ │   edital     │ │ 1 ocorrência │                       │ │
│ │ │ Últ. update: │ │ • Resolver   │ │ em aberto    │                       │ │
│ │ │ 20/02 14:30  │ │   pend.fisc. │ │              │                       │ │
│ │ │              │ │              │ │ SLA: 23 dias │                       │ │
│ │ │ bg: azul-50  │ │ bg: branco   │ │ bg: amarelo  │                       │ │
│ │ │ border: azul │ │ border sutil │ │ -50, border  │                       │ │
│ │ └──────────────┘ └──────────────┘ └──────────────┘                       │ │
│ │                                                                             │ │
│ │ ┌──────────────────────────────────────────────────────────────────────┐  │ │
│ │ │ 💰 RESUMO FINANCEIRO                                                  │  │ │
│ │ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                  │  │ │
│ │ │ │ Avaliação    │ │ Despesas Acum│ │ Valor Líquido│                  │  │ │
│ │ │ │ R$ 450.000   │ │ R$ 4.100     │ │ R$ 445.900   │                  │  │ │
│ │ │ │ cinza-600    │ │ vermelho-600 │ │ verde-600    │                  │  │ │
│ │ │ └──────────────┘ └──────────────┘ └──────────────┘                  │  │ │
│ │ │ bg: verde-50, border: verde-100, radius: 12px                         │  │ │
│ │ └──────────────────────────────────────────────────────────────────────┘  │ │
│ │                                                                             │ │
│ │ ┌──────────────────────────────────────────────────────────────────────┐  │ │
│ │ │ 📄 DOCUMENTOS PENDENTES                                               │  │ │
│ │ │                                                                        │  │ │
│ │ │ [⚠️] Comprovante quitação leilão - Obrigatório      [Upload]          │  │ │
│ │ │ [⚠️] Ata do 1º leilão - Obrigatório                 [Upload]          │  │ │
│ │ │                                                                        │  │ │
│ │ │ bg: amarelo-50, items com border-left: 3px amarelo-500                │  │ │
│ │ └──────────────────────────────────────────────────────────────────────┘  │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4️⃣ TELA DE LEILÃO

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ← Perfil      LEILÃO - IMV-2024-001                                            │
│               Rua das Palmeiras, 1234                                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ 📋 LEILÕES OBRIGATÓRIOS                          [+ Cadastrar Novo Leilão] │ │
│ │                                                   (button primary)          │ │
│ │                                                                             │ │
│ │ ┌──────────────────────────────────────────────────────────────────────┐  │ │
│ │ │ [1º LEILÃO]  [Deserto]  ──────────────────────────────────────────┐ │  │ │
│ │ │              badge:vermelho-50                                     │ │  │ │
│ │ │                                                                     │ │  │ │
│ │ │ Leiloeiro:     João Martins (CRECI 12345-J)                        │ │  │ │
│ │ │ Data:          [20/01/2026 14:00]                                  │ │  │ │
│ │ │ Valor Aval.:   R$ 450.000  │  Valor Mín.: R$ 315.000 (70%)        │ │  │ │
│ │ │                                                                     │ │  │ │
│ │ │ Documentos:                                                         │ │  │ │
│ │ │ [📄 Edital de Leilão]  [📄 Ata]  [📄 Comprovante Publicação]      │ │  │ │
│ │ │ links azul-500, hover azul-600                                     │ │  │ │
│ │ │                                                                     │ │  │ │
│ │ │ bg: branco, border: cinza-200, radius: 12px, padding: 20px        │ │  │ │
│ │ └──────────────────────────────────────────────────────────────────────┘  │ │
│ │                                                                             │ │
│ │ ┌──────────────────────────────────────────────────────────────────────┐  │ │
│ │ │ [2º LEILÃO]  [Agendado]  ─────────────────────────────────────────┐ │  │ │
│ │ │              badge:azul-claro-50                                   │ │  │ │
│ │ │                                                                     │ │  │ │
│ │ │ Leiloeiro:     João Martins (CRECI 12345-J)                        │ │  │ │
│ │ │ Data:          [10/03/2026 14:00]                                  │ │  │ │
│ │ │ Valor Aval.:   R$ 450.000  │  Valor Mín.: R$ 225.000 (50%)        │ │  │ │
│ │ │                                                                     │ │  │ │
│ │ │ Documentos:                                                         │ │  │ │
│ │ │ [+ Upload Edital]  [+ Upload Ata]  [+ Upload Comprovante]         │ │  │ │
│ │ │ buttons: outline, cinza-300 border                                 │ │  │ │
│ │ └──────────────────────────────────────────────────────────────────────┘  │ │
│ │                                                                             │ │
│ │ ┌──────────────────────────────────────────────────────────────────────┐  │ │
│ │ │ bg: verde-50, border: verde-200, border-left: 4px verde-500         │  │ │
│ │ │                                                                      │  │ │
│ │ │ ✅ IMÓVEL VENDIDO EM LEILÃO?                                        │  │ │
│ │ │                                                                      │  │ │
│ │ │ Marcar esta opção pula as etapas de Negociação e Manutenção,       │  │ │
│ │ │ indo direto para Venda/Proposta.                                    │  │ │
│ │ │                                                                      │  │ │
│ │ │ [☐ Sim, vendido em leilão]  [Marcar como Vendido]                  │  │ │
│ │ │  toggle switch verde          button primary verde-500             │  │ │
│ │ └──────────────────────────────────────────────────────────────────────┘  │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ 🏁 FINALIZAR LEILÕES OBRIGATÓRIOS                                          │ │
│ │                                                                             │ │
│ │ Data Quitação:  [__/__/____]   Valor Quitação: [R$ ________]              │ │
│ │                                                                             │ │
│ │ Observações:                                                                │ │
│ │ ┌──────────────────────────────────────────────────────────────────────┐  │ │
│ │ │ [Textarea - 3 linhas]                                                 │  │ │
│ │ └──────────────────────────────────────────────────────────────────────┘  │ │
│ │                                                                             │ │
│ │ Anexos Obrigatórios:                                                        │ │
│ │ [📤 Extratos Bancários (Antes)]  [📤 Extratos (Depois)]                    │ │
│ │ [📤 Termo Arrematação]           [📤 Termo Não Comparecimento]             │ │
│ │ buttons outline com ícone de upload                                        │ │
│ │                                                                             │ │
│ │                                             [Finalizar Leilões →]          │ │
│ │                                             button primary azul-500        │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ 📋 AVERBAÇÃO DA MATRÍCULA                                                  │ │
│ │                                                                             │ │
│ │ ℹ️ Após finalizar os leilões, averbar o resultado na matrícula             │ │
│ │ bg: azul-claro-50, border-left: 4px azul-claro-500                         │ │
│ │                                                                             │ │
│ │ Data Averbação:  [__/__/____]   Nº Averbação: [AV-______]                 │ │
│ │                                                                             │ │
│ │ Matrícula Atualizada (Obrigatório):                                        │ │
│ │ ┌──────────────────────────────────────────────────────────────────────┐  │ │
│ │ │ [📤 Upload Matrícula Atualizada]                                      │  │ │
│ │ │ dashed border azul-300, bg azul-50 on hover                           │  │ │
│ │ └──────────────────────────────────────────────────────────────────────┘  │ │
│ │                                                                             │ │
│ │                                             [Concluir Averbação →]         │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ 👤 ATRIBUIR RESPONSÁVEL                                                    │ │
│ │                                                                             │ │
│ │ Atribuir imóvel para:  [▼ Selecione usuário (Gestão de Bens)]             │ │
│ │                                                                             │ │
│ │ text-sm, cinza-500: "Apenas usuários do perfil Gestão de Bens"            │ │
│ │                                             [Atribuir Responsável]         │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5️⃣ TELA DE NEGOCIAÇÃO (PLANNER)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ← Perfil      NEGOCIAÇÃO - IMV-2023-089                                        │
│               Rua Estados Unidos, 234                                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ Tipo de Negociação:                                                         │ │
│ │ [🏠 Negociação Amigável] [⚖️ Negociação Não Amigável]                      │ │
│ │  button primary azul-500  button outline cinza-300                          │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ TABS: [Planner] [Tentativas Contato] [Documentos]                          │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ PROGRESSO:  ████████░░░░░░  2/4 tópicos concluídos                         │ │
│ │ bg: branco, border: cinza-100, padding: 16px, radius: 8px                  │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ [1] ✅ PRAZO INICIAL DESOCUPAÇÃO VOLUNTÁRIA    [Concluído]                 │ │
│ │ Notificar ocupante - prazo 30 dias            badge: verde-50              │ │
│ │                                                                             │ │
│ │ Concluído por Ana Costa em 15/02/26 às 14:00                               │ │
│ │ text-sm, verde-700                                                          │ │
│ │                                                                             │ │
│ │ 💬 3 comentários  [Ver comentários ▼]                                      │ │
│ │                                                                             │ │
│ │ bg: verde-50, border: verde-200, border-left: 4px verde-500, radius: 12px  │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ [2] 🔵 TENTATIVAS DE CONTATO              [Em Andamento...]  [Obrigatório]│ │
│ │ Registrar ao menos 3 tentativas           badge: azul-100  badge: amarelo │ │
│ │                                                                             │ │
│ │ Prazo: 🟡 45 dias restantes                                                │ │
│ │ SLABadge: amarelo-50                                                        │ │
│ │                                                                             │ │
│ │ ┌──────────────────────────────────────────────────────────────────────┐  │ │
│ │ │ 📝 ÁREA DE TRABALHO (bg: azul-50, border: azul-300, radius: 12px)    │  │ │
│ │ │                                                                       │  │ │
│ │ │ Responsável:  [▼ Ana Costa]    Prazo: [01/04/2026]                   │  │ │
│ │ │                                                                       │  │ │
│ │ │ Observações e Andamento:                                              │  │ │
│ │ │ ┌────────────────────────────────────────────────────────────────┐   │  │ │
│ │ │ │ [Textarea - 4 linhas]                                           │   │  │ │
│ │ │ │ "Registre as ações, decisões, próximos passos..."              │   │  │ │
│ │ │ └────────────────────────────────────────────────────────────────┘   │  │ │
│ │ │                                                                       │  │ │
│ │ │                 [Salvar Progresso]  [✅ Concluir Tópico]             │  │ │
│ │ │                 outline             primary verde-500               │  │ │
│ │ └──────────────────────────────────────────────────────────────────────┘  │ │
│ │                                                                             │ │
│ │ 💬 REGISTRO DE COMENTÁRIOS (imutáveis)                                     │ │
│ │ ┌──────────────────────────────────────────────────────────────────────┐  │ │
│ │ │ bg: cinza-50, border: cinza-200, radius: 8px, padding: 12px          │  │ │
│ │ │ [👤] Ana Costa - 19/02/26 10:00                                       │  │ │
│ │ │ 1ª tentativa telefone - não atendeu. Deixada mensagem na caixa postal│  │ │
│ │ └──────────────────────────────────────────────────────────────────────┘  │ │
│ │ [➕ Adicionar comentário]                                                   │ │
│ │                                                                             │ │
│ │ bg: azul-100, border: azul-400, border-left: 4px azul-500, radius: 12px    │ │
│ │ shadow suave ao estar ativo                                                 │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ [3] ⚪ AVALIAÇÃO PROPOSTA RECOMPRA                     [Aguardando]        │ │
│ │ Analisar viabilidade de recompra                                           │ │
│ │ (Será aberto após conclusão do tópico anterior)                            │ │
│ │                                                                             │ │
│ │ bg: cinza-50, border: cinza-200, opacity: 0.6                              │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ [4] ⚪ ACORDO DE DESOCUPAÇÃO        [Obrigatório] [Aguardando]             │ │
│ │ Definir termos, indenizações e prazo final                                 │ │
│ │                                                                             │ │
│ │ bg: cinza-50, border: cinza-200, opacity: 0.6                              │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Aba: Tentativas de Contato

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ REGISTRO DE TENTATIVAS DE CONTATO             [+ Registrar Nova Tentativa]     │
│ Mínimo de 3 tentativas documentadas                                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ ⚠️ Atenção: 1 tentativa adicional necessária                               │ │
│ │ Obrigatório ao menos 3 tentativas antes de negociação não amigável         │ │
│ │ bg: amarelo-50, border-left: 4px amarelo-500                                │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ [📞] TENTATIVA #1                                                           │ │
│ │ icon: turquesa-500, bg-circle: turquesa-50                                 │ │
│ │                                                                             │ │
│ │ [Telefone]  [Sem Resposta]                                                 │ │
│ │ badge outline badge amarelo-50                                             │ │
│ │                                                                             │ │
│ │ 19/02/2026 às 10:00                                                         │ │
│ │ text-sm, cinza-600                                                          │ │
│ │                                                                             │ │
│ │ Ligação não atendida. Deixada mensagem na caixa postal.                    │ │
│ │ bg: cinza-50, padding: 12px, radius: 8px                                   │ │
│ │                                                                             │ │
│ │ Responsável: Ana Costa                                                      │ │
│ │ text-xs, cinza-500                                                          │ │
│ │                                                                             │ │
│ │ bg: branco, border-left: 4px turquesa-500, radius: 12px, shadow sutil      │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ [📧] TENTATIVA #2                                                           │ │
│ │ [E-mail]  [Sem Resposta]                                                   │ │
│ │ 20/02/2026 às 14:30                                                         │ │
│ │ E-mail enviado. Aguardando retorno em 48h.                                 │ │
│ │                                                                             │ │
│ │ border-left: 4px azul-claro-500                                             │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ [👤] TENTATIVA #3                                                           │ │
│ │ [Presencial]  [Não Localizado]                                             │ │
│ │ 21/02/2026 às 16:00                                                         │ │
│ │ Visita ao imóvel. Porteiro informou viagem frequente.                      │ │
│ │                                                                             │ │
│ │ border-left: 4px azul-500                                                   │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🆕 10️⃣ REGISTRO DE ATUALIZAÇÃO (NOVA TELA)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ← Voltar      REGISTRO DE ATUALIZAÇÃO                                          │
│               Registre um update rápido do imóvel                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ 🏠 SELEÇÃO DO IMÓVEL                                                        │ │
│ │                                                                             │ │
│ │ ┌────────────────────────────┐ ┌────────────────────────────┐             │ │
│ │ │ Imóvel *                   │ │ Etapa Relacionada *        │             │ │
│ │ │ [🔍 IMV-2024-...         ▼]│ │ [▼ Leilão                 ]│             │ │
│ │ │ autocomplete, azul-500     │ │                            │             │ │
│ │ └────────────────────────────┘ └────────────────────────────┘             │ │
│ │                                                                             │ │
│ │ bg: branco, border: cinza-100, radius: 12px, padding: 24px                 │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ 📝 TIPO DE ATUALIZAÇÃO                                                      │ │
│ │                                                                             │ │
│ │ [Andamento] [Contato] [Documento] [Mudança Status] [Parecer] [Bloqueio]   │ │
│ │ [Liberação]                                                                 │ │
│ │ chips/pills: bg cinza-50, border cinza-200, hover azul-50, active azul-500 │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ 📋 DETALHES DA ATUALIZAÇÃO                                                  │ │
│ │                                                                             │ │
│ │ Título Curto *                                                              │ │
│ │ ┌──────────────────────────────────────────────────────────────────────┐  │ │
│ │ │ [Ex: "2º leilão agendado para 10/03"]                                 │  │ │
│ │ └──────────────────────────────────────────────────────────────────────┘  │ │
│ │                                                                             │ │
│ │ Descrição Detalhada *                                                       │ │
│ │ ┌──────────────────────────────────────────────────────────────────────┐  │ │
│ │ │ [Textarea - 5 linhas]                                                 │  │ │
│ │ │ "Descreva o andamento, ações realizadas, decisões tomadas..."        │  │ │
│ │ └──────────────────────────────────────────────────────────────────────┘  │ │
│ │                                                                             │ │
│ │ Tags (opcional)                                                             │ │
│ │ [☐ Liminar] [☐ Solicitação Fiscal] [☐ Venda Parcelada] [☐ Desocupação]   │ │
│ │ checkboxes com badges preview                                              │ │
│ │                                                                             │ │
│ │ bg: branco, border: cinza-100, radius: 12px, padding: 24px                 │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ 📎 ANEXOS E DOCUMENTOS                                                      │ │
│ │                                                                             │ │
│ │ ┌──────────────────────────────────────────────────────────────────────┐  │ │
│ │ │ [📤 Upload de Arquivos]                                               │  │ │
│ │ │ Clique ou arraste arquivos (PDF, JPG, PNG)                           │  │ │
│ │ │ dashed border azul-300, bg azul-50                                   │  │ │
│ │ └──────────────────────────────────────────────────────────────────────┘  │ │
│ │                                                                             │ │
│ │ [☐ Marcar como documento obrigatório do checklist]                         │ │
│ │ checkbox                                                                    │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ 📅 SLA E PRAZO (opcional)                                                   │ │
│ │                                                                             │ │
│ │ ┌────────────────────────────┐ ┌────────────────────────────┐             │ │
│ │ │ SLA Relacionado            │ │ Data Limite                │             │ │
│ │ │ [▼ Prazo 2º leilão        ]│ │ [__/__/____]               │             │ │
│ │ └────────────────────────────┘ └────────────────────────────┘             │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ 🔄 MUDANÇA DE ETAPA (opcional)                                              │ │
│ │                                                                             │ │
│ │ [☐ Esta atualização altera a etapa atual do imóvel?]                       │ │
│ │                                                                             │ │
│ │ (se marcado, exibir:)                                                       │ │
│ │ ┌────────────────────────────┐ ┌────────────────────────────┐             │ │
│ │ │ Nova Etapa *               │ │ Motivo da Mudança *        │             │ │
│ │ │ [▼ Negociação Amigável    ]│ │ [Leilões concluídos]       │             │ │
│ │ └────────────────────────────┘ └────────────────────────────┘             │ │
│ │                                                                             │ │
│ │ bg: azul-50, border-left: 4px azul-500, padding: 16px                      │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ AÇÕES                                                                       │ │
│ │                                                                             │ │
│ │ [Cancelar]  [Salvar Atualização]  [Salvar e Abrir Imóvel]                 │ │
│ │  ghost       primary azul-500      outline azul-500                        │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│ (Após salvar: toast de sucesso verde-50 com ícone CheckCircle)                 │
│ "✅ Atualização registrada com sucesso! Timeline do imóvel atualizada."         │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## COMPONENTES REUTILIZÁVEIS - ESPECIFICAÇÕES VISUAIS

### SLABadge Variants

```
NO PRAZO:
┌────────────────────────┐
│ [🕐] No Prazo          │
│ 23 dias restantes      │
└────────────────────────┘
bg: verde-50 (#E6F7ED)
text: verde-700 (#006829)
border: 1px verde-100 (#CCEFDB)
icon: Clock verde-500
padding: 8px 16px
radius: 999px (pill)
font: 12px/16px medium

PRÓXIMO VENCIMENTO:
┌────────────────────────┐
│ [⚠️] Próx. Vencimento  │
│ 5 dias restantes       │
└────────────────────────┘
bg: amarelo-50 (#FFF4E6)
text: amarelo-800 (#CC8300)
border: amarelo-100
icon: AlertTriangle amarelo-500

VENCIDO:
┌────────────────────────┐
│ [🔴] Vencido           │
│ 16 dias de atraso      │
└────────────────────────┘
bg: vermelho-50 (#FFEEF0)
text: vermelho-700 (#B30000)
border: vermelho-100
icon: AlertCircle vermelho-500
```

### PropertyTag Badges

```
LIMINAR:
┌──────────────────┐
│ [⚖️] Em Liminar  │
└──────────────────┘
bg: turquesa-50 (#E6F3F4)
text: turquesa-700 (#005964)
border: turquesa-100 (#CCE7E9)
icon: Scale turquesa-500
padding: 6px 12px
radius: 6px

PENDÊNCIA FISCAL:
┌─────────────────────────┐
│ [📄] Pendência Fiscal   │
└─────────────────────────┘
bg: azul-claro-50 (#E6F6FA)
text: azul-claro-700 (#00687D)
border: azul-claro-100 (#CCECF5)
icon: FileWarning azul-claro-500

VENDA PARCELADA:
┌─────────────────────────┐
│ [💳] Venda Parcelada    │
└─────────────────────────┘
bg: verde-50 (#E6F7ED)
text: verde-700 (#006829)
border: verde-100 (#CCEFDB)
icon: CreditCard verde-500
```

---

## ESTADOS DA INTERFACE

### Loading (Skeleton)
```
┌────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░ 40% width        │
│ ░░░░░░░░░░░ 25% width             │
│ ░░░░░░░░░░░░░░░░░░░ 60% width    │
└────────────────────────────────────┘
bg: cinza-100 (#EFEFEF)
animation: shimmer
  - from cinza-50 to cinza-200
  - duration: 1.5s
  - ease-in-out infinite
radius: 8px
```

### Empty State
```
┌────────────────────────────────────┐
│                                    │
│         [📭]                       │
│       64px icon                    │
│       cinza-300                    │
│                                    │
│    Nenhum imóvel encontrado        │
│    heading-4, cinza-700            │
│                                    │
│    Ajuste os filtros ou cadastre  │
│    um novo imóvel                  │
│    body, cinza-500                 │
│                                    │
│    [+ Cadastrar Imóvel]            │
│    button primary                  │
│                                    │
└────────────────────────────────────┘
padding: 64px
align: center
```

### Erro
```
┌────────────────────────────────────┐
│                                    │
│         [⚠️]                       │
│       48px icon                    │
│       vermelho-500                 │
│                                    │
│    Erro ao carregar dados          │
│    heading-4, vermelho-700         │
│                                    │
│    Tente novamente ou entre em    │
│    contato com o suporte           │
│    body, cinza-600                 │
│                                    │
│    [Tentar Novamente]              │
│    button outline                  │
│                                    │
└────────────────────────────────────┘
bg: vermelho-50
border: vermelho-200
radius: 12px
```

---

FIM DOS WIREFRAMES
