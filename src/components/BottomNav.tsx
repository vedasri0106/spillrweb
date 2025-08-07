// 📄 src/components/BottomNav.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusCircle, MessageSquare, User } from 'lucide-react';

const navItems = [
  { href: '/', icon: <Home size={24} />, label: 'Home' },
  { href: '/explore', icon: <Search size={24} />, label: 'Explore' },
  { href: '/post', icon: <PlusCircle size={32} />, label: 'Post' },
  { href: '/chat', icon: <MessageSquare size={24} />, label: 'Chat' },
  { href: '/profile', icon: <User size={24} />, label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t z-50">
      <nav className="flex justify-between px-6 sm:px-10 md:px-20 py-2">
        {navItems.map(({ href, icon, label }) => (
          <Link key={href} href={href} className="flex flex-col items-center flex-1 text-gray-600 hover:text-black">
            <div className={pathname === href ? 'text-black' : ''}>{icon}</div>
            <span className="text-[10px]">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}