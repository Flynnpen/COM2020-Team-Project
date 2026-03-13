type PageShellProps = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
};

export default function PageShell({ title, subtitle, right, children }: PageShellProps) {
  return (
    <div className="space-y-7">
      <header className="app-card flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="space-y-2">
          <div className="app-chip">Campus Carbon</div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-[rgb(var(--app-ink))]">
              {title}
            </h1>
            {subtitle ? <p className="max-w-2xl text-sm app-muted">{subtitle}</p> : null}
          </div>
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </header>

      {children}
    </div>
  );
}
