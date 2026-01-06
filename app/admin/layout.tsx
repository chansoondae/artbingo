'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const pathname = usePathname();

  // Firestore에서 관리자 이메일 확인
  const checkAdminStatus = async (email: string): Promise<boolean> => {
    try {
      const adminsRef = collection(db, 'admins');
      const q = query(adminsRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('관리자 확인 오류:', error);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      // 사용자가 로그인되어 있고, 이메일이 있는지 확인
      if (currentUser && currentUser.email) {
        const authorized = await checkAdminStatus(currentUser.email);
        setIsAuthorized(authorized);

        // 권한이 없으면 로그아웃
        if (!authorized) {
          await signOut(auth);
        }
      } else {
        setIsAuthorized(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // 로그인 성공 후 이메일 체크
      if (result.user && result.user.email) {
        const authorized = await checkAdminStatus(result.user.email);
        if (!authorized) {
          await signOut(auth);
          alert('접근 권한이 없습니다. 관리자에게 문의하세요.');
        }
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인에 실패했습니다.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="text-white text-2xl">로딩 중...</div>
      </main>
    );
  }

  if (!user || !isAuthorized) {
    return (
      <main className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">
            Admin Login
          </h1>
          <div className="space-y-4">
            <p className="text-white/70 text-center mb-6">
              관리자 계정으로 로그인해주세요
            </p>
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-lg transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google로 로그인
            </button>
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-300/90 text-xs text-center">
                ⚠️ 승인된 관리자만 접근 가능합니다
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Bingo Stats', icon: '📊' },
    { href: '/admin/fortune', label: 'Fortune Stats', icon: '🎰' },
    { href: '/admin/personality', label: 'Personality Stats', icon: '🎭' },
    { href: '/admin/settings', label: 'Admin Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Side Navigation */}
      <aside className="w-64 bg-white/5 backdrop-blur-sm border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-white/60 text-sm">Art Bingo Dashboard</p>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3 mb-3">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {user.displayName || user.email}
              </p>
              <p className="text-white/60 text-xs truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <span>🚪</span>
            <span>로그아웃</span>
          </button>
        </div>

        <nav className="flex-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
