import { subscriptionTools, software } from '@/lib/data';

export interface CategorySeoContent {
  detailedIntro: string;
  whySwitch: string[];
  faq: { question: string; answer: string }[];
}

const categoryIntros: Record<string, (tools: string, alts: string, count: number) => string> = {
  DESIGN: (tools, alts, count) =>
    `The design software category is one of the most subscription-heavy markets in tech. ${tools} all charge monthly fees that add up to hundreds of dollars per year. But the landscape has changed dramatically — ${count} non-subscription design tools now offer professional-grade features including vector editing, raster graphics, UI design, and photo retouching. ${alts} Whether you're a professional designer, freelancer, or hobbyist, switching from subscription design software can save you $200-$500+ per year without sacrificing quality.`,
  VIDEO_AUDIO: (tools, alts, count) =>
    `Video and audio editing software has traditionally been expensive and subscription-based. ${tools} charge monthly fees that add up quickly for content creators. The good news: ${count} non-subscription alternatives now cover professional editing, color grading, audio mixing, and motion graphics. ${alts} DaVinci Resolve in particular has become the industry standard for color grading — and it's free. For most content creators, switching eliminates $150-$300/year in subscription costs.`,
  PRODUCTIVITY: (tools, alts, count) =>
    `Productivity software — task managers, note-taking apps, project management tools — is among the most commonly subscribed categories. ${tools} all charge recurring fees for features that have been commoditized. ${count} non-subscription alternatives offer the same core functionality: task management, note-taking, collaboration, and organization. ${alts} The key advantage beyond cost: many alternatives store your data locally, giving you better privacy and offline access.`,
  WRITING: (tools, alts, count) =>
    `Writing tools like ${tools} have become essential for many professionals, but the subscription costs add up. ${count} non-subscription alternatives handle grammar checking, style suggestions, and document editing. ${alts} Grammar checking technology has matured to the point where free tools catch the same critical errors as paid subscriptions. The main question is whether premium style suggestions justify $10-$15/month.`,
  SECURITY: (tools, alts, count) =>
    `Password managers and security tools are critical infrastructure, but they don't need to be expensive. ${tools} charge monthly fees for security features based on well-established encryption standards. ${count} non-subscription alternatives use the same AES-256 encryption — the security is mathematically identical. ${alts} What you pay for with subscription security tools is UX polish, not better protection. Free and open-source options like Bitwarden and KeePassXC are audited, trusted, and cost nothing.`,
  STORAGE: (tools, alts, count) =>
    `Cloud storage has become a commodity, yet ${tools} continue charging premium prices. ${count} non-subscription alternatives offer file sync, sharing, and backup — often with more storage for less money. ${alts} Google Drive, OneDrive, and self-hosted solutions like Nextcloud provide the same core features. Most users already have free cloud storage through Google or Microsoft that they're not fully utilizing.`,
  BUSINESS: (tools, alts, count) =>
    `Business software subscriptions are often the largest recurring software expense for companies. ${tools} charge per-user monthly fees that scale painfully with team growth. ${count} non-subscription alternatives provide CRM, invoicing, and business management features without per-user pricing. ${alts} Self-hosted options eliminate recurring fees entirely while giving you full control over sensitive business data.`,
  AI_TOOLS: (tools, alts, count) =>
    `AI tools have exploded in popularity, but subscription costs add up fast. ${tools} charge $10-$30/month for AI capabilities. ${count} non-subscription alternatives exist, including local and self-hosted models that run on your own hardware. ${alts} The gap between cloud AI and local AI is narrowing rapidly. For many tasks — writing assistance, code completion, research — local models produce comparable results at zero ongoing cost.`,
  DEVELOPER_TOOLS: (tools, alts, count) =>
    `Developer tools subscriptions can quietly drain budgets. ${tools} charge monthly for features that the open-source community has been building for decades. ${count} non-subscription alternatives cover code editing, version control, CI/CD, and API development. ${alts} The developer tools ecosystem has a strong tradition of open-source excellence — many of the best tools in the industry are free.`,
  EDUCATION: (tools, alts, count) =>
    `Education software subscriptions can be a burden for students and lifelong learners. ${tools} charge monthly for learning features. ${count} non-subscription alternatives offer spaced repetition, progress tracking, and content libraries. ${alts} Free tools like Anki have been the gold standard for flashcard-based learning for over a decade, with no subscription required.`,
  ENTERTAINMENT: (tools, alts, count) =>
    `Entertainment subscriptions add up quickly — many households spend $50+/month on streaming services. ${tools} charge monthly for content access. ${count} non-subscription alternatives exist, including self-hosted media servers that give you a Netflix-like experience with your own media library. ${alts} For users who own their media, self-hosting eliminates subscription costs entirely.`,
  PRESENTATION: (tools, alts, count) =>
    `Presentation software doesn't need to be expensive. ${tools} charge monthly for features that free alternatives handle well. ${count} non-subscription alternatives offer templates, animations, collaboration, and export formats. ${alts} Google Slides and LibreOffice Impress cover most presentation needs at no cost. The design gap has narrowed significantly with free template resources.`,
  SCREEN_RECORDING: (tools, alts, count) =>
    `Screen recording is a solved problem that doesn't require a subscription. ${tools} charge monthly for recording and annotation features. ${count} non-subscription alternatives — especially OBS Studio — offer professional-grade recording, streaming, and editing for free. ${alts} OBS Studio is used by professional streamers, YouTubers, and educators worldwide at zero cost.`,
  VPN: (tools, alts, count) =>
    `VPN services charge monthly for encryption that's based on free, open-source protocols. ${tools} charge $5-$13/month for VPN access. ${count} non-subscription alternatives exist, including self-hosted VPN servers using WireGuard or OpenVPN. ${alts} For technically inclined users, running your own VPN server costs pennies per month and provides maximum privacy.`,
  CRM: (tools, alts, count) =>
    `CRM software is notorious for per-user subscription pricing that scales painfully. ${tools} charge $10-$25/user/month. ${count} non-subscription alternatives offer contact management, pipeline tracking, and reporting without per-user fees. ${alts} Open-source CRMs like Twenty and SuiteCRM provide comparable features with self-hosting options that eliminate recurring costs.`,
  E_COMMERCE: (tools, alts, count) =>
    `E-commerce platform subscriptions eat into margins with monthly fees plus transaction costs. ${tools} charge $29-$399/month. ${count} non-subscription alternatives give you full control over your store with no monthly platform fees. ${alts} WooCommerce powers 28% of all online stores and costs nothing beyond web hosting — typically $5-$15/month.`,
  FORMS: (tools, alts, count) =>
    `Form builders are surprisingly expensive as subscriptions. ${tools} charge $25+/month for conditional logic, integrations, and analytics. ${count} non-subscription alternatives offer the same features for free or at a one-time cost. ${alts} Open-source form builders like Formbricks and Typeless provide advanced features including payment collection and multi-page forms without recurring fees.`,
  CAD: (tools, alts, count) =>
    `CAD software is among the most expensive subscriptions in software. ${tools} charge $50-$250/month — among the highest per-seat costs in any software category. ${count} non-subscription alternatives handle 2D drafting and 3D modeling at a fraction of the cost. ${alts} FreeCAD and LibreCAD are mature enough for professional use, and FreeCAD in particular has seen rapid development in recent years.`,
};

