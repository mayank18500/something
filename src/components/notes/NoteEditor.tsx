import React, { useState, useEffect, useCallback } from 'react';
import { X, Save, Hash, Sparkles } from 'lucide-react';
import { RichTextEditor } from '../editor/RichTextEditor';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface NoteEditorProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note;
  onSave: () => void;
}

export function NoteEditor({ isOpen, onClose, note, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { user, profile } = useAuth();

  useEffect(() => {
    if (isOpen) {
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setTags(note.tags);
      } else {
        setTitle('');
        setContent('');
        setTags([]);
      }
      setTagInput('');
      
      // Focus on title input when opened
      setTimeout(() => {
        const titleInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        titleInput?.focus();
      }, 100);
    }
  }, [note, isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!user || saving) return;
    
    if (!title.trim() && !content.trim()) {
      toast.error('Please add a title or content');
      return;
    }

    setSaving(true);
    try {
      if (note) {
        // Update existing note
        const { error } = await supabase
          .from('notes')
          .update({
            title: title.trim() || 'Untitled',
            content,
            tags,
            updated_at: new Date().toISOString(),
          })
          .eq('id', note.id);

        if (error) throw error;
        toast.success('Note updated successfully!');
      } else {
        // Create new note
        if (profile?.subscription_tier === 'free' && (profile?.notes_count || 0) >= 10) {
          toast.error('Free tier limit reached. Upgrade to Premium for unlimited notes!');
          setSaving(false);
          return;
        }

        const { error: noteError } = await supabase
          .from('notes')
          .insert({
            user_id: user.id,
            title: title.trim() || 'Untitled',
            content,
            tags,
          });

        if (noteError) throw noteError;

        // Update user's note count
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            notes_count: (profile?.notes_count || 0) + 1 
          })
          .eq('id', user.id);

        if (profileError) console.error('Error updating note count:', profileError);
        toast.success('Note created successfully!');
      }

      onSave();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const generateSummary = async () => {
    if (!content.trim() || generating) return;
    
    if (profile?.subscription_tier === 'free') {
      toast.error('AI features are available in Premium plan only!');
      return;
    }

    setGenerating(true);
    try {
      // This would integrate with OpenAI API
      // For now, we'll show a placeholder
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      toast.success('AI Summary feature coming soon! Upgrade to Premium to access.');
    } catch (error: any) {
      toast.error('Failed to generate summary');
    } finally {
      setGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {note ? 'Edit Note' : 'Create New Note'}
          </h2>
          <div className="flex items-center gap-2">
            {content.trim() && (
              <button
                onClick={generateSummary}
                disabled={generating}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
                aria-label="Generate AI summary"
              >
                <Sparkles className="h-4 w-4" />
                {generating ? 'Generating...' : 'AI Summary'}
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              aria-label="Save note"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close editor"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Enter note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl font-semibold border-none outline-none placeholder-gray-400"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Hash className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Add tags (press Enter or comma to add)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-600 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your note..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}