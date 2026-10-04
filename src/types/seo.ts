export interface MetaTagAnalysis {
  value: string;
  length: number;
  status: 'good' | 'warning' | 'critical';
  recommendation: string;
}

export interface CoreWebVitalMetric {
  value: string;
  status: 'good' | 'needs-improvement' | 'poor';
  metricName: string;
}

export interface SeoIssue {
  id: string;
  title: string;
  severity: 'critical' | 'warning' | 'good';
  category: 'onPage' | 'technical' | 'performance' | 'mobile' | 'content';
  impact: 'High' | 'Medium' | 'Low';
  description: string;
  solution: string;
  codeSnippet?: string;
  snippetLanguage?: 'html' | 'json' | 'txt';
}

export interface AiMetaRewrite {
  title: string;
  description: string;
  reasoning: string;
  targetAudience: string;
}

export interface DetectedKeyword {
  keyword: string;
  relevance: number;
  density: string;
  searchIntent: 'Commercial' | 'Informational' | 'Transactional' | 'Navigational';
  opportunity: 'High' | 'Medium' | 'Low';
}

export interface CompetitorInsight {
  competitor: string;
  advantage: string;
  actionableTactic: string;
}

export interface AuditStats {
  wordCount: number;
  h1Count: number;
  h2Count: number;
  imageCount: number;
  imagesMissingAlt: number;
  internalLinks: number;
  externalLinks: number;
  hasHttps: boolean;
  hasViewport: boolean;
  hasJsonLd: boolean;
}

export interface AuditReport {
  url: string;
  domain: string;
  auditDate: string;
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  scores: {
    onPage: number;
    technical: number;
    performance: number;
    mobile: number;
    content: number;
  };
  summary: string;
  serpPreview: {
    title: string;
    url: string;
    description: string;
  };
  metaAnalysis: {
    title: MetaTagAnalysis;
    description: MetaTagAnalysis;
    canonical: {
      value: string;
      present: boolean;
      status: 'good' | 'warning';
    };
    robots: {
      value: string;
      indexable: boolean;
    };
    openGraph: {
      hasTitle: boolean;
      hasDesc: boolean;
      hasImage: boolean;
      status: 'good' | 'warning';
    };
  };
  coreWebVitals: {
    lcp: CoreWebVitalMetric;
    inp: CoreWebVitalMetric;
    cls: CoreWebVitalMetric;
    ttfb: CoreWebVitalMetric;
  };
  issues: SeoIssue[];
  aiRewrites: AiMetaRewrite[];
  detectedKeywords: DetectedKeyword[];
  competitorInsights: CompetitorInsight[];
  stats: AuditStats;
}

export interface TrackedKeyword {
  keyword: string;
  currentRank: number;
  previousRank: number;
  change: number;
  volume: number;
  difficulty: number;
  cpc: string;
  serpFeatures: string[];
  rankingUrl: string;
  aiActionTip: string;
  history: number[];
}

export interface RankTrackerData {
  domain: string;
  totalKeywords: number;
  top3Count: number;
  top10Count: number;
  avgPosition: number;
  organicTrafficEstimate: number;
  visibilityScore: number;
  keywords: TrackedKeyword[];
}

export interface CompetitorComparisonData {
  target: {
    domain: string;
    domainAuthority: number;
    organicKeywords: number;
    monthlyTraffic: string;
    backlinks: string;
    seoHealthScore: number;
    coreStrength: string;
  };
  competitors: Array<{
    domain: string;
    domainAuthority: number;
    organicKeywords: number;
    monthlyTraffic: string;
    backlinks: string;
    seoHealthScore: number;
    coreStrength: string;
    trafficSharePercentage: number;
  }>;
  keywordGap: Array<{
    keyword: string;
    volume: number;
    competitorRank: number;
    yourRank: number | null;
    opportunityScore: 'High' | 'Medium';
  }>;
  strategicRecommendations: Array<{
    title: string;
    impact: 'High' | 'Medium';
    action: string;
  }>;
}
