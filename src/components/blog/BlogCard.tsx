import { Link } from 'react-router-dom';
import { Clock, Calendar, User } from 'lucide-react';
import { Blog } from '../../types';
import { formatDate } from '../../services/blogService';

interface BlogCardProps {
  blog: Blog;
  className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, className = '' }) => {
  return (
    <div className={`card group h-full flex flex-col ${className}`}>
      <div className="p-6 flex-grow">
        <Link to={`/blogs/${blog.id}`}>
          <h2 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
            {blog.title}
          </h2>
        </Link>
        
        <div className="flex items-center text-sm text-gray-500 mb-4 flex-wrap gap-y-1">
          <div className="flex items-center mr-4">
            <User size={14} className="mr-1" />
            <span>{blog.author.name}</span>
          </div>
          <div className="flex items-center mr-4">
            <Calendar size={14} className="mr-1" />
            <span>{formatDate(blog.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{blog.readTime} min read</span>
          </div>
        </div>
        
        <p className="text-gray-600 line-clamp-3 mb-4">{blog.excerpt}</p>
        
        <Link 
          to={`/blogs/${blog.id}`} 
          className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center group-hover:underline"
        >
          Read more
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;