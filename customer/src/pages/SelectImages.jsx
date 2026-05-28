import React from 'react'

export default function SelectImages({ images, selectedImages, setSelectedImages, nextStep, prevStep }) {
  const toggleImage = (img) => {
    setSelectedImages(prev => {
      const isSelected = prev.find(i => i.id === img.id)
      if (isSelected) return prev.filter(i => i.id !== img.id)
      if (prev.length >= 9) return prev // max 9
      return [...prev, img]
    })
  }

  const canProceed = selectedImages.length >= 3

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">选择图片</h2>
        <p className="text-gray-500 text-sm mt-1">选 3-9 张你喜欢的照片（已选 {selectedImages.length} 张）</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {images.map(img => {
          const isSelected = selectedImages.find(i => i.id === img.id)
          return (
            <button
              key={img.id}
              onClick={() => toggleImage(img)}
              className={`relative rounded-xl overflow-hidden aspect-square transition-all ${
                isSelected ? 'ring-2 ring-purple-500 ring-offset-2 scale-[1.02]' : 'active:scale-95'
              }`}
            >
              <img src={img.url} alt={img.label} className="w-full h-full object-cover" loading="lazy" />
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
              )}
              {img.label && (
                <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 pb-2 ${isSelected ? '' : ''}`}>
                  <span className="text-white text-[10px] leading-tight block truncate">{img.label}</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Bottom bar */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t transition-all duration-300 safe-bottom ${canProceed ? 'border-gray-100' : 'border-gray-50'}`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex gap-3 items-center">
          <button onClick={prevStep} className="py-3 px-4 text-gray-400 font-medium text-sm">返回</button>
          <div className="flex-1 text-center text-sm text-gray-400">
            {selectedImages.length > 0 ? `已选 ${selectedImages.length}/9 张` : '请选择照片'}
          </div>
          <button
            onClick={nextStep}
            disabled={!canProceed}
            className={`py-3 px-8 rounded-xl font-bold text-sm transition-all ${
              canProceed
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200 active:scale-95'
                : 'bg-gray-100 text-gray-300'
            }`}
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  )
}
