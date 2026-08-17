import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Film,
  Tv,
  Clock,
  CheckCircle2,
  AlertCircle,
  Check,
  SlidersHorizontal,
  Star,
  Film as FilmIcon,
  Library
} from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import MediaCard from '../components/MediaCard';
import AddMediaModal from '../components/AddMediaModal';
import EmptyState from '../components/EmptyState';

const Dashboard = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Unwatched'); // 'Unwatched' (To Watch) or 'Watched'
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL', 'Movie', 'TV'
  const [sortBy, setSortBy] = useState('newest');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('media/');
      setMediaList(response.data);
    } catch (err) {
      console.error('Error fetching media:', err);
      setError('Could not load watchlist. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleAddMedia = async (newItemData) => {
    const response = await api.post('media/', newItemData);
    setMediaList((prev) => [response.data, ...prev]);
    showToast(`Added "${response.data.title}"`);
  };

  const handleMarkAsWatched = async (id) => {
    try {
      const response = await api.patch(`media/${id}/`, {
        status: 'Watched',
        rating: 5,
      });
      setMediaList((prev) =>
        prev.map((item) => (item.id === id ? response.data : item))
      );
      showToast(`Marked "${response.data.title}" as watched`);
    } catch (err) {
      console.error('Failed to mark as watched:', err);
      showToast('Error updating status.');
    }
  };

  const handleUpdateRating = async (id, newRating) => {
    try {
      const response = await api.patch(`media/${id}/`, {
        rating: newRating,
      });
      setMediaList((prev) =>
        prev.map((item) => (item.id === id ? response.data : item))
      );
      showToast(`Rated "${response.data.title}" ${newRating}/5`);
    } catch (err) {
      console.error('Failed to update rating:', err);
      showToast('Error saving rating.');
    }
  };

  const handleDeleteMedia = async (id, title) => {
    if (!window.confirm(`Remove "${title}" from your list?`)) {
      return;
    }

    try {
      await api.delete(`media/${id}/`);
      setMediaList((prev) => prev.filter((item) => item.id !== id));
      showToast(`Removed "${title}"`);
    } catch (err) {
      console.error('Failed to delete media:', err);
      showToast('Error removing item.');
    }
  };

  const stats = useMemo(() => {
    const total = mediaList.length;
    const toWatch = mediaList.filter((m) => m.status === 'Unwatched').length;
    const watched = mediaList.filter((m) => m.status === 'Watched').length;
    const ratedItems = mediaList.filter((m) => m.status === 'Watched' && m.rating);
    const avgRating = ratedItems.length
      ? (ratedItems.reduce((acc, curr) => acc + curr.rating, 0) / ratedItems.length).toFixed(1)
      : null;

    return { total, toWatch, watched, avgRating };
  }, [mediaList]);

  const filteredAndSortedMedia = useMemo(() => {
    let result = mediaList.filter((item) => {
      const matchesTab = item.status === activeTab;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
      return matchesTab && matchesSearch && matchesType;
    });

    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'year') return (b.year || 0) - (a.year || 0);
      return 0;
    });

    return result;
  }, [mediaList, activeTab, searchQuery, typeFilter, sortBy]);

  return (
    <div className="dashboard-layout">
      <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

      {toastMessage && (
        <div className="toast-notification">
          <Check size={15} />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="dashboard-content">
        <div className="dashboard-container">
          {/* Stats Row */}
          <div className="stats-overview-grid">
            <div className="stat-card">
              <div className="stat-icon-box stat-icon-blue">
                <Library size={18} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Total Titles</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-box stat-icon-purple">
                <Clock size={18} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.toWatch}</span>
                <span className="stat-label">To Watch</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-box stat-icon-green">
                <CheckCircle2 size={18} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.watched}</span>
                <span className="stat-label">Watched</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-box stat-icon-gold">
                <Star size={18} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.avgRating ? `${stats.avgRating} / 5` : '—'}</span>
                <span className="stat-label">Avg Rating</span>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="dashboard-header-panel">
            {/* Tabs */}
            <div className="tab-navigation">
              <button
                className={`tab-button ${activeTab === 'Unwatched' ? 'active' : ''}`}
                onClick={() => setActiveTab('Unwatched')}
              >
                <Clock size={16} />
                <span>To Watch</span>
                <span className="tab-badge">{stats.toWatch}</span>
              </button>

              <button
                className={`tab-button ${activeTab === 'Watched' ? 'active' : ''}`}
                onClick={() => setActiveTab('Watched')}
              >
                <CheckCircle2 size={16} />
                <span>Watched</span>
                <span className="tab-badge">{stats.watched}</span>
              </button>
            </div>

            {/* Toolbar */}
            <div className="toolbar">
              <div className="search-bar">
                <Search size={15} className="search-icon" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'Unwatched' ? 'to watch' : 'watched'} titles...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="toolbar-controls-right">
                <div className="type-filters">
                  <button
                    className={`filter-btn ${typeFilter === 'ALL' ? 'active' : ''}`}
                    onClick={() => setTypeFilter('ALL')}
                  >
                    All
                  </button>
                  <button
                    className={`filter-btn ${typeFilter === 'Movie' ? 'active' : ''}`}
                    onClick={() => setTypeFilter('Movie')}
                  >
                    Films
                  </button>
                  <button
                    className={`filter-btn ${typeFilter === 'TV' ? 'active' : ''}`}
                    onClick={() => setTypeFilter('TV')}
                  >
                    TV Shows
                  </button>
                </div>

                <div className="sort-selector-box">
                  <SlidersHorizontal size={13} />
                  <select
                    className="sort-dropdown"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Recently Added</option>
                    {activeTab === 'Watched' && <option value="rating">Highest Rated</option>}
                    <option value="title">Title (A-Z)</option>
                    <option value="year">Year</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Media Grid / Empty State */}
          {loading ? (
            <div className="dashboard-loading">
              <div className="spinner"></div>
              <p>Loading library...</p>
            </div>
          ) : filteredAndSortedMedia.length === 0 ? (
            <EmptyState
              activeTab={activeTab}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              hasFilter={Boolean(searchQuery || typeFilter !== 'ALL')}
            />
          ) : (
            <div className="media-grid">
              {filteredAndSortedMedia.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onMarkAsWatched={handleMarkAsWatched}
                  onUpdateRating={handleUpdateRating}
                  onDelete={handleDeleteMedia}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <AddMediaModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddMedia={handleAddMedia}
      />
    </div>
  );
};

export default Dashboard;
