import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-12">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-4">About SetPH</h1>
        <p className="text-lg text-muted-foreground mb-6">
          SetPH helps you find and host pickup basketball games near you.
          This demo page shows how to add routes using Next.js file-based routing.
        </p>
        <Link href="/" className="text-primary font-semibold">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
