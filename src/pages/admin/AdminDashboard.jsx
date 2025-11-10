import { NavLink } from "react-router-dom";
import { FiShoppingBag, FiTag, FiCheckCircle, FiClock } from "react-icons/fi";
import PageHeader from "../../admin/PageHeader";
import {
  useProductsCount,
  useProductsAvailableCount,
  useCategoriesCount,
} from "../../hooks/useCounts";
import { useProductsSorted } from "../../hooks/useProductsSorted";

export default function AdminDashboard() {
  // 🧮 الإحصائيات العامة
  const { data: totalProducts = 0 } = useProductsCount();
  const { data: availableProducts = 0 } = useProductsAvailableCount();
  const { data: totalCategories = 0 } = useCategoriesCount();
  const outOfStock = Math.max(0, totalProducts - availableProducts);

  // 🆕 أحدث المنتجات
  const { data: recent = [], isLoading: loadingRecent } = useProductsSorted({
    sortBy: "createdAt",
    dir: "desc",
    qText: "",
    status: "all",
  });
  const recent5 = (recent || []).slice(0, 5);

  return (
    <>
      <PageHeader title="Overview" />

      {/* 🔢 كروت الإحصائيات */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={<FiShoppingBag className="text-[#2B7A0B]" />}
          link={{ to: "/admin/products", label: "Manage" }}
        />
        <StatCard
          title="Available"
          value={availableProducts}
          icon={<FiCheckCircle className="text-[#2B7A0B]" />}
          link={{ to: "/admin/products?filter=available", label: "View" }}
        />
        <StatCard
          title="Out of Stock"
          value={outOfStock}
          icon={<FiClock className="text-[#2B7A0B]" />}
          link={{ to: "/admin/products?filter=outofstock", label: "Review" }}
        />
        <StatCard
          title="Categories"
          value={totalCategories}
          icon={<FiTag className="text-[#2B7A0B]" />}
          link={{ to: "/admin/categories", label: "Manage" }}
        />
      </div>

      {/* 🆕 قسم أحدث المنتجات */}
      <section className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">
            Recent Products
          </h2>
          <NavLink
            to="/admin/products"
            className="text-sm font-medium text-[#2B7A0B] hover:underline"
          >
            See all →
          </NavLink>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {loadingRecent ? (
            <RecentSkeleton />
          ) : recent5.length === 0 ? (
            <div className="p-6 text-sm text-gray-600">No products yet.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recent5.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-gray-900">
                      {p.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(p.createdAt)}
                    </div>
                  </div>
                  <NavLink
                    to={`/admin/products/${p.id}/edit`}
                    className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                  >
                    Edit
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}

// 📊 كارت الإحصائيات
function StatCard({ title, value, icon, link }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-xl">{icon}</div>
      </div>
      <div className="mt-1 text-3xl font-bold text-gray-900">{value}</div>
      {link && (
        <NavLink
          to={link.to}
          className="mt-3 inline-block text-sm font-semibold text-[#08be1d] hover:text-[#27b71a]"
        >
          {link.label} →
        </NavLink>
      )}
    </div>
  );
}

// 🕓 سكليتون التحميل
function RecentSkeleton() {
  return (
    <ul>
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i} className="h-12 animate-pulse border-b border-gray-100" />
      ))}
    </ul>
  );
}

// 📅 تنسيق التاريخ
function formatDate(ts) {
  if (!ts) return "—";
  const ms = ts.toMillis
    ? ts.toMillis()
    : ts.seconds
    ? ts.seconds * 1000
    : +new Date(ts);
  return new Date(ms).toLocaleDateString();
}
