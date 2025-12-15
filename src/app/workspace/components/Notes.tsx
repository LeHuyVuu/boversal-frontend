'use client';

import React, { useState, useEffect } from 'react';
import { Note, CreateNoteDto, UpdateNoteDto } from '@/types/note';
import { noteService } from '@/services/noteService';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Chip } from 'primereact/chip';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { useTheme } from '@/contexts/ThemeContext';
import './Notes.css';

const COLORS = [
  { label: 'White', value: '#FFFFFF' },
  { label: 'Pastel Yellow', value: '#FFF4D6' },
  { label: 'Pastel Orange', value: '#FFE4CC' },
  { label: 'Pastel Peach', value: '#FFD6E8' },
  { label: 'Pastel Pink', value: '#FFE1F4' },
  { label: 'Pastel Purple', value: '#E8DEFF' },
  { label: 'Pastel Blue', value: '#D6EBFF' },
  { label: 'Pastel Green', value: '#D6F5E8' },
  { label: 'Mint Green', value: '#D1F2EB' },
  { label: 'Light Gray', value: '#F0F0F0' },
];

const TEXT_COLORS = [
  { label: 'Black', value: '#000000' },
  { label: 'Gray', value: '#6B7280' },
  { label: 'Red', value: '#EF4444' },
  { label: 'Orange', value: '#F97316' },
  { label: 'Yellow', value: '#EAB308' },
  { label: 'Green', value: '#22C55E' },
  { label: 'Blue', value: '#3B82F6' },
  { label: 'Purple', value: '#A855F7' },
];

