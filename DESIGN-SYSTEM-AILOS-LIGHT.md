# Design System - Gestão de Imóveis Ailos Light

## 🎨 Paleta de Cores

### Cores Base (Ailos)
```
Azul Profundo (Primária):  #165C7D
Turquesa:                  #007D8A
Azul Claro:                #00A9CE
Verde Escuro:              #007041
Verde Sucesso:             #00B140
Amarelo Destaque:          #FFA300
Marrom Apoio:              #886B25
Cinza:                     #B2B2B2
Branco:                    #FFFFFF
```

### Paleta Expandida (Tints para UI Light)

#### Azul Profundo (#165C7D)
```
azul-50:   #F0F5F7  (5% - backgrounds muito suaves)
azul-100:  #E1EBF0  (8% - cards, sidebar)
azul-200:  #D2E2E8  (12% - hover states)
azul-300:  #A3C5D1  (25% - borders)
azul-400:  #5F92A9  (50% - text secundário)
azul-500:  #165C7D  (100% - CTA primário)
azul-600:  #124A65  (hover botões)
azul-700:  #0E3A4E  (pressed)
```

#### Turquesa (#007D8A)
```
turquesa-50:   #E6F3F4  (badges leves)
turquesa-100:  #CCE7E9
turquesa-500:  #007D8A  (tag "Em Liminar")
```

#### Azul Claro (#00A9CE)
```
azul-claro-50:   #E6F6FA  (info backgrounds)
azul-claro-100:  #CCECF5
azul-claro-500:  #00A9CE  (tag "Solicitação Fiscal")
```

#### Verde (#00B140)
```
verde-50:   #E6F7ED  (success backgrounds)
verde-100:  #CCEFDB
verde-500:  #00B140  (sucesso, SLA OK)
verde-600:  #009033  (hover)
```

#### Amarelo (#FFA300)
```
amarelo-50:   #FFF4E6  (warning backgrounds)
amarelo-100:  #FFE9CC
amarelo-500:  #FFA300  (atenção, SLA próximo)
```

#### Vermelho (Derivado para Erro)
```
vermelho-50:   #FFEEF0
vermelho-100:  #FFDDE0
vermelho-500:  #E63946  (erro, SLA vencido)
```

#### Cinza (Neutros)
```
cinza-25:   #FAFAFA  (background app)
cinza-50:   #F7F7F7  (backgrounds secundários)
cinza-100:  #EFEFEF  (divisores suaves)
cinza-200:  #E0E0E0  (borders)
cinza-300:  #D1D1D1
cinza-400:  #B2B2B2  (texto desabilitado)
cinza-500:  #8E8E8E  (texto secundário)
cinza-600:  #6A6A6A  (texto terciário)
cinza-700:  #474747  (texto primário)
cinza-900:  #1A1A1A  (títulos)
```

---

## 📐 Espaçamento

### Sistema de 4pt Grid
```
spacing-1:  4px   (xs)
spacing-2:  8px   (sm)
spacing-3:  12px  (md)
spacing-4:  16px  (base)
spacing-5:  20px
spacing-6:  24px  (lg)
spacing-7:  28px
spacing-8:  32px  (xl)
spacing-10: 40px  (2xl)
spacing-12: 48px  (3xl)
spacing-16: 64px  (4xl)
```

### Aplicações
- **Padding cards:** 24px (lg)
- **Margin entre seções:** 32px (xl)
- **Gap em grids:** 16px ou 24px
- **Padding buttons:** 12px vertical, 24px horizontal
- **Padding inputs:** 12px vertical, 16px horizontal

---

## 🔤 Tipografia

### Família
```
Font Primary:   Inter (preferencial)
Font Fallback:  Segoe UI, -apple-system, system-ui
```

### Escala Tipográfica
```
heading-1:  32px / 40px  (line-height) • 700 (bold)
heading-2:  24px / 32px  • 600 (semibold)
heading-3:  20px / 28px  • 600 (semibold)
heading-4:  18px / 24px  • 600 (semibold)
body-lg:    16px / 24px  • 400 (regular)
body:       14px / 20px  • 400 (regular)
body-sm:    12px / 16px  • 400 (regular)
caption:    11px / 14px  • 400 (regular)
button:     14px / 20px  • 500 (medium)
label:      14px / 20px  • 500 (medium)
```

### Hierarquia de Cores de Texto
```
Primário:    cinza-900 (#1A1A1A)
Secundário:  cinza-600 (#6A6A6A)
Terciário:   cinza-500 (#8E8E8E)
Disabled:    cinza-400 (#B2B2B2)
Link:        azul-500 (#165C7D)
Link Hover:  azul-600 (#124A65)
```

