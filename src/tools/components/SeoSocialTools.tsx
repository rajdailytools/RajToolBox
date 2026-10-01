import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Copy, Download, Check, Globe, Share2, Hash } from 'lucide-react';

// META TAG & OPEN GRAPH GENERATOR
export const MetaTagGeneratorComponent: React.FC = () => {
  const { showToast } = useApp();
  const [title, setTitle] = useState('RajToolBox – Powerful Online Tools. Simple to Use.');
  const [description, setDescription] = useState(
    'Free, fast, and secure online tools for PDF, images, text, developer utilities, unit converters, and SEO.'
  );
  const [url, setUrl] = useState('https://rajtoolbox.com');
  const [imageUrl, setImageUrl] = useState('https://rajtoolbox.com/og-banner.png');
  const [siteName, setSiteName] = useState('RajToolBox');
  const [author, setAuthor] = useState('Raj Singh Sengar');

  const metaHtml = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">
<meta name="author" content="${author}">
<link rel="canonical" href="${url}">

<!-- Open Graph / Facebook / LinkedIn -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:site_name" content="${siteName}">

<!-- Twitter / X -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${imageUrl}">`;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <label className="text-[#71717A]">Page Title</label>
            <span className={title.length > 60 ? 'text-[#DC2626]' : 'text-[#16A34A]'}>
              {title.length}/60 chars
            </span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <label className="text-[#71717A]">Canonical URL</label>
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs font-bold mb-1">
          <label className="text-[#71717A]">Meta Description</label>
          <span className={description.length > 160 ? 'text-[#DC2626]' : 'text-[#16A34A]'}>
            {description.length}/160 chars
          </span>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-[#71717A] mb-1">Social Banner Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#71717A] mb-1">Site Brand Name</label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#71717A] mb-1">Author Name</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
      </div>

      {/* Generated Code Area */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#71717A]">Generated HTML Snippet</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(metaHtml);
              showToast('Meta tags copied!', 'success');
            }}
            className="text-xs font-bold text-[#EC4899] hover:underline flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Meta Tags</span>
          </button>
        </div>
        <pre className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#EC4899] font-mono text-xs overflow-x-auto">
          {metaHtml}
        </pre>
      </div>
    </div>
  );
};

