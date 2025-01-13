import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NavbarLinks } from '@/utils/constants';

export const Header = () => {
    return (
        <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold text-primary hover:text-secondary">
                    Omkar Chebale
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    {NavbarLinks.map((item, index) => (
                        <Link
                            key={index}
                            href={item.link}
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Theme Toggle */}
                <ThemeToggle />
            </div>
        </header>
    );
};
