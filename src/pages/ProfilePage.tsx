import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { allMedia } from '../data/mockData';
import { Media } from '../types';
import {
  FiEdit2, FiLogOut, FiHeart, FiClock, FiStar,
  FiChevronLeft, FiShield, FiBell, FiGlobe,
  FiInfo, FiUser, FiCheck
} from 'react-icons/fi';
import { MdMovieFilter, MdOutlineSmartDisplay } from 'react-icons/md';
import toast from 'react-hot-toast';

interface ProfilePageProps {
  onMediaClick: (media: Media) => void;
}

// ============ Auth Form ============
const AuthForm: React.FC = () => {
  const { login, register } = useStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) { toast.error('الرجاء ملء جميع الحقول'); return; }
    if (!emailRegex.test(email)) { toast.error('البريد الإلكتروني غير صحيح'); return; }
    if (password.length < 6) { toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return; }
    if (mode === 'register' && !name.trim()) { toast.error('الرجاء إدخال الاسم'); return; }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        toast.success('مرحباً بك في YUKI! 🎬');
      } else {
        await register(name.trim(), email, password);
        toast.success('تم إنشاء حسابك بنجاح! 🎉');
      }
    } catch {
      toast.error('حدث خطأ، حاول مجدداً');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: 'Cairo, Tajawal, sans-serif',
    direction: 'rtl',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: '14px 16px',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s',
  };

  return (
    <div className="bg-black min-h-screen flex flex-col">
      {/* Top gradient */}
      <div className="absolute top-0 inset-x-0 h-64 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(229,9,20,0.12) 0%, transparent 70%)' }}
      />

      <div className="flex-1 flex flex-col justify-center px-6 py-10 relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="text-6xl font-black mb-3 inline-block"
            style={{
              fontFamily: 'Cairo, sans-serif',
              background: 'linear-gradient(135deg, #e50914 0%, #ff6b6b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            YUKI
          </div>
          <p className="text-gray-500 text-sm">أفلام • مسلسلات • أنمي</p>
        </div>

        {/* Mode toggle */}
        <div
          className="flex rounded-2xl p-1 mb-6"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          {(['login', 'register'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200"
              style={{
                background: mode === m ? '#e50914' : 'transparent',
                color: mode === m ? '#fff' : '#6b7280',
              }}
            >
              {m === 'login' ? 'تسجيل الدخول' : 'حساب جديد'}
            </button>
          ))}
        </div>

        {/* Form fields */}
        <div className="space-y-3">
          {mode === 'register' && (
            <div>
              <label className="text-gray-400 text-xs mb-1.5 block font-semibold">الاسم الكامل</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="محمد أحمد"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(229,9,20,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          )}

          <div>
            <label className="text-gray-400 text-xs mb-1.5 block font-semibold">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              style={{ ...inputStyle, direction: 'ltr', textAlign: 'right' }}
              onFocus={e => e.target.style.borderColor = 'rgba(229,9,20,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1.5 block font-semibold">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(229,9,20,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs"
              >
                {showPass ? 'إخفاء' : 'إظهار'}
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 py-4 rounded-2xl font-black text-white text-base active:scale-95 transition-transform disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, #e50914 0%, #c0070e 100%)',
            boxShadow: '0 4px 20px rgba(229,9,20,0.3)',
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>جاري...</span>
            </div>
          ) : (
            mode === 'login' ? 'دخول' : 'إنشاء حساب'
          )}
        </button>

        {/* Features list */}
        <div className="mt-8 space-y-2">
          {[
            { icon: '🎬', text: 'مشاهدة الأفلام والمسلسلات' },
            { icon: '❤️', text: 'حفظ المفضلة على جميع أجهزتك' },
            { icon: '▶️', text: 'متابعة المشاهدة من حيث توقفت' },
            { icon: '⭐', text: 'تقييم وتعليق على المحتوى' },
          ].map(f => (
            <div key={f.text} className="flex items-center gap-3">
              <span className="text-base">{f.icon}</span>
              <span className="text-gray-400 text-sm">{f.text}</span>
            </div>
          ))}
        </div>

        <p className="text-gray-700 text-xs text-center mt-6">
          بالاستمرار أنت توافق على شروط الخدمة وسياسة الخصوصية
        </p>
      </div>
    </div>
  );
};

// ============ Setting Row ============
const SettingRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: string;
  badge?: string;
  onClick?: () => void;
  danger?: boolean;
}> = ({ icon, label, value, badge, onClick, danger }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between py-4 border-b border-white/5 active:bg-white/3 transition-colors text-right"
  >
    <div className="flex items-center gap-3">
      <div style={{ color: danger ? '#ef4444' : '#6b7280' }}>{icon}</div>
      <span className="font-semibold text-sm" style={{ color: danger ? '#f87171' : '#fff' }}>
        {label}
      </span>
      {badge && (
        <span className="badge text-white" style={{ background: '#e50914', fontSize: 9 }}>{badge}</span>
      )}
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-gray-500 text-xs">{value}</span>}
      <FiChevronLeft className="text-gray-700" size={14} />
    </div>
  </button>
);

