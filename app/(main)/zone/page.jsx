"use client"
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Search, X, Trash2, Edit2, MessageCircle, Image, Bold, Italic, Link, ArrowLeft } from 'lucide-react'
import { categories } from '@/lib/constant'
import { db } from '@/lib/firebase'
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  arrayUnion,
  Timestamp
} from 'firebase/firestore'
import { useAuth } from '@/context/useAuth'

// ============= UTILITY FUNCTIONS =============
const renderContent = (content) => {
  if (!content) return ''
  let html = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>')
    .replace(/\n/g, '<br/>')
  return html
}

const formatDate = (dateObj) => {
  if (!dateObj) return 'Unknown date'
  const date = dateObj instanceof Date ? dateObj : new Date(dateObj)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ============= CREATE POST COMPONENT =============
function CreatePost({ onBack, onPostCreated }) {
  const [post, setPost] = useState({ 
    title: '', 
    content: '', 
    category: '', 
    imageUrl: '',
    imagePreview: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { profile } = useAuth()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setPost({ ...post, imageUrl: file, imagePreview: URL.createObjectURL(file) })
    } else {
      alert('Please select a valid image file')
    }
  }

  const formatText = (tag) => {
    const textarea = document.getElementById('post-content')
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    
    if (!selectedText) {
      alert('Please select some text first')
      return
    }

    let formattedText = ''
    switch(tag) {
      case 'bold':
        formattedText = `**${selectedText}**`
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        break
      case 'link':
        const url = prompt('Enter URL:')
        if (url) formattedText = `[${selectedText}](${url})`
        else return
        break
      default:
        formattedText = selectedText
    }

    const newContent = post.content.substring(0, start) + formattedText + post.content.substring(end)
    setPost({ ...post, content: newContent })
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start, start + formattedText.length)
    }, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!post.title.trim() || !post.content.trim() || !post.category) {
      alert('Please fill all required fields')
      return
    }

    if (!profile?.uid) {
      alert('You must be logged in to create a post')
      return
    }

    setIsSubmitting(true)

    try {
      let uploadedImageUrl = ''
      
      // Upload image if exists
      if (post.imageUrl && post.imageUrl instanceof File) {
        const formData = new FormData()
        formData.append("file", post.imageUrl)
        
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          throw new Error('Image upload failed')
        }

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
        likes: 0
      }

      // Add post to Firestore
      await setDoc(doc(db, 'blog_posts', postId), postData)
      
      // Initialize empty comments document
      await setDoc(doc(db, 'blog_comments', postId), { comments: [] })

      alert('Post published successfully!')
      onPostCreated()
      onBack()
    } catch (error) {
      console.error('Error creating post:', error)
      alert(`Failed to publish post: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Posts
      </Button>

      <Card className="p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Create New Post
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Post Title *
            </label>
            <Input
              placeholder="Enter an engaging title..."
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="text-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Category *
            </label>
            <select
              value={post.category}
              onChange={(e) => setPost({ ...post, category: e.target.value })}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Cover Image (optional)
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
          </div>

          {post.imagePreview && (
            <div className="relative">
              <img
                src={post.imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => setPost({ ...post, imageUrl: '', imagePreview: null })}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Content *
            </label>
            
            {/* Text Formatting Toolbar */}
            <div className="flex gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-t-md border border-b-0">
              <button
                type="button"
                onClick={() => formatText('bold')}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                title="Bold (select text first)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatText('italic')}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                title="Italic (select text first)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatText('link')}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                title="Link (select text first)"
              >
                <Link className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400 self-center ml-2">
                Select text then click to format
              </span>
            </div>

            <Textarea
              id="post-content"
              placeholder="Share your travel story... Use the toolbar above to format text."
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              rows={12}
              className="resize-y rounded-t-none"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 flex-1"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </Button>
            <Button 
              type="button"
              variant="outline" 
              onClick={onBack}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

// ============= EDIT POST COMPONENT =============
function EditPost({ post, onBack, onPostUpdated }) {
  const [editedPost, setEditedPost] = useState({ 
    ...post,
    imagePreview: post.imageUrl || null,
    newImageFile: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setEditedPost({ 
        ...editedPost, 
        newImageFile: file, 
        imagePreview: URL.createObjectURL(file) 
      })
    } else {
      alert('Please select a valid image file')
    }
  }

  const formatText = (tag) => {
    const textarea = document.getElementById('edit-content')
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    
    if (!selectedText) {
      alert('Please select some text first')
      return
    }

    let formattedText = ''
    switch(tag) {
      case 'bold':
        formattedText = `**${selectedText}**`
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        break
      case 'link':
        const url = prompt('Enter URL:')
        if (url) formattedText = `[${selectedText}](${url})`
        else return
        break
      default:
        formattedText = selectedText
    }

    const newContent = editedPost.content.substring(0, start) + formattedText + editedPost.content.substring(end)
    setEditedPost({ ...editedPost, content: newContent })
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start, start + formattedText.length)
    }, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!editedPost.title.trim() || !editedPost.content.trim() || !editedPost.category) {
      alert('Please fill all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      let finalImageUrl = editedPost.imageUrl || ''
      
      // Upload new image if changed
      if (editedPost.newImageFile) {
        const formData = new FormData()
        formData.append("file", editedPost.newImageFile)
        
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          throw new Error('Image upload failed')
        }

        const data = await res.json()
        finalImageUrl = data?.url || ''
      }

      const updates = {
        title: editedPost.title.trim(),
        content: editedPost.content.trim(),
        category: editedPost.category,
        imageUrl: finalImageUrl,
        updatedAt: Timestamp.now()
      }

      await updateDoc(doc(db, 'blog_posts', post.id), updates)

      alert('Post updated successfully!')
      onPostUpdated()
      onBack()
    } catch (error) {
      console.error('Error updating post:', error)
      alert(`Failed to update post: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Posts
      </Button>

      <Card className="p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Edit Post
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Post Title *
            </label>
            <Input
              placeholder="Enter an engaging title..."
              value={editedPost.title}
              onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
              className="text-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Category *
            </label>
            <select
              value={editedPost.category}
              onChange={(e) => setEditedPost({ ...editedPost, category: e.target.value })}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Cover Image
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
          </div>

          {editedPost.imagePreview && (
            <div className="relative">
              <img
                src={editedPost.imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => setEditedPost({ ...editedPost, imageUrl: '', imagePreview: null, newImageFile: null })}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Content *
            </label>
            
            {/* Text Formatting Toolbar */}
            <div className="flex gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-t-md border border-b-0">
              <button
                type="button"
                onClick={() => formatText('bold')}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                title="Bold (select text first)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatText('italic')}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                title="Italic (select text first)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatText('link')}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                title="Link (select text first)"
              >
                <Link className="w-4 h-4" />
              </button>
            </div>

            <Textarea
              id="edit-content"
              placeholder="Share your travel story..."
              value={editedPost.content}
              onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })}
              rows={12}
              className="resize-y rounded-t-none"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 flex-1"
            >
              {isSubmitting ? 'Updating...' : 'Update Post'}
            </Button>
            <Button 
              type="button"
              variant="outline" 
              onClick={onBack}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

