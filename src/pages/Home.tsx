import { WelcomeSection } from '../components/WelcomeSection';
import { ProfileSection } from '../components/ProfileSection';
import { BlogCarousel } from '../components/BlogCarousel';

export function Home() {
  return (
    <div className="min-h-screen bg-white space-y-64 pb-64">
      <WelcomeSection />
      <ProfileSection />
      <BlogCarousel />
    </div>
  );
}
