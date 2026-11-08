import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  seedActivity,
  seedAdministrators,
  seedInquiries,
  seedProducts,
} from "@/admin/admin-demo-data";
import type {
  AdminRole,
  DemoActivity,
  DemoAdministrator,
  DemoInquiry,
  DemoProduct,
  InquiryStatus,
} from "@/admin/admin-types";

type AdminDemoContextValue = {
  role: AdminRole;
  setRole: (role: AdminRole) => void;
  products: DemoProduct[];
  inquiries: DemoInquiry[];
  administrators: DemoAdministrator[];
  activity: DemoActivity[];
  saveProduct: (product: DemoProduct) => void;
  setPublished: (slug: string, published: boolean) => void;
  moveProduct: (slug: string, direction: -1 | 1) => void;
  setInquiryStatus: (id: string, status: InquiryStatus) => void;
};

const AdminDemoContext = createContext<AdminDemoContextValue | null>(null);

const actorFor = (role: AdminRole) =>
  role === "owner" ? "HISA Owner" : "HISA Admin";

const previewRole = (): AdminRole => {
  if (typeof window === "undefined") return "owner";
  return new URLSearchParams(window.location.search).get("role") === "admin"
    ? "admin"
    : "owner";
};

export const AdminDemoProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<AdminRole>(previewRole);
  const [products, setProducts] = useState<DemoProduct[]>(seedProducts);
  const [inquiries, setInquiries] = useState<DemoInquiry[]>(seedInquiries);
  const [activity, setActivity] = useState<DemoActivity[]>(seedActivity);
  const administrators = seedAdministrators;

  const addActivity = useCallback(
    (actionKey: string, target: string) => {
      setActivity((current) => [
        {
          id: `act-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          createdAt: new Date().toISOString(),
          actor: actorFor(role),
          actorRole: role,
          actionKey,
          target,
        },
        ...current,
      ]);
    },
    [role],
  );

  const saveProduct = useCallback(
    (product: DemoProduct) => {
      const previous = products.find((entry) => entry.id === product.id);
      setProducts((current) => {
        const exists = current.some((entry) => entry.id === product.id);
        return exists
          ? current.map((entry) => (entry.id === product.id ? product : entry))
          : [...current, product];
      });

      if (!previous) {
        addActivity("admin.activity.action.productCreated", product.slug);
      } else if (previous.published !== product.published) {
        addActivity(
          product.published
            ? "admin.activity.action.productPublished"
            : "admin.activity.action.productUnpublished",
          product.slug,
        );
      } else {
        addActivity("admin.activity.action.productUpdated", product.slug);
      }
    },
    [addActivity, products],
  );

  const setPublished = useCallback(
    (slug: string, published: boolean) => {
      setProducts((current) =>
        current.map((entry) =>
          entry.slug === slug
            ? {
                ...entry,
                published,
                updatedAt: new Date().toISOString(),
              }
            : entry,
        ),
      );
      addActivity(
        published
          ? "admin.activity.action.productPublished"
          : "admin.activity.action.productUnpublished",
        slug,
      );
    },
    [addActivity],
  );

  const moveProduct = useCallback(
    (slug: string, direction: -1 | 1) => {
      const currentProduct = products.find((entry) => entry.slug === slug);
      if (!currentProduct) return;

      const siblings = products
        .filter((entry) => entry.catalog === currentProduct.catalog)
        .sort((a, b) => a.position - b.position);
      const index = siblings.findIndex((entry) => entry.slug === slug);
      const neighbour = siblings[index + direction];
      if (!neighbour) return;

      const currentPosition = currentProduct.position;
      const neighbourPosition = neighbour.position;

      setProducts((current) =>
        current.map((entry) => {
          if (entry.slug === currentProduct.slug) {
            return { ...entry, position: neighbourPosition };
          }
          if (entry.slug === neighbour.slug) {
            return { ...entry, position: currentPosition };
          }
          return entry;
        }),
      );
      addActivity("admin.activity.action.productReordered", currentProduct.catalog);
    },
    [addActivity, products],
  );

  const setInquiryStatus = useCallback(
    (id: string, status: InquiryStatus) => {
      const inquiry = inquiries.find((entry) => entry.id === id);
      if (!inquiry || inquiry.status === status) return;

      const now = new Date().toISOString();
      setInquiries((current) =>
        current.map((entry) => {
          if (entry.id !== id) return entry;
          if (status === "new") {
            return { ...entry, status, readAt: null, handledAt: null };
          }
          if (status === "read") {
            return {
              ...entry,
              status,
              readAt: entry.readAt ?? now,
              handledAt: null,
            };
          }
          return {
            ...entry,
            status,
            readAt: entry.readAt ?? now,
            handledAt: now,
          };
        }),
      );

      addActivity(
        status === "handled"
          ? "admin.activity.action.inquiryHandled"
          : status === "read"
            ? "admin.activity.action.inquiryRead"
            : "admin.activity.action.inquiryReopened",
        id,
      );
    },
    [addActivity, inquiries],
  );

  const value = useMemo<AdminDemoContextValue>(
    () => ({
      role,
      setRole,
      products,
      inquiries,
      administrators,
      activity,
      saveProduct,
      setPublished,
      moveProduct,
      setInquiryStatus,
    }),
    [
      role,
      products,
      inquiries,
      activity,
      administrators,
      saveProduct,
      setPublished,
      moveProduct,
      setInquiryStatus,
    ],
  );

  return (
    <AdminDemoContext.Provider value={value}>
      {children}
    </AdminDemoContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminDemo = () => {
  const context = useContext(AdminDemoContext);
  if (!context) {
    throw new Error("useAdminDemo must be used inside AdminDemoProvider");
  }
  return context;
};
