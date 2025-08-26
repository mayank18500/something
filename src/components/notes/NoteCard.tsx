import React, { useMemo, useCallback } from 'react';
import { Calendar, Edit, Trash2, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  // Memoize the HTML stripping function for better performance
  const stripHtml = useCallback((html: string) => {
    // Safer HTML stripping using DOMParser
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }, []);

  // Memoize the preview text to avoid recalculating on every render
  const preview = useMemo(() => {
    const stripped = stripHtml(note.content);
    return stripped.slice(0, 150) + (stripped.length > 150 ? '...' : '');
  }, [note.content, stripHtml]);

  // Memoize date formatting
  const formattedDate = useMemo(() => {
    try {
      return formatDistanceToNow(new Date(note.updated_at), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  }, [note.updated_at]);

  // Memoize tag rendering
  const tagElements = useMemo(() => {
    if (!note.tags || note.tags.length === 0) return null;
    
    return (
      <div className="flex items-center gap-2 mb-3">
        <Tag className="h-3 w-3 text-gray-400 flex-shrink-0" />
        <div className="flex flex-wrap gap-1">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }, [note.tags]);

  // Handle edit click
  const handleEdit = useCallback(() => {
    onEdit(note);
  }, [onEdit, note]);

  // Handle delete click with confirmation
  const handleDelete = useCallback(() => {
    if (window.confirm(`Are you sure you want to delete "${note.title || 'Untitled Note'}"?`)) {
      onDelete(note.id);
    }
  }, [onDelete, note.id, note.title]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-lg truncate flex-1 mr-2">
          {note.title || 'Untitled Note'}
        </h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-1 rounded hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            title="Edit note"
            aria-label={`Edit note: ${note.title || 'Untitled Note'}`}
          >
            <Edit className="h-4 w-4 text-gray-500" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 rounded hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            title="Delete note"
            aria-label={`Delete note: ${note.title || 'Untitled Note'}`}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {preview || 'No content'}
      </p>

      {tagElements}

      <div className="flex items-center text-xs text-gray-500">
        <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}