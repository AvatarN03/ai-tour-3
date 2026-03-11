"use client"
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, Edit2, MessageCircle, ArrowLeft, Link2, SquareArrowOutUpRight } from 'lucide-react'
import { db } from '@/lib/config/firebase'
import {
    doc, getDoc, deleteDoc,
    updateDoc, setDoc, arrayUnion, Timestamp,
} from 'firebase/firestore'
import { useAuth } from '@/providers/useAuth'
import { logActivity } from '@/lib/services/logActivity'
import { formatDate, renderContent } from '@/lib/utils/blogHelpers'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

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
            await logActivity({
                userId: profile?.uid,
                action: 'DELETE',
                entity: 'BLOG',
                entityId: id,
                metadata: { postId: id },
            })
            router.push('/zone')
        } catch (error) {
            console.error('Error deleting post:', error)
            alert('Failed to delete post.')
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
                createdAt: Timestamp.now(),
            }

            const commentRef = doc(db, 'blog_comments', id)
            const commentDoc = await getDoc(commentRef)

            if (commentDoc.exists()) {
                await updateDoc(commentRef, { comments: arrayUnion(comment) })
            } else {
                await setDoc(commentRef, { comments: [comment] })
            }

            await logActivity({
                userId: profile?.uid,
                action: commentDoc.exists() ? 'UPDATE' : 'CREATE',
                entity: 'COMMENT',
                entityId: id,
                metadata: { postId: id, commentId: comment.id },
            })

            setComments((prev) => [...prev, { ...comment, createdAt: new Date() }])
            setNewComment('')
        } catch (error) {
            console.error('Error adding comment.')
        } finally {
            setIsSubmittingComment(false)
        }
    }

    const handleDeleteComment = async (commentId, commentAuthorUid) => {
        const isPostOwner = post.authorUid === profile?.uid
        if (commentAuthorUid !== profile?.uid && !isPostOwner) {
            return alert('You can only delete your own comments')
        }
        if (!confirm('Delete this comment?')) return

        try {
            const updated = comments.filter((c) => c.id !== commentId)
            await setDoc(doc(db, 'blog_comments', id), { comments: updated })
            await logActivity({
                userId: profile?.uid,
                action: 'DELETE',
                entity: 'COMMENT',
                entityId: id,
                metadata: { postId: id, commentId },
            })
            setComments(updated)
        } catch (error) {
            console.error('Error deleting comment:', error)
            alert('Failed to delete comment.')
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
        // ── Outermost shell: positions the blurred bg layer ──────────────────────
        <div className="relative min-h-screen overflow-hidden">


            {post.imageUrl && (
                <div
                    className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl"
                    style={{ backgroundImage: `url(${post.imageUrl})` }}
                />
            )}

            {/* Dark scrim so text stays readable over any photo */}
            <div className="absolute inset-0 bg-black/50" />

            {/* ── Scrollable content sits above the blurred bg ───────────────────── */}
            <div className="relative z-10 p-6 space-y-6">

                <div className="flex justify-between items-center">


                    <Button
                        variant="outline"
                        onClick={() => router.push('/zone')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to All Posts
                    </Button>

                    {isPostOwner && (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => router.push(`/zone/${id}/edit`)}
                                className="flex items-center gap-2"
                            >
                                <Edit2 className="w-4 h-4" />
                                 <p className='hidden md:block'>Edit Post</p>
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                className="flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                <p className='hidden md:block'>Delete Post</p>
                            </Button>
                        </div>
                    )}


                </div>

                <div className="overflow-hidden rounded-xl">
                    {/* Hero image — shown at normal clarity on top of the blurred bg */}
                    {post.imageUrl && (
                        <div className="flex justify-center items-center scale-95 w-full aspect-video overflow-hidden rounded-md   relative">

                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full h-full object-cover object-center rounded-lg shadow-lg hover:scale-105 cursor-pointer transition-transform duration-300"
                            />
                            <div className="absolute right-10 bottom-10 flex justify-center items-center">
                                <Link href={post.imageUrl} target='_blank'>
                                    <SquareArrowOutUpRight className="w-6 h-6" />
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className="p-8 space-y-6 bg-white/10 dark:bg-black/30 backdrop-blur-sm">

                        {/* Header */}
                        <div className='space-y-4'> 
                            <div className="space-y-4">
                                <Label htmlFor="title" className={"text-xl font-semibold opacity-60"}>Title:</Label>
                                <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mb-4">
                                <Link href={"/zone/authors/" + post.authorUid} className="flex items-center gap-1 text-gray-300 hover:text-gray-100">
                                    <span className="font-medium text-gray-200 hover:text-gray-300">👤 {post.author}</span>
                                </Link>
                                <span>•</span>
                                <span>📅 {formatDate(post.createdAt)}</span>
                                {post.updatedAt && (
                                    <>
                                        <span>•</span>
                                        <span>Updated: {formatDate(post.updatedAt)}</span>
                                    </>
                                )}
                            </div>
                            <span className="inline-block px-4 py-2 bg-indigo-500/30 text-indigo-200 rounded-full text-sm font-medium">
                                {post.category}
                            </span>
                        </div>


                        {/* Content */}
                        <div className="spacy-y-4">
                            <Label htmlFor="title" className={"text-xl font-semibold opacity-60"}>Description:</Label>
                            <div className="text-gray-100 prose prose-invert max-w-none text-lg leading-relaxed">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            isExpanded || !shouldTruncate
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

                        {/* Comments */}
                        <div className="border-t border-white/20 pt-6 space-y-5">
                            <div className="flex items-center gap-2 text-white text-xl font-semibold">
                                <MessageCircle className="w-6 h-6" />
                                <span>Comments ({comments.length})</span>
                            </div>

                            {/* Add comment */}
                            <form onSubmit={handleAddComment} className="space-y-3">
                                <Textarea
                                    placeholder="Share your thoughts..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    rows={2}
                                    className="resize-none bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                                    disabled={isSubmittingComment}
                                />
                                <Button
                                    type="submit"
                                    disabled={isSubmittingComment || !newComment.trim()}
                                   className="text-gray-200 dark:text-gray-900"
                                >
                                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                                </Button>
                            </form>

                            {/* Comment list */}
                            {comments.length > 0 ? (
                                <div className="space-y-3">
                                    {comments.map((comment) => {
                                        const canDelete = comment.authorUid === profile?.uid || isPostOwner
                                        return (
                                            <Card key={comment.id} className="p-4 bg-white/10 border-white/20">
                                                <p className="text-gray-100 mb-3">{comment.text}</p>
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="text-gray-400">
                                                        <span className="font-medium text-gray-200">{comment.author}</span>
                                                        <span className="mx-2">•</span>
                                                        <span>{formatDate(comment.createdAt)}</span>
                                                    </div>
                                                    {canDelete && (
                                                        <button
                                                            onClick={() => handleDeleteComment(comment.id, comment.authorUid)}
                                                            className="text-red-400 hover:text-red-300 font-medium text-sm"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </Card>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-center py-8">
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