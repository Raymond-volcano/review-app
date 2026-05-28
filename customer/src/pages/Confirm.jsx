import React, { useState } from 'react'
import { logEvent, getStoreId } from '../api'

export default function Confirm({ selectedImages, selectedCopy, nextStep, prevStep, storeId }) {
  const [copied, setCopied] = useState(false)
  const [copying, setCopying] = useState(false)

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  const handleCopy = async () => {
    if (!selectedCopy || selectedImages.length === 0) return
    setCopying(true)

    try {
      // Copy text to clipboard
      await navigator.clipboard.writeText(selectedCopy.content)
      setCopied(true)

      // Log completion event
      try {
        await logEvent(storeId || getStoreId(), false)
      } catch {}

      setTimeout(() => setCopying(false), 500)
    } catch {
      // Fallback for environments without clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = selectedCopy.content
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setCopying(false)
    }
  }

  const handleComplete = () => {
    try {
      logEvent(storeId || getStoreId(), true).catch(() => {})
    } catch {}
    nextStep()
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-gray-800">预览你的评价</h2>
        <p className="text-gray-500 text-sm mt-1">看看效果，然后一键复制去发布</p>
      </div>

      {/* Preview card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        {/* Images preview */}
        <div className="grid grid-cols-3 gap-0.5">
          {selectedImages.slice(0, 6).map(img => (
            <img key={img.id} src={img.url} alt="" className="w-full aspect-square object-cover" />
          ))}
          {selectedImages.length > 6 && (
            <div className="w-full aspect-square bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
              +{selectedImages.length - 6}
            </div>
          )}
        </div>

        {/* Text preview */}
        <div className="p-4">
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line line-clamp-6">
            {selectedCopy?.content || ''}
          </p>
        </div>
      </div>

      {/* Copy button */}
      {!copied ? (
        <button
          onClick={handleCopy}
          disabled={copying}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-purple-200 active:scale-95 transition-all disabled:opacity-70"
        >
          {copying ? '复制中...' : '📋 一键复制图文'}
        </button>
      ) : (
        <div className="text-center animate-fadeIn">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-green-600 font-bold text-lg mb-2">✅ 复制成功！</p>
          <p className="text-gray-500 text-sm mb-4">文案已复制到剪贴板</p>

          {/* Guidance */}
          <div className="bg-purple-50 rounded-2xl p-4 mb-4 text-left">
            <p className="font-bold text-gray-800 text-sm mb-3">📝 发布步骤：</p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-bold text-purple-600 flex-shrink-0">1</span>
                <span>打开 <strong>大众点评</strong> 或 <strong>美团</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-bold text-purple-600 flex-shrink-0">2</span>
                <span>搜索并进入「美宝月子中心」</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-bold text-purple-600 flex-shrink-0">3</span>
                <span>粘贴文案，选择相册中的图片</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-bold text-purple-600 flex-shrink-0">4</span>
                <span>点击「发布」完成评价 🎉</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleComplete}
            className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-green-200 active:scale-95 transition-all"
          >
            已完成，去领福利 🎁
          </button>
        </div>
      )}
    </div>
  )
}
