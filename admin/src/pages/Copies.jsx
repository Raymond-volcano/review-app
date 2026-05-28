import React, { useState, useEffect } from 'react'
import { getCopies, addCopy, updateCopy, deleteCopy } from '../api'

export default function Copies() {
  const [copies, setCopies] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null | 'new' | id
  const [editContent, setEditContent] = useState('')
  const [editStyle, setEditStyle] = useState('')

  const load = () => {
    setLoading(true)
    getCopies().then(data => {
      setCopies(data)
      setLoading(false)
    })
  }

  useEffect(load, [])

  const handleNew = () => {
    setEditing('new')
    setEditContent('')
    setEditStyle('')
  }

  const handleEdit = (c) => {
    setEditing(c.id)
    setEditContent(c.content)
    setEditStyle(c.style || '')
  }

  const handleSave = async () => {
    if (!editContent.trim()) return alert('请输入文案内容')
    if (editing === 'new') {
      await addCopy(editContent, editStyle)
    } else {
      await updateCopy(editing, editContent, editStyle)
    }
    setEditing(null)
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('确定删除这条文案？')) return
    await deleteCopy(id)
    load()
  }

  if (loading) return <div className="text-center py-12 text-gray-400">加载中...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-800">文案管理（{copies.length} 条）</h2>
        <button onClick={handleNew} className="px-4 py-2 bg-purple-500 text-white text-sm rounded-xl font-medium">+ 新增文案</button>
      </div>

      {/* Edit/new form */}
      {editing && (
        <div className="bg-white rounded-2xl border border-purple-200 shadow-sm p-4 mb-4">
          <div className="mb-3">
            <label className="text-xs font-medium text-gray-500 block mb-1">风格标签</label>
            <input
              type="text"
              value={editStyle}
              onChange={e => setEditStyle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="如：尊贵体验、小红书风格、专业推荐"
            />
          </div>
          <div className="mb-3">
            <label className="text-xs font-medium text-gray-500 block mb-1">文案内容</label>
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              className="w-full h-40 px-3 py-2 border border-gray-200 rounded-lg text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl">取消</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm text-white bg-purple-500 rounded-xl font-medium">保存</button>
          </div>
        </div>
      )}

      {/* Copy list */}
      {copies.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">✍️</div>
          <p>还没有文案，点击上方按钮新增</p>
          <p className="text-xs mt-2">建议准备 3-5 条不同风格的文案模板</p>
        </div>
      ) : (
        <div className="space-y-3">
          {copies.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              {editing === c.id ? null : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 font-medium">
                      {c.style || '通用'}
                    </span>
                    <div className="flex-1" />
                    <button onClick={() => handleEdit(c)} className="text-xs text-gray-400 hover:text-purple-500">编辑</button>
                    <button onClick={() => handleDelete(c.id)} className="text-xs text-gray-400 hover:text-red-500">删除</button>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line line-clamp-4">{c.content}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
