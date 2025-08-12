import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Eye, MessageCircle, ThumbsUp } from "lucide-react";

interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  votes: number;
  comments: number;
  views: number;
  author: string;
  timestamp: string;
  stage: 'awareness' | 'gathering' | 'formation';
}

const problemsData: Problem[] = [
  {
    id: "1",
    title: "Высокие тарифы на интернет в отдаленных районах",
    description: "Жители сельских районов платят в 2-3 раза больше за медленный интернет",
    category: "Телекоммуникации",
    votes: 127,
    comments: 23,
    views: 456,
    author: "СельскийЖитель",
    timestamp: "2 часа назад",
    stage: "awareness"
  },
  {
    id: "2", 
    title: "Нехватка парковочных мест в жилых районах",
    description: "Новые ЖК строятся без учета реальной потребности в парковке",
    category: "Городское планирование",
    votes: 89,
    comments: 31,
    views: 234,
    author: "ГородскойАктивист",
    timestamp: "4 часа назад",
    stage: "awareness"
  },
  {
    id: "3",
    title: "Сложность получения справок в МФЦ",
    description: "Долгие очереди и запутанная система электронной записи",
    category: "Госуслуги",
    votes: 156,
    comments: 45,
    views: 678,
    author: "ОбычныйГражданин",
    timestamp: "6 часов назад",
    stage: "awareness"
  },
  {
    id: "4",
    title: "Проблемы с общественным транспортом в час пик",
    description: "Переполненные автобусы и несоблюдение расписания",
    category: "Транспорт",
    votes: 94,
    comments: 17,
    views: 289,
    author: "Пассажир2024",
    timestamp: "8 часов назад",
    stage: "awareness"
  },
  {
    id: "5",
    title: "Мобильное приложение для совместных поездок",
    description: "Платформа для поиска попутчиков с системой рейтингов и безопасности",
    category: "Транспорт",
    votes: 73,
    comments: 18,
    views: 312,
    author: "StartupИдеи",
    timestamp: "1 день назад",
    stage: "gathering"
  },
  {
    id: "6",
    title: "Система умных контейнеров для мусора",
    description: "IoT-решение для оптимизации маршрутов вывоза мусора",
    category: "Экология",
    votes: 95,
    comments: 27,
    views: 445,
    author: "ЭкоТех",
    timestamp: "2 дня назад",
    stage: "gathering"
  },
  {
    id: "7",
    title: "Чат-бот для помощи пожилым с госуслугами",
    description: "ИИ-помощник для навигации по сайту госуслуг с голосовым интерфейсом",
    category: "Госуслуги",
    votes: 61,
    comments: 14,
    views: 203,
    author: "DigitalHelpер",
    timestamp: "3 дня назад",
    stage: "gathering"
  },
  {
    id: "8",
    title: "Система коворкинг-пространств в спальных районах",
    description: "Идея создания небольших коворкингов в жилых массивах",
    category: "Городское планирование",
    votes: 52,
    comments: 19,
    views: 167,
    author: "РайонныйДевелопер",
    timestamp: "4 дня назад",
    stage: "gathering"
  },
  {
    id: "9",
    title: "Платформа онлайн-образования для пожилых",
    description: "Готовый MVP с базовым функционалом и планом монетизации",
    category: "Образование",
    votes: 112,
    comments: 34,
    views: 567,
    author: "EdTechКоманда",
    timestamp: "5 дней назад",
    stage: "formation"
  },
  {
    id: "10",
    title: "Сервис поиска местных мастеров",
    description: "Полнофункциональная платформа с системой рейтингов и платежами",
    category: "Сервисы",
    votes: 87,
    comments: 29,
    views: 398,
    author: "LocalServices",
    timestamp: "6 дней назад",
    stage: "formation"
  }
];

interface ProblemsListProps {
  selectedStage: 'awareness' | 'gathering' | 'formation' | null;
  searchQuery: string;
  selectedTags: string[];
}

export function ProblemsList({ selectedStage, searchQuery, selectedTags }: ProblemsListProps) {
  if (!selectedStage) return null;

  const getStageTitle = (stage: string) => {
    switch (stage) {
      case 'awareness': return 'Проблемы требующие решения';
      case 'gathering': return 'Идеи в разработке';
      case 'formation': return 'Готовые решения';
      default: return 'Проблемы';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'awareness': return '#00b7ff';
      case 'gathering': return '#10b981';
      case 'formation': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  // Фильтрация проблем
  const filteredProblems = problemsData.filter(problem => {
    const matchesStage = problem.stage === selectedStage;
    const matchesSearch = searchQuery === '' || 
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.includes(problem.category);
    
    return matchesStage && matchesSearch && matchesTags;
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="py-6 px-4 bg-muted/10"
    >
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl mb-2" style={{ color: getStageColor(selectedStage) }}>
            {getStageTitle(selectedStage)}
          </h2>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
            <span>{filteredProblems.length} элементов найдено</span>
            {searchQuery && (
              <span>• поиск: <span style={{ color: getStageColor(selectedStage) }}>"{searchQuery}"</span></span>
            )}
            {selectedTags.length > 0 && (
              <span>• фильтры: {selectedTags.join(', ')}</span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {filteredProblems.map((problem, index) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="p-4 bg-card suckless-shadow hover:suckless-shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="group-hover:text-primary transition-colors duration-200 truncate">
                        {problem.title}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className="text-xs flex-shrink-0"
                        style={{ 
                          borderColor: getStageColor(selectedStage), 
                          color: getStageColor(selectedStage),
                          backgroundColor: selectedTags.includes(problem.category) ? `${getStageColor(selectedStage)}20` : 'transparent'
                        }}
                      >
                        {problem.category}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2 leading-relaxed line-clamp-2">
                      {problem.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className="truncate">от {problem.author} • {problem.timestamp}</span>
                      </div>
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{problem.votes}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <MessageCircle className="w-3 h-3" />
                          <span>{problem.comments}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Eye className="w-3 h-3" />
                          <span>{problem.views}</span>
                        </div>

                        <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                          Подробнее
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p className="text-muted-foreground mb-3">
              {searchQuery || selectedTags.length > 0 
                ? "Ничего не найдено по вашему запросу" 
                : "Пока нет элементов на этом этапе"
              }
            </p>
            {(searchQuery || selectedTags.length > 0) && (
              <div className="text-sm text-muted-foreground">
                Попробуйте изменить запрос или сбросить фильтры
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}