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
    name: "SOA Vynl",
    price: "$20.00",
    description: "Limited edition tour poster (18x24).",
    image: "/clothes4.png",
  },
]

export default function MerchPage() {
  const [selected, setSelected] = useState(products[0])

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* Header */}
    

      {/* Main Container */}
      <div className="flex flex-col md:flex-row w-full h-[calc(100vh-100px)] p-6 gap-6 mt-0 md:mt-10">
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
          {/* Description hidden on small, shown on md+ */}
          <p className="text-gray-300 mt-2 hidden md:block">{selected.description}</p>
          <p className="text-xl mt-4">{selected.price}</p>
          <Button className="mt-6 px-6 py-3 rounded-xl bg-white text-black hover:bg-gray-200">
            Add to Cart
          </Button>
        </div>

        {/* Gallery Sidebar with Details */}
        <div className="w-full w-1/2 md:w-1/3 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto mb-6 md:mb-0">
          {products.map((product, index) => (
            <div
              key={product.id}
              onClick={() => setSelected(product)}
              className={`cursor-pointer flex-shrink-0 md:flex-shrink hover:opacity-80 transition border-2 rounded-l md:p-2 p-4 flex gap-3 items-center ${
                selected.id === product.id ? "border-white" : "border-transparent"
              } ${index === products.length - 1 ? "sm:mb-6 md:mb-0" : ""}`}
            >
              <Image
                src={product.image}
                alt={product.name}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
              {/* Details */}
              <div className="flex flex-col p-2">
                <span className="font-bold text-sm md:text-base">{product.name}</span>
                <span className="text-gray-300 text-xs md:text-sm">{product.price}</span>
                {/* Description hidden on small, shown on md+ */}
                <span className="text-gray-400 text-xs md:text-sm line-clamp-2 hidden md:block">
                  {product.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