---

## 🎭 Componentes Base

### 1. Buttons

#### Primary (CTA Principal)
```
Background:       azul-500 (#165C7D)
Text:             #FFFFFF
Border:           none
Border Radius:    8px
Padding:          12px 24px
Font:             button (14px/20px, medium)
Shadow:           0 1px 3px rgba(0,0,0,0.08)

Hover:
  Background:     azul-600 (#124A65)
  Shadow:         0 2px 6px rgba(0,0,0,0.12)

Pressed:
  Background:     azul-700 (#0E3A4E)
  
Disabled:
  Background:     cinza-200 (#E0E0E0)
  Text:           cinza-400 (#B2B2B2)
```

#### Secondary (Outline)
```
Background:       #FFFFFF
Text:             azul-500 (#165C7D)
Border:           1px solid azul-300 (#A3C5D1)
Border Radius:    8px
Padding:          12px 24px

Hover:
  Background:     azul-50 (#F0F5F7)
  Border:         azul-400 (#5F92A9)
```

#### Ghost (Texto apenas)
```
Background:       transparent
Text:             azul-500 (#165C7D)
Padding:          8px 16px

Hover:
  Background:     azul-50 (#F0F5F7)
```

#### Icon Button
```
Size:             40px × 40px
Icon Size:        20px
Border Radius:    8px
Background:       transparent

Hover:
  Background:     azul-50 (#F0F5F7)
```

---

### 2. Inputs & Forms

#### Text Input
```
Background:       #FFFFFF
Border:           1px solid cinza-200 (#E0E0E0)
Border Radius:    8px
Padding:          12px 16px
Font:             body (14px/20px)
Text Color:       cinza-900 (#1A1A1A)
Placeholder:      cinza-400 (#B2B2B2)

Focus:
  Border:         2px solid azul-500 (#165C7D)
  Shadow:         0 0 0 3px azul-100 (#E1EBF0)

Error:
  Border:         1px solid vermelho-500 (#E63946)
  
Disabled:
  Background:     cinza-50 (#F7F7F7)
  Border:         cinza-200 (#E0E0E0)
  Text:           cinza-400 (#B2B2B2)
```

#### Select / Dropdown
```
(Mesmo estilo do Input)
Icon:             Chevron Down (16px, cinza-500)
```

#### Textarea
```
(Mesmo estilo do Input)
Min Height:       96px
Resize:           vertical
```

#### Checkbox
```
Size:             20px × 20px
Border:           2px solid cinza-300 (#D1D1D1)
Border Radius:    4px
Background:       #FFFFFF

Checked:
  Background:     azul-500 (#165C7D)
  Border:         azul-500
  Icon:           Check (branco)
```

#### Radio
```
Size:             20px × 20px
Border:           2px solid cinza-300
Border Radius:    50%

Selected:
  Border:         azul-500
  Inner Dot:      8px × 8px, azul-500
```

---

### 3. Cards

#### Card Padrão
```
Background:       #FFFFFF
Border:           1px solid cinza-100 (#EFEFEF)
Border Radius:    12px
Padding:          24px
Shadow:           0 1px 3px rgba(0,0,0,0.04)

Hover (se interativo):
  Shadow:         0 4px 12px rgba(0,0,0,0.08)
  Border:         cinza-200 (#E0E0E0)
```

#### Card de Destaque (KPI)
```
Background:       gradiente suave
                  azul-50 → azul-100 (vertical)
Border:           1px solid azul-200 (#D2E2E8)
Border Radius:    12px
Padding:          24px
```

#### Card Clickable (Lista)
```
Cursor:           pointer
Transition:       all 200ms ease

Hover:
  Transform:      translateY(-2px)
  Shadow:         0 6px 16px rgba(0,0,0,0.1)
```

---

### 4. Badges & Tags

#### SLA Badge - No Prazo
```
Background:       verde-50 (#E6F7ED)
Text:             verde-600 (#009033)
Border:           1px solid verde-100 (#CCEFDB)
Border Radius:    6px (pill)
Padding:          4px 12px
Font:             body-sm (12px/16px, medium)
Icon:             Clock (verde-500)
```

#### SLA Badge - Próximo Vencimento
```
Background:       amarelo-50 (#FFF4E6)
Text:             amarelo-700 (#CC8300)
Border:           amarelo-100 (#FFE9CC)
Icon:             AlertTriangle (amarelo-500)
```

