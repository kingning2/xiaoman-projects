import { ThemeToggle } from "@/components/theme-toggle";

type SiteHeaderProps = {
  children?: React.ReactNode;
};

export function SiteHeader({ children }: SiteHeaderProps) {
  return (
    <header className="mb-2 flex items-center justify-end gap-2">
      {children}
      <ThemeToggle />
    </header>
  );
}
