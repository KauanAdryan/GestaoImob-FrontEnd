# Sitemap & Navegação - Sistema de Gestão de Imóveis Ailos

## 🗺️ Arquitetura de Informação

```
GESTÃO DE IMÓVEIS AILOS
│
├─ 📊 DASHBOARD / LISTA DE IMÓVEIS (/)
│  │
│  ├─ Componentes da Tela:
│  │  ├─ Topbar (search global, notificações, perfil)
│  │  ├─ Filtros (etapa, SLA, responsável, tags)
│  │  ├─ KPIs (4 cards: total, SLA vencido, liminar, fiscal)
│  │  ├─ Tabela/Cards de imóveis
│  │  └─ Paginação
│  │
│  └─ Ações Disponíveis:
│     ├─ [+ Cadastrar Imóvel] → /novo
│     ├─ [📝 Registrar Atualização] → /atualizar
│     ├─ [Abrir] por linha → /:id
│     ├─ [Atualizar] por linha → /atualizar?imovel=:id
│     ├─ [Ver Documentos] por linha → /:id/documentos
│     └─ [Solicitar Ocorrência Fiscal] → modal inline
│
├─ ➕ CADASTRO DE IMÓVEL (/novo)
│  │
│  ├─ Etapa 1: Dados Básicos
│  │  ├─ Código, tipo, características
│  │  ├─ Valores e matrícula
│  │  ├─ Descrição
│  │  └─ Foto principal
│  │
│  ├─ Etapa 2: Localização
│  │  ├─ CEP com busca automática
│  │  ├─ Endereço completo
│  │  └─ Cidade/Estado
│  │
│  ├─ Etapa 3: Documentos
│  │  ├─ Checklist de docs obrigatórios
│  │  ├─ Upload múltiplo
│  │  └─ Atribuição de responsável
│  │
│  └─ Navegação:
│     ├─ [← Voltar] → /
│     ├─ [Cancelar] → /
│     ├─ [Próxima Etapa →] (1→2, 2→3)
│     ├─ [← Etapa Anterior] (3→2, 2→1)
│     └─ [Cadastrar Imóvel] → /:id (novo ID criado)
│
├─ 📝 REGISTRO DE ATUALIZAÇÃO (/atualizar)
│  │
│  ├─ Componentes:
│  │  ├─ Autocomplete de imóvel
│  │  ├─ Seleção de etapa relacionada
│  │  ├─ Chips de tipo de atualização
│  │  ├─ Form de detalhes (título, descrição)
│  │  ├─ Tags opcionais
│  │  ├─ Upload de anexos
│  │  ├─ SLA opcional
│  │  └─ Toggle de mudança de etapa
│  │
│  └─ Ações:
│     ├─ [Cancelar] → / ou origem
│     ├─ [Salvar Atualização] → toast + voltar
│     └─ [Salvar e Abrir Imóvel] → /:id
│
└─ 🏠 PERFIL DO IMÓVEL (/:id)
   │
   ├─ Componentes Globais:
   │  ├─ Cabeçalho (foto, ID, endereço, SLA, responsável, tags)
   │  ├─ Stepper horizontal (7 etapas do fluxo)
   │  └─ Navegação por abas (9 abas)
   │
   ├─ 📋 ABA: RESUMO
   │  ├─ Cards: Etapa atual, Próximos passos, Alertas
   │  ├─ Resumo financeiro (avaliação, despesas, líquido)
   │  ├─ Documentos pendentes
   │  └─ Timeline de últimas atualizações
   │
   ├─ ⚖️ ABA: LEILÃO (/:id/leilao)
   │  │
   │  ├─ Seção 1: Leilões Obrigatórios
   │  │  ├─ Cadastro de 1º, 2º (e 3º se necessário)
   │  │  ├─ Leiloeiro, datas, valores
   │  │  ├─ Status (agendado, realizado, deserto, vendido)
   │  │  └─ Documentos por leilão
   │  │
   │  ├─ Seção 2: Toggle "Vendido em Leilão"
   │  │  ├─ Se ativado: modal de confirmação
   │  │  └─ Ação: pula etapas → vai para /venda
   │  │
   │  ├─ Seção 3: Finalizar Leilões Obrigatórios
   │  │  ├─ Data/valor quitação
   │  │  ├─ Observações
   │  │  └─ Anexos obrigatórios (4 documentos)
   │  │
   │  ├─ Seção 4: Averbação da Matrícula
   │  │  ├─ Data averbação
   │  │  ├─ Nº averbação
   │  │  └─ Upload matrícula atualizada
   │  │
   │  └─ Seção 5: Atribuir Responsável
   │     └─ Dropdown usuários Gestão de Bens
   │
   ├─ 🤝 ABA: NEGOCIAÇÃO (/:id/negociacao)
   │  │
   │  ├─ Toggle: Amigável vs Não Amigável
   │  │
   │  ├─ Sub-abas:
   │  │  ├─ [Planner de Tópicos]
   │  │  ├─ [Tentativas de Contato]
   │  │  └─ [Documentos e Acordos]
   │  │
   │  ├─ Planner (Tópicos Obrigatórios):
   │  │  ├─ Tópico 1: Prazo inicial desocupação
   │  │  ├─ Tópico 2: Tentativas de contato (mín. 3)
   │  │  ├─ Tópico 3: Avaliação recompra (opcional)
   │  │  ├─ Tópico 4: Acordo de desocupação
   │  │  │
   │  │  └─ Cada Tópico:
   │  │     ├─ Status (concluído/ativo/futuro)
   │  │     ├─ SLA individual
   │  │     ├─ Área de trabalho (só no ativo)
   │  │     ├─ Comentários imutáveis
   │  │     └─ Ações: [Salvar] [Concluir]
   │  │
   │  ├─ Tentativas de Contato:
   │  │  ├─ Lista de tentativas (tipo, data, resultado)
   │  │  ├─ [+ Registrar Nova Tentativa]
   │  │  └─ Alerta: mínimo 3 obrigatórias
   │  │
   │  └─ Negociação Não Amigável (diferencial):
   │     ├─ Card: 3º Leilão (em avaliação)
   │     └─ Card: Reintegração de Posse
   │
   ├─ ⚖️ ABA: JURÍDICO
   │  │
   │  ├─ Timeline estilo Blog:
   │  │  ├─ Postagens com título, autor, data, tipo
   │  │  ├─ Destaque: "Em Liminar" (turquesa, destaque visual)
   │  │  ├─ Tipos: Liminar, Processo, Parecer, Outro
   │  │  └─ Comentários por postagem
   │  │
   │  └─ Ações:
   │     └─ [+ Nova Postagem Jurídica]
   │
   ├─ 🔧 ABA: MANUTENÇÃO/PRECIFICAÇÃO (/:id/manutencao-precificacao)
   │  │
   │  ├─ Seção 1: Amostras de Mercado (mín. 5)
   │  │  ├─ Grid de amostras
   │  │  ├─ Cada amostra: link, valor, área, R$/m², print
   │  │  ├─ Progress: X/5 concluídas
   │  │  └─ [+ Adicionar Amostra]
   │  │
   │  ├─ Seção 2: Análise e Precificação
   │  │  ├─ Cards: Média valor, Média R$/m², Valor sugerido
   │  │  ├─ Input: Valor final comercialização
   │  │  └─ Textarea: Justificativa (obrigatório)
   │  │
   │  ├─ Seção 3: Status de Aprovação
   │  │  ├─ Badge: Em análise / Aprovado / Reprovado
   │  │  └─ Se aprovado: por quem e quando
   │  │
   │  └─ Ações:
   │     ├─ [Gerar PDF de Precificação]
   │     └─ [Enviar para Aprovação] (disabled se < 5 amostras)
   │
   ├─ 🏢 ABA: COMERCIAL (/:id/comercial)
   │  │
   │  ├─ Seção 1: Histórico de Imobiliárias
   │  │  ├─ Lista com status ativa/inativa
   │  │  ├─ Dados: nome, CNPJ, contato, período
   │  │  └─ [+ Nova Imobiliária]
   │  │
   │  ├─ Seção 2: Propostas (Storyline)
   │  │  ├─ Cards de propostas em timeline
   │  │  ├─ Status: pendente, aprovada, rejeitada, contra-proposta
   │  │  ├─ Dados: cliente, valor, data, % do pedido
   │  │  ├─ Comentários por proposta
   │  │  └─ Ações: [Aprovar] [Rejeitar] [Ver Histórico]
   │  │
   │  └─ Ações Gerais:
   │     ├─ [+ Registrar Proposta]
   │     ├─ [Gerar PDF de Proposta]
   │     └─ [Aceitar e Ir para Venda →]
   │
   ├─ 💰 ABA: VENDA (/:id/venda)
   │  │
   │  ├─ Seção 1: Dados da Venda
   │  │  ├─ Comprador (nome, CPF/CNPJ)
   │  │  ├─ Valor, data
   │  │  ├─ Forma pagamento (vista/parcelado/financiamento)
   │  │  └─ Observações
   │  │
   │  ├─ Seção 2: Checklist de Venda
   │  │  ├─ 7 itens obrigatórios
   │  │  ├─ 2 itens opcionais
   │  │  ├─ Progress visual
   │  │  └─ Upload por item
   │  │
   │  └─ Ações:
   │     ├─ [Salvar Rascunho]
   │     └─ [Concluir Venda e Ir para Pós-Venda →]
   │        (disabled se obrigatórios pendentes)
   │
   ├─ ✅ ABA: PÓS-VENDA (/:id/pos-venda)
   │  │
   │  ├─ Seção 1: Checklist Pós-Venda
   │  │  ├─ Itens: entrega chaves, baixa débitos, arquivo
   │  │  └─ Progress visual
   │  │
   │  ├─ Seção 2: Venda Parcelada (toggle)
   │  │  │
   │  │  ├─ Se SIM:
   │  │  │  ├─ Resumo: Total pago, A receber, Progresso
   │  │  │  ├─ Configuração: nº parcelas, valor, dia vencimento
   │  │  │  ├─ Lista de parcelas com checkboxes
   │  │  │  │
   │  │  │  └─ Cada Parcela:
   │  │  │     ├─ Nº, vencimento, valor
   │  │  │     ├─ Checkbox (paga/pendente)
   │  │  │     ├─ Upload comprovante
   │  │  │     └─ Ao marcar paga: gera ocorrência fiscal
   │  │  │
   │  │  └─ Alerta: Gatilho automático fiscal
   │  │
   │  └─ Ações:
   │     ├─ [Salvar Progresso]
   │     └─ [✅ Finalizar Processo do Imóvel]
   │        (disabled se checklist ou parcelas pendentes)
   │
   └─ 📄 ABA: SOLICITAÇÕES (/:id/solicitacoes)
      │
      ├─ Tipos de Solicitações:
      │  ├─ Ocorrência Fiscal (IPTU, ITBI, Certidões)
      │  └─ Reavaliação (gatilho automático a cada 12 meses)
      │
      ├─ Para Cada Solicitação:
      │  ├─ Badge de status (solicitado/em-andamento/concluído)
      │  ├─ Dados: tipo, descrição, solicitado por, data
      │  ├─ Observações do fiscal (read-only)
      │  └─ Histórico de atualizações
      │
      └─ Ações (Gestão de Bens):
         ├─ [Solicitar Ocorrência Fiscal] (criar nova)
         └─ [Acompanhar Status] (read-only, não pode finalizar)
```

