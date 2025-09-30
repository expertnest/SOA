"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

export default function Modal({ isOpen, onClose, content }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.25 }}
          >
            <div className="relative w-full max-w-2xl bg-zinc-900 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-white/70 hover:text-white transition"
              >
                <X size={22} />
              </button>

              {/* Modal Content */}
              <div className="p-6">
                {content?.image && (
                  <div className="w-full h-60 rounded-lg overflow-hidden mb-4">
                    <img
                      src={content.image}
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h2 className="text-xl font-bold mb-2">{content?.title}</h2>
                <p className="text-sm text-white/70 mb-4">{content?.date}</p>
                <p className="text-base text-white/90">{content?.excerpt || "Coming soon..."}</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
