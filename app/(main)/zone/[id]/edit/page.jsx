"use client"
import { useRef, useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { X, Bold, Italic, Link, ArrowLeft, Upload, Trash2 } from 'lucide-react'
import { categories } from '@/lib/utils/constant'
import { db } from '@/lib/config/firebase'
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { useAuth } from '@/providers/useAuth'
import { logActivity } from '@/lib/services/logActivity'

export default function EditPostPage() {
    const router = useRouter()
    const { id } = useParams()
    const { profile } = useAuth()
    const inputRef = useRef(null)

    const [post, setPost] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [newImageFile, setNewImageFile] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const snap = await getDoc(doc(db, 'blog_posts', id))
                if (!snap.exists()) {
                    alert('Post not found')
                    return router.push('/zone')
                }
                const data = snap.data()
                setPost({ id: snap.id, ...data })
                setImagePreview(data.imageUrl || null)
            } catch (error) {
                console.error('Error fetching post:', error)
                alert('Failed to load post')
                router.push('/zone')
            } finally {
                setIsLoading(false)
            }
        }
        fetchPost()
    }, [id])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file && file.type.startsWith('image/')) {
            setNewImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        } else {
            alert('Please select a valid image file')
        }
    }

    const formatText = (tag) => {
        const textarea = document.getElementById('edit-content')
        if (!textarea) return
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selected = textarea.value.substring(start, end)
        if (!selected) return alert('Please select some text first')

        let formatted = ''
        if (tag === 'bold') formatted = `**${selected}**`
        else if (tag === 'italic') formatted = `*${selected}*`
        else if (tag === 'link') {
            const url = prompt('Enter URL:')
            if (!url) return
            formatted = `[${selected}](${url})`
        }

        const newContent = post.content.substring(0, start) + formatted + post.content.substring(end)
        setPost({ ...post, content: newContent })
        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start, start + formatted.length)
        }, 0)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!post.title.trim() || !post.content.trim() || !post.category) {
            return alert('Please fill all required fields')
        }

        setIsSubmitting(true)
        try {
            let finalImageUrl = post.imageUrl || ''
            if (newImageFile) {
                const formData = new FormData()
                formData.append('file', newImageFile)
                const res = await fetch('/api/media/upload', { method: 'POST', body: formData })
                if (!res.ok) throw new Error('Image upload failed')
                const data = await res.json()
                finalImageUrl = data?.url || ''
            }

            await updateDoc(doc(db, 'blog_posts', id), {
                title: post.title.trim(),
                content: post.content.trim(),
                category: post.category,
                imageUrl: finalImageUrl,
                updatedAt: Timestamp.now(),
            })
            await logActivity({
                userId: profile?.uid,
                action: 'UPDATE',
                entity: 'BLOG',
                entityId: id,
                metadata: { postId: id },
            })

            router.push(`/zone/${id}/view`)
        } catch (error) {
            console.error('Error updating post:', error)
            alert(`Failed to update post: ${error.message}`)
        } finally {
            setIsSubmitting(false)
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

    return (
        // Same blurred-bg shell as ViewPostPage
        <div className="relative min-h-screen overflow-hidden">

            {/* Blurred background layer */}
            {imagePreview && (
                <div
                    className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl"
                    style={{ backgroundImage: `url(${imagePreview})` }}
                />
            )}
            {/* fallback gradient when no image */}
            {!imagePreview && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-indigo-950" />
            )}

            {/* Dark scrim */}
            <div className="absolute inset-0 bg-black/55" />

            {/* Scrollable content */}
            <div className="relative z-10 p-6 space-y-6">

                {/* Top bar */}
                <div className="flex justify-between items-center">
                    <Button
                        variant="outline"
                        onClick={() => router.push(`/zone/${id}/view`)}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Post
                    </Button>
                </div>

                {/* Card */}
                <div className="rounded-xl bg-white/10 dark:bg-black/30 backdrop-blur-sm p-6 md:p-8 space-y-6">
                    <h2 className="text-3xl font-bold text-white">Edit Post</h2>

                    <form onSubmit={handleSubmit}>
                        {/* Two-column on md+, single column on mobile */}
                        <div className="flex flex-col md:flex-row gap-6 items-start">

                            {/* ── LEFT: text fields ── */}
                            <div className="flex-1 min-w-0 space-y-5">

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-300">
                                        Post Title *
                                    </label>
                                    <Input
                                        placeholder="Enter an engaging title..."
                                        value={post.title}
                                        onChange={(e) => setPost({ ...post, title: e.target.value })}
                                        className="text-lg p-3 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                                        required
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-300">
                                        Category *
                                    </label>
                                    <select
                                        value={post.category}
                                        onChange={(e) => setPost({ ...post, category: e.target.value })}
                                        className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white"
                                        required
                                    >
                                        <option value="" className="bg-gray-900">Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.label} value={cat.label} className="bg-gray-900">
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Content */}
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-300">
                                        Content *
                                    </label>
                                    {/* Formatting toolbar */}
                                    <div className="flex gap-2 p-2 bg-white/10 rounded-t-md border border-b-0 border-white/20">
                                        {[
                                            { tag: 'bold', Icon: Bold },
                                            { tag: 'italic', Icon: Italic },
                                            { tag: 'link', Icon: Link },
                                        ].map(({ tag, Icon }) => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => formatText(tag)}
                                                className="p-2 hover:bg-white/20 rounded text-gray-300 hover:text-white"
                                                title={`${tag} (select text first)`}
                                            >
                                                <Icon className="w-4 h-4" />
                                            </button>
                                        ))}
                                        <span className="text-xs text-gray-400 self-center ml-2">
                                            Select text then click to format
                                        </span>
                                    </div>
                                    <Textarea
                                        id="edit-content"
                                        placeholder="Share your travel story..."
                                        value={post.content}
                                        onChange={(e) => setPost({ ...post, content: e.target.value })}
                                        rows={20}
                                        className="resize-none rounded-t-none bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                                        required
                                    />
                                </div>
                            </div>

                            {/* ── RIGHT: image upload + actions ── */}
                            <div className="w-full md:w-72 lg:w-80 shrink-0 flex flex-col gap-5 md:sticky md:top-6">

                                {/* Image upload */}
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-300">
                                        Cover Image
                                    </label>

                                    <input
                                        ref={inputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />

                                    {imagePreview ? (
                                        <div className="relative rounded-md overflow-hidden">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-52 object-cover"
                                            />
                                            {/* Remove image */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPost({ ...post, imageUrl: '' })
                                                    setImagePreview(null)
                                                    setNewImageFile(null)
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            {/* Change image */}
                                            <button
                                                type="button"
                                                onClick={() => inputRef.current?.click()}
                                                className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-md"
                                            >
                                                <Upload className="w-3 h-3" />
                                                Change
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => inputRef.current?.click()}
                                            className="flex flex-col justify-center items-center w-full h-52 bg-white/10 hover:bg-white/20 border border-dashed border-white/30 rounded-md cursor-pointer gap-3 transition-colors"
                                        >
                                            <Upload className="w-8 h-8 text-gray-400" />
                                            <span className="text-sm text-gray-400">Click to upload cover image</span>
                                        </button>
                                    )}
                                </div>

                                {/* Action buttons */}
                                <div className="flex flex-col gap-3">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-blue-600 hover:bg-blue-700 w-full"
                                    >
                                        {isSubmitting ? 'Updating...' : 'Update Post'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push(`/zone/${id}/view`)}
                                        disabled={isSubmitting}
                                        className="w-full"
                                    >
                                        Cancel
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}