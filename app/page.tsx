import { NavProvider } from '@/components/NavContext';
import SiteLayout from '@/components/SiteLayout';

export default function Home() {
  return (
    <NavProvider>
      <SiteLayout />
    </NavProvider>
  );
}
