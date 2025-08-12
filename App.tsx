import { ArgumentationTree } from "./components/ArgumentationTree";
import { Header } from "./components/Header";
import { StagesNavigation } from "./components/StagesNavigation";

export default function App() {
  return (
    <div className="h-screen bg-background text-foreground dark flex flex-col">
      <Header />
      
      {/* Панель этапов */}
      <StagesNavigation />
      
      <main className="flex-1 overflow-hidden">
        <ArgumentationTree />
      </main>
      
      <footer className="bg-card border-t border-border py-4 flex-shrink-0">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <span className="font-bold" style={{ color: '#00b7ff' }}>SUCK</span>
              <span>LESS</span>
              <span className="text-muted-foreground">.space</span>
            </div>
            <div className="h-4 w-px bg-border"></div>
            <div className="flex space-x-4 text-xs text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">О проекте</a>
              <a href="#" className="hover:text-primary transition-colors">Правила</a>
              <a href="#" className="hover:text-primary transition-colors">API</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}