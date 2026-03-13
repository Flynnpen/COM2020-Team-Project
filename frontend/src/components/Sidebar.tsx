import { clearDemoUser, getDemoUser } from "../auth/demoAuth";
import { ensureGamificationState, getPetTemplate } from "../gamification/store";

type NavItem = {
  label: string;
  href: string;
};

const baseNavItems: NavItem[] = [
  { label: "Dashboard", href: "/app/dashboard" },
  { label: "Pets", href: "/app/pets" },
  { label: "Shop", href: "/app/shop" },
  { label: "Groups", href: "/app/groups" },
  { label: "Challenges", href: "/app/challenges" },
  { label: "Log action", href: "/app/log-action" },
  { label: "Leaderboards", href: "/app/leaderboards" },
  { label: "Profile", href: "/app/profile" },
];


export default function Sidebar() {
  const user = getDemoUser();
  const gamificationState = user?.user_id
    ? ensureGamificationState(user.user_id)
    : null;
  const petTemplate = gamificationState
    ? getPetTemplate(gamificationState.pet.templateId)
    : null;
  const canModerate = user?.role === "moderator" || user?.role === "maintainer";
  const navItems: NavItem[] = canModerate
    ? [
        ...baseNavItems.slice(0, 5),
        { label: "Moderation", href: "/app/moderation" },
        ...baseNavItems.slice(5),
      ]
    : baseNavItems;

  function handleLogout() {
    clearDemoUser();
    window.location.href = "/login";
  }

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:gap-6 md:border-r md:border-gray-100 md:bg-white/70 md:p-6">
      {/* Brand */}
      <div className="space-y-1">
        <div className="text-sm font-semibold text-gray-900">Campus Carbon</div>
        <div className="text-xs text-gray-500">Exeter student challenges</div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Bottom area */}
      <div className="mt-auto space-y-3">
        {gamificationState && petTemplate ? (
          <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white">
            <div className={`bg-gradient-to-r ${petTemplate.accentClass} p-4`}>
              <div className="flex items-center gap-3">
                <img
                  src={petTemplate.image}
                  alt={petTemplate.name}
                  className="h-14 w-14 rounded-2xl bg-white/80 object-cover"
                />
                <div className="min-w-0">
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-700">
                    Active pet
                  </div>
                  <div className="truncate text-sm font-semibold text-gray-950">
                    {gamificationState.pet.nickname}
                  </div>
                  <div className="text-xs text-gray-700">{petTemplate.tagline}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-gray-500">CG67coin</div>
                  <div className="mt-1 text-sm font-semibold text-gray-950">
                    {gamificationState.coins}
                  </div>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-gray-500">Streak</div>
                  <div className="mt-1 text-sm font-semibold text-gray-950">
                    {gamificationState.pet.streakDays} days
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span>Energy</span>
                  <span>{gamificationState.pet.energy}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-amber-400"
                    style={{ width: `${gamificationState.pet.energy}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-xs">
                <span className="text-gray-500">Status</span>
                <span
                  className={`font-medium ${
                    gamificationState.pet.status === "alive"
                      ? "text-emerald-700"
                      : "text-rose-700"
                  }`}
                >
                  {gamificationState.pet.status === "alive" ? "Alive" : "Needs revive"}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
