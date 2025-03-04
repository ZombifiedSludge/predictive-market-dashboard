import { Component, createSignal, lazy, Suspense } from 'solid-js';

// Lazy load all articles
const Article1 = lazy(() => import('./Articles/Article1'));
const Article2 = lazy(() => import('./Articles/Article2'));
const Article3 = lazy(() => import('./Articles/Article3'));
const Article4 = lazy(() => import('./Articles/Article4'));
const Article5 = lazy(() => import('./Articles/Article5'));
const Article6 = lazy(() => import('./Articles/Article6'));
const Article7 = lazy(() => import('./Articles/Article7'));

const Blog: Component = () => {
  const [currentArticle, setCurrentArticle] = createSignal('article4');

  return (
    <div class="h-screen w-full flex">
      {/* Main content area - left side */}
      <div class="w-[80%] h-full overflow-y-auto p-6">
        <Suspense fallback={<div>Loading...</div>}>
          <div class="space-y-6">
            {currentArticle() === 'article4' && <Article4 />}
            {currentArticle() === 'article3' && <Article3 />}
            {currentArticle() === 'article6' && <Article6 />}
            {currentArticle() === 'article5' && <Article5 />}
            {currentArticle() === 'article7' && <Article7 />}
            {currentArticle() === 'article1' && <Article1 />}
            {currentArticle() === 'article2' && <Article2 />}
          </div>
        </Suspense>
      </div>

      {/* Table of contents - right side */}
      <div class="w-[20%] p-6">
        <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6 sticky top-6" style="max-height: 33vh;">
          <h2 class="text-lg font-semibold text-blue-600 mb-4">Table of Contents</h2>
          <div class="overflow-y-auto" style="max-height: calc(33vh - 4rem)">
            <div class="divide-y divide-gray-200">
              <div class="py-3">
                <p 
                  class="text-sm font-bold text-gray-800 hover:text-blue-600 cursor-pointer font-georgia"
                  onClick={() => setCurrentArticle('article4')}
                >
                  Meta's Meteoric Momentum: A Deep Dive into the Company's 10-K
                </p>
              </div>
              <div class="py-3">
                <p 
                  class="text-sm font-bold text-gray-800 hover:text-blue-600 cursor-pointer font-georgia"
                  onClick={() => setCurrentArticle('article3')}
                >
                  Accounting for the Dismal Job Market: How Tax Policy is Stifling Software Innovation 
                </p>
              </div>
              <div class="py-3">
                <p 
                  class="text-sm font-bold text-gray-800 hover:text-blue-600 cursor-pointer font-georgia"
                  onClick={() => setCurrentArticle('article6')}
                >
                  Decoding ASC 606: A Guide to Subscription-Based Revenue Recognition
                </p>
              </div>
              <div class="py-3">
                <p 
                  class="text-sm font-bold text-gray-800 hover:text-blue-600 cursor-pointer font-georgia"
                  onClick={() => setCurrentArticle('article5')}
                >
                  Beyond the Basics: How the Altman Z-Score and Piotroski F-Score Can Transform Your Investment Decisions
                </p>
              </div>
              <div class="py-3">
                <p 
                  class="text-sm font-bold text-gray-800 hover:text-blue-600 cursor-pointer font-georgia"
                  onClick={() => setCurrentArticle('article7')}
                >
                  Flying Through Conflict: American Airlines Pricing Trends Amid the Russia-Ukraine War
                </p>
              </div>
              <div class="py-3">
                <p 
                  class="text-sm font-bold text-gray-800 hover:text-blue-600 cursor-pointer font-georgia"
                  onClick={() => setCurrentArticle('article1')}
                >
                  3 Signs You're Making Stock Picks the Wrong Way
                </p>
              </div>
              <div class="py-3">
                <p 
                  class="text-sm font-bold text-gray-800 hover:text-blue-600 cursor-pointer font-georgia"
                  onClick={() => setCurrentArticle('article2')}
                >
                  Dividends or Danger? Insight into 3 High-Yield Stocks
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
