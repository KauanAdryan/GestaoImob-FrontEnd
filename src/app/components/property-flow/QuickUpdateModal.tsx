import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { mockProperties } from '../../data/property-flow-updated';
import { FileUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface QuickUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickUpdateModal({ open, onOpenChange }: QuickUpdateModalProps) {
  const [selectedProperty, setSelectedProperty] = useState('');
  const [updateText, setUpdateText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProperty || !updateText.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Atualização registrada com sucesso!');
    setIsSubmitting(false);
    setSelectedProperty('');
    setUpdateText('');
    setAttachments([]);
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white border-[var(--ailos-cinza-200)]">
        <DialogHeader className="border-b border-[var(--ailos-cinza-100)] pb-4">
          <DialogTitle className="text-xl text-[var(--ailos-cinza-900)]">
            Registro de Atualização Rápido
          </DialogTitle>
          <DialogDescription className="text-[var(--ailos-cinza-600)]">
            Registre uma atualização rápida sobre o andamento do imóvel
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="property" className="text-[var(--ailos-cinza-700)]">
              Imóvel <span className="text-[var(--ailos-vermelho-500)]">*</span>
            </Label>
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger 
                id="property"
                className="border-[var(--ailos-cinza-200)] focus:border-[var(--ailos-azul-500)]"
              >
                <SelectValue placeholder="Selecione o imóvel..." />
              </SelectTrigger>
              <SelectContent>
                {mockProperties.map(property => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.codigo} - {property.endereco}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="update" className="text-[var(--ailos-cinza-700)]">
              Atualização <span className="text-[var(--ailos-vermelho-500)]">*</span>
            </Label>
            <Textarea
              id="update"
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              placeholder="Descreva a atualização ou observação sobre o imóvel..."
              className="min-h-[120px] border-[var(--ailos-cinza-200)] focus:border-[var(--ailos-azul-500)] resize-none"
            />
            <p className="text-xs text-[var(--ailos-cinza-500)]">
              Esta atualização será registrada como comentário imutável no histórico do imóvel
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachments" className="text-[var(--ailos-cinza-700)]">
              Anexos (opcional)
            </Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="border-[var(--ailos-cinza-200)] text-[var(--ailos-cinza-700)] hover:bg-[var(--ailos-azul-50)]"
                onClick={() => document.getElementById('attachments')?.click()}
              >
                <FileUp className="h-4 w-4 mr-2" />
                Selecionar Arquivos
              </Button>
              <input
                id="attachments"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              {attachments.length > 0 && (
                <span className="text-sm text-[var(--ailos-cinza-600)]">
                  {attachments.length} arquivo(s) selecionado(s)
                </span>
              )}
            </div>
          </div>
        </form>

        <DialogFooter className="border-t border-[var(--ailos-cinza-100)] pt-4 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="border-[var(--ailos-cinza-200)] text-[var(--ailos-cinza-700)] hover:bg-[var(--ailos-cinza-50)]"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedProperty || !updateText.trim()}
            className="bg-[var(--ailos-azul-500)] hover:bg-[var(--ailos-azul-600)] text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Registrando...
              </>
            ) : (
              'Registrar Atualização'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
