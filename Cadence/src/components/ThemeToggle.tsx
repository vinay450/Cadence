import { useContext } from 'react';
import { ThemeContext } from '@/lib/theme';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="fixed top-4 right-4 z-[9999]">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="rounded-full w-10 h-10 bg-background border-border hover:bg-accent transition-colors"
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-foreground" />
        ) : (
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-foreground" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}; 