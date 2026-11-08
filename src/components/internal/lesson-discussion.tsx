import { MessageSquare, Pencil, Reply, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { EmptyState } from "@/components/internal/empty-state";
import { Panel } from "@/components/internal/panel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  seedDiscussions,
  type DiscussionThread,
} from "@/data/discussions";
import { useLocale } from "@/i18n/routing";
import { formatDate } from "@/lib/account";
import { pickLocale } from "@/lib/catalog";
import { useAccount } from "@/store/account-store";

const STORAGE_KEY = "hisa.discussions";

const readStore = (): Record<string, DiscussionThread[]> => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object"
      ? (parsed as Record<string, DiscussionThread[]>)
      : {};
  } catch {
    return {};
  }
};

const writeStore = (store: Record<string, DiscussionThread[]>) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Storage can be unavailable; the discussion still works in memory.
  }
};

const makeId = () => `disc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const resolveSeeds = (
  lessonId: string,
  locale: "pt" | "en",
): DiscussionThread[] =>
  (seedDiscussions[lessonId] ?? []).map((thread) => ({
    id: thread.id,
    authorId: thread.authorId,
    authorName: thread.authorName,
    createdAt: thread.createdAt,
    body: thread.body[locale],
    replies: thread.replies.map((reply) => ({
      id: reply.id,
      authorId: reply.authorId,
      authorName: reply.authorName,
      createdAt: reply.createdAt,
      body: reply.body[locale],
      ...(reply.replyTo ? { replyTo: reply.replyTo[locale] } : {}),
    })),
  }));

type LessonDiscussionProps = {
  lessonId: string;
};

export const LessonDiscussion = ({ lessonId }: LessonDiscussionProps) => {
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const { profile, isSignedIn } = useAccount();
  const activeLocale = pickLocale(locale);

  const [store, setStore] = useState<Record<string, DiscussionThread[]>>(
    readStore,
  );
  const [body, setBody] = useState("");
  const [replyTarget, setReplyTarget] = useState<{
    threadId: string;
    replyId?: string | undefined;
    name: string;
  } | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [editing, setEditing] = useState<{
    threadId: string;
    replyId?: string | undefined;
  } | null>(null);
  const [editBody, setEditBody] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    setBody("");
    setReplyTarget(null);
    setReplyBody("");
    setEditing(null);
    setEditBody("");
    setDeleteTarget(null);
  }, [lessonId]);

  const threads = useMemo(() => {
    const source = store[lessonId] ?? resolveSeeds(lessonId, activeLocale);
    return [...source].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [activeLocale, lessonId, store]);

  const nameFor = (authorId: string, authorName: string) =>
    authorId === "self" ? profile.name : authorName;

  const commit = (next: DiscussionThread[]) => {
    setStore((current) => {
      const updated = { ...current, [lessonId]: next };
      writeStore(updated);
      return updated;
    });
  };

  const submitThread = (event: FormEvent) => {
    event.preventDefault();
    const text = body.trim();
    if (!text || !isSignedIn) return;

    commit([
      {
        id: makeId(),
        authorId: "self",
        authorName: profile.name,
        createdAt: new Date().toISOString(),
        body: text,
        replies: [],
      },
      ...threads,
    ]);
    setBody("");
  };

  const startReply = (threadId: string, name: string, replyId?: string) => {
    setReplyTarget({ threadId, replyId, name });
    setReplyBody("");
    setEditing(null);
    setDeleteTarget(null);
  };

  const cancelReply = () => {
    setReplyTarget(null);
    setReplyBody("");
  };

  const submitReply = (threadId: string) => {
    const text = replyBody.trim();
    if (!text || !isSignedIn || !replyTarget) return;

    commit(
      threads.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              replies: [
                ...thread.replies,
                {
                  id: makeId(),
                  authorId: "self",
                  authorName: profile.name,
                  createdAt: new Date().toISOString(),
                  body: text,
                  ...(replyTarget.replyId ? { replyTo: replyTarget.name } : {}),
                },
              ],
            }
          : thread,
      ),
    );

    cancelReply();
  };

  const startEdit = (
    threadId: string,
    currentBody: string,
    replyId?: string,
  ) => {
    setEditing({ threadId, replyId });
    setEditBody(currentBody);
    setReplyTarget(null);
    setDeleteTarget(null);
  };

  const saveEdit = () => {
    if (!editing) return;
    const text = editBody.trim();
    if (!text) return;

    const editedAt = new Date().toISOString();
    if (editing.replyId) {
      commit(
        threads.map((thread) =>
          thread.id === editing.threadId
            ? {
                ...thread,
                replies: thread.replies.map((reply) =>
                  reply.id === editing.replyId
                    ? { ...reply, body: text, editedAt }
                    : reply,
                ),
              }
            : thread,
        ),
      );
    } else {
      commit(
        threads.map((thread) =>
          thread.id === editing.threadId
            ? { ...thread, body: text, editedAt }
            : thread,
        ),
      );
    }

    setEditing(null);
    setEditBody("");
  };

  const removeThread = (threadId: string) => {
    commit(threads.filter((thread) => thread.id !== threadId));
    setDeleteTarget(null);
  };

  const removeReply = (threadId: string, replyId: string) => {
    commit(
      threads.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              replies: thread.replies.filter((reply) => reply.id !== replyId),
            }
          : thread,
      ),
    );
    setDeleteTarget(null);
  };

  const avatar = (
    name: string,
    src?: string | null,
    className = "h-8 w-8 text-[10px]",
  ) => (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center overflow-hidden border border-wire-ink bg-wire-surface font-medium uppercase text-foreground ${className}`}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );

  const actions = (
    threadId: string,
    currentBody: string,
    isOwn: boolean,
    replyId?: string,
  ) =>
    isOwn ? (
      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={() => startEdit(threadId, currentBody, replyId)}
          className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.12em] text-wire-ink-soft transition-colors hover:text-foreground"
        >
          <Pencil aria-hidden className="h-3 w-3" strokeWidth={1.5} />
          {t("discussion.edit")}
        </button>
        <button
          type="button"
          onClick={() => setDeleteTarget(replyId ?? threadId)}
          className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.12em] text-wire-ink-soft transition-colors hover:text-destructive"
        >
          <Trash2 aria-hidden className="h-3 w-3" strokeWidth={1.5} />
          {t("discussion.delete")}
        </button>
      </div>
    ) : null;

  const editForm = (
    <div className="mt-2">
      <Textarea
        value={editBody}
        onChange={(event) => setEditBody(event.target.value)}
        rows={3}
        aria-label={t("discussion.edit")}
        className="min-h-[76px] resize-y rounded-none border-wire-rule bg-background text-[12px] focus-visible:ring-1 focus-visible:ring-offset-0"
      />
      <div className="mt-2 flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={saveEdit}
          disabled={!editBody.trim()}
        >
          {t("discussion.save")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setEditing(null)}
        >
          {t("discussion.cancel")}
        </Button>
      </div>
    </div>
  );

  const deleteConfirm = (onConfirm: () => void) => (
    <div className="mt-2 flex flex-wrap items-center gap-3 border border-wire-rule bg-wire-surface px-3 py-2">
      <span className="text-[10px] leading-relaxed text-wire-ink-soft">
        {t("discussion.confirmDelete")}
      </span>
      <button
        type="button"
        onClick={onConfirm}
        className="text-[9px] uppercase tracking-[0.12em] text-destructive underline decoration-destructive/40 underline-offset-4"
      >
        {t("discussion.delete")}
      </button>
      <button
        type="button"
        onClick={() => setDeleteTarget(null)}
        className="text-[9px] uppercase tracking-[0.12em] text-wire-ink-soft hover:text-foreground"
      >
        {t("discussion.cancel")}
      </button>
    </div>
  );

  const replyForm = (threadId: string) => (
    <div className="mt-3 border border-wire-rule bg-wire-surface/50 p-3">
      {replyTarget?.name ? (
        <p className="mb-2 text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft">
          {t("discussion.replyTo", { name: replyTarget.name })}
        </p>
      ) : null}
      <label
        htmlFor={`discussion-reply-${threadId}`}
        className="sr-only"
      >
        {t("discussion.replyPlaceholder")}
      </label>
      <Textarea
        id={`discussion-reply-${threadId}`}
        value={replyBody}
        onChange={(event) => setReplyBody(event.target.value)}
        rows={2}
        placeholder={t("discussion.replyPlaceholder")}
        className="min-h-[72px] resize-y rounded-none border-wire-rule bg-background text-[12px] focus-visible:ring-1 focus-visible:ring-offset-0"
      />
      <div className="mt-2 flex items-center justify-end gap-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={cancelReply}
        >
          {t("discussion.cancel")}
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => submitReply(threadId)}
          disabled={!replyBody.trim()}
        >
          {t("discussion.submit")}
        </Button>
      </div>
    </div>
  );

  return (
    <Panel
      id="discussion"
      label={t("discussion.title")}
      action={
        <span
          aria-live="polite"
          className="font-mono text-[9px] uppercase tracking-[0.12em] text-wire-ink-soft"
        >
          {t("discussion.count", { count: threads.length })}
        </span>
      }
    >
      <p className="text-[12px] leading-relaxed text-wire-ink-soft">
        {t("discussion.lead")}
      </p>

      {isSignedIn ? (
        <form
          onSubmit={submitThread}
          className="mt-4 border border-wire-rule focus-within:border-wire-ink"
        >
          <label htmlFor="discussion-composer" className="sr-only">
            {t("discussion.placeholder")}
          </label>
          <Textarea
            id="discussion-composer"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={3}
            placeholder={t("discussion.placeholder")}
            className="min-h-[84px] resize-y rounded-none border-0 bg-transparent px-3 py-3 text-[12px] focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-wire-rule px-3 py-2">
            <span className="text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft">
              {profile.name}
            </span>
            <Button
              type="submit"
              size="sm"
              disabled={!body.trim()}
            >
              {t("discussion.submit")}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-4 flex flex-col gap-3 border border-dashed border-wire-rule px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] leading-relaxed text-wire-ink-soft">
            {t("discussion.signInNote")}
          </p>
          <Button asChild size="sm" variant="outline">
            <Link to={to("signin")}>{t("discussion.signIn")}</Link>
          </Button>
        </div>
      )}

      {threads.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            icon={MessageSquare}
            title={t("discussion.empty.title")}
            text={t("discussion.empty.text")}
          />
        </div>
      ) : (
        <ul className="mt-6">
          {threads.map((thread) => {
            const threadName = nameFor(thread.authorId, thread.authorName);
            const threadIsOwn = thread.authorId === "self";
            const isEditingThread =
              editing?.threadId === thread.id && !editing.replyId;

            return (
              <li
                id={`discussion-${thread.id}`}
                key={thread.id}
                className="scroll-mt-24 border-t border-wire-rule py-5 first:border-t-0 first:pt-0"
              >
                <div className="flex items-start gap-3">
                  {avatar(
                    threadName,
                    threadIsOwn ? profile.avatarUrl : null,
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-foreground">
                          {threadName}
                          {threadIsOwn ? (
                            <span className="border border-wire-rule px-1.5 py-0.5 text-[8px] uppercase tracking-[0.14em] text-wire-ink-soft">
                              {t("discussion.you")}
                            </span>
                          ) : null}
                        </p>
                        <p className="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-wire-ink-soft">
                          {formatDate(thread.createdAt, locale)}
                          {thread.editedAt
                            ? ` · ${t("discussion.edited")}`
                            : ""}
                        </p>
                      </div>

                      {actions(
                        thread.id,
                        thread.body,
                        threadIsOwn,
                      )}
                    </div>

                    {isEditingThread
                      ? editForm
                      : (
                        <p className="mt-2 whitespace-pre-line text-[12px] leading-relaxed text-wire-ink-soft">
                          {thread.body}
                        </p>
                      )}

                    {deleteTarget === thread.id
                      ? deleteConfirm(() => removeThread(thread.id))
                      : null}

                    <div className="mt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          startReply(thread.id, threadName)
                        }
                        className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft transition-colors hover:text-foreground"
                      >
                        <Reply
                          aria-hidden
                          className="h-3 w-3"
                          strokeWidth={1.5}
                        />
                        {t("discussion.reply")}
                      </button>
                    </div>

                    {replyTarget?.threadId === thread.id &&
                    !replyTarget.replyId
                      ? replyForm(thread.id)
                      : null}

                    {thread.replies.length > 0 ? (
                      <ul className="mt-4 space-y-4 border-l border-wire-rule pl-4">
                        {thread.replies.map((reply) => {
                          const replyName = nameFor(
                            reply.authorId,
                            reply.authorName,
                          );
                          const replyIsOwn = reply.authorId === "self";
                          const isEditingReply =
                            editing?.threadId === thread.id &&
                            editing.replyId === reply.id;

                          return (
                            <li key={reply.id}>
                              <div className="flex items-start gap-2.5">
                                {avatar(
                                  replyName,
                                  replyIsOwn ? profile.avatarUrl : null,
                                  "h-7 w-7 text-[9px]",
                                )}
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                                    <div className="min-w-0">
                                      <p className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.08em] text-foreground">
                                        {replyName}
                                        {replyIsOwn ? (
                                          <span className="border border-wire-rule px-1.5 py-0.5 text-[8px] uppercase tracking-[0.14em] text-wire-ink-soft">
                                            {t("discussion.you")}
                                          </span>
                                        ) : null}
                                      </p>
                                      <p className="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-wire-ink-soft">
                                        {formatDate(
                                          reply.createdAt,
                                          locale,
                                        )}
                                        {reply.editedAt
                                          ? ` · ${t("discussion.edited")}`
                                          : ""}
                                      </p>
                                    </div>

                                    {actions(
                                      thread.id,
                                      reply.body,
                                      replyIsOwn,
                                      reply.id,
                                    )}
                                  </div>

                                  {reply.replyTo ? (
                                    <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-wire-ink-soft">
                                      {t("discussion.replyTo", {
                                        name: reply.replyTo,
                                      })}
                                    </p>
                                  ) : null}

                                  {isEditingReply
                                    ? editForm
                                    : (
                                      <p className="mt-1.5 whitespace-pre-line text-[11px] leading-relaxed text-wire-ink-soft">
                                        {reply.body}
                                      </p>
                                    )}

                                  {deleteTarget === reply.id
                                    ? deleteConfirm(() =>
                                        removeReply(
                                          thread.id,
                                          reply.id,
                                        ),
                                      )
                                    : null}

                                  <div className="mt-1.5">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        startReply(
                                          thread.id,
                                          replyName,
                                          reply.id,
                                        )
                                      }
                                      className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft transition-colors hover:text-foreground"
                                    >
                                      <Reply
                                        aria-hidden
                                        className="h-3 w-3"
                                        strokeWidth={1.5}
                                      />
                                      {t("discussion.reply")}
                                    </button>
                                  </div>

                                  {replyTarget?.replyId === reply.id
                                    ? replyForm(thread.id)
                                    : null}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
};
