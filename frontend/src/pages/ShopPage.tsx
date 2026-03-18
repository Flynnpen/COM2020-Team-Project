import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import { useAuth } from "../auth/AuthProvider";
import { getCoinBalance } from "../api/coins";
import { getInventory } from "../api/inventory";
import { buyShopItem, getShopItems } from "../api/shop";
import type { InventoryItem, ShopItem } from "../api/types";

function isMissingPetError(error: unknown) {
  return error instanceof Error && /no pet found|user has no pet/i.test(error.message);
}

export default function ShopPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [coins, setCoins] = useState<number | null>(null);
  const [hasPet, setHasPet] = useState(true);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadShop() {
      if (!user?.user_id) return;
      setLoading(true);
      setError(null);

      try {
        const [shopRes, coinRes] = await Promise.all([getShopItems(), getCoinBalance()]);
        if (cancelled) return;

        setItems(shopRes.items || []);
        setCoins(coinRes.coins);

        try {
          const inventoryRes = await getInventory();
          if (!cancelled) {
            setInventory(inventoryRes.inventory || []);
            setHasPet(true);
          }
        } catch (err) {
          if (!cancelled) {
            if (isMissingPetError(err)) {
              setInventory([]);
              setHasPet(false);
            } else {
              throw err;
            }
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load shop.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadShop();
    return () => {
      cancelled = true;
    };
  }, [user?.user_id]);

  const ownedItemIds = useMemo(
    () => new Set(inventory.map((entry) => entry.items.item_id)),
    [inventory]
  );

  async function refreshInventory() {
    try {
      const inventoryRes = await getInventory();
      setInventory(inventoryRes.inventory || []);
      setHasPet(true);
    } catch (err) {
      if (isMissingPetError(err)) {
        setInventory([]);
        setHasPet(false);
        return;
      }
      throw err;
    }
  }

  async function handleBuy(item: ShopItem) {
    setBuyingId(item.item_id);
    setError(null);
    setMessage(null);
    try {
      const res = await buyShopItem(item.item_id);
      setCoins(res.new_coin_balance);
      await refreshInventory();
      setMessage(res.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Purchase failed.");
    } finally {
      setBuyingId(null);
    }
  }

  if (!user) {
    return (
      <PageShell title="Shop" subtitle="Sign in to spend your CG67coin.">
        <div className="app-card p-6 text-sm app-muted">You need to be signed in to access the shop.</div>
      </PageShell>
    );
  }

  if (loading) {
    return (
      <PageShell title="Shop" subtitle="Loading your inventory...">
        <div className="app-card p-6 text-sm app-muted">Loading shop...</div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Shop"
      subtitle="Spend your real backend coin balance on pet accessories and upgrades."
      right={
        <div className="rounded-full bg-[rgb(var(--app-ink))] px-4 py-2 text-sm font-semibold text-white">
          Balance: {coins ?? 0} CG67coin
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_0.38fr]">
        <section className="grid gap-4 md:grid-cols-2">
          {items.map((item) => {
            const owned = ownedItemIds.has(item.item_id);
            const isBuying = buyingId === item.item_id;

            return (
              <div key={item.item_id} className="app-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="app-chip">{item.category}</div>
                    <div className="mt-3 text-xl font-semibold text-[rgb(var(--app-ink))]">
                      {item.name}
                    </div>
                  </div>
                  <div className="rounded-full bg-[rgb(var(--app-soft))] px-3 py-2 text-xs font-semibold text-[rgb(var(--app-ink))]">
                    {item.coin_cost} coin
                  </div>
                </div>
                <p className="mt-4 text-sm app-muted">
                  {item.description || "Cosmetic accessory for your companion."}
                </p>
                <div className="mt-4 rounded-[1.25rem] bg-[rgb(var(--app-soft))] p-3 text-xs app-muted">
                  {item.rarity ? `Rarity: ${item.rarity}` : "Standard item"}
                </div>
                <button
                  type="button"
                  onClick={() => handleBuy(item)}
                  disabled={!hasPet || isBuying || owned}
                  className="mt-5 w-full rounded-2xl bg-[rgb(var(--app-brand))] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-45"
                >
                  {!hasPet ? "Create pet first" : owned ? "Owned" : isBuying ? "Buying..." : "Buy now"}
                </button>
              </div>
            );
          })}
        </section>

        <aside className="space-y-4">
          <div className="app-card p-5">
            <div className="app-chip">Shop status</div>
            <div className="mt-3 space-y-2 text-sm app-muted">
              <div>{items.length} active items loaded from `/shop`.</div>
              <div>{inventory.length} inventory entries loaded from `/inventory`.</div>
              <div>{hasPet ? "Pet profile found." : "No pet profile yet."}</div>
            </div>
          </div>

          {!hasPet && (
            <div className="rounded-[1.75rem] border border-amber-100 bg-amber-50 p-5 text-sm text-amber-800">
              Create your pet first before buying accessories.
              <div className="mt-4">
                <Link
                  to="/app/pets"
                  className="inline-block rounded-2xl bg-[rgb(var(--app-ink))] px-4 py-2 font-semibold text-white"
                >
                  Open pet hub
                </Link>
              </div>
            </div>
          )}

          <div className="rounded-[1.75rem] bg-[rgb(var(--app-ink))] p-5 text-white shadow-sm">
            <div className="text-sm font-semibold">Pet hub link-up</div>
            <p className="mt-2 text-sm text-gray-300">
              Purchases here are written to the backend inventory and can be equipped on the pet page.
            </p>
            <Link
              to="/app/pets"
              className="mt-4 inline-block rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-[rgb(var(--app-ink))]"
            >
              Back to pet hub
            </Link>
          </div>

          {error && (
            <div className="rounded-[1.75rem] border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
              {message}
            </div>
          )}
        </aside>
      </div>
    </PageShell>
  );
}
