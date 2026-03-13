"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Image as ImageIcon, FileText, Video, Music,
  Trash2, Edit3, Eye, EyeOff, X, Check, Search,
  FolderOpen, Download, Copy, CheckCircle, Filter,
  LayoutGrid, List, AlertCircle, RefreshCw,
} from "lucide-react";
import {
  fetchMediaFiles, uploadFile, updateMediaFile, deleteMediaFile, formatBytes,
  type MediaFile, type MediaCategory,
} from "@/lib/storage";

const CATEGORIES: { value: MediaCategory | "all"; label: string; icon: React.ElementType }[] = [
  { value: "all",       label: "All Files",  icon: FolderOpen },
  { value: "gallery",   label: "Gallery",    icon: ImageIcon },
  { value: "documents", label: "Documents",  icon: FileText },
  { value: "resources", label: "Resources",  icon: FolderOpen },
  { value: "speakers",  label: "Speakers",   icon: ImageIcon },
  { value: "sponsors",  label: "Sponsors",   icon: ImageIcon },
];

const TYPE_ICON: Record<string, React.ElementType> = {
  image: ImageIcon, video: Video, document: FileText, audio: Music,
};

const ACCEPT_MAP: Record<string, string> = {
  gallery:   "image/*,video/mp4,video/webm",
  documents: ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx",
  resources: "image/*,video/*,audio/*,.pdf",
  speakers:  "image/*",
  sponsors:  "image/*",
};

