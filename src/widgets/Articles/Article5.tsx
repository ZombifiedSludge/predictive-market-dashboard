import { Component } from 'solid-js';

const Article5: Component = () => {
 return (
   <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
     {/* Article Title */}
     <h1 class="text-3xl font-semibold text-navy-900 mb-2">
       Beyond the Basics: How the Altman Z-Score and Piotroski F-Score Can Transform Your Investment Decisions
     </h1>
     
     {/* Publication Date */}
     <p class="text-sm text-gray-500 mb-6">Published January 27th, 2025</p>
     
     {/* Article Content */}
     <div class="text-gray-700 font-georgia space-y-6">
       {/* Introduction */}
       <p>
         One of the first things users of financial statements learn about is financial ratios. While seemingly simple at first glance, financial ratios are used in many situations to assess business operations. With the click of a calculator, users of these ratios can determine a firm's ability to generate profits, use its resources efficiently, pay off its debt, and manage its expenses. The impact of said calculations is wide-reaching for managers, investors, creditors, banks, regulators, and anyone interested in the business's health. Some ratios are so crucial that firms may lose lending opportunities, deter investors, and face higher interest rates if market expectations are not met. Some employees may even miss out on promotions or raises if their lackluster performance impacts the output of these critical calculations. Long story short, financial ratios are important and understanding them is crucial for anyone looking to enter the world of business.
       </p>
       <p>
         While individual ratios provide valuable insight about a company's liquidity, solvency, efficiency, and profitability, more experienced investors often turn to more complex scoring systems that combine said ratios into a more comprehensive metric. Two such calculations are the Altman Z-Score, which assesses bankruptcy probabilities, and the Piotroski F-Score, which identifies companies performing well financially. These ratios go beyond simple ratio analysis and provide holistic and understandable frameworks that assist investors with financial decisions. In this article, I will outline both scoring models, their background, how to calculate them, and why I believe more investors should incorporate them into their analysis.
       </p>

       <h2 class="text-xl font-semibold text-navy-900">The Altman Z-Score</h2>
       
       {/* Altman Z-Score Formula Container */}
       <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
         <p class="font-mono text-navy-900 font-semibold">
           1.2(Working Capital/Total Assets) + 1.4(Retained Earnings/Total Assets) + 3.3(EBIT/Total Assets) + .6(Market Cap/Total Liabilities) + 1(Sales/Total Assets)
         </p>
       </div>
       
       <p>
         The Altman Z-score is not strictly a financial ratio, but rather a weighted average of five separate ratios. Given the range of inputs, the Z-score offers a more holistic view than any single calculation, synthesizing a company's daily operations with its long-term prospects to provide a more complete overview of its overall health. Specifically, the Z-score assesses the credit risk of manufacturing firms and their likelihood of bankruptcy or restructuring within the next two years. Developed by NYU Stern Professor Edward Altman in 1968, the Altman Z-score has proven to be highly effective, diagnosing the probability of bankruptcy with over 80% accuracy (1).
       </p>

       <p>
         The Altman Z-score combines five specific ratios to predict bankruptcy risk, each with a specific purpose. Working Capital/Total Assets measures short-term liquidity but investors should caution excessive current assets may signal missed growth opportunities or inventory obsolescence; Retained Earnings/Total Assets exemplifies self-financing capabilities with higher values indicating stronger profitability; EBIT/Total Assets evaluates operational efficiency but overlooks interest expenses and uses book values that miss real estate appreciation or fair value adjustments; Market Capitalization/Total Liabilities assesses if market value covers debt but is heavily influenced by market sentiment; and Sales/Total Assets measures asset efficiency with lower values suggesting issues using what the company has to generate sales.
       </p>

       <p>
         To solve the calculation by hand, I recommend calculating each ratio individually and then plugging them into the final formula to reach the result.
       </p>
       
       <p>
         The general rule of thumb for the Altman Z-Score is that a score above 3 suggests little chance of Chapter 11 proceedings in the next two years. Any score below 1.8 means the company should probably begin writing its will as soon as possible. Scores between 1.8 and 3, meanwhile, suggest a moderate risk of bankruptcy. All in all, companies should strive for a Z-score above 3 but remain especially worried if it dips below 1.8.
       </p>

       <p>
         To illustrate this example, I will calculate the Altman Z-Score for General Motors in 2007, a year before the 2008 financial crisis and its eventual bankruptcy.
         
         {/* Excel Calculations Image - wrapped within text */}
         <div class="float-right ml-6 mb-6 w-1/3">
           <img 
             src="altman.png" 
             alt="Excel Calculations for GM's Altman Z-Score" 
             class="rounded-lg shadow-md"
           />
         </div>
         
         As shown in the Excel calculations, GM's Altman Z-Score for 2007 was a dismal 0.853, well below the 1.8 threshold required to avoid being classified as at extreme risk of bankruptcy. This result primarily stemmed from GM's massive deficit in retained earnings, negative working capital, and negative earnings before interest and taxes. Interestingly, aside from asset turnover, the market capitalization to total liabilities ratio was the only ratio with a positive result, demonstrating how market sentiment can skew this metric and why it carries the least weight in the calculation. Perhaps most striking is that GM ultimately declared bankruptcy in June 2009, providing yet another example of how remarkably effective the Altman Z-Score is at predicting bankruptcies before they happen.
       </p>

       <p>
         The Altman Z-Score is a clear and concise way of assessing the health and profitability of a manufacturing company using only financial ratios. By using this composite metric, managers can determine when bankruptcy risk is especially probable and adjust their operations accordingly. Investors, meanwhile, can search for stocks to short or invest in long-term depending on the result of these calculations.
       </p>

       <h2 class="text-xl font-semibold text-navy-900">Piotroski F-Score</h2>
       <p>
         The Piotroski F-Score shares some similarities with the Altman Z-Score as both composite figures assess the operating prowess and financial stability of an enterprise using financial statements. However, unlike the Altman Z-Score's weighted-average approach, the Piotroski F-Score employs a straightforward 9-point boolean scoring system where companies receive either a 0 or 1 for each item on the checklist. Developed by Stanford professor Joseph Piotroski in 2000, the method plays a pivotal role in identifying strong companies to invest in without resorting to complex machine learning or strategy. The checklist for the F-Score is as follows:
       </p>

       {/* Piotroski F-Score Checklist Container */}
       <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
         <ol class="list-decimal pl-6 space-y-2">
           <li>Positive Return on Assets (Net Income / Average Total Assets)</li>
           <li>Current Year ROA > Previous Year ROA</li>
           <li>Positive Operating Cash Flow</li>
           <li>Operating Cash Flows > Net Income</li>
           <li>Current Year Long-Term Debt < Previous Year Long-Term Debt</li>
           <li>Current Year Current Ratio > Previous Year Current Ratio</li>
           <li>No New Shares Issued</li>
           <li>Current Year Asset Turnover > Previous Year Asset Turnover (Net Sales / Average Total Assets)</li>
           <li>Current Year Gross Margin > Previous Year Gross Margin</li>
         </ol>
       </div>

       <p>
         To calculate the final score, a user simply has to read a company's official financial statements and answer Yes/No to each of the given questions. If they answer "Yes" to a question, they should award the firm a point. Otherwise, they should leave the score unchanged. There is no official benchmark to determine what each score indicates, but most investors consider a score of 8 or higher to be exceptional, whereas they consider a score of 2 or below the signal of a poor investment.
       </p>
       
       <p>
         The F-Score is known for judging a company's profitability, leverage, and operations. As seen with the checklist, the first four-line items determine how well a company is turning a profit. It ensures strong operating cash flows, improved operating performance, and better use of assets over time. The next three-line items deal with a company's capital structure decisions and evaluate the amount of debt a company is absorbing and whether it will be able to meet short-term debt obligations. Lastly, the final two members of the checklist gauge a company's operational efficiency and ability to make sales.
       </p>
       
       <p>
         One of my favorite aspects about this measure is that it screens for potential earnings management and capital restructuring. By focusing predominately on measures of operational performance such as ROA and gross margin, the formula fixates on the top items of the income statement that truly matter to investors. Furthermore, by screening for additional long-term debt and stock issuances, the F-Score ensures that a company's performance and sales are based on its core activities rather than arbitrary decisions by the financial or accounting department. This characteristic is one of the main reasons I believe more investors should incorporate this calculation into their investment decision-making. Unlike ratios such as earnings per share or price-to-earnings, the F-Score focuses on what matters to investors and users of the financial statement.
       </p>
       
       <p>
         To show an example of the F-Score calculation, I have calculated the composite result for Palantir Technologies, a data analytics company that has watched its share price soar over the past few months. Considering the company has grown over 345% in the past year, I figured the score may be remarkably high. However, this was not the case as their composite score was only a 5/9, indicating neither a strong nor weak financial performance. In particular, Palantir did not meet the criteria for no additional share issuances, lower long-term debt levels, higher asset turnover, and higher return on assets. This example demonstrates that achieving a financially strong performance according to the Piotroski F-Score is no small feat and requires reliance on operational growth rather than external financing.
       </p>
       
       <p>
         In summary, the Piotroski F-Score offers a structural and simplified approach to evaluating investment decisions. With low transaction costs and a proven track record of success, the Piotroski F-Score is a useful tool for managers and investors alike to learn about a company's profitability, leverage, and efficiency. As demonstrated by Palantir Technologies, even companies with substantial stock appreciation may not have the operational fundamentals or consistency to perform well on the model. This prohibitive threshold ensures only companies with the strongest operation and profitability metrics excel. While investors should always consider a wide range of inputs and calculations, the F-Score is a reliable rule of thumb investors can use to determine potential value stocks and value traps. Furthermore, the straightforward items within the model provide an accessible launch pad investors can use to pivot into more tailored financial analysis. All in all, the F-Score is a worthwhile tool in anyone's toolkit and, combined with the Altman Z-Score, can help investors avoid losing stocks in the long run.
       </p>

       {/* References */}
       <div class="mt-12 pt-6 border-t border-gray-200">
         <h3 class="text-lg font-semibold text-navy-900 mb-4">References</h3>
         <div class="space-y-2 text-sm text-gray-600">
           <p>
             [1] Will Kenton, "Altman Z-Score: Formula and Explanation," <i>Investopedia</i>, last modified [date if available], 
             <a href="https://www.investopedia.com/terms/a/altman.asp" 
                class="text-blue-600 hover:text-blue-800 hover:underline">
               https://www.investopedia.com/terms/a/altman.asp
             </a>
           </p>
           <p>
             [2] U.S. Securities and Exchange Commission, <i>General Motors Corporation Form 10-K</i>, February 28, 2008, 
             <a href="https://www.sec.gov/Archives/edgar/data/40730/000095012408000921/k23797e10vk.htm#109" 
                class="text-blue-600 hover:text-blue-800 hover:underline">
               https://www.sec.gov/Archives/edgar/data/40730/000095012408000921/k23797e10vk.htm#109
             </a>
           </p>
         </div>
       </div>
     </div>
   </div>
 );
};

export default Article5;
