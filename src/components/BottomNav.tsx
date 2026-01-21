
import { Link, useLocation } from 'react-router-dom';
import { Home, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNav = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/profile', label: 'Profile', icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 h-16">
            <div className="grid grid-cols-2 h-full max-w-lg mx-auto">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex flex-col items-center justify-center",
                                active ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className={cn(
                                "w-6 h-6",
                                active && "animate-bounce-small"
                            )} />
                            <span className="text-xs mt-1">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
