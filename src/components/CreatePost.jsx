import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [showPosts, setShowPosts] = useState(false);
  const [tagsError, setTagsError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      // Validate tags: only allow comma-separated words (letters, numbers, hyphens, underscores)
      const tagsRegex = /^([a-zA-Z0-9_-]+)(,\s*[a-zA-Z0-9_-]+)*$/;
      if (value === '' || tagsRegex.test(value)) {
        setTagsError('');
      } else {
        setTagsError('Tags must be comma-separated words (e.g., tag1,tag2,tag3)');
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tagsError) {
      setMessage('Please fix the tags format before submitting');
      setIsError(true);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('https://backendforpost.onrender.com', {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      });
      setMessage('Post created successfully!');
      setIsError(false);
      setFormData({ title: '', content: '', tags: '' });
      setPosts([response.data.post, ...posts]);
      setShowPosts(true);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to create post');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePosts = () => {
    setShowPosts(!showPosts);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 space-y-8 transform transition-all duration-300 hover:shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Create a New Post
          </h2>
          <p className="mt-2 text-sm text-gray-500">Share your thoughts with the world</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your post title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Write your post content..."
                rows="8"
                value={formData.content}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                className={`w-full px-4 py-3 rounded-lg border ${tagsError ? 'border-red-500' : 'border-gray-200'} bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
                placeholder="Enter tags (comma-separated, e.g., tag1,tag2)"
                value={formData.tags}
                onChange={handleChange}
              />
              {tagsError && (
                <p className="mt-1 text-sm text-red-500">{tagsError}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || tagsError}
              className={`w-full flex justify-center py-3 px-4 rounded-lg text-white font-medium text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${isLoading || tagsError ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : null}
              {isLoading ? 'Creating...' : 'Create Post'}
            </button>
          </div>

          {message && (
            <div className={`mt-4 text-center text-sm font-medium ${isError ? 'text-red-500' : 'text-green-500'}`}>
              {message}
              {!isError && posts.length > 0 && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={togglePosts}
                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    {showPosts ? 'Hide Posts' : 'Show Posted Content'}
                  </button>
                  {showPosts && (
                    <div className="mt-4 max-h-64 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200">
                      {posts.map((post) => (
                        <div key={post.id} className="mb-4 last:mb-0">
                          <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                          <p className="text-gray-700">{post.content}</p>
                          <div className="mt-2">
                            <span className="text-sm text-gray-500">Tags: </span>
                            {post.tags.map((tag, index) => (
                              <span key={index} className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mr-2">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Posted on: {new Date(post.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreatePost;