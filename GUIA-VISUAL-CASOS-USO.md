# Guia Visual & Casos de Uso - Sistema Ailos Light

## 🎨 Paleta Visual Aplicada

### Fundos e Superfícies
```
┌─────────────────────────────────────────────────────┐
│ App Background: #FAFAFA (cinza-25)                  │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Card/Modal: #FFFFFF (branco)                    │ │
│ │ ┌─────────────────────────────────────────────┐ │ │
│ │ │ Section: #F7F7F7 (cinza-50)                 │ │ │
│ │ │ ┌─────────────────────────────────────────┐ │ │ │
│ │ │ │ Hover: #F0F5F7 (azul-50)                │ │ │ │
│ │ │ └─────────────────────────────────────────┘ │ │ │
│ │ └─────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Hierarquia de Ação (Botões)
```
PRIMÁRIO (azul-500):     [Salvar]  [Confirmar]  [Enviar]
SECUNDÁRIO (outline):    [Cancelar]  [Voltar]
GHOST (texto):           [Editar]  [Ver mais]
SUCESSO (verde-500):     [Aprovar]  [Concluir]
ATENÇÃO (amarelo-500):   [Revisar]
PERIGO (vermelho-500):   [Excluir]  [Rejeitar]
```

---

## 📋 CASO DE USO 1: Fluxo de Cadastro de Imóvel

### Tela 1: Dados Básicos (Estado Inicial)
```
Visual:
- Background app: #FAFAFA
- Card principal: #FFFFFF, border cinza-100, radius 12px
- Progress stepper: Step 1 ativo (azul-500), Steps 2-3 futuros (cinza-300)
- Labels: cinza-700, 14px medium
- Inputs: border cinza-200, placeholder cinza-400
- Botão primário: azul-500 (#165C7D)

Interações:
1. Usuário digita código: input focus → border azul-500, shadow azul-100
2. Seleciona tipo: dropdown abre com bg branco, items hover azul-50
3. Upload foto: área dashed azul-300, hover → azul-400
4. Clica "Próxima Etapa": botão pressed → azul-700, transição para Etapa 2
```

### Tela 2: Localização (Estado com Validação)
```
Cenário: Usuário deixou CEP em branco e tentou avançar

Visual:
- Input CEP: border vermelho-500
- Mensagem erro abaixo: "CEP é obrigatório"
  - Color: vermelho-600
  - Icon: AlertCircle (14px, vermelho-500)
  - Font: 12px regular
  
- Alert de topo:
  ┌─────────────────────────────────────────────┐
  │ bg: vermelho-50, border-left: 4px vermelho  │
  │ [⚠️] Preencha todos os campos obrigatórios  │
  └─────────────────────────────────────────────┘
```

### Tela 3: Documentos (Checklist Parcial)
```
Visual:
Progress header:
┌─────────────────────────────────────────────┐
│ Progresso do Checklist           [3/6]     │
│ ████████░░░░  50%                          │
│ verde-500     cinza-200                     │
└─────────────────────────────────────────────┘

Items:
✓ Matrícula (concluído): bg verde-50, border verde-200
✓ Laudo (concluído): bg verde-50
⚠ Termo Consolidação (obrigatório): bg amarelo-50, border amarelo-200
○ Certidão Municipal (opcional): bg cinza-50
```

---

## 📊 CASO DE USO 2: Dashboard com Múltiplos Estados

### KPIs em Diferentes Estados
```
┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ Total: 08      │ │ SLA Venc: 01  │ │ Liminar: 01   │ │ Fiscal: 01    │
│ [Home] cinza   │ │ [Clock] verm. │ │ [Scale] turq. │ │ [File] azul-c │
│ bg: branco     │ │ bg: verm-50   │ │ bg: turq-50   │ │ bg: azul-c-50 │
│ border: cinza  │ │ gradient sutil│ │ gradient sutil│ │ gradient sutil│
└────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘
    neutral           danger            info              info
```

### Tabela: Linha com Múltiplas Tags
```
┌─────────────────────────────────────────────────────────────────────┐
│ [IMG] IMV-2023-045                  Neg. Não Amig.  🔴 Vencido     │
│ 80px  R. Consolação, 567            Reintegração    -16d atraso    │
│       São Paulo - SP                Carlos Oliveira                 │
│                                                                      │
│       [🚨 Em Liminar]  [📄 Pend.Fiscal]  [🏠 Desocupação]          │
│       turquesa-50      azul-claro-50     cinza-100                  │
│                                                                      │
│       [Abrir] [Atualizar] [Docs]                                   │
│       primary  outline     ghost                                    │
│                                                                      │
│ hover state: bg azul-50, cursor pointer, shadow sutil              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 CASO DE USO 3: Negociação - Planner de Tópicos

### Tópico Concluído (Verde)
```
┌─────────────────────────────────────────────────────────────────────┐
│ [1] ✅ PRAZO INICIAL DESOCUPAÇÃO VOLUNTÁRIA    [Concluído]         │
│ circle: verde-500 com check branco             badge: verde-50     │
│                                                                      │
│ Notificar ocupante sobre consolidação - prazo 30 dias              │
│ text: cinza-700, 14px regular                                       │
│                                                                      │
│ Concluído por Ana Costa em 15/02/26 às 14:00                       │
│ text: verde-700, 12px                                               │
│                                                                      │
│ 💬 3 comentários  [Ver comentários ▼]                              │
│                                                                      │
│ bg: verde-50, border: 2px verde-200, border-left: 4px verde-500    │
│ radius: 12px, padding: 20px                                         │
│ shadow: 0 2px 4px rgba(0,177,64,0.08)                              │
└─────────────────────────────────────────────────────────────────────┘
```

### Tópico Ativo (Azul)
```
┌─────────────────────────────────────────────────────────────────────┐
│ [2] 🔵 TENTATIVAS DE CONTATO       [Em Andamento...] [Obrigatório] │
│ circle: azul-500 com nº 2          badge: azul-100  badge: amarelo │
│ border: 3px azul-500                                                │
│ shadow: 0 0 0 4px azul-100 (glow)                                  │
│                                                                      │
│ Registrar ao menos 3 tentativas antes de prosseguir                │
│                                                                      │
│ Prazo: 🟡 45 dias restantes                                        │
│ SLABadge: bg amarelo-50, text amarelo-800, icon AlertTriangle      │
│                                                                      │
│ ┌───────────────────────────────────────────────────────────────┐  │
│ │ 📝 ÁREA DE TRABALHO                                           │  │
│ │ bg: azul-50, border: 2px azul-300, border-left: 4px azul-500  │  │
│ │                                                                │  │
│ │ Responsável: [▼ Ana Costa]    Prazo: [01/04/2026]             │  │
│ │                                                                │  │
│ │ Observações:                                                   │  │
│ │ ┌─────────────────────────────────────────────────────────┐   │  │
│ │ │ [Textarea focus: border azul-500, shadow azul-100]      │   │  │
│ │ └─────────────────────────────────────────────────────────┘   │  │
│ │                                                                │  │
│ │ [Salvar Progresso]  [✅ Concluir Tópico]                      │  │
│ │  outline cinza       primary verde-500                        │  │
│ └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│ 💬 COMENTÁRIOS (imutáveis):                                         │
│ ┌───────────────────────────────────────────────────────────────┐  │
│ │ bg: cinza-50, border: cinza-200, radius: 8px, padding: 12px  │  │
│ │ [👤] Ana Costa - 19/02/26 10:00                               │  │
│ │ avatar: bg azul-100, icon User azul-500                       │  │
│ │ 1ª tentativa telefone - não atendeu. Mensagem deixada.        │  │
│ └───────────────────────────────────────────────────────────────┘  │
│ [➕ Adicionar comentário] button ghost azul-500                    │
│                                                                      │
│ bg: azul-100, border: 2px azul-400, border-left: 4px azul-500      │
│ radius: 12px, padding: 24px                                         │
│ shadow: 0 4px 12px rgba(22,92,125,0.12) (mais proeminente)         │
└─────────────────────────────────────────────────────────────────────┘
```

### Tópico Futuro (Desabilitado)
```
┌─────────────────────────────────────────────────────────────────────┐
│ [3] ⚪ AVALIAÇÃO PROPOSTA RECOMPRA                  [Aguardando]   │
│ circle: cinza-300, nº cinza-400    badge: cinza-100                │
│                                                                      │
│ Analisar viabilidade de recompra pelo ocupante                     │
│ text: cinza-500 (opacity 0.7)                                       │
│                                                                      │
│ (Será aberto após conclusão do tópico anterior)                    │
│ text: cinza-400, 12px italic                                        │
│                                                                      │
│ bg: cinza-50, border: 1px cinza-200                                │
│ opacity: 0.6                                                         │
│ cursor: not-allowed                                                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 CASO DE USO 4: Registro de Atualização

### Estado Inicial (Campos Vazios)
```
Visual:
- Chips de tipo: bg cinza-50, border cinza-200, text cinza-700
- Hover chip: bg azul-50, border azul-300
- Active chip: bg azul-500, text branco, shadow suave
- Checkbox tags: unchecked, border cinza-300
- Upload área: dashed border azul-300, bg transparent
```

### Estado Preenchido (Pronto para Salvar)
```
┌─────────────────────────────────────────────────────────────────────┐
│ Imóvel: IMV-2024-001 ✓                    Etapa: Leilão ✓          │
│ input: border verde-200, icon CheckCircle verde-500 à direita      │
│                                                                      │
│ Tipo: [Andamento] ← selecionado (azul-500)                         │
│                                                                      │
│ Título: "2º leilão agendado para 10/03" ✓                          │
│ char counter: 35/100, cinza-500, 12px                              │
│                                                                      │
│ Tags selecionadas: [☑ Solicitação Fiscal]                          │
│ badge preview: azul-claro-50 ao lado do checkbox                   │
│                                                                      │
│ Anexos: [📄 edital.pdf] [📄 termo.pdf]                             │
│ lista de arquivos com ícones, tamanho, botão remover               │
│                                                                      │
│ Botões habilitados:                                                 │
│ [Cancelar]  [Salvar Atualização]  [Salvar e Abrir Imóvel]         │
│  ghost       primary azul-500      outline azul-500                │
│              enabled, hover azul-  enabled                          │
│              600, cursor pointer                                    │
└─────────────────────────────────────────────────────────────────────┘
```

### Toast de Sucesso (Após Salvar)
```
┌─────────────────────────────────────────────────────────────────────┐
│ position: fixed, bottom: 24px, right: 24px                          │
│ animation: slide-in-up 250ms ease                                   │
│                                                                      │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ [✓] Atualização registrada com sucesso!                  [X]    │ │
│ │ icon: CheckCircle verde-500, 20px                    ghost btn  │ │
│ │ Timeline do imóvel atualizada.                                  │ │
│ │                                                                  │ │
│ │ bg: branco, border: 1px cinza-200, border-left: 4px verde-500  │ │
│ │ radius: 12px, padding: 16px 20px                                │ │
│ │ shadow: 0 8px 24px rgba(0,0,0,0.12)                             │ │
│ │ min-width: 320px, max-width: 480px                              │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ Auto-dismiss após 5s com progress bar verde-500 no bottom          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📄 CASO DE USO 5: Leilão - Vendido em Leilão

### Toggle Ativado (Estado Crítico)
```
┌─────────────────────────────────────────────────────────────────────┐
│ ✅ IMÓVEL VENDIDO EM LEILÃO?                                        │
│                                                                      │
│ bg: verde-50, border: 2px verde-200, border-left: 4px verde-500    │
│ radius: 12px, padding: 20px                                         │
│                                                                      │
│ Marcar esta opção pula as etapas de Negociação e Manutenção,      │
│ indo direto para Venda/Proposta.                                   │
│ text: verde-800, 14px                                               │
│                                                                      │
│ [Toggle Switch: ON (verde-500)]  [Marcar como Vendido]            │
│ track: verde-500, thumb: branco   button: verde-600, hover verde-  │
│ shadow verde sutil                700                               │
│                                                                      │
│ ┌───────────────────────────────────────────────────────────────┐  │
│ │ ⚠️ ATENÇÃO: Ação irreversível                                 │  │
│ │ bg: amarelo-50, border-left: 4px amarelo-500                  │  │
│ │ Ao confirmar, o imóvel pulará automaticamente para a          │  │
│ │ etapa de Venda. Certifique-se que todos os documentos do      │  │
│ │ leilão estão anexados.                                         │  │
│ └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│ [Cancelar]  [Confirmar Venda em Leilão]                           │
│  outline     primary verde-500                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Modal de Confirmação
```
Overlay: rgba(0,0,0,0.4), backdrop-filter: blur(4px)

┌─────────────────────────────────────────────────────────────────────┐
│ Confirmar Venda em Leilão                                     [X]   │
│ heading-3, cinza-900                                    ghost btn   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ ⚠️ Esta ação é irreversível                                         │
│ icon: AlertTriangle amarelo-500, 48px                               │
│                                                                      │
│ O imóvel IMV-2024-001 será movido diretamente para a etapa de      │
│ Venda, pulando:                                                      │
│                                                                      │
│ • Negociação Amigável                                               │
│ • Negociação Não Amigável                                           │
│ • Manutenção/Precificação                                           │
│                                                                      │
│ Certifique-se de que:                                               │
│ ☑ Todos os documentos do leilão estão anexados                     │
│ ☑ O comprovante de venda está correto                              │
│ ☑ O valor de venda foi registrado                                  │
│                                                                      │
│ bg: branco, padding: 32px, radius: 16px                            │
│ shadow: 0 20px 60px rgba(0,0,0,0.2)                                │
├─────────────────────────────────────────────────────────────────────┤
│ bg: cinza-25, padding: 24px 32px, border-top: cinza-100            │
│                                                                      │
│ [Cancelar]  [Sim, Confirmar Venda]                                │
│  outline     primary verde-600, hover verde-700                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 💰 CASO DE USO 6: Pós-Venda - Venda Parcelada

### Controle de Parcelas
```
┌─────────────────────────────────────────────────────────────────────┐
│ 💳 VENDA PARCELADA                                                  │
│                                                                      │
│ [☑ Venda parcelada?] toggle switch verde-500 ON                    │
│                                                                      │
│ ┌───────────────────────────────────────────────────────────────┐  │
│ │ ⚠️ GATILHO AUTOMÁTICO                                         │  │
│ │ bg: azul-claro-50, border-left: 4px azul-claro-500            │  │
│ │ Ao marcar cada parcela como paga, será gerada automaticamente │  │
│ │ uma solicitação de ocorrência fiscal.                          │  │
│ └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│ RESUMO FINANCEIRO:                                                  │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                │
│ │ Total Pago   │ │ A Receber    │ │ Progresso    │                │
│ │ R$ 90.000    │ │ R$ 45.000    │ │ ████░░  66% │                │
│ │ 2 de 3 parc. │ │ 1 parcela    │ │ verde-500    │                │
│ │ bg: verde-50 │ │ bg: amar-50  │ │ bg: azul-50  │                │
│ └──────────────┘ └──────────────┘ └──────────────┘                │
│                                                                      │
│ PARCELAS:                                                           │
│ ┌───────────────────────────────────────────────────────────────┐  │
│ │ [☑] Parcela 1/3                                               │  │
│ │ checked verde-500                                              │  │
│ │                                                                │  │
│ │ Vencimento: 10/03/2026    Valor: R$ 45.000                   │  │
│ │ Paga em: 09/03/2026       [Ver Comprovante]                  │  │
│ │                                                                │  │
│ │ ✓ Ocorrência fiscal gerada: OCF-2024-1234                    │  │
│ │ text: verde-700, 12px, icon: CheckCircle verde-500           │  │
│ │                                                                │  │
│ │ bg: verde-50, border: 2px verde-200, border-left: 4px verde  │  │
│ └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│ ┌───────────────────────────────────────────────────────────────┐  │
│ │ [☑] Parcela 2/3                                               │  │
│ │ Vencimento: 10/04/2026    Valor: R$ 45.000                   │  │
│ │ Paga em: 08/04/2026       [Ver Comprovante]                  │  │
│ │ ✓ Ocorrência fiscal gerada: OCF-2024-1235                    │  │
│ │ bg: verde-50                                                   │  │
│ └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│ ┌───────────────────────────────────────────────────────────────┐  │
│ │ [☐] Parcela 3/3                                               │  │
│ │ unchecked, border cinza-300                                   │  │
│ │                                                                │  │
│ │ Vencimento: 10/05/2026    Valor: R$ 45.000                   │  │
│ │ Status: Pendente                                               │  │
│ │ badge: amarelo-50, text amarelo-800                           │  │
│ │                                                                │  │
│ │ [Upload Comprovante]                                          │  │
│ │ button outline, disabled até checkbox marcado                │  │
│ │                                                                │  │
│ │ bg: branco, border: 1px cinza-200                             │  │
│ └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🚨 CASO DE USO 7: Estados de Erro e Vazio

### Empty State (Sem Resultados de Filtro)
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                         [📭]                                         │
│                       64px icon                                      │
│                     cinza-300 (#D1D1D1)                             │
│                                                                      │
│                 Nenhum imóvel encontrado                            │
│                 heading-3, cinza-700                                 │
│                                                                      │
│           Nenhum imóvel corresponde aos filtros aplicados.          │
│           Tente ajustar os critérios de busca.                      │
│           body, cinza-500, text-align: center                       │
│                                                                      │
│                    [Limpar Filtros]                                 │
│                   button outline cinza                              │
│                                                                      │
│ padding: 80px 40px                                                  │
│ bg: cinza-25 (#FAFAFA)                                              │
│ border: 1px dashed cinza-200                                        │
│ radius: 12px                                                         │
└─────────────────────────────────────────────────────────────────────┘
```

### Erro de Carregamento
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                         [⚠️]                                         │
│                       48px icon                                      │
│                  vermelho-500 (#E63946)                             │
│                                                                      │
│                Erro ao carregar os dados                            │
│                heading-4, vermelho-700                               │
│                                                                      │
│        Não foi possível conectar ao servidor. Verifique             │
│        sua conexão ou tente novamente em alguns instantes.          │
│        body, cinza-600                                               │
│                                                                      │
│                  [Tentar Novamente]                                 │
│                 button outline vermelho                             │
│                                                                      │
│ bg: vermelho-50 (#FFEEF0)                                           │
│ border: 2px solid vermelho-200 (#FFDDE0)                            │
│ radius: 12px                                                         │
│ padding: 48px 40px                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

### Loading (Skeleton)
```
┌─────────────────────────────────────────────────────────────────────┐
│ KPIs Loading:                                                        │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                    │
│ │ ░░░░░░  │ │ ░░░░░░  │ │ ░░░░░░  │ │ ░░░░░░  │                    │
│ │ ░░░░    │ │ ░░░░    │ │ ░░░░    │ │ ░░░░    │                    │
│ │ ░░░░░░░ │ │ ░░░░░░░ │ │ ░░░░░░░ │ │ ░░░░░░░ │                    │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘                    │
│                                                                      │
│ Tabela Loading:                                                      │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ [░] ░░░░░░░░░░░░  ░░░░░░░░  ░░░░░░░░  ░░░░░░░░  ░░░░░░░░   │   │
│ │ [░] ░░░░░░░░░░░░  ░░░░░░░░  ░░░░░░░░  ░░░░░░░░  ░░░░░░░░   │   │
│ │ [░] ░░░░░░░░░░░░  ░░░░░░░░  ░░░░░░░░  ░░░░░░░░  ░░░░░░░░   │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│ Skeleton:                                                            │
│ - bg: cinza-100 (#EFEFEF)                                           │
│ - animation: shimmer 1.5s ease-in-out infinite                     │
│   - keyframes: cinza-50 → cinza-200 → cinza-50                     │
│ - radius: 8px                                                        │
│ - diferentes larguras: 40%, 60%, 25%, 80% (variação)               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📱 RESPONSIVIDADE: Mobile vs Desktop

### Dashboard - Desktop (1440px)
```
┌─────────────────────────────────────────────────────────────────────┐
│ [Sidebar 280px]  [Topbar full width]                                │
│ [KPIs em Grid 1×4: todos visíveis lado a lado]                      │
│ [Tabela: 7 colunas visíveis, scroll horizontal se necessário]       │
│ [Paginação: 10 items por página]                                    │
│ Font sizes: padrão (14px body, 32px heading-1)                      │
│ Padding: 32px entre seções                                          │
└─────────────────────────────────────────────────────────────────────┘
```

### Dashboard - Mobile (375px)
```
┌───────────────────────────────┐
│ [☰ Hamburger] [Logo] [🔔] [👤]│ ← Topbar 56px
├───────────────────────────────┤
│ [🔍 Buscar]                   │
│ [Filtros ▼]                   │
├───────────────────────────────┤
│ KPIs em Grid 2×2:             │
│ ┌─────────┐ ┌─────────┐      │
│ │ Total 8 │ │ SLA 1   │      │
│ └─────────┘ └─────────┘      │
│ ┌─────────┐ ┌─────────┐      │
│ │ Lim. 1  │ │ Fisc. 1 │      │
│ └─────────┘ └─────────┘      │
├───────────────────────────────┤
│ Cards empilhados (1 coluna):  │
│ ┌─────────────────────────┐  │
│ │ [IMG] IMV-2024-001      │  │
│ │ Leilão • 23d            │  │
│ │ [⚠️ Pend.Fiscal]        │  │
│ │ [Abrir]                 │  │
│ └─────────────────────────┘  │
│                               │
│ [Ver mais (5 de 8)]          │
├───────────────────────────────┤
│ Font: -1px body, -2px h1      │
│ Padding: 16px entre seções    │
│ Sidebar: overlay ao clicar ☰ │
└───────────────────────────────┘
```

---

## 🎨 INTERAÇÕES E MICROANIMAÇÕES

### Hover States
```
Button Primary:
  Initial: bg azul-500, shadow 0 1px 3px
  Hover: bg azul-600, shadow 0 2px 6px, translateY(-1px)
  Pressed: bg azul-700, shadow 0 1px 2px, translateY(0)
  Transition: all 150ms ease
  
Card Clickable:
  Initial: shadow 0 1px 3px
  Hover: shadow 0 4px 12px, translateY(-2px), border cinza-200
  Transition: all 200ms ease
  
Link:
  Initial: color azul-500
  Hover: color azul-600, text-decoration underline
  Transition: color 100ms ease
```

### Focus States
```
Input:
  Transition: all 150ms ease
  Focus: border 2px azul-500, shadow 0 0 0 3px azul-100
  
Checkbox:
  Focus-visible: outline 2px azul-500, outline-offset 2px
  
Button:
  Focus-visible: outline 2px azul-500, outline-offset 3px
```

### Loading Transitions
```
Skeleton Shimmer:
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  background: linear-gradient(90deg, cinza-50 25%, cinza-200 50%, cinza-50 75%)
  background-size: 200% 100%
  animation: shimmer 1.5s ease-in-out infinite
  
Page Transition:
  Fade-in: opacity 0 → 1, 300ms ease
  
Modal Open:
  Overlay: opacity 0 → 1, 200ms ease
  Content: scale(0.95) → 1, opacity 0 → 1, 250ms cubic-bezier(0.16, 1, 0.3, 1)
```

### Pulse Animation (SLA Vencido)
```
@keyframes pulse-urgent {
  0%, 100% { box-shadow: 0 0 0 0 vermelho-500-alpha-40%; }
  50% { box-shadow: 0 0 0 8px vermelho-500-alpha-0%; }
}

Badge SLA Vencido:
  animation: pulse-urgent 1s ease-in-out infinite
```

---

## ✅ CHECKLIST FINAL DE IMPLEMENTAÇÃO

### Cores
- [ ] Paleta completa implementada (base + tints)
- [ ] Gradientes sutis em KPIs
- [ ] Contraste AA verificado em todos os textos

### Componentes
- [ ] Todos os 10 componentes base criados
- [ ] Variantes de badges (SLA + Status)
- [ ] Stepper com sub-etapas
- [ ] Comment feed imutável
- [ ] Document checklist com progresso

### Telas
- [ ] Dashboard / Lista (desktop + mobile)
- [ ] Cadastro de Imóvel (3 etapas)
- [ ] Perfil do Imóvel (9 abas)
- [ ] Leilão (com toggle vendido)
- [ ] Negociação (planner + tentativas)
- [ ] Manutenção/Precificação (5 amostras)
- [ ] Comercial (storyline)
- [ ] Venda (checklist)
- [ ] Pós-Venda (parcelas)
- [ ] **Registro de Atualização (NOVA)**

### Interações
- [ ] Hover states em todos elementos clicáveis
- [ ] Focus visible keyboard navigation
- [ ] Loading skeletons
- [ ] Empty states
- [ ] Error states
- [ ] Toast notifications

### Responsividade
- [ ] Breakpoints: mobile (< 768), tablet, desktop
- [ ] Sidebar colapsável/overlay mobile
- [ ] Tabelas → Cards no mobile
- [ ] Grid adaptativo (2 col → 1 col)
- [ ] Font sizes reduzidos mobile

### Acessibilidade
- [ ] ARIA labels em ícones-botão
- [ ] Alt text em imagens
- [ ] Labels em todos inputs
- [ ] Outline focus visível
- [ ] Contraste mínimo AA
- [ ] Screen reader friendly

---

FIM DO GUIA VISUAL E CASOS DE USO
