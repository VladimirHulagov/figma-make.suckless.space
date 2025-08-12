import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, ChevronDown, ChevronRight, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface TreeNode {
  id: string;
  text: string;
  type: 'problem' | 'pro' | 'con' | 'neutral';
  votes: { up: number; down: number };
  children: TreeNode[];
  author: string;
  timestamp: string;
}

const sampleData: TreeNode = {
  id: "root",
  text: "Как снизить городские пробки, сохранив экономический рост?",
  type: "problem",
  votes: { up: 45, down: 3 },
  author: "ГородскойПланировщик",
  timestamp: "2 часа назад",
  children: [
    {
      id: "1",
      text: "Ввести платные дороги в центре города",
      type: "pro",
      votes: { up: 23, down: 8 },
      author: "ЭкспертЭкономики",
      timestamp: "1 час назад",
      children: [
        {
          id: "1.1",
          text: "Платные дороги Лондона сократили трафик на 30%",
          type: "pro",
          votes: { up: 15, down: 2 },
          author: "АналитикДанных",
          timestamp: "45 мин назад",
          children: []
        },
        {
          id: "1.2",
          text: "Может негативно сказаться на малоимущих жителях",
          type: "con",
          votes: { up: 12, down: 5 },
          author: "СоциальныйАдвокат",
          timestamp: "30 мин назад",
          children: []
        }
      ]
    },
    {
      id: "2",
      text: "Масштабные инвестиции в общественный транспорт",
      type: "pro",
      votes: { up: 34, down: 4 },
      author: "ПланировщикТранспорта",
      timestamp: "90 мин назад",
      children: [
        {
          id: "2.1",
          text: "Требует значительных первоначальных капиталовложений",
          type: "con",
          votes: { up: 18, down: 3 },
          author: "АналитикБюджета",
          timestamp: "20 мин назад",
          children: []
        }
      ]
    },
    {
      id: "3",
      text: "Продвигать политику удаленной работы для снижения поездок",
      type: "neutral",
      votes: { up: 19, down: 7 },
      author: "ИнноваторРаботы",
      timestamp: "3 часа назад",
      children: []
    }
  ]
};

function TreeNodeComponent({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'problem': return '#00b7ff';
      case 'pro': return '#10b981';
      case 'con': return '#ef4444';
      case 'neutral': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getNodeBadge = (type: string) => {
    switch (type) {
      case 'problem': return 'Проблема';
      case 'pro': return 'За';
      case 'con': return 'Против';
      case 'neutral': return 'Идея';
      default: return 'Идея';
    }
  };

  // Calculate left margin based on depth
  const leftMargin = Math.min(depth * 24, 96); // 24px per level, max 96px

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ marginLeft: `${leftMargin}px` }}
    >
      <Card 
        className="mb-4 bg-card suckless-shadow border-l-4 hover:suckless-shadow-lg transition-all duration-200"
        style={{ borderLeftColor: getNodeColor(node.type) }}
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3 flex-1">
              {node.children.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 h-6 w-6 flex-shrink-0"
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
              )}
              
              <Badge 
                variant="outline" 
                className="text-xs flex-shrink-0"
                style={{ borderColor: getNodeColor(node.type), color: getNodeColor(node.type) }}
              >
                {getNodeBadge(node.type)}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="p-1 h-6 w-6 text-green-500 hover:text-green-400">
                  <ThumbsUp className="w-3 h-3" />
                </Button>
                <span className="text-xs text-green-500">{node.votes.up}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="p-1 h-6 w-6 text-red-500 hover:text-red-400">
                  <ThumbsDown className="w-3 h-3" />
                </Button>
                <span className="text-xs text-red-500">{node.votes.down}</span>
              </div>
            </div>
          </div>
          
          <p className="mb-3 leading-relaxed">{node.text}</p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
            <span>от {node.author} • {node.timestamp}</span>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Plus className="w-3 h-3 mr-1" />
                Добавить ответ
              </Button>
              
              <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                <MessageCircle className="w-3 h-3 mr-1" />
                Обсудить
              </Button>
            </div>
          </div>
          
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-border"
              >
                <div className="flex flex-wrap gap-2 mb-2">
                  <Button size="sm" variant="outline" className="text-xs">За</Button>
                  <Button size="sm" variant="outline" className="text-xs">Против</Button>
                  <Button size="sm" variant="outline" className="text-xs">Нейтрально</Button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Добавьте ваш ответ..."
                    className="flex-1 px-3 py-1 text-sm bg-input border border-border rounded min-w-0"
                  />
                  <Button size="sm">Отправить</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
      
      <AnimatePresence>
        {isExpanded && node.children.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {node.children.map((child) => (
              <TreeNodeComponent key={child.id} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function DecisionTree() {
  return (
    <section className="py-12 px-4 bg-muted/20">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl mb-4">Коллаборативное дерево решений</h2>
          <p className="text-muted-foreground">
            Исследуйте проблемы и решения через структурированную аргументацию
          </p>
        </motion.div>

        <TreeNodeComponent node={sampleData} />
      </div>
    </section>
  );
}