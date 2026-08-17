import React from 'react';
import { Film, Plus } from 'lucide-react';

const EmptyState = ({ activeTab, onOpenAddModal, hasFilter }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon-wrapper">
        <Film size={26} />
      </div>
      <h3 className="empty-title">
        {hasFilter
          ? 'No matching titles found'
          : activeTab === 'Unwatched'
          ? 'Your watchlist is empty'
          : 'No watched titles yet'}
      </h3>
      <p className="empty-description">
        {hasFilter
          ? 'Try adjusting your search query or filter.'
          : activeTab === 'Unwatched'
          ? 'Add films and series you want to watch to keep track of them here.'
          : 'Titles you mark as watched and rate will appear here.'}
      </p>
      {!hasFilter && (
        <button className="btn btn-primary" onClick={onOpenAddModal}>
          <Plus size={15} />
          <span>Add your first title</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
