import { getAllArticles } from '@/lib/markdown';
import HomePageClient from '@/components/HomePageClient';

export default function HomePage() {
  const articles = getAllArticles().slice(0, 6);
  return <HomePageClient articles={articles} />;
}