---

## 🧭 Sidebar - Navegação Principal

### Desktop (280px)

```
┌────────────────────────────────┐
│                                │
│ [Logo Ailos]   GestãoImob      │ ← 24px padding
│                                │
├────────────────────────────────┤
│                                │
│ NAVEGAÇÃO                      │ ← 12px top margin
│                                │
│ ● Dashboard                    │ ← ativo: bg branco, border-left azul
│ ○ Solicitações                 │
│ ○ Relatórios                   │
│ ○ Configurações                │
│                                │
├────────────────────────────────┤
│                                │
│ AÇÕES RÁPIDAS                  │
│                                │
│ [+ Cadastrar Imóvel]          │ ← button CTA azul-500
│                                │
│ [📝 Registrar Atualização]    │ ← button CTA azul-500
│                                │
└────────────────────────────────┘

Background: linear-gradient azul-100 → azul-50
Border-right: 1px azul-200
```

### Mobile (Overlay)

```
┌────────────────────────────────┐
│ [X] Fechar                     │
│                                │
│ [Logo] GestãoImob              │
│                                │
├────────────────────────────────┤
│ ● Dashboard                    │
│ ○ Solicitações                 │
│ ○ Relatórios                   │
│ ○ Configurações                │
│                                │
│ [+ Cadastrar Imóvel]          │
│ [📝 Registrar Atualização]    │
│                                │
│ ───────────────────────────    │
│                                │
│ [👤] Nome Usuário              │
│ [🔔] Notificações (3)          │
│ [⚙️] Configurar Perfil         │
│ [🚪] Sair                       │
└────────────────────────────────┘

Position: fixed, left 0, top 0
Width: 80vw, max 320px
Height: 100vh
Z-index: 200
Shadow: 2px 0 8px rgba(0,0,0,0.1)
Overlay: rgba(0,0,0,0.4) blur(2px)
```

