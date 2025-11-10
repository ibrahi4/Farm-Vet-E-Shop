import { useQuery } from "@tanstack/react-query";
import {
  collection,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../services/firebase.js";

// عدد كل المنتجات
export function useProductsCount() {
  return useQuery({
    queryKey: ["count", "products", "total"],
    queryFn: async () => {
      const q = query(collection(db, "products"));
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count || 0;
    },
    staleTime: 15_000,
  });
}

// عدد المنتجات المتوفرة فقط
export function useProductsAvailableCount() {
  return useQuery({
    queryKey: ["count", "products", "available"],
    queryFn: async () => {
      const q = query(
        collection(db, "products"),
        where("isAvailable", "==", true)
      );
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count || 0;
    },
    staleTime: 15_000,
  });
}

// عدد التصنيفات (الزراعية أو البيطرية)
export function useCategoriesCount() {
  return useQuery({
    queryKey: ["count", "categories", "total"],
    queryFn: async () => {
      const q = query(collection(db, "categories"));
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count || 0;
    },
    staleTime: 15_000,
  });
}
