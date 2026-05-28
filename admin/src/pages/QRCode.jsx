import React, { useState, useEffect } from 'react'
import { getQRCode } from '../api'

export default function QRCode() {
  const [qr, setQr] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getQRCode().then(data => {
      setQr(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-12 text-gray-400">加载中...</div>

  return (
    <div>
      <h2 className="font-bold text-gray-800 mb-4">二维码管理</h2>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center mb-4">
        {qr && (
          <>
            <div
              className="mx-auto mb-4 w-64 h-64"
              dangerouslySetInnerHTML={{ __html: qr.svg }}
            />
            <p className="text-lg font-bold text-gray-800 mb-1">{qr.storeName}</p>
            <p className="text-xs text-gray-400 mb-4 break-all">扫码地址：{qr.url}</p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  const blob = new Blob([qr.svg], { type: 'image/svg+xml' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `${qr.storeName}-二维码.svg`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                className="px-6 py-3 bg-purple-500 text-white rounded-xl font-medium text-sm shadow-lg shadow-purple-200"
              >
                下载 SVG
              </button>
              <button
                onClick={() => {
                  // Create a canvas to convert SVG to PNG
                  const canvas = document.createElement('canvas')
                  canvas.width = 800
                  canvas.height = 800
                  const ctx = canvas.getContext('2d')
                  const img = new Image()
                  const svgBlob = new Blob([qr.svg], { type: 'image/svg+xml;charset=utf-8' })
                  const url = URL.createObjectURL(svgBlob)
                  img.onload = () => {
                    ctx.fillStyle = '#ffffff'
                    ctx.fillRect(0, 0, canvas.width, canvas.height)
                    ctx.drawImage(img, 50, 50, 700, 700)
                    const pngUrl = canvas.toDataURL('image/png')
                    const a = document.createElement('a')
                    a.href = pngUrl
                    a.download = `${qr.storeName}-二维码.png`
                    a.click()
                    URL.revokeObjectURL(url)
                  }
                  img.src = url
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm"
              >
                下载 PNG
              </button>
            </div>
          </>
        )}
      </div>

      <div className="bg-yellow-50 rounded-2xl p-4">
        <p className="text-sm font-medium text-yellow-700">🪧 制作立牌提示</p>
        <p className="text-xs text-yellow-600 mt-1">
          下载二维码后，可以：<br />
          ① 发到淘宝店定制亚克力立牌（搜索"二维码立牌 定制"）<br />
          ② 打印成桌贴，贴在收银台或餐桌上<br />
          ③ 推荐尺寸：A5（148×210mm）或 15×15cm 方形<br />
          ④ 立牌上建议加文字："扫码写好评，送小甜品 🍮"
        </p>
      </div>
    </div>
  )
}
