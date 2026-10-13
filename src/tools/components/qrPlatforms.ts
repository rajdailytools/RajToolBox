import React from 'react';

export type QrCategory =
  | 'all'
  | 'essentials'
  | 'pdf'
  | 'messaging'
  | 'social'
  | 'media'
  | 'creative_dev'
  | 'business_forms';

export type QrType =
  // Essentials
  | 'url'
  | 'text'
  | 'wifi'
  | 'vcard'
  | 'upi'
  | 'email'
  | 'sms'
  | 'phone'
  | 'location'
  | 'calendar'
  // PDF
  | 'pdf'
  // Messaging & Chat
  | 'whatsapp'
  | 'telegram'
  | 'messenger'
  | 'signal'
  | 'discord'
  | 'snapchat'
  // Social Networks
  | 'instagram'
  | 'facebook'
  | 'x_twitter'
  | 'threads'
  | 'linkedin'
  | 'pinterest'
  | 'tiktok'
  | 'reddit'
  | 'tumblr'
  | 'bluesky'
  | 'mastodon'
  // Video, Music & Streaming
  | 'youtube'
  | 'vimeo'
  | 'twitch'
  | 'spotify'
  | 'soundcloud'
  // Creative, Dev & Publishing
  | 'github'
  | 'gitlab'
  | 'behance'
  | 'dribbble'
  | 'medium'
  | 'substack'
  // Forms & Business
  | 'google_forms'
  | 'event_reg'
  | 'product_link';

export interface PlatformItem {
  id: QrType;
  category: QrCategory;
  name: string;
  badge?: string;
  accentColor?: string;
  inputLabel: string;
  placeholder: string;
  exampleUrl: string;
  guideTitle: string;
  guideInstructions: string[];
  limitations?: string;
  defaultPayload: string;
  domainHint: string;
}

export const CATEGORIES: { id: QrCategory; label: string; count: number }[] = [
  { id: 'all', label: 'All Types', count: 36 },
  { id: 'essentials', label: 'Essentials & Utilities', count: 10 },
  { id: 'pdf', label: 'PDF Document', count: 1 },
  { id: 'messaging', label: 'Messaging & Chat', count: 6 },
  { id: 'social', label: 'Social Networks', count: 11 },
  { id: 'media', label: 'Video & Audio', count: 5 },
  { id: 'creative_dev', label: 'Creative & Dev', count: 6 },
  { id: 'business_forms', label: 'Forms & Business', count: 3 }
];

