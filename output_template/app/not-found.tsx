import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-heading font-bold text-text-dark mb-4">404</h1>
        <h2 className="text-2xl font-heading font-semibold text-text-dark mb-4">
          Page not found
        </h2>
        <p className="text-text-gray mb-8">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
      </div>
    </div>
  );
}
