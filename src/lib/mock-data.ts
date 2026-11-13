export type ClubDomain = 
  | 'Coding'
  | 'Engineering'
  | 'Science'
  | 'Entrepreneurship'
  | 'Arts'
  | 'Leadership'
  | 'Sports'
  | 'Community';

export interface Club {
  id: string;
  name: string;
  description: string;
  domain: ClubDomain;
  logoUrl: string;
  coverUrl: string;
  memberCount: number;
  eventCount: number;
  isFeatured: boolean;
  slug: string;
}

export type EventStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface Event {
  id: string;
  title: string;
  clubId: string;
  clubName: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  imageUrl: string;
  capacity: number;
  registeredCount: number;
  tags: string[];
  status: EventStatus;
  permissionToken?: string; // set when super admin approves
}

export interface PermissionLetter {
  token: string;
  eventId: string;
  eventTitle: string;
  clubName: string;
  venue: string;
  date: string;
  issuedBy: string; // super admin name
  issuedAt: string; // ISO date
  revokedAt?: string;
}

export type MembershipStatus = 'pending' | 'approved' | 'rejected';

export interface MembershipRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRegNo: string;
  clubId: string;
  clubName: string;
  status: MembershipStatus;
  requestedAt: string;
}

export const MOCK_DOMAINS: { name: ClubDomain; description: string; icon: string }[] = [
  { name: 'Coding', description: 'Software Development & AI', icon: 'Terminal' },
  { name: 'Engineering', description: 'Robotics, Racing & Core Engineering', icon: 'Cpu' },
  { name: 'Science', description: 'Astronomy & Mathematics', icon: 'Globe' },
  { name: 'Entrepreneurship', description: 'Startups, Finance & Investment', icon: 'Briefcase' },
  { name: 'Arts', description: 'Music, Dance, Theatre & Media', icon: 'Music' },
  { name: 'Leadership', description: 'Soft Skills, MUN & Speaking', icon: 'Mic' },
  { name: 'Sports', description: 'Athletics & Strategy Games', icon: 'Trophy' },
  { name: 'Community', description: 'Social Service & Alumni Network', icon: 'Heart' },
];

