'use client'

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

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
    price: "$35.00",
    description: "100% cotton graphic tee from the 2025 tour.",
    image: "/clothes3.png",
  },
  {
    id: 3,
    name: "SOA Hat",
    price: "$25.00",
    description: "Classic low-profile hat with stitched logo.",
    image: "/clothes2.png",
  },
  {
    id: 4,
    name: "SOA Vinyl",
    price: "$20.00",
    description: "Limited edition vinyl with exclusive artwork.",
    image: "/clothes4.png",
  },
]

export default function MerchPage() {
  const [selected, setSelected] = useState(products[0])

  return (
    <div className="w-full min-h-screen bg-black text-white">
      <div className="flex flex-col md:flex-row w-full h-[calc(90vh-80px)] p-4 md:p-6 gap-6">
        {/* Main Product Showcase */}
        <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900/90 rounded-2xl p-6 shadow-lg border border-zinc-800 relative">
          {/* Glow accent */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-pink-500/10 via-purple-500/10 to-blue-500/10 blur-2xl opacity-40 pointer-events-none" />

          <Image
            src={selected.image}
            alt={selected.name}
            width={420}
            height={420}
            className="rounded-xl object-contain mb-6 drop-shadow-xl"
          />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{selected.name}</h2>
          <p className="text-gray-400 mt-2 text-sm md:text-base text-center max-w-md">
            {selected.description}
          </p>
          <p className="text-lg md:text-xl mt-4 font-semibold">{selected.price}</p>
          <Button className="mt-5 px-6 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-200 transition">
            Add to Cart
          </Button>
        </div>

        {/* Sidebar Product List */}
        <div className="w-full md:w-1/3 flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelected(product)}
              className={`cursor-pointer flex-shrink-0 md:flex-shrink transition-all border rounded-xl p-3 flex gap-3 items-center group ${
                selected.id === product.id
                  ? "border-white bg-zinc-800 shadow-md"
                  : "border-zinc-800 hover:bg-zinc-800/50"
              }`}
            >
              <Image
                src={product.image}
                alt={product.name}
                width={56}
                height={56}
                className="rounded-md object-contain"
              />
              <div className="flex flex-col">
                <span className="font-medium text-sm md:text-base group-hover:text-white transition">
                  {product.name}
                </span>
                <span className="text-gray-400 text-xs md:text-sm">{product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
