import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="text-xl font-bold text-white">BlogFolio</Link>
            <p className="mt-3 text-gray-400 text-sm">
              A modern blog platform for sharing ideas, stories, and knowledge with the world.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/blogs" className="hover:text-primary-400 transition-colors">Blogs</Link></li>
              <li><Link to="/login" className="hover:text-primary-400 transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-primary-400 transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">API References</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
                <Github />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin />
              </a>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              Subscribe to our newsletter for updates.
            </p>
            <div className="mt-2 flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-3 py-2 bg-gray-800 text-sm rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
              />
              <button className="bg-primary-600 text-white px-3 py-2 rounded-r-md hover:bg-primary-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400">
            © {currentYear} BlogFolio. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center text-sm text-gray-400">
            <span>Made with</span>
            <Heart size={16} className="mx-1 text-error-500" />
            <span>Devansh</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;