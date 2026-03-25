# Especificação Técnica - Fluxo do Imóvel (Consolidação)

## Visão Geral

Sistema de gestão de imóveis focado no perfil **Gestão de Bens**, cobrindo todo o fluxo desde a consolidação até o pós-venda.

## Arquitetura de Componentes

### Componentes Principais

#### 1. SLABadge
**Arquivo**: `/src/app/components/property-flow/SLABadge.tsx`

**Props**:
- `status`: 'no-prazo' | 'proximo-vencimento' | 'vencido'
- `data`: Date
- `showIcon`: boolean (default: true)
- `showDays`: boolean (default: true)

**Variantes**:
- **No Prazo**: Verde (bg-green-100, text-green-800)
- **Próximo Vencimento**: Amarelo (bg-yellow-100, text-yellow-800)
- **Vencido**: Vermelho (bg-red-100, text-red-800)

---

#### 2. PropertyTagBadge
**Arquivo**: `/src/app/components/property-flow/PropertyTagBadge.tsx`

**Props**:
- `tag`: PropertyTag { tipo, label, color }
- `showIcon`: boolean (default: true)

**Variantes**:
- **Liminar**: Vermelho (bg-red-100, text-red-800) + ícone AlertCircle
- **Pendência Fiscal**: Laranja (bg-orange-100, text-orange-800) + ícone FileWarning
- **Venda Parcelada**: Azul (bg-blue-100, text-blue-800) + ícone CreditCard
- **Desocupação**: Roxo (bg-purple-100, text-purple-800) + ícone Home

---

#### 3. FlowStepper
**Arquivo**: `/src/app/components/property-flow/FlowStepper.tsx`

**Props**:
- `currentStage`: FlowStage
- `subStage`: string (opcional)
- `onStageClick`: (stage: FlowStage) => void (opcional)

**Comportamento**:
- Linha de progresso visual
- Etapas concluídas: ícone de check (✓) em azul
- Etapa atual: círculo com borda azul
- Etapas futuras: cinza
- Sub-etapas mostradas abaixo da etapa atual

---

#### 4. CommentFeed
**Arquivo**: `/src/app/components/property-flow/CommentFeed.tsx`

**Props**:
- `comments`: Comment[]
- `onAddComment`: (text: string) => void (opcional)
- `readOnly`: boolean (default: false)

**Características**:
- Comentários são **imutáveis** (não podem ser editados/excluídos)
- Avatar + Nome do autor + Data/hora
- Suporte a anexos
- Formulário de novo comentário (se não readOnly)

---

#### 5. DocumentChecklist
**Arquivo**: `/src/app/components/property-flow/DocumentChecklist.tsx`

**Props**:
- `items`: ChecklistItem[]
- `onToggle`: (itemId: string) => void (opcional)
- `onUpload`: (itemId: string) => void (opcional)
- `readOnly`: boolean (default: false)

**Características**:
- Barra de progresso visual
- Itens obrigatórios destacados (bg-orange-50)
- Itens concluídos (bg-green-50)
- Upload e preview de documentos
- Metadata de conclusão (quem/quando)

---

## Páginas

### 1. PropertyFlowList (Lista de Imóveis)
**Rota**: `/gestao-bens`

**Seções**:
- Topbar: busca + filtros
- Estatísticas rápidas (cards)
- Tabela desktop / Cards mobile
- Ações rápidas por linha

**Filtros Disponíveis**:
- Etapa do fluxo
- Status SLA
- Com Liminar (toggle)
- Com Pendência Fiscal (toggle)
- Responsável

---

### 2. PropertyFlowDetail (Perfil do Imóvel)
**Rota**: `/gestao-bens/:id`

**Abas**:
1. **Resumo**: Cards com etapa atual, próximos passos, alertas, financeiro
2. **Etapas do Fluxo**: Timeline de comentários por etapa
3. **Negociação**: Formato planner com tópicos obrigatórios
4. **Jurídico**: Posts estilo blog + destaque "Em Liminar"
5. **Despesas**: Resumo + link para gestão de despesas
6. **Documentos**: Upload, preview e checklist
7. **Ocorrências**: Solicitações fiscais (somente visualização e criação)

---

### 3. LeilaoPage
**Rota**: `/gestao-bens/:id/leilao`

**Seções**:
1. **Leilões Obrigatórios**:
   - Cadastro de até 3 leilões
   - Leiloeiro, datas, valores
   - Documentos por leilão
   - Opção: "Vendido em leilão" (pula etapas)

2. **Finalizar Leilões**:
   - Data/valor de quitação
   - Anexos obrigatórios (extratos, termos)

3. **Averbação**:
   - Data de averbação
   - Upload matrícula atualizada

4. **Atribuir Responsável**:
   - Dropdown de usuários (Gestão de Bens)

---

### 4. ManutencaoPrecificacaoPage
**Rota**: `/gestao-bens/:id/manutencao-precificacao`

