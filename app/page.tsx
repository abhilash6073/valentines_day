import FloatingHearts from '@/components/FloatingHearts';
import ValentineCard from '@/components/ValentineCard';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-rose-100 via-rose-50 to-white">
      <FloatingHearts />
      <ValentineCard />

      <footer className="absolute bottom-4 text-rose-400 text-sm font-light">
        Made with ❤️ for you
      </footer>
    </main>
  );
}
