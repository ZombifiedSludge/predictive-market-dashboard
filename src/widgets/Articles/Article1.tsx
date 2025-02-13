import { Component } from 'solid-js';

const Article1: Component = () => {
 return (
   <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
     {/* Article Title */}
     <h1 class="text-3xl font-semibold text-navy-900 mb-2 font-georgia">
       3 Signs You're Making Stock Picks the Wrong Way
     </h1>
     
     {/* Publication Date */}
     <p class="text-sm text-gray-500 mb-6">Published March 12, 2023</p>
     
     {/* Article Content */}
     <div class="text-gray-700 font-georgia space-y-6">
       {/* Introduction */}
       <p>
         You do not have to watch CNBC or Fox Business for too long before a financial analyst or hedge fund manager appears, pitching some game-changing new stock to buy. Many people even associate the entire field of finance with finding that one hidden gem that will set them up for life. However, picking individual stocks is often a terrible idea with even worse outcomes. In this article, I will break down some of the most common and costly investment biases in behavioral finance. These psychological biases often spearhead flawed decision-making and leave households in a worse position today than yesterday.
       </p>

       {/* Section 1 */}
       <div class="space-y-4">
         <h2 class="text-xl font-semibold text-navy-900">1. Availability Bias: "I remember something like this before, so it will happen again."</h2>
         <p>
           The availability bias is a shortcut whereby people jump to conclusions based on easily recalled and available events. For instance, someone may immediately think a stock will perform well today solely because they remember it performed well the day before. This bias often results in informational deficiencies because people fail to consider holistic information (financial ratios, analyst reports, market sentiment, industry trends, pro forma financial statements) and instead resort to quick decisions based on what they remember most clearly. Furthermore, decisions may become skewed based on current or recent events rather than complete information because people exhibit recency bias. This tendency further amplifies the short sidedness that plagues retail investors.
         </p>
         <p>Some examples of people exhibiting availability bias include:</p>
         <ul class="list-disc pl-6 space-y-2">
           <li>Someone excessively buying/selling shares of a company after a recent earnings call.</li>
           <li>Someone buying shares of a company solely because of name recognition (think buying General Electric in early 2000s only for it to decline over next few years)</li>
           <li>Someone excessively selling shares of a restaurant company in the wake of a widely publicized E-Coli outbreak</li>
           <li>Someone trying to capitalize off the meme-stock trend in 2021 by buying Reddit suggestions of stocks</li>
         </ul>
         <p>
           In short, investors should never assume they know something off the top of their heads. Furthermore, they should be cautious of overreacting to market news and clickbait sensationalism and avoid making premature decisions. When in doubt, investors should conduct regular portfolio reviews and seek professional guidance, rather than hopping on the newest bandwagon.
         </p>
       </div>

       {/* Section 2 */}
       <div class="space-y-4">
         <h2 class="text-xl font-semibold text-navy-900">2. Escalation of Commitment: "I have done too much to back out now"</h2>
         <p>
           The escalation of commitment, also known as the sunk cost fallacy, is another investment bias whereby investors refuse to consider alternatives even when it is clear they should pivot. Instead of cutting their losses, an investor may double or even triple down on their decision, unwilling to admit defeat. Some reasons people may exhibit this bias include lingering attachments, refusal to be wrong, or the belief that their previous investments will go to waste if they do not continue.
         </p>
         <p>Some examples of exhibiting the sunk cost fallacy include:</p>
         <ul class="list-disc pl-6 space-y-2">
           <li>Someone holding onto a losing stock for too long because of the size of their initial investment.</li>
           <li>Someone refusing to scrap a project because of the time and resources already spent on research and development (e.g., if Apple persisted with trying to make an electric vehicle despite early signs of failure).</li>
           <li>Someone refusing to change their investment strategy or portfolio allocation because they've grown attached to their chosen approach.</li>
         </ul>
         <p>
           In conclusion, investors should not be afraid to cut their losses and acknowledge their mistakes. Admitting when a strategy is no longer working and making the necessary adjustments is far more beneficial in the long run than stubbornly sticking to an unprofitable strategy and hemorrhaging money in the process.
         </p>
       </div>

       {/* Section 3 */}
       <div class="space-y-4">
         <h2 class="text-xl font-semibold text-navy-900">3. Overconfidence Bias: "I've been right before, so I will be right again"</h2>
         <p>
           The overconfidence bias refers to an inflated belief in one's own abilities and knowledge, often leading investors to make poor decisions and take on excessive risks due to a misguided sense of certainty. Yale economist Robert Shiller has observed that people frequently base their decisions about future outcomes on past patterns "without sufficiently considering the underlying reasons for the pattern or the probability of it repeating."[1] In other words, people become overconfident that past patterns will recur, without understanding the patterns themselves or the likelihood of their repetition.
         </p>
         <p>Some examples of people exhibiting overconfidence include:</p>
         <ul class="list-disc pl-6 space-y-2">
           <li>Someone who trades too frequently because they overestimate their ability to identify winning stocks or time the market correctly.</li>
           <li>Someone exclusively buying stocks in the industry they work in, believing their employment gives them an informational edge.</li>
           <li>Someone making massive investments in new IPOs due to success with prior ones, without properly evaluating the underlying company.</li>
           <li>Someone relying on "the eye test" or "gut intuition" rather than solid material indicators and forecasts.</li>
         </ul>
         <p>
           All in all, investors should be honest about their abilities and remain open to new ideas and strategies. In 2021, about 80% of actively managed mutual funds failed to outperform their benchmark.[2] If seasoned, institutional investors with their eyes glued to Bloomberg terminals and advanced statistical software struggle to beat the market, the chances are people at home will struggle mightily too. Overall, investors should strive to expand their knowledge, learn from past mistakes, and realistically assess their abilities rather than take on unnecessary risk.
         </p>
       </div>

       {/* Footnotes */}
       <div class="mt-12 pt-6 border-t border-gray-200">
         <h3 class="text-lg font-semibold text-navy-900 mb-4">References</h3>
         <div class="space-y-2 text-sm text-gray-600">
           <p>
             [1] Goodreads, "Another aspect of overconfidence is that people tend to make," accessed February 12, 2025, 
             <a href="https://www.goodreads.com/quotes/11897320-another-aspect-of-overconfidence-is-that-people-tend-to-make" 
                class="text-blue-600 hover:text-blue-800 hover:underline">
               https://www.goodreads.com/quotes/11897320-another-aspect-of-overconfidence-is-that-people-tend-to-make
             </a>
           </p>
           <p>
             [2] Stewart, "Why Index Funds Are Often a Better Bet Than Active Funds," March 21, 2022, 
             <a href="https://www.cnbc.com/2022/03/21/why-index-funds-are-often-a-better-bet-than-active-funds.html" 
                class="text-blue-600 hover:text-blue-800 hover:underline">
               https://www.cnbc.com/2022/03/21/why-index-funds-are-often-a-better-bet-than-active-funds.html
             </a>
           </p>
         </div>
       </div>
     </div>
   </div>
 );
};

export default Article1;
