import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Shield } from 'lucide-react';
import { Blog } from '../types';
import { getBlogs } from '../services/blogService';
import BlogCard from '../components/blog/BlogCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const HomePage = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getBlogs(1, 3);
        setFeaturedBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-narrow py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              Share Your Ideas With The World
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              A modern platform for writers, thinkers, and creators to publish their stories and connect with readers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/blogs" className="btn btn-accent">
                Explore Blogs
              </Link>
              <Link to="/register" className="btn bg-white text-primary-700 hover:bg-primary-50">
                Start Writing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose BlogFolio?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-primary-100 text-primary-600 p-3 rounded-full w-fit mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Elegant Publishing</h3>
              <p className="text-gray-600">
                Our rich text editor makes it easy to create beautiful, well-formatted articles that engage readers.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-secondary-100 text-secondary-600 p-3 rounded-full w-fit mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Grow Your Audience</h3>
              <p className="text-gray-600">
                Connect with readers who care about your unique perspective and expertise.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-accent-100 text-accent-600 p-3 rounded-full w-fit mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Platform</h3>
              <p className="text-gray-600">
                Your content is protected with industry-standard security practices and data protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Featured Articles</h2>
            <Link to="/blogs" className="mt-4 md:mt-0 text-primary-600 font-medium hover:text-primary-700 flex items-center group">
              View all articles
              <ArrowRight size={18} className="ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredBlogs.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-accent-600 to-accent-800 text-white">
        <div className="container-narrow text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to share your story?</h2>
          <p className="text-lg md:text-xl mb-8 text-accent-100 max-w-2xl mx-auto">
            Join our community of writers and readers today. Create an account and start publishing in minutes.
          </p>
          <Link to="/register" className="btn bg-white text-accent-700 hover:bg-accent-50">
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;