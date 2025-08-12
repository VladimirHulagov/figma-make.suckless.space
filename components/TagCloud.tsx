import { motion } from "motion/react";
import { Badge } from "./ui/badge";

interface Tag {
  name: string;
  count: number;
  color: string;
}

const tagCategories: Tag[] = [
  { name: "Транспорт", count: 23, color: "#00b7ff" },
  { name: "Городское планирование", count: 18, color: "#10b981" },
  { name: "Телекоммуникации", count: 15, color: "#f59e0b" },
  { name: "Госуслуги", count: 12, color: "#ef4444" },
  { name: "Экология", count: 19, color: "#8b5cf6" },
  { name: "Образование", count: 11, color: "#06b6d4" },
  { name: "Здравоохранение", count: 16, color: "#84cc16" },
  { name: "Сервисы", count: 14, color: "#f97316" },
  { name: "Финтех", count: 8, color: "#ec4899" },
  { name: "Социальные сети", count: 9, color: "#6366f1" },
  { name: "Безопасность", count: 7, color: "#dc2626" },
  { name: "Энергетика", count: 13, color: "#059669" }
];

interface TagCloudProps {
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export function TagCloud({ selectedTags, onTagSelect }: TagCloudProps) {
  const getTagSize = (count: number) => {
    if (count >= 20) return "text-lg px-4 py-2";
    if (count >= 15) return "text-base px-3 py-2";
    if (count >= 10) return "text-sm px-3 py-1";
    return "text-xs px-2 py-1";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mb-8"
    >
      <h3 className="text-lg mb-4 text-muted-foreground">Категории проблем</h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {tagCategories.map((tag, index) => (
          <motion.div
            key={tag.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge
              variant={selectedTags.includes(tag.name) ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${getTagSize(tag.count)}`}
              style={{
                backgroundColor: selectedTags.includes(tag.name) ? tag.color : 'transparent',
                borderColor: tag.color,
                color: selectedTags.includes(tag.name) ? '#ffffff' : tag.color,
                boxShadow: selectedTags.includes(tag.name) ? `0 0 10px ${tag.color}40` : undefined
              }}
              onClick={() => onTagSelect(tag.name)}
            >
              {tag.name} ({tag.count})
            </Badge>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}