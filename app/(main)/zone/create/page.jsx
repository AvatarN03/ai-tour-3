"use client"
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { X, Bold, Italic, Link, ArrowLeft, Upload } from 'lucide-react'
import { categories } from '@/lib/utils/constant'
import { db } from '@/lib/config/firebase'
import { doc, setDoc, Timestamp } from 'firebase/firestore'
import { useAuth } from '@/providers/useAuth'
import { logActivity } from '@/lib/services/logActivity'

export default function CreatePostPage() {
    const router = useRouter()
    const { profile } = useAuth()
    const inputRef = useRef(null)

    const [post, setPost] = useState({
        title: '',
        content: '',
        category: '',
        imageFile: null,
        imagePreview: null,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file && file.type.startsWith('image/')) {
            setPost({ ...post, imageFile: file, imagePreview: URL.createObjectURL(file) })
        } else {
            alert('Please select a valid image file')
        }
    }

    const formatText = (tag) => {
        const textarea = document.getElementById('post-content')
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
        if (!profile?.uid) return alert('You must be logged in to create a post')

        setIsSubmitting(true)
        try {
            let uploadedImageUrl = ''
            if (post.imageFile) {
                const formData = new FormData()
                formData.append('file', post.imageFile)
                const res = await fetch('/api/media/upload', { method: 'POST', body: formData })
                if (!res.ok) throw new Error('Image upload failed')
                const data = await res.json()
                uploadedImageUrl = data?.url || ''
            }

            const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            const postData = {
                title: post.title.trim(),
                content: post.content.trim(),
                category: post.category,
                imageUrl: uploadedImageUrl,
                author: profile?.name || 'Anonymous',
                authorUid: profile?.uid,
                createdAt: Timestamp.now(),
                likes: 0,
            }

            await setDoc(doc(db, 'blog_posts', postId), postData)
            await setDoc(doc(db, 'blog_comments', postId), { comments: [] })
            await logActivity({
                userId: profile?.uid,
                action: 'CREATE',
                entity: 'BLOG',
                entityId: postId,
                metadata: { tripName: postData.title },
            })

            router.push('/zone')
        } catch (error) {
            console.error('Error creating post:', error)
            alert(`Failed to publish post: ${error.message}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="space-y-6">

                <Button variant="outline" onClick={() => router.push('/zone')} className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Posts
                </Button>

                <Card className="p-6">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Create New Post</h2>

                    <form onSubmit={handleSubmit}>
                        {/* Two-column on md+, single column on mobile */}
                        <div className="flex flex-col md:flex-row gap-6 items-start">

                            {/* ── LEFT col: all text fields ── */}
                            <div className="flex-1 min-w-0 space-y-5">

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                                        Post Title *
                                    </label>
                                    <Input
                                        placeholder="Enter an engaging title..."
                                        value={post.title}
                                        onChange={(e) => setPost({ ...post, title: e.target.value })}
                                        className="text-lg p-3"
                                        required
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                                        Category *
                                    </label>
                                    <select
                                        value={post.category}
                                        onChange={(e) => setPost({ ...post, category: e.target.value })}
                                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.label} value={cat.label}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Content */}
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                                        Content *
                                    </label>
                                    {/* Formatting toolbar */}
                                    <div className="flex gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-t-md border border-b-0">
                                        {[
                                            { tag: 'bold', Icon: Bold },
                                            { tag: 'italic', Icon: Italic },
                                            { tag: 'link', Icon: Link },
                                        ].map(({ tag, Icon }) => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => formatText(tag)}
                                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
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
                                        id="post-content"
                                        placeholder="Share your travel story..."
                                        value={post.content}
                                        onChange={(e) => setPost({ ...post, content: e.target.value })}
                                        rows={20}
                                        className="resize-none rounded-t-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* ── RIGHT col: image + action buttons ── */}
                            <div className="w-full md:w-72 lg:w-80 shrink-0 flex flex-col gap-5 md:sticky md:top-6">

                                {/* Image upload */}
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                                        Cover Image (optional)
                                    </label>

                                    {/* Hidden file input */}
                                    <input
                                        ref={inputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />

                                    {post.imagePreview ? (
                                        <div className="relative rounded-md overflow-hidden">
                                            <img
                                                src={post.imagePreview}
                                                alt="Preview"
                                                className="w-full h-52 object-cover"
                                            />
                                            {/* Remove */}
                                            <button
                                                type="button"
                                                onClick={() => setPost({ ...post, imageFile: null, imagePreview: null })}
                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            {/* Change */}
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
                                            className="flex flex-col justify-center items-center w-full h-52 bg-indigo-950 hover:bg-indigo-900 rounded-md cursor-pointer gap-3 transition-colors"
                                        >
                                            <Upload className="w-8 h-8 text-indigo-300" />
                                            <span className="text-sm text-indigo-300">Click to upload cover image</span>
                                        </button>
                                    )}
                                </div>

                                {/* Action buttons */}
                                <div className="flex flex-col gap-3">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-green-600 hover:bg-green-700 w-full"
                                    >
                                        {isSubmitting ? 'Publishing...' : 'Publish Post'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push('/zone')}
                                        disabled={isSubmitting}
                                        className="w-full"
                                    >
                                        Cancel
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}