function MediaCard({ file, onDelete, onTogglePublish, onEdit, onCopy }: {
  file: MediaFile;
  onDelete: (f: MediaFile) => void;
  onTogglePublish: (f: MediaFile) => void;
  onEdit: (f: MediaFile) => void;
  onCopy: (url: string) => void;
}) {
  const Icon = TYPE_ICON[file.mediaType] ?? FileText;
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass rounded-xl overflow-hidden border border-white/5 group hover:border-[#C9921A]/30 transition-colors">
      {/* Preview */}
      <div className="relative h-40 bg-white/3 flex items-center justify-center overflow-hidden">
        {file.mediaType === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={file.publicUrl} alt={file.altText} className="w-full h-full object-cover" loading="lazy" />
        ) : file.mediaType === "video" ? (
          <video src={file.publicUrl} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <Icon className="w-10 h-10" />
            <span className="text-xs">{file.mimeType.split("/")[1]?.toUpperCase()}</span>
          </div>
        )}
        {/* Hover actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button onClick={() => window.open(file.publicUrl, "_blank")}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors" title="Open">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => onCopy(file.publicUrl)}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors" title="Copy URL">
            <Copy className="w-4 h-4" />
          </button>
          <button onClick={() => onEdit(file)}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors" title="Edit">
            <Edit3 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(file)}
            className="w-8 h-8 rounded-lg bg-red-500/30 hover:bg-red-500/50 flex items-center justify-center text-red-300 transition-colors" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        {/* Published badge */}
        <button onClick={() => onTogglePublish(file)}
          className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
            file.isPublished ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
          }`}>
          {file.isPublished ? "Published" : "Hidden"}
        </button>
      </div>
      {/* Info */}
      <div className="p-3">
        <p className="text-white text-xs font-semibold truncate" title={file.originalName}>{file.originalName}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-slate-500 text-[10px]">{formatBytes(file.sizeBytes)}</span>
          <span className="text-slate-600 text-[10px]">{new Date(file.createdAt).toLocaleDateString()}</span>
        </div>
        {file.caption && <p className="text-slate-400 text-[10px] mt-1 truncate" title={file.caption}>{file.caption}</p>}
      </div>
    </motion.div>
  );
}

function UploadZone({ category, onUploaded }: { category: MediaCategory; onUploaded: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFiles = async (files: FileList) => {
    const arr = Array.from(files);
    setUploading(true);
    setProgress([]);
    setErrors([]);
    for (const f of arr) {
      setProgress(p => [...p, `Uploading ${f.name}…`]);
      try {
        await uploadFile(f, category);
        setProgress(p => p.map(s => s.includes(f.name) ? `✓ ${f.name}` : s));
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setErrors(e => [...e, `${f.name}: ${msg}`]);
        setProgress(p => p.filter(s => !s.includes(f.name)));
      }
    }
    setUploading(false);
    onUploaded();
    setTimeout(() => { setProgress([]); setErrors([]); }, 3000);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          dragging ? "border-[#C9921A] bg-[#C9921A]/5" : "border-white/10 hover:border-[#C9921A]/40 hover:bg-white/2"
        } ${uploading ? "opacity-75 cursor-not-allowed" : ""}`}
      >
        <input ref={inputRef} type="file" multiple accept={ACCEPT_MAP[category]} className="hidden"
          onChange={e => e.target.files && handleFiles(e.target.files)} />
        <Upload className={`w-10 h-10 mx-auto mb-3 ${dragging ? "text-[#C9921A]" : "text-slate-500"}`} />
        <p className="text-white text-sm font-semibold mb-1">
          {uploading ? "Uploading…" : "Drop files here or click to browse"}
        </p>
        <p className="text-slate-500 text-xs">
          {category === "gallery" && "Images (JPG, PNG, WebP, GIF) and Videos (MP4, WebM) · Max 50 MB each"}
          {category === "documents" && "PDF, Word, PowerPoint, Excel · Max 50 MB each"}
          {category === "speakers" && "Images only (JPG, PNG, WebP) · Max 10 MB each"}
          {category === "resources" && "Images, Videos, Audio, PDF · Max 50 MB each"}
          {category === "sponsors" && "Images only (JPG, PNG, WebP) · Max 50 MB each"}
        </p>
      </div>

      {/* Progress */}
      {(progress.length > 0 || errors.length > 0) && (
        <div className="mt-3 space-y-1.5">
          {progress.map((p, i) => (
            <div key={i} className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
              p.startsWith("✓") ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-slate-400"
            }`}>
              {p.startsWith("✓") ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> : <div className="w-3.5 h-3.5 border border-slate-500 border-t-[#C9921A] rounded-full animate-spin flex-shrink-0" />}
              {p}
            </div>
          ))}
          {errors.map((e, i) => (
            <div key={i} className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-red-500/10 text-red-400">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{e}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MediaLibraryPage() {
  const [files, setFiles]             = useState<MediaFile[]>([]);
  const [loading, setLoading]         = useState(true);
  const [activeCategory, setActiveCategory] = useState<MediaCategory | "all">("all");
  const [search, setSearch]           = useState("");
  const [viewMode, setViewMode]       = useState<"grid" | "list">("grid");
  const [showUpload, setShowUpload]   = useState(false);
  const [uploadCat, setUploadCat]     = useState<MediaCategory>("gallery");
  const [editFile, setEditFile]       = useState<MediaFile | null>(null);
  const [editAlt, setEditAlt]         = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [copied, setCopied]           = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<MediaFile | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const cat = activeCategory === "all" ? undefined : activeCategory;
      setFiles(await fetchMediaFiles(cat));
    } finally { setLoading(false); }
  }, [activeCategory]);

  useEffect(() => { load(); }, [load]);

  const filtered = files.filter(f =>
    f.originalName.toLowerCase().includes(search.toLowerCase()) ||
    f.caption.toLowerCase().includes(search.toLowerCase()) ||
    f.altText.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTogglePublish = async (f: MediaFile) => {
    await updateMediaFile(f.id, { isPublished: !f.isPublished });
    setFiles(prev => prev.map(x => x.id === f.id ? { ...x, isPublished: !x.isPublished } : x));
  };

  const handleDelete = async (f: MediaFile) => {
    await deleteMediaFile(f.id, f.bucketName, f.filePath);
    setFiles(prev => prev.filter(x => x.id !== f.id));
    setDeleteConfirm(null);
  };

  const handleSaveEdit = async () => {
    if (!editFile) return;
    await updateMediaFile(editFile.id, { altText: editAlt, caption: editCaption });
    setFiles(prev => prev.map(x => x.id === editFile.id ? { ...x, altText: editAlt, caption: editCaption } : x));
    setEditFile(null);
  };

  const totalSize = files.reduce((s, f) => s + f.sizeBytes, 0);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-[#C9921A]" /> Media Library
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {files.length} files · {formatBytes(totalSize)} used
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => load()} className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setShowUpload(!showUpload)}
            className="flex items-center gap-2 btn-gold px-4 py-2 rounded-xl text-sm font-bold">
            <Upload className="w-4 h-4" />
            Upload Files
          </button>
        </div>
      </div>

      {/* Upload Panel */}
      <AnimatePresence>
        {showUpload && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="glass rounded-2xl p-6 border border-[#C9921A]/20 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold">Upload to</h3>
                <button onClick={() => setShowUpload(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.filter(c => c.value !== "all").map(c => (
                  <button key={c.value} onClick={() => setUploadCat(c.value as MediaCategory)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                      uploadCat === c.value ? "btn-gold" : "glass text-slate-300 hover:text-white"
                    }`}>
                    <c.icon className="w-4 h-4" />{c.label}
                  </button>
                ))}
              </div>
              <UploadZone category={uploadCat} onUploaded={() => { load(); }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Category tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 flex-1">
          {CATEGORIES.map(c => (
            <button key={c.value} onClick={() => setActiveCategory(c.value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${
                activeCategory === c.value ? "bg-[#C9921A]/15 text-[#F5B730] border border-[#C9921A]/20" : "glass text-slate-400 hover:text-white"
              }`}>
              <c.icon className="w-3.5 h-3.5" />{c.label}
              {c.value !== "all" && (
                <span className="text-[10px] text-slate-500">
                  {files.filter(f => f.category === c.value).length}
                </span>
              )}
            </button>
          ))}
        </div>
        {/* Search & view toggle */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files…"
              className="w-48 bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9921A]/50" />
          </div>
          <button onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-colors">
            {viewMode === "grid" ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Copied toast */}
      <AnimatePresence>
        {copied && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl">
            <Check className="w-4 h-4" /> URL copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Grid / List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-[#C9921A]/30 border-t-[#C9921A] rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No files found. Upload some files to get started.</p>
        </div>
      ) : viewMode === "grid" ? (
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence>
            {filtered.map(f => (
              <MediaCard key={f.id} file={f}
                onDelete={f => setDeleteConfirm(f)}
                onTogglePublish={handleTogglePublish}
                onEdit={f => { setEditFile(f); setEditAlt(f.altText); setEditCaption(f.caption); }}
                onCopy={handleCopy}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="space-y-1.5">
          {filtered.map(f => {
            const Icon = TYPE_ICON[f.mediaType] ?? FileText;
            return (
              <div key={f.id} className="glass rounded-xl px-4 py-3 flex items-center gap-4 border border-white/5 hover:border-white/10 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {f.mediaType === "image"
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={f.publicUrl} alt="" className="w-full h-full object-cover" />
                    : <Icon className="w-5 h-5 text-slate-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{f.originalName}</p>
                  <p className="text-slate-500 text-xs">{formatBytes(f.sizeBytes)} · {f.category} · {new Date(f.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${f.isPublished ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                  {f.isPublished ? "Published" : "Hidden"}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleCopy(f.publicUrl)} className="p-1.5 hover:text-[#C9921A] text-slate-400 transition-colors" title="Copy URL"><Copy className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleTogglePublish(f)} className="p-1.5 hover:text-white text-slate-400 transition-colors" title="Toggle visibility">{f.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
                  <button onClick={() => { setEditFile(f); setEditAlt(f.altText); setEditCaption(f.caption); }} className="p-1.5 hover:text-[#C9921A] text-slate-400 transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteConfirm(f)} className="p-1.5 hover:text-red-400 text-slate-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editFile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass rounded-2xl p-6 w-full max-w-md border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold">Edit File</h3>
                <button onClick={() => setEditFile(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              {editFile.mediaType === "image" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={editFile.publicUrl} alt={editFile.altText} className="w-full h-40 object-cover rounded-xl" />
              )}
              <div>
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Alt Text</label>
                <input value={editAlt} onChange={e => setEditAlt(e.target.value)} placeholder="Describe the image…"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9921A]/60" />
              </div>
              <div>
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Caption</label>
                <input value={editCaption} onChange={e => setEditCaption(e.target.value)} placeholder="Optional caption…"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9921A]/60" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditFile(null)} className="flex-1 glass py-2.5 rounded-xl text-sm text-slate-300 hover:text-white">Cancel</button>
                <button onClick={handleSaveEdit} className="flex-1 btn-gold py-2.5 rounded-xl text-sm font-bold">Save Changes</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass rounded-2xl p-6 w-full max-w-sm border border-red-500/20 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold mb-1">Delete File?</h3>
                <p className="text-slate-400 text-sm">
                  <span className="text-white font-medium">{deleteConfirm.originalName}</span> will be permanently deleted from storage. This cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 glass py-2.5 rounded-xl text-sm text-slate-300 hover:text-white">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-bold transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
