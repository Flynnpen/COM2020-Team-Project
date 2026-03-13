import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import { getDemoUser } from "../auth/demoAuth";
import { SHOP_ITEMS } from "../gamification/catalog";
import {
  ensureGamificationState,
  getEarnedBadges,
  getOwnedShopItems,
  getPetTemplate,
  revivePetWithCoins,
  saveGamificationState,
  setPetStatus,
  toggleEquipItem,
  type GamificationState,
} from "../gamification/store";

function StatBar({
  label,
  value,
  tint,
}: {
  label: string;
  value: number;
  tint: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100">
        <div className={`h-2 rounded-full ${tint}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function PetsPage() {
  const user = getDemoUser();
  const [state, setState] = useState<GamificationState | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.user_id) return;
    setState(ensureGamificationState(user.user_id));
  }, [user?.user_id]);

  if (!user) {
    return (
      <PageShell title="Pets" subtitle="Sign in to view your campus companion.">
        <div className="rounded-2xl bg-white p-6 text-sm text-gray-700">
          You need to be signed in to manage your pet.
        </div>
      </PageShell>
    );
  }

  if (!state) {
    return (
      <PageShell title="Pets" subtitle="Loading your companion...">
        <div className="rounded-2xl bg-white p-6 text-sm text-gray-700">Loading pet data...</div>
      </PageShell>
    );
  }

  const currentUser = user;
  const currentState = state;
  const petTemplate = getPetTemplate(currentState.pet.templateId);
  const earnedBadges = getEarnedBadges(currentState);
  const ownedItems = getOwnedShopItems(currentState);
  const equippedItems = SHOP_ITEMS.filter((item) =>
    currentState.pet.equippedItemIds.includes(item.id)
  );

  function refresh(nextState: GamificationState | null, nextMessage?: string) {
    if (nextState) {
      setState(nextState);
    }
    setMessage(nextMessage ?? null);
  }

  function handleNicknameChange(nickname: string) {
    setState({
      ...currentState,
      pet: {
        ...currentState.pet,
        nickname,
      },
    });
  }

  function handleNicknameSave() {
    saveGamificationState(currentUser.user_id, currentState);
    setMessage("Pet nickname saved.");
  }

  function handleRevive() {
    const result = revivePetWithCoins(currentUser.user_id);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    refresh(result.state, "Your pet is back and ready for more climate missions.");
  }

  function handleEquip(itemId: string) {
    const nextState = toggleEquipItem(currentUser.user_id, itemId);
    refresh(nextState, "Accessory loadout updated.");
  }

  function handleDemoPetDown() {
    const nextState = setPetStatus(currentUser.user_id, "needs-revive");
    refresh(nextState, "Demo state: your pet now needs reviving.");
  }

  function handleRestoreDemo() {
    const nextState = setPetStatus(currentUser.user_id, "alive");
    if (nextState) {
      const restoredState = {
        ...nextState,
        pet: {
          ...nextState.pet,
          health: 80,
          energy: 72,
        },
      };
      saveGamificationState(currentUser.user_id, restoredState);
      refresh(restoredState, "Demo state restored.");
      return;
    }
    refresh(nextState);
  }

  return (
    <PageShell
      title="Pets"
      subtitle="Your Tamagotchi-style sustainability companion, progress loop, and badge hub."
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-sm">
            <div className={`bg-gradient-to-r ${petTemplate.accentClass} p-6`}>
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[1.5rem] bg-white/55 p-4 backdrop-blur">
                  <img
                    src={petTemplate.image}
                    alt={petTemplate.name}
                    className="mx-auto h-72 w-full rounded-[1.25rem] object-contain"
                  />
                </div>

                <div className="space-y-4 rounded-[1.5rem] bg-white/75 p-5 backdrop-blur">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-gray-600">
                        Active companion
                      </div>
                      <h2 className="mt-2 text-3xl font-semibold text-gray-950">
                        {state.pet.nickname}
                      </h2>
                      <p className="mt-1 text-sm text-gray-700">{petTemplate.tagline}</p>
                    </div>
                    <div
                      className={`rounded-full px-3 py-2 text-xs font-medium ${
                        state.pet.status === "alive"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {state.pet.status === "alive" ? "Alive and active" : "Needs revive"}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white p-4">
                      <div className="text-xs text-gray-500">Level</div>
                      <div className="mt-1 text-2xl font-semibold text-gray-950">
                        {state.pet.level}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white p-4">
                      <div className="text-xs text-gray-500">Streak</div>
                      <div className="mt-1 text-2xl font-semibold text-gray-950">
                        {state.pet.streakDays} days
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white p-4">
                      <div className="text-xs text-gray-500">CG67coin</div>
                      <div className="mt-1 text-2xl font-semibold text-gray-950">{state.coins}</div>
                    </div>
                  </div>

                  <div className="space-y-3 rounded-2xl bg-white p-4">
                    <StatBar label="Health" value={state.pet.health} tint="bg-emerald-500" />
                    <StatBar label="Happiness" value={state.pet.happiness} tint="bg-sky-500" />
                    <StatBar label="Energy" value={state.pet.energy} tint="bg-amber-500" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleRevive}
                      disabled={state.pet.status !== "needs-revive"}
                      className="rounded-xl bg-gray-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                      Revive with {state.reviveCostCoins} CG67coin
                    </button>
                    <button
                      type="button"
                      onClick={handleDemoPetDown}
                      className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
                    >
                      Demo pet death state
                    </button>
                    <button
                      type="button"
                      onClick={handleRestoreDemo}
                      className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
                    >
                      Restore demo state
                    </button>
                  </div>

                  <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
                    If your pet dies, the current plan is either a full reset or a revive cost of{" "}
                    {state.reviveCostCashLabel}. This page gives you the front-end structure for
                    both options.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="text-sm font-medium text-gray-900">Identity</div>
              <p className="mt-1 text-xs text-gray-500">
                One pet per account. Players can rename the same pet, but not create a second one.
              </p>
              <input
                className="mt-4 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                value={state.pet.nickname}
                onChange={(e) => handleNicknameChange(e.target.value)}
                placeholder="Pet nickname"
              />
              <button
                type="button"
                onClick={handleNicknameSave}
                className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
              >
                Save nickname
              </button>
              <div className="mt-4 text-xs text-gray-600">
                Adopted on {new Date(state.pet.adoptedAt).toLocaleDateString()}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="text-sm font-medium text-gray-900">Equipped accessories</div>
              <div className="mt-4 space-y-3">
                {equippedItems.length === 0 && (
                  <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
                    Nothing equipped yet. Buy items in the shop first.
                  </div>
                )}
                {equippedItems.map((item) => (
                  <div key={item.id} className="rounded-xl bg-gray-50 p-3">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-600">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="text-sm font-medium text-gray-900">Sustainability badges</div>
            <p className="mt-1 text-xs text-gray-500">
              Keep these on the pet page for now so badges stay connected to the main loop.
            </p>
            <div className="mt-4 space-y-3">
              {earnedBadges.map((badge) => (
                <div key={badge.id} className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                  <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                    {badge.sdg}
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-900">{badge.title}</div>
                  <div className="mt-1 text-xs text-gray-600">{badge.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="text-sm font-medium text-gray-900">Owned items</div>
            <div className="mt-4 space-y-3">
              {ownedItems.length === 0 && (
                <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
                  No accessories owned yet.
                </div>
              )}
              {ownedItems.map((item) => {
                const isEquipped = state.pet.equippedItemIds.includes(item.id);
                return (
                  <div key={item.id} className="rounded-xl bg-gray-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="mt-1 text-xs text-gray-600">{item.effect}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleEquip(item.id)}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700"
                      >
                        {isEquipped ? "Unequip" : "Equip"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-950 p-5 text-white shadow-sm">
            <div className="text-sm font-medium">Future backend handoff</div>
            <div className="mt-3 space-y-2 text-xs text-gray-300">
              <div>Suggested pet entities: `pet`, `pet_inventory`, `pet_badges`, `pet_events`</div>
              <div>Core actions: choose starter pet, earn coins, equip item, revive pet</div>
              <div>Good trigger sources: streaks, challenge submissions, verified evidence, SDG categories</div>
            </div>
          </div>

          {message && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
              {message}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}
