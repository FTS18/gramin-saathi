import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, BookOpen, Gift, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'होम', labelEn: 'Home' },
  { path: '/saathi', icon: MessageCircle, label: 'साथी', labelEn: 'Saathi' },
  { path: '/khata', icon: BookOpen, label: 'खाता', labelEn: 'Khata' },
  { path: '/yojana', icon: Gift, label: 'योजना', labelEn: 'Yojana' },
  { path: '/seekho', icon: GraduationCap, label: 'सीखो', labelEn: 'Seekho' },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="grid grid-cols-5 h-16">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors touch-target",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "scale-110")} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
