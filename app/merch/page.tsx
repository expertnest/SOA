'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
};

const products: Product[] = [
  { id: 1, name: "Signature Hoodie", price: "$65.00", description: "Premium heavyweight hoodie with embroidered logo.", image: "/clothes1.png" },
  { id: 2, name: "Tour T-Shirt", price: "$40.00", description: "Lightweight cotton tee with front and back print.", image: "/clothes2.png" },
  { id: 3, name: "Logo Cap", price: "$30.00", description: "Adjustable cap with embroidered logo.", image: "/clothes3.png" },
  { id: 4, name: "Performance Jacket", price: "$90.00", description: "Water-resistant jacket built for performance.", image: "/clothes4.png" },
];

export default function MerchPage() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [size, setSize] = useState<string>("");

  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <main className="relative w-full text-white flex flex-col overflow-hidden min-h-screen bg-black">

      {/* ===== Header ===== */}
      <header className="relative z-10 px-6 pt-[90px] mb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Official Merch
        </h1>
      </header>

      {/* ===== Products Grid ===== */}
      <div className="relative z-10 flex-1 flex items-start justify-center px-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4 w-full max-w-3xl pb-[120px]">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => { setSelected(product); setSize(""); }}
              className="group block text-left relative"
            >
              <div className="relative overflow-hidden rounded-xl bg-black/80 h-32 sm:h-48 md:h-72 lg:h-80 backdrop-blur-sm border border-gray-800 hover:border-white transition">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h2 className="mt-2 text-sm md:text-base font-medium">{product.name}</h2>
              <p className="text-[11px] md:text-xs text-gray-400">{product.price}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ===== Overlay / Detail View ===== */}
      <AnimatePresence>
        {selected && (
          <>
            {/* Background overlay */}
            <motion.div
              className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />

            {/* Sliding panel */}
            <motion.div
              className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-black/95 z-50 shadow-xl p-5 overflow-y-auto pb-32 backdrop-blur-md"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
                touchAction: "pan-y",
              }}
            >
              {/* Top bar */}
              <div className="flex items-center justify-between mb-4 pt-10 sm:pt-0">
                <button
                  onClick={() => setSelected(null)}
                  className="text-sm text-gray-400 mt-6 hover:text-white transition"
                >
                  ← Go Back
                </button>
              </div>

              {/* Product Image */}
              <div className="relative overflow-hidden rounded-2xl bg-black h-56 sm:h-64 md:h-[280px] lg:h-[300px] border border-gray-800">
                <Image src={selected.image} alt={selected.name} fill className="object-cover" />
              </div>

              <h1 className="text-xl font-bold mt-4">{selected.name}</h1>
              <p className="text-base mt-1 text-gray-200">{selected.price}</p>
              <p className="text-sm text-gray-400 mt-2">{selected.description}</p>

              {/* Size Selector */}
              <div className="mt-4">
                <p className="text-xs mb-1">Choose Size:</p>
                <div className="flex gap-2">
                  {["S", "M", "L"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-3 py-1 text-sm rounded-md border transition ${
                        size === s
                          ? "bg-white text-black border-white"
                          : "border-gray-700 text-gray-300 hover:border-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={!size}
                className={`mt-5 w-full px-4 py-2 rounded-lg font-medium text-sm transition ${
                  size
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                Add to Cart
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