// ============ Profile Page ============
export const ProfilePage: React.FC<ProfilePageProps> = ({ onMediaClick }) => {
  const { user, isAuthenticated, logout, watchProgress, favorites, ratings, updateProfile } = useStore();
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(user?.name ?? '');

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  const watchedCount = watchProgress.length;
  const favCount = favorites.length;
  const ratingCount = Object.keys(ratings).length;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? 'YK';
  const joinDate = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })
    : '';

  const watchedMedia = watchProgress
    .slice(-8)
    .map(p => allMedia.find(m => m.id === p.mediaId))
    .filter(Boolean) as Media[];

  const handleSave = () => {
    if (!newName.trim()) return;
    updateProfile({ name: newName.trim() });
    setEditMode(false);
    toast.success('تم تحديث الاسم ✅');
  };

  const handleLogout = () => {
    logout();
    toast.success('تم تسجيل الخروج 👋');
  };

  // Color based on initials
  const avatarGradients = [
    'linear-gradient(135deg, #e50914, #c0070e)',
    'linear-gradient(135deg, #7c3aed, #4f46e5)',
    'linear-gradient(135deg, #0ea5e9, #0284c7)',
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
  ];
  const avatarBg = avatarGradients[initials.charCodeAt(0) % avatarGradients.length];

  return (
    <div className="bg-black min-h-screen pb-28 overflow-x-hidden">
      {/* Header gradient */}
      <div
        className="absolute top-0 inset-x-0 h-72 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(229,9,20,0.12) 0%, transparent 70%)' }}
      />

      {/* Profile section */}
      <div className="relative z-10 flex flex-col items-center px-4 pt-10 pb-6">
        {/* Avatar */}
        <div className="relative mb-4">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-2xl"
            style={{ background: avatarBg, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
          >
            {initials}
          </div>
          <button
            onClick={() => { setEditMode(true); setNewName(user?.name ?? ''); }}
            className="absolute -bottom-1 -left-1 w-8 h-8 rounded-full flex items-center justify-center active:scale-90"
            style={{ background: '#1a1a1a', border: '2px solid #000' }}
          >
            <FiEdit2 size={13} className="text-gray-300" />
          </button>
        </div>

        {/* Name */}
        {editMode ? (
          <div className="flex items-center gap-2 mb-1">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="rounded-xl px-4 py-2 text-white text-center text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(229,9,20,0.5)',
                fontFamily: 'Cairo, sans-serif',
              }}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
            <button
              onClick={handleSave}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: '#e50914' }}
            >
              <FiCheck size={14} className="text-white" />
            </button>
            <button onClick={() => setEditMode(false)} className="text-gray-500 text-sm px-2">
              ✕
            </button>
          </div>
        ) : (
          <h2 className="text-white font-black text-xl mb-1">{user?.name}</h2>
        )}
        <p className="text-gray-500 text-sm mb-1">{user?.email}</p>
        {joinDate && <p className="text-gray-700 text-xs">عضو منذ {joinDate}</p>}

        {/* Stats */}
        <div
          className="flex w-full mt-5 rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {[
            { icon: FiHeart, label: 'مفضلة', value: favCount, color: '#e50914' },
            { icon: MdOutlineSmartDisplay, label: 'مشاهد', value: watchedCount, color: '#6366f1' },
            { icon: FiStar, label: 'تقييم', value: ratingCount, color: '#f59e0b' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="flex-1 flex flex-col items-center py-4"
              style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
            >
              <stat.icon size={18} style={{ color: stat.color }} className="mb-1" />
              <p className="text-white font-black text-xl">{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Watch History */}
      {watchedMedia.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 px-4 mb-3">
            <FiClock size={14} className="text-gray-500" />
            <h3 className="text-white font-bold text-sm">آخر المشاهدات</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2">
            {watchedMedia.map(m => {
              const prog = watchProgress.find(p => p.mediaId === m.id);
              return (
                <div
                  key={m.id}
                  className="flex-shrink-0 cursor-pointer active:scale-95 transition-transform"
                  style={{ width: 85 }}
                  onClick={() => onMediaClick(m)}
                >
                  <div className="relative rounded-xl overflow-hidden mb-1" style={{ aspectRatio: '2/3' }}>
                    <img
                      src={m.poster}
                      alt={m.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {prog && prog.progress > 0 && (
                      <div className="absolute bottom-0 inset-x-0 h-1 bg-gray-800">
                        <div className="h-full bg-red-500" style={{ width: `${prog.progress}%` }} />
                      </div>
                    )}
                  </div>
                  <p className="text-gray-300 text-xs line-clamp-2 leading-tight">{m.titleAr ?? m.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="px-4 space-y-3">
        {/* Account */}
        <div
          className="rounded-2xl px-4 overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-gray-600 text-xs font-bold py-3 uppercase tracking-wider">الحساب</p>
          <SettingRow icon={<FiUser size={17} />} label="معلوماتي" value={user?.email?.split('@')[0]} />
          <SettingRow icon={<FiHeart size={17} />} label="المفضلة" value={`${favCount} عنصر`} />
          <SettingRow icon={<MdMovieFilter size={17} />} label="سجل المشاهدة" value={`${watchedCount} محتوى`} />
          <SettingRow icon={<FiStar size={17} />} label="تقييماتي" value={`${ratingCount} تقييم`} />
        </div>

        {/* Preferences */}
        <div
          className="rounded-2xl px-4 overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-gray-600 text-xs font-bold py-3 uppercase tracking-wider">التفضيلات</p>
          <SettingRow icon={<FiShield size={17} />} label="الخصوصية والأمان" />
          <SettingRow icon={<FiBell size={17} />} label="الإشعارات" />
          <SettingRow icon={<FiGlobe size={17} />} label="اللغة" value="العربية" />
          <SettingRow icon={<FiInfo size={17} />} label="عن التطبيق" value="YUKI v1.0" badge="جديد" />
        </div>

        {/* Logout */}
        <div
          className="rounded-2xl px-4 overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <SettingRow
            icon={<FiLogOut size={17} />}
            label="تسجيل الخروج"
            onClick={handleLogout}
            danger
          />
        </div>

        {/* Footer */}
        <div className="pt-2 pb-4 text-center">
          <p className="text-gray-700 text-xs">YUKI © 2024 · جميع الحقوق محفوظة</p>
          <p className="text-gray-800 text-xs mt-1">صُنع بـ ❤️ من أجلك</p>
        </div>
      </div>
    </div>
  );
};
