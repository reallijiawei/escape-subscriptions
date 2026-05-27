"""Batch 3: Add Microsoft Outlook, Loom + alternatives + relations."""
import json
from datetime import date

TODAY = date.today().isoformat()

def load(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)

def save(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write('\n')

# ── Load data ──────────────────────────────────────────────────────────────────
tools = load('src/data/subscription-tools.json')
sw   = load('src/data/software.json')
rels = load('src/data/alternative-relations.json')

existing_tool_ids = {t['id'] for t in tools}
existing_sw_ids   = {s['id'] for s in sw}
existing_rel_ids  = {r['id'] for r in rels}

def uid(base, existing):
    if base not in existing:
        return base
    i = 2
    while f'{base}-{i}' in existing:
        i += 1
    return f'{base}-{i}'

# ── New subscription tools ─────────────────────────────────────────────────────
new_tools = [
    {
        "id": "microsoft-outlook",
        "name": "Microsoft Outlook",
        "slug": "microsoft-outlook",
        "description": "Microsoft's email and calendar client, part of Microsoft 365. Widely used in corporate environments for email, scheduling, and contacts management.",
        "websiteUrl": "https://www.microsoft.com/en-us/microsoft-365/outlook/",
        "monthlyPrice": 6.00,
        "yearlyPrice": 72.00,
        "currency": "USD",
        "category": "PRODUCTIVITY",
        "commonUseCases": [
            "Corporate email management",
            "Calendar and scheduling",
            "Contact management",
            "Task management integrated with email",
            "Shared mailboxes and delegation"
        ],
        "lastCheckedAt": TODAY
    },
    {
        "id": "loom",
        "name": "Loom",
        "slug": "loom",
        "description": "Video messaging tool for async communication. Record your screen, camera, and microphone to share with teammates.",
        "websiteUrl": "https://www.loom.com/",
        "monthlyPrice": 12.50,
        "yearlyPrice": 150.00,
        "currency": "USD",
        "category": "VIDEO_AUDIO",
        "commonUseCases": [
            "Async video updates for remote teams",
            "Screen recording for tutorials",
            "Bug reporting with screen capture",
            "Product demos and walkthroughs",
            "Meeting recordings and summaries"
        ],
        "lastCheckedAt": TODAY
    },
]

for t in new_tools:
    if t['id'] not in existing_tool_ids:
        tools.append(t)
        existing_tool_ids.add(t['id'])
        print(f"Added tool: {t['id']}")

# ── New software alternatives ──────────────────────────────────────────────────
new_software = [
    {
        "id": "onlyoffice",
        "name": "ONLYOFFICE",
        "slug": "onlyoffice",
        "description": "Open-source office suite with word processing, spreadsheets, and presentations. Compatible with MS Office formats and available as self-hosted or cloud.",
        "websiteUrl": "https://www.onlyoffice.com/",
        "pricingType": "FREEMIUM",
        "priceText": "Free (self-hosted) / Cloud from $5/user/mo",
        "startingPrice": None,
        "currency": "USD",
        "platforms": ["WINDOWS", "MACOS", "LINUX", "WEB", "SELF_HOSTED", "ANDROID", "IOS"],
        "categories": ["PRODUCTIVITY"],
        "isOpenSource": True,
        "isOfflineSupported": True,
        "requiresAccount": False,
        "hasFreeTrial": True,
        "ownershipLevel": "HIGH",
        "cloudDependency": "LOW",
        "bestFor": ["Teams needing MS Office compatibility", "Self-hosted document editing", "Collaborative editing"],
        "pros": ["Full MS Office format compatibility", "Can be self-hosted", "Real-time collaboration", "Free for self-hosted use"],
        "cons": ["Cloud version has usage limits on free tier", "Smaller ecosystem than MS Office", "Some advanced Excel features missing"],
        "replaces": ["microsoft-365"],
        "affiliateUrl": None,
        "lastCheckedAt": TODAY
    },
    {
        "id": "google-docs",
        "name": "Google Docs",
        "slug": "google-docs",
        "description": "Free web-based office suite by Google including Docs, Sheets, and Slides. Real-time collaboration with cloud storage.",
        "websiteUrl": "https://docs.google.com/",
        "pricingType": "FREE",
        "priceText": "Free (15GB storage)",
        "startingPrice": None,
        "currency": "USD",
        "platforms": ["WEB", "ANDROID", "IOS"],
        "categories": ["PRODUCTIVITY"],
        "isOpenSource": False,
        "isOfflineSupported": True,
        "requiresAccount": True,
        "hasFreeTrial": False,
        "ownershipLevel": "LOW",
        "cloudDependency": "HIGH",
        "bestFor": ["Casual document editing", "Real-time collaboration", "Students and educators"],
        "pros": ["Completely free", "Excellent real-time collaboration", "Works in any browser", "Automatic saving"],
        "cons": ["Requires Google account", "Cloud-only (limited offline)", "Less powerful than desktop office suites", "Data stored on Google servers"],
        "replaces": ["microsoft-365"],
        "affiliateUrl": None,
        "lastCheckedAt": TODAY
    },
    {
        "id": "thunderbird",
        "name": "Thunderbird",
        "slug": "thunderbird",
        "description": "Free, open-source email client by Mozilla. Supports multiple accounts, RSS, chat, and extensive add-ons for customization.",
        "websiteUrl": "https://www.thunderbird.net/",
        "pricingType": "FREE",
        "priceText": "Free",
        "startingPrice": None,
        "currency": "USD",
        "platforms": ["WINDOWS", "MACOS", "LINUX"],
        "categories": ["PRODUCTIVITY"],
        "isOpenSource": True,
        "isOfflineSupported": True,
        "requiresAccount": False,
        "hasFreeTrial": False,
        "ownershipLevel": "HIGH",
        "cloudDependency": "NONE",
        "bestFor": ["Users who want a desktop email client", "Privacy-conscious users", "Managing multiple email accounts"],
        "pros": ["Completely free and open source", "Works offline", "Supports all major email protocols", "Extensive add-on ecosystem", "No data collection"],
        "cons": ["Interface feels dated", "No built-in calendar (needs add-on)", "Slower development pace", "No mobile app"],
        "replaces": ["microsoft-outlook"],
        "affiliateUrl": None,
        "lastCheckedAt": TODAY
    },
    {
        "id": "evolution",
        "name": "GNOME Evolution",
        "slug": "evolution",
        "description": "Open-source personal information management application for Linux. Combines email, calendar, address book, and task management.",
        "websiteUrl": "https://wiki.gnome.org/Apps/Evolution",
        "pricingType": "FREE",
        "priceText": "Free",
        "startingPrice": None,
        "currency": "USD",
        "platforms": ["LINUX"],
        "categories": ["PRODUCTIVITY"],
        "isOpenSource": True,
        "isOfflineSupported": True,
        "requiresAccount": False,
        "hasFreeTrial": False,
        "ownershipLevel": "HIGH",
        "cloudDependency": "NONE",
        "bestFor": ["Linux users", "Exchange/M365 email on Linux", "All-in-one PIM on GNOME"],
        "pros": ["Full Outlook-like PIM on Linux", "Exchange/OWA support", "Integrated calendar and contacts", "Part of GNOME ecosystem"],
        "cons": ["Linux only", "Interface not as polished as Outlook", "Exchange support can be finicky", "Smaller community than Thunderbird"],
        "replaces": ["microsoft-outlook"],
        "affiliateUrl": None,
        "lastCheckedAt": TODAY
    },
    {
        "id": "wekan",
        "name": "WeKan",
        "slug": "wekan",
        "description": "Open-source kanban board built with Meteor. Self-hosted Trello alternative with swimlanes, card templates, and team collaboration.",
        "websiteUrl": "https://wekan.github.io/",
        "pricingType": "OPEN_SOURCE",
        "priceText": "Free (self-hosted)",
        "startingPrice": None,
        "currency": "USD",
        "platforms": ["SELF_HOSTED", "WEB"],
        "categories": ["PRODUCTIVITY"],
        "isOpenSource": True,
        "isOfflineSupported": False,
        "requiresAccount": False,
        "hasFreeTrial": False,
        "ownershipLevel": "HIGH",
        "cloudDependency": "LOW",
        "bestFor": ["Teams wanting self-hosted kanban", "Privacy-focused project management", "Trello users who want full control"],
        "pros": ["Fully self-hosted", "Trello-like interface", "Swimlanes and card templates", "Active development", "Docker deployment"],
        "cons": ["Requires server to host", "No cloud offering", "Smaller community than Trello", "Mobile experience limited"],
        "replaces": ["trello"],
        "affiliateUrl": None,
        "lastCheckedAt": TODAY
    },
    {
        "id": "focalboard",
        "name": "Focalboard",
        "slug": "focalboard",
        "description": "Open-source project management by Mattermost. Self-hosted alternative to Trello, Notion, and Asana with kanban, table, and calendar views.",
        "websiteUrl": "https://www.focalboard.com/",
        "pricingType": "OPEN_SOURCE",
        "priceText": "Free (self-hosted)",
        "startingPrice": None,
        "currency": "USD",
        "platforms": ["SELF_HOSTED", "WEB", "WINDOWS", "MACOS", "LINUX"],
        "categories": ["PRODUCTIVITY"],
        "isOpenSource": True,
        "isOfflineSupported": True,
        "requiresAccount": False,
        "hasFreeTrial": False,
        "ownershipLevel": "HIGH",
        "cloudDependency": "LOW",
        "bestFor": ["Teams already using Mattermost", "Self-hosted project management", "Multi-view project tracking"],
        "pros": ["Multiple views (kanban, table, calendar)", "Integrates with Mattermost", "Desktop apps available", "Self-hosted with full control"],
        "cons": ["Development has slowed", "Smaller community", "Limited integrations vs Trello", "Requires self-hosting setup"],
        "replaces": ["trello"],
        "affiliateUrl": None,
        "lastCheckedAt": TODAY
    },
    {
        "id": "obs-studio",
        "name": "OBS Studio",
        "slug": "obs-studio",
        "description": "Free, open-source software for video recording and live streaming. Professional-grade screen capture with scenes, sources, and filters.",
        "websiteUrl": "https://obsproject.com/",
        "pricingType": "OPEN_SOURCE",
        "priceText": "Free",
        "startingPrice": None,
        "currency": "USD",
        "platforms": ["WINDOWS", "MACOS", "LINUX"],
        "categories": ["VIDEO_AUDIO", "SCREEN_RECORDING"],
        "isOpenSource": True,
        "isOfflineSupported": True,
        "requiresAccount": False,
        "hasFreeTrial": False,
        "ownershipLevel": "HIGH",
        "cloudDependency": "NONE",
        "bestFor": ["Screen recording", "Live streaming", "Video tutorials"],
        "pros": ["Completely free", "Professional-grade features", "No watermarks", "Extensive plugin ecosystem"],
        "cons": ["Steeper learning curve", "No built-in sharing (manual upload)", "No webcam-only mode by default", "Requires setup for optimal quality"],
        "replaces": ["loom"],
        "affiliateUrl": None,
        "lastCheckedAt": TODAY
    },
]

for s in new_software:
    if s['id'] not in existing_sw_ids:
        sw.append(s)
        existing_sw_ids.add(s['id'])
        print(f"Added software: {s['id']}")
    else:
        print(f"Skipped (exists): {s['id']}")

# ── Fix broken Cal.com relation ────────────────────────────────────────────────
for r in rels:
    if r['softwareId'] == 'cal-com':
        r['softwareId'] = 'calendso'
        print("Fixed: cal-com -> calendso in relation", r['id'])

# ── New relations ──────────────────────────────────────────────────────────────
new_rels = [
    # Microsoft 365 -> OnlyOffice
    {
        "subscriptionToolId": "microsoft-365",
        "softwareId": "onlyoffice",
        "recommendationRank": 3,
        "recommendationLabel": "Best self-hosted office suite",
        "similarityScore": 82,
        "migrationDifficulty": "MEDIUM",
        "whatYouGain": ["Self-hosted option", "No subscription required", "MS Office format compatibility", "Real-time collaboration"],
        "whatYouLose": ["Some advanced Excel features", "Smaller template ecosystem", "Less macro support"],
        "bestFor": ["Teams wanting self-hosted office suite", "Organizations with data sovereignty needs", "Users who need MS format compatibility"],
        "notFor": ["Users heavily dependent on Excel macros", "Teams needing deep Microsoft ecosystem integration"],
        "notes": "ONLYOFFICE offers the best MS Office format fidelity among open-source alternatives. The self-hosted version is completely free."
    },
    # Microsoft 365 -> Google Docs
    {
        "subscriptionToolId": "microsoft-365",
        "softwareId": "google-docs",
        "recommendationRank": 2,
        "recommendationLabel": "Best free cloud office suite",
        "similarityScore": 75,
        "migrationDifficulty": "EASY",
        "whatYouGain": ["Completely free", "Excellent real-time collaboration", "No software to install", "Automatic cloud saving"],
        "whatYouLose": ["Less powerful than desktop Office", "Requires internet for full functionality", "Fewer advanced formatting options"],
        "bestFor": ["Students and educators", "Casual document editing", "Teams needing real-time collaboration"],
        "notFor": ["Power users with complex spreadsheets", "Offline-first workflows"],
        "notes": "Google Docs is the easiest free alternative to Microsoft 365. Perfect for everyday documents, though power users may miss advanced features."
    },
    # Trello -> WeKan
    {
        "subscriptionToolId": "trello",
        "softwareId": "wekan",
        "recommendationRank": 3,
        "recommendationLabel": "Best self-hosted kanban",
        "similarityScore": 78,
        "migrationDifficulty": "MEDIUM",
        "whatYouGain": ["Fully self-hosted", "Swimlanes", "No user limits", "Full data control"],
        "whatYouLose": ["No cloud convenience", "Smaller community", "Mobile experience limited"],
        "bestFor": ["Privacy-focused teams", "Self-hosting enthusiasts", "Organizations with data sovereignty requirements"],
        "notFor": ["Teams wanting zero-setup solutions", "Mobile-first users"],
        "notes": "WeKan is the closest self-hosted Trello clone. If you want your kanban boards on your own server, this is the way to go."
    },
    # Trello -> Focalboard
    {
        "subscriptionToolId": "trello",
        "softwareId": "focalboard",
        "recommendationRank": 4,
        "recommendationLabel": "Best for Mattermost users",
        "similarityScore": 72,
        "migrationDifficulty": "MEDIUM",
        "whatYouGain": ["Multiple views (kanban, table, calendar)", "Mattermost integration", "Desktop apps", "Self-hosted"],
        "whatYouLose": ["Slower development pace", "Fewer integrations", "Smaller community"],
        "bestFor": ["Teams already using Mattermost", "Users wanting multiple project views", "Self-hosted project management"],
        "notFor": ["Users wanting a cloud solution", "Teams needing many third-party integrations"],
        "notes": "Focalboard shines when paired with Mattermost for team communication. Standalone use is possible but the ecosystem is smaller."
    },
    # Microsoft Outlook -> Thunderbird
    {
        "subscriptionToolId": "microsoft-outlook",
        "softwareId": "thunderbird",
        "recommendationRank": 1,
        "recommendationLabel": "Best free email client",
        "similarityScore": 80,
        "migrationDifficulty": "EASY",
        "whatYouGain": ["Completely free", "No subscription", "Works offline", "Extensive add-ons", "Privacy-focused"],
        "whatYouLose": ["No integrated Exchange calendar by default", "Dated interface", "No mobile app"],
        "bestFor": ["Users who want a free desktop email client", "Privacy-conscious users", "Managing multiple email accounts"],
        "notFor": ["Users deeply integrated with Microsoft 365/Exchange", "Mobile-first email users"],
        "notes": "Thunderbird is the gold standard for free desktop email. With the recent overhaul (Supernova), the interface is much improved."
    },
    # Microsoft Outlook -> Evolution
    {
        "subscriptionToolId": "microsoft-outlook",
        "softwareId": "evolution",
        "recommendationRank": 2,
        "recommendationLabel": "Best Linux Outlook alternative",
        "similarityScore": 72,
        "migrationDifficulty": "MEDIUM",
        "whatYouGain": ["Full PIM on Linux", "Exchange support", "Integrated calendar and contacts", "Free and open source"],
        "whatYouLose": ["Linux only", "Less polished UI", "Exchange quirks"],
        "bestFor": ["Linux users needing Outlook-like experience", "GNOME desktop users", "Exchange/M365 email on Linux"],
        "notFor": ["Windows or macOS users", "Users wanting the slickest interface"],
        "notes": "Evolution is the closest thing to Outlook on Linux. Its Exchange/OWA support makes it valuable for corporate Linux users."
    },
    # Loom -> OBS Studio
    {
        "subscriptionToolId": "loom",
        "softwareId": "obs-studio",
        "recommendationRank": 1,
        "recommendationLabel": "Best free screen recorder",
        "similarityScore": 70,
        "migrationDifficulty": "MEDIUM",
        "whatYouGain": ["Completely free", "Professional features", "No watermarks", "No time limits", "Full control over recordings"],
        "whatYouLose": ["No built-in cloud sharing", "No viewer analytics", "Steeper learning curve", "No async video messaging features"],
        "bestFor": ["Creating tutorials and demos", "Users who want full control", "Budget-conscious creators"],
        "notFor": ["Teams needing async video messaging", "Users wanting instant share links"],
        "notes": "OBS Studio replaces Loom's recording capability but not its sharing and collaboration features. You'll need to upload recordings manually."
    },
]

for r in new_rels:
    rid = f"{r['subscriptionToolId']}-{r['softwareId']}"
    if rid not in existing_rel_ids:
        r['id'] = rid
        rels.append(r)
        existing_rel_ids.add(rid)
        print(f"Added relation: {rid}")
    else:
        print(f"Skipped (exists): {rid}")

# ── Save ───────────────────────────────────────────────────────────────────────
save('src/data/subscription-tools.json', tools)
save('src/data/software.json', sw)
save('src/data/alternative-relations.json', rels)

print(f"\nTools: {len(tools)} total")
print(f"Software: {len(sw)} total")
print(f"Relations: {len(rels)} total")
