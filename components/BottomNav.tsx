'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      icon: '🎨',
      label: '빙고',
      active: pathname === '/'
    },
    {
      href: '/fortune',
      icon: '🐴',
      label: '운세',
      active: pathname === '/fortune'
    },
    {
      href: '/personality',
      icon: '🎭',
      label: '성격',
      active: pathname === '/personality'
    },
    {
      href: '/contents',
      icon: '📊',
      label: '콘텐츠',
      active: pathname === '/contents'
    }
  ];

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.navContainer}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${item.active ? styles.active : ''}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
