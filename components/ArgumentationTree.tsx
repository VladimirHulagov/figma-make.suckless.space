import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
  Handle,
  NodeProps,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Plus, RotateCcw, Check, X, ThumbsUp, ThumbsDown, MessageCircle, Send } from 'lucide-react';

// Типы аргументов
type ArgumentType = 'main' | 'support' | 'objection';

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
  votes: number;
}

interface ArgumentData {
  id: string;
  text: string;
  type: ArgumentType;
  author: string;
  votes: number;
  dislikes: number;
  comments: Comment[];
  hasChildren?: boolean;
  isEditing?: boolean;
  isCommentsExpanded?: boolean;
}

// Кастомный компонент узла
const ArgumentNode: React.FC<NodeProps<ArgumentData> & { 
  onAddArgument?: (nodeId: string, type: 'support' | 'objection') => void;
  onEditArgument?: (nodeId: string, newText: string) => void;
  onCancelEdit?: (nodeId: string) => void;
  onToggleComments?: (nodeId: string) => void;
  onVote?: (nodeId: string, type: 'like' | 'dislike') => void;
  onAddComment?: (nodeId: string, comment: string) => void;
}> = React.memo(({ 
  data, 
  selected, 
  onAddArgument,
  onEditArgument,
  onCancelEdit,
  onToggleComments,
  onVote,
  onAddComment
}) => {
  const [editText, setEditText] = React.useState(data.text);
  const [newComment, setNewComment] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const commentInputRef = React.useRef<HTMLInputElement>(null);

  // Автофокус при входе в режим редактирования
  React.useEffect(() => {
    if (data.isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [data.isEditing]);

  const handleSave = () => {
    if (editText.trim()) {
      onEditArgument?.(data.id, editText.trim());
    }
  };

  const handleCancel = () => {
    setEditText(data.text);
    onCancelEdit?.(data.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment?.(data.id, newComment.trim());
      setNewComment('');
      
      // Сохраняем фокус на поле ввода после добавления комментария
      setTimeout(() => {
        if (commentInputRef.current) {
          commentInputRef.current.focus();
        }
        
        // Прокручиваем к последнему комментарию
        const commentsContainer = commentInputRef.current?.closest('.space-y-2');
        if (commentsContainer) {
          commentsContainer.scrollTop = commentsContainer.scrollHeight;
        }
      }, 200);
    }
  };

  const handleCommentKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddComment();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'только что';
    if (diffInHours < 24) return `${diffInHours}ч назад`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}д назад`;
    
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };
  const getNodeColor = (type: ArgumentType) => {
    switch (type) {
      case 'main': return '#00b7ff';
      case 'support': return '#10b981';
      case 'objection': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getNodeIcon = (type: ArgumentType) => {
    switch (type) {
      case 'main': return '🎯';
      case 'support': return '✅';
      case 'objection': return '❌';
      default: return '💭';
    }
  };

  return (
    <motion.div
      key={`argument-node-${data.id}`}
      layout={data.isCommentsExpanded ? false : true} // Отключаем layout при раскрытых комментариях
      initial={data.id.length > 1 ? { opacity: 0, scale: 0.8 } : false}
      animate={{ 
        opacity: 1, 
        scale: 1,
        width: data.isEditing ? 400 : 300
      }}
      transition={{ 
        layout: { 
          duration: 0.4, 
          ease: [0.25, 0.46, 0.45, 0.94],
          type: "tween"
        },
        opacity: { duration: 0.3, ease: "easeOut" },
        scale: { duration: 0.3, ease: "easeOut" },
        width: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
      }}
      className="relative argument-node-rebalancing"
      style={{ position: 'relative' }}
    >
      {/* Handle сверху только если это не главный узел */}
      {data.type !== 'main' && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3"
          style={{ background: getNodeColor(data.type) }}
        />
      )}
      
      <Card 
        className={`
          ${data.isEditing ? 'w-[400px]' : 'w-[300px]'} p-4 cursor-pointer transition-all duration-400
          ${selected ? 'ring-2 ring-primary shadow-lg' : ''}
          ${data.type === 'main' ? 'suckless-shadow-lg' : 'suckless-shadow'}
          ${data.isEditing ? 'ring-2 ring-primary/50 suckless-shadow-lg editing-node-highlight' : ''}
        `}
        style={{
          borderLeft: `4px solid ${getNodeColor(data.type)}`,
          background: data.type === 'main' ? 'linear-gradient(135deg, #1e2024 0%, #252830 100%)' : undefined
        }}
      >
        <div className="flex items-start space-x-3">
          <div 
            className="text-lg flex-shrink-0 mt-1"
            style={{ color: getNodeColor(data.type) }}
          >
            {getNodeIcon(data.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            {data.isEditing ? (
              // Режим редактирования
              <div className="space-y-3">
                <Textarea
                  ref={textareaRef}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Введите текст аргумента..."
                  className="min-h-[80px] text-sm resize-none"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={!editText.trim()}
                      className="flex items-center space-x-1 text-xs h-7"
                    >
                      <Check className="w-3 h-3" />
                      <span>Сохранить</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                      className="flex items-center space-x-1 text-xs h-7"
                    >
                      <X className="w-3 h-3" />
                      <span>Отмена</span>
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Ctrl+Enter для сохранения
                  </div>
                </div>
              </div>
            ) : (
              // Обычный режим просмотра
              <>
                <p className="text-sm leading-relaxed text-foreground break-words">
                  {data.text}
                </p>
                
                <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                  <span className="truncate">{data.author}</span>
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    {/* Лайки и дизлайки */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onVote?.(data.id, 'like');
                        }}
                        className="flex items-center space-x-1 hover:text-green-500 transition-colors vote-button"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{data.votes}</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onVote?.(data.id, 'dislike');
                        }}
                        className="flex items-center space-x-1 hover:text-red-500 transition-colors vote-button"
                      >
                        <ThumbsDown className="w-3 h-3" />
                        <span>{data.dislikes}</span>
                      </button>
                    </div>
                    
                    {/* Кнопка комментариев */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleComments?.(data.id);
                      }}
                      className={`flex items-center space-x-1 transition-colors ${
                        data.isCommentsExpanded ? 'text-primary' : 'hover:text-primary'
                      }`}
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>{data.comments.length}</span>
                    </button>
                  </div>
                </div>

                {/* Кнопки добавления аргументов - показываются только в режиме просмотра */}
                {onAddArgument && !data.isCommentsExpanded && (
                  <div className="mt-3 flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center space-x-1 text-xs h-7 bg-background/50 hover:bg-background/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddArgument?.(data.id, 'support');
                      }}
                    >
                      <Plus className="w-3 h-3" />
                      <span>За</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center space-x-1 text-xs h-7 bg-background/50 hover:bg-background/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddArgument?.(data.id, 'objection');
                      }}
                    >
                      <Plus className="w-3 h-3" />
                      <span>Против</span>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Секция комментариев - абсолютное позиционирование */}
        {data.isCommentsExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="comments-expanded p-4 space-y-3"
            onClick={(e) => e.stopPropagation()} // Предотвращаем всплытие события клика
          >
            {/* Список комментариев */}
            <div className="space-y-2 max-h-48 overflow-y-auto scroll-smooth comments-scroll">
              {data.comments.length > 0 ? (
                data.comments.map((comment) => (
                  <motion.div 
                    key={comment.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="bg-muted/30 rounded-md p-2 text-xs comment-item"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground">{comment.author}</span>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <span>{formatTime(comment.timestamp)}</span>
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="w-2.5 h-2.5" />
                          <span>{comment.votes}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{comment.text}</p>
                  </motion.div>
                ))
              ) : (
                <div className="flex items-center justify-center h-24 text-muted-foreground text-xs">
                  Комментариев пока нет
                </div>
              )}
            </div>
            
            {/* Поле добавления комментария */}
            <div className="flex space-x-2 border-t border-border pt-3">
              <Input
                ref={commentInputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleCommentKeyDown}
                placeholder="Добавить комментарий..."
                className="flex-1 text-xs h-8"
              />
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="h-8 px-2"
              >
                <Send className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Handle снизу только если у узла есть или могут быть дети */}
      {(data.hasChildren || data.type === 'main') && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3"
          style={{ background: getNodeColor(data.type) }}
        />
      )}
    </motion.div>
  );
});

// Внутренний компонент дерева аргументации
function ArgumentationTreeInner() {
  // Данные аргументов с информацией о наличии детей
  const argumentsData: ArgumentData[] = [
    {
      id: '1',
      text: 'Искусственный интеллект может полностью заменить разработчиков программного обеспечения в ближайшие 10 лет',
      type: 'main',
      author: 'TechVisionary',
      votes: 24,
      dislikes: 12,
      comments: [
        {
          id: 'c1-1',
          author: 'SkepticalDev',
          text: 'Интересная точка зрения, но не стоит забывать про специфику различных областей разработки.',
          timestamp: new Date('2024-01-15T10:30:00'),
          votes: 5
        },
        {
          id: 'c1-2', 
          author: 'FutureBuilder',
          text: 'Полностью согласен! Уже сейчас видим как ИИ помогает автоматизировать рутинные задачи.',
          timestamp: new Date('2024-01-15T14:22:00'),
          votes: 8
        }
      ],
      hasChildren: true
    },
    {
      id: '2', 
      text: 'ИИ уже сейчас может генерировать код лучше многих junior разработчиков',
      type: 'support',
      author: 'CodeMaster',
      votes: 18,
      dislikes: 7,
      comments: [
        {
          id: 'c2-1',
          author: 'JuniorDev2024',
          text: 'Это не совсем справедливое сравнение. Junior разработчики учатся и развиваются.',
          timestamp: new Date('2024-01-14T09:15:00'),
          votes: 12
        }
      ],
      hasChildren: true
    },
    {
      id: '3',
      text: 'Автоматизация всегда приводила к исчезновению профессий в прошлом',
      type: 'support', 
      author: 'HistoryBuff',
      votes: 15,
      dislikes: 9,
      comments: [],
      hasChildren: false
    },
    {
      id: '4',
      text: 'ИИ не может понимать бизнес-требования и общаться с клиентами',
      type: 'objection',
      author: 'ProductManager',
      votes: 31,
      dislikes: 6,
      comments: [
        {
          id: 'c4-1',
          author: 'BusinessAnalyst',
          text: 'Именно! Понимание контекста и нюансов бизнеса - это ключевая часть работы разработчика.',
          timestamp: new Date('2024-01-13T16:45:00'),
          votes: 15
        }
      ],
      hasChildren: true
    },
    {
      id: '5',
      text: 'Творческие и архитектурные решения требуют человеческого мышления',
      type: 'objection',
      author: 'SeniorDev',
      votes: 28,
      dislikes: 4,
      comments: [],
      hasChildren: false
    },
    {
      id: '6',
      text: 'GPT-4 и Copilot уже показывают впечатляющие результаты в кодогенерации',
      type: 'support',
      author: 'AIEnthusiast', 
      votes: 12,
      dislikes: 3,
      comments: [],
      hasChildren: false
    },
    {
      id: '7',
      text: 'Сложные системы требуют глубокого понимания домена',
      type: 'objection',
      author: 'SystemArchitect',
      votes: 22,
      dislikes: 2,
      comments: [],
      hasChildren: false
    }
  ];

  // Создание узлов для React Flow с увеличенными расстояниями
  const initialNodes: Node<ArgumentData>[] = useMemo(() => [
    {
      id: '1',
      type: 'argumentNode',
      position: { x: 600, y: 50 },
      data: argumentsData[0]
    },
    {
      id: '2', 
      type: 'argumentNode',
      position: { x: 250, y: 300 },
      data: argumentsData[1]
    },
    {
      id: '3',
      type: 'argumentNode', 
      position: { x: 600, y: 300 },
      data: argumentsData[2]
    },
    {
      id: '4',
      type: 'argumentNode',
      position: { x: 950, y: 300 },
      data: argumentsData[3]
    },
    {
      id: '5', 
      type: 'argumentNode',
      position: { x: 1300, y: 300 },
      data: argumentsData[4]
    },
    {
      id: '6',
      type: 'argumentNode',
      position: { x: 250, y: 580 }, // По центру под узлом 2
      data: argumentsData[5]
    },
    {
      id: '7',
      type: 'argumentNode', 
      position: { x: 950, y: 580 }, // По центру под узлом 4
      data: argumentsData[6]
    }
  ], []);

  // Создание связей между узлами
  const initialEdges: Edge[] = useMemo(() => {
    const baseEdges = [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        type: 'step', // У узла 1 много детей
        markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
        style: { stroke: '#10b981', strokeWidth: 2 }
      },
      {
        id: 'e1-3', 
        source: '1',
        target: '3',
        type: 'step', // У узла 1 много детей
        markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
        style: { stroke: '#10b981', strokeWidth: 2 }
      },
      {
        id: 'e1-4',
        source: '1', 
        target: '4',
        type: 'step', // У узла 1 много детей
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' },
        style: { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '5,5' }
      },
      {
        id: 'e1-5',
        source: '1',
        target: '5', 
        type: 'step', // У узла 1 много детей
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' },
        style: { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '5,5' }
      },
      {
        id: 'e2-6',
        source: '2',
        target: '6',
        type: 'straight', // У узла 2 только один ребенок
        markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
        style: { stroke: '#10b981', strokeWidth: 2 }
      },
      {
        id: 'e4-7',
        source: '4',
        target: '7',
        type: 'straight', // У узла 4 только один ребенок
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' },
        style: { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '5,5' }
      }
    ];
    
    return baseEdges;
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nextId, setNextId] = useState(8);
  const { fitView } = useReactFlow();

  // Константы для размеров узлов и отступов
  const NODE_WIDTH = 300;
  const NODE_WIDTH_EDITING = 400;
  const NODE_HEIGHT = 120;
  const NODE_HEIGHT_EDITING = 180;
  const NODE_HEIGHT_COMMENTS = 300; // Высота узла с развернутыми комментариями
  const MIN_HORIZONTAL_SPACING = 50;
  const MIN_VERTICAL_SPACING = 280;
  const COLLISION_PADDING = 20;

  // Функция для определения типа связи в зависимости от количества детей
  const getEdgeType = useCallback((parentId: string, currentEdges: Edge[]) => {
    const childEdges = currentEdges.filter(edge => edge.source === parentId);
    return childEdges.length === 1 ? 'straight' : 'step';
  }, []);

  // Функция для обновления всех edges с правильными типами
  const updateEdgeTypes = useCallback((currentEdges: Edge[]) => {
    return currentEdges.map(edge => {
      const edgeType = getEdgeType(edge.source, currentEdges);
      return {
        ...edge,
        type: edgeType
      };
    });
  }, [getEdgeType]);

  // Функция проверки пересечения двух узлов
  const checkNodesCollision = useCallback((node1: Node, node2: Node) => {
    const padding = COLLISION_PADDING;
    
    // Не проверяем коллизии для узлов с раскрытыми комментариями для стабильности
    if (node1.data?.isCommentsExpanded || node2.data?.isCommentsExpanded) {
      return false;
    }
    
    // Определяем размеры узлов в зависимости от режима редактирования
    const node1Width = node1.data?.isEditing ? NODE_WIDTH_EDITING : NODE_WIDTH;
    const node1Height = node1.data?.isEditing ? NODE_HEIGHT_EDITING : NODE_HEIGHT;
    const node2Width = node2.data?.isEditing ? NODE_WIDTH_EDITING : NODE_WIDTH;
    const node2Height = node2.data?.isEditing ? NODE_HEIGHT_EDITING : NODE_HEIGHT;
    
    const rect1 = {
      left: node1.position.x - node1Width / 2 - padding,
      right: node1.position.x + node1Width / 2 + padding,
      top: node1.position.y - padding,
      bottom: node1.position.y + node1Height + padding
    };
    const rect2 = {
      left: node2.position.x - node2Width / 2 - padding,
      right: node2.position.x + node2Width / 2 + padding,
      top: node2.position.y - padding,
      bottom: node2.position.y + node2Height + padding
    };

    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
  }, []);

  // Функция поиска оптимальной позиции без пересечений
  const findOptimalPosition = useCallback((
    parentNode: Node, 
    currentNodes: Node[], 
    type: 'support' | 'objection',
    currentEdges: Edge[]
  ) => {
    const childEdges = currentEdges.filter(edge => edge.source === parentNode.id);
    const childNodes = currentNodes.filter(node => 
      childEdges.some(edge => edge.target === node.id)
    );

    const supportNodes = childNodes.filter(node => node.data.type === 'support');
    const objectionNodes = childNodes.filter(node => node.data.type === 'objection');
    const totalChildren = supportNodes.length + objectionNodes.length;

    let baseY = parentNode.position.y + MIN_VERTICAL_SPACING;

    // Если это будет единственный ребенок, размещаем по центру
    if (totalChildren === 0) {
      return { x: parentNode.position.x, y: baseY };
    }

    // Определяем базовую позицию
    let baseX: number;
    let spacing = Math.max(MIN_HORIZONTAL_SPACING, NODE_WIDTH + 50);
    
    if (type === 'support') {
      const supportCount = supportNodes.length;
      baseX = parentNode.position.x - spacing * (supportCount + 1);
    } else {
      const objectionCount = objectionNodes.length;
      baseX = parentNode.position.x + spacing * (objectionCount + 1);
    }

    // Проверяем пересечения и корректируем позицию
    let testX = baseX;
    let iterations = 0;
    const maxIterations = 20;

    while (iterations < maxIterations) {
      const testNode = {
        id: 'test',
        position: { x: testX, y: baseY },
        data: {} as ArgumentData,
        type: 'argumentNode'
      } as Node<ArgumentData>;

      let hasCollision = false;
      for (const node of currentNodes) {
        if (checkNodesCollision(testNode, node)) {
          hasCollision = true;
          break;
        }
      }

      if (!hasCollision) {
        return { x: testX, y: baseY };
      }

      // Сдвигаем позицию для следующей итерации
      if (type === 'support') {
        testX -= spacing * 0.5; // Сдвигаем влево
      } else {
        testX += spacing * 0.5; // Сдвигаем вправо
      }

      iterations++;
    }

    // Если не нашли позицию без пересечений, используем базовую
    return { x: baseX, y: baseY };
  }, [checkNodesCollision]);

  // Функция перестройки дерева для устранения пересечений
  const rebalanceTree = useCallback((currentNodes: Node[], currentEdges: Edge[], newNodeId?: string) => {
    const rebalancedNodes = [...currentNodes];
    const iterations = 3; // Количество итераций для оптимизации

    // Проверяем, есть ли узлы с раскрытыми комментариями - если да, пропускаем перестройку
    const hasExpandedComments = rebalancedNodes.some(node => node.data?.isCommentsExpanded);
    if (hasExpandedComments) {
      return rebalancedNodes;
    }

    for (let iter = 0; iter < iterations; iter++) {
      let hasChanges = false;

      // Группируем узлы по уровням
      const levels: { [level: number]: Node[] } = {};
      rebalancedNodes.forEach(node => {
        // Определяем уровень узла по количеству связей до корня
        let level = 0;
        if (node.data.type !== 'main') {
          const parentEdge = currentEdges.find(edge => edge.target === node.id);
          if (parentEdge) {
            const parentNode = rebalancedNodes.find(n => n.id === parentEdge.source);
            if (parentNode?.data.type !== 'main') {
              level = 2;
            } else {
              level = 1;
            }
          }
        }
        
        if (!levels[level]) levels[level] = [];
        levels[level].push(node);
      });

      // Обрабатываем каждый уровень
      Object.entries(levels).forEach(([levelStr, levelNodes]) => {
        const level = parseInt(levelStr);
        if (level === 0) return; // Пропускаем главный узел

        levelNodes.forEach((node, index) => {
          const nodeIndex = rebalancedNodes.findIndex(n => n.id === node.id);
          if (nodeIndex === -1) return;

          // Проверяем пересечения с другими узлами
          for (let i = 0; i < rebalancedNodes.length; i++) {
            if (i === nodeIndex) continue;
            
            const otherNode = rebalancedNodes[i];
            if (checkNodesCollision(node, otherNode)) {
              // Вычисляем сдвиг для устранения пересечения
              const deltaX = node.position.x - otherNode.position.x;
              const deltaY = node.position.y - otherNode.position.y;
              
              // Определяем направление сдвига
              let moveX = 0;
              let moveY = 0;

              if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Горизонтальное пересечение
                moveX = deltaX > 0 ? NODE_WIDTH + MIN_HORIZONTAL_SPACING : -(NODE_WIDTH + MIN_HORIZONTAL_SPACING);
              } else {
                // Вертикальное пересечение  
                moveY = deltaY > 0 ? NODE_HEIGHT + 50 : -(NODE_HEIGHT + 50);
              }

              // Применяем сдвиг к текущему узлу
              rebalancedNodes[nodeIndex] = {
                ...rebalancedNodes[nodeIndex],
                position: {
                  x: node.position.x + moveX * 0.5,
                  y: node.position.y + moveY * 0.5
                }
              };
              
              hasChanges = true;
            }
          }
        });
      });

      if (!hasChanges) break; // Если изменений нет, выходим из цикла
    }

    return rebalancedNodes;
  }, [checkNodesCollision]);

  // Функция адаптивного распределения узлов по горизонтали
  const redistributeHorizontally = useCallback((parentId: string, currentNodes: Node[], currentEdges: Edge[]) => {
    const parentNode = currentNodes.find(n => n.id === parentId);
    if (!parentNode) return currentNodes;

    const childEdges = currentEdges.filter(edge => edge.source === parentId);
    const childNodes = currentNodes.filter(node => 
      childEdges.some(edge => edge.target === node.id)
    );

    if (childNodes.length <= 1) return currentNodes;

    // Разделяем детей по типам
    const supportNodes = childNodes.filter(node => node.data.type === 'support')
      .sort((a, b) => a.position.x - b.position.x);
    const objectionNodes = childNodes.filter(node => node.data.type === 'objection')
      .sort((a, b) => a.position.x - b.position.x);

    // Вычисляем оптимальные отступы
    const totalChildren = supportNodes.length + objectionNodes.length;
    const baseSpacing = Math.max(NODE_WIDTH + MIN_HORIZONTAL_SPACING, 300);
    const adaptiveSpacing = Math.min(baseSpacing, baseSpacing * (4 / Math.max(totalChildren, 1)));

    return currentNodes.map(node => {
      // Перераспределяем узлы поддержки
      const supportIndex = supportNodes.findIndex(n => n.id === node.id);
      if (supportIndex !== -1) {
        return {
          ...node,
          position: {
            x: parentNode.position.x - adaptiveSpacing * (supportIndex + 1),
            y: node.position.y
          }
        };
      }

      // Перераспределяем узлы возражений
      const objectionIndex = objectionNodes.findIndex(n => n.id === node.id);
      if (objectionIndex !== -1) {
        return {
          ...node,
          position: {
            x: parentNode.position.x + adaptiveSpacing * (objectionIndex + 1),
            y: node.position.y
          }
        };
      }

      return node;
    });
  }, []);

  // Функция автоматической оптимизации дерева
  const optimizeTreeLayout = useCallback(() => {
    setNodes((currentNodes) => {
      let optimizedNodes = [...currentNodes];
      
      // Проходим по всем родительским узлам и оптимизируем их детей
      const parentIds = new Set(edges.map(edge => edge.source));
      
      parentIds.forEach(parentId => {
        optimizedNodes = redistributeHorizontally(parentId, optimizedNodes, edges);
      });
      
      // Применяем общую перестройку для устранения оставшихся пересечений
      return rebalanceTree(optimizedNodes, edges);
    });
  }, [redistributeHorizontally, rebalanceTree, edges]);

  // Функция для редактирования аргумента
  const handleEditArgument = useCallback((nodeId: string, newText: string) => {
    setNodes((currentNodes) => 
      currentNodes.map(node => 
        node.id === nodeId 
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                text: newText,
                isEditing: false
              } 
            }
          : node
      )
    );
  }, [setNodes]);

  // Функция для голосования за аргумент
  const handleVote = useCallback((nodeId: string, type: 'like' | 'dislike') => {
    setNodes((currentNodes) =>
      currentNodes.map(node =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                votes: type === 'like' ? node.data.votes + 1 : node.data.votes,
                dislikes: type === 'dislike' ? node.data.dislikes + 1 : node.data.dislikes
              }
            }
          : node
      )
    );
  }, [setNodes]);

  // Функция для переключения отображения комментариев
  const handleToggleComments = useCallback((nodeId: string) => {
    setNodes((currentNodes) =>
      currentNodes.map(node =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                isCommentsExpanded: !node.data.isCommentsExpanded
              }
            }
          : node
      )
    );
  }, [setNodes]);

  // Функция для закрытия всех обсуждений при клике на пустом месте
  const handlePaneClick = useCallback(() => {
    setNodes((currentNodes) =>
      currentNodes.map(node =>
        node.data.isCommentsExpanded
          ? {
              ...node,
              data: {
                ...node.data,
                isCommentsExpanded: false
              }
            }
          : node
      )
    );
  }, [setNodes]);

  // Функция для добавления комментария
  const handleAddComment = useCallback((nodeId: string, commentText: string) => {
    const newComment: Comment = {
      id: `c${nodeId}-${Date.now()}`,
      author: 'Текущий пользователь',
      text: commentText,
      timestamp: new Date(),
      votes: 0
    };

    setNodes((currentNodes) =>
      currentNodes.map(node =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                comments: [...node.data.comments, newComment]
              }
            }
          : node
      )
    );
  }, [setNodes]);

  // Функция для отмены редактирования
  const handleCancelEdit = useCallback((nodeId: string) => {
    setNodes((currentNodes) => {
      const nodeToCancel = currentNodes.find(n => n.id === nodeId);
      
      // Если это новый узел (пустой текст), удаляем его
      if (nodeToCancel?.data.text.startsWith('Новый аргумент')) {
        // Удаляем соответствующие связи
        setEdges((currentEdges) => 
          currentEdges.filter(edge => edge.target !== nodeId && edge.source !== nodeId)
        );
        
        return currentNodes.filter(node => node.id !== nodeId);
      }
      
      // Иначе просто выходим из режима редактирования
      return currentNodes.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, isEditing: false } }
          : node
      );
    });
  }, [setNodes, setEdges]);

  // Функция добавления нового аргумента с продвинутой перестройкой
  const handleAddArgument = useCallback((parentId: string, type: 'support' | 'objection') => {
    const newId = String(nextId);
    
    setNodes((currentNodes) => {
      setEdges((currentEdges) => {
        // Создаем новое соединение
        const newEdge: Edge = {
          id: `e${parentId}-${newId}`,
          source: parentId,
          target: newId,
          type: 'step',
          markerEnd: { type: MarkerType.ArrowClosed, color: type === 'support' ? '#10b981' : '#ef4444' },
          style: { 
            stroke: type === 'support' ? '#10b981' : '#ef4444', 
            strokeWidth: 2,
            strokeDasharray: type === 'objection' ? '5,5' : '0'
          }
        };
        
        const newEdges = [...currentEdges, newEdge];
        return updateEdgeTypes(newEdges);
      });

      const parentNode = currentNodes.find(n => n.id === parentId);
      if (!parentNode) return currentNodes;

      // Используем новый алгоритм поиска оптимальной позиции
      const optimalPosition = findOptimalPosition(parentNode, currentNodes, type, edges);

      const newNode: Node<ArgumentData> = {
        id: newId,
        type: 'argumentNode',
        position: optimalPosition,
        data: {
          id: newId,
          text: `Новый аргумент ${type === 'support' ? 'в поддержку' : 'против'}`,
          type: type,
          author: 'Новый пользователь',
          votes: 0,
          dislikes: 0,
          comments: [],
          hasChildren: false,
          isEditing: true // Новый узел создается в режиме редактирования
        }
      };

      // Обновляем родительский узел и добавляем новый
      const updatedNodes = currentNodes.map(node => 
        node.id === parentId 
          ? { ...node, data: { ...node.data, hasChildren: true } }
          : node
      );
      
      const nodesWithNew = [...updatedNodes, newNode];
      
      // Сначала перераспределяем узлы по горизонтали для данного родителя
      const horizontallyRebalanced = redistributeHorizontally(parentId, nodesWithNew, edges);
      
      // Затем применяем общий алгоритм перестройки дерева для устранения пересечений
      return rebalanceTree(horizontallyRebalanced, edges, newId);
    });

    setNextId(prev => prev + 1);

    // Автоматически подстраиваем вид с задержкой для завершения анимаций
    setTimeout(() => {
      fitView({ duration: 600, padding: 0.15 });
    }, 300);
  }, [updateEdgeTypes, findOptimalPosition, redistributeHorizontally, rebalanceTree, fitView, edges]);

  // Создаем обёрнутый компонент с callback
  const WrappedArgumentNode = useCallback((props: NodeProps<ArgumentData>) => (
    <ArgumentNode 
      {...props} 
      onAddArgument={handleAddArgument}
      onEditArgument={handleEditArgument}
      onCancelEdit={handleCancelEdit}
      onToggleComments={handleToggleComments}
      onVote={handleVote}
      onAddComment={handleAddComment}
    />
  ), [handleAddArgument, handleEditArgument, handleCancelEdit, handleToggleComments, handleVote, handleAddComment]);

  // Определение кастомных типов узлов
  const nodeTypes = useMemo(() => ({
    argumentNode: WrappedArgumentNode,
  }), [WrappedArgumentNode]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // Если кликнули на узел не в режиме редактирования, завершаем все активные редактирования
    if (!node.data.isEditing) {
      setNodes((currentNodes) => 
        currentNodes.map(n => 
          n.data.isEditing && n.data.text.startsWith('Новый аргумент')
            ? null // Помечаем для удаления
            : { ...n, data: { ...n.data, isEditing: false } }
        ).filter(Boolean) as Node<ArgumentData>[]
      );
      
      // Удаляем связи для удаленных узлов
      setEdges((currentEdges) => 
        currentEdges.filter(edge => {
          const sourceExists = nodes.some(n => n.id === edge.source && !(n.data.isEditing && n.data.text.startsWith('Новый аргумент')));
          const targetExists = nodes.some(n => n.id === edge.target && !(n.data.isEditing && n.data.text.startsWith('Новый аргумент')));
          return sourceExists && targetExists;
        })
      );
    }
  }, [setNodes, setEdges, nodes]);

  const handleFitView = useCallback(() => {
    fitView({ duration: 800 });
  }, [fitView]);

  return (
    <div className="h-full w-full relative bg-background">
      {/* Легенда */}
      <div className="absolute top-4 left-4 z-10 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#00b7ff' }}></div>
            <span>Основной тезис</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }}></div>
            <span>Поддержка</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }}></div>
            <span>Возражение</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-0.5 border-dashed border-muted-foreground"></div>
            <span>Критика</span>
          </div>
        </div>
      </div>

      {/* Кнопка Fit View */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={handleFitView}
          className="flex items-center space-x-2 bg-card/90 backdrop-blur-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Показать всё</span>
        </Button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        fitView
        minZoom={0.3}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        className="bg-background"
        proOptions={{ hideAttribution: true }}
        nodeOrigin={[0.5, 0]}
        connectionMode="loose"
      >
        <Background 
          color="#2a2d32" 
          size={1}
          style={{ backgroundColor: '#131416' }}
        />
      </ReactFlow>
    </div>
  );
}

// Основной компонент с провайдером
export function ArgumentationTree() {
  return (
    <ReactFlowProvider>
      <ArgumentationTreeInner />
    </ReactFlowProvider>
  );
}