import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

import { BlogFormData } from '../../types';
import { getBlogById, createBlog, updateBlog } from '../../services/blogService';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Form validation schema
const blogSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  content: z.string()
    .min(50, 'Content must be at least 50 characters'),
  excerpt: z.string()
    .max(160, 'Excerpt cannot exceed 160 characters')
    .optional(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

const BlogEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = Boolean(id);
  
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors, isDirty } 
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
    },
  });
  
  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const blog = await getBlogById(id);
        
        // Check if user is the author
        if (user?.id !== blog.author.id) {
          toast.error("You don't have permission to edit this blog");
          navigate('/dashboard');
          return;
        }
        
        reset({
          title: blog.title,
          content: blog.content,
          excerpt: blog.excerpt,
        });
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast.error('Failed to load blog');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isEditMode) {
      fetchBlog();
    } else {
      setIsLoading(false);
    }
  }, [id, user, navigate, reset, isEditMode]);
  
  const onSubmit = async (data: BlogFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      if (isEditMode && id) {
        await updateBlog(id, user.id, data);
        toast.success('Blog updated successfully');
      } else {
        const newBlog = await createBlog(user.id, data);
        toast.success('Blog created successfully');
        navigate(`/blogs/${newBlog.id}`);
        return;
      }
      
      navigate(`/blogs/${id}`);
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error('Failed to save blog');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 py-8">
      <div className="container-narrow">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back
        </button>
        
        <h1 className="text-3xl font-bold mb-8">
          {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                id="title"
                type="text"
                className="form-input"
                placeholder="Enter your blog title"
                {...register('title')}
              />
              {errors.title && (
                <p className="form-error">{errors.title.message}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="excerpt" className="form-label">
                Excerpt <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <textarea
                id="excerpt"
                rows={2}
                className="form-input"
                placeholder="A short summary of your blog (displayed in blog listings)"
                {...register('excerpt')}
              />
              {errors.excerpt && (
                <p className="form-error">{errors.excerpt.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                If left empty, an excerpt will be automatically generated from your content.
              </p>
            </div>
            
            <div className="mb-8">
              <label htmlFor="content" className="form-label">Content</label>
              <textarea
                id="content"
                rows={15}
                className="form-input font-mono"
                placeholder="Write your blog content here (HTML formatting is supported)"
                {...register('content')}
              />
              {errors.content && (
                <p className="form-error">{errors.content.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                You can use HTML tags for formatting (e.g., &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, etc.)
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting || (!isDirty && isEditMode)}
                icon={<Save size={18} />}
              >
                {isEditMode ? 'Update Blog' : 'Publish Blog'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogEditorPage;