
export const calculateCounterOffer = (price: number, selectedPlatform: string): number => {
  let percentage = 0;
  
  if ((selectedPlatform === 'Zillow' || selectedPlatform === 'Facebook') && price > 5000) {
    percentage = Math.random() * 0.1 + 0.1; // 10-20%
  } else if ((selectedPlatform === 'eBay' || selectedPlatform === 'Craigslist') && price < 500) {
    percentage = Math.random() * 0.1 + 0.2; // 20-30%
  } else {
    percentage = Math.random() * 0.1 + 0.15; // 15-25% for other cases
  }
  
  const reducedPrice = price * (1 - percentage);
  
  // Round down to nearest 10 or 50
  if (reducedPrice > 100) {
    return Math.floor(reducedPrice / 50) * 50;
  } else {
    return Math.floor(reducedPrice / 10) * 10;
  }
};

export const generateNegotiationMessage = async (title: string, originalPrice: number, offer: number, platform: string, notes: string): Promise<string> => {
  const prompt = `Create a polite, confident negotiation message for the following:
  - Item: ${title}
  - Original Price: $${originalPrice}
  - My Offer: $${offer}
  - Platform: ${platform}
  - Additional Context: ${notes}
  
  Guidelines:
  - Be respectful but confident
  - Use phrases like "Would you consider," "Based on the market," or "Happy to move forward if we can agree"
  - Keep it concise (2-3 sentences)
  - Sound professional but friendly
  - Don't be aggressive or pushy
  - Focus on being ready to move forward with the deal`;

  try {
    // This is a placeholder for GPT-4 integration
    // In a real implementation, you would call the OpenAI API here
    console.log('Generating message with prompt:', prompt);
    
    // Simulated AI response for demo purposes
    const templates = [
      `Hi! I'm very interested in your ${title}. Based on similar listings I've seen, would you consider $${offer}? I'm ready to pick it up/move forward today if we can agree on this price.`,
      `Hello! Your ${title} looks great. I've been researching the market and wondering if you'd be open to $${offer}? Happy to arrange pickup at your convenience if this works for you.`,
      `Hi there! I'm interested in purchasing your ${title}. Would you consider accepting $${offer}? I'm a serious buyer and can complete the transaction quickly if we can agree on this.`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  } catch (error) {
    console.error('Error generating message:', error);
    return `Hi! I'm very interested in your ${title}. Would you consider $${offer}? I'm ready to move forward if we can agree on this price. Thank you!`;
  }
};
