import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, Edit, Trash2 } from 'lucide-react';

import { Blog } from '../../types';
import { getBlogById, formatDate, deleteBlog } from '../../services/blogService';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-toastify';

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await getBlogById(id);
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        navigate('/404');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlog();
  }, [id, navigate]);
  
  const isAuthor = isAuthenticated && user?.id === blog?.author.id;
  
  const handleDelete = async () => {
    if (!blog || !user) return;
    
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await deleteBlog(blog.id, user.id);
        toast.success('Blog post deleted successfully');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting blog:', error);
        toast.error('Failed to delete blog post');
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!blog) {
    return (
      <div className="container-narrow py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
        <p className="mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link to="/blogs" className="btn btn-primary">
          Back to Blogs
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 py-8">
        <div className="container-narrow">
          <Link 
            to="/blogs" 
            className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to all blogs
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4 mb-4">
            <div className="flex items-center">
              <User size={16} className="mr-1" />
              <span>{blog.author.name}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              <span>{blog.readTime} min read</span>
            </div>
          </div>
          
          {isAuthor && (
            <div className="flex items-center space-x-4 mt-4">
              <Link 
                to={`/blogs/edit/${blog.id}`} 
                className="btn btn-outline text-sm py-1.5 px-3"
              >
                <Edit size={16} />
                <span>Edit</span>
              </Link>
              <Button
                variant="danger"
                size="sm"
                icon={<Trash2 size={16} />}
                onClick={handleDelete}
                isLoading={isDeleting}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <article className="container-narrow py-10">
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
      
      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-narrow text-center">
          <h3 className="text-xl font-semibold mb-4">Enjoyed this article?</h3>
          <div className="flex justify-center gap-4">
            <button className="btn btn-primary">
              Share on Twitter
            </button>
            <button className="btn btn-outline">
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;