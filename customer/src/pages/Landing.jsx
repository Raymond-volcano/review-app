import React from 'react'

export default function Landing({ store, images, copies, nextStep }) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      {/* Logo */}
      {store.logo ? (
        <img src={store.logo} alt={store.name} className="w-20 h-20 rounded-full object-cover mb-4 shadow-lg" />
      ) : (
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-3xl mb-4 shadow-lg">
          {store.name.charAt(0)}
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-800 mb-2">{store.name}</h1>
      <p className="text-gray-500 text-sm mb-8 max-w-xs">{store.welcome_text}</p>

      {/* Preview images */}
      {images.length > 0 && (
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 max-w-sm">
          {images.slice(0, 5).map(img => (
            <img
              key={img.id}
              src={img.url}
              alt={img.label}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border-2 border-white shadow"
            />
          ))}
          {images.length > 5 && (
            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400 flex-shrink-0">
              +{images.length - 5}
            </div>
          )}
        </div>
      )}

      <button
        onClick={nextStep}
        className="w-full max-w-xs bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-purple-200 active:scale-95 transition-transform"
      >
        开始写评价 →
      </button>

      <p className="text-xs text-gray-400 mt-6">
        已有 {(images.length + copies.length) * 3} 位顾客在这里写了评价
      </p>
    </div>
  )
}
