import { useEffect, useState } from 'react';
import { getBlogs } from '../../services/blogService';
import { Blog, PaginatedResponse } from '../../types';
import BlogCard from '../../components/blog/BlogCard';
import Pagination from '../../components/blog/Pagination';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Search } from 'lucide-react';

const BlogListPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const response = await getBlogs(currentPage, 10);
        setBlogs(response.data);
        setTotalPages(response.meta.totalPages);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger an API search request
    console.log('Searching for:', searchTerm);
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container-wide">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Articles</h1>
          <p className="text-gray-600">Discover ideas, insights, and inspiration</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex w-full max-w-lg">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="ml-2 btn btn-primary"
            >
              Search
            </button>
          </form>
        </div>

        {isLoading ? (
          <div className="py-12 text-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : blogs.length > 0 ? (
          <>
            {/* Blog Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {blogs.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
            
            {/* Pagination */}
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">
              Try adjusting your search or check back later for new content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;