const categoryFaq: Record<string, (catName: string, tools: string, bestAlt: string) => { question: string; answer: string }[]> = {
  DESIGN: (cn, tools, ba) => [
    { question: `What is the best free ${cn.toLowerCase()} software?`, answer: `${ba} is the top free alternative for ${cn.toLowerCase()}. It handles most design tasks including vector editing, raster graphics, and layout design. For photo editing specifically, GIMP is a powerful open-source option.` },
    { question: `Can free design software replace Adobe?`, answer: `For most users, yes. ${ba} and similar tools handle 80-90% of what Adobe's design suite does. The main gaps are in advanced features like 3D design and specific plugin ecosystems, but for everyday design work, free alternatives are more than capable.` },
    { question: `Is one-time purchase design software as good as subscriptions?`, answer: `Often better. Tools like Affinity Photo and Affinity Designer are built by companies that need to earn your purchase once, not retain you through lock-in. They tend to be faster, lighter, and more focused than subscription alternatives.` },
  ],
  VIDEO_AUDIO: (cn, tools, ba) => [
    { question: `Can I edit professional videos for free?`, answer: `Yes. DaVinci Resolve's free version is used on Hollywood productions and includes professional color grading, multi-track editing, and visual effects. It's more capable than Premiere Pro was five years ago.` },
    { question: `What is the best free video editor?`, answer: `DaVinci Resolve for professional editing, CapCut for social media content, and Shotcut or Kdenlive for open-source alternatives. Each serves a different use case, but DaVinci Resolve is the most powerful free option.` },
    { question: `Is free audio editing software good enough?`, answer: `Audacity has been the go-to free audio editor for over two decades and handles most audio editing tasks. For music production, LMMS and Ardour (open-source) provide professional features at no cost.` },
  ],
  PRODUCTIVITY: (cn, tools, ba) => [
    { question: `What is the best free productivity tool?`, answer: `${ba} is a top recommendation for ${cn.toLowerCase()}. It offers task management, note-taking, and project organization without a subscription. Many users find it more focused and faster than subscription alternatives.` },
    { question: `Can I use productivity tools offline?`, answer: `Yes, many non-subscription productivity tools work offline by design. Local-first tools like Obsidian store everything on your device, syncing when you're back online. This is a major advantage over cloud-dependent subscription tools.` },
    { question: `Are open-source productivity tools secure?`, answer: `Open-source tools are often more secure than closed-source alternatives because their code is publicly auditable. Tools like Joplin and AppFlowy have active communities that regularly review and improve the codebase.` },
  ],
  WRITING: (cn, tools, ba) => [
    { question: `Is free grammar checking good enough?`, answer: `For most writers, yes. LanguageTool's free tier catches the same critical grammar and spelling errors as paid alternatives. Premium features like tone detection and style suggestions are nice-to-have, not must-have.` },
    { question: `What is the best free writing tool?`, answer: `For grammar: LanguageTool (open-source). For note-taking: Obsidian or Joplin. For long-form writing: FocusWriter or Typora. Each serves a different part of the writing workflow.` },
  ],
  SECURITY: (cn, tools, ba) => [
    { question: `Are free password managers safe?`, answer: `Yes. Bitwarden and KeePassXC use the same AES-256 encryption as paid alternatives. Both have been independently audited. The encryption standard is what matters, not the price tag.` },
    { question: `What is the best free password manager?`, answer: `Bitwarden for cloud sync across devices, KeePassXC for local-only storage. Both are open-source, audited, and trusted by security professionals worldwide.` },
    { question: `Can I self-host a password manager?`, answer: `Yes. Bitwarden offers official self-hosting, and vaultwarden is a popular lightweight implementation. Self-hosting gives you complete control over your encrypted vault.` },
  ],
  STORAGE: (cn, tools, ba) => [
    { question: `What is the best free cloud storage?`, answer: `Google Drive offers 15GB free, MEGA offers 20GB with encryption. For unlimited storage, self-hosted Nextcloud on a home server is the ultimate free option.` },
    { question: `Is self-hosted cloud storage reliable?`, answer: `With proper setup, yes. Nextcloud is used by universities, governments, and enterprises worldwide. For personal use, a Raspberry Pi with an external drive provides reliable storage at zero monthly cost.` },
  ],
  BUSINESS: (cn, tools, ba) => [
    { question: `Is there a free CRM?`, answer: `Twenty CRM is an open-source CRM with a modern interface. HubSpot offers a free tier with basic CRM features. For self-hosting, SuiteCRM and EspoCRM provide full-featured CRM at no cost.` },
    { question: `Can open-source business software scale?`, answer: `Yes. Many enterprises use open-source business tools. ERPNext, for example, is used by companies with thousands of employees. The key is choosing actively maintained projects with strong communities.` },
  ],
  AI_TOOLS: (cn, tools, ba) => [
    { question: `Can I run AI models locally for free?`, answer: `Yes. Ollama lets you run powerful language models on your own hardware for free. Quality depends on your hardware, but for many tasks local models produce results comparable to cloud services.` },
    { question: `Are local AI models as good as ChatGPT?`, answer: `For many tasks, yes. Local models excel at text generation, code completion, and summarization. They may lag behind the largest cloud models on complex reasoning, but they're free and keep your data private.` },
  ],
  DEVELOPER_TOOLS: (cn, tools, ba) => [
    { question: `Are free developer tools professional-grade?`, answer: `Absolutely. VS Code, Git, Docker, and most of the modern development stack are free and open-source. Some of the most critical infrastructure in tech runs on free tools.` },
    { question: `What is the best free code editor?`, answer: `VS Code is the most popular free code editor with thousands of extensions. For lighter alternatives, Sublime Text (free evaluation) and Neovim are excellent choices.` },
  ],
  EDUCATION: (cn, tools, ba) => [
    { question: `Is Anki better than Duolingo for language learning?`, answer: `For vocabulary and memorization, Anki's spaced repetition algorithm is more effective and customizable. Duolingo is better for structured lessons and gamification. Many learners use both.` },
    { question: `Are free education tools effective?`, answer: `Yes. Anki, Khan Academy, and MIT OpenCourseWare have helped millions of learners achieve their goals for free. The quality of free education resources has never been higher.` },
  ],
  ENTERTAINMENT: (cn, tools, ba) => [
    { question: `Can I replace streaming subscriptions?`, answer: `For owned media, yes. Jellyfin and Plex create a Netflix-like experience from your own media library. For live content and originals, you'll still need subscriptions — but you can reduce from 5+ services to 1-2.` },
    { question: `Is Jellyfin a good alternative to Plex?`, answer: `Jellyfin is fully open-source and free with no premium tier. Plex has more features but requires a Plex Pass for some functionality. For most users, Jellyfin provides the same core experience at zero cost.` },
  ],
  PRESENTATION: (cn, tools, ba) => [
    { question: `Is Google Slides as good as PowerPoint?`, answer: `For most presentations, yes. Google Slides offers real-time collaboration, a solid template library, and easy sharing — all free. PowerPoint has more advanced animations and design features, but most presenters don't need them.` },
    { question: `Can I make professional presentations for free?`, answer: `Yes. Google Slides, Canva (free tier), and LibreOffice Impress all create professional presentations. Pair them with free template sites for polished results.` },
  ],
  SCREEN_RECORDING: (cn, tools, ba) => [
    { question: `Is OBS Studio free for commercial use?`, answer: `Yes. OBS Studio is open-source (GPL) and free for any purpose including commercial use. It's used by professional streamers, educators, and businesses worldwide.` },
    { question: `What is the best free screen recorder?`, answer: `OBS Studio for full-featured recording and streaming. Screenity for browser-based recording with annotations. Both are free and handle professional use cases.` },
  ],
  VPN: (cn, tools, ba) => [
    { question: `Is a free VPN safe?`, answer: `It depends. Proton VPN's free tier is safe and audited. Many other free VPNs sell your data. For maximum safety, self-host a WireGuard server — it's free, open-source, and trusted.` },
    { question: `Can I make my own VPN?`, answer: `Yes. WireGuard and OpenVPN are free, open-source VPN protocols. You can set up a VPN server on any VPS for $3-$5/month, giving you maximum privacy and no third-party dependency.` },
  ],
  CRM: (cn, tools, ba) => [
    { question: `Is there a free CRM for small businesses?`, answer: `Twenty CRM is open-source and free. HubSpot's free CRM is popular for small teams. For self-hosting, SuiteCRM provides enterprise features at no cost.` },
    { question: `Why are CRMs so expensive?`, answer: `CRMs charge per-user monthly fees because they know switching costs are high. Open-source alternatives break this model by offering the same features without per-user pricing.` },
  ],
  E_COMMERCE: (cn, tools, ba) => [
    { question: `Is WooCommerce really free?`, answer: `Yes. WooCommerce is a free WordPress plugin. Your only cost is web hosting ($5-$15/month). Compared to Shopify's $39-$399/month, the savings are substantial — especially for small stores.` },
    { question: `Can I build an online store without monthly fees?`, answer: `Yes. WooCommerce, PrestaShop, and Magento (open-source) all let you run an online store with no platform fees. You pay only for hosting and payment processing.` },
  ],
  FORMS: (cn, tools, ba) => [
    { question: `Is there a free alternative to Typeform?`, answer: `Formbricks is an open-source alternative with a similar conversational form experience. Tally offers a generous free tier with unlimited forms and responses. Both handle most Typeform use cases.` },
    { question: `Can I collect payments through free forms?`, answer: `Yes. Tally and Formbricks both support payment collection through Stripe integration on their free or affordable plans.` },
  ],
  CAD: (cn, tools, ba) => [
    { question: `Is FreeCAD good enough for professional use?`, answer: `FreeCAD handles most 2D drafting and 3D modeling tasks. It's used professionally for product design, architecture, and engineering. The 0.21+ versions have significantly improved stability and features.` },
    { question: `Can free CAD software open AutoCAD files?`, answer: `FreeCAD and LibreCAD support DXF/DWG file formats used by AutoCAD. Complex 3D models may not transfer perfectly, but 2D drawings generally import well.` },
  ],
};

