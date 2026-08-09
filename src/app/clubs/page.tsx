import { ClubExplorer } from '@/components/shared/ClubExplorer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Clubs | CCMS',
  description: 'Discover and join clubs across technical, cultural, sports, and more domains.',
};

export default function ClubsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05050A] pt-12 pb-24">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-5xl mb-4">
            Explore Clubs
          </h1>
          <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl">
            Browse through 50+ officially registered student communities. Find your tribe, participate in events, and grow your network.
          </p>
        </div>

        <ClubExplorer />
      </div>
    </div>
  );
}
