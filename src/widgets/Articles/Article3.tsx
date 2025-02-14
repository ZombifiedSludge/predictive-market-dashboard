import { Component } from 'solid-js';

const Article3: Component = () => {
 return (
   <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
     {/* Article Title */}
     <h1 class="text-3xl font-semibold text-navy-900 mb-2">
       Accounting for the Dismal Job Market: How Tax Policy is Stifling Software Innovation and Jobs
     </h1>
     
     {/* Publication Date */}
     <p class="text-sm text-gray-500 mb-4">Published November 15th, 2024</p>

   {/* Header Image - more panoramic ratio */}
<div class="w-full h-48 mb-6">
  <img 
    src="fredjobpostings.png" 
    alt="FRED Job Postings Graph" 
    class="w-full h-full object-contain rounded-lg"
  />
</div>
     
     {/* Article Content */}
     <div class="text-gray-700 font-georgia space-y-6">
       {/* Introduction */}
       <p>
         When I began searching for college majors just a few short years ago, computer science seemed to be all the craze among my peers. The career path was consistently ranked among the highest-paying and most employable fields for college graduates. In the eyes of many, Silicon Valley had supplanted Wall Street as the target destination for the nation's highest-achieving and most technically focused young adults. Fast forward a few years, and the reality has become far bleaker. The Internet is now littered with horror stories of students applying to hundreds of internships just to land a single offer. In 2023, most of Big Tech underwent massive layoffs, with over 6% of Alphabet's workforce being shown the door as other companies followed suit. According to the American Enterprise Institute, the number of open software engineering jobs has declined from over 100,000 in 2022 to just 60,000 today [1]. The Federal Reserve of St. Louis corroborates this trend, showing a steady decrease in seasonally adjusted software developer job postings over the past three years [2].
       </p>
       <p>
         Many attribute this decline to pandemic over hiring, AI growth, or economic uncertainty. One frequently overlooked factor, however, has nothing to do with Python or JavaScript and everything to do with debits and credits. In this article, I will explain how Section 174's accounting changes have crippled software developer job openings and why amending the policy could revitalize hiring in VC startups and technological firms.
       </p>

       {/* Section 174 Explanation */}
       <h2 class="text-xl font-semibold text-navy-900">What is Section 174 and why does it matter?</h2>
       
     {/* Embedded Image - smaller and wrapped */}
<div class="float-right ml-6 mb-6 w-1/4">
  <img 
    src="section174.png" 
    alt="Section 174 Diagram" 
    class="rounded-lg shadow-md"
  />
</div>
       
       <p>
         Section 174 of the Internal Revenue Code is a portion of American tax law that revolves around research and development expenses. Section 174 defines what qualifies as research and development and classifies expenses such as laboratory and experimental salaries, models, overhead, and materials as qualifying R&D costs. Historically, according to ASC 730, the treatment of research and development costs (capitalization or expense) depended on the nature of the expenditures. Costs were typically expensed as incurred, but some with an alternative future use (facilities, materials, etc.) were capitalizable. According to PricewaterhouseCoopers memos, taxpayers formally had a choice to either deduct research expenses immediately, amortize them over a determinable useful life, or defer the costs over five years or longer [3].
       </p>
       <p>
         Now, however, the 2017 Tax Cuts and Jobs Act eliminated the option to deduct R&D expenses immediately in favor of amortizing them. Beginning in 2022, firms had to amortize any R&D expense over 5 years (15 years for businesses outside the United States) rather than deducting them immediately. The adjustment, frequently lambasted as one of the most radical and incendiary portions of the act, had widespread implications for software businesses and their tax accounting.
       </p>

       <p>
         The intricacies of this policy can be quite tricky and overwhelming, to the point where the government had to release additional guidance for clarification. That said, I'll outline a barebones example to show how this policy can disrupt software development businesses. According to Thomson Reuters, all expenses incurred in connection with software development must theoretically be amortized because of this amendment [4]. Therefore, software companies can no longer deduct massive expenses, including the salaries of their software developers, from their taxable income. Here is why this matters:
       </p>

       <p>
         Imagine a software company with $10,000,000 in annual revenue and $5,000,000 in employee salaries. For simplicity's sake, assume the corporate tax rate is 20%. Before 2022, the company could immediately deduct the salary expense from their taxable income. In this case, their taxable income would be $5,000,000, and their income taxes payable would be $1,000,000. After 2022, the firm would have to amortize that $5,000,000 for 5 years, resulting in an annual amortization expense of $1,000,000. Now, the enterprise's taxable income is $9,000,000, and its income taxes payable is $1,800,000. With the wave of a wand from the federal government, the firm's taxable income skyrocketed by $800,000 without any material change in operations, investment, or financing. How will the company respond to this hike? The easiest way would be to reduce salaries and expenses by laying some people off, which, by the looks of it, is what many firms did.
       </p>

       <p>
         The effect of this policy was overwhelmingly apparent. For instance, Salesforce's 10-K explicitly states that the policy increased their cash taxes paid in 2023. The proof is in the pudding: the software giant's provision for income taxes rose dramatically from $88 million to $452 million in just one year [5]. The policy, however, is even more detrimental to start-up companies that do not have the capital to weather these downturns or seek other channels such as international offices. Over time, the amortization expense will be deducted from taxable income, any deferred tax assets will be recognized, and the aggregate effects will be smoothed over a longer period. Therefore, large-cap companies are disrupted by the policy, but they can manage it over time. Meanwhile, many start-ups depend on the tax savings from deducting employee salaries immediately. The fledgling firms, already cash-strapped from initial investments, cannot afford to disburse more precious money for income taxes while trying to establish themselves. This will drive founders to seek workarounds, such as incorporating in more business-friendly countries like Switzerland (which allows software development salaries to be expensed at 135% in the year they are incurred), purchasing existing software from outside suppliers, or even selling their business to foreign enterprises [6]. Some entrepreneurs may avoid starting a business altogether! The unexpectedly high tax bills faced by Fortune 500 software companies are discernible and solvable, but the trickle-down effects of lost jobs, shuttered start-ups, and stifled innovation due to such a flagrantly flawed policy will likely never be fully known.
       </p>

       <h2 class="text-xl font-semibold text-navy-900">Where do we go from here?</h2>
       <p>
         The good news is that the policy is so bad that even Congress wants to reverse it. After all, the policy has led to mass layoffs, fewer start-ups being incorporated in the United States, and companies opting to purchase existing software (possibly from abroad) rather than developing their own. In an era dominated by artificial intelligence and budding competition with China in the world's next space race, does Congress want entrepreneurs to seek more hospitable business environments overseas? Does the federal government really want a wave of computer science graduates to go to waste? The bipartisan American Innovation and Jobs Act, co-sponsored by Senators Maggie Hassan and Todd Young, has made reversing the amortization requirement a key priority. The National Association of Manufacturers has also strongly advocated for the return of immediate R&D tax deductions. Time will tell if these pleas fall on deaf ears—many had expected the policy to be reversed years ago. In the meantime, software companies will continue to struggle with burdensome tax bills, while unemployed developers are left scouring job boards, hoping for new opportunities.
       </p>

       {/* References */}
       <div class="mt-12 pt-6 border-t border-gray-200">
         <h3 class="text-lg font-semibold text-navy-900 mb-4">References</h3>
         <div class="space-y-2 text-sm text-gray-600">
           <p>
             [1] "Decoding the Software Engineering Job Market," American Enterprise Institute, 
             <a href="https://www.aei.org/domestic-policy/decoding-the-software-engineering-job-market/" 
                class="text-blue-600 hover:text-blue-800 hover:underline">
               https://www.aei.org/domestic-policy/decoding-the-software-engineering-job-market/
             </a>
             (accessed November 15, 2024).
           </p>
           <p>
             [2] Federal Reserve Bank of St. Louis, "IHLIDXUSTPSOFTDEVE," Federal Reserve Economic Data (FRED), 
             <a href="https://fred.stlouisfed.org/series/IHLIDXUSTPSOFTDEVE" 
                class="text-blue-600 hover:text-blue-800 hover:underline">
               https://fred.stlouisfed.org/series/IHLIDXUSTPSOFTDEVE
             </a>
             (accessed November 15, 2024).
           </p>
           <p>
             [3] PricewaterhouseCoopers, "State Corporate Tax Implications of Section 174 Changes for 2022," PwC, 
             <a href="https://www.pwc.com/us/en/services/tax/library/state-corporate-tax-implications-of-section-174-changes-for-2022.html" 
                class="text-blue-600 hover:text-blue-800 hover:underline">
               https://www.pwc.com/us/en/services/tax/library/state-corporate-tax-implications-of-section-174-changes-for-2022.html
             </a>
             (accessed November 15, 2024).
           </p>
           <p>
             [4] Thomson Reuters, "Section 174 Considerations," 
             <a href="https://www.thomsonreuters.com/en-us/posts/tax-and-accounting/section-174-considerations/" 
                class="text-blue-600 hover:text-blue-800 hover:underline">
               https://www.thomsonreuters.com/en-us/posts/tax-and-accounting/section-174-considerations/
             </a>
             (accessed November 15, 2024).
           </p>
           <p>
             [5] Salesforce, "Form 10-K," Salesforce, 
             <a href="https://mstar-s3-dc-doc-drilldown-prod.s3.amazonaws.com/436244211/crm-20230131.htm" 
                class="text-blue-600 hover:text-blue-800 hover:underline">
               https://mstar-s3-dc-doc-drilldown-prod.s3.amazonaws.com/436244211/crm-20230131.htm
             </a>
             (accessed November 15, 2024).
           </p>
           <p>
             [6] "Section 174: The U.S. Tax Policy That's Hurting Software Development," Pragmatic Engineer, 
             <a href="https://blog.pragmaticengineer.com/section-174/" 
                class="text-blue-600 hover:text-blue-800 hover:underline">
               https://blog.pragmaticengineer.com/section-174/
             </a>
             (accessed November 15, 2024).
           </p>
         </div>
       </div>
     </div>
   </div>
 );
};

export default Article3;
