import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Upload, FileText, Download, Eye, CheckCircle2 } from 'lucide-react';
import { ChecklistItem } from '../../types/property-flow';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DocumentChecklistProps {
  items: ChecklistItem[];
  onToggle?: (itemId: string) => void;
  onUpload?: (itemId: string) => void;
  readOnly?: boolean;
}

export function DocumentChecklist({ items, onToggle, onUpload, readOnly = false }: DocumentChecklistProps) {
  const totalItems = items.length;
  const completedItems = items.filter(i => i.concluido).length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const obrigatoriosPendentes = items.filter(i => i.obrigatorio && !i.concluido);

  return (
    <div className="space-y-4">
      {/* Progress Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Progresso do Checklist</CardTitle>
            <Badge className={progress === 100 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
              {completedItems}/{totalItems}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            {obrigatoriosPendentes.length > 0 && (
              <p className="text-sm text-orange-600">
                {obrigatoriosPendentes.length} item(ns) obrigatório(s) pendente(s)
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {items.map((item) => (
              <div 
                key={item.id}
                className={`
                  flex items-start gap-3 p-4 rounded-lg border-2 transition-colors
                  ${item.concluido 
                    ? 'bg-green-50 border-green-200' 
                    : item.obrigatorio 
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-gray-50 border-gray-200'
                  }
                `}
              >
                {/* Checkbox */}
                <Checkbox
                  checked={item.concluido}
                  onCheckedChange={() => !readOnly && onToggle && onToggle(item.id)}
                  disabled={readOnly}
                  className="mt-1"
                />

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`font-medium ${item.concluido ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {item.label}
                        </p>
                        {item.obrigatorio && !item.concluido && (
                          <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800 border-orange-300">
                            Obrigatório
                          </Badge>
                        )}
                        {item.concluido && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      {item.concluido && item.concluidoPor && item.dataConclusao && (
                        <p className="text-xs text-gray-500 mt-1">
                          Concluído por {item.concluidoPor} em {format(item.dataConclusao, 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {item.anexo ? (
                        <>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3 mr-1" />
                            Baixar
                          </Button>
                        </>
                      ) : (
                        !readOnly && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onUpload && onUpload(item.id)}
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            Upload
                          </Button>
                        )
                      )}
                    </div>
                  </div>

                  {item.anexo && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span>{item.anexo.nome}</span>
                      <span className="text-xs text-gray-400">
                        • {format(item.anexo.dataUpload, 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
