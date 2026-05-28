import React from 'react'

export default function Complete({ store }) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-200">
        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">🎉 评价已完成！</h1>
      <p className="text-gray-500 mb-8">感谢你的支持，你的评价对我们非常重要</p>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 w-full max-w-sm mb-6 border border-green-100">
        <div className="text-3xl mb-2">🎁</div>
        <h3 className="font-bold text-gray-800 mb-1">领取福利</h3>
        <p className="text-gray-500 text-sm">
          请向店员出示你已发布的评价，领取专属小礼品一份 🍮
        </p>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="w-full max-w-xs bg-gray-100 text-gray-500 py-3 rounded-xl font-medium active:scale-95 transition-transform"
      >
        帮朋友也写一个
      </button>
    </div>
  )
}