// ============= VIEW POST COMPONENT =============
function ViewPost({ post, comments, onBack, onEdit, onDelete, onCommentAdded, onCommentDeleted, currentUserUid }) {
  const [newComment, setNewComment] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const { profile } = useAuth()

  const isPostOwner = post.authorUid === currentUserUid

  const handleAddComment = async (e) => {
    e.preventDefault()
    
    if (!newComment.trim()) {
      alert('Comment cannot be empty')
      return
    }

    if (!profile?.uid) {
      alert('You must be logged in to comment')
      return
    }

    setIsSubmittingComment(true)

    try {
      const comment = {
        id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: newComment.trim(),
        author: profile?.name || 'User',
        authorUid: profile?.uid,
        createdAt: Timestamp.now()
      }

      const commentRef = doc(db, 'blog_comments', post.id)
      const commentDoc = await getDoc(commentRef)

      if (commentDoc.exists()) {
        await updateDoc(commentRef, {
          comments: arrayUnion(comment)
        })
      } else {
        await setDoc(commentRef, {
          comments: [comment]
        })
      }

      setNewComment('')
      onCommentAdded(post.id)
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('Failed to add comment. Please try again.')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleDeleteComment = async (commentId, commentAuthorUid) => {
    // Only allow deletion if user is comment owner or post owner
    if (commentAuthorUid !== currentUserUid && !isPostOwner) {
      alert('You can only delete your own comments')
      return
    }

    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      const commentRef = doc(db, 'blog_comments', post.id)
      const commentDoc = await getDoc(commentRef)
      
      if (!commentDoc.exists()) return

      const existingComments = commentDoc.data().comments || []
      const updatedComments = existingComments.filter(c => c.id !== commentId)
      
      await setDoc(commentRef, { comments: updatedComments })
      onCommentDeleted(post.id, commentId)
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('Failed to delete comment. Please try again.')
    }
  }

  const postComments = comments[post.id] || []
  const shouldTruncate = (post.content || '').length > 300

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Posts
      </Button>

      <Card className="overflow-hidden">
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-96 object-cover"
          />
        )}
        
        <div className="p-8 space-y-6">
          {/* Post Header */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span>✍️ {post.author}</span>
              <span>•</span>
              <span>📅 {formatDate(post.createdAt)}</span>
              {post.updatedAt && (
                <>
                  <span>•</span>
                  <span>Updated: {formatDate(post.updatedAt)}</span>
                </>
              )}
            </div>

            <span className="inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>

          {/* Action Buttons - Only show if user is post owner */}
          {isPostOwner && (
            <div className="flex gap-2 border-t border-b border-gray-200 dark:border-gray-700 py-4">
              <Button
                variant="outline"
                onClick={() => onEdit(post)}
                className="flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Post
              </Button>
              <Button
                variant="destructive"
                onClick={() => onDelete(post.id)}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Post
              </Button>
            </div>
          )}

          {/* Post Content */}
          <div className="text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none text-lg leading-relaxed">
            <div
              dangerouslySetInnerHTML={{ 
                __html: isExpanded || !shouldTruncate
                  ? renderContent(post.content)
                  : renderContent((post.content || '').substring(0, 300)) + '...'
              }}
            />
            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium mt-4"
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white text-xl font-semibold">
              <MessageCircle className="w-6 h-6" />
              <span>Comments ({postComments.length})</span>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="space-y-3">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="resize-none"
                disabled={isSubmittingComment}
              />
              <Button 
                type="submit"
                disabled={isSubmittingComment || !newComment.trim()}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
              </Button>
            </form>

            {/* Comment List */}
            {postComments.length > 0 ? (
              <div className="space-y-3 mt-6">
                {postComments.map(comment => {
                  const isCommentOwner = comment.authorUid === currentUserUid
                  const canDeleteComment = isCommentOwner || isPostOwner
                  
                  return (
                    <Card key={comment.id} className="p-4">
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {comment.text}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-500 dark:text-gray-400">
                          <span className="font-medium">{comment.author}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(comment.createdAt)}</span>
                        </div>
                        {canDeleteComment && (
                          <button
                            onClick={() => handleDeleteComment(comment.id, comment.authorUid)}
                            className="text-red-500 hover:text-red-700 font-medium"
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
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

// ============= MAIN BLOG PAGE COMPONENT =============
export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [comments, setComments] = useState({})
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState('list')
  const [selectedPost, setSelectedPost] = useState(null)
  const { profile } = useAuth()

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPosts(posts)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = posts.filter(post => 
        (post.title || '').toLowerCase().includes(query) ||
        (post.content || '').toLowerCase().includes(query) ||
        (post.category || '').toLowerCase().includes(query) ||
        (post.author || '').toLowerCase().includes(query)
      )
      setFilteredPosts(filtered)
    }
  }, [searchQuery, posts])

  const loadData = async () => {
    setLoading(true)
    try {
      const postsSnapshot = await getDocs(collection(db, 'blog_posts'))
      const postsData = postsSnapshot.docs.map(d => {
        const data = d.data()
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate?.() || (data.updatedAt ? new Date(data.updatedAt) : null)
        }
      })
      
      postsData.sort((a, b) => b.createdAt - a.createdAt)
      setPosts(postsData)
      setFilteredPosts(postsData)

      const commentsSnapshot = await getDocs(collection(db, 'blog_comments'))
      const commentsMap = {}
      commentsSnapshot.docs.forEach(d => {
        const data = d.data()
        commentsMap[d.id] = (data.comments || []).map(c => ({
          ...c,
          createdAt: c.createdAt?.toDate?.() || new Date(c.createdAt)
        }))
      })
      setComments(commentsMap)
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Failed to load blog posts. Please check your Firestore configuration.')
    } finally {
      setLoading(false)
    }
  }
  const handleDeletePost = async (id, postAuthorUid) => {
    // Check if user is the post owner
    if (postAuthorUid !== profile?.uid) {
      alert('You can only delete your own posts')
      return
    }

    if (!confirm('Are you sure you want to delete this post?')) return
    
    try {
      await deleteDoc(doc(db, 'blog_posts', id))
      await deleteDoc(doc(db, 'blog_comments', id))

      const newPosts = posts.filter(post => post.id !== id)
      const newComments = { ...comments }
      delete newComments[id]
      
      setPosts(newPosts)
      setFilteredPosts(newPosts)
      setComments(newComments)
      
      if (currentView === 'view') {
        setCurrentView('list')
      }
      
      alert('Post deleted successfully!')
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post. Please try again.')
    }
  }

  const handleCommentAdded = (postId) => {
    loadData() // Reload to get updated comments
  }

  const handleCommentDeleted = (postId, commentId) => {
    const newComments = {
      ...comments,
      [postId]: comments[postId].filter(c => c.id !== commentId)
    }
    setComments(newComments)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading blog posts...</p>
        </div>
      </div>
    )
  }

  // Render based on current view
  if (currentView === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <CreatePost 
          onBack={() => setCurrentView('list')}
          onPostCreated={loadData}
        />
      </div>
    )
  }

  if (currentView === 'edit' && selectedPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <EditPost 
          post={selectedPost}
          onBack={() => {
            setCurrentView('list')
            setSelectedPost(null)
          }}
          onPostUpdated={loadData}
        />
      </div>
    )
  }

  if (currentView === 'view' && selectedPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <ViewPost 
          post={selectedPost}
          comments={comments}
          currentUserUid={profile?.uid}
          onBack={() => {
            setCurrentView('list')
            setSelectedPost(null)
          }}
          onEdit={(post) => {
            setSelectedPost(post)
            setCurrentView('edit')
          }}
          onDelete={(postId) => handleDeletePost(postId, selectedPost.authorUid)}
          onCommentAdded={handleCommentAdded}
          onCommentDeleted={handleCommentDeleted}
        />
      </div>
    )
  }

  // List view (default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-3 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            ✈️ Travel Blog
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your adventures and discover stories from around the world
          </p>
        </div>

        {/* Search Bar */}
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search posts by title, content, category, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-2">
              Found {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
            </p>
          )}
        </Card>

        {/* New Post Button */}
        <div className="flex justify-end">
          <Button 
            onClick={() => setCurrentView('create')}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            + New Post
          </Button>
        </div>

        {/* Blog Posts List */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ? 'No posts found matching your search.' : 'No posts yet. Be the first to share your travel story!'}
              </p>
            </Card>
          ) : (
            filteredPosts.map((post) => (
              <Card 
                key={post.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedPost(post)
                  setCurrentView('view')
                }}
              >
                <div className="flex flex-col md:flex-row">
                  {post.imageUrl && (
                    <div className="md:w-1/3">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className={`p-6 ${post.imageUrl ? 'md:w-2/3' : 'w-full'}`}>
                    <div className="space-y-3">
                      {/* Post Header */}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                          {post.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                          <span>✍️ {post.author}</span>
                          <span>•</span>
                          <span>📅 {formatDate(post.createdAt)}</span>
                          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Post Preview */}
                      <div className="text-gray-700 dark:text-gray-300">
                        <div
                          dangerouslySetInnerHTML={{ 
                            __html: renderContent((post.content || '').substring(0, 150)) + ((post.content || '').length > 150 ? '...' : '')
                          }}
                        />
                      </div>

                      {/* Post Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                          <MessageCircle className="w-4 h-4" />
                          <span>{(comments[post.id] || []).length} comments</span>
                        </div>
                        
                        {/* Only show edit/delete buttons if user is post owner */}
                        {post.authorUid === profile?.uid && (
                          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedPost(post)
                                setCurrentView('edit')
                              }}
                              className="flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeletePost(post.id, post.authorUid)
                              }}
                              className="flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}