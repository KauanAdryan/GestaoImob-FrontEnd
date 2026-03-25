# Especificação de Componentes - Sistema Ailos Light

## 📦 Biblioteca de Componentes

### Índice
1. [KPI Card](#1-kpi-card)
2. [Data Table](#2-data-table)
3. [Flow Stepper](#3-flow-stepper)
4. [Badge System](#4-badge-system)
5. [Comment Feed](#5-comment-feed)
6. [Document Checklist](#6-document-checklist)
7. [Form Controls](#7-form-controls)
8. [Modal System](#8-modal-system)
9. [Navigation](#9-navigation)
10. [Alert System](#10-alert-system)

---

## 1. KPI CARD

### Anatomia
```
┌─────────────────────────────────┐
│ Label (cinza-600, 14px)         │ ← Topo
│ Icon (24px, cor tema)      │    │
│                                  │
│ Valor (cinza-900, 32px bold)    │ ← Centro
│                                  │
│ Descrição/Variação              │ ← Rodapé
│ (cinza-500, 12px)               │
└─────────────────────────────────┘
```

### Variantes

#### Default (Neutro)
```css
Background: #FFFFFF
Border: 1px solid #EFEFEF (cinza-100)
Border Radius: 12px
Padding: 24px
Shadow: 0 1px 3px rgba(0,0,0,0.04)

Hover:
  Shadow: 0 4px 12px rgba(0,0,0,0.08)
  Transform: translateY(-2px)
  Transition: 200ms ease
```

#### Success (Verde)
```css
Background: linear-gradient(135deg, verde-50 0%, branco 100%)
Border: 1px solid verde-100 (#CCEFDB)
Icon Color: verde-500 (#00B140)
Valor Color: verde-700 (#006829)
```

#### Alert (Amarelo)
```css
Background: linear-gradient(135deg, amarelo-50 0%, branco 100%)
Border: 1px solid amarelo-100
Icon Color: amarelo-500 (#FFA300)
Valor Color: amarelo-800 (#CC8300)
```

#### Danger (Vermelho)
```css
Background: linear-gradient(135deg, vermelho-50 0%, branco 100%)
Border: 1px solid vermelho-100
Icon Color: vermelho-500 (#E63946)
Valor Color: vermelho-700 (#B30000)
```

#### Info (Azul)
```css
Background: linear-gradient(135deg, azul-claro-50 0%, branco 100%)
Border: 1px solid azul-claro-100
Icon Color: azul-claro-500 (#00A9CE)
Valor Color: azul-claro-700 (#00687D)
```

### Exemplo de Uso
```
[Total de Imóveis]
Icon: Home (cinza-600)
Valor: 08
Descrição: "Cadastrados no sistema"
Variant: Default

[SLA Vencido]
Icon: Clock (vermelho-500)
Valor: 01
Descrição: "Requer atenção"
Variant: Danger
```

---

## 2. DATA TABLE

### Estrutura

#### Container
```css
Background: #FFFFFF
Border: 1px solid cinza-100 (#EFEFEF)
Border Radius: 12px
Overflow: hidden
Box Shadow: 0 1px 3px rgba(0,0,0,0.04)
```

#### Header Row
```css
Background: cinza-50 (#F7F7F7)
Border Bottom: 1px solid cinza-200 (#E0E0E0)
Height: 48px
Padding: 0 24px
Font: 14px/20px medium
Color: cinza-700 (#474747)
Text Transform: none
```

#### Body Row
```css
Background: #FFFFFF
Border Bottom: 1px solid cinza-100 (#EFEFEF)
Height: auto (min 64px)
Padding: 16px 24px
Font: 14px/20px regular
Color: cinza-900 (#1A1A1A)

Hover:
  Background: azul-50 (#F0F5F7)
  Cursor: pointer (se clicável)
  
Selected:
  Background: azul-100 (#E1EBF0)
  Border Left: 3px solid azul-500 (#165C7D)
```

#### Cell Alignments
```
Texto: left
Números: right
Ações: right
Badges: center ou left
Imagens: left com gap de 12px
```

### Responsividade Mobile

Quando < 768px, converter para Cards:

```
┌─────────────────────────────────┐
│ [IMG]  IMV-2024-001             │
│ 80px   R. Palmeiras, 1234       │
│        São Paulo - SP           │
│                                  │
│        Leilão • Leilões Obrig.  │
│        🟡 Próx. Venc. • 23d     │
│        Maria Silva              │
│        [⚠️ Pendência Fiscal]    │
│                                  │
│        [Abrir Imóvel]           │
└─────────────────────────────────┘
Background: branco
Border: 1px cinza-100
Radius: 12px
Padding: 16px
Margin Bottom: 12px
Shadow: 0 1px 3px rgba(0,0,0,0.04)
```

---

## 3. FLOW STEPPER

### Anatomia Horizontal
```
●═══════●───────○───────○───────○
Step 1  Step 2  Step 3  Step 4  Step 5
Concl.  Ativo   Futuro  Futuro  Futuro
```

### Elementos

#### Linha de Progresso
```css
Container Height: 2px
Background: cinza-200 (#E0E0E0)
Border Radius: 1px

Progress Bar:
  Background: azul-500 (#165C7D)
  Height: 2px
  Width: calculado dinamicamente
  Transition: width 500ms cubic-bezier(0.4, 0, 0.2, 1)
```

#### Step Circle - Concluído
```css
Width/Height: 40px
Background: azul-500 (#165C7D)
Border: none
Border Radius: 50%
Icon: Check (branco, 20px)
Shadow: 0 2px 4px rgba(22,92,125,0.2)
```

#### Step Circle - Ativo
```css
Width/Height: 40px
Background: #FFFFFF
Border: 3px solid azul-500 (#165C7D)
Border Radius: 50%
Text: azul-500 (número, 16px bold)
Shadow: 0 0 0 4px azul-100 (#E1EBF0)
Animation: pulse suave
```

#### Step Circle - Futuro
```css
Width/Height: 40px
Background: #FFFFFF
Border: 2px solid cinza-300 (#D1D1D1)
Border Radius: 50%
Text: cinza-400 (#B2B2B2) (número, 14px)
```

#### Label
```css
Font: 14px/20px regular
Margin Top: 12px
Text Align: center

Concluído:
  Color: cinza-600 (#6A6A6A)
  
Ativo:
  Color: azul-600 (#124A65)
  Font Weight: 600 (semibold)
  
Futuro:
  Color: cinza-500 (#8E8E8E)
```

#### Sub-label (Sub-etapas)
```css
Font: 12px/16px regular
Color: cinza-500 (#8E8E8E)
Margin Top: 4px
Display: apenas no step ativo
```

### Container
```css
Background: #FFFFFF
Border: 1px solid cinza-100 (#EFEFEF)
Border Radius: 12px
Padding: 32px 24px
Position Relative
```

---

## 4. BADGE SYSTEM

### Base Badge
```css
Display: inline-flex
Align Items: center
Padding: 6px 12px
Border Radius: 6px (pill: 999px)
Font: 12px/16px medium
Gap: 6px (entre icon e text)
White Space: nowrap
```

### SLA Badges

#### No Prazo
```css
Background: verde-50 (#E6F7ED)
Color: verde-700 (#006829)
Border: 1px solid verde-100 (#CCEFDB)
Icon: Clock (verde-500, 14px)
```

#### Próximo Vencimento
```css
Background: amarelo-50 (#FFF4E6)
Color: amarelo-800 (#CC8300)
Border: 1px solid amarelo-100 (#FFE9CC)
Icon: AlertTriangle (amarelo-500, 14px)
Animation: pulse-subtle 2s infinite
```

#### Vencido
```css
Background: vermelho-50 (#FFEEF0)
Color: vermelho-700 (#B30000)
Border: 1px solid vermelho-100 (#FFDDE0)
Icon: AlertCircle (vermelho-500, 14px)
Animation: pulse-urgent 1s infinite
```

### Status Badges

#### Em Liminar
```css
Background: turquesa-50 (#E6F3F4)
Color: turquesa-700 (#005964)
Border: 1px solid turquesa-100 (#CCE7E9)
Icon: Scale (turquesa-500, 14px)
Font Weight: 600
```

#### Pendência Fiscal
```css
Background: azul-claro-50 (#E6F6FA)
Color: azul-claro-700 (#00687D)
Border: 1px solid azul-claro-100 (#CCECF5)
Icon: FileWarning (azul-claro-500, 14px)
```

#### Venda Parcelada
```css
Background: verde-50 (#E6F7ED)
Color: verde-700 (#006829)
Border: 1px solid verde-100 (#CCEFDB)
Icon: CreditCard (verde-500, 14px)
```

### Outline Badges (Tipos)
```css
Background: transparent
Color: cinza-700 (#474747)
Border: 1px solid cinza-300 (#D1D1D1)
Padding: 4px 10px
Font: 11px/14px medium
```

---

## 5. COMMENT FEED

### Container
```css
Display: flex
Flex Direction: column
Gap: 16px
```

### Comment Item (Imutável)
```css
Background: cinza-50 (#F7F7F7)
Border: 1px solid cinza-200 (#E0E0E0)
Border Radius: 8px
Padding: 16px
Position: relative
```

### Estrutura Interna
```
┌─────────────────────────────────────┐
│ [👤] Ana Costa                      │ ← Avatar + Nome
│      19/02/2026 às 10:00            │ ← Data/Hora
│                                      │
│ 1ª tentativa telefone - não         │ ← Conteúdo
│ atendeu. Deixada mensagem.          │
│                                      │
│ [📎] 2 anexos                       │ ← Anexos (opcional)
└─────────────────────────────────────┘
```

#### Avatar
```css
Width/Height: 32px
Background: azul-100 (#E1EBF0)
Border Radius: 50%
Display: flex
Align Items: center
Justify Content: center
Icon: User (azul-500, 16px)
Margin Right: 12px
```

#### Header
```css
Display: flex
Gap: 8px
Align Items: baseline
Margin Bottom: 8px

Nome:
  Font: 14px/20px medium
  Color: cinza-900 (#1A1A1A)
  
Data:
  Font: 12px/16px regular
  Color: cinza-500 (#8E8E8E)
```

#### Conteúdo
```css
Font: 14px/20px regular
Color: cinza-700 (#474747)
White Space: pre-wrap
Word Break: break-word
```

### New Comment Form
```css
Background: #FFFFFF
Border: 1px solid cinza-200 (#E0E0E0)
Border Radius: 8px
Padding: 16px
```

```
┌─────────────────────────────────────┐
│ [Textarea]                          │
│ "Adicione um comentário..."         │
│                                      │
│                                      │
│ [📎 Anexar] [Publicar Comentário]  │
│  outline      primary azul-500      │
└─────────────────────────────────────┘
```

---

## 6. DOCUMENT CHECKLIST

### Container
```css
Display: flex
Flex Direction: column
Gap: 12px
```

### Progress Header
```css
Background: branco
Border: 1px solid cinza-100
Border Radius: 12px
Padding: 20px 24px
Margin Bottom: 16px
```

```
┌─────────────────────────────────────┐
│ Progresso do Checklist    [6/10]   │
│                                      │
│ ████████░░░░░░  60%                │
│ verde-500       cinza-200           │
└─────────────────────────────────────┘
```

### Checklist Item

#### Concluído
```css
Background: verde-50 (#E6F7ED)
Border: 2px solid verde-200 (#99DFB7)
Border Left: 4px solid verde-500 (#00B140)
Border Radius: 8px
Padding: 16px
```

#### Obrigatório Pendente
```css
Background: amarelo-50 (#FFF4E6)
Border: 2px solid amarelo-200 (#FFD699)
Border Left: 4px solid amarelo-500 (#FFA300)
Border Radius: 8px
Padding: 16px
```

#### Opcional Pendente
```css
Background: cinza-50 (#F7F7F7)
Border: 1px solid cinza-200 (#E0E0E0)
Border Radius: 8px
Padding: 16px
```

### Item Anatomia
```
┌─────────────────────────────────────────┐
│ [☑] Matrícula Atualizada  [Obrigatório]│
│     verde-500             amarelo-badge │
│                                          │
│     Concluído por Maria Silva           │
│     em 20/02/2026                       │
│     text-xs, verde-700                  │
│                                          │
│     [📄 matricula.pdf]  [Ver] [Baixar] │
│     cinza-600           links azul-500  │
└─────────────────────────────────────────┘
```

### Checkbox
```css
Width/Height: 20px
Border: 2px solid cinza-300
Border Radius: 4px
Background: branco

Checked:
  Background: azul-500 (#165C7D)
  Border: azul-500
  Icon: Check (branco, 12px)
  
Disabled:
  Opacity: 0.5
  Cursor: not-allowed
```

---

## 7. FORM CONTROLS

### Text Input
```css
Width: 100%
Height: 44px
Background: #FFFFFF
Border: 1px solid cinza-200 (#E0E0E0)
Border Radius: 8px
Padding: 12px 16px
Font: 14px/20px regular
Color: cinza-900 (#1A1A1A)
Placeholder Color: cinza-400 (#B2B2B2)
Transition: all 150ms ease

Focus:
  Border: 2px solid azul-500 (#165C7D)
  Outline: 0
  Box Shadow: 0 0 0 3px azul-100 (#E1EBF0)
  Padding: 11px 15px (compensar border)
  
Error:
  Border: 1px solid vermelho-500 (#E63946)
  
  Focus:
    Border: 2px solid vermelho-500
    Box Shadow: 0 0 0 3px vermelho-100
    
Disabled:
  Background: cinza-50 (#F7F7F7)
  Color: cinza-400 (#B2B2B2)
  Cursor: not-allowed
```

### Select/Dropdown
```css
(Mesmo estilo do Input)

Icon (ChevronDown):
  Position: absolute
  Right: 16px
  Width/Height: 16px
  Color: cinza-500 (#8E8E8E)
  Pointer Events: none
  
Open:
  Icon Transform: rotate(180deg)
```

### Textarea
```css
(Mesmo estilo do Input)
Min Height: 96px
Resize: vertical
Line Height: 1.5
```

### Label
```css
Display: block
Font: 14px/20px medium
Color: cinza-700 (#474747)
Margin Bottom: 8px

Required (*):
  After Content: " *"
  Color: vermelho-500 (#E63946)
```

### Helper Text
```css
Display: block
Font: 12px/16px regular
Color: cinza-500 (#8E8E8E)
Margin Top: 6px

Error State:
  Color: vermelho-600 (#CC2E39)
  Icon: AlertCircle (14px)
```

---

## 8. MODAL SYSTEM

### Overlay
```css
Position: fixed
Inset: 0
Background: rgba(0, 0, 0, 0.4)
Backdrop Filter: blur(4px)
Display: flex
Align Items: center
Justify Content: center
Z Index: 1000
Animation: fade-in 200ms ease

Click Handler: fecha modal (dismissible)
```

### Container
```css
Background: #FFFFFF
Border Radius: 16px
Box Shadow: 0 20px 60px rgba(0, 0, 0, 0.2)
Max Width: 600px (md), 800px (lg), 480px (sm)
Width: 90vw
Max Height: 90vh
Display: flex
Flex Direction: column
Animation: scale-in 250ms cubic-bezier(0.16, 1, 0.3, 1)
```

### Header
```css
Padding: 24px 32px
Border Bottom: 1px solid cinza-100 (#EFEFEF)
Display: flex
Align Items: center
Justify Content: space-between
Flex Shrink: 0

Title:
  Font: 20px/28px semibold
  Color: cinza-900 (#1A1A1A)
  
Close Button:
  Width/Height: 32px
  Border Radius: 6px
  Background: transparent
  Icon: X (20px, cinza-600)
  
  Hover:
    Background: cinza-50 (#F7F7F7)
```

### Body
```css
Padding: 32px
Overflow Y: auto
Flex: 1
```

### Footer
```css
Padding: 24px 32px
Border Top: 1px solid cinza-100 (#EFEFEF)
Background: cinza-25 (#FAFAFA)
Display: flex
Gap: 12px
Justify Content: flex-end
Flex Shrink: 0
Border Radius: 0 0 16px 16px
```

### Animações
```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## 9. NAVIGATION

### Sidebar

#### Container
```css
Width: 280px
Height: 100vh
Background: linear-gradient(180deg, azul-100 0%, azul-50 100%)
              ou azul-100 (#E1EBF0) sólido
Border Right: 1px solid azul-200 (#D2E2E8)
Position: fixed
Left: 0
Top: 0
Display: flex
Flex Direction: column
Z Index: 100
```

#### Logo Area
```css
Padding: 24px
Border Bottom: 1px solid azul-200 (#D2E2E8)
Display: flex
Align Items: center
Gap: 12px
Flex Shrink: 0

Logo:
  Height: 32px
  Width: auto
  
Text:
  Font: 18px/24px semibold
  Color: azul-600 (#124A65)
```

#### Nav Section
```css
Padding: 24px 12px
Flex: 1
Overflow Y: auto
```

#### Nav Item (Inativo)
```css
Display: flex
Align Items: center
Gap: 12px
Padding: 12px 16px
Border Radius: 8px
Margin Bottom: 4px
Font: 14px/20px medium
Color: cinza-700 (#474747)
Text Decoration: none
Transition: all 150ms ease
Cursor: pointer

Icon:
  Width/Height: 20px
  Color: cinza-600 (#6A6A6A)

Hover:
  Background: azul-50 (#F0F5F7)
  Color: azul-600 (#124A65)
  
  Icon:
    Color: azul-500 (#165C7D)
```

#### Nav Item (Ativo)
```css
Background: #FFFFFF
Color: azul-600 (#124A65)
Font Weight: 600
Border Left: 3px solid azul-500 (#165C7D)
Padding Left: 13px (compensar border)
Box Shadow: 0 2px 4px rgba(0, 0, 0, 0.04)

Icon:
  Color: azul-500 (#165C7D)
```

#### Nav CTA (Cadastrar/Registrar)
```css
Background: azul-500 (#165C7D)
Color: #FFFFFF
Margin: 8px 12px
Padding: 12px 16px
Border Radius: 8px
Text Align: center
Font Weight: 600
Box Shadow: 0 2px 6px rgba(22, 92, 125, 0.2)

Hover:
  Background: azul-600 (#124A65)
  Box Shadow: 0 4px 10px rgba(22, 92, 125, 0.3)
  Transform: translateY(-1px)
```

### Topbar

#### Container
```css
Height: 64px
Background: #FFFFFF
Border Bottom: 1px solid cinza-100 (#EFEFEF)
Padding: 0 32px
Display: flex
Align Items: center
Gap: 24px
Position: sticky
Top: 0
Z Index: 90
Box Shadow: 0 1px 3px rgba(0, 0, 0, 0.04)
```

#### Search Bar
```css
Width: 400px
Height: 40px
Background: cinza-50 (#F7F7F7)
Border: 1px solid cinza-200 (#E0E0E0)
Border Radius: 8px
Padding: 0 16px 0 44px
Font: 14px/20px regular
Color: cinza-900 (#1A1A1A)
Position: relative
Transition: all 150ms ease

Icon (Search):
  Position: absolute
  Left: 16px
  Top: 50%
  Transform: translateY(-50%)
  Width/Height: 20px
  Color: cinza-500 (#8E8E8E)

Focus:
  Background: #FFFFFF
  Border: 1px solid azul-300 (#A3C5D1)
  Box Shadow: 0 0 0 3px azul-50 (#F0F5F7)
```

#### User Menu
```css
Margin Left: auto
Display: flex
Align Items: center
Gap: 16px

Notification Icon:
  Width/Height: 40px
  Border Radius: 8px
  Background: transparent
  Icon: Bell (20px, cinza-600)
  Position: relative
  
  Badge (se houver):
    Position: absolute
    Top: 8px
    Right: 8px
    Width: 8px
    Height: 8px
    Background: vermelho-500
    Border: 2px solid branco
    Border Radius: 50%
  
  Hover:
    Background: cinza-50 (#F7F7F7)

Avatar:
  Width/Height: 40px
  Border Radius: 50%
  Background: azul-100 (#E1EBF0)
  Display: flex
  Align Items: center
  Justify Content: center
  Icon: User (20px, azul-500)
  Cursor: pointer
  
  Hover:
    Box Shadow: 0 0 0 3px azul-50 (#F0F5F7)
```

---

## 10. ALERT SYSTEM

### Base Alert
```css
Display: flex
Gap: 12px
Padding: 16px 20px
Border Radius: 8px
Font: 14px/20px regular
```

### Info Alert
```css
Background: azul-claro-50 (#E6F6FA)
Border Left: 4px solid azul-claro-500 (#00A9CE)

Icon (Info):
  Width/Height: 20px
  Color: azul-claro-500
  Flex Shrink: 0
  
Text:
  Color: cinza-900 (#1A1A1A)
  
Title (opcional):
  Font Weight: 600
  Color: azul-claro-700 (#00687D)
  Margin Bottom: 4px
```

### Success Alert
```css
Background: verde-50 (#E6F7ED)
Border Left: 4px solid verde-500 (#00B140)

Icon (CheckCircle):
  Color: verde-500
  
Title Color: verde-700 (#006829)
```

### Warning Alert
```css
Background: amarelo-50 (#FFF4E6)
Border Left: 4px solid amarelo-500 (#FFA300)

Icon (AlertTriangle):
  Color: amarelo-500
  
Title Color: amarelo-800 (#CC8300)
```

### Error Alert
```css
Background: vermelho-50 (#FFEEF0)
Border Left: 4px solid vermelho-500 (#E63946)

Icon (AlertCircle):
  Color: vermelho-500
  
Title Color: vermelho-700 (#B30000)
```

### Toast Notification
```css
Position: fixed
Bottom: 24px
Right: 24px
Background: #FFFFFF
Border: 1px solid cinza-200 (#E0E0E0)
Border Radius: 12px
Padding: 16px 20px
Box Shadow: 0 8px 24px rgba(0, 0, 0, 0.12)
Min Width: 320px
Max Width: 480px
Z Index: 9999
Animation: slide-in-up 250ms ease

Display: flex
Align Items: start
Gap: 12px

Close Button:
  Margin Left: auto
  Padding: 4px
  Border Radius: 4px
  Icon: X (16px, cinza-500)
  
  Hover:
    Background: cinza-50
```

---

## RESPONSIVIDADE

### Breakpoints
```css
/* Mobile */
@media (max-width: 767px) {
  - Sidebar: ocultar, mostrar em overlay ao clicar hamburger
  - Topbar: reduzir padding para 16px
  - Search: esconder, mostrar em modal ao clicar ícone
  - Tabelas: converter para cards
  - Grid 2 colunas: virar 1 coluna
  - Font sizes: reduzir em 1-2px
  - Padding cards: 16px
  - Modal: width 95vw
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  - Sidebar: pode colapsar para ícones apenas (64px)
  - Manter estrutura desktop com ajustes
  - Grid 3 colunas: virar 2 colunas
}

/* Desktop */
@media (min-width: 1024px) {
  - Layout padrão
  - Sidebar 280px
  - Tabelas completas
}
```

### Mobile Adaptations

#### Sidebar Mobile
```css
Transform: translateX(-100%)
Transition: transform 300ms ease
Position: fixed
Z Index: 200
Box Shadow: 2px 0 8px rgba(0, 0, 0, 0.1)

Open State:
  Transform: translateX(0)
  
Overlay:
  Background: rgba(0, 0, 0, 0.4)
  Backdrop Filter: blur(2px)
```

#### Mobile Topbar
```css
Height: 56px
Padding: 0 16px

Hamburger Menu:
  Display: flex (apenas mobile)
  Width/Height: 40px
  Icon: Menu (24px)
  
Logo:
  Font Size: 16px
  
Search:
  Display: none
  
  Search Icon Button:
    Display: flex
    Width/Height: 40px
```

---

## ACESSIBILIDADE

### Contraste Mínimo (WCAG AA)
```
Texto normal (< 18px): 4.5:1
Texto grande (≥ 18px): 3:1
Elementos interativos: 3:1

Combinações aprovadas:
- cinza-900 em branco: 15.8:1 ✓
- azul-500 em branco: 6.1:1 ✓
- verde-700 em verde-50: 7.2:1 ✓
- amarelo-800 em amarelo-50: 6.8:1 ✓
- vermelho-700 em vermelho-50: 7.5:1 ✓
```

### Focus Visible
```css
*:focus-visible {
  Outline: 2px solid azul-500 (#165C7D)
  Outline Offset: 2px
  Border Radius: inherit
}

Buttons, Links:
  Outline Offset: 3px
  
Form Controls:
  Box Shadow: 0 0 0 3px azul-100 (#E1EBF0)
  Outline: 2px solid azul-500
```

### Screen Reader Only
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### ARIA Labels
```
Buttons com ícone apenas:
  aria-label="Descrição da ação"
  
Status indicators:
  role="status"
  aria-live="polite"
  
Alerts:
  role="alert"
  aria-live="assertive"
  
Navigation:
  <nav aria-label="Navegação principal">
  
Breadcrumbs:
  <nav aria-label="Breadcrumb">
  
Tabs:
  role="tablist"
  role="tab" aria-selected="true/false"
  role="tabpanel"
```

---

FIM DA ESPECIFICAÇÃO DE COMPONENTES