export function getCategorySeoContent(categoryId: string): CategorySeoContent | undefined {
  // categoryId is a slug like "video-audio", but our maps use category keys like "VIDEO_AUDIO"
  const categoryKey = categoryId.replace(/-/g, '_').toUpperCase();
  const catIntros = categoryIntros[categoryKey];
  const catFaq = categoryFaq[categoryKey];
  if (!catIntros || !catFaq) return undefined;

  const catTools = subscriptionTools.filter(
    (t) => t.category.toLowerCase().replace(/_/g, '-') === categoryId
  );
  const catSoftware = software.filter((s) =>
    s.categories.some((c) => c.toLowerCase().replace(/_/g, '-') === categoryId)
  );

  if (catTools.length === 0) return undefined;

  const toolNames = catTools.map((t) => t.name).join(', ');
  const altNames = catSoftware.slice(0, 3).map((s) => s.name).join(', ');
  const bestAlt = catSoftware[0]?.name || 'free alternatives';

  const catName = catTools[0]
    ? catTools[0].category.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
    : categoryId;

  return {
    detailedIntro: catIntros(toolNames, altNames, catSoftware.length),
    whySwitch: [
      `Save $${(catTools.reduce((sum, t) => sum + (t.monthlyPrice || 0), 0) / catTools.length * 12).toFixed(0)}/year on average by switching from subscription ${catName.toLowerCase()} software`,
      `Own your tools — no risk of price increases or feature removal`,
      `Better privacy with local-first and self-hosted options`,
      `No vendor lock-in — export your data anytime`,
    ],
    faq: catFaq(catName, toolNames, bestAlt),
  };
}