---

## 🔝 Topbar - Navegação Secundária

### Desktop

```
┌─────────────────────────────────────────────────────────────────────┐
│ [🔍 Buscar imóveis, atualizações...]              [🔔 3] [👤 Menu] │
│  search 400px width                               notif   avatar   │
└─────────────────────────────────────────────────────────────────────┘

Height: 64px
Background: branco
Border-bottom: 1px cinza-100
Shadow: 0 1px 3px rgba(0,0,0,0.04)
Padding: 0 32px
```

### Mobile

```
┌────────────────────────────────┐
│ [☰] GestãoImob    [🔔3] [👤]  │
└────────────────────────────────┘

Height: 56px
Padding: 0 16px
Search: oculto, abre modal ao clicar ícone
```

---

## 🔗 Breadcrumbs (Contexto de Navegação)

### Estrutura

```
Dashboard > Imóveis > IMV-2024-001 > Leilão

Clickable:    [Dashboard]  [Imóveis]  [IMV-2024-001]
Atual:        Leilão (cinza-900, não clickable)

Separador: > (cinza-400)
Links: azul-500, hover azul-600
Font: 14px regular
```

### Localização
```
Posicionado abaixo do cabeçalho da página
Margin-bottom: 24px
Padding: 8px 0
```

---

## 🚀 Fluxo de Navegação Típico

