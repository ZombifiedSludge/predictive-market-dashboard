import { Component } from 'solid-js';

const Blog: Component = () => {
  return (
    <div class="h-screen w-full flex">
      {/* Main content area - left side */}
      <div class="w-[70%] h-full overflow-y-auto p-6">
        {/* This is where articles will be displayed */}
        <div class="space-y-6">
          {/* Placeholder for articles */}
          <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
            <h1 class="text-2xl font-semibold text-navy-900 mb-4">Select an Article</h1>
            <p class="text-gray-600">Choose an article from the table of contents...</p>
          </div>
        </div>
      </div>

      {/* Table of contents - right side */}
      <div class="w-[30%] p-6">
        <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6 sticky top-6" style="max-height: 33vh;">
          <h2 class="text-xl font-semibold text-navy-900 mb-4">Table of Contents</h2>
          {/* Table of contents component will go here */}
        </div>
      </div>
    </div>
  );
};

export default Blog;
