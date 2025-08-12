import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Brain, Users, Rocket } from "lucide-react";
import { Card } from "./ui/card";
import { SearchAndFilters } from "./SearchAndFilters";
import { TagCloud } from "./TagCloud";

const stages = [
  {
    id: 'awareness' as const,
    title: "Осознание проблемы",
    shortTitle: "Проблемы",
    description: "Выявление и определение основных проблем, требующих решения",
    icon: Brain,
    color: "#00b7ff",
    examples: ["Пробелы рынка", "Болевые точки пользователей", "Неэффективность систем"]
  },
  {
    id: 'gathering' as const,
    title: "Сбор и тестирование идей",
    shortTitle: "Идеи",
    description: "Генерация решений и оценка их потенциала",
    icon: Users,
    color: "#10b981",
    examples: ["Мозговой штурм", "Мнения сообщества", "Тесты осуществимости"]
  },
  {
    id: 'formation' as const,
    title: "Формирование решения",
    shortTitle: "Решения",
    description: "Превращение лучших идей в практические решения",
    icon: Rocket,
    color: "#f59e0b",
    examples: ["Прототипирование", "План реализации", "Распределение ресурсов"]
  }
];

interface ProcessVisualizationProps {
  onStageSelect: (stageId: 'awareness' | 'gathering' | 'formation') => void;
  selectedStage: 'awareness' | 'gathering' | 'formation' | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export function ProcessVisualization({ 
  onStageSelect, 
  selectedStage, 
  searchQuery, 
  onSearchChange,
  selectedTags,
  onTagSelect
}: ProcessVisualizationProps) {
  const handleCreateProblem = () => {
    alert('Открыть форму создания новой проблемы');
  };

  const selectedStageData = stages.find(stage => stage.id === selectedStage);

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        {/* Заголовок с layout анимацией */}
        <motion.div
          layout
          className={selectedStage ? "mb-0" : "mb-12"}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        >
          <AnimatePresence mode="wait">
            {!selectedStage && (
              <motion.div
                key="header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ 
                  opacity: 0, 
                  y: -20, 
                  scale: 0.95,
                  height: 0,
                  marginBottom: 0
                }}
                transition={{ 
                  duration: 0.5,
                  opacity: { duration: 0.3 },
                  height: { duration: 0.6, delay: 0.1 }
                }}
                className="text-center overflow-hidden"
              >
                <h2 className="text-4xl mb-4">Процесс эволюции идей</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Превращайте проблемы в решения через коллективное мышление и систематическую оценку
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Этапы с layout анимацией */}
        <motion.div 
          layout
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto ${
            selectedStage ? 'mb-8' : 'mb-0'
          }`}
          transition={{ 
            duration: 0.6, 
            type: "spring", 
            stiffness: 100,
            delay: selectedStage ? 0.2 : 0
          }}
        >
          {stages.map((stage, index) => (
            <motion.div
              key={stage.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1,
                scale: 1
              }}
              transition={{ 
                duration: 0.6, 
                delay: selectedStage ? 0.3 : index * 0.2,
                layout: { duration: 0.6, type: "spring", stiffness: 100 }
              }}
              className="flex-1"
            >
              <Card 
                className={`bg-card suckless-shadow transition-all duration-500 cursor-pointer group border-2 ${
                  selectedStage ? 'p-4' : 'p-6'
                } ${
                  selectedStage === stage.id 
                    ? 'suckless-shadow-lg' 
                    : 'border-border hover:suckless-shadow-lg'
                }`}
                style={{ 
                  borderColor: selectedStage === stage.id ? stage.color : undefined,
                  boxShadow: selectedStage === stage.id 
                    ? `0 0 20px ${stage.color}40, 0 10px 15px -3px rgba(0, 0, 0, 0.3)` 
                    : undefined
                }}
                onClick={() => onStageSelect(stage.id)}
              >
                <motion.div 
                  layout
                  className="text-center h-full flex flex-col"
                  whileHover={{ scale: selectedStage ? 1.02 : 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    layout
                    className={`rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-500 group-hover:scale-110 ${
                      selectedStage ? 'w-12 h-12' : 'w-16 h-16'
                    }`}
                    style={{ 
                      backgroundColor: `${stage.color}20`, 
                      border: `2px solid ${stage.color}`,
                      boxShadow: selectedStage === stage.id 
                        ? `0 0 15px ${stage.color}60` 
                        : undefined
                    }}
                    animate={{
                      scale: selectedStage === stage.id ? 1.1 : 1
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <stage.icon 
                      className={`transition-all duration-500 group-hover:scale-110 ${
                        selectedStage ? 'w-6 h-6' : 'w-8 h-8'
                      }`}
                      style={{ 
                        color: stage.color,
                        filter: selectedStage === stage.id ? `drop-shadow(0 0 4px ${stage.color})` : undefined
                      }} 
                    />
                  </motion.div>
                  
                  <motion.h3 
                    layout
                    className={`mb-3 transition-all duration-500 group-hover:scale-105 ${
                      selectedStage ? 'text-base' : 'text-xl'
                    }`}
                    style={{ 
                      color: stage.color,
                      textShadow: selectedStage === stage.id ? `0 0 8px ${stage.color}60` : undefined
                    }}
                  >
                    {selectedStage ? stage.shortTitle : stage.title}
                  </motion.h3>
                  
                  {/* Описание и примеры с layout анимацией */}
                  <AnimatePresence mode="wait">
                    {!selectedStage && (
                      <motion.div
                        key="content"
                        layout
                        initial={{ opacity: 1, height: "auto" }}
                        exit={{ 
                          opacity: 0, 
                          height: 0,
                          marginTop: 0,
                          marginBottom: 0
                        }}
                        transition={{ 
                          duration: 0.4,
                          height: { duration: 0.5 },
                          opacity: { duration: 0.3 }
                        }}
                        className="flex-grow flex flex-col overflow-hidden"
                      >
                        <p className="text-muted-foreground mb-4 text-sm leading-relaxed flex-grow">
                          {stage.description}
                        </p>
                        
                        <div className="space-y-2 mt-auto">
                          {stage.examples.map((example, i) => (
                            <motion.div 
                              key={i} 
                              className="text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full transition-all duration-300 group-hover:bg-muted/50"
                              whileHover={{ scale: 1.05 }}
                            >
                              {example}
                            </motion.div>
                          ))}
                        </div>

                        <div className="mt-4 pt-3 border-t border-border">
                          <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                            Нажмите для просмотра
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Компактный вид при выбранном этапе */}
                  <AnimatePresence mode="wait">
                    {selectedStage && (
                      <motion.div
                        key="compact"
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="text-xs"
                        style={{ 
                          color: selectedStage === stage.id ? stage.color : 'var(--muted-foreground)'
                        }}
                      >
                        {selectedStage === stage.id ? 'Активный этап' : 'Нажмите для выбора'}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Интерфейс поиска и создания */}
        <AnimatePresence mode="wait">
          {selectedStage && (
            <motion.div
              key="search-interface"
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <SearchAndFilters
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                onCreateProblem={handleCreateProblem}
                stageColor={selectedStageData?.color || '#00b7ff'}
              />

              <TagCloud
                selectedTags={selectedTags}
                onTagSelect={onTagSelect}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}