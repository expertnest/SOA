"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Signature Hoodie",
    price: "$65.00",
    description: "Premium heavyweight hoodie with embroidered logo.",
    image: "/clothes1.png",
  },
  {
    id: 2,
    name: "Tour T-Shirt",
    price: "$40.00",
    description: "Lightweight cotton tee with front and back print.",
    image: "/clothes2.png",
  },
  {
    id: 3,
    name: "Logo Cap",
    price: "$30.00",
    description: "Adjustable cap with embroidered logo.",
    image: "/clothes3.png",
  },
  {
    id: 4,
    name: "Performance Jacket",
    price: "$90.00",
    description: "Water-resistant jacket built for performance.",
    image: "/clothes4.png",
  },
];

export default function MerchPage() {
  const [selected, setSelected] = useState<any>(null);
  const [size, setSize] = useState<string>("");

  return (
    <main className="px-4 py-8 min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight">Official Merch</h1>
        <p className="text-sm text-gray-400 hidden sm:block">
          Minimal • Modern • Sleek
        </p>
      </header>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => {
              setSelected(product);
              setSize("");
            }}
            className="group block text-left"
          >
            <div className="aspect-square relative overflow-hidden rounded-2xl bg-gray-700">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <h2 className="mt-3 text-sm font-medium">{product.name}</h2>
            <p className="text-xs text-gray-400">{product.price}</p>
          </button>
        ))}
      </div>

      {/* Overlay / Detail View */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />

            <motion.div
              className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-gray-900 z-50 shadow-xl p-6 overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Top bar with back/close */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setSelected(null)}
                  className="text-sm text-gray-400 hover:underline"
                >
                  ← Go Back
                </button>

                <button
                  onClick={() => setSelected(null)}
                  className="p-2 rounded-md hover:bg-gray-800 sm:hidden"
                >
                  <X className="w-5 h-5 text-gray-300" />
                </button>
              </div>

              {/* MOBILE Go Back above image modal */}
              <div className="sm:hidden mb-4">
                <button
                  onClick={() => setSelected(null)}
                  className="text-sm text-gray-300 hover:text-white font-medium"
                >
                  ← Go Back
                </button>
              </div>

              <div>
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-800">
                  <Image
                    src={selected.image}
                    alt={selected.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <h1 className="text-2xl font-bold mt-6">{selected.name}</h1>
                <p className="text-lg mt-2 text-gray-200">{selected.price}</p>
                <p className="text-sm text-gray-400 mt-4">
                  {selected.description}
                </p>

                {/* Size Selector */}
                <div className="mt-6">
                  <p className="text-sm mb-2">Choose Size:</p>
                  <div className="flex gap-3">
                    {["S", "M", "L"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`px-4 py-2 rounded-md border transition ${
                          size === s
                            ? "bg-white text-black border-white"
                            : "border-gray-500 text-gray-300 hover:border-white"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  disabled={!size}
                  className={`mt-6 w-full px-6 py-3 rounded-xl font-medium transition ${
                    size
                      ? "bg-white text-black hover:bg-gray-200"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
