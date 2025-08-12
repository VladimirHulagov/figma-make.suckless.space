import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus, Search, Filter } from "lucide-react";

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateProblem: () => void;
  stageColor: string;
}

export function SearchAndFilters({ 
  searchQuery, 
  onSearchChange, 
  onCreateProblem, 
  stageColor 
}: SearchAndFiltersProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-8 bg-card p-6 rounded-lg suckless-shadow border border-border"
    >
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <motion.div 
          className="relative flex-1 w-full"
          animate={{ 
            scale: isSearchFocused ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" 
          />
          <Input
            type="text"
            placeholder="Найти проблемы, идеи или решения..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`pl-10 pr-4 py-3 text-base transition-all duration-300 ${
              isSearchFocused ? 'ring-2' : ''
            }`}
            style={{
              ringColor: isSearchFocused ? stageColor : undefined,
              borderColor: isSearchFocused ? stageColor : undefined
            }}
          />
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              ×
            </motion.button>
          )}
        </motion.div>

        <div className="flex gap-2 flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              className="px-4 py-3"
              style={{ borderColor: stageColor, color: stageColor }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Фильтры
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              className="px-4 py-3 text-white"
              style={{ backgroundColor: stageColor }}
              onClick={onCreateProblem}
            >
              <Plus className="w-4 h-4 mr-2" />
              Создать
            </Button>
          </motion.div>
        </div>
      </div>

      {searchQuery && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-border"
        >
          <div className="text-sm text-muted-foreground">
            Поиск по запросу: <span style={{ color: stageColor }}>"{searchQuery}"</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}