#### SLA Badge - Vencido
```
Background:       vermelho-50 (#FFEEF0)
Text:             vermelho-600 (#CC2E39)
Border:           vermelho-100 (#FFDDE0)
Icon:             AlertCircle (vermelho-500)
```

#### Tag - Em Liminar
```
Background:       turquesa-50 (#E6F3F4)
Text:             turquesa-600 (#00626E)
Border:           turquesa-100 (#CCE7E9)
Icon:             Scale (turquesa-500)
```

#### Tag - Pendência Fiscal
```
Background:       azul-claro-50 (#E6F6FA)
Text:             azul-claro-600 (#0087A5)
Border:           azul-claro-100 (#CCECF5)
Icon:             FileWarning (azul-claro-500)
```

#### Tag - Venda Parcelada
```
Background:       verde-50 (#E6F7ED)
Text:             verde-600 (#009033)
Border:           verde-100 (#CCEFDB)
Icon:             CreditCard (verde-500)
```

---

### 5. Table

#### Table Container
```
Background:       #FFFFFF
Border:           1px solid cinza-100 (#EFEFEF)
Border Radius:    12px
Overflow:         hidden
```

#### Table Header
```
Background:       cinza-50 (#F7F7F7)
Border Bottom:    1px solid cinza-200 (#E0E0E0)
Padding:          16px 24px
Font:             label (14px/20px, medium)
Text Color:       cinza-700 (#474747)
```

#### Table Row
```
Border Bottom:    1px solid cinza-100 (#EFEFEF)
Padding:          16px 24px

Hover:
  Background:     azul-50 (#F0F5F7)
```

#### Table Cell
```
Font:             body (14px/20px)
Text Color:       cinza-900 (#1A1A1A)
Vertical Align:   middle
```

---

### 6. Stepper (Horizontal)

#### Container
```
Background:       #FFFFFF
Border:           1px solid cinza-100
Border Radius:    12px
Padding:          24px
```

#### Linha de Progresso
```
Height:           2px
Background:       cinza-200 (#E0E0E0)

Progresso:
  Background:     azul-500 (#165C7D)
  Transition:     width 500ms ease
```

#### Step Circle (Concluído)
```
Size:             40px × 40px
Background:       azul-500 (#165C7D)
Border:           none
Icon:             Check (branco, 20px)
Text:             #FFFFFF
```

#### Step Circle (Ativo)
```
Size:             40px × 40px
Background:       #FFFFFF
Border:           2px solid azul-500 (#165C7D)
Text:             azul-500 (número)
Shadow:           0 0 0 4px azul-100 (#E1EBF0)
```

#### Step Circle (Futuro)
```
Size:             40px × 40px
Background:       #FFFFFF
Border:           2px solid cinza-300 (#D1D1D1)
Text:             cinza-400 (#B2B2B2)
```

#### Step Label
```
Font:             body (14px/20px)
Margin Top:       8px

Ativo:
  Color:          azul-500 (#165C7D)
  Weight:         600 (semibold)

Outros:
  Color:          cinza-600 (#6A6A6A)
  Weight:         400
```

---

### 7. Alerts & Notifications

#### Info Alert
```
Background:       azul-claro-50 (#E6F6FA)
Border Left:      4px solid azul-claro-500 (#00A9CE)
Padding:          16px 24px
Border Radius:    8px
Icon:             Info (azul-claro-500)
Text:             cinza-900 (#1A1A1A)
```

#### Success Alert
```
Background:       verde-50 (#E6F7ED)
Border Left:      4px solid verde-500 (#00B140)
Icon:             CheckCircle (verde-500)
```

#### Warning Alert
```
Background:       amarelo-50 (#FFF4E6)
Border Left:      4px solid amarelo-500 (#FFA300)
Icon:             AlertTriangle (amarelo-500)
```

#### Error Alert
```
Background:       vermelho-50 (#FFEEF0)
Border Left:      4px solid vermelho-500 (#E63946)
Icon:             AlertCircle (vermelho-500)
```

---

### 8. Modal / Dialog

#### Overlay
```
Background:       rgba(0, 0, 0, 0.4)
Backdrop Filter:  blur(4px)
```

#### Container
```
Background:       #FFFFFF
Border Radius:    16px
Shadow:           0 20px 60px rgba(0, 0, 0, 0.2)
Max Width:        600px (md), 800px (lg)
Padding:          0
```

#### Header
```
Padding:          24px 32px
Border Bottom:    1px solid cinza-100 (#EFEFEF)
Font:             heading-3 (20px/28px, semibold)
```

