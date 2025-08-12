import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  Lightbulb, 
  CheckCircle, 
  ChevronRight,
  Plus
} from 'lucide-react';

interface Stage {
  id: string;
  title: string;
  icon: React.ReactNode;
  status: 'completed' | 'active' | 'upcoming';
  itemsCount: number;
  contributors: number;
}

export function StagesNavigation() {
  const [activeStage, setActiveStage] = useState('problems');

  const stages: Stage[] = [
    {
      id: 'problems',
      title: 'Осознание проблемы',
      icon: <AlertTriangle className="w-4 h-4" />,
      status: activeStage === 'problems' ? 'active' : 'completed',
      itemsCount: 12,
      contributors: 8
    },
    {
      id: 'ideas',
      title: 'Сбор идей',
      icon: <Lightbulb className="w-4 h-4" />,
      status: activeStage === 'ideas' ? 'active' : activeStage === 'problems' ? 'upcoming' : 'completed',
      itemsCount: 24,
      contributors: 15
    },
    {
      id: 'solutions',
      title: 'Формирование решения',
      icon: <CheckCircle className="w-4 h-4" />,
      status: activeStage === 'solutions' ? 'active' : 'upcoming',
      itemsCount: 7,
      contributors: 12
    }
  ];

  const getStageColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'active': return '#00b7ff';
      case 'upcoming': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStageProgress = () => {
    const stageIndex = stages.findIndex(stage => stage.id === activeStage);
    return ((stageIndex + 1) / stages.length) * 100;
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Левая часть: Этапы в одну линию */}
          <div className="flex items-center space-x-6">
            {/* Заголовок и прогресс */}
            <div className="flex items-center space-x-4">
              <h2 className="text-sm font-medium text-foreground whitespace-nowrap">
                Этапы инкубации:
              </h2>
              
              {/* Прогресс */}
              <div className="flex items-center space-x-2">
                <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${getStageProgress()}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {Math.round(getStageProgress())}%
                </span>
              </div>
            </div>

            {/* Этапы в одну линию */}
            <div className="flex items-center space-x-2">
              {stages.map((stage, index) => (
                <React.Fragment key={stage.id}>
                  {/* Этап */}
                  <button
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-lg text-sm
                      transition-all duration-200 border whitespace-nowrap
                      ${stage.status === 'active' 
                        ? 'bg-primary/10 border-primary/30 text-primary ring-1 ring-primary/20' 
                        : stage.status === 'completed'
                        ? 'bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20'
                        : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted/80'
                      }
                      ${stage.status === 'upcoming' ? 'opacity-70' : ''}
                    `}
                    onClick={() => setActiveStage(stage.id)}
                  >
                    {/* Иконка */}
                    <div style={{ color: getStageColor(stage.status) }}>
                      {stage.icon}
                    </div>
                    
                    {/* Название */}
                    <span className="font-medium">
                      {stage.title}
                    </span>
                    
                    {/* Счетчик */}
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-1.5 py-0 h-4 bg-background/70"
                    >
                      {stage.itemsCount}
                    </Badge>
                  </button>
                  
                  {/* Компактная стрелка */}
                  {index < stages.length - 1 && (
                    <ChevronRight 
                      className={`w-3 h-3 flex-shrink-0 ${
                        stages[index + 1].status !== 'upcoming' 
                          ? 'text-primary' 
                          : 'text-muted-foreground'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Правая часть: Быстрые действия */}
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3 text-xs whitespace-nowrap"
              onClick={() => {
                console.log(`Добавить в ${activeStage}`);
              }}
            >
              <Plus className="w-3 h-3 mr-1" />
              Добавить {activeStage === 'problems' ? 'в осознание' : activeStage === 'ideas' ? 'идею' : 'решение'}
            </Button>
            
            <Button
              size="sm"
              className="h-8 px-3 text-xs whitespace-nowrap"
              onClick={() => {
                const currentIndex = stages.findIndex(s => s.id === activeStage);
                if (currentIndex < stages.length - 1) {
                  setActiveStage(stages[currentIndex + 1].id);
                }
              }}
              disabled={activeStage === 'solutions'}
            >
              Следующий этап
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}