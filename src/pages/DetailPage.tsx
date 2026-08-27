import React, { useState, useEffect } from 'react';
import { Media, Episode } from '../types';
import { useStore } from '../store/useStore';
import { getMediaDetails } from '../lib/supabase';
import { useCatalog } from '../lib/useCatalog';
import { MediaCard } from '../components/ui/MediaCard';
import { StarRating } from '../components/ui/StarRating';
import {
  FiPlay, FiHeart, FiStar, FiArrowRight, FiEye, FiCalendar,
  FiClock, FiGlobe, FiSend, FiEdit2, FiTrash2,
  FiThumbsUp, FiShare2, FiBookmark
} from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface DetailPageProps {
  media: Media;
  onBack: () => void;
  onPlay: (media: Media, episodeId?: number, seasonId?: number) => void;
  onMediaClick: (media: Media) => void;
}

const TYPE_LABELS: Record<string, string> = {
  movie: 'فيلم', series: 'مسلسل', anime: 'أنمي'
};
const TYPE_COLORS: Record<string, string> = {
  movie: 'bg-blue-600', series: 'bg-purple-600', anime: 'bg-pink-600'
};

export const DetailPage: React.FC<DetailPageProps> = ({
  media, onBack, onPlay, onMediaClick
}) => {
  const {
    isFavorite, toggleFavorite, isAuthenticated,
    ratings, setRating, getComments, addComment, deleteComment, editComment,
    toggleLike, user
  } = useStore();

  const { media: allMedia } = useCatalog();
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [fullMedia, setFullMedia] = useState<Media>(media);
  const [commentText, setCommentText] = useState('');
  const [userRating, setUserRating] = useState(ratings[fullMedia.id] || 0);
  const [showAllDesc, setShowAllDesc] = useState(false);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'episodes' | 'comments'>('details');
  const [backdropLoaded, setBackdropLoaded] = useState(false);

  const isFav = isFavorite(fullMedia.id);
  const comments = getComments(fullMedia.id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setFullMedia(media);
    getMediaDetails(media).then(setFullMedia).catch(err => console.error('Failed to load media details', err));
  }, [media]);

  const handleRating = (r: number) => {
    if (!isAuthenticated) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }
    setRating(fullMedia.id, r);
    setUserRating(r);
    toast.success(`تم تقييمك بـ ${r} ${r === 1 ? 'نجمة' : 'نجوم'} ⭐`);
  };

  const handleFavorite = () => {
    if (!isAuthenticated) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }
    toggleFavorite(fullMedia.id);
    toast.success(isFav ? 'تمت الإزالة من المفضلة' : 'تمت الإضافة للمفضلة ❤️');
  };

  const handleAddComment = () => {
    if (!isAuthenticated) {
      toast.error('يجب تسجيل الدخول لإضافة تعليق');
      return;
    }
    if (!commentText.trim()) return;
    addComment(fullMedia.id, commentText.trim(), userRating || undefined);
    setCommentText('');
    toast.success('تم نشر التعليق 💬');
  };

  const handleEditComment = (id: number) => {
    if (!editText.trim()) return;
    editComment(id, editText.trim());
    setEditingComment(null);
    toast.success('تم تعديل التعليق');
  };

  const formatViews = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}م مشاهدة`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}ك مشاهدة`;
    return `${v} مشاهدة`;
  };

  const similar = allMedia
    .filter(m => m.id !== media.id && m.type === fullMedia.type)
    .filter(m => m.genres.some(g => fullMedia.genres.map(mg => mg.id).includes(g.id)))
    .slice(0, 12);

  const season = fullMedia.seasons?.[selectedSeason];

  const tabs: { id: 'details' | 'episodes' | 'comments'; label: string }[] = [
    { id: 'details', label: 'التفاصيل' },
    ...(fullMedia.seasons ? [{ id: 'episodes' as const, label: 'الحلقات' }] : []),
    { id: 'comments', label: `تعليقات (${comments.length})` },
  ];

  return (
    <div className="bg-black min-h-screen">
      {/* Backdrop */}
      <div className="relative overflow-hidden" style={{ height: '55vw', maxHeight: 260 }}>
        {!backdropLoaded && <div className="absolute inset-0 skeleton" />}
        <img
          src={fullMedia.backdrop}
          alt={fullMedia.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${backdropLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setBackdropLoaded(true)}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,1) 100%)' }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />

        {/* Navigation */}
        <button
          onClick={onBack}
          className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center active:scale-90 transition-transform"
        >
          <FiArrowRight size={20} className="text-white" />
        </button>
        <button className="absolute top-4 left-4 w-10 h-10 rounded-full glass flex items-center justify-center active:scale-90 transition-transform">
          <FiShare2 size={17} className="text-white" />
        </button>
      </div>

      {/* Main content */}
      <div className="px-4 -mt-8 relative z-10 pb-8">

        {/* Poster + Info row */}
        <div className="flex gap-4 mb-5">
          {/* Poster */}
          <div
            className="flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            style={{ width: 105, height: 157 }}
          >
            <img
              src={fullMedia.poster}
              alt={fullMedia.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right info */}
          <div className="flex-1 pt-10">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-white font-black text-lg leading-tight flex-1">
                {fullMedia.titleAr || fullMedia.title}
              </h1>
            </div>
            {media.originalTitle && (
              <p className="text-gray-500 text-xs mt-0.5 mb-2">{media.originalTitle}</p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <FiStar size={13} className="text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 font-bold text-sm">{fullMedia.rating}</span>
              </div>
              <span className="text-gray-600 text-xs">({fullMedia.ratingCount.toLocaleString('ar-EG')})</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              <span className={`badge text-white ${TYPE_COLORS[fullMedia.type]}`}>{TYPE_LABELS[fullMedia.type]}</span>
              <span className="badge bg-white/10 text-gray-300">{fullMedia.year}</span>
              {fullMedia.duration && <span className="badge bg-white/10 text-gray-300">{fullMedia.duration} د</span>}
              {fullMedia.quality && <span className="badge bg-yellow-500 text-black">{fullMedia.quality}</span>}
              {fullMedia.status && (
                <span className={`badge text-white ${
                  fullMedia.status === 'ongoing' ? 'bg-green-600'
                  : fullMedia.status === 'completed' ? 'bg-blue-600'
                  : 'bg-orange-600'
                }`}>
                  {fullMedia.status === 'ongoing' ? 'مستمر' : fullMedia.status === 'completed' ? 'مكتمل' : 'قادم'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Genre chips */}
        <div className="flex gap-2 flex-wrap mb-4">
          {fullMedia.genres.map(g => (
            <span
              key={g.id}
              className="px-3 py-1 rounded-full text-xs font-semibold border text-gray-300 border-white/10"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              {g.nameAr}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div
          className="flex items-center gap-4 py-3 mb-4 rounded-2xl px-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-1.5">
            <FiEye size={13} className="text-gray-500" />
            <span className="text-gray-400 text-xs">{formatViews(fullMedia.views)}</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <FiCalendar size={13} className="text-gray-500" />
            <span className="text-gray-400 text-xs">{fullMedia.year}</span>
          </div>
          {fullMedia.language && (
            <>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <FiGlobe size={13} className="text-gray-500" />
                <span className="text-gray-400 text-xs">{fullMedia.language}</span>
              </div>
            </>
          )}
          {fullMedia.duration && (
            <>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <FiClock size={13} className="text-gray-500" />
                <span className="text-gray-400 text-xs">{fullMedia.duration} د</span>
              </div>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2.5 mb-5">
          <button
            onClick={() => onPlay(fullMedia)}
            className="flex-1 flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-2xl active:scale-95 transition-transform"
            style={{
              background: 'linear-gradient(135deg, #e50914 0%, #c0070e 100%)',
              boxShadow: '0 4px 20px rgba(229,9,20,0.35)',
            }}
          >
            <FiPlay className="fill-white" size={18} />
            <span className="text-base">شاهد الآن</span>
          </button>

          <button
            onClick={handleFavorite}
            className="w-14 flex items-center justify-center rounded-2xl border transition-all active:scale-90"
            style={{
              background: isFav ? 'rgba(229,9,20,0.15)' : 'rgba(255,255,255,0.05)',
              borderColor: isFav ? 'rgba(229,9,20,0.5)' : 'rgba(255,255,255,0.1)',
            }}
          >
            {isFav
              ? <FaHeart size={18} className="text-red-500" />
              : <FiHeart size={18} className="text-gray-400" />
            }
          </button>

          <button
            className="w-14 flex items-center justify-center rounded-2xl border transition-all active:scale-90"
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderColor: 'rgba(255,255,255,0.1)',
            }}
          >
            <FiBookmark size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 rounded-2xl p-1 mb-5"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
              style={{
                background: activeTab === tab.id ? '#e50914' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#6b7280',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== Tab: Details ===== */}
        {activeTab === 'details' && (
          <div>
            {/* Description */}
            <div className="mb-5">
              <h3 className="text-white font-bold text-sm mb-2">القصة</h3>
              <p className={`text-gray-300 text-sm leading-relaxed ${!showAllDesc ? 'line-clamp-3' : ''}`}>
                {fullMedia.description}
              </p>
              <button
                onClick={() => setShowAllDesc(!showAllDesc)}
                className="text-red-400 text-xs mt-1.5 font-semibold active:opacity-70"
              >
                {showAllDesc ? 'عرض أقل ▲' : 'عرض المزيد ▼'}
              </button>
            </div>

            {/* Director & Cast */}
            {(media.director || (media.cast && media.cast.length > 0)) && (
              <div
                className="rounded-2xl p-4 mb-5 space-y-3"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {media.director && (
                  <div>
                    <p className="text-gray-500 text-xs mb-1">الإخراج</p>
                    <p className="text-white text-sm font-semibold">{media.director}</p>
                  </div>
                )}
                {media.cast && media.cast.length > 0 && (
                  <div>
                    <p className="text-gray-500 text-xs mb-1">الممثلون</p>
                    <p className="text-gray-200 text-sm">{media.cast.join(' • ')}</p>
                  </div>
                )}
                {media.country && (
                  <div>
                    <p className="text-gray-500 text-xs mb-1">البلد</p>
                    <p className="text-gray-200 text-sm">{media.country}</p>
                  </div>
                )}
              </div>
            )}

            {/* User Rating */}
            <div
              className="rounded-2xl p-4 mb-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <p className="text-white font-bold text-sm mb-1">تقييمك</p>
              <p className="text-gray-500 text-xs mb-3">كيف تقيّم هذا المحتوى؟</p>
              <div className="flex items-center gap-3">
                <StarRating value={userRating} onChange={handleRating} size={30} />
                {userRating > 0 && (
                  <span className="text-yellow-400 font-black text-lg">{userRating}/5</span>
                )}
              </div>
            </div>

            {/* Similar Content */}
            {similar.length > 0 && (
              <div>
                <h3 className="text-white font-bold text-base mb-3">محتوى مشابه</h3>
                <div className="scroll-x">
                  {similar.map(item => (
                    <MediaCard key={item.id} media={item} onClick={onMediaClick} size="md" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== Tab: Episodes ===== */}
        {activeTab === 'episodes' && fullMedia.seasons && (
          <div>
            {/* Season tabs */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
              {fullMedia.seasons.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSeason(i)}
                  className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
                  style={{
                    background: selectedSeason === i ? '#e50914' : 'rgba(255,255,255,0.05)',
                    color: selectedSeason === i ? '#fff' : '#9ca3af',
                    border: `1px solid ${selectedSeason === i ? '#e50914' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  {s.title}
                </button>
              ))}
            </div>

            {/* Episode count */}
            {season && (
              <p className="text-gray-500 text-xs mb-3">{season.episodes.length} حلقة</p>
            )}

            {/* Episodes */}
            {season && (
              <div className="space-y-2">
                {season.episodes.map((ep: Episode) => (
                  <button
                    key={ep.id}
                    onClick={() => onPlay(fullMedia, ep.id, season.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl text-right transition-all active:scale-98"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    {/* Ep thumbnail/number */}
                    <div
                      className="flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center relative"
                      style={{ width: 85, height: 52, background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}
                    >
                      <div className="text-center">
                        <FiPlay size={18} className="text-gray-600 mx-auto" />
                        <span className="text-gray-600 text-xs">{ep.number}</span>
                      </div>
                      {ep.watchProgress && ep.watchProgress > 0 && (
                        <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gray-700">
                          <div className="h-full bg-red-500" style={{ width: `${ep.watchProgress}%` }} />
                        </div>
                      )}
                    </div>

                    {/* Episode info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold">الحلقة {ep.number}</p>
                      {ep.description && (
                        <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">{ep.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <FiClock size={10} className="text-gray-600" />
                        <span className="text-gray-600 text-xs">{ep.duration} دقيقة</span>
                        {ep.watched && (
                          <span className="text-green-400 text-xs">✓ مشاهد</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== Tab: Comments ===== */}
        {activeTab === 'comments' && (
          <div>
            {/* Add comment */}
            {isAuthenticated ? (
              <div
                className="rounded-2xl p-4 mb-5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                    style={{ background: 'linear-gradient(135deg, #e50914, #c0070e)' }}>
                    {user?.name?.[0]}
                  </div>
                  <p className="text-white text-sm font-bold">{user?.name}</p>
                </div>
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="شارك رأيك..."
                  rows={3}
                  className="w-full rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm outline-none resize-none transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontFamily: 'Cairo, sans-serif',
                    direction: 'rtl',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(229,9,20,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">تقييمك:</span>
                    <StarRating value={userRating} onChange={r => { handleRating(r); }} size={16} />
                  </div>
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform disabled:opacity-40"
                    style={{ background: '#e50914', color: '#fff' }}
                  >
                    <FiSend size={13} />
                    <span>نشر</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="rounded-2xl p-5 mb-5 text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="text-3xl mb-2 block">💬</span>
                <p className="text-gray-400 text-sm mb-3">سجل دخولك لإضافة تعليق</p>
              </div>
            )}

            {/* Comments list */}
            {comments.length === 0 ? (
              <div className="py-12 text-center">
                <span className="text-5xl block mb-3">💬</span>
                <p className="text-gray-500 text-sm">لا توجد تعليقات بعد</p>
                <p className="text-gray-700 text-xs mt-1">كن أول من يعلّق</p>
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map(comment => (
                  <div
                    key={comment.id}
                    className="rounded-2xl p-4"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white"
                          style={{ background: 'linear-gradient(135deg, #7c3aed, #e50914)' }}
                        >
                          {comment.userName[0]}
                        </div>
                        <div>
                          <p className="text-white text-sm font-bold">{comment.userName}</p>
                          <p className="text-gray-600 text-xs">
                            {new Date(comment.createdAt).toLocaleDateString('ar-EG', {
                              year: 'numeric', month: 'short', day: 'numeric'
                            })}
                            {comment.updatedAt && ' · معدّل'}
                          </p>
                        </div>
                      </div>
                      {comment.rating && (
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FiStar
                              key={i}
                              size={10}
                              className={i < comment.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Comment text */}
                    {editingComment === comment.id ? (
                      <div>
                        <textarea
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          rows={2}
                          className="w-full rounded-xl px-3 py-2 text-white text-sm outline-none resize-none"
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(229,9,20,0.4)',
                            fontFamily: 'Cairo, sans-serif',
                            direction: 'rtl',
                          }}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleEditComment(comment.id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white"
                            style={{ background: '#e50914' }}
                          >
                            حفظ
                          </button>
                          <button
                            onClick={() => setEditingComment(null)}
                            className="text-gray-500 text-xs"
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-300 text-sm leading-relaxed">{comment.text}</p>
                    )}

                    {/* Footer actions */}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                      <button
                        onClick={() => toggleLike(comment.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold transition-colors active:scale-110"
                        style={{ color: comment.liked ? '#e50914' : '#6b7280' }}
                      >
                        <FiThumbsUp size={13} />
                        <span>{comment.likes > 0 ? comment.likes : ''}</span>
                      </button>

                      {user?.id === comment.userId && !editingComment && (
                        <>
                          <button
                            onClick={() => { setEditingComment(comment.id); setEditText(comment.text); }}
                            className="text-gray-600 active:text-gray-300 transition-colors"
                          >
                            <FiEdit2 size={13} />
                          </button>
                          <button
                            onClick={() => {
                              deleteComment(comment.id);
                              toast.success('تم حذف التعليق');
                            }}
                            className="text-gray-600 active:text-red-400 transition-colors"
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
