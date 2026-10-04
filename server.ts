import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import * as cheerio from 'cheerio';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini client with recommended telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to normalize URLs
function normalizeUrl(input: string): string {
  let cleaned = input.trim();
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = 'https://' + cleaned;
  }
  return cleaned;
}

// Scrape basic on-page HTML elements
async function crawlSite(url: string) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 RankPilotBot/1.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    clearTimeout(timeout);

    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $('title').first().text().trim() || '';
    const description =
      $('meta[name="description"]').attr('content')?.trim() ||
      $('meta[property="og:description"]').attr('content')?.trim() ||
      '';
    const canonical = $('link[rel="canonical"]').attr('href')?.trim() || '';
    const robots = $('meta[name="robots"]').attr('content')?.trim() || '';
    const ogTitle = $('meta[property="og:title"]').attr('content')?.trim() || '';
    const ogImage = $('meta[property="og:image"]').attr('content')?.trim() || '';
    const viewport = $('meta[name="viewport"]').attr('content')?.trim() || '';

    const h1s: string[] = [];
    $('h1').each((_, el) => {
      const txt = $(el).text().trim();
      if (txt) h1s.push(txt.slice(0, 100));
    });

    const h2s: string[] = [];
    $('h2').each((_, el) => {
      const txt = $(el).text().trim();
      if (txt) h2s.push(txt.slice(0, 100));
    });

    const totalImages = $('img').length;
    let missingAlt = 0;
    $('img').each((_, el) => {
      const alt = $(el).attr('alt');
      if (!alt || !alt.trim()) {
        missingAlt++;
      }
    });

    let hasJsonLd = false;
    $('script[type="application/ld+json"]').each((_, el) => {
      if ($(el).html()?.trim()) hasJsonLd = true;
    });

    // Count links
    let internalLinks = 0;
    let externalLinks = 0;
    const origin = new URL(url).origin;
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (href.startsWith('/') || href.startsWith(origin)) {
        internalLinks++;
      } else if (href.startsWith('http')) {
        externalLinks++;
      }
    });

    // Text content preview for semantic analysis
    $('script, style, noscript, svg, nav, footer').remove();
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const wordCount = bodyText.split(' ').filter(Boolean).length;
    const textSnippet = bodyText.slice(0, 2500);

    return {
      success: true,
      title,
      description,
      canonical,
      robots,
      ogTitle,
      ogImage,
      viewport,
      h1s,
      h2s,
      totalImages,
      missingAlt,
      hasJsonLd,
      internalLinks,
      externalLinks,
      wordCount,
      textSnippet,
      statusCode: res.status,
      isHttps: url.startsWith('https://'),
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Unable to fetch site directly (CORS/Firewall/Timeout)',
      title: '',
      description: '',
      canonical: '',
      robots: '',
      ogTitle: '',
      ogImage: '',
      viewport: 'width=device-width, initial-scale=1.0',
      h1s: [],
      h2s: [],
      totalImages: 0,
      missingAlt: 0,
      hasJsonLd: false,
      internalLinks: 0,
      externalLinks: 0,
      wordCount: 0,
      textSnippet: '',
      statusCode: 0,
      isHttps: url.startsWith('https://'),
    };
  }
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Live SEO Audit Route
app.post('/api/audit', async (req, res) => {
  try {
    const rawUrl = req.body.url;
    if (!rawUrl || typeof rawUrl !== 'string') {
      return res.status(400).json({ error: 'URL is required' });
    }

    const targetUrl = normalizeUrl(rawUrl);
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(targetUrl);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const domain = parsedUrl.hostname;
    const crawlData = await crawlSite(targetUrl);

    // Prompt Gemini 3.8 Flash to run a comprehensive SEO audit
    const prompt = `You are Rank Pilot's world-class SEO technical auditor and rank intelligence engine.
Analyze the following website and live crawl telemetry to produce an exhaustive, authoritative, realistic SEO report.

WEBSITE TARGET:
URL: ${targetUrl}
Domain: ${domain}
Crawl Data Available:
- Crawl Success: ${crawlData.success}
- HTTP Status: ${crawlData.statusCode}
- HTTPS: ${crawlData.isHttps}
- Title Tag: "${crawlData.title}" (Length: ${crawlData.title.length})
- Meta Description: "${crawlData.description}" (Length: ${crawlData.description.length})
- Canonical Link: "${crawlData.canonical}"
- Robots Meta: "${crawlData.robots}"
- OpenGraph Title: "${crawlData.ogTitle}"
- Has OpenGraph Image: ${Boolean(crawlData.ogImage)}
- Viewport Tag: "${crawlData.viewport}"
- H1 Headings: ${JSON.stringify(crawlData.h1s)}
- H2 Headings: ${JSON.stringify(crawlData.h2s.slice(0, 5))}
- Total Images: ${crawlData.totalImages} (Missing Alt: ${crawlData.missingAlt})
- Has JSON-LD Schema: ${crawlData.hasJsonLd}
- Word Count: ${crawlData.wordCount}
- Internal Links: ${crawlData.internalLinks}
- External Links: ${crawlData.externalLinks}
- Page Text Sample: "${crawlData.textSnippet.slice(0, 1000)}"

Return a strictly valid JSON object matching this schema:
{
  "url": "${targetUrl}",
  "domain": "${domain}",
  "auditDate": "${new Date().toISOString()}",
  "overallScore": number (0-100 realistic score based on audit findings),
  "grade": "A+" | "A" | "B" | "C" | "D" | "F",
  "scores": {
    "onPage": number (0-100),
    "technical": number (0-100),
    "performance": number (0-100),
    "mobile": number (0-100),
    "content": number (0-100)
  },
  "summary": string (concise 2-sentence executive diagnosis of SEO standing),
  "serpPreview": {
    "title": string (how it appears in Google SERP),
    "url": "${targetUrl}",
    "description": string (the snippet Google displays)
  },
  "metaAnalysis": {
    "title": {
      "value": string,
      "length": number,
      "status": "good" | "warning" | "critical",
      "recommendation": string
    },
    "description": {
      "value": string,
      "length": number,
      "status": "good" | "warning" | "critical",
      "recommendation": string
    },
    "canonical": {
      "value": string,
      "present": boolean,
      "status": "good" | "warning"
    },
    "robots": {
      "value": string,
      "indexable": boolean
    },
    "openGraph": {
      "hasTitle": boolean,
      "hasDesc": boolean,
      "hasImage": boolean,
      "status": "good" | "warning"
    }
  },
  "coreWebVitals": {
    "lcp": {
      "value": string (e.g. "1.8s" or "3.4s"),
      "status": "good" | "needs-improvement" | "poor",
      "metricName": "Largest Contentful Paint"
    },
    "inp": {
      "value": string (e.g. "65ms" or "220ms"),
      "status": "good" | "needs-improvement" | "poor",
      "metricName": "Interaction to Next Paint"
    },
    "cls": {
      "value": string (e.g. "0.04" or "0.18"),
      "status": "good" | "needs-improvement" | "poor",
      "metricName": "Cumulative Layout Shift"
    },
    "ttfb": {
      "value": string (e.g. "180ms" or "520ms"),
      "status": "good" | "needs-improvement" | "poor",
      "metricName": "Time to First Byte"
    }
  },
  "issues": [
    {
      "id": string,
      "title": string,
      "severity": "critical" | "warning" | "good",
      "category": "onPage" | "technical" | "performance" | "mobile" | "content",
      "impact": "High" | "Medium" | "Low",
      "description": string,
      "solution": string,
      "codeSnippet": string (ready-to-copy HTML, JSON-LD, or robots config code fix),
      "snippetLanguage": string ("html" | "json" | "txt")
    }
  ],
  "aiRewrites": [
    {
      "title": string (max 60 chars, compelling CTR-optimized title),
      "description": string (max 155 chars, high-converting meta description with call to action),
      "reasoning": string,
      "targetAudience": string
    }
  ],
  "detectedKeywords": [
    {
      "keyword": string,
      "relevance": number (1-100),
      "density": string (e.g. "2.4%"),
      "searchIntent": "Commercial" | "Informational" | "Transactional" | "Navigational",
      "opportunity": "High" | "Medium" | "Low"
    }
  ],
  "competitorInsights": [
    {
      "competitor": string (domain or name of known rival in this niche),
      "advantage": string,
      "actionableTactic": string
    }
  ],
  "stats": {
    "wordCount": number,
    "h1Count": number,
    "h2Count": number,
    "imageCount": number,
    "imagesMissingAlt": number,
    "internalLinks": number,
    "externalLinks": number,
    "hasHttps": boolean,
    "hasViewport": boolean,
    "hasJsonLd": boolean
  }
}

Provide at least 6-8 real issues (mix of critical, warning, and good/passed checks) and exactly 3 AI title/meta rewrite variations. Ensure all JSON is strictly valid.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const auditResult = JSON.parse(jsonText);

    // Merge crawl stats fallback if needed
    if (!auditResult.stats) {
      auditResult.stats = {
        wordCount: crawlData.wordCount,
        h1Count: crawlData.h1s.length,
        h2Count: crawlData.h2s.length,
        imageCount: crawlData.totalImages,
        imagesMissingAlt: crawlData.missingAlt,
        internalLinks: crawlData.internalLinks,
        externalLinks: crawlData.externalLinks,
        hasHttps: crawlData.isHttps,
        hasViewport: Boolean(crawlData.viewport),
        hasJsonLd: crawlData.hasJsonLd,
      };
    }

    res.json({
      success: true,
      data: auditResult,
    });
  } catch (error: any) {
    console.error('Audit Error:', error);
    res.status(500).json({
      error: error.message || 'Failed to complete SEO audit',
    });
  }
});

// 2. Rank Tracker Route
app.post('/api/rank-track', async (req, res) => {
  try {
    const { url, keywords } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const domain = new URL(normalizeUrl(url)).hostname;
    const keywordList = Array.isArray(keywords) && keywords.length > 0
      ? keywords.join(', ')
      : 'top primary organic search terms for this industry';

    const prompt = `You are Rank Pilot's organic rank tracker simulation engine.
Analyze domain: ${domain} (URL: ${url}).
Keywords to track or discover: ${keywordList}.

Generate tracking intelligence for 8 to 10 prominent search keywords relevant to this domain.
For each keyword, provide:
- keyword: string
- currentRank: number (1 to 100, realistic ranking for this site's niche authority)
- previousRank: number (simulate realistic rank movement over past 30 days)
- change: number (positive means improved, e.g. +3, negative means dropped, e.g. -2, 0 means steady)
- volume: number (monthly estimated search volume, e.g. 1200, 8500, 32000)
- difficulty: number (keyword difficulty 1-100)
- cpc: string (e.g. "$2.40")
- serpFeatures: array of string (e.g. ["Featured Snippet", "People Also Ask", "Site Links", "Video Carousel", "Knowledge Panel"])
- rankingUrl: string (e.g. "https://${domain}/features" or "https://${domain}/pricing")
- aiActionTip: string (specific 1-sentence tip on how to gain 3+ positions)
- history: array of 7 numbers (daily/weekly ranking over last 30 days for sparkline chart)

Return JSON with format:
{
  "domain": "${domain}",
  "totalKeywords": number,
  "top3Count": number,
  "top10Count": number,
  "avgPosition": number,
  "organicTrafficEstimate": number,
  "visibilityScore": number (0-100),
  "keywords": [ ... ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const rankData = JSON.parse(jsonText);

    res.json({
      success: true,
      data: rankData,
    });
  } catch (error: any) {
    console.error('Rank Tracker Error:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch rank tracking intelligence',
    });
  }
});

// 3. Competitor Comparison Route
app.post('/api/competitor-compare', async (req, res) => {
  try {
    const { targetDomain, competitors } = req.body;
    if (!targetDomain) {
      return res.status(400).json({ error: 'Target domain is required' });
    }

    const competitorList = Array.isArray(competitors) && competitors.length > 0
      ? competitors.join(', ')
      : 'top 2 direct market competitors';

    const prompt = `You are Rank Pilot's Competitive Intelligence Analyst.
Compare the primary domain: ${targetDomain} against its competitors: ${competitorList}.

Return a realistic, deep competitive benchmark JSON:
{
  "target": {
    "domain": "${targetDomain}",
    "domainAuthority": number (1-100),
    "organicKeywords": number,
    "monthlyTraffic": string,
    "backlinks": string,
    "seoHealthScore": number,
    "coreStrength": string
  },
  "competitors": [
    {
      "domain": string,
      "domainAuthority": number,
      "organicKeywords": number,
      "monthlyTraffic": string,
      "backlinks": string,
      "seoHealthScore": number,
      "coreStrength": string,
      "trafficSharePercentage": number
    }
  ],
  "keywordGap": [
    {
      "keyword": string,
      "volume": number,
      "competitorRank": number,
      "yourRank": number or null,
      "opportunityScore": "High" | "Medium"
    }
  ],
  "strategicRecommendations": [
    {
      "title": string,
      "impact": "High" | "Medium",
      "action": string
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const compData = JSON.parse(jsonText);

    res.json({
      success: true,
      data: compData,
    });
  } catch (error: any) {
    console.error('Competitor Compare Error:', error);
    res.status(500).json({
      error: error.message || 'Failed to compare competitors',
    });
  }
});

// 4. One-Click AI Code Fix Generator Route
app.post('/api/generate-fix', async (req, res) => {
  try {
    const { fixType, url, details } = req.body;

    const prompt = `You are Rank Pilot's AI Technical SEO Code Generator.
Generate production-ready, clean, modern code to resolve this SEO issue:
Type: ${fixType} (e.g. "jsonld_schema", "robots_txt", "open_graph", "sitemap_xml", "canonical_tag", "security_headers", "meta_tags")
Website URL: ${url}
Context Details: ${JSON.stringify(details || {})}

Return JSON:
{
  "fixTitle": string,
  "language": "html" | "json" | "txt" | "nginx" | "javascript",
  "code": string (full copy-pasteable code snippet),
  "instructions": string (where to place this file or tag in HTML/server),
  "impact": string (why this fixes the ranking issue)
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text?.trim() || '{}';
    res.json({
      success: true,
      data: JSON.parse(jsonText),
    });
  } catch (error: any) {
    console.error('Fix Generator Error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate code fix',
    });
  }
});

// Vite dev middleware or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Rank Pilot Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