export const PLATFORMS: Record<QrType, PlatformItem> = {
  // --- 1. ESSENTIALS ---
  url: {
    id: 'url',
    category: 'essentials',
    name: 'Website URL',
    inputLabel: 'Website or Landing Page URL',
    placeholder: 'https://example.com/page',
    exampleUrl: 'https://rajtoolbox.com/tools/qr-code-generator/',
    domainHint: 'rajtoolbox.com',
    guideTitle: 'How to Use Website URL QR Codes',
    guideInstructions: [
      'Enter any valid HTTP or HTTPS address (e.g. portfolio, blog, or store).',
      'When scanned by iOS or Android camera, opens directly in the default browser.',
      'Always test the link on an actual smartphone before printing on posters or business cards.'
    ],
    defaultPayload: 'https://rajtoolbox.com'
  },
  text: {
    id: 'text',
    category: 'essentials',
    name: 'Plain Text',
    inputLabel: 'Plain Text Content',
    placeholder: 'Type or paste notes, serial numbers, passwords...',
    exampleUrl: 'Welcome to RajToolBox. Free, fast, private online tools.',
    domainHint: 'Plain Text',
    guideTitle: 'How to Use Plain Text QR Codes',
    guideInstructions: [
      'Encodes alphanumeric characters directly into the visual matrix.',
      'Works 100% offline — the phone does not require internet connection to read.',
      'Best for model numbers, serial tags, Wi-Fi keys, or emergency text memos.'
    ],
    defaultPayload: 'Welcome to RajToolBox. Free, fast, private online tools.'
  },
  wifi: {
    id: 'wifi',
    category: 'essentials',
    name: 'Wi-Fi Network',
    inputLabel: 'Wi-Fi Network Credentials',
    placeholder: 'Home_Guest_WiFi',
    exampleUrl: 'Office_Guest_WiFi',
    domainHint: 'Wi-Fi Access',
    guideTitle: 'How to Share Wi-Fi via QR Code',
    guideInstructions: [
      'Encodes standard ZXing Wi-Fi format: WIFI:T:WPA;S:Network;P:Password;;',
      'When scanned, prompts mobile devices to automatically join the Wi-Fi network.',
      'Works offline with zero server transmission. Never reveals password publicly.'
    ],
    defaultPayload: 'WIFI:T:WPA;S:Office_Guest_WiFi;P:Welcome2026!;;'
  },
  vcard: {
    id: 'vcard',
    category: 'essentials',
    name: 'Contact (vCard)',
    inputLabel: 'vCard 3.0 Contact Details',
    placeholder: 'Raj Sharma',
    exampleUrl: 'Raj Sharma, Lead Engineer',
    domainHint: 'vCard 3.0',
    guideTitle: 'How to Use Digital Business Card QR',
    guideInstructions: [
      'Encodes standard vCard 3.0 electronic business card specification.',
      'When scanned, prompts phones with a single tap "Add to Contacts" sheet.',
      'Keeps phone storage safe; no third-party contact syncing app required.'
    ],
    defaultPayload: 'BEGIN:VCARD\nVERSION:3.0\nN:Sharma;Raj;;;\nFN:Raj Sharma\nORG:RajToolBox Digital\nTEL;TYPE=CELL:+919876543210\nEMAIL:raj@rajtoolbox.com\nEND:VCARD'
  },
  upi: {
    id: 'upi',
    category: 'essentials',
    name: 'UPI Payment',
    inputLabel: 'UPI Virtual Payment Address (VPA)',
    placeholder: 'merchant@okhdfcbank',
    exampleUrl: 'merchant@okhdfcbank',
    domainHint: 'NPCI UPI',
    guideTitle: 'How to Use UPI Payment QR Codes',
    guideInstructions: [
      'Encodes upi://pay?pa=... URI following NPCI standard specifications.',
      'Compatible with Google Pay, PhonePe, Paytm, BHIM, and bank UPI apps across India.',
      'Amount and transaction note are optional. If left blank, customer enters amount at scan time.'
    ],
    defaultPayload: 'upi://pay?pa=merchant@okhdfcbank&pn=RajToolBox%20Store&cu=INR&am=250.00'
  },
  email: {
    id: 'email',
    category: 'essentials',
    name: 'Email Draft',
    inputLabel: 'Recipient Email & Subject',
    placeholder: 'contact@rajtoolbox.com',
    exampleUrl: 'contact@rajtoolbox.com',
    domainHint: 'mailto:',
    guideTitle: 'How to Use Email QR Codes',
    guideInstructions: [
      'Generates a mailto: link with prefilled recipient, subject line, and body text.',
      'When scanned, launches Gmail, Apple Mail, or Outlook with the prefilled draft.',
      'Useful for customer feedback cards, RSVP confirmations, and technical support.'
    ],
    defaultPayload: 'mailto:contact@rajtoolbox.com?subject=Enquiry&body=Hello'
  },
  sms: {
    id: 'sms',
    category: 'essentials',
    name: 'SMS Message',
    inputLabel: 'SMS Phone Number & Message',
    placeholder: '+91 98765 43210',
    exampleUrl: '+91 98765 43210',
    domainHint: 'SMSTO:',
    guideTitle: 'How to Use SMS QR Codes',
    guideInstructions: [
      'Encodes SMSTO: URI recognized by all mobile OS message applications.',
      'Tapping opens the default messaging app with the recipient number and draft body.',
      'Ideal for automated SMS opt-ins, concierge requests, and lead generation.'
    ],
    defaultPayload: 'SMSTO:+919876543210:Hello RajToolBox!'
  },
  phone: {
    id: 'phone',
    category: 'essentials',
    name: 'Phone Call',
    inputLabel: 'Telephone Number',
    placeholder: '+91 98765 43210',
    exampleUrl: '+91 98765 43210',
    domainHint: 'tel:',
    guideTitle: 'How to Use Phone Dial QR Codes',
    guideInstructions: [
      'Encodes a tel:+... URI scheme.',
      'When scanned, displays a phone prompt to dial the number immediately without typing.',
      'Perfect for emergency hotlines, restaurant reservations, and customer support desks.'
    ],
    defaultPayload: 'tel:+919876543210'
  },
  location: {
    id: 'location',
    category: 'essentials',
    name: 'Map Location',
    inputLabel: 'Coordinates & Google Maps Link',
    placeholder: '28.6139, 77.2090',
    exampleUrl: 'https://maps.google.com/?q=28.6139,77.2090',
    domainHint: 'maps.google.com',
    guideTitle: 'How to Use Map Location QR Codes',
    guideInstructions: [
      'Encodes either a Google Maps navigation link or standard geo: coordinates.',
      'Opens Google Maps or Apple Maps to guide customers directly to your storefront or event venue.',
      'Test coordinates in Google Maps first to verify accurate pin placement.'
    ],
    defaultPayload: 'https://maps.google.com/?q=28.6139,77.2090'
  },
  calendar: {
    id: 'calendar',
    category: 'essentials',
    name: 'Calendar Event',
    inputLabel: 'Event Details & Dates',
    placeholder: 'Product Launch 2026',
    exampleUrl: 'Product Launch Demo',
    domainHint: 'iCalendar VEVENT',
    guideTitle: 'How to Use Calendar Event QR Codes',
    guideInstructions: [
      'Encodes standard iCalendar (.ics / VEVENT) data format.',
      'Prompts phone calendar to add the event with date, time, title, location, and reminder.',
      'Great for webinar reminders, concerts, wedding invitations, and scheduled meetings.'
    ],
    defaultPayload: 'BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Product Launch Demo\nEND:VEVENT\nEND:VCALENDAR'
  },

  // --- 2. DEDICATED PDF QR CODE ---
  pdf: {
    id: 'pdf',
    category: 'pdf',
    name: 'PDF Document',
    badge: 'Popular',
    accentColor: '#DC2626',
    inputLabel: 'Public PDF Document URL',
    placeholder: 'https://example.com/menu.pdf or https://drive.google.com/file/d/...',
    exampleUrl: 'https://rajtoolbox.com/docs/annual-report.pdf',
    domainHint: '*.pdf / drive / cloud',
    guideTitle: 'How PDF QR Codes Work: Critical Facts',
    guideInstructions: [
      'A QR code stores a web address (URL) pointing to your PDF file on the internet.',
      'Because physical QR codes have a maximum capacity of ~2.9 KB binary data, full PDF documents (which are 100 KB to 50 MB) CANNOT be directly embedded inside the optical modules.',
      'Upload your PDF to Google Drive, Dropbox, Cloudflare, AWS, or your website, copy the public share link, and paste it here.',
      'Ensure link sharing permissions are set to "Anyone with the link can view".'
    ],
    limitations: 'The PDF must remain publicly accessible at that URL. If you rename or delete the file on your cloud storage, scanning phones will see a 404 error.',
    defaultPayload: 'https://rajtoolbox.com/docs/guide.pdf'
  },

  // --- 3. MESSAGING & CHAT ---
  whatsapp: {
    id: 'whatsapp',
    category: 'messaging',
    name: 'WhatsApp',
    badge: 'Chat',
    accentColor: '#25D366',
    inputLabel: 'WhatsApp Chat URL or wa.me Link',
    placeholder: 'https://wa.me/919876543210?text=Hello',
    exampleUrl: 'https://wa.me/919876543210?text=Hello%20RajToolBox',
    domainHint: 'wa.me / whatsapp.com',
    guideTitle: 'How to Share WhatsApp via QR Code',
    guideInstructions: [
      'Supports wa.me direct chat links (https://wa.me/<country_code><number>), group invitation links (https://chat.whatsapp.com/...), or channel links.',
      'You can also append an optional prefilled starting message (e.g. ?text=Enquiry).',
      'When scanned, opens WhatsApp directly with a conversation ready to send.'
    ],
    limitations: 'Never include the + or - signs inside the wa.me phone number parameter (e.g. use 919876543210, not +91-98765-43210).',
    defaultPayload: 'https://wa.me/919876543210?text=Hello%20RajToolBox'
  },
  telegram: {
    id: 'telegram',
    category: 'messaging',
    name: 'Telegram',
    badge: 'Channel / User',
    accentColor: '#229ED9',
    inputLabel: 'Telegram Username or Group Link',
    placeholder: 'https://t.me/yourusername or https://t.me/+joinlink',
    exampleUrl: 'https://t.me/rajtoolbox',
    domainHint: 't.me',
    guideTitle: 'How to Share Telegram via QR Code',
    guideInstructions: [
      'Enter your public profile (https://t.me/username), channel link, or group join link.',
      'Scanners with Telegram installed jump directly into the app; desktop scanners open Telegram Web.',
      'Verify that your Telegram username or group invitation is active and public.'
    ],
    limitations: 'Private invite links will only work if the invite link has not expired or been revoked in Telegram settings.',
    defaultPayload: 'https://t.me/rajtoolbox'
  },
  messenger: {
    id: 'messenger',
    category: 'messaging',
    name: 'Messenger',
    accentColor: '#00B2FF',
    inputLabel: 'Facebook Messenger Direct Link',
    placeholder: 'https://m.me/yourusername or https://m.me/pageid',
    exampleUrl: 'https://m.me/rajtoolbox',
    domainHint: 'm.me',
    guideTitle: 'How to Share Messenger via QR Code',
    guideInstructions: [
      'Use the official Facebook Messenger short link: https://m.me/<username> or https://m.me/<PageID>.',
      'When scanned on mobile, launches the Messenger app directly to your chat window.',
      'Ensure your Facebook Page has "Allow people to contact my Page privately in Messenger" turned on.'
    ],
    defaultPayload: 'https://m.me/rajtoolbox'
  },
  signal: {
    id: 'signal',
    category: 'messaging',
    name: 'Signal',
    accentColor: '#3A76F0',
    inputLabel: 'Signal Shareable Link',
    placeholder: 'https://signal.me/#p/+1234567890 or https://signal.group/#...',
    exampleUrl: 'https://signal.me/#p/+1234567890',
    domainHint: 'signal.me / signal.group',
    guideTitle: 'How to Share Signal via QR Code',
    guideInstructions: [
      'Signal provides official direct links: https://signal.me/#p/<phone_number> or group links: https://signal.group/#<token>.',
      'Obtain your shareable link directly from Signal app -> Profile -> Share link.',
      'Preserves Signal end-to-end encryption. Scanning phones with Signal will open your contact or group invite.'
    ],
    limitations: 'Signal requires the recipient to have Signal installed to initiate secure messaging.',
    defaultPayload: 'https://signal.me/#p/+1234567890'
  },
  discord: {
    id: 'discord',
    category: 'messaging',
    name: 'Discord',
    accentColor: '#5865F2',
    inputLabel: 'Discord Server or Community Invite Link',
    placeholder: 'https://discord.gg/yourinvite or https://discord.com/invite/...',
    exampleUrl: 'https://discord.gg/examplecommunity',
    domainHint: 'discord.gg',
    guideTitle: 'How to Share Discord via QR Code',
    guideInstructions: [
      'Paste your server invite link: https://discord.gg/<code_here>.',
      'In Discord server settings, ensure your invite is set to "Never expire" if using on printed flyers.',
      'Scanners on mobile will open the Discord mobile app or prompt to sign in.'
    ],
    limitations: 'If the Discord invite code expires or reaches its maximum usage limit, scanners will receive an invalid invite screen.',
    defaultPayload: 'https://discord.gg/examplecommunity'
  },
  snapchat: {
    id: 'snapchat',
    category: 'messaging',
    name: 'Snapchat',
    accentColor: '#FFFC00',
    inputLabel: 'Snapchat Public Profile Link',
    placeholder: 'https://snapchat.com/add/username or https://www.snapchat.com/@username',
    exampleUrl: 'https://snapchat.com/add/rajtoolbox',
    domainHint: 'snapchat.com',
    guideTitle: 'How to Share Snapchat via QR Code',
    guideInstructions: [
      'Format as: https://snapchat.com/add/<username> or https://www.snapchat.com/@<username>.',
      'When scanned by a smartphone, prompts the user to add you on Snapchat or view your public story.',
      'Great for personal branding, influencers, and college campus promotion.'
    ],
    defaultPayload: 'https://snapchat.com/add/rajtoolbox'
  },

  // --- 4. SOCIAL NETWORKS ---
  instagram: {
    id: 'instagram',
    category: 'social',
    name: 'Instagram',
    badge: 'Popular',
    accentColor: '#E1306C',
    inputLabel: 'Instagram Profile, Post, or Reel URL',
    placeholder: 'https://instagram.com/yourusername or https://instagram.com/reel/...',
    exampleUrl: 'https://instagram.com/rajtoolbox',
    domainHint: 'instagram.com',
    guideTitle: 'How to Share Instagram via QR Code',
    guideInstructions: [
      'Paste your profile URL: https://instagram.com/<username> or a specific Reel/Post URL.',
      'When scanned on iOS or Android, opens the Instagram app directly to your profile.',
      'Ensure your account is public if you want anyone to see your posts.'
    ],
    limitations: 'Private accounts require the scanner to request and be approved before viewing photos.',
    defaultPayload: 'https://instagram.com/rajtoolbox'
  },
  facebook: {
    id: 'facebook',
    category: 'social',
    name: 'Facebook',
    accentColor: '#1877F2',
    inputLabel: 'Facebook Page, Profile, or Group URL',
    placeholder: 'https://facebook.com/yourpage or https://facebook.com/groups/...',
    exampleUrl: 'https://facebook.com/rajtoolbox',
    domainHint: 'facebook.com',
    guideTitle: 'How to Share Facebook via QR Code',
    guideInstructions: [
      'Paste your business Page URL, personal profile, or public group address.',
      'Scanners will be directed to your Facebook presence to Like, Follow, or Join.',
      'Ideal for restaurants, retail storefronts, and local community events.'
    ],
    defaultPayload: 'https://facebook.com/rajtoolbox'
  },
  x_twitter: {
    id: 'x_twitter',
    category: 'social',
    name: 'X (Twitter)',
    accentColor: '#000000',
    inputLabel: 'X (Twitter) Profile or Post URL',
    placeholder: 'https://x.com/yourhandle or https://twitter.com/yourhandle',
    exampleUrl: 'https://x.com/rajtoolbox',
    domainHint: 'x.com / twitter.com',
    guideTitle: 'How to Share X (Twitter) via QR Code',
    guideInstructions: [
      'Enter your public handle URL: https://x.com/<handle> or a link to a specific viral post.',
      'When scanned, opens in the X mobile app or browser.',
      'Use for conference presentations, podcast promos, and tech announcements.'
    ],
    defaultPayload: 'https://x.com/rajtoolbox'
  },
  threads: {
    id: 'threads',
    category: 'social',
    name: 'Threads',
    accentColor: '#000000',
    inputLabel: 'Threads Profile or Post URL',
    placeholder: 'https://threads.net/@yourusername',
    exampleUrl: 'https://threads.net/@rajtoolbox',
    domainHint: 'threads.net',
    guideTitle: 'How to Share Threads via QR Code',
    guideInstructions: [
      'Format as: https://threads.net/@<username> or https://threads.net/@<username>/post/<id>.',
      'Opens the Threads app on mobile so users can follow you with a single tap.',
      'Works with any active Threads account linked from Instagram.'
    ],
    defaultPayload: 'https://threads.net/@rajtoolbox'
  },
  linkedin: {
    id: 'linkedin',
    category: 'social',
    name: 'LinkedIn',
    badge: 'Pro',
    accentColor: '#0A66C2',
    inputLabel: 'LinkedIn Profile or Company Page URL',
    placeholder: 'https://linkedin.com/in/yourname or https://linkedin.com/company/yourbrand',
    exampleUrl: 'https://linkedin.com/in/raj-sharma-tech',
    domainHint: 'linkedin.com',
    guideTitle: 'How to Share LinkedIn via QR Code',
    guideInstructions: [
      'Paste your custom public profile URL: https://linkedin.com/in/<slug> or company page URL.',
      'Perfect for business cards, resume headers, networking badges, and conference slides.',
      'Enables instant professional connections without exchanging physical paper cards.'
    ],
    defaultPayload: 'https://linkedin.com/in/raj-sharma-tech'
  },
  pinterest: {
    id: 'pinterest',
    category: 'social',
    name: 'Pinterest',
    accentColor: '#E60023',
    inputLabel: 'Pinterest Profile, Board, or Pin URL',
    placeholder: 'https://pinterest.com/yourusername or https://pinterest.com/username/boardname',
    exampleUrl: 'https://pinterest.com/rajtoolbox',
    domainHint: 'pinterest.com',
    guideTitle: 'How to Share Pinterest via QR Code',
    guideInstructions: [
      'Enter your Pinterest account URL, public inspiration board, or specific Pin.',
      'Ideal for wedding planners, interior designers, craft makers, and recipe authors.',
      'Scanners can save your pins or follow your boards directly.'
    ],
    defaultPayload: 'https://pinterest.com/rajtoolbox'
  },
  tiktok: {
    id: 'tiktok',
    category: 'social',
    name: 'TikTok',
    badge: 'Video',
    accentColor: '#00F2FE',
    inputLabel: 'TikTok Profile or Video URL',
    placeholder: 'https://tiktok.com/@yourusername or https://tiktok.com/@user/video/...',
    exampleUrl: 'https://tiktok.com/@rajtoolbox',
    domainHint: 'tiktok.com',
    guideTitle: 'How to Share TikTok via QR Code',
    guideInstructions: [
      'Paste your TikTok profile URL: https://tiktok.com/@<handle> or video share link.',
      'When scanned by a smartphone camera, immediately opens the TikTok app to your content.',
      'Best for packaging labels, retail counter stands, and music promotions.'
    ],
    defaultPayload: 'https://tiktok.com/@rajtoolbox'
  },
  reddit: {
    id: 'reddit',
    category: 'social',
    name: 'Reddit',
    accentColor: '#FF4500',
    inputLabel: 'Reddit Subreddit, User, or Post URL',
    placeholder: 'https://reddit.com/r/community or https://reddit.com/user/yourname',
    exampleUrl: 'https://reddit.com/r/technology',
    domainHint: 'reddit.com',
    guideTitle: 'How to Share Reddit via QR Code',
    guideInstructions: [
      'Enter any public subreddit URL (https://reddit.com/r/<name>), user profile, or thread.',
      'Mobile phones prompt to open in official Reddit client or web browser.',
      'Useful for AMA sessions, open discussions, and community forums.'
    ],
    defaultPayload: 'https://reddit.com/r/technology'
  },
  tumblr: {
    id: 'tumblr',
    category: 'social',
    name: 'Tumblr',
    accentColor: '#36465D',
    inputLabel: 'Tumblr Blog or Post URL',
    placeholder: 'https://yourblog.tumblr.com or https://tumblr.com/...',
    exampleUrl: 'https://rajtoolbox.tumblr.com',
    domainHint: 'tumblr.com',
    guideTitle: 'How to Share Tumblr via QR Code',
    guideInstructions: [
      'Enter your blog domain or public Tumblr post URL.',
      'Directs art, literature, and photography enthusiasts straight to your microblog.',
      'Ensures scannable resolution across all display devices.'
    ],
    defaultPayload: 'https://rajtoolbox.tumblr.com'
  },
  bluesky: {
    id: 'bluesky',
    category: 'social',
    name: 'Bluesky',
    accentColor: '#1185FE',
    inputLabel: 'Bluesky Profile or Post URL',
    placeholder: 'https://bsky.app/profile/username.bsky.social',
    exampleUrl: 'https://bsky.app/profile/rajtoolbox.bsky.social',
    domainHint: 'bsky.app',
    guideTitle: 'How to Share Bluesky via QR Code',
    guideInstructions: [
      'Enter your Bluesky handle address: https://bsky.app/profile/<handle>.',
      'Scanners with the Bluesky app or browser can view your decentralized feed.',
      'Ideal for open web journalists, researchers, and decentralized social advocates.'
    ],
    defaultPayload: 'https://bsky.app/profile/rajtoolbox.bsky.social'
  },
  mastodon: {
    id: 'mastodon',
    category: 'social',
    name: 'Mastodon',
    accentColor: '#6364FF',
    inputLabel: 'Mastodon Profile URL (Any Instance)',
    placeholder: 'https://mastodon.social/@yourusername or https://fosstodon.org/@name',
    exampleUrl: 'https://mastodon.social/@rajtoolbox',
    domainHint: 'mastodon.social / Fediverse',
    guideTitle: 'How to Share Mastodon via QR Code',
    guideInstructions: [
      'Supports any public Fediverse/Mastodon instance URL: https://<instance>/@<username>.',
      'Provides a clean public link that anyone on the web can inspect and follow.',
      'Works seamlessly across all Mastodon mobile apps.'
    ],
    defaultPayload: 'https://mastodon.social/@rajtoolbox'
  },

  // --- 5. VIDEO, MUSIC & STREAMING ---
  youtube: {
    id: 'youtube',
    category: 'media',
    name: 'YouTube',
    badge: 'Video',
    accentColor: '#FF0000',
    inputLabel: 'YouTube Channel, Video, Shorts, or Playlist URL',
    placeholder: 'https://youtube.com/@channel or https://youtu.be/video_id',
    exampleUrl: 'https://youtube.com/@rajtoolbox',
    domainHint: 'youtube.com / youtu.be',
    guideTitle: 'How to Share YouTube via QR Code',
    guideInstructions: [
      'Paste your YouTube channel (https://youtube.com/@handle), video, Shorts, or playlist URL.',
      'When scanned by a smartphone camera, immediately opens the YouTube app and starts playback.',
      'Perfect for physical product packaging, instruction manuals, and poster trailers.'
    ],
    defaultPayload: 'https://youtube.com/@rajtoolbox'
  },
  vimeo: {
    id: 'vimeo',
    category: 'media',
    name: 'Vimeo',
    accentColor: '#1AB7EA',
    inputLabel: 'Vimeo Video or Profile URL',
    placeholder: 'https://vimeo.com/123456789 or https://vimeo.com/channelname',
    exampleUrl: 'https://vimeo.com/channels/staffpicks',
    domainHint: 'vimeo.com',
    guideTitle: 'How to Share Vimeo via QR Code',
    guideInstructions: [
      'Enter your Vimeo showcase, portfolio reel, or video address.',
      'Great for filmmakers, videographers, and agency showreels.',
      'Scanners can view high-definition playback directly in browser.'
    ],
    defaultPayload: 'https://vimeo.com/channels/staffpicks'
  },
  twitch: {
    id: 'twitch',
    category: 'media',
    name: 'Twitch',
    accentColor: '#9146FF',
    inputLabel: 'Twitch Live Channel URL',
    placeholder: 'https://twitch.tv/yourchannel',
    exampleUrl: 'https://twitch.tv/rajtoolbox',
    domainHint: 'twitch.tv',
    guideTitle: 'How to Share Twitch via QR Code',
    guideInstructions: [
      'Format as: https://twitch.tv/<channel_name>.',
      'Enables esports viewers and livestream fans to find and follow your stream with one scan.',
      'Works in Twitch mobile app and desktop browsers.'
    ],
    defaultPayload: 'https://twitch.tv/rajtoolbox'
  },
  spotify: {
    id: 'spotify',
    category: 'media',
    name: 'Spotify',
    badge: 'Audio',
    accentColor: '#1ED760',
    inputLabel: 'Spotify Track, Album, Artist, or Playlist URL',
    placeholder: 'https://open.spotify.com/track/... or /artist/... or /playlist/...',
    exampleUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
    domainHint: 'open.spotify.com',
    guideTitle: 'How to Share Spotify via QR Code',
    guideInstructions: [
      'Copy the link to your song, podcast episode, album, or playlist from Spotify -> Share -> Copy Link.',
      'Paste the standard https://open.spotify.com/... URL.',
      'When scanned, immediately opens the Spotify mobile app ready to play.'
    ],
    defaultPayload: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M'
  },
  soundcloud: {
    id: 'soundcloud',
    category: 'media',
    name: 'SoundCloud',
    accentColor: '#FF5500',
    inputLabel: 'SoundCloud Track or Artist Profile URL',
    placeholder: 'https://soundcloud.com/artist/trackname',
    exampleUrl: 'https://soundcloud.com/discover',
    domainHint: 'soundcloud.com',
    guideTitle: 'How to Share SoundCloud via QR Code',
    guideInstructions: [
      'Paste your track or DJ set URL from soundcloud.com.',
      'Essential for gig flyers, album launch parties, and indie musician promotion.',
      'Scanners can stream music without requiring account login.'
    ],
    defaultPayload: 'https://soundcloud.com/discover'
  },

  // --- 6. CREATIVE, DEV & PUBLISHING ---
  github: {
    id: 'github',
    category: 'creative_dev',
    name: 'GitHub',
    badge: 'Code',
    accentColor: '#181717',
    inputLabel: 'GitHub Profile or Repository URL',
    placeholder: 'https://github.com/username or https://github.com/owner/repository',
    exampleUrl: 'https://github.com/raj-toolbox',
    domainHint: 'github.com',
    guideTitle: 'How to Share GitHub via QR Code',
    guideInstructions: [
      'Paste your public GitHub profile or open-source repository URL.',
      'Great for developer portfolios, hackathon presentations, and technical resumes.',
      'Enables hiring managers and contributors to star or clone your work immediately.'
    ],
    defaultPayload: 'https://github.com/raj-toolbox'
  },
  gitlab: {
    id: 'gitlab',
    category: 'creative_dev',
    name: 'GitLab',
    accentColor: '#FC6D26',
    inputLabel: 'GitLab Profile or Project URL',
    placeholder: 'https://gitlab.com/username or https://gitlab.com/group/project',
    exampleUrl: 'https://gitlab.com/gitlab-org/gitlab',
    domainHint: 'gitlab.com',
    guideTitle: 'How to Share GitLab via QR Code',
    guideInstructions: [
      'Paste your public GitLab repository or developer profile URL.',
      'Directs software engineers directly to your CI/CD pipelines and repositories.',
      'Works with gitlab.com or self-hosted enterprise GitLab instances.'
    ],
    defaultPayload: 'https://gitlab.com/gitlab-org/gitlab'
  },
  behance: {
    id: 'behance',
    category: 'creative_dev',
    name: 'Behance',
    badge: 'Design',
    accentColor: '#1769FF',
    inputLabel: 'Behance Profile or Project Portfolio URL',
    placeholder: 'https://behance.net/yourusername or https://behance.net/gallery/...',
    exampleUrl: 'https://behance.net/rajtoolbox',
    domainHint: 'behance.net',
    guideTitle: 'How to Share Behance via QR Code',
    guideInstructions: [
      'Paste your Behance portfolio URL or case study link.',
      'Indispensable for graphic designers, UI/UX illustrators, and branding studios.',
      'High contrast QR ensures flawless scanning from printed lookbooks.'
    ],
    defaultPayload: 'https://behance.net/rajtoolbox'
  },
  dribbble: {
    id: 'dribbble',
    category: 'creative_dev',
    name: 'Dribbble',
    accentColor: '#EA4C89',
    inputLabel: 'Dribbble Profile or Shot URL',
    placeholder: 'https://dribbble.com/yourusername or https://dribbble.com/shots/...',
    exampleUrl: 'https://dribbble.com/rajtoolbox',
    domainHint: 'dribbble.com',
    guideTitle: 'How to Share Dribbble via QR Code',
    guideInstructions: [
      'Paste your Dribbble profile or design shot URL.',
      'Perfect for creative agencies, freelance designers, and 3D animators.',
      'Enables potential clients to view your latest work with a single camera scan.'
    ],
    defaultPayload: 'https://dribbble.com/rajtoolbox'
  },
  medium: {
    id: 'medium',
    category: 'creative_dev',
    name: 'Medium',
    accentColor: '#000000',
    inputLabel: 'Medium Profile or Article Publication URL',
    placeholder: 'https://medium.com/@yourusername or https://medium.com/publication/article',
    exampleUrl: 'https://medium.com/@rajtoolbox',
    domainHint: 'medium.com',
    guideTitle: 'How to Share Medium via QR Code',
    guideInstructions: [
      'Paste your Medium author profile or deep-dive publication link.',
      'Great for thought leadership, academic papers, and technical blogs.',
      'Readers on mobile devices will enjoy Medium clean reading layout.'
    ],
    defaultPayload: 'https://medium.com/@rajtoolbox'
  },
  substack: {
    id: 'substack',
    category: 'creative_dev',
    name: 'Substack',
    badge: 'Newsletter',
    accentColor: '#FF6719',
    inputLabel: 'Substack Newsletter or Publication URL',
    placeholder: 'https://yourname.substack.com or https://publication.substack.com/p/...',
    exampleUrl: 'https://rajtoolbox.substack.com',
    domainHint: 'substack.com',
    guideTitle: 'How to Share Substack via QR Code',
    guideInstructions: [
      'Paste your Substack newsletter homepage or specific post URL.',
      'When scanned, immediately loads your signup form so readers can subscribe to your newsletter.',
      'Ideal for author book signings, podcast notes, and physical newsletters.'
    ],
    defaultPayload: 'https://rajtoolbox.substack.com'
  },

  // --- 7. FORMS & BUSINESS ---
  google_forms: {
    id: 'google_forms',
    category: 'business_forms',
    name: 'Google Forms',
    badge: 'Forms',
    accentColor: '#7248B9',
    inputLabel: 'Google Forms or Survey Share URL',
    placeholder: 'https://forms.gle/xyz or https://docs.google.com/forms/d/e/...',
    exampleUrl: 'https://forms.gle/sampleSurveyForm2026',
    domainHint: 'forms.gle / docs.google.com',
    guideTitle: 'How to Share Google Forms via QR Code',
    guideInstructions: [
      'Paste your public Google Forms link (either the short forms.gle link or full docs.google.com link).',
      'Ensure "Limit to 1 response" or domain-restricted login is disabled if you want public customer responses.',
      'Ideal for restaurant feedback, classroom quizzes, workshop surveys, and event signups.'
    ],
    defaultPayload: 'https://forms.gle/sampleSurveyForm2026'
  },
  event_reg: {
    id: 'event_reg',
    category: 'business_forms',
    name: 'Event Registration',
    accentColor: '#10B981',
    inputLabel: 'Event Registration URL (Luma, Eventbrite, Meetup)',
    placeholder: 'https://lu.ma/yourevent or https://eventbrite.com/e/...',
    exampleUrl: 'https://lu.ma/techmeetup2026',
    domainHint: 'lu.ma / eventbrite.com',
    guideTitle: 'How to Share Event Registration via QR Code',
    guideInstructions: [
      'Paste your ticket booking or RSVP page link from Luma, Eventbrite, Meetup, or your website.',
      'Print on flyers, invitations, campus posters, and presentation slides.',
      'Attendees can scan and register their tickets on their phone in seconds.'
    ],
    defaultPayload: 'https://lu.ma/techmeetup2026'
  },
  product_link: {
    id: 'product_link',
    category: 'business_forms',
    name: 'Product / Catalogue',
    badge: 'Store',
    accentColor: '#F59E0B',
    inputLabel: 'Product, Menu, or Online Catalogue URL',
    placeholder: 'https://store.example.com/product/item or https://catalogue.example.com',
    exampleUrl: 'https://rajtoolbox.com/store/products',
    domainHint: 'Store / Catalogue',
    guideTitle: 'How to Share Product or Catalogue via QR Code',
    guideInstructions: [
      'Paste your online product page, Shopify store link, Etsy shop, or digital PDF menu catalogue.',
      'Place on physical product boxes, showroom shelves, or exhibition display booths.',
      'Customers can scan to view prices, specifications, reviews, and order online directly.'
    ],
    defaultPayload: 'https://rajtoolbox.com/store/products'
  }
};
