# Wireframe Detalhado - Fluxo do Imóvel (a partir de Leilão)

## 1. LISTA DE IMÓVEIS

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ FLUXO DO IMÓVEL - GESTÃO DE BENS                       [+ Cadastrar Imóvel] │
│ A partir de Leilão • 8 imóveis                         [+ Registrar Update] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ [🔍 Buscar...                                                              ] │
│                                                                              │
│ [▼ Todas as Etapas] [▼ Todos os SLAs] [🔘 Com Liminar] [🔘 Pendência Fiscal]│
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  📊 ESTATÍSTICAS                                                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                          │
│  │    8    │ │    1    │ │    1    │ │    1    │                          │
│  │  Total  │ │   SLA   │ │   Em    │ │Pendência│                          │
│  │ Imóveis │ │ Vencido │ │ Liminar │ │  Fiscal │                          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  📋 TABELA DE IMÓVEIS                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ [IMG] IMV-2024-001              │ Leilão          │ 🟡 Próx.Venc.  │   │
│  │      Rua das Palmeiras, 1234    │ Leilões Obrig.  │ 23 dias        │   │
│  │      São Paulo - SP             │                 │                 │   │
│  │                                 │ Maria Silva     │ [⚠️ Pend.Fiscal]│   │
│  │                                 │ 20/02/26        │ 💬 📂 💰 [Abrir]│   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │ [IMG] IMV-2023-045              │ Neg.Não Amig.   │ 🔴 Vencido     │   │
│  │      Rua Consolação, 567        │ Reintegração    │ -16 dias       │   │
│  │      São Paulo - SP             │                 │                 │   │
│  │                                 │ Carlos Oliveira │ [🚨Liminar]    │   │
│  │                                 │ 18/02/26        │ 💬 📂 💰 [Abrir]│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. CADASTRO DE IMÓVEL (3 etapas)