// ROBOTS.TXT GENERATOR
export const RobotsTxtComponent: React.FC = () => {
  const { showToast } = useApp();
  const [sitemapUrl, setSitemapUrl] = useState('https://rajtoolbox.com/sitemap.xml');
  const [disallowAdmin, setDisallowAdmin] = useState(true);
  const [disallowPrivate, setDisallowPrivate] = useState(true);

  const robotsText = `User-agent: *
Allow: /
${disallowAdmin ? 'Disallow: /admin/\n' : ''}${disallowPrivate ? 'Disallow: /private/\n' : ''}
Sitemap: ${sitemapUrl}`;

  const downloadRobots = () => {
    const blob = new Blob([robotsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    a.click();
    showToast('Downloaded robots.txt!', 'success');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-[#71717A] mb-1">XML Sitemap URL</label>
        <input
          type="url"
          value={sitemapUrl}
          onChange={(e) => setSitemapUrl(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
        />
      </div>

      <div className="flex flex-wrap gap-4 text-xs font-medium">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={disallowAdmin}
            onChange={(e) => setDisallowAdmin(e.target.checked)}
            className="accent-[#EC4899]"
          />
          <span>Block /admin/ directory</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={disallowPrivate}
            onChange={(e) => setDisallowPrivate(e.target.checked)}
            className="accent-[#EC4899]"
          />
          <span>Block /private/ directory</span>
        </label>
      </div>

      <div className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
        <pre className="font-mono text-xs text-[#18181B] dark:text-[#F4F4F5] whitespace-pre-wrap">
          {robotsText}
        </pre>
      </div>

      <div className="flex gap-2">
        <button
          onClick={downloadRobots}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777]"
        >
          <Download className="w-4 h-4" />
          <span>Download robots.txt</span>
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(robotsText);
            showToast('Robots text copied!', 'success');
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold"
        >
          <Copy className="w-4 h-4" />
          <span>Copy</span>
        </button>
      </div>
    </div>
  );
};

// UTM CAMPAIGN BUILDER
export const UtmBuilderComponent: React.FC = () => {
  const { showToast } = useApp();
  const [baseUrl, setBaseUrl] = useState('https://rajtoolbox.com');
  const [source, setSource] = useState('twitter');
  const [medium, setMedium] = useState('social');
  const [campaign, setCampaign] = useState('launch2026');

  const buildUrl = () => {
    try {
      const u = new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
      if (source) u.searchParams.set('utm_source', source);
      if (medium) u.searchParams.set('utm_medium', medium);
      if (campaign) u.searchParams.set('utm_campaign', campaign);
      return u.toString();
    } catch {
      return `${baseUrl}?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`;
    }
  };

  const trackedUrl = buildUrl();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-[#71717A] mb-1">Base Website URL</label>
        <input
          type="url"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-[#71717A] mb-1">Campaign Source (utm_source)</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="google, twitter, newsletter"
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#71717A] mb-1">Campaign Medium (utm_medium)</label>
          <input
            type="text"
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            placeholder="cpc, banner, email"
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#71717A] mb-1">Campaign Name (utm_campaign)</label>
          <input
            type="text"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            placeholder="promo2026, spring_sale"
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40">
        <span className="text-xs font-bold text-[#71717A] block mb-1">Generated Tracked URL</span>
        <p className="font-mono text-xs text-[#EC4899] break-all">{trackedUrl}</p>
        <button
          onClick={() => {
            navigator.clipboard.writeText(trackedUrl);
            showToast('Tracked URL copied!', 'success');
          }}
          className="mt-3 px-3 py-1.5 rounded-lg bg-[#EC4899] text-white text-xs font-bold"
        >
          Copy Tracked Link
        </button>
      </div>
    </div>
  );
};

// KEYWORD DENSITY CHECKER
export const KeywordDensityComponent: React.FC = () => {
  const [content, setContent] = useState(
    'RajToolBox is a practical online tools platform created by Raj Singh Sengar. The platform offers free online tools including PDF merger, image compressor, unit converter, and word counter. All online tools execute securely in your web browser.'
  );

  const analyzeKeywords = () => {
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2);

    const stopWords = new Set(['the', 'and', 'for', 'that', 'this', 'with', 'from', 'your', 'all']);
    const freq: Record<string, number> = {};

    words.forEach((w) => {
      if (!stopWords.has(w)) {
        freq[w] = (freq[w] || 0) + 1;
      }
    });

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word, count]) => ({
        word,
        count,
        density: ((count / (words.length || 1)) * 100).toFixed(1)
      }));
  };

  const topKeywords = analyzeKeywords();

  return (
    <div className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className="w-full p-3 text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
      />

      <div className="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl overflow-hidden bg-white dark:bg-[#18181B]">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#F4F4F5] dark:bg-[#202026] text-[#71717A] uppercase text-[10px]">
            <tr>
              <th className="p-3">Keyword</th>
              <th className="p-3">Occurrences</th>
              <th className="p-3">Density %</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7] dark:divide-[#27272A]">
            {topKeywords.map((k) => (
              <tr key={k.word}>
                <td className="p-3 font-bold font-mono text-[#EC4899]">{k.word}</td>
                <td className="p-3 font-semibold">{k.count}</td>
                <td className="p-3 font-semibold">{k.density}%</td>
                <td className="p-3">
                  {parseFloat(k.density) > 5 ? (
                    <span className="text-[#DC2626] font-bold">High Density</span>
                  ) : (
                    <span className="text-[#16A34A] font-bold">Optimal (1%–4%)</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// SOCIAL MEDIA POST & HASHTAG FORMATTER
export const SocialPostFormatterComponent: React.FC = () => {
  const { showToast } = useApp();
  const [caption, setCaption] = useState(
    'Powerful Online Tools. Simple to Use.\n\nDiscover 40+ free browser-based tools for productivity, files, and math!'
  );
  const [tags, setTags] = useState('onlinetools, webdev, productivity, designer');

  const addZeroWidthBreaks = () => {
    const formatted = caption
      .split('\n')
      .map((line) => (line.trim() === '' ? '\u200B' : line))
      .join('\n');
    setCaption(formatted);
    showToast('Clean invisible breaks inserted!', 'success');
  };

  const formatTags = () => {
    const cleanTags = tags
      .split(/[,\s]+/)
      .map((t) => t.replace(/^#/, '').trim())
      .filter((t) => t.length > 0)
      .map((t) => `#${t}`)
      .join(' ');
    setTags(cleanTags);
    showToast('Hashtags formatted!', 'success');
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-xs font-bold text-[#71717A] mb-1">
          <label>Post Caption</label>
          <span>Instagram: {caption.length}/2200 | X: {caption.length}/280</span>
        </div>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={5}
          className="w-full p-3 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={addZeroWidthBreaks}
          className="px-3 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold hover:border-[#EC4899]"
        >
          Preserve Line Breaks (Zero-width spaces)
        </button>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#71717A] mb-1">Hashtags</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
        />
        <button
          onClick={formatTags}
          className="mt-2 px-3 py-1.5 rounded-lg bg-[#EC4899] text-white text-xs font-bold"
        >
          Format & Prefix Hashtags
        </button>
      </div>
    </div>
  );
};
