"use client";

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

import {
    Trash2, Edit2, MessageCircle, ArrowLeft,
    SquareArrowOutUpRight,
} from 'lucide-react';
import {
    doc, getDoc, deleteDoc,
    updateDoc, setDoc, arrayUnion, Timestamp,
} from 'firebase/firestore'
import { toast } from 'sonner'


import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { CommentCard } from '@/components/features/zone/CommentCard'

import { useAuth } from '@/providers/useAuth';

import { db } from '@/lib/config/firebase'
import { logActivity } from '@/lib/services/logActivity'
import { formatDate, renderContent } from '@/lib/utils/blogHelpers'



export default function ViewPostPage() {
    const router = useRouter()
    const { id } = useParams()
    const { profile } = useAuth()

    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [isExpanded, setIsExpanded] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmittingComment, setIsSubmittingComment] = useState(false)

    useEffect(() => { fetchData() }, [id])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const postSnap = await getDoc(doc(db, 'blog_posts', id))
            if (!postSnap.exists()) {
                alert('Post not found')
                return router.push('/zone')
            }
            const data = postSnap.data()
            setPost({
                id: postSnap.id,
                ...data,
                createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
                updatedAt: data.updatedAt?.toDate?.() || (data.updatedAt ? new Date(data.updatedAt) : null),
            })

            const commentSnap = await getDoc(doc(db, 'blog_comments', id))
            if (commentSnap.exists()) {
                setComments(
                    (commentSnap.data().comments || []).map((c) => ({
                        ...c,
                        createdAt: c.createdAt?.toDate?.() || new Date(c.createdAt),
                    }))
                )
            }
            console.log(profile)
        } catch (error) {
            console.error('Error fetching post:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return
        try {
            await deleteDoc(doc(db, 'blog_posts', id))
            await deleteDoc(doc(db, 'blog_comments', id))
            await logActivity({ userId: profile?.uid, action: 'DELETE', entity: 'BLOG', entityId: id, metadata: { postId: id } })
            toast.success('Post deleted successfully!')
            router.push('/zone')
        } catch (error) {
            console.error(error)
            toast.error('Failed to delete post.')
        }
    }

    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return alert('Comment cannot be empty')
        if (!profile?.uid) return alert('You must be logged in to comment')

        setIsSubmittingComment(true)
        try {
            const comment = {
                id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                text: newComment.trim(),
                author: profile?.name || 'User',
                authorUid: profile?.uid,
                authorImage: profile?.avatarUrl || null,
                createdAt: Timestamp.now(),
            }
            const commentRef = doc(db, 'blog_comments', id)
            const commentDoc = await getDoc(commentRef)
            if (commentDoc.exists()) {
                await updateDoc(commentRef, { comments: arrayUnion(comment) })
            } else {
                await setDoc(commentRef, { comments: [comment] })
            }
            await logActivity({ userId: profile?.uid, action: commentDoc.exists() ? 'UPDATE' : 'CREATE', entity: 'COMMENT', entityId: id, metadata: { postId: id, commentId: comment.id } })
            setComments((prev) => [...prev, { ...comment, createdAt: new Date() }])
            setNewComment('')
            toast.success('Comment posted successfully!')

        } catch (error) {
            console.error(error)
            toast.error('Failed to post comment.')
        } finally {
            setIsSubmittingComment(false)
        }
    }

    const handleDeleteComment = async (commentId) => {
        if (!confirm('Delete this comment?')) return
        try {
            const updated = comments.filter((c) => c.id !== commentId)
            await setDoc(doc(db, 'blog_comments', id), { comments: updated })
            await logActivity({ userId: profile?.uid, action: 'DELETE', entity: 'COMMENT', entityId: id, metadata: { postId: id, commentId } })
            setComments(updated)
            toast.success('Comment deleted successfully!')
        } catch (error) {
            console.error(error)
            toast.error('Failed to delete comment.')
        }
    }

    const handleEditComment = async (commentId, newText) => {
        try {
            const updated = comments.map((c) =>
                c.id === commentId ? { ...c, text: newText } : c
            )
            await setDoc(doc(db, 'blog_comments', id), { comments: updated })
            await logActivity({ userId: profile?.uid, action: 'UPDATE', entity: 'COMMENT', entityId: id, metadata: { postId: id, commentId } })
            setComments(updated)
            toast.success('Comment updated successfully!')
        } catch (error) {
            console.error(error)
            toast.error('Failed to edit comment.')
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        )
    }

    if (!post) return null

    const isPostOwner = post.authorUid === profile?.uid
    const shouldTruncate = (post.content || '').length > 300

    return (
        <div className="relative min-h-screen overflow-hidden">

            {/* Blurred background */}
            {post.imageUrl && (
                <div
                    className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl"
                    style={{ backgroundImage: `url(${post.imageUrl})` }}
                />
            )}
            <div className="absolute inset-0 bg-black/50" />

            {/* Content */}
            <div className="relative z-10 p-2 md:p-6 space-y-6">

                {/* Top bar */}
                <div className="flex justify-between items-center">
                    <Button variant="outline" onClick={() => router.push('/zone')} className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>

                    {isPostOwner && (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => router.push(`/zone/${id}/edit`)} className="flex items-center gap-2">
                                <Edit2 className="w-4 h-4" />
                                <span className="hidden md:inline">Edit Post</span>
                            </Button>
                            <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden md:inline">Delete Post</span>
                            </Button>
                        </div>
                    )}
                </div>

                <div className="overflow-hidden rounded-xl">
                    {/* Hero image */}
                    {post.imageUrl && (
                        <div className="relative w-full aspect-video overflow-hidden rounded-md">
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full h-full object-cover object-center rounded-lg shadow-lg hover:scale-105 cursor-pointer transition-transform duration-300"
                            />
                            <div className="absolute right-4 bottom-4 rounded-full bg-gray-800/80">
                                <Link href={post.imageUrl} target="_blank" className="block p-2">
                                    <SquareArrowOutUpRight className="w-4 h-4 md:w-5 md:h-5" />
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className="p-3 md:p-8 space-y-6 bg-white/5 dark:bg-black/30 backdrop-blur-sm">

                        {/* Post header */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <Label className="text-base font-semibold opacity-60">Title:</Label>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">{post.title}</h1>
                            </div>

                            <div className="grid grid-cols-2 items-center gap-3 text-sm text-gray-300">
                                <Link
                                    href={`/zone/authors/${post.authorUid}`}
                                    className="flex items-center gap-2  rounded-md w-fit px-3 py-2  group"
                                >
                                    <Avatar className="relative w-11 h-11 ring-2 ring-white dark:ring-gray-800">
                                        <AvatarImage
                                            src={post?.authorImage}
                                            alt={post?.author || "Profile"}
                                        />

                                    </Avatar>
                                    <span className="font-medium text-gray-200 group-hover:text-indigo-200">{post.author}</span>
                                </Link>
                                <div className="flex flex-col items-end gap-1 text-sm text-gray-400">
                                    <span>📅 {formatDate(post.createdAt)}</span>
                                    {post.updatedAt && <span>✏️ {formatDate(post.updatedAt)}</span>}
                                </div>
                            </div>

                            <span className="inline-block px-4 py-1.5 bg-indigo-500/50 text-indigo-200 rounded-full text-sm font-medium">
                                {post.category}
                            </span>
                        </div>

                        {/* Post content */}
                        <div className="space-y-1">
                            <Label className="text-base font-semibold opacity-60">Description:</Label>
                            <div className="text-gray-100 prose prose-invert max-w-none text-base md:text-lg leading-relaxed">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: isExpanded || !shouldTruncate
                                            ? renderContent(post.content)
                                            : renderContent((post.content || '').substring(0, 300)) + '...',
                                    }}
                                />
                                {shouldTruncate && (
                                    <button
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="text-indigo-300 hover:underline font-medium mt-4 block"
                                    >
                                        {isExpanded ? 'Show less' : 'Read more'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* ── Comments section ── */}
                        <div className="border-t border-white/20 pt-6 space-y-5">

                            <div className="flex items-center gap-2 text-white text-xl font-semibold">
                                <MessageCircle className="w-5 h-5" />
                                <span>Comments ({comments.length})</span>
                            </div>

                            {/* New comment — avatar inline */}
                            <form onSubmit={handleAddComment} className="flex gap-3 items-start">

                                <div className="flex-1 space-y-2">
                                    <Textarea
                                        placeholder="Share your thoughts..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        rows={2}
                                        className="resize-none bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm"
                                        disabled={isSubmittingComment}
                                    />
                                    <Button
                                        type="submit"
                                        disabled={isSubmittingComment || !newComment.trim()}
                                        
                                    >
                                        {isSubmittingComment ? 'Posting…' : 'Post Comment'}
                                    </Button>
                                </div>
                            </form>

                            {/* Comment list */}
                            {comments.length > 0 ? (
                                <div className="space-y-3">
                                    {comments.map((comment) => {
                                        const isCommentOwner = comment.authorUid === profile?.uid
                                        const canAct = isCommentOwner || isPostOwner
                                        return (
                                            <CommentCard
                                                key={comment.id}
                                                comment={comment}
                                                canDelete={canAct}
                                                canEdit={isCommentOwner}
                                                onDelete={() => handleDeleteComment(comment.id)}
                                                onEdit={handleEditComment}
                                            />
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-center py-8 text-sm">
                                    No comments yet. Be the first to share your thoughts!
                                </p>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}