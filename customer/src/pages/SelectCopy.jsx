import React, { useState } from 'react'

export default function SelectCopy({ copies, selectedCopy, setSelectedCopy, nextStep, prevStep }) {
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState('')

  const selectCopy = (c) => {
    setSelectedCopy(c)
    setEditContent(c.content)
    setEditing(false)
  }

  const toggleEdit = () => {
    if (!selectedCopy) return
    if (editing) {
      // Save edits
      setSelectedCopy({ ...selectedCopy, content: editContent })
    }
    setEditing(!editing)
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">选择文案</h2>
        <p className="text-gray-500 text-sm mt-1">选一个喜欢的评价文案，也可自己修改</p>
      </div>

      <div className="space-y-3 mb-24">
        {copies.map(c => {
          const isSelected = selectedCopy?.id === c.id
          return (
            <button
              key={c.id}
              onClick={() => selectCopy(c)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                isSelected
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-100 bg-white active:scale-[0.98]'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  isSelected ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {c.style || '通用'}
                </span>
                {isSelected && <span className="text-purple-500 text-sm font-medium">已选</span>}
              </div>
              <p className={`text-sm leading-relaxed line-clamp-3 ${isSelected ? 'text-gray-800' : 'text-gray-500'}`}>
                {c.content}
              </p>
            </button>
          )
        })}
      </div>

      {/* Edit mode */}
      {selectedCopy && editing && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-end" onClick={() => { setEditing(false); setEditContent(selectedCopy.content) }}>
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-800 mb-3">编辑文案</h3>
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              className="w-full h-48 p-4 border border-gray-200 rounded-xl text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <button onClick={toggleEdit} className="w-full mt-3 py-3 bg-purple-500 text-white rounded-xl font-bold">
              保存修改
            </button>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-bottom">
        <div className="max-w-lg mx-auto px-4 py-3 flex gap-3 items-center">
          <button onClick={prevStep} className="py-3 px-4 text-gray-400 font-medium text-sm">返回</button>
          <div className="flex-1" />
          {selectedCopy && (
            <button onClick={toggleEdit} className="py-3 px-4 text-purple-500 font-medium text-sm">
              {editing ? '取消' : '编辑'}
            </button>
          )}
          <button
            onClick={nextStep}
            disabled={!selectedCopy}
            className={`py-3 px-8 rounded-xl font-bold text-sm transition-all ${
              selectedCopy
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
