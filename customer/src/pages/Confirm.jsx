import React, { useState } from 'react'
import { logEvent, getStoreId } from '../api'

export default function Confirm({ store, selectedImages, selectedCopy, nextStep, prevStep, storeId }) {
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
            <img key={img.id} src={img.thumbUrl || img.url} alt="" className="w-full aspect-square object-cover" />
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
          <p className="text-gray-500 text-sm mb-2">文案已复制到剪贴板</p>

          {/* Image download section */}
          <div className="mb-4 mt-2">
            <h3 className="font-bold text-gray-800 text-sm mb-1">🖼️ 保存图片到相册</h3>
            <p className="text-gray-400 text-xs mb-3">点击图片打开原图 → 长按选择「保存到相册」</p>

            <div className="grid grid-cols-2 gap-2">
              {selectedImages.map(img => (
                <a
                  key={img.id}
                  href={img.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative rounded-xl overflow-hidden bg-gray-100 block active:scale-95 transition-transform"
                >
                  <img src={img.thumbUrl || img.url} alt={img.label} className="w-full aspect-square object-cover" loading="lazy" />
                  {img.label && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                      <span className="text-white text-[10px] leading-tight block truncate">{img.label}</span>
                    </div>
                  )}
                  {/* Download badge */}
                  <div className="absolute top-1.5 right-1.5 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow">
                    <svg className="w-3.5 h-3.5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Platform jump buttons */}
          {(store?.dianping_id || store?.meituan_id) && (
            <div className="mb-4">
              <h3 className="font-bold text-gray-800 text-sm mb-2">🚀 一键跳转去写评价</h3>
              <div className="flex gap-2">
                {store?.dianping_id && (
                  <a
                    href={`https://www.dianping.com/shop/${store.dianping_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-yellow-50 border border-yellow-200 rounded-xl text-center active:scale-95 transition-transform"
                  >
                    <span className="text-lg block mb-0.5">⭐</span>
                    <span className="text-xs font-medium text-yellow-700">大众点评</span>
                  </a>
                )}
                {store?.meituan_id && (
                  <a
                    href={`https://www.meituan.com/shop/${store.meituan_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-green-50 border border-green-200 rounded-xl text-center active:scale-95 transition-transform"
                  >
                    <span className="text-lg block mb-0.5">🛵</span>
                    <span className="text-xs font-medium text-green-700">美团</span>
                  </a>
                )}
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-1.5">点击后自动跳转 App（未安装则打开网页）</p>
            </div>
          )}

          {/* Guidance */}
          <div className="bg-purple-50 rounded-2xl p-4 mb-4 text-left">
            <p className="font-bold text-gray-800 text-sm mb-3">📝 发布步骤：</p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-bold text-purple-600 flex-shrink-0">1</span>
                <span>点击上方图片 <strong>下载/保存</strong> 到手机相册</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-bold text-purple-600 flex-shrink-0">2</span>
                <span>点击上方按钮<strong>跳转 App</strong>，进入店铺页</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-bold text-purple-600 flex-shrink-0">3</span>
                <span>点击「写评价」，粘贴文案 + 选图</span>
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