// Rich Text Editor Toolbar Component
interface EditorToolbarProps {
  editor: any;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="editor-toolbar">
      {/* Text Formatting */}
      <div className="toolbar-group">
        <Button
          icon="pi pi-bold"
          text
          severity={editor.isActive('bold') ? 'info' : 'secondary'}
          onClick={() => editor.chain().focus().toggleBold().run()}
          tooltip="Bold (Ctrl+B)"
          size="small"
        />
        <Button
          icon="pi pi-italic"
          text
          severity={editor.isActive('italic') ? 'info' : 'secondary'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          tooltip="Italic (Ctrl+I)"
          size="small"
        />
        <Button
          icon="pi pi-underline"
          text
          severity={editor.isActive('underline') ? 'info' : 'secondary'}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          tooltip="Underline (Ctrl+U)"
          size="small"
        />
        <Button
          icon="pi pi-minus"
          text
          severity={editor.isActive('strike') ? 'info' : 'secondary'}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          tooltip="Strikethrough"
          size="small"
        />
      </div>

      {/* Headings */}
      <div className="toolbar-group">
        <Button
          label="H1"
          text
          severity={editor.isActive('heading', { level: 1 }) ? 'info' : 'secondary'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          tooltip="Heading 1"
          size="small"
        />
        <Button
          label="H2"
          text
          severity={editor.isActive('heading', { level: 2 }) ? 'info' : 'secondary'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          tooltip="Heading 2"
          size="small"
        />
        <Button
          label="H3"
          text
          severity={editor.isActive('heading', { level: 3 }) ? 'info' : 'secondary'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          tooltip="Heading 3"
          size="small"
        />
        <Button
          label="P"
          text
          severity={editor.isActive('paragraph') ? 'info' : 'secondary'}
          onClick={() => editor.chain().focus().setParagraph().run()}
          tooltip="Paragraph"
          size="small"
        />
      </div>

      {/* Lists */}
      <div className="toolbar-group">
        <Button
          icon="pi pi-list"
          text
          severity={editor.isActive('bulletList') ? 'info' : 'secondary'}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          tooltip="Bullet List"
          size="small"
        />
        <Button
          icon="pi pi-sort-numeric-down"
          text
          severity={editor.isActive('orderedList') ? 'info' : 'secondary'}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          tooltip="Numbered List"
          size="small"
        />
      </div>

      {/* Alignment */}
      <div className="toolbar-group">
        <Button
          icon="pi pi-align-left"
          text
          severity={editor.isActive({ textAlign: 'left' }) ? 'info' : 'secondary'}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          tooltip="Align Left"
          size="small"
        />
        <Button
          icon="pi pi-align-center"
          text
          severity={editor.isActive({ textAlign: 'center' }) ? 'info' : 'secondary'}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          tooltip="Align Center"
          size="small"
        />
        <Button
          icon="pi pi-align-right"
          text
          severity={editor.isActive({ textAlign: 'right' }) ? 'info' : 'secondary'}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          tooltip="Align Right"
          size="small"
        />
        <Button
          icon="pi pi-align-justify"
          text
          severity={editor.isActive({ textAlign: 'justify' }) ? 'info' : 'secondary'}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          tooltip="Justify"
          size="small"
        />
      </div>

      {/* Text Color */}
      <div className="toolbar-group">
        {TEXT_COLORS.map((color) => (
          <button
            key={color.value}
            className="color-button"
            style={{ backgroundColor: color.value }}
            onClick={() => editor.chain().focus().setColor(color.value).run()}
            title={color.label}
          />
        ))}
      </div>

      {/* Clear Formatting */}
      <div className="toolbar-group">
        <Button
          icon="pi pi-times"
          text
          severity="secondary"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          tooltip="Clear Formatting"
          size="small"
        />
      </div>
    </div>
  );
};

export default function Notes() {
  const { theme } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Form state
  const [formData, setFormData] = useState<CreateNoteDto>({
    title: '',
    content: '',
    tags: [],
    isPinned: false,
    color: '#FFFFFF',
  });
  const [tagInput, setTagInput] = useState('');

  const toastRef = React.useRef<Toast>(null);

  // TipTap Editor
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: formData.content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[400px] p-4',
        style: 'color: #000000;',
      },
    },
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({
        ...prev,
        content: editor.getHTML(),
      }));
    },
  });

  useEffect(() => {
    loadNotes();
  }, []);

  // Only update editor content when dialog opens, not during editing
  useEffect(() => {
    if (editor && !editor.isDestroyed && showDialog) {
      editor.commands.setContent(formData.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDialog, editor]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await noteService.getNotes();
      setNotes(data);
    } catch (error) {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load notes',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = () => {
    setFormData({
      title: '',
      content: '<p></p>',
      tags: [],
      isPinned: false,
      color: '#FFFFFF',
    });
    setIsEditing(false);
    setSelectedNote(null);
    setShowDialog(true);
  };

  const handleEditNote = (note: Note) => {
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags || [],
      isPinned: note.isPinned || false,
      color: note.color || '#FFFFFF',
    });
    setIsEditing(true);
    setSelectedNote(note);
    setShowDialog(true);
  };

  const handleViewNote = (note: Note) => {
    setSelectedNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags || [],
      isPinned: note.isPinned || false,
      color: note.color || '#FFFFFF',
    });
    setIsEditing(false);
    setShowDialog(true);
  };

  const handleSaveNote = async () => {
    try {
      if (!formData.title.trim()) {
        toastRef.current?.show({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Please enter a title',
        });
        return;
      }

      if (isEditing && selectedNote) {
        const updated = await noteService.updateNote(selectedNote.id, formData);
        setNotes(notes.map((n) => (n.id === selectedNote.id ? updated : n)));
        toastRef.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Note updated successfully',
        });
      } else {
        const created = await noteService.createNote(formData);
        setNotes([created, ...notes]);
        toastRef.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Note created successfully',
        });
      }

      setShowDialog(false);
      setSelectedNote(null);
    } catch (error) {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save note',
      });
    }
  };

  const handleDeleteNote = (note: Note) => {
    confirmDialog({
      message: 'Are you sure you want to delete this note?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: async () => {
        try {
          await noteService.deleteNote(note.id);
          setNotes(notes.filter((n) => n.id !== note.id));
          toastRef.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Note deleted successfully',
          });
          if (selectedNote?.id === note.id) {
            setShowDialog(false);
            setSelectedNote(null);
          }
        } catch (error) {
          toastRef.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete note',
          });
        }
      },
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((tag) => tag !== tagToRemove) || [],
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadNotes();
      return;
    }

    try {
      const results = await noteService.searchNotes(searchQuery);
      setNotes(results);
    } catch (error) {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Search failed',
      });
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const filteredNotes = (notes || []).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const dialogFooter = (
    <div className="flex justify-content-end gap-2">
      {!isEditing && selectedNote ? (
        <>
          <Button
            label="Edit"
            icon="pi pi-pencil"
            onClick={() => {
              setIsEditing(true);
            }}
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            onClick={() => selectedNote && handleDeleteNote(selectedNote)}
          />
          <Button label="Close" icon="pi pi-times" outlined onClick={() => setShowDialog(false)} />
        </>
      ) : (
        <>
          <Button label="Cancel" icon="pi pi-times" outlined onClick={() => setShowDialog(false)} />
          <Button label="Save" icon="pi pi-check" onClick={handleSaveNote} />
        </>
      )}
    </div>
  );

  return (
    <div className={`notes-container ${
      theme === 'dark'
        ? 'bg-slate-900/50 text-white'
        : 'bg-gray-50 text-gray-900'
    }`}>
      <Toast ref={toastRef} />
      <ConfirmDialog />

      {/* Header */}
      <div className="notes-header">
        <h1 className="notes-title">
          <i className="pi pi-book mr-2"></i>
          My Notes
        </h1>

        <div className="notes-actions">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full"
            />
          </span>

          <Button
            icon={viewMode === 'grid' ? 'pi pi-list' : 'pi pi-th-large'}
            outlined
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            tooltip={viewMode === 'grid' ? 'List View' : 'Grid View'}
          />

          <Button
            label="New Note"
            icon="pi pi-plus"
            onClick={handleCreateNote}
          />
        </div>
      </div>

      {/* Notes Grid/List */}
      {loading ? (
        <div className="notes-loading">
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="notes-empty">
          <i className="pi pi-book" style={{ fontSize: '4rem', color: '#ccc' }}></i>
          <p>No notes yet</p>
          <Button label="Create your first note" icon="pi pi-plus" onClick={handleCreateNote} />
        </div>
      ) : (
        <div className={`notes-${viewMode}`}>
          {filteredNotes.map((note) => (
            <Card
              key={note.id}
              className={`note-card ${
                theme === 'dark'
                  ? 'bg-slate-800/60 border border-blue-500/20 hover:border-blue-500/40'
                  : 'bg-white border border-slate-200 hover:shadow-lg'
              }`}
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.6)' : (note.color || '#FFFFFF')
              }}
            >
              <div className="note-card-content">
                {note.isPinned && (
                  <i className="pi pi-bookmark-fill note-pinned-icon" title="Đã ghim"></i>
                )}
                <h3 className="note-card-title" onClick={() => handleViewNote(note)}>
                  {note.title}
                </h3>
                <div className="note-card-preview">
                  {stripHtml(note.content).substring(0, 150)}
                  {stripHtml(note.content).length > 150 && '...'}
                </div>
                {note.tags && note.tags.length > 0 && (
                  <div className="note-card-tags">
                    {note.tags.map((tag) => (
                      <Chip key={tag} label={tag} className="note-tag" />
                    ))}
                  </div>
                )}
                <div className="note-card-footer">
                  <small className="note-card-date">
                    {new Date(note.updatedAt).toLocaleDateString('vi-VN')}
                  </small>
                  <div className="note-card-actions">
                    <Button
                      icon="pi pi-eye"
                      text
                      rounded
                      onClick={() => handleViewNote(note)}
                      tooltip="View"
                    />
                    <Button
                      icon="pi pi-pencil"
                      text
                      rounded
                      onClick={() => handleEditNote(note)}
                      tooltip="Edit"
                    />
                    <Button
                      icon="pi pi-trash"
                      text
                      rounded
                      severity="danger"
                      onClick={() => handleDeleteNote(note)}
                      tooltip="Delete"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Note Dialog */}
      <Dialog
        header={isEditing || !selectedNote ? (isEditing ? 'Edit Note' : 'Create New Note') : formData.title}
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        footer={dialogFooter}
        className="note-dialog"
        style={{ width: '900px', maxWidth: '95vw', maxHeight: '95vh' }}
        contentStyle={{ overflowY: 'auto' }}
      >
        <div className="note-form">
          {isEditing || !selectedNote ? (
            <>
              <div className="field">
                <label htmlFor="title">Title *</label>
                <InputText
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full"
                  placeholder="Enter note title..."
                />
              </div>

              <div className="field">
                <label htmlFor="content">Content</label>
                <div className="editor-wrapper">
                  <EditorToolbar editor={editor} />
                  <EditorContent editor={editor} className="editor-content" />
                </div>
              </div>

              {formData.tags && formData.tags.length > 0 && (
                <div className="field">
                  <label htmlFor="tags">Thẻ</label>
                  <div className="flex gap-2 flex-wrap">
                    {formData.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        removable
                        onRemove={() => handleRemoveTag(tag)}
                        className="note-tag"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="field">
                <label htmlFor="color">Background Color</label>
                <Dropdown
                  id="color"
                  value={formData.color}
                  options={COLORS}
                  onChange={(e) => setFormData({ ...formData, color: e.value })}
                  className="w-full"
                  itemTemplate={(option) => (
                    <div className="flex align-items-center gap-2">
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: option.value,
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                        }}
                      ></div>
                      <span>{option.label}</span>
                    </div>
                  )}
                />
              </div>

              <div className="field-checkbox">
                <Checkbox
                  inputId="isPinned"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.checked || false })}
                />
                <label htmlFor="isPinned" className="ml-2">
                  Pin this note
                </label>
              </div>
            </>
          ) : (
            <div
              className="note-preview"
              style={{
                backgroundColor: formData.color
              }}
            >
              {formData.tags && formData.tags.length > 0 && (
                <div className="note-preview-tags mb-3">
                  {formData.tags.map((tag) => (
                    <Chip key={tag} label={tag} className="note-tag" />
                  ))}
                </div>
              )}
              <div
                className="note-preview-content"
                dangerouslySetInnerHTML={{ __html: formData.content }}
              />
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}
