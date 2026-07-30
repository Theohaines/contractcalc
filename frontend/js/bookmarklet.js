export function getBookmarkletCode() {
	return `javascript: (function() {
  const deals = document.querySelectorAll('[data-accordion-container]');
  
  deals.forEach((deal) => {
    const pricesContainer = deal.querySelector('.deal-item-prices');
    if (!pricesContainer) return;
    
    const monthlyText = pricesContainer
      .querySelector('.item-per-month-text');
    const upfrontText = pricesContainer
      .querySelectorAll('.item-per-month-text')[1];
    const ofcomPrices = pricesContainer
      .querySelectorAll('.item-details-ofcom-price');
    
    if (!monthlyText || !upfrontText) return;
    
    const monthlyStr = monthlyText.textContent
      .replace(/[^\\d.]/g, '');
    const upfrontStr = upfrontText.textContent
      .replace(/[^\\d.]/g, '');
    
    const monthly = parseFloat(monthlyStr);
    const upfront = parseFloat(upfrontStr);
    
    const dealItem = deal.querySelector('.deal-item-details');
    const contractText = dealItem?.querySelector('small')
      ?.textContent || '24';
    const months = parseInt(contractText);
    
    const inflations = [];
    ofcomPrices.forEach((price) => {
      const boldText = price
        .querySelector(
          '.item-details-ofcom-price-font-trade-bold'
        )?.textContent;
      if (boldText) {
        inflations.push(
          parseFloat(boldText.replace(/[^\\d.]/g, ''))
        );
      }
    });
    
    const start = new Date();
    const startMonth = start.getMonth();
    const startYear = start.getFullYear();
    
    let totalMonthly = 0;
    let currentMonthly = monthly;
    let inflationIndex = 0;
    
    for (let month = 1; month <= months; month += 1) {
      totalMonthly += currentMonthly;
      
      const currentDate = new Date(
        startYear,
        startMonth + month,
        1
      );
      const currentDateMonth = currentDate.getMonth();
      
      if (
        currentDateMonth === 3 &&
        month < months &&
        inflationIndex < inflations.length
      ) {
        currentMonthly = inflations[inflationIndex];
        inflationIndex += 1;
      }
    }
    
    const totalCost = upfront + totalMonthly;
    
    const totalDiv = document.createElement('div');
    totalDiv.className = 'total-cost-badge';
    totalDiv.style.cssText = 'padding: 12px 16px; margin-top: 12px; background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); color: white; font-weight: bold; border-radius: 8px; text-align: center; font-size: 16px; border: 2px solid #c2410c; box-shadow: 0 4px 6px rgba(234, 88, 12, 0.2);';
    totalDiv.innerHTML = 'Total Cost Over ' + months + ' Months: £' + totalCost.toFixed(2);
    
    pricesContainer.parentElement
      .insertBefore(totalDiv, pricesContainer.nextSibling);
  });
  
  alert('Total costs calculated and added to deal cards!');
})();`;
}

export async function copyToClipboard(text) {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
}
