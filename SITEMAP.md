# Sitemap - Fluxo do Imóvel (Gestão de Bens)

## Estrutura de Navegação

```
/gestao-bens (Lista de Imóveis)
│
├── /gestao-bens/:id (Perfil do Imóvel - Detalhes)
│   │
│   ├── Abas:
│   │   ├── Resumo
│   │   ├── Etapas do Fluxo
│   │   ├── Negociação
│   │   ├── Jurídico
│   │   ├── Despesas
│   │   ├── Documentos
│   │   └── Ocorrências
│   │
│   └── Páginas Específicas por Etapa:
│       │
│       ├── /gestao-bens/:id/leilao
│       │   ├── Leilões Obrigatórios (1º, 2º, 3º)
│       │   ├── Finalizar Leilões Obrigatórios
│       │   ├── Averbação de Leilão
│       │   └── Atribuir Responsável
│       │
│       ├── /gestao-bens/:id/manutencao-precificacao
│       │   ├── Amostras de Mercado (mín. 5)
│       │   ├── Análise e Precificação
│       │   └── Aprovação e PDF
│       │
│       ├── /gestao-bens/:id/comercial
│       │   ├── Histórico de Imobiliárias
│       │   ├── Propostas (Storyline)
│       │   └── Gerar PDF de Proposta
│       │
│       ├── /gestao-bens/:id/venda
│       │   ├── Dados da Venda
│       │   └── Checklist de Documentos
│       │
│       └── /gestao-bens/:id/pos-venda
│           ├── Venda Parcelada (opcional)
│           │   └── Controle de Parcelas
│           └── Checklist de Pós-Venda
```

## Fluxo de Navegação Principal

1. **Lista de Imóveis** (`/gestao-bens`)
   - Busca e filtros
   - Ações rápidas
   - Navegação para detalhes

2. **Perfil do Imóvel** (`/gestao-bens/:id`)
   - Visão geral (stepper + tabs)
   - Acesso às páginas específicas por etapa

3. **Páginas de Etapas Específicas**
   - Leilão
   - Manutenção/Precificação
   - Comercial
   - Venda
   - Pós-Venda

## Componentes Reutilizáveis

- **SLABadge**: Badge de status de SLA (verde/amarelo/vermelho)
- **PropertyTagBadge**: Tags de alertas (Liminar, Pendência Fiscal, etc)
- **FlowStepper**: Stepper horizontal do fluxo
- **CommentFeed**: Timeline de comentários (imutáveis)
- **DocumentChecklist**: Checklist com upload de documentos

## Estados e Permissões (Gestão de Bens)

### Permissões
- ✅ Visualizar todos os imóveis
- ✅ Editar dados do imóvel
- ✅ Adicionar comentários (registro histórico)
- ✅ Solicitar ocorrência fiscal (não pode finalizar)
- ✅ Gerenciar despesas
- ✅ Upload de documentos
- ✅ Atribuir imóvel para usuário (Gestão de Bens)
- ❌ Finalizar pendência fiscal (exclusivo Fiscal/Ailos)

### Estados da Aplicação
- **Loading**: Skeleton screens
- **Vazio**: Empty states com CTAs
- **Erro**: Mensagens de erro amigáveis
- **Sem permissão**: Bloqueios visuais com explicação

## Observações

- Comentários são **sempre imutáveis** (registro histórico com autor e data)
- Documentos obrigatórios bloqueiam avanço de etapa
- SLA visível em todas as telas
- Venda parcelada gera **ocorrência fiscal automática** a cada pagamento
- Reavaliação gera ocorrência fiscal **a cada 12 meses**
- "Em Liminar" destacado visualmente no módulo Jurídico
