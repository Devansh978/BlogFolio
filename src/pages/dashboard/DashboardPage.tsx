import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'react-toastify';

import { Blog } from '../../types';
import { getBlogsByAuthor, formatDate, deleteBlog } from '../../services/blogService';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const DashboardPage = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const data = await getBlogsByAuthor(user.id);
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching user blogs:', error);
        toast.error('Failed to load your blogs');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserBlogs();
  }, [user]);
  
  const handleDelete = async (blogId: string) => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      setDeleteLoading(blogId);
      try {
        await deleteBlog(blogId, user.id);
        setBlogs(blogs.filter(blog => blog.id !== blogId));
        toast.success('Blog deleted successfully');
      } catch (error) {
        console.error('Error deleting blog:', error);
        toast.error('Failed to delete blog');
      } finally {
        setDeleteLoading(null);
      }
    }
  };
  
  return (
    <div className="bg-gray-50 py-12">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
            <p className="text-gray-600">Manage your blog posts</p>
          </div>
          <Link to="/blogs/new" className="btn btn-primary mt-4 md:mt-0 inline-flex">
            <Plus size={18} />
            <span>New Blog Post</span>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : blogs.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogs.map(blog => (
                    <tr key={blog.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {blog.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(blog.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Published
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link 
                            to={`/blogs/${blog.id}`}
                            className="text-gray-600 hover:text-primary-600 p-1"
                            title="View"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link 
                            to={`/blogs/edit/${blog.id}`}
                            className="text-gray-600 hover:text-primary-600 p-1"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(blog.id)}
                            className="text-gray-600 hover:text-error-600 p-1"
                            title="Delete"
                            disabled={deleteLoading === blog.id}
                          >
                            {deleteLoading === blog.id ? (
                              <LoadingSpinner size="sm\" color="text-error-600" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-2">You haven't created any blogs yet</h3>
            <p className="text-gray-600 mb-6">
              Start sharing your ideas by creating your first blog post.
            </p>
            <Link to="/blogs/new" className="btn btn-primary inline-flex">
              <Plus size={18} />
              <span>Create your first blog</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;