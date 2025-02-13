import { Component, createSignal } from 'solid-js';
import Article1 from './Articles/Article1';

const Blog: Component = () => {
  // Signal to track which article is currently selected
  const [currentArticle, setCurrentArticle] = createSignal('article1');

  return (
    <div class="h-screen w-full flex">
      {/* Main content area - left side */}
      <div class="w-[80%] h-full overflow-y-auto p-6">
        <div class="space-y-6">
          {/* Display current article */}
          {currentArticle() === 'article1' && <Article1 />}
          {/* Add more article conditions here as you add more articles */}
        </div>
      </div>

      {/* Table of contents - right side */}
      <div class="w-[20%] p-6">
        <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6 sticky top-6" style="max-height: 33vh;">
          <h2 class="text-xl font-semibold text-navy-900 mb-4">Table of Contents</h2>
          <div class="overflow-y-auto" style="max-height: calc(33vh - 4rem)">
            <div class="space-y-2">
              <p 
                class="text-gray-600 hover:text-blue-600 cursor-pointer"
                onClick={() => setCurrentArticle('article1')}
              >
                3 Signs You're Making Stock Picks the Wrong Way
              </p>
              {/* Add more article titles here as you create them */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
