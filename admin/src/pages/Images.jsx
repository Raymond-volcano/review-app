import React, { useState, useEffect, useRef } from 'react'
import { getImages, uploadImage, deleteImage, sortImages } from '../api'

export default function Images() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  const load = () => {
    setLoading(true)
    getImages().then(data => {
      setImages(data)
      setLoading(false)
    })
  }

  useEffect(load, [])

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 20 * 1024 * 1024) {
      alert('图片不能超过 20MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('请选择图片格式的文件')
      return
    }

    setUploading(true)
    try {
      await uploadImage(file, '')
      load()
    } catch (err) {
      alert('上传失败')
    }
    setUploading(false)
    e.target.value = ''
  }

  const handleDelete = async (id) => {
    if (!confirm('确定删除这张图片？')) return
    await deleteImage(id)
    load()
  }

  const handleMove = async (id, direction) => {
    const idx = images.findIndex(i => i.id === id)
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === images.length - 1) return

    const newList = [...images]
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    ;[newList[idx], newList[swapIdx]] = [newList[swapIdx], newList[idx]]

    await sortImages(newList.map(i => i.id))
    setImages(newList)
  }

  if (loading) return <div className="text-center py-12 text-gray-400">加载中...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-800">图片管理（{images.length} 张）</h2>
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          <button
            onClick={() => fileRef.current.click()}
            disabled={uploading}
            className="px-4 py-2 bg-purple-500 text-white text-sm rounded-xl font-medium disabled:opacity-70"
          >
            {uploading ? '上传中...' : '+ 上传图片'}
          </button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">📸</div>
          <p>还没有图片，点击上方按钮上传</p>
          <p className="text-xs mt-2">建议上传 6-12 张高清精美的店铺实拍照片</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {images.map((img, idx) => (
            <div key={img.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="aspect-square relative group">
                <img src={img.thumbUrl || img.url} alt={img.label} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => handleDelete(img.id)} className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">✕</button>
                </div>
              </div>
              <div className="p-2 flex items-center justify-between">
                <span className="text-xs text-gray-500 truncate flex-1">{img.label || '无标签'}</span>
                <div className="flex gap-1">
                  <button onClick={() => handleMove(img.id, 'up')} disabled={idx === 0} className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs disabled:opacity-30">↑</button>
                  <button onClick={() => handleMove(img.id, 'down')} disabled={idx === images.length - 1} className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs disabled:opacity-30">↓</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
