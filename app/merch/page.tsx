"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type Product = {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
};

const products: Product[] = [
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
  const [selected, setSelected] = useState<Product | null>(null);
  const [size, setSize] = useState<string>("");

  return (
    <main className="px-6 py-8 min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white flex flex-col">
      {/* Header */}
      <header className="mb-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Official Merch
        </h1>
      </header>

      {/* Grid */}
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
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
              className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-gray-900 z-50 shadow-xl p-5 overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Top bar with back/close */}
              <div className="flex items-center justify-between mb-4 pt-10 sm:pt-0">
                <button
                  onClick={() => setSelected(null)}
                  className="text-sm text-gray-400 hover:underline mt-4 md:mt-0"
                >
                  ← Go Back
                </button>

                
              </div>

              <div>
                {/* Product Image */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-800">
                  <Image
                    src={selected.image}
                    alt={selected.name}
                    fill
                    className="object-cover"
                  />
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
                  className={`mt-5 w-full px-4 py-2 rounded-lg font-medium text-sm transition ${
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
