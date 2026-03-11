"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, X, Trash2, Edit2, MessageCircle, Plus } from 'lucide-react'
import { db } from '@/lib/config/firebase'
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { useAuth } from '@/providers/useAuth'
import { logActivity } from '@/lib/services/logActivity'
import { formatDate, renderContent } from '@/lib/utils/blogHelpers'

const BlogListPage = ()=>{
  const router = useRouter()
  const { profile } = useAuth()

  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [comments, setComments] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    if (!searchQuery.trim()) return setFilteredPosts(posts)
    const q = searchQuery.toLowerCase()
    setFilteredPosts(
      posts.filter(
        (p) =>
          (p.title || '').toLowerCase().includes(q) ||
          (p.content || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q) ||
          (p.author || '').toLowerCase().includes(q)
      )
    )
  }, [searchQuery, posts])

  const loadData = async () => {
    setLoading(true)
    try {
      const postsSnap = await getDocs(collection(db, 'blog_posts'))
      const postsData = postsSnap.docs
        .map((d) => {
          const data = d.data()
          return {
            id: d.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate?.() || (data.updatedAt ? new Date(data.updatedAt) : null),
          }
        })
        .sort((a, b) => b.createdAt - a.createdAt)

      setPosts(postsData)
      setFilteredPosts(postsData)

      const commentsSnap = await getDocs(collection(db, 'blog_comments'))
      const commentsMap = {}
      commentsSnap.docs.forEach((d) => {
        commentsMap[d.id] = (d.data().comments || []).map((c) => ({
          ...c,
          createdAt: c.createdAt?.toDate?.() || new Date(c.createdAt),
        }))
      })
      setComments(commentsMap)
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Failed to load blog posts.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (e, postId, postAuthorUid) => {
    e.stopPropagation()
    if (postAuthorUid !== profile?.uid) return alert('You can only delete your own posts')
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await deleteDoc(doc(db, 'blog_posts', postId))
      await deleteDoc(doc(db, 'blog_comments', postId))
      await logActivity({
        userId: profile?.uid,
        action: 'DELETE',
        entity: 'BLOG',
        entityId: postId,
        metadata: { postId },
      })
      const updated = posts.filter((p) => p.id !== postId)
      setPosts(updated)
      setFilteredPosts(updated)
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading blog posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-3 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">✈️ Travel Blog</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your adventures and discover stories from around the world
          </p>
        </div>

        {/* Search + New Post */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Card className="flex-1 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by title, content, category or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-xs text-gray-500 mt-1 pl-1">
                {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''}
              </p>
            )}
          </Card>

          <Button
            onClick={() => router.push('/zone/create')}
            className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2 h-fit self-start mt-1 px-5 py-3"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </div>

        {/* Posts Grid */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {searchQuery
                  ? 'No posts found matching your search.'
                  : 'No posts yet. Be the first to share your travel story!'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => router.push('/zone/create')}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                >
                  Write First Post
                </Button>
              )}
            </Card>
          ) : (
            filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/zone/${post.id}/view`)}
              >
                <div className="flex flex-col md:flex-row">
                  {post.imageUrl && (
                    <div className="md:w-1/3 shrink-0">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                  )}

                  <div className={`p-6 flex flex-col justify-between gap-3 ${post.imageUrl ? 'md:w-2/3' : 'w-full'}`}>
                    {/* Top */}
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>✍️ {post.author}</span>
                        <span>•</span>
                        <span>📅 {formatDate(post.createdAt)}</span>
                        <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                      </div>
                      <div
                        className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html:
                            renderContent((post.content || '').substring(0, 160)) +
                            ((post.content || '').length > 160 ? '...' : ''),
                        }}
                      />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm">
                        <MessageCircle className="w-4 h-4" />
                        <span>{(comments[post.id] || []).length} comments</span>
                      </div>

                      {post.authorUid === profile?.uid && (
                        <div
                          className="flex gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/zone/${post.id}/edit`)
                            }}
                            className="flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => handleDelete(e, post.id, post.authorUid)}
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
              </Card>
            ))
          )}
        </div>

      </div>
    </div>
  )
}

export default BlogListPage;