export const MOCK_CLUBS: Club[] = [
  { id: 'club-1', name: 'Student Council', slug: 'student-council', description: 'The official representative body for students.', domain: 'Community', logoUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1523580494112-071dcb8498b5?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 50, eventCount: 15, isFeatured: true },
  { id: 'club-2', name: 'EDC', slug: 'edc', description: 'Entrepreneurship Development Club.', domain: 'Entrepreneurship', logoUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 120, eventCount: 8, isFeatured: true },
  { id: 'club-3', name: 'Endurance Racing', slug: 'endurance-racing', description: 'Baja Racing Club building off-road vehicles.', domain: 'Engineering', logoUrl: 'https://images.unsplash.com/photo-1503376713915-d9df14d18cd4?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 85, eventCount: 4, isFeatured: false },
  { id: 'club-4', name: 'TEDx', slug: 'tedx', description: 'Organizing independently organized TED events.', domain: 'Leadership', logoUrl: 'https://images.unsplash.com/photo-1475721028070-2051d528c0db?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 40, eventCount: 2, isFeatured: true },
  { id: 'club-5', name: 'GDSC', slug: 'gdsc', description: 'Google Developer Student Club.', domain: 'Coding', logoUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 300, eventCount: 20, isFeatured: true },
  { id: 'club-6', name: 'Team Griffin', slug: 'team-griffin', description: 'Aeromodelling and drone development.', domain: 'Engineering', logoUrl: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 65, eventCount: 5, isFeatured: false },
  { id: 'club-7', name: 'Team Eklavya', slug: 'team-eklavya', description: 'Street play and theatre arts.', domain: 'Arts', logoUrl: 'https://images.unsplash.com/photo-1507676184212-d0330a1516d0?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 45, eventCount: 12, isFeatured: false },
  { id: 'club-8', name: 'Zephyr', slug: 'zephyr', description: 'The official dance club of the college.', domain: 'Arts', logoUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 120, eventCount: 8, isFeatured: true },
  { id: 'club-9', name: 'Antariksh', slug: 'antariksh', description: 'Astronomy club for stargazers.', domain: 'Science', logoUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 75, eventCount: 6, isFeatured: false },
  { id: 'club-10', name: 'Game Dev+', slug: 'game-dev-plus', description: 'Creating and designing interactive games.', domain: 'Coding', logoUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b7738?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 90, eventCount: 10, isFeatured: false },
  { id: 'club-11', name: 'ICON', slug: 'icon', description: 'Indus Connect.', domain: 'Entrepreneurship', logoUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 110, eventCount: 7, isFeatured: false },
  { id: 'club-12', name: 'Eksutram', slug: 'eksutram', description: 'Mathematics and logic solving club.', domain: 'Science', logoUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 50, eventCount: 12, isFeatured: false },
  { id: 'club-13', name: 'Aaroh', slug: 'aaroh', description: 'The official music club.', domain: 'Arts', logoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 85, eventCount: 15, isFeatured: false },
  { id: 'club-14', name: 'VIT Pune MUN', slug: 'vit-pune-mun', description: 'Model United Nations.', domain: 'Leadership', logoUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1541178735493-479c1a27ed24?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 130, eventCount: 3, isFeatured: true },
  { id: 'club-15', name: 'IEEE', slug: 'ieee', description: 'Institute of Electrical and Electronics Engineers student branch.', domain: 'Coding', logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 200, eventCount: 25, isFeatured: false },
  { id: 'club-16', name: 'SDP', slug: 'sdp', description: 'Student Development Program.', domain: 'Leadership', logoUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 300, eventCount: 40, isFeatured: false },
  { id: 'club-17', name: 'VC', slug: 'vc', description: 'Vishwa Conclave.', domain: 'Leadership', logoUrl: 'https://images.unsplash.com/photo-1475721028070-2051d528c0db?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 80, eventCount: 1, isFeatured: false },
  { id: 'club-18', name: 'Cultural & Outreach', slug: 'cultural-and-outreach', description: 'Promoting campus culture and community outreach.', domain: 'Arts', logoUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 150, eventCount: 20, isFeatured: true },
  { id: 'club-19', name: 'CHESA', slug: 'chesa', description: 'Chemical Engineering Student Association.', domain: 'Engineering', logoUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 90, eventCount: 5, isFeatured: false },
  { id: 'club-20', name: 'PDC', slug: 'pdc', description: 'Personality Development Club.', domain: 'Leadership', logoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 200, eventCount: 15, isFeatured: false },
  { id: 'club-21', name: 'SIG Reality Spectra', slug: 'sig-reality-spectra', description: 'Special Interest Group for AR/VR technologies.', domain: 'Coding', logoUrl: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 60, eventCount: 8, isFeatured: false },
  { id: 'club-22', name: 'VClick', slug: 'vclick', description: 'The official photography club.', domain: 'Arts', logoUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 110, eventCount: 25, isFeatured: false },
  { id: 'club-23', name: 'TIF', slug: 'tif', description: 'The Investment Forum.', domain: 'Entrepreneurship', logoUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 180, eventCount: 12, isFeatured: true },
  { id: 'club-24', name: 'ViCulP', slug: 'viculp', description: 'VIT Cultural Production - Theatre Group.', domain: 'Arts', logoUrl: 'https://images.unsplash.com/photo-1507676184212-d0330a1516d0?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 95, eventCount: 10, isFeatured: false },
  { id: 'club-25', name: 'Speakers Club', slug: 'speakers-club', description: 'Platform to improve public speaking.', domain: 'Leadership', logoUrl: 'https://images.unsplash.com/photo-1475721028070-2051d528c0db?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 140, eventCount: 18, isFeatured: false },
  { id: 'club-26', name: 'LHL', slug: 'lhl', description: 'Light Hearted Lounge.', domain: 'Leadership', logoUrl: 'https://images.unsplash.com/photo-1543269664-56d93c1b41a6?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 210, eventCount: 30, isFeatured: false },
  { id: 'club-27', name: 'CSI', slug: 'csi', description: 'Computer Society of India.', domain: 'Coding', logoUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 250, eventCount: 22, isFeatured: false },
  { id: 'club-28', name: 'CSA', slug: 'csa', description: 'Computer Student Association.', domain: 'Coding', logoUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 280, eventCount: 15, isFeatured: false },
  { id: 'club-29', name: 'ABhivriddhi', slug: 'abhivriddhi', description: 'Soft skills club.', domain: 'Leadership', logoUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 160, eventCount: 12, isFeatured: false },
  { id: 'club-30', name: 'ISA', slug: 'isa', description: 'Automation club.', domain: 'Coding', logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 130, eventCount: 9, isFeatured: false },
  { id: 'club-31', name: 'MLSC', slug: 'mlsc', description: 'Microsoft Learn Student Club.', domain: 'Coding', logoUrl: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 220, eventCount: 18, isFeatured: true },
  { id: 'club-32', name: 'Veloce Racing', slug: 'veloce-racing', description: 'Formula Student Team.', domain: 'Engineering', logoUrl: 'https://images.unsplash.com/photo-1503376713915-d9df14d18cd4?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 100, eventCount: 3, isFeatured: false },
  { id: 'club-33', name: 'Rangmanch', slug: 'rangmanch', description: 'Social Media team.', domain: 'Arts', logoUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 50, eventCount: 25, isFeatured: false },
  { id: 'club-34', name: 'GEDIT', slug: 'gedit', description: 'Coding club of IT dept.', domain: 'Coding', logoUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 180, eventCount: 14, isFeatured: false },
  { id: 'club-35', name: 'Team Quark', slug: 'team-quark', description: 'Engineering and innovation team.', domain: 'Engineering', logoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 70, eventCount: 6, isFeatured: false },
  { id: 'club-36', name: 'VishwShauryam', slug: 'vishwshauryam', description: 'Promoting valor and sportsmanship.', domain: 'Sports', logoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 110, eventCount: 10, isFeatured: false },
  { id: 'club-37', name: 'C-Cube', slug: 'c-cube', description: 'Chess club.', domain: 'Sports', logoUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 90, eventCount: 22, isFeatured: false },
  { id: 'club-38', name: 'i2ioc', slug: 'i2ioc', description: 'Connect alumni to students.', domain: 'Community', logoUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=150&h=150', coverUrl: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=1200&h=400', memberCount: 300, eventCount: 5, isFeatured: true },
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'event-1',
    title: 'HackTheFuture 2026',
    clubId: 'club-5',
    clubName: 'GDSC',
    description: 'A 48-hour national-level hackathon. Build solutions for real-world problems involving AI, Web3, and sustainability.',
    date: '2026-09-15',
    time: '18:00',
    venue: 'Main Auditorium',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&h=400',
    capacity: 500,
    registeredCount: 412,
    tags: ['Hackathon', 'AI', 'Web3'],
    status: 'approved',
    permissionToken: 'VITC-2026-XK9QMP',
  },
  {
    id: 'event-2',
    title: 'Startup Pitch Deck Workshop',
    clubId: 'club-2',
    clubName: 'EDC',
    description: 'Learn how to craft the perfect pitch deck to secure seed funding.',
    date: '2026-09-20',
    time: '14:00',
    venue: 'Seminar Hall B',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800&h=400',
    capacity: 100,
    registeredCount: 100,
    tags: ['Workshop', 'Startups', 'Pitching'],
    status: 'pending',
  },
  {
    id: 'event-3',
    title: 'Symphony Under the Stars',
    clubId: 'club-13',
    clubName: 'Aaroh',
    description: 'An open-air acoustic performance featuring classical masterpieces and modern hits.',
    date: '2026-09-24',
    time: '19:30',
    venue: 'Open Air Theatre',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800&h=400',
    capacity: 1000,
    registeredCount: 650,
    tags: ['Music', 'Concert', 'Acoustic'],
    status: 'draft',
  },
  {
    id: 'event-4',
    title: 'AR/VR Showcase Night',
    clubId: 'club-21',
    clubName: 'SIG Reality Spectra',
    description: 'Experience cutting-edge augmented and virtual reality demos built by students.',
    date: '2026-10-05',
    time: '17:00',
    venue: 'Innovation Lab',
    imageUrl: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?auto=format&fit=crop&q=80&w=800&h=400',
    capacity: 200,
    registeredCount: 87,
    tags: ['AR', 'VR', 'Tech'],
    status: 'pending',
  },
];

// ─── Mock Users ──────────────────────────────────────────────────────────────

import type { AuthUser as MockUser } from './auth-context';

export const MOCK_USERS: MockUser[] = [
  {
    id: 'user-1',
    name: 'Ansh Rathore',
    email: 'ansh@vitpune.edu.in',
    role: 'super-admin',
    regNo: 'VIT2024SA001',
    year: '3rd Year',
    branch: 'Computer Engineering',
    bio: 'Platform administrator for VIT CLUBS.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ansh',
  },
  {
    id: 'user-2',
    name: 'Riya Desai',
    email: 'riya@vitpune.edu.in',
    role: 'admin',
    clubId: 'club-5',
    clubName: 'GDSC',
    regNo: 'VIT2024CS042',
    year: '3rd Year',
    branch: 'Computer Science',
    bio: 'Club lead at GDSC VIT Pune. Passionate about developer communities.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Riya',
  },
  {
    id: 'user-3',
    name: 'Priya Kapoor',
    email: 'priya@vitpune.edu.in',
    role: 'admin',
    clubId: 'club-2',
    clubName: 'EDC',
    regNo: 'VIT2024EC018',
    year: '4th Year',
    branch: 'Electronics Engineering',
    bio: 'Entrepreneurship enthusiast and EDC chapter head.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
  },
  {
    id: 'user-4',
    name: 'Aryan Mehta',
    email: 'aryan@vitpune.edu.in',
    role: 'user',
    regNo: 'VIT2025ME101',
    year: '2nd Year',
    branch: 'Mechanical Engineering',
    bio: 'Love robotics and astronomy.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan',
  },
  {
    id: 'user-5',
    name: 'Sneha Iyer',
    email: 'sneha@vitpune.edu.in',
    role: 'user',
    regNo: 'VIT2025IT077',
    year: '2nd Year',
    branch: 'Information Technology',
    bio: 'Dancer, coder, and perpetual coffee drinker.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
  },
];

// ─── Mock Membership Requests ─────────────────────────────────────────────────

export const MOCK_MEMBERSHIPS: MembershipRequest[] = [
  { id: 'mem-1', userId: 'user-4', userName: 'Aryan Mehta', userEmail: 'aryan@vitpune.edu.in', userRegNo: 'VIT2025ME101', clubId: 'club-5', clubName: 'GDSC', status: 'pending', requestedAt: '2026-08-10' },
  { id: 'mem-2', userId: 'user-5', userName: 'Sneha Iyer', userEmail: 'sneha@vitpune.edu.in', userRegNo: 'VIT2025IT077', clubId: 'club-5', clubName: 'GDSC', status: 'approved', requestedAt: '2026-08-08' },
  { id: 'mem-3', userId: 'user-4', userName: 'Aryan Mehta', userEmail: 'aryan@vitpune.edu.in', userRegNo: 'VIT2025ME101', clubId: 'club-2', clubName: 'EDC', status: 'approved', requestedAt: '2026-08-01' },
  { id: 'mem-4', userId: 'user-5', userName: 'Sneha Iyer', userEmail: 'sneha@vitpune.edu.in', userRegNo: 'VIT2025IT077', clubId: 'club-2', clubName: 'EDC', status: 'pending', requestedAt: '2026-08-11' },
];

// ─── Mock Permission Letters ──────────────────────────────────────────────────

export const MOCK_PERMISSION_LETTERS: PermissionLetter[] = [
  {
    token: 'VITC-2026-XK9QMP',
    eventId: 'event-1',
    eventTitle: 'HackTheFuture 2026',
    clubName: 'GDSC',
    venue: 'Main Auditorium',
    date: '2026-09-15',
    issuedBy: 'Ansh Rathore',
    issuedAt: '2026-08-01T10:30:00Z',
  },
];

// ─── Mock Registrations ───────────────────────────────────────────────────────

export interface EventRegistration {
  id: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  clubName: string;
  date: string;
  venue: string;
  registeredAt: string;
}

export const MOCK_REGISTRATIONS: EventRegistration[] = [
  { id: 'reg-1', userId: 'user-4', eventId: 'event-1', eventTitle: 'HackTheFuture 2026', clubName: 'GDSC', date: '2026-09-15', venue: 'Main Auditorium', registeredAt: '2026-08-05' },
  { id: 'reg-2', userId: 'user-5', eventId: 'event-1', eventTitle: 'HackTheFuture 2026', clubName: 'GDSC', date: '2026-09-15', venue: 'Main Auditorium', registeredAt: '2026-08-06' },
  { id: 'reg-3', userId: 'user-4', eventId: 'event-3', eventTitle: 'Symphony Under the Stars', clubName: 'Aaroh', date: '2026-09-24', venue: 'Open Air Theatre', registeredAt: '2026-08-09' },
];

