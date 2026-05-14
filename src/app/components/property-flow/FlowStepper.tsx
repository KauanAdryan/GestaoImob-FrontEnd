import { Check } from 'lucide-react';
import { FlowStage } from '../../types/property-flow';
import { flowStagesConfig } from '../../data/property-flow-updated';

interface FlowStepperProps {
  currentStage: FlowStage;
  subStage?: string;
  onStageClick?: (stage: FlowStage) => void;
}

export function FlowStepper({ currentStage, subStage, onStageClick }: FlowStepperProps) {
  const currentStageConfig = flowStagesConfig.find(s => s.id === currentStage);
  const currentOrder = currentStageConfig?.ordem || 0;

  return (
    <div className="w-full border rounded-xl p-6 shadow-sm" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="relative">
        {/* Linha de progresso */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-[var(--ailos-cinza-200)]">
          <div 
            className="h-full bg-[var(--ailos-azul-500)] transition-all duration-500"
            style={{ width: `${((currentOrder - 1) / (flowStagesConfig.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {flowStagesConfig.map((stage, index) => {
            const isCompleted = stage.ordem < currentOrder;
            const isCurrent = stage.id === currentStage;
            const isClickable = onStageClick && (isCompleted || isCurrent);

            return (
              <div 
                key={stage.id} 
                className="flex flex-col items-center"
                style={{ width: `${100 / flowStagesConfig.length}%` }}
              >
                {/* Circle */}
                <button
                  onClick={() => isClickable && onStageClick(stage.id)}
                  disabled={!isClickable}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
                  style={{
                    background:  isCompleted ? 'var(--ailos-azul-500)' : 'var(--card)',
                    borderColor: isCompleted || isCurrent ? 'var(--ailos-azul-500)' : 'var(--ailos-cinza-300)',
                    color:       isCompleted ? 'white' : isCurrent ? 'var(--ailos-azul-500)' : 'var(--ailos-cinza-400)',
                    boxShadow:   isCurrent ? '0 0 0 4px var(--ailos-azul-100)' : 'none',
                  }}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{stage.ordem}</span>
                  )}
                </button>

                {/* Label */}
                <div className="mt-3 text-center max-w-[100px]">
                  <p className={`text-xs font-medium ${isCurrent ? 'text-[var(--ailos-azul-500)]' : 'text-[var(--ailos-cinza-600)]'}`}>
                    {stage.label}
                  </p>
                  {isCurrent && subStage && stage.subEtapas && (
                    <p className="text-xs text-[var(--ailos-cinza-500)] mt-1">
                      {stage.subEtapas.find(s => s.id === subStage)?.label}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}