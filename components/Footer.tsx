import Link from 'next/link';
import { TrendingDown } from 'lucide-react';
import { Container } from './ui/Container';

export default function Footer() {
  return (
    <footer className="border-t border-border py-16">
      <Container size="lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2.5">
            <TrendingDown className="h-4 w-4 text-foreground-subtle" />
            <span className="text-sm font-medium text-foreground-subtle">Snowball</span>
          </div>

          <div className="flex items-center space-x-8">
            <Link href="/privacy" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>

          <p className="text-sm text-foreground-subtle">
            © 2025 Snowball
          </p>
        </div>
      </Container>
    </footer>
  );
}
