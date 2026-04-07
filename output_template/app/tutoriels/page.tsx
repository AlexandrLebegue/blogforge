import { getArticlesByCategory } from '@/lib/markdown';
import TutorielsPageClient from '@/components/TutorielsPageClient';

export default function TutorielsPage() {
  const cat1Articles = getArticlesByCategory('{{CAT1}}');
  const cat2Articles = getArticlesByCategory('{{CAT2}}');
  const cat3Articles = getArticlesByCategory('{{CAT3}}');

  return (
    <TutorielsPageClient
      cat1Articles={cat1Articles}
      cat2Articles={cat2Articles}
      cat3Articles={cat3Articles}
    />
  );
}
