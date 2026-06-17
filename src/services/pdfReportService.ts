import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface RelatorioDashboardData {
  total: number;
  valorTotal: number;
  mediaValor: number;
  slaCounts: { prazo: number; atencao: number; vencido: number };
  tempoMedioData: { etapa: string; dias: number }[];
  despesasPorCategoria: { categoria: string; valor: number }[];
  despesasAprovadas: number;
  despesasPendentes: number;
  negAmigavel: number;
  negNaoAmigavel: number;
  valorNegociadoTotal: number;
  valorAvaliacaoNegociados: number;
  diffNegociacaoPct: number;
  leilaoPorNumero: { numero: string; total: number; concluidos: number; taxa: number }[];
  evolucaoTemporalData: { mes: string; cadastros: number; vendas: number }[];
}

const PRIMARY: [number, number, number] = [22, 92, 125];

function formatMoeda(v: number): string {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function gerarRelatorioPDF(data: RelatorioDashboardData) {
  const doc = new jsPDF();
  const pageWidth  = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 18;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 14) {
      doc.addPage();
      y = 18;
    }
  };
  const sectionTitle = (text: string) => {
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text(text, 14, y);
    y += 4;
  };
  const finalY = () => {
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  };

  doc.setFontSize(16);
  doc.setTextColor(...PRIMARY);
  doc.text('Relatório de Gestão de Imóveis', 14, y);
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`Gerado em ${new Date().toLocaleString('pt-BR')}`, 14, y + 6);
  y += 16;

  sectionTitle('Resumo Geral');
  autoTable(doc, {
    startY: y,
    head: [['Total de Imóveis', 'Valor Total em Carteira', 'Valor Médio por Imóvel']],
    body: [[String(data.total), formatMoeda(data.valorTotal), formatMoeda(data.mediaValor)]],
    theme: 'grid',
    headStyles: { fillColor: PRIMARY },
    styles: { fontSize: 9 },
  });
  finalY();

  const slaTotal = data.slaCounts.prazo + data.slaCounts.atencao + data.slaCounts.vencido;
  const pct = (n: number) => (slaTotal > 0 ? `${Math.round((n / slaTotal) * 100)}%` : '0%');
  ensureSpace(40);
  sectionTitle('Status de SLA');
  autoTable(doc, {
    startY: y,
    head: [['Em Dia', 'Atenção', 'Vencido']],
    body: [[
      `${data.slaCounts.prazo} (${pct(data.slaCounts.prazo)})`,
      `${data.slaCounts.atencao} (${pct(data.slaCounts.atencao)})`,
      `${data.slaCounts.vencido} (${pct(data.slaCounts.vencido)})`,
    ]],
    theme: 'grid',
    headStyles: { fillColor: PRIMARY },
    styles: { fontSize: 9 },
  });
  finalY();

  if (data.tempoMedioData.length > 0) {
    ensureSpace(40);
    sectionTitle('Tempo Médio por Etapa');
    autoTable(doc, {
      startY: y,
      head: [['Etapa', 'Dias (média)']],
      body: data.tempoMedioData.map(d => [d.etapa, String(d.dias)]),
      theme: 'striped',
      headStyles: { fillColor: PRIMARY },
      styles: { fontSize: 9 },
    });
    finalY();
  }

  ensureSpace(40);
  sectionTitle('Financeiro — Despesas por Categoria');
  if (data.despesasPorCategoria.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Categoria', 'Valor']],
      body: data.despesasPorCategoria.map(d => [d.categoria, formatMoeda(d.valor)]),
      foot: [
        ['Aprovadas', formatMoeda(data.despesasAprovadas)],
        ['Pendentes', formatMoeda(data.despesasPendentes)],
      ],
      theme: 'striped',
      headStyles: { fillColor: PRIMARY },
      footStyles: { fillColor: [240, 240, 240], textColor: [30, 30, 30] },
      styles: { fontSize: 9 },
    });
    finalY();
  } else {
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text('Nenhuma despesa registrada.', 14, y + 4);
    y += 14;
  }

  ensureSpace(40);
  sectionTitle('Financeiro — Negociações');
  autoTable(doc, {
    startY: y,
    head: [['Amigáveis', 'Não Amigáveis', 'Valor Negociado', 'Valor de Avaliação', 'Diferença']],
    body: [[
      String(data.negAmigavel),
      String(data.negNaoAmigavel),
      formatMoeda(data.valorNegociadoTotal),
      formatMoeda(data.valorAvaliacaoNegociados),
      `${data.diffNegociacaoPct >= 0 ? '+' : ''}${data.diffNegociacaoPct.toFixed(1)}%`,
    ]],
    theme: 'grid',
    headStyles: { fillColor: PRIMARY },
    styles: { fontSize: 9 },
  });
  finalY();

  if (data.leilaoPorNumero.length > 0) {
    ensureSpace(40);
    sectionTitle('Taxa de Sucesso por Leilão');
    autoTable(doc, {
      startY: y,
      head: [['Leilão', 'Total', 'Concluídos', 'Taxa de Sucesso']],
      body: data.leilaoPorNumero.map(l => [l.numero, String(l.total), String(l.concluidos), `${l.taxa}%`]),
      theme: 'striped',
      headStyles: { fillColor: PRIMARY },
      styles: { fontSize: 9 },
    });
    finalY();
  }

  ensureSpace(40);
  sectionTitle('Evolução Temporal — Cadastros vs Vendas');
  autoTable(doc, {
    startY: y,
    head: [['Mês', 'Cadastros', 'Vendas']],
    body: data.evolucaoTemporalData.map(m => [m.mes, String(m.cadastros), String(m.vendas)]),
    theme: 'striped',
    headStyles: { fillColor: PRIMARY },
    styles: { fontSize: 9 },
  });

  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Página ${p} de ${pageCount}`, pageWidth - 32, pageHeight - 8);
  }

  doc.save(`relatorio-imoveis-${new Date().toISOString().slice(0, 10)}.pdf`);
}