**Seções**:
1. **Amostras de Mercado** (mínimo 5):
   - Link, valor, área, observações
   - Upload de prints
   - Cálculo automático de R$/m²

2. **Análise e Precificação**:
   - Média de valores
   - Média de R$/m²
   - Valor sugerido (automático)
   - Justificativa

3. **Ações**:
   - Gerar PDF
   - Enviar para aprovação

**Status de Aprovação**:
- Em análise
- Aprovado
- Reprovado

---

### 5. ComercialPage
**Rota**: `/gestao-bens/:id/comercial`

**Seções**:
1. **Histórico de Imobiliárias**:
   - Nome, CNPJ, contato
   - Período ativo
   - Imobiliária atual destacada

2. **Propostas (Storyline)**:
   - Cards de propostas
   - Status: pendente/aprovada/rejeitada/contra-proposta
   - Comentários por proposta
   - Ações: aprovar, rejeitar, contra-propor

3. **Ações**:
   - Gerar PDF de proposta
   - Aceitar proposta e avançar

---

### 6. VendaPage
**Rota**: `/gestao-bens/:id/venda`

**Seções**:
1. **Dados da Venda**:
   - Comprador, CPF/CNPJ
   - Valor, data
   - Forma de pagamento

2. **Checklist de Venda**:
   - Contrato, escritura, certidões
   - ITBI, registro
   - Documentos obrigatórios

**Bloqueio**: Só avança se todos obrigatórios concluídos

---

### 7. PosVendaPage
**Rota**: `/gestao-bens/:id/pos-venda`

**Seções**:
1. **Venda Parcelada** (opcional):
   - Configuração de parcelas
   - Controle mensal
   - **Gatilho**: Ao marcar parcela paga → cria ocorrência fiscal automática

2. **Checklist Pós-Venda**:
   - Entrega de chaves
   - Baixa de débitos
   - Arquivo organizado

**Finalização**: Só finaliza se checklist completo e (se parcelado) todas parcelas pagas

---

## Tipos de Dados (TypeScript)

### FlowStage
```typescript
'notificacao' | 'consolidacao' | 'leilao' | 'negociacao-amigavel' | 
'negociacao-nao-amigavel' | 'manutencao-precificacao' | 'comercial' | 
'venda' | 'pos-venda'
```

### SLAStatus
```typescript
'no-prazo' | 'proximo-vencimento' | 'vencido'
```

### PropertyTag
```typescript
{
  tipo: 'liminar' | 'pendencia-fiscal' | 'venda-parcelada' | 'desocupacao';
  label: string;
  color: string;
}
```

---

## Regras de Negócio

### 1. Comentários
- **Imutáveis**: Não podem ser editados ou excluídos
- Sempre exibir autor e data/hora
- Anexos opcionais

### 2. Documentos Obrigatórios
- Cada etapa tem lista de documentos obrigatórios
- Checklist visual de progresso
- Bloqueio de avanço se incompleto

### 3. Ocorrências Fiscais (Gestão de Bens)
- **Pode**: Solicitar ocorrência fiscal
- **Não pode**: Finalizar pendência (exclusivo Fiscal/Ailos)
- Status visíveis: solicitado, em-andamento, concluído

### 4. Gatilhos Automáticos
- **Venda Parcelada**: Ao marcar parcela como paga → cria ocorrência fiscal
- **Reavaliação**: A cada 12 meses → cria ocorrência de reavaliação
- **Venda em Leilão**: Pula etapas de negociação e manutenção

### 5. SLA
- Sempre visível
- Cores: verde (no prazo), amarelo (próximo), vermelho (vencido)
- Cálculo automático de dias restantes

### 6. Em Liminar
- Badge vermelho destacado
- Seção especial no módulo Jurídico
- Alerta no resumo do imóvel

---

## Design System

### Cores Principais
- **Primária**: Azul (#3b82f6)
- **Sucesso**: Verde (#10b981)
- **Atenção**: Amarelo (#f59e0b)
- **Erro/Urgente**: Vermelho (#ef4444)
- **Info**: Azul claro (#06b6d4)

### Espaçamentos
- Base: 4px (0.25rem)
- Tokens: 4, 8, 12, 16, 24, 32, 48px

### Border Radius
- Padrão: 8px (0.5rem)
- Badges: 9999px (pill)

### Tipografia
- Font: Inter / Segoe UI
- Contraste: AA (WCAG 2.1)

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## Estados da Interface

### Loading
- Skeleton screens
- Shimmer effect

### Vazio (Empty State)
- Ilustração ou ícone
- Mensagem descritiva
- CTA (Call to Action)

### Erro
- Mensagem amigável
- Botão de retry/voltar

### Sem Permissão
- Bloqueio visual
- Explicação clara
- Link para suporte (se aplicável)

---

## Acessibilidade

- Contraste de cores: AA (WCAG 2.1)
- Navegação por teclado
- Labels e ARIA attributes
- Focus visível
- Textos alternativos em imagens
