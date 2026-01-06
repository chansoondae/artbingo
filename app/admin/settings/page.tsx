'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

interface Admin {
  id: string;
  email: string;
  addedAt: any;
}

export default function AdminSettingsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const adminsRef = collection(db, 'admins');
      const q = query(adminsRef, orderBy('addedAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const adminsList: Admin[] = [];
      querySnapshot.forEach((doc) => {
        adminsList.push({
          id: doc.id,
          email: doc.data().email,
          addedAt: doc.data().addedAt
        });
      });

      setAdmins(adminsList);
    } catch (error) {
      console.error('관리자 목록 가져오기 오류:', error);
      alert('관리자 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmail.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }

    // 중복 체크
    if (admins.some(admin => admin.email === newEmail)) {
      alert('이미 등록된 관리자입니다.');
      return;
    }

    setIsAdding(true);
    try {
      const adminsRef = collection(db, 'admins');
      await addDoc(adminsRef, {
        email: newEmail.toLowerCase().trim(),
        addedAt: new Date()
      });

      setNewEmail('');
      await fetchAdmins();
      alert('관리자가 추가되었습니다.');
    } catch (error) {
      console.error('관리자 추가 오류:', error);
      alert('관리자 추가에 실패했습니다.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string, email: string) => {
    // 마지막 관리자 삭제 방지
    if (admins.length <= 1) {
      alert('최소 1명의 관리자가 필요합니다.');
      return;
    }

    if (!confirm(`${email} 관리자를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'admins', adminId));
      await fetchAdmins();
      alert('관리자가 삭제되었습니다.');
    } catch (error) {
      console.error('관리자 삭제 오류:', error);
      alert('관리자 삭제에 실패했습니다.');
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('ko-KR');
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Admin Settings</h1>
          <p className="text-white/60 mt-1">관리자 계정 관리</p>
        </div>

        {/* Add Admin Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            ➕ 관리자 추가
          </h2>
          <form onSubmit={handleAddAdmin} className="flex gap-3">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="이메일 주소 입력 (예: admin@example.com)"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              disabled={isAdding}
            />
            <button
              type="submit"
              disabled={isAdding}
              className="px-6 py-3 bg-green-500/80 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? '추가 중...' : '추가'}
            </button>
          </form>
        </div>

        {/* Admin List */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              👥 관리자 목록 ({admins.length})
            </h2>
            <button
              onClick={fetchAdmins}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm"
              disabled={loading}
            >
              {loading ? '로딩 중...' : '새로고침'}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-white/70">로딩 중...</p>
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/70">등록된 관리자가 없습니다.</p>
              <p className="text-white/50 text-sm mt-2">
                최초 관리자를 추가하려면 Firebase Console에서 직접 추가해주세요.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {admins.map((admin, index) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-4 bg-white/10 rounded-lg border border-white/20"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{admin.email}</p>
                      <p className="text-white/60 text-sm">
                        추가일: {formatDate(admin.addedAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                    disabled={admins.length <= 1}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    title={admins.length <= 1 ? '마지막 관리자는 삭제할 수 없습니다' : '관리자 삭제'}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">
            📝 사용 안내
          </h3>
          <ul className="space-y-2 text-white/80 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>관리자 이메일은 Google 계정 이메일과 정확히 일치해야 합니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>추가된 이메일 주소로 로그인하면 관리자 페이지에 접근할 수 있습니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>보안을 위해 최소 1명의 관리자는 항상 유지됩니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>최초 관리자는 Firebase Console에서 <code className="bg-white/10 px-1 rounded">admins</code> 컬렉션에 직접 추가해주세요.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