### Cenário 1: Cadastro Completo de Novo Imóvel

```
1. Dashboard (/)
   ↓ [+ Cadastrar Imóvel]
   
2. Cadastro - Etapa 1 (/novo?step=1)
   ↓ [Próxima Etapa →]
   
3. Cadastro - Etapa 2 (/novo?step=2)
   ↓ [Próxima Etapa →]
   
4. Cadastro - Etapa 3 (/novo?step=3)
   ↓ [Cadastrar Imóvel]
   
5. Perfil do Imóvel - Resumo (/:id)
   ↓ Stepper indica: Leilão (primeira etapa)
   
6. Clica Stepper "Leilão" ou Tab "Leilão"
   → (/:id/leilao)
   
7. Cadastra leilões obrigatórios
   → Conclui etapa
   
8. Sistema avança automaticamente stepper
   → Próxima etapa: Negociação Amigável
```

### Cenário 2: Atualização Rápida

```
1. Dashboard (/)
   ↓ [📝 Registrar Atualização] (sidebar ou topbar)
   
2. Registro de Atualização (/atualizar)
   ↓ Seleciona imóvel IMV-2024-001
   ↓ Seleciona etapa Leilão
   ↓ Tipo: Andamento
   ↓ Preenche título e descrição
   ↓ [Salvar e Abrir Imóvel]
   
3. Perfil do Imóvel (/:id)
   → Timeline mostra nova atualização
   → Toast de sucesso
```

### Cenário 3: Venda em Leilão (Atalho)

```
1. Perfil do Imóvel - Leilão (/:id/leilao)
   ↓ [☑ Vendido em leilão]
   
2. Modal de Confirmação (overlay)
   ↓ Checklist pré-venda
   ↓ [Sim, Confirmar Venda]
   
3. Sistema:
   - Marca etapas intermediárias como "Puladas"
   - Atualiza stepper (Leilão → Venda)
   - Redireciona automaticamente
   
4. Perfil do Imóvel - Venda (/:id/venda)
   → Usuário preenche dados da venda
```

---

## 🔐 Permissões e Estados

### Perfil: Gestão de Bens

#### Pode (✅):
- Visualizar todos os imóveis
- Cadastrar novos imóveis
- Editar dados de imóveis
- Registrar atualizações
- Adicionar comentários
- Upload de documentos
- Cadastrar leilões, negociações, etc.
- **Solicitar** ocorrência fiscal
- **Acompanhar status** de ocorrência fiscal
- Atribuir responsável (só Gestão de Bens)
- Aprovar precificação (se configurado)

#### Não Pode (❌):
- Finalizar pendência fiscal (exclusivo Fiscal/Ailos)
- Excluir imóveis (requer permissão especial)
- Editar comentários/atualizações (imutáveis)
- Alterar etapa manualmente (só via fluxo)

### Estados de Bloqueio

```
Imóvel em Liminar:
┌─────────────────────────────────────────────┐
│ ⚠️ IMÓVEL EM LIMINAR                        │
│ bg: vermelho-50, border-left: 4px vermelho  │
│                                              │
│ Processo judicial impede alterações nas     │
│ etapas de Negociação e Reintegração.        │
│                                              │
│ Ações bloqueadas:                           │
│ • Avançar para Reintegração                │
│ • Registrar desocupação forçada            │
│ • Finalizar negociação não amigável        │
└─────────────────────────────────────────────┘

Checklist Incompleto:
- Botão [Avançar Etapa] disabled
- Tooltip: "Complete itens obrigatórios"
- Visual: botão cinza-300, cursor not-allowed
```

