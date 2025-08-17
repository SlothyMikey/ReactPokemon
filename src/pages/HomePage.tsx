import Navbar from '@/components/Navbar.tsx';
import MainContent from '@/components/MainContent.tsx';

export default function HomePage() {
  return (
    <>
      <section className="bg-section w-full min-h-dvh">
        <Navbar />
        <MainContent motto="Gotta catch 'em all!" />
      </section>
    </>
  );
}
