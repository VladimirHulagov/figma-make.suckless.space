import { Button } from "./ui/button";
import { Plus, Users, Lightbulb } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-card suckless-shadow">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl">
              <span className="font-bold" style={{ color: '#00b7ff' }}>SUCK</span>
              <span>LESS</span>
              <span className="text-muted-foreground">.space</span>
            </h1>
            <div className="hidden md:block text-sm text-muted-foreground">
              Коллаборативный инкубатор идей
            </div>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
              <Users className="w-4 h-4 mr-2" />
              Сообщество
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
              <Lightbulb className="w-4 h-4 mr-2" />
              Идеи
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Новая проблема
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}