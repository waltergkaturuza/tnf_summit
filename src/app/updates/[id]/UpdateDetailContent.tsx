"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import EventCountdown from "@/components/EventCountdown";
import {
  ArrowLeft, Calendar, FolderOpen, ExternalLink, ThumbsUp, ThumbsDown,
  MessageCircle, Send, User, UserX, MapPin, FileDown,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Update, UpdateComment, UpdateAttachment } from "@/lib/adminData";
import {
  fetchUpdateComments,
  insertUpdateComment,
  getUpdateReactionCounts,
  setUpdateReaction,
} from "@/lib/db";

const VOTER_KEY_STORAGE = "tnf_voter_id";

function getOrCreateVoterKey(): string {
  if (typeof window === "undefined") return "";
  let key = localStorage.getItem(VOTER_KEY_STORAGE);
  if (!key) {
    key = "v_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(VOTER_KEY_STORAGE, key);
  }
  return key;
}

export default function UpdateDetailContent({ update, attachments = [] }: { update: Update; attachments?: UpdateAttachment[] }) {
  const { t } = useLanguage();
  const [comments, setComments] = useState<UpdateComment[]>([]);
  const [reaction, setReaction] = useState<{ likes: number; dislikes: number; userReaction: "like" | "dislike" | null }>({ likes: 0, dislikes: 0, userReaction: null });
  const [loadingReaction, setLoadingReaction] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentAnonymous, setCommentAnonymous] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [voterKey, setVoterKey] = useState("");

  const loadComments = useCallback(async () => {
    const list = await fetchUpdateComments(update.id);
    setComments(list);
  }, [update.id]);

  const loadReactions = useCallback(async () => {
    const key = getOrCreateVoterKey();
    setVoterKey(key);
    const counts = await getUpdateReactionCounts(update.id, key);
    setReaction({ likes: counts.likes, dislikes: counts.dislikes, userReaction: counts.userReaction });
  }, [update.id]);

  useEffect(() => {
    loadComments();
    loadReactions();
  }, [loadComments, loadReactions]);

  const handleLike = async () => {
    const key = getOrCreateVoterKey();
    if (!key) return;
    setLoadingReaction(true);
    try {
      const newLike = reaction.userReaction !== "like";
      await setUpdateReaction(update.id, key, true);
      setReaction((prev) => ({
        likes: prev.likes + (newLike ? (prev.userReaction === "dislike" ? 2 : 1) : -1),
        dislikes: prev.userReaction === "dislike" ? prev.dislikes - 1 : prev.dislikes,
        userReaction: newLike ? "like" : null,
      }));
    } finally {
      setLoadingReaction(false);
    }
  };

  const handleDislike = async () => {
    const key = getOrCreateVoterKey();
    if (!key) return;
    setLoadingReaction(true);
    try {
      const newDislike = reaction.userReaction !== "dislike";
      await setUpdateReaction(update.id, key, false);
      setReaction((prev) => ({
        likes: prev.userReaction === "like" ? prev.likes - 1 : prev.likes,
        dislikes: prev.dislikes + (newDislike ? (prev.userReaction === "like" ? 2 : 1) : -1),
        userReaction: newDislike ? "dislike" : null,
      }));
    } finally {
      setLoadingReaction(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = commentBody.trim();
    if (!content) return;
    setSubmittingComment(true);
    try {
      await insertUpdateComment(update.id, content, commentAnonymous ? null : commentName.trim() || null, commentAnonymous);
      setCommentBody("");
      setCommentName("");
      await loadComments();
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-28 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/updates" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#C9921A] text-sm font-semibold mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Updates & News
        </Link>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          {update.imageUrl && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-white/5 mb-6">
              <img src={update.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm mb-4">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />
              {update.eventDate ? new Date(update.eventDate).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })
                : update.publishedAt ? new Date(update.publishedAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }) : ""}
            </span>
            <span className="flex items-center gap-1"><FolderOpen className="w-4 h-4" />{update.category}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${update.type === "event" ? "bg-amber-500/20 text-amber-400" : "bg-sky-500/20 text-sky-400"}`}>
              {update.type === "event" ? "Event" : "News"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">{update.title}</h1>
          <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">{update.description || "—"}</div>
          {update.link && (
            <a href={update.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 btn-gold px-5 py-2.5 rounded-xl text-sm font-bold">
              Read more <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </motion.article>

        {/* Event detail: countdown, venue, registration */}
        {update.type === "event" && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl border border-white/10 p-6 mb-8"
          >
            {update.eventStartAt && new Date(update.eventStartAt) > new Date() && (
              <div className="mb-6">
                <EventCountdown
                  targetDate={new Date(update.eventStartAt)}
                  label={t.updates.countdownToEvent}
                />
              </div>
            )}
            {(update.eventVenue || update.eventCity || update.eventCountry) && (
              <div className="flex items-start gap-3 text-slate-300 mb-6">
                <MapPin className="w-5 h-5 text-[#C9921A] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-widest font-medium text-theme-primary mb-1">
                    {t.updates.eventVenue}
                  </p>
                  <p className="text-sm">
                    {[update.eventVenue, update.eventRoom, update.eventCity, update.eventCountry]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>
            )}
            {update.registrationType && update.registrationType !== "none" && (
              <div>
                {update.registrationType === "external" && update.registrationUrl ? (
                  <a
                    href={update.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 btn-gold px-5 py-2.5 rounded-xl text-sm font-bold"
                  >
                    {t.updates.registerForEvent} <ExternalLink className="w-4 h-4" />
                  </a>
                ) : update.registrationType === "internal" && update.registrationPageSlug ? (
                  <Link
                    href={`/${update.registrationPageSlug}`}
                    className="inline-flex items-center gap-2 btn-gold px-5 py-2.5 rounded-xl text-sm font-bold"
                  >
                    {t.updates.registerForEvent} <ExternalLink className="w-4 h-4" />
                  </Link>
                ) : null}
              </div>
            )}
          </motion.section>
        )}

        {/* Resources & attachments */}
        {attachments.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FileDown className="w-5 h-5 text-[#C9921A]" /> {t.updates.resourcesTitle}
            </h2>
            <div className="flex flex-wrap gap-3">
              {attachments.map((att) => (
                <a
                  key={att.id}
                  href={`/api/track-download?url=${encodeURIComponent(att.publicUrl)}&attachmentId=${att.id}&name=${encodeURIComponent(att.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 glass rounded-xl border border-white/10 px-4 py-3 hover:border-[#C9921A]/40 transition-colors"
                >
                  <FileDown className="w-4 h-4 text-[#C9921A]" />
                  <span className="text-sm font-medium text-white">{att.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              ))}
            </div>
          </motion.section>
        )}

        {/* Like / Dislike */}
        <div className="flex items-center gap-4 mb-8 py-4 border-y border-white/10">
          <span className="text-slate-400 text-sm font-medium">Was this helpful?</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              disabled={loadingReaction}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                reaction.userReaction === "like" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              <ThumbsUp className="w-4 h-4" /> {reaction.likes}
            </button>
            <button
              onClick={handleDislike}
              disabled={loadingReaction}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                reaction.userReaction === "dislike" ? "bg-red-500/20 text-red-400 border-red-500/40" : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              <ThumbsDown className="w-4 h-4" /> {reaction.dislikes}
            </button>
          </div>
        </div>

        {/* Comments */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#C9921A]" /> {t.updates.commentsCount} {comments.length > 0 && `(${comments.length})`}
          </h2>

          <form onSubmit={handleSubmitComment} className="glass rounded-2xl border border-white/10 p-4 mb-6">
            <textarea
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder={t.updates.commentPlaceholder}
              rows={3}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9921A]/60 resize-none mb-4"
            />
            <div className="flex flex-wrap gap-4 items-center mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={commentAnonymous} onChange={(e) => setCommentAnonymous(e.target.checked)} className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#C9921A] focus:ring-[#C9921A]" />
                <span className="text-slate-400 text-sm">{t.updates.postCommentAnonymous}</span>
              </label>
              {!commentAnonymous && (
                <input
                  type="text"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder={t.updates.commentNamePlaceholder}
                  className="flex-1 min-w-[160px] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9921A]/60"
                />
              )}
            </div>
            <button type="submit" disabled={submittingComment} className="flex items-center gap-2 btn-gold px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50">
              <Send className="w-4 h-4" /> {submittingComment ? "…" : t.updates.postComment}
            </button>
          </form>

          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="glass rounded-xl border border-white/5 p-4">
                <div className="flex items-center gap-2 text-sm mb-2">
                  {c.isAnonymous ? (
                    <span className="flex items-center gap-1 text-slate-500"><UserX className="w-4 h-4" /> Anonymous</span>
                  ) : (
                    <span className="flex items-center gap-1 text-[#C9921A] font-medium"><User className="w-4 h-4" /> {c.authorName || "Anonymous"}</span>
                  )}
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-500 text-xs">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-300 text-sm whitespace-pre-wrap">{c.content}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