### Etapa 1: Dados Básicos
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Voltar    CADASTRO DE NOVO IMÓVEL                          [Etapa 1 de 3] │
│             Preencha as informações do imóvel                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  PROGRESSO: ●─────○─────○                                                   │
│            Dados  Local. Docs                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  📝 INFORMAÇÕES BÁSICAS                                                     │
│  ┌────────────────────────────┬────────────────────────────┐               │
│  │ Código do Imóvel *         │ Tipo de Imóvel *           │               │
│  │ [IMV-2024-___]             │ [▼ Apartamento            ]│               │
│  └────────────────────────────┴────────────────────────────┘               │
│                                                                              │
│  ┌─────────┬─────────┬─────────┬─────────┐                                 │
│  │ Área *  │ Quartos │Banheiros│  Vagas  │                                 │
│  │ [___ m²]│ [___]   │ [___]   │ [___]   │                                 │
│  └─────────┴─────────┴─────────┴─────────┘                                 │
│                                                                              │
│  ┌────────────────────────────┬────────────────────────────┐               │
│  │ Valor de Avaliação (R$) *  │ Data da Avaliação *        │               │
│  │ [____________]             │ [__/__/____]               │               │
│  └────────────────────────────┴────────────────────────────┘               │
│                                                                              │
│  ┌────────────────────────────┬────────────────────────────┐               │
│  │ Número da Matrícula *      │ Cartório de Registro *     │               │
│  │ [____________]             │ [1º RI de São Paulo       ]│               │
│  └────────────────────────────┴────────────────────────────┘               │
│                                                                              │
│  Descrição do Imóvel                                                        │
│  ┌──────────────────────────────────────────────────────────┐              │
│  │                                                            │              │
│  └──────────────────────────────────────────────────────────┘              │
│                                                                              │
│  Fotos do Imóvel                                                            │
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐                                  │
│  │ [IMG] │ │ [IMG] │ │ [IMG] │ │  +    │                                  │
│  │[Princ]│ │       │ │       │ │ Foto  │                                  │
│  └───────┘ └───────┘ └───────┘ └───────┘                                  │
│                                                                              │
│                                          [Próxima Etapa: Localização →]    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Etapa 2: Localização
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  📍 LOCALIZAÇÃO E ENDEREÇO                                                  │
│                                                                              │
│  CEP *                                                                       │
│  [_____-___] [Buscar CEP]                                                   │
│                                                                              │
│  ┌────────────────────────────────────────────┬─────────────┐              │
│  │ Logradouro *                               │ Número *    │              │
│  │ [________________________________]         │ [_____]     │              │
│  └────────────────────────────────────────────┴─────────────┘              │
│                                                                              │
│  ┌────────────────────────────┬────────────────────────────┐               │
│  │ Complemento                │ Bairro *                   │               │
│  │ [Apto 501, Bloco B]        │ [____________]             │               │
│  └────────────────────────────┴────────────────────────────┘               │
│                                                                              │
│  ┌────────────────────────────┬────────────────────────────┐               │
│  │ Cidade *                   │ Estado *                   │               │
│  │ [São Paulo]                │ [▼ São Paulo              ]│               │
│  └────────────────────────────┴────────────────────────────┘               │
│                                                                              │
│  [← Etapa Anterior]                   [Próxima Etapa: Documentos →]        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. PERFIL DO IMÓVEL - VISÃO GERAL

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Voltar    IMV-2024-001                                                    │
│             Rua das Palmeiras, 1234, São Paulo - SP                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ [IMG]  IMV-2024-001                              🟡 Próx.Vencimento        │
│        Rua das Palmeiras, 1234                   23 dias restantes          │
│        São Paulo - SP                            Responsável: Maria Silva  │
│        [Apartamento] [85m²] [R$ 450.000]                                    │
│        [⚠️ Pendência Fiscal]                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  STEPPER DO FLUXO                                                           │
│  ●═══════●───────○───────○───────○───────○───────○                         │
│  Leilão  Neg.Am. Neg.NA  Manut.  Comerc. Venda   Pós                      │
│  └ Leilões Obrigatórios (atual)                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Resumo] [Leilão] [Negociação] [Jurídico] [Manut/Prec] [Comercial]       │
│  [Venda] [Pós-Venda] [Solicitações]                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  📋 ABA: RESUMO                                                             │
│  ┌─────────────────────┬─────────────────────┬─────────────────────┐       │
│  │ ETAPA ATUAL        │ PRÓXIMOS PASSOS     │ ALERTAS             │       │
│  │ Leilão             │ • Aguardar 2º leilão│ ⚠️ Pendência Fiscal │       │
│  │ Leilões Obrigatór. │ • Publicar edital   │ 1 ocorrência aberta │       │
│  │                    │ • Resolver pend.fisc│                     │       │
│  │ Última atualização:│                     │ SLA: 23 dias        │       │
│  │ 20/02/26 14:30     │                     │                     │       │
│  └─────────────────────┴─────────────────────┴─────────────────────┘       │
│                                                                              │
│  💰 RESUMO FINANCEIRO                                                       │
│  ┌─────────────────────┬─────────────────────┬─────────────────────┐       │
│  │ Avaliação          │ Despesas Acumuladas │ Valor Líquido Estim.│       │
│  │ R$ 450.000         │ R$ 4.100            │ R$ 445.900          │       │
│  └─────────────────────┴─────────────────────┴─────────────────────┘       │
│                                                                              │
│  📄 DOCUMENTOS PENDENTES                                                    │
│  [⚠️ Comprovante quitação leilão - Obrigatório]                            │
│  [⚠️ Ata do 1º leilão - Obrigatório]                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. TELA DE LEILÃO (Detalhada)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Voltar    LEILÃO - IMV-2024-001                                          │
│             Rua das Palmeiras, 1234                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  📋 LEILÕES OBRIGATÓRIOS                           [+ Cadastrar Novo Leilão]│
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────┐     │
│  │ [1º LEILÃO] [Deserto] ─────────────────────────────────────────┐ │     │
│  │                                                                  │ │     │
│  │ Leiloeiro: João Martins (CRECI 12345-J)                         │ │     │
│  │ Data: [20/01/2026 14:00]                                         │ │     │
│  │ Valor Avaliação: R$ 450.000  │  Valor Mínimo: R$ 315.000 (70%) │ │     │
│  │                                                                  │ │     │
│  │ Documentos: [📄 Edital] [📄 Ata] [📄 Comprovante Publicação]   │ │     │
│  └──────────────────────────────────────────────────────────────────┘ │     │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────┐     │
│  │ [2º LEILÃO] [Agendado] ────────────────────────────────────────┐ │     │
│  │                                                                  │ │     │
│  │ Leiloeiro: João Martins (CRECI 12345-J)                         │ │     │
│  │ Data: [10/03/2026 14:00]                                         │ │     │
│  │ Valor Avaliação: R$ 450.000  │  Valor Mínimo: R$ 225.000 (50%) │ │     │
│  │                                                                  │ │     │
│  │ Documentos: [+ Upload Edital] [+ Upload Ata] [+ Upload Comprov.]│ │     │
│  └──────────────────────────────────────────────────────────────────┘ │     │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────┐     │
│  │ ✅ IMÓVEL VENDIDO EM LEILÃO?                    [Marcar Vendido] │     │
│  │ Marcar esta opção pula negociações e vai direto para Venda       │     │
│  └───────────────────────────────────────────────────────────────────┘     │
├─────────────────────────────────────────────────────────────────────────────┤
│  🏁 FINALIZAR LEILÕES OBRIGATÓRIOS                                          │
│  Data Quitação: [__/__/____]  Valor: [R$ ________]                         │
│  Observações: [____________________________________________]                │
│                                                                              │
│  Anexos Obrigatórios:                                                       │
│  [📤 Extratos Bancários (Antes)] [📤 Extratos (Depois)]                    │
│  [📤 Termo Arrematação] [📤 Termo Não Comparecimento]                      │
│                                                     [Finalizar Leilões →]   │
├─────────────────────────────────────────────────────────────────────────────┤
│  📋 AVERBAÇÃO DA MATRÍCULA                                                  │
│  ℹ️ Após finalizar leilões, averbar resultado na matrícula                 │
│                                                                              │
│  Data Averbação: [__/__/____]  Nº Averbação: [AV-______]                  │
│  Observações: [____________________________________________]                │
│  Matrícula Atualizada: [📤 Upload Matrícula Atualizada]                    │
│                                                     [Concluir Averbação →]  │
├─────────────────────────────────────────────────────────────────────────────┤
│  👤 ATRIBUIR RESPONSÁVEL                                                    │
│  Atribuir imóvel para: [▼ Selecione usuário (Gestão de Bens)]             │
│  (Apenas usuários Gestão de Bens)              [Atribuir Responsável]      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. TELA DE NEGOCIAÇÃO (Planner)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Voltar    NEGOCIAÇÃO - IMV-2023-089                                      │
│             Rua Estados Unidos, 234                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  Tipo: [🏠 Negociação Amigável] [⚖️ Negociação Não Amigável]               │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Planner] [Tentativas Contato] [Documentos]                               │
├─────────────────────────────────────────────────────────────────────────────┤
│  PROGRESSO: ███████░░░░░░ 2/4 tópicos concluídos                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │ [1] ✅ PRAZO INICIAL DESOCUPAÇÃO VOLUNTÁRIA      [Concluído]    │       │
│  │ Notificar sobre consolidação - prazo 30 dias                    │       │
│  │ Concluído por Ana Costa em 15/02/26 às 14:00                    │       │
│  │ 💬 3 comentários                                                 │       │
│  └─────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │ [2] 🔵 TENTATIVAS DE CONTATO               [Em Andamento...]    │       │
│  │ Registrar ao menos 3 tentativas antes de prosseguir     [Obrig.]│       │
│  │ Prazo: 🟡 45 dias restantes                                     │       │
│  │ ┌────────────────────────────────────────────────────────────┐  │       │
│  │ │ 📝 ÁREA DE TRABALHO                                         │  │       │
│  │ │ Responsável: [▼ Ana Costa]  Prazo: [01/04/2026]            │  │       │
│  │ │ Observações: [________________________________]             │  │       │
│  │ │                                                             │  │       │
│  │ │                             [Salvar] [✅ Concluir Tópico]  │  │       │
│  │ └────────────────────────────────────────────────────────────┘  │       │
│  │ 💬 Registro de Comentários:                                     │       │
│  │ [Ana Costa - 19/02 10:00] 1ª tentativa telefone - sem resposta │       │
│  │ [➕ Adicionar comentário]                                       │       │
│  └─────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │ [3] ⚪ AVALIAÇÃO PROPOSTA RECOMPRA                  [Aguardando]│       │
│  │ Analisar viabilidade de recompra pelo ocupante                  │       │
│  │ (Será aberto após conclusão do tópico anterior)                 │       │
│  └─────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │ [4] ⚪ ACORDO DE DESOCUPAÇÃO                     [Obrig.] [Aguard]│      │
│  │ Definir termos, indenizações e prazo final                      │       │
│  └─────────────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Aba: Tentativas de Contato
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  REGISTRO DE TENTATIVAS DE CONTATO         [+ Registrar Nova Tentativa]    │
│  Mínimo de 3 tentativas documentadas antes de prosseguir                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ⚠️ Atenção: 1 tentativa adicional necessária                              │
│  Obrigatório ao menos 3 tentativas antes de negociação não amigável        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │ [📞] TENTATIVA #1           [Telefone] [Sem Resposta]           │       │
│  │ 19/02/2026 às 10:00                                              │       │
│  │ Ligação não atendida. Deixada mensagem na caixa postal.         │       │
│  │ Responsável: Ana Costa                                           │       │
│  └─────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │ [📧] TENTATIVA #2           [E-mail] [Sem Resposta]             │       │
│  │ 20/02/2026 às 14:30                                              │       │
│  │ E-mail enviado. Aguardando retorno em 48h.                      │       │
│  │ Responsável: Ana Costa                                           │       │
│  └─────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │ [👤] TENTATIVA #3           [Presencial] [Não Localizado]       │       │
│  │ 21/02/2026 às 16:00                                              │       │
│  │ Visita ao imóvel. Porteiro informou que ocupante viaja.         │       │
│  │ Responsável: Carlos Oliveira                                     │       │
│  └─────────────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. TELA DE MANUTENÇÃO/PRECIFICAÇÃO

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Voltar    MANUTENÇÃO/PRECIFICAÇÃO - IMV-2024-008                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  [🟡 Em Análise]                                                            │
│  Aguardando Aprovação - Envie após concluir análise                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  📊 AMOSTRAS DE MERCADO (mín. 5)              [+ Adicionar Amostra]        │
│  Progresso: ███████░░ 3/5                                                   │
│  ⚠️ Adicione mais 2 amostras para completar                                │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │ [1] Link: [https://exemplo.com/imovel1] [🔗]                    │       │
│  │     Valor: R$ 460.000 | Área: 88m² | R$/m²: 5.227              │       │
│  │     Obs.: Mesmo bairro, acabamento similar   [📄 Print]  [🗑️]  │       │
│  └─────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │ [2] Link: [https://exemplo.com/imovel2] [🔗]                    │       │
│  │     Valor: R$ 440.000 | Área: 82m² | R$/m²: 5.366              │       │
│  │     Obs.: Prédio mais antigo                 [📄 Print]  [🗑️]  │       │
│  └─────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │ [3] Link: [https://exemplo.com/imovel3] [🔗]                    │       │
│  │     Valor: R$ 475.000 | Área: 90m² | R$/m²: 5.278              │       │
│  │     Obs.: Com vaga coberta                   [📄 Print]  [🗑️]  │       │
│  └─────────────────────────────────────────────────────────────────┘       │
├─────────────────────────────────────────────────────────────────────────────┤
│  💰 ANÁLISE E VALOR SUGERIDO                                                │
│  ┌───────────────┬───────────────┬───────────────┐                         │
│  │ Média Valor   │ Média R$/m²   │ Valor Sugerido│                         │
│  │ R$ 458.333    │ R$ 5.290      │ R$ 449.750    │                         │
│  │               │               │ (85m²)        │                         │
│  └───────────────┴───────────────┴───────────────┘                         │
│                                                                              │
│  Valor Final: [R$ 449.750___]  (ajustar conforme análise)                 │
│  Justificativa: [________________________________________________]          │
│                                                                              │
│                  [📄 Gerar PDF] [📤 Enviar para Aprovação]                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. TELA COMERCIAL

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Voltar    COMERCIAL - IMV-2024-002                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  🏢 HISTÓRICO DE IMOBILIÁRIAS                      [+ Nova Imobiliária]    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │ [🏢] Imobiliária Prime                            [INATIVA]     │       │
│  │ CNPJ: 12.345.678/0001-90 | Tel: (11) 3456-7890                 │       │
│  │ Período: 15/01/26 - 15/02/26               [Ver Detalhes]      │       │
│  └─────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │ [🏢] Imóveis & Negócios                           [✅ ATIVA]    │       │
│  │ CNPJ: 98.765.432/0001-10 | Tel: (11) 9876-5432                 │       │
│  │ Período: desde 16/02/26                    [Ver Detalhes]      │       │
│  └─────────────────────────────────────────────────────────────────┘       │
├─────────────────────────────────────────────────────────────────────────────┤
│  📝 PROPOSTAS RECEBIDAS (Storyline)            [+ Registrar Proposta]      │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │ [PROP-2024-002] [🟡 Pendente]                                   │       │
│  │ Investimentos XYZ Participações                                 │       │
│  │ 20/02/2026 14:15                            R$ 680.000          │       │
│  │                                             100% do valor pedido │       │
│  │                                                                  │       │
│  │ Obs.: Aguardando análise crédito. Cliente quer pagar à vista   │       │
│  │                                                                  │       │
│  │ [💬 Comentários (0)] [📄 Documentos] [✅ Aprovar] [❌ Rejeitar] │       │
│  └─────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │ [PROP-2024-001] [🔵 Contra-proposta]                            │       │
│  │ Tech Solutions Ltda                         R$ 650.000          │       │
│  │ 15/02/2026 10:30                            95.6% do valor      │       │
│  │                                                                  │       │
│  │ Obs.: Cliente pede 5% desconto - necessita reforma elétrica     │       │
│  │                                                                  │       │
│  │ [💬 Comentários (2)] [📄 Documentos] [Ver Histórico]           │       │
│  └─────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │ [PROP-2024-003] [🔴 Rejeitada]                                  │       │
│  │ Marcos Antonio Silva                        R$ 620.000          │       │
│  │ 12/02/2026 16:00                            91.2% do valor      │       │
│  │ Proposta abaixo do mínimo. Rejeitada automaticamente.           │       │
│  └─────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│                      [📄 Gerar PDF] [Aceitar e Ir para Venda →]            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## LEGENDA DE COMPONENTES

- `[●]` Etapa concluída
- `[○]` Etapa pendente
- `[🔵]` Etapa ativa/em andamento
- `[✅]` Concluído
- `[⚠️]` Alerta/Atenção
- `[🔴]` Crítico/Vencido
- `[🟡]` Atenção/Próximo vencimento
- `[🟢]` OK/No prazo
- `[+]` Adicionar novo
- `[←]` Voltar
- `[→]` Avançar
- `[▼]` Dropdown/Select
- `[📊]` Estatísticas
- `[📋]` Lista/Tabela
- `[📝]` Formulário
- `[💬]` Comentários
- `[📄]` Documento
- `[📤]` Upload
- `[🔍]` Busca
- `[⚖️]` Jurídico
- `[🏢]` Imobiliária
