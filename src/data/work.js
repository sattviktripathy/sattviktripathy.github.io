// Every public claim on the page lives here, with where it was checked.
// Rule copied from PosePal's CLAUDE.md: read the source before writing the sentence.

export const links = {
  email: 'sattviktripathyy@gmail.com',
  phone: '917041109967', // resume header
  github: 'https://github.com/sattviktripathy',
  linkedin: 'https://linkedin.com/in/sattvik-tripathy',
  appStore: 'https://apps.apple.com/app/id6793224184', // iTunes lookup, 31 Oct 2026, seller Sattvik Tripathy
  truspace: 'https://truspace3d.com',
  truspaceDemo: 'https://truspace3d.com/view/?plan=refdemo',
  essay: 'https://sattviktripathy.github.io/agent-blast-radius/',
};

export const posepal = {
  // Sattvik's own figure, 13 Oct 2026, already on the resume. The repo's last measured count was
  // 28,680 accounts on 18 Sep (notes/plan.md) during the launch spike.
  users: '90,000+',
  // 338 pose files in PosePal/Resources/Poses, marketed as 330+ in app-store-copy.md.
  poses: '330+',
  // app-store-copy.md: "15 film looks, 3 cloud-AI tools".
  looks: 15,
  tools: 3,
  // notes/APPSTORE-REVIEW.md: 1.1 (19) rejected under 5.1.1(v), 1.1 (20) live 2026-09-25.
  rejection: '5.1.1(v)',
};

export const truspace = {
  // truspace-engine/PRODUCT_OVERVIEW.md, "What makes the furniture placement credible".
  conformance: '86 to 97%',
};

export const crm = {
  // real-estate-crm commit 9609d62: "1913 leads showed as 1000, and a backup export dropped the rest".
  // The old site said 4,812, which nothing in the repo or the import file supports.
  capped: 1000,
  total: 1913,
};

export const seller7 = {
  // Resume, Cord4 entry.
  screens: 73,
  lines: 21000,
};

// Invented for the page. Real leads never appear here. Phones stay masked: a made-up mobile
// number can still belong to someone, and iOS Safari turns full ones into tap-to-call links.
export const leads = [
  ['Rohan Mehta', '98••• ••273', '₹1.2 Cr', 'Site visit'],
  ['Asha Desai', '99••• ••862', '₹85 L', 'New'],
  ['Kunal Shah', '97••• ••409', '₹2.1 Cr', 'Offer'],
  ['Meera Patel', '98••• ••517', '₹64 L', 'Follow up'],
  ['Vivek Joshi', '90••• ••154', '₹1.6 Cr', 'New'],
  ['Nidhi Trivedi', '98••• ••036', '₹95 L', 'Site visit'],
  ['Harsh Vyas', '93••• ••681', '₹3.4 Cr', 'Follow up'],
  ['Pooja Bhatt', '99••• ••328', '₹72 L', 'New'],
  ['Sameer Rana', '98••• ••942', '₹1.1 Cr', 'Offer'],
  ['Isha Modi', '97••• ••160', '₹58 L', 'Follow up'],
  ['Dev Thakor', '90••• ••394', '₹2.8 Cr', 'Site visit'],
  ['Riya Soni', '98••• ••206', '₹1.4 Cr', 'New'],
  ['Parth Amin', '99••• ••015', '₹66 L', 'Follow up'],
  ['Tanvi Raval', '98••• ••427', '₹1.9 Cr', 'Offer'],
  ['Jay Parikh', '93••• ••183', '₹79 L', 'New'],
  ['Kavya Dave', '97••• ••316', '₹1.3 Cr', 'Site visit'],
];

// Invented for the page, and labelled so where it appears.
export const call = [
  ['Agent', 'Hi Maya, this is the returns desk at Alder Goods. You asked to send back your kettle. What went wrong?'],
  ['Maya', "It stopped heating after two weeks."],
  ['Agent', 'Sorry about that. Did it work at first, or was it faulty when it arrived?'],
  ['Maya', 'It worked at first, then just died.'],
  ['Agent', "Thanks, Maya. I've passed this to the team. You'll hear back today."],
];

export const more = [
  { name: 'Nibodhah', kind: 'Client build', line: 'Turns a job description into boolean search strings, then ranks sourced CVs with their gaps and interview probes.' },
  { name: 'Polishr', kind: 'iOS app', line: "A resume builder that checks Apple's signed receipts on the server instead of believing what the device says." },
  { name: 'Blossom Within', kind: 'Client site, live', line: 'Eight pages, booking and email for a UK therapy practice.', url: 'https://www.blossomwithintherapy.co.uk' },
  { name: 'Dhruv Thakkar', kind: 'Client site, live', line: "A strategist's portfolio that rebrands itself in each client's colours as you scroll.", url: 'https://dhruv-thakkar.vercel.app' },
  { name: 'Floor plan walkthrough', kind: 'Own project', line: 'Drop in a RERA PDF or brochure and walk through the flat in a browser.' },
  { name: 'Crown', kind: 'iOS app, not released yet', line: 'A hair-loss plan and private photo diary. Subscriptions and backend are done.' },
  { name: 'PDF editor', kind: 'Own project', line: 'Click any text in a PDF and edit it in place. Scans fall through to OCR.' },
];

export const roles = [
  ['Cord4 Technologies', 'AI Product Engineer'],
  ['Etech Global Services', 'Analyst II, Etech Insights'],
  ['Krutanic Solutions', 'Business Analyst Intern'],
  ['Indus University', 'B.Tech, Computer Science, 2025'],
];

export const brief = {
  who: [
    ['hiring an engineer', 'hiring an engineer'],
    ['a founder with an idea', 'a founder with an idea'],
    ['running a product that needs help', 'running a product'],
  ],
  need: [
    ['an AI feature', 'an AI feature', 'ai'],
    ['an iOS app', 'an iOS app', 'ios'],
    ['a web product', 'a web product', 'web'],
    ['someone full-time', 'someone full-time', 'job'],
  ],
};
