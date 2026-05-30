import { software, subscriptionTools, alternativeRelations } from '@/lib/data';

export interface SoftwareSeoContent {
  detailedIntro: string;
  whyChoose: string[];
  faq: { question: string; answer: string }[];
}

export function getSoftwareSeoContent(softwareId: string): SoftwareSeoContent | undefined {
  const sw = software.find((s) => s.id === softwareId);
  if (!sw) return undefined;

  // Find what this software replaces
  const rels = alternativeRelations.filter((r) => r.softwareId === softwareId);
  const replacedTools = rels
    .map((r) => {
      const tool = subscriptionTools.find((t) => t.id === r.subscriptionToolId);
      return tool ? { tool, relation: r } : null;
    })
    .filter(Boolean) as { tool: any; relation: any }[];

  const replacesNames = sw.replaces
    .map((slug) => subscriptionTools.find((t) => t.slug === slug)?.name)
    .filter(Boolean);

  const pricingLabel =
    sw.pricingType === 'FREE' || sw.pricingType === 'OPEN_SOURCE'
      ? 'free'
      : sw.pricingType === 'ONE_TIME_PURCHASE' || sw.pricingType === 'LIFETIME_DEAL'
        ? 'a one-time purchase'
        : sw.pricingType === 'FREEMIUM' || sw.pricingType === 'SUBSCRIPTION_WITH_FREE_PLAN'
          ? 'available with a generous free tier'
          : 'available';

  const platformList = sw.platforms.slice(0, 3).join(', ');
  const categories = sw.categories.map((c) => c.replace(/_/g, ' ').toLowerCase()).join(', ');

  // Calculate savings
  const totalMonthlySavings = replacedTools.reduce(
    (sum, { tool }) => sum + (tool.monthlyPrice || 0),
    0
  );
  const yearlySavings = totalMonthlySavings * 12;

  // Intro
  const isFree = sw.pricingType === 'FREE' || sw.pricingType === 'OPEN_SOURCE';
  const hasPricing = sw.startingPrice != null && sw.startingPrice > 0;

  const introParts: string[] = [];
  introParts.push(
    `${sw.name} is ${pricingLabel} ${categories} tool available on ${platformList}.`
  );

  if (replacesNames.length > 0) {
    introParts.push(
      `It serves as an alternative to ${replacesNames.join(', ')} — subscription software that costs $${totalMonthlySavings.toFixed(0)}/month combined.`
    );
  }

  if (isFree) {
    introParts.push(
      `Being ${sw.isOpenSource ? 'open-source and ' : ''}completely free, ${sw.name} eliminates subscription costs entirely while providing professional-grade features. The open-source community ensures continuous improvement and transparency.`
    );
  } else if (hasPricing) {
    introParts.push(
      `At $${sw.startingPrice} one-time, ${sw.name} costs less than ${replacedTools.length > 0 ? `${replacedTools[0].tool.name}'s monthly subscription` : 'most subscription alternatives'} — and you own it forever. Over three years, this saves you $${(yearlySavings * 3 - (sw.startingPrice || 0)).toFixed(0)} compared to subscription alternatives.`
    );
  }

  if (sw.bestFor.length > 0) {
    introParts.push(
      `It's best suited for ${sw.bestFor.slice(0, 3).join(', ').toLowerCase()}.`
    );
  }

  const detailedIntro = introParts.join(' ');

  // Why choose
  const whyChoose: string[] = [];
  if (isFree) {
    whyChoose.push('Completely free — no hidden costs, no premium tier, no feature gates');
  } else if (hasPricing) {
    whyChoose.push(`One-time purchase at $${sw.startingPrice} — own it forever with no recurring fees`);
  }
  if (sw.isOpenSource) {
    whyChoose.push('Open-source and community-driven — transparent code, no vendor lock-in');
  }
  if (sw.ownershipLevel === 'HIGH') {
    whyChoose.push('Full ownership — your data stays on your device, no cloud dependency');
  }
  if (sw.isOfflineSupported) {
    whyChoose.push('Works offline — no internet connection required for core functionality');
  }
  if (!sw.requiresAccount) {
    whyChoose.push('No account required — download and start using immediately');
  }
  if (yearlySavings > 0) {
    whyChoose.push(`Save $${yearlySavings.toFixed(0)}/year compared to subscription alternatives`);
  }
  if (sw.platforms.length >= 3) {
    whyChoose.push(`Cross-platform support — available on ${sw.platforms.length} platforms`);
  }

  // FAQ
  const faq: { question: string; answer: string }[] = [];

  if (replacedTools.length > 0) {
    const topReplaced = replacedTools[0].tool;
    faq.push({
      question: `Is ${sw.name} a good replacement for ${topReplaced.name}?`,
      answer: `Yes. ${sw.name} handles most of what ${topReplaced.name} does, ${isFree ? 'at no cost' : `for a one-time $${sw.startingPrice} payment`}. ${topReplaced.name} costs $${topReplaced.monthlyPrice}/month ($${(topReplaced.monthlyPrice * 12).toFixed(0)}/year). The main differences are in advanced features and ecosystem integrations.`,
    });
  }

  faq.push({
    question: `Is ${sw.name} really ${isFree ? 'free' : 'a one-time purchase'}?`,
    answer: isFree
      ? `Yes, ${sw.name} is completely free to use${sw.isOpenSource ? ' and open-source' : ''}. There are no hidden costs, no premium tiers, and no feature restrictions.`
      : `Yes, ${sw.name} costs $${sw.startingPrice} as a one-time purchase. You pay once and own it forever — no monthly or annual fees.`,
  });

  if (sw.isOpenSource) {
    faq.push({
      question: `Can I self-host ${sw.name}?`,
      answer: `Yes. Being open-source, ${sw.name} can be self-hosted on your own server or hardware. This gives you complete control over your data and eliminates any dependency on external services.`,
    });
  }

  faq.push({
    question: `What platforms does ${sw.name} support?`,
    answer: `${sw.name} is available on ${sw.platforms.join(', ').replace(/_/g, ' ')}. ${sw.platforms.length >= 3 ? 'This cross-platform support means you can use it on all your devices.' : ''}`,
  });

  if (replacedTools.length > 0) {
    const totalSavings = replacedTools.reduce((s, { tool }) => s + (tool.monthlyPrice || 0) * 12, 0);
    faq.push({
      question: `How much money can I save with ${sw.name}?`,
      answer: `By replacing ${replacedTools.map(({ tool }) => tool.name).join(', ')}, you save approximately $${totalSavings.toFixed(0)}/year in subscription fees. ${hasPricing ? `After the one-time $${sw.startingPrice} purchase, all savings are pure profit.` : 'The savings start immediately.'}`,
    });
  }

  faq.push({
    question: `Does ${sw.name} require an internet connection?`,
    answer: sw.isOfflineSupported
      ? `No. ${sw.name} works fully offline — you only need internet for initial download and updates.`
      : `${sw.name} ${sw.cloudDependency === 'HIGH' || sw.cloudDependency === 'MEDIUM' ? 'requires an internet connection for most features' : 'works best with an internet connection but has some offline capabilities'}.`,
  });

  if (sw.hasFreeTrial) {
    faq.push({
      question: `Does ${sw.name} have a free trial?`,
      answer: `Yes, ${sw.name} offers a free trial so you can test all features before committing. This is a great way to verify it meets your needs before purchasing.`,
    });
  }

  return {
    detailedIntro,
    whyChoose,
    faq,
  };
}
