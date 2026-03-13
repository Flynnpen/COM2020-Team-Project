import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import { getDemoUser } from "../auth/demoAuth";
import { SHOP_ITEMS } from "../gamification/catalog";
import {
  ensureGamificationState,
  purchaseShopItem,
  type GamificationState,
} from "../gamification/store";

export default function ShopPage() {
  const user = getDemoUser();
  const [state, setState] = useState<GamificationState | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.user_id) return;
    setState(ensureGamificationState(user.user_id));
  }, [user?.user_id]);

  if (!user) {
    return (
      <PageShell title="Shop" subtitle="Sign in to spend your CG67coin.">
        <div className="rounded-2xl bg-white p-6 text-sm text-gray-700">
          You need to be signed in to access the shop.
        </div>
      </PageShell>
    );
  }

  if (!state) {
    return (
      <PageShell title="Shop" subtitle="Loading your inventory...">
        <div className="rounded-2xl bg-white p-6 text-sm text-gray-700">Loading shop...</div>
      </PageShell>
    );
  }

  const currentUser = user;

  function handleBuy(itemId: string) {
    const result = purchaseShopItem(currentUser.user_id, itemId);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }

    setState(result.state);
    setMessage(
      result.item.id === "revive-token"
        ? "Revive token used or banked successfully."
        : `${result.item.name} added to your pet inventory.`
    );
  }

  return (
    <PageShell
      title="Shop"
      subtitle="Spend CG67coin on accessories, revive support, and future pet upgrades."
      right={
        <div className="rounded-xl bg-gray-950 px-4 py-2 text-sm font-medium text-white">
          Balance: {state.coins} CG67coin
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.38fr]">
        <section className="grid gap-4 md:grid-cols-2">
          {SHOP_ITEMS.map((item) => {
            const owned = state.inventoryItemIds.includes(item.id);
            const isRevive = item.id === "revive-token";

            return (
              <div key={item.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-emerald-700">
                      {item.slot}
                    </div>
                    <div className="mt-1 text-lg font-medium text-gray-950">{item.name}</div>
                  </div>
                  <div className="rounded-full bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700">
                    {item.price} coin
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600">{item.description}</p>
                <div className="mt-3 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
                  {item.effect}
                </div>
                <button
                  type="button"
                  onClick={() => handleBuy(item.id)}
                  disabled={!isRevive && owned}
                  className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
                >
                  {!isRevive && owned ? "Owned" : "Buy now"}
                </button>
              </div>
            );
          })}
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="text-sm font-medium text-gray-900">How this loop works</div>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <div>1. Players choose one pet during signup.</div>
              <div>2. Sustainable actions and challenge progress earn coins.</div>
              <div>3. Coins buy cosmetic upgrades and revive options.</div>
              <div>4. Pets can enter a revive state if neglected or penalised later.</div>
            </div>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5">
            <div className="text-sm font-medium text-rose-900">Revive rule</div>
            <div className="mt-2 text-sm text-rose-700">
              Current frontend assumption: revival costs `PS5` worth of `CG67coin`, represented as
              a 500-coin revive action.
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-950 p-5 text-white shadow-sm">
            <div className="text-sm font-medium">Next good link-up</div>
            <p className="mt-2 text-sm text-gray-300">
              When backend support is ready, hook coin balance to verified challenge points or
              approved sustainable actions.
            </p>
            <Link
              to="/app/pets"
              className="mt-4 inline-block rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-900"
            >
              Back to pet hub
            </Link>
          </div>

          {message && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
              {message}
            </div>
          )}
        </aside>
      </div>
    </PageShell>
  );
}