---

## 📊 Indicadores de Progresso Global

### No Header do Perfil do Imóvel

```
Stepper Horizontal:
●═══●═══●───○───○───○───○
1   2   3   4   5   6   7

Concluídas: verde-500
Atual: azul-500 (glow)
Futuras: cinza-300

Hover em etapa: tooltip com nome e data conclusão
```

### Em Cada Aba com Checklist

```
Progress Bar:
████████░░░░  60% concluído
verde-500     cinza-200

Text: 6 de 10 itens concluídos
Font: 14px medium, cinza-700
```

---

## 🔔 Notificações e Alertas

### Tipos de Notificações

```
1. SLA Próximo Vencimento (3 dias antes):
   Icon: Clock amarelo
   "SLA do imóvel IMV-2024-001 vence em 3 dias"
   Link: /:id

2. SLA Vencido:
   Icon: AlertCircle vermelho
   "SLA do imóvel IMV-2023-045 está vencido"
   Link: /:id
   
3. Liminar Deferida:
   Icon: Scale turquesa
   "Liminar deferida no imóvel IMV-2023-045"
   Link: /:id/juridico
   
4. Ocorrência Fiscal Concluída:
   Icon: FileWarning verde
   "Ocorrência fiscal OCF-2024-1234 concluída"
   Link: /:id/solicitacoes
   
5. Atualização em Imóvel Atribuído:
   Icon: Bell azul
   "Nova atualização no imóvel IMV-2024-008"
   Link: /:id
```

### Centro de Notificações

```
Acesso: [🔔 3] no topbar

Dropdown:
┌────────────────────────────────────┐
│ NOTIFICAÇÕES (3)      [Marcar lidas]│
├────────────────────────────────────┤
│ [🔴] SLA vencido IMV-2023-045      │
│      Há 2 horas                     │
│      [Ver imóvel]                   │
├────────────────────────────────────┤
│ [🟡] SLA vence em 3d IMV-2024-001  │
│      Há 5 horas                     │
├────────────────────────────────────┤
│ [🔵] Atualização IMV-2024-008      │
│      Ontem às 14:30                 │
├────────────────────────────────────┤
│         [Ver Todas]                 │
└────────────────────────────────────┘

Max-height: 400px
Scroll interno se > 5 items
```

---

## 📱 Adaptações Mobile

### Navegação Bottom Tab (Alternativa)

```
Para mobile < 576px, considerar bottom navigation:

┌────────────────────────────────┐
│                                │
│ [Conteúdo da tela]            │
│                                │
└────────────────────────────────┘
┌────────────────────────────────┐
│ [🏠]  [🔍]  [+]  [🔔]  [👤]  │
│ Home  Busca Add  Notif Perfil │
└────────────────────────────────┘

Height: 64px
Background: branco
Border-top: 1px cinza-100
Shadow: 0 -2px 8px rgba(0,0,0,0.08)
Position: fixed, bottom: 0
Z-index: 100
```

---

## 🎯 Metas de Performance

### Tempo de Carregamento
- Dashboard: < 1s (first contentful paint)
- Perfil do Imóvel: < 1.5s
- Troca de abas: < 300ms
- Filtros: < 500ms (com debounce 300ms)

### Métricas de Usabilidade
- Clicks para cadastrar imóvel: máx 15 (3 etapas)
- Clicks para registrar atualização: máx 5
- Clicks para visualizar imóvel: 1 (da lista)
- Clicks para avançar etapa: máx 3 (preencher + confirmar)

---

## ✅ CHECKLIST DE NAVEGAÇÃO

### Implementação
- [ ] Sidebar com links ativos
- [ ] Topbar com search global
- [ ] Breadcrumbs em páginas internas
- [ ] Tabs no perfil do imóvel
- [ ] Stepper com navegação clicável
- [ ] Botões "Voltar" em todas as telas secundárias
- [ ] Links contextuais (ex: ver imóvel, ver documentos)
- [ ] Redirect automático pós-cadastro
- [ ] Redirect automático em "vendido em leilão"

### Estados
- [ ] Loading states em todas as transições
- [ ] Disabled states em botões com condições
- [ ] Active/Current indicators
- [ ] Hover states em links
- [ ] Focus states em navegação keyboard

### Mobile
- [ ] Hamburger menu funcional
- [ ] Overlay sidebar
- [ ] Bottom navigation (opcional)
- [ ] Swipe gestures em tabs (opcional)
- [ ] Pull-to-refresh (opcional)

---

FIM DO SITEMAP E NAVEGAÇÃO
