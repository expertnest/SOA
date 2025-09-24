'use client'

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "Signature Hoodie",
    price: "$65.00",
    description: "Premium heavyweight hoodie with embroidered logo.",
    image: "/products/hoodie.jpg",
  },
  {
    id: 2,
    name: "Tour T-Shirt",
    price: "$35.00",
    description: "100% cotton graphic tee from the 2025 tour.",
    image: "/products/tshirt.jpg",
  },
  {
    id: 3,
    name: "Dad Hat",
    price: "$25.00",
    description: "Classic low-profile hat with stitched logo.",
    image: "/products/hat.jpg",
  },
  {
    id: 4,
    name: "Poster",
    price: "$20.00",
    description: "Limited edition tour poster (18x24).",
    image: "/products/poster.jpg",
  },
]

export default function MerchPage() {
  const [selected, setSelected] = useState(products[0])

  return (
    <div className="flex flex-col md:flex-row w-full h-screen p-6 gap-6 bg-black text-white relative">
      {/* Back to Menu Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-white font-semibold hover:text-gray-300 transition"
      >
        &larr; Back to Menu
      </Link>

      {/* Main Display Section */}
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900 rounded-2xl p-6 shadow-lg">
        <Image
          src={selected.image}
          alt={selected.name}
          width={400}
          height={400}
          className="rounded-xl object-cover mb-6"
        />
        <h2 className="text-2xl font-bold">{selected.name}</h2>
        <p className="text-gray-300 mt-2">{selected.description}</p>
        <p className="text-xl mt-4">{selected.price}</p>
        <Button className="mt-6 px-6 py-3 rounded-xl bg-white text-black hover:bg-gray-200">
          Add to Cart
        </Button>
      </div>

      {/* Gallery Sidebar */}
      <div className="w-full md:w-1/3 flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => setSelected(product)}
            className={`cursor-pointer flex-shrink-0 md:flex-shrink hover:opacity-80 transition border-2 rounded-xl p-2 ${
              selected.id === product.id ? "border-white" : "border-transparent"
            }`}
          >
            <Image
              src={product.image}
              alt={product.name}
              width={120}
              height={120}
              className="rounded-lg object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