#### Body
```
Padding:          32px
Max Height:       calc(90vh - 160px)
Overflow:         auto
```

#### Footer
```
Padding:          24px 32px
Border Top:       1px solid cinza-100
Background:       cinza-25 (#FAFAFA)
Display:          flex
Justify:          flex-end
Gap:              12px
```

---

### 9. Sidebar

#### Container
```
Width:            280px
Background:       azul-100 (#E1EBF0) com gradiente sutil
Border Right:     1px solid azul-200 (#D2E2E8)
Height:           100vh
Position:         fixed
```

#### Logo Area
```
Padding:          24px
Border Bottom:    1px solid azul-200 (#D2E2E8)
```

#### Nav Item (Inativo)
```
Padding:          12px 24px
Border Radius:    8px
Margin:           4px 12px
Font:             body (14px/20px, medium)
Color:            cinza-700 (#474747)

Hover:
  Background:     azul-50 (#F0F5F7)
  Color:          azul-600 (#124A65)
```

#### Nav Item (Ativo)
```
Background:       #FFFFFF
Color:            azul-600 (#124A65)
Border Left:      3px solid azul-500 (#165C7D)
Shadow:           0 2px 4px rgba(0, 0, 0, 0.04)
```

---

### 10. Topbar

#### Container
```
Height:           64px
Background:       #FFFFFF
Border Bottom:    1px solid cinza-100 (#EFEFEF)
Padding:          0 32px
Shadow:           0 1px 3px rgba(0, 0, 0, 0.04)
```

#### Search Bar
```
Width:            400px
Background:       cinza-50 (#F7F7F7)
Border:           1px solid cinza-200 (#E0E0E0)
Border Radius:    8px
Padding:          10px 16px
Icon:             Search (cinza-500, 20px)

Focus:
  Background:     #FFFFFF
  Border:         azul-300 (#A3C5D1)
```

---

## 📱 Responsividade

### Breakpoints
```
Mobile:     < 768px   (375px base)
Tablet:     768px - 1023px
Desktop:    ≥ 1024px  (1440px ideal)
```

### Adaptações Mobile
- Sidebar vira hamburger menu
- Tabelas viram cards empilhados
- 2 colunas viram 1 coluna
- Padding reduzido (16px → 12px)
- Font size reduzido em títulos (-2px)

---

## 🎯 Acessibilidade

### Contraste
```
Texto primário em branco:    mín. 4.5:1
Texto secundário:            mín. 4.5:1
Elementos interativos:       mín. 3:1
```

### Focus States
```
Outline:          2px solid azul-500 (#165C7D)
Offset:           2px
Border Radius:    inherit do elemento
```

### Screen Readers
- Labels descritivas em todos inputs
- ARIA labels em ícones-botão
- Alt text em imagens

---

## 🌓 Estados da Interface

### Loading
```
Skeleton:
  Background:     cinza-100 (#EFEFEF)
  Animation:      shimmer (cinza-50 → cinza-200)
  Border Radius:  8px
```

### Empty State
```
Container:        centrado, padding 64px
Icon:             cinza-300 (64px)
Título:           heading-3, cinza-700
Descrição:        body, cinza-500
CTA:              button primary
```

### Erro
```
Container:        vermelho-50 background
Icon:             AlertCircle (vermelho-500, 48px)
Mensagem:         heading-4, vermelho-700
Ação:             button secondary
```

---

## 📦 Bibliotecas de Ícones

### Fonte Recomendada
```
Lucide Icons
Tamanhos: 16px, 20px, 24px
Stroke:   2px
```

### Principais Ícones
```
Home, Building2, Scale, FileText, DollarSign,
Users, Clock, AlertCircle, AlertTriangle,
CheckCircle, X, ChevronDown, ChevronRight,
Upload, Download, Eye, Edit, Trash2,
Phone, Mail, MapPin, Calendar, Search,
Plus, Filter, Menu, Settings, LogOut
```

---

## 🎬 Animações & Transições

### Duração
```
Rápida:   150ms  (hover, focus)
Normal:   250ms  (expand, collapse)
Suave:    400ms  (page transitions)
```

### Easing
```
Ease Out:     cubic-bezier(0.16, 1, 0.3, 1)
Ease In Out:  cubic-bezier(0.4, 0, 0.2, 1)
```

### Aplicações
```
Hover States:     150ms ease-out
Button Press:     100ms ease-in
Modal Open:       250ms ease-out
Drawer Slide:     300ms ease-in-out
Skeleton:         1500ms ease-in-out infinite
```
