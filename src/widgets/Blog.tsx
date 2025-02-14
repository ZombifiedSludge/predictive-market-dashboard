import { Component, createSignal } from 'solid-js';
import Article1 from './Articles/Article1';
import Article2 from './Articles/Article2';
import Article3 from './Articles/Article3';

const Blog: Component = () => {
  const [currentArticle, setCurrentArticle] = createSignal('article1');

  return (
    <div class="h-screen w-full flex">
      {/* Main content area - left side */}
      <div class="w-[80%] h-full overflow-y-auto p-6">
        <div class="space-y-6">
          {currentArticle() === 'article1' && <Article1 />}
          {currentArticle() === 'article2' && <Article2 />}
          {currentArticle() === 'article3' && <Article3 />}
        </div>
      </div>

      {/* Table of contents - right side */}
      <div class="w-[20%] p-6">
        <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6 sticky top-6" style="max-height: 33vh;">
          <h2 class="text-lg font-semibold text-blue-600 mb-4">Table of Contents</h2>
          <div class="overflow-y-auto" style="max-height: calc(33vh - 4rem)">
            <div class="divide-y divide-gray-200">
              <div class="py-3">
                <p 
                  class="text-gray-800 hover:text-blue-600 cursor-pointer"
                  onClick={() => setCurrentArticle('article1')}
                >
                  3 Signs You're Making Stock Picks the Wrong Way
                </p>
              </div>
              <div class="py-3">
                <p 
                  class="text-gray-800 hover:text-blue-600 cursor-pointer"
                  onClick={() => setCurrentArticle('article2')}
                >
                  Dividends or Danger? Insight into 3 High-Yield Stocks
                </p>
              </div>
              <div class="py-3">
                <p 
                  class="text-gray-800 hover:text-blue-600 cursor-pointer"
                  onClick={() => setCurrentArticle('article3')}
                >
                  Accounting for the Dismal Job Market: How Tax Policy is Stifling Software Innovation 
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
