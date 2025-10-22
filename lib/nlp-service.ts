import nlp from 'compromise';

// Simple tokenizer function
function tokenize(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 0);
}

export interface NLPAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  keywords: string[];
  urgency: number;
  complexity: number;
  tags: string[];
  suggestedDepartment?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

export class NLPService {
  private static instance: NLPService;

  private constructor() {
    // No initialization needed
  }

  public static getInstance(): NLPService {
    if (!NLPService.instance) {
      NLPService.instance = new NLPService();
    }
    return NLPService.instance;
  }

  public analyzeComplaint(text: string): NLPAnalysis {
    const doc = nlp(text);
    
    // Sentiment Analysis
    const sentiment = this.analyzeSentiment(text);
    
    // Keyword Extraction
    const keywords = this.extractKeywords(text);
    
    // Urgency Analysis
    const urgency = this.analyzeUrgency(text);
    
    // Complexity Analysis
    const complexity = this.analyzeComplexity(text);
    
    // Tag Generation
    const tags = this.generateTags(text);
    
    // Department Suggestion
    const suggestedDepartment = this.suggestDepartment(text);
    
    // Priority Calculation
    const priority = this.calculatePriority(urgency, complexity, sentiment);
    
    return {
      sentiment,
      keywords,
      urgency,
      complexity,
      tags,
      suggestedDepartment,
      priority,
    };
  }

  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const tokens = tokenize(text);
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'perfect', 'satisfied', 'happy', 'pleased', 'thank', 'appreciate'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disgusting', 'angry', 'frustrated', 'disappointed', 'upset', 'complaint', 'problem', 'issue', 'broken', 'damaged'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    tokens.forEach(token => {
      if (positiveWords.includes(token)) positiveCount++;
      if (negativeWords.includes(token)) negativeCount++;
    });
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private extractKeywords(text: string): string[] {
    const tokens = tokenize(text);
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them']);
    
    const filteredTokens = tokens.filter(token => 
      token.length > 2 && !stopWords.has(token) && /^[a-zA-Z]+$/.test(token)
    );
    
    // Count frequency
    const frequency: { [key: string]: number } = {};
    filteredTokens.forEach(token => {
      frequency[token] = (frequency[token] || 0) + 1;
    });
    
    // Return top 10 keywords
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  private analyzeUrgency(text: string): number {
    const urgencyWords = {
      'urgent': 10, 'emergency': 10, 'critical': 9, 'immediate': 9, 'asap': 8,
      'now': 7, 'today': 6, 'soon': 5, 'quickly': 6, 'fast': 5,
      'broken': 7, 'damaged': 6, 'not working': 6, 'failed': 7,
      'dangerous': 8, 'unsafe': 8, 'hazard': 8, 'risk': 7
    };
    
    const words = text.toLowerCase().split(/\s+/);
    let maxUrgency = 1;
    
    words.forEach(word => {
      if (urgencyWords[word as keyof typeof urgencyWords]) {
        maxUrgency = Math.max(maxUrgency, urgencyWords[word as keyof typeof urgencyWords]);
      }
    });
    
    return maxUrgency;
  }

  private analyzeComplexity(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((sum, sentence) => 
      sum + sentence.split(/\s+/).length, 0) / sentences.length;
    
    const wordCount = text.split(/\s+/).length;
    const technicalTerms = (text.match(/\b(technical|system|process|procedure|documentation|configuration|implementation|integration|deployment|maintenance|infrastructure|database|server|network|protocol|algorithm|framework|architecture|optimization|automation)\b/gi) || []).length;
    
    let complexity = 1;
    
    // Sentence length factor
    if (avgSentenceLength > 20) complexity += 2;
    else if (avgSentenceLength > 15) complexity += 1;
    
    // Word count factor
    if (wordCount > 200) complexity += 2;
    else if (wordCount > 100) complexity += 1;
    
    // Technical terms factor
    if (technicalTerms > 5) complexity += 3;
    else if (technicalTerms > 2) complexity += 2;
    else if (technicalTerms > 0) complexity += 1;
    
    return Math.min(10, Math.max(1, complexity));
  }

  private generateTags(text: string): string[] {
    const tags: string[] = [];
    const lowerText = text.toLowerCase();
    
    // Department-based tags
    if (lowerText.includes('education') || lowerText.includes('school') || lowerText.includes('student')) {
      tags.push('education');
    }
    if (lowerText.includes('health') || lowerText.includes('medical') || lowerText.includes('hospital')) {
      tags.push('healthcare');
    }
    if (lowerText.includes('transport') || lowerText.includes('bus') || lowerText.includes('road')) {
      tags.push('transportation');
    }
    if (lowerText.includes('police') || lowerText.includes('crime') || lowerText.includes('security')) {
      tags.push('law-enforcement');
    }
    if (lowerText.includes('water') || lowerText.includes('electricity') || lowerText.includes('sanitation')) {
      tags.push('utilities');
    }
    
    // Issue-based tags
    if (lowerText.includes('corruption') || lowerText.includes('bribe') || lowerText.includes('fraud')) {
      tags.push('corruption');
    }
    if (lowerText.includes('delay') || lowerText.includes('slow') || lowerText.includes('waiting')) {
      tags.push('delay');
    }
    if (lowerText.includes('quality') || lowerText.includes('poor') || lowerText.includes('bad')) {
      tags.push('quality-issue');
    }
    if (lowerText.includes('infrastructure') || lowerText.includes('building') || lowerText.includes('construction')) {
      tags.push('infrastructure');
    }
    
    return tags;
  }

  private suggestDepartment(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('education') || lowerText.includes('school') || lowerText.includes('student')) {
      return 'Education';
    }
    if (lowerText.includes('health') || lowerText.includes('medical') || lowerText.includes('hospital')) {
      return 'Healthcare';
    }
    if (lowerText.includes('transport') || lowerText.includes('bus') || lowerText.includes('road')) {
      return 'Transportation';
    }
    if (lowerText.includes('police') || lowerText.includes('crime') || lowerText.includes('security')) {
      return 'Police';
    }
    if (lowerText.includes('water') || lowerText.includes('electricity') || lowerText.includes('sanitation')) {
      return 'Municipal Services';
    }
    if (lowerText.includes('revenue') || lowerText.includes('tax') || lowerText.includes('payment')) {
      return 'Revenue';
    }
    if (lowerText.includes('agriculture') || lowerText.includes('farm') || lowerText.includes('crop')) {
      return 'Agriculture';
    }
    if (lowerText.includes('environment') || lowerText.includes('pollution') || lowerText.includes('waste')) {
      return 'Environment';
    }
    
    return 'Other';
  }

  private calculatePriority(urgency: number, complexity: number, sentiment: string): 'Low' | 'Medium' | 'High' | 'Critical' {
    let score = urgency + complexity;
    
    // Sentiment adjustment
    if (sentiment === 'negative') score += 2;
    if (sentiment === 'positive') score -= 1;
    
    if (score >= 15) return 'Critical';
    if (score >= 12) return 'High';
    if (score >= 8) return 'Medium';
    return 'Low';
  }
}
