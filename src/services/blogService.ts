import { Blog, BlogFormData, PaginatedResponse } from '../types';
import { format } from 'date-fns';

// Simulated blogs database
let blogs: Blog[] = [
  {
    id: '1',
    title: 'Getting Started with React and TypeScript',
    content: `
      <p>TypeScript has become an essential tool for React developers. In this post, we'll explore how to set up a new React project with TypeScript and the benefits it brings to your development workflow.</p>
      
      <h2>Why TypeScript with React?</h2>
      
      <p>TypeScript adds static type-checking to your React components, helping you catch errors early in the development process. It also provides better IDE support, making it easier to understand component props and state.</p>
      
      <h2>Setting up a new project</h2>
      
      <p>Create React App has built-in support for TypeScript. You can start a new project with:</p>
      
      <pre><code>npx create-react-app my-app --template typescript</code></pre>
      
      <p>This will set up a new React project with TypeScript configuration already in place.</p>
      
      <h2>Converting existing components</h2>
      
      <p>For existing React components, you'll want to convert .js files to .tsx and add appropriate type annotations. React provides built-in types for many common patterns.</p>
      
      <h2>Conclusion</h2>
      
      <p>Using TypeScript with React improves code quality and developer experience. The initial learning curve is worth the long-term benefits of type safety and improved tooling.</p>
    `,
    excerpt: 'Learn how to set up and use TypeScript with React for type-safe component development.',
    author: {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      createdAt: '2023-01-15T00:00:00Z',
    },
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-01-15T14:45:00Z',
    readTime: 5,
  },
  {
    id: '2',
    title: 'Building Responsive UIs with Tailwind CSS',
    content: `
      <p>Tailwind CSS has revolutionized the way developers approach styling web applications. This utility-first CSS framework provides low-level utility classes that let you build completely custom designs without ever leaving your HTML.</p>
      
      <h2>Why Tailwind CSS?</h2>
      
      <p>Traditional CSS frameworks like Bootstrap provide pre-designed components that often require customization to match your design. Tailwind takes a different approach by providing utility classes that you compose to build your own designs from scratch.</p>
      
      <h2>Getting Started</h2>
      
      <p>To add Tailwind to your project, you can install it via npm:</p>
      
      <pre><code>npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p</code></pre>
      
      <p>Then configure your template paths in the tailwind.config.js file:</p>
      
      <pre><code>module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}</code></pre>
      
      <h2>Building Responsive Designs</h2>
      
      <p>Tailwind makes responsive design simple with breakpoint prefixes. For example:</p>
      
      <pre><code>&lt;div class="text-sm md:text-base lg:text-lg"&gt;
  This text changes size at different breakpoints
&lt;/div&gt;</code></pre>
      
      <h2>Conclusion</h2>
      
      <p>Tailwind CSS provides a different approach to styling that can significantly speed up your development process once you become familiar with the utility classes.</p>
    `,
    excerpt: 'Discover how to build beautiful, responsive UIs with the utility-first approach of Tailwind CSS.',
    author: {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      createdAt: '2023-01-15T00:00:00Z',
    },
    createdAt: '2023-02-10T08:15:00Z',
    updatedAt: '2023-02-12T11:20:00Z',
    readTime: 7,
  }
];

// Get all blogs with pagination
export const getBlogs = async (page = 1, perPage = 10): Promise<PaginatedResponse<Blog>> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginatedBlogs = blogs.slice(start, end);
  
  return {
    data: paginatedBlogs,
    meta: {
      currentPage: page,
      totalPages: Math.ceil(blogs.length / perPage),
      totalItems: blogs.length,
      perPage,
    },
  };
};

// Get a single blog by ID
export const getBlogById = async (id: string): Promise<Blog> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const blog = blogs.find(blog => blog.id === id);
  
  if (!blog) {
    throw new Error('Blog not found');
  }
  
  return blog;
};

// Create a new blog
export const createBlog = async (userId: string, data: BlogFormData): Promise<Blog> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find author
  const user = {
    id: userId,
    name: 'Demo User',
    email: 'demo@example.com',
    createdAt: '2023-01-01T00:00:00Z',
  };
  
  // Calculate read time based on content length (simplified)
  const wordCount = data.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200)); // Assume 200 words per minute
  
  const now = new Date();
  
  const newBlog: Blog = {
    id: Math.random().toString(36).substr(2, 9),
    title: data.title,
    content: data.content,
    excerpt: data.excerpt || data.content.substring(0, 150) + '...',
    author: user,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    readTime,
  };
  
  blogs.unshift(newBlog); // Add to start of array
  
  return newBlog;
};

// Update an existing blog
export const updateBlog = async (id: string, userId: string, data: BlogFormData): Promise<Blog> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const blogIndex = blogs.findIndex(blog => blog.id === id);
  
  if (blogIndex === -1) {
    throw new Error('Blog not found');
  }
  
  const blog = blogs[blogIndex];
  
  // Check if user is the author (authorization)
  if (blog.author.id !== userId) {
    throw new Error('Unauthorized: You can only edit your own blogs');
  }
  
  // Calculate read time based on content length (simplified)
  const wordCount = data.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200)); // Assume 200 words per minute
  
  // Update the blog
  const updatedBlog: Blog = {
    ...blog,
    title: data.title,
    content: data.content,
    excerpt: data.excerpt || data.content.substring(0, 150) + '...',
    updatedAt: new Date().toISOString(),
    readTime,
  };
  
  blogs[blogIndex] = updatedBlog;
  
  return updatedBlog;
};

// Delete a blog
export const deleteBlog = async (id: string, userId: string): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const blogIndex = blogs.findIndex(blog => blog.id === id);
  
  if (blogIndex === -1) {
    throw new Error('Blog not found');
  }
  
  const blog = blogs[blogIndex];
  
  // Check if user is the author (authorization)
  if (blog.author.id !== userId) {
    throw new Error('Unauthorized: You can only delete your own blogs');
  }
  
  // Remove the blog
  blogs = blogs.filter(blog => blog.id !== id);
};

// Get blogs by author
export const getBlogsByAuthor = async (userId: string): Promise<Blog[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return blogs.filter(blog => blog.author.id === userId);
};

// Format date helper function
export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM d, yyyy');
};