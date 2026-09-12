'use client';

import React, { useState, useEffect } from 'react';
import { Notice, NoticeCategory, Department, TargetYear, TargetAudience } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNotices } from '../../context/NoticeContext';
import { ImageUploader } from '../common/ImageUploader';
import { X, Send, Save, AlertCircle } from 'lucide-react';

interface NoticeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editNotice?: Notice | null;
}

export const NoticeFormModal: React.FC<NoticeFormModalProps> = ({
  isOpen,
  onClose,
  editNotice,
}) => {
  const { currentUser } = useAuth();
  const { createNotice, updateNotice } = useNotices();

  const isEditing = !!editNotice;

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('Academic');
  const [department, setDepartment] = useState<Department>('CSE');
  const [year, setYear] = useState<TargetYear>('All Years');
  const [audience, setAudience] = useState<TargetAudience>('Everyone');
  const [expiryDate, setExpiryDate] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [tagsInput, setTagsInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default expiry to 30 days from today
  const getDefaultExpiry = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (editNotice) {
      setTitle(editNotice.title);
      setShortDescription(editNotice.shortDescription);
      setContent(editNotice.content);
      setCategory(editNotice.category);
      setDepartment(editNotice.department);
      setYear(editNotice.year);
      setAudience(editNotice.audience);
      setExpiryDate(editNotice.expiryDate);
      setImageUrl(editNotice.imageUrl);
      setTagsInput(editNotice.tags?.join(', ') || '');
    } else {
      setTitle('');
      setShortDescription('');
      setContent('');
      setCategory('Academic');
      setDepartment(currentUser?.department || 'CSE');
      setYear('All Years');
      setAudience('Everyone');
      setExpiryDate(getDefaultExpiry());
      setImageUrl(undefined);
      setTagsInput('');
    }
    setErrors({});
  }, [editNotice, isOpen, currentUser]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!title.trim()) {
      errs.title = 'Title is required.';
    } else if (title.trim().length < 6) {
      errs.title = 'Title must be at least 6 characters.';
    }

    if (!shortDescription.trim()) {
      errs.shortDescription = 'Short description is required.';
    } else if (shortDescription.trim().length < 15) {
      errs.shortDescription = 'Summary must be at least 15 characters.';
    }

    if (!content.trim()) {
      errs.content = 'Full announcement content is required.';
    }

    if (!expiryDate) {
      errs.expiryDate = 'Expiry date is required.';
    } else {
      const selected = new Date(expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today && !isEditing) {
        errs.expiryDate = 'Expiry date must be in the future.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (publishNow: boolean) => {
    if (!validate()) return;
    if (!currentUser) return;

    setIsSubmitting(true);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    if (isEditing && editNotice) {
      const success = await updateNotice(editNotice.id, {
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        content: content.trim(),
        category,
        department,
        year,
        audience,
        expiryDate,
        imageUrl,
        tags,
        isPublished: publishNow ? true : editNotice.isPublished,
      });
      setIsSubmitting(false);
      if (success) onClose();
    } else {
      const success = await createNotice({
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        content: content.trim(),
        category,
        department,
        year,
        audience,
        expiryDate,
        imageUrl,
        tags,
        isPinned: false,
        isPublished: publishNow,
        creator: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          role: currentUser.role,
          department: currentUser.department,
        },
      });
      setIsSubmitting(false);
      if (success) onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notice-form-title"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 id="notice-form-title" className="text-lg font-bold text-slate-900">
              {isEditing ? 'Edit Notice' : 'Post Campus Notice'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEditing
                ? 'Update announcement parameters and save changes.'
                : 'Publish an announcement or save it as a draft.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form className="p-6 overflow-y-auto space-y-4 flex-1" onSubmit={(e) => e.preventDefault()}>
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Notice Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Annual Tech Hackathon 2026 Registration"
              className={`block w-full px-3.5 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-red-300 text-red-900 focus:ring-red-400'
                  : 'border-slate-300 text-slate-900 focus:ring-blue-900'
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-600 font-medium">{errors.title}</p>}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Short Summary (Card Preview) *
            </label>
            <textarea
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="A brief 1-2 sentence overview visible on feed cards..."
              className={`block w-full px-3.5 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 ${
                errors.shortDescription
                  ? 'border-red-300 text-red-900 focus:ring-red-400'
                  : 'border-slate-300 text-slate-900 focus:ring-blue-900'
              }`}
            />
            {errors.shortDescription && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.shortDescription}</p>
            )}
          </div>

          {/* Full Content */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Full Announcement Content *
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detailed information, eligibility, venues, schedule, contact info..."
              className={`block w-full px-3.5 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 ${
                errors.content
                  ? 'border-red-300 text-red-900 focus:ring-red-400'
                  : 'border-slate-300 text-slate-900 focus:ring-blue-900'
              }`}
            />
            {errors.content && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.content}</p>
            )}
          </div>

          {/* Category & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="Academic">Academic</option>
                <option value="Events">Events</option>
                <option value="Internships">Internships</option>
                <option value="Competitions">Competitions</option>
                <option value="Clubs">Clubs</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="All Departments">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Biotechnology">Biotechnology</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Year & Audience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Target Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value as TargetYear)}
                className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="All Years">All Years</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Target Audience
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as TargetAudience)}
                className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="Everyone">Everyone</option>
                <option value="Students">Students Only</option>
                <option value="Faculty">Faculty Only</option>
              </select>
            </div>
          </div>

          {/* Expiry Date & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Expiry Date *
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className={`block w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.expiryDate
                    ? 'border-red-300 text-red-900 focus:ring-red-400'
                    : 'border-slate-300 text-slate-900 focus:ring-blue-900'
                }`}
              />
              {errors.expiryDate && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.expiryDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="ai, hackathon, workshop"
                className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>
          </div>

          {/* Image Upload Component */}
          <div className="pt-2">
            <ImageUploader currentImageUrl={imageUrl} onImageChange={setImageUrl} />
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2.5">
            {!isEditing && (
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Draft</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors focus:ring-2 focus:ring-blue-500 flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving...' : isEditing ? 'Update Notice' : 'Publish Notice'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
