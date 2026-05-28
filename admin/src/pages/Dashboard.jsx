import React, { useState, useEffect } from 'react'
import { getStore, getStats, updateStore } from '../api'

export default function Dashboard({ onStoreNameChange }) {
  const [store, setStore] = useState(null)
  const [stats, setStats] = useState(null)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDianping, setEditDianping] = useState('')
  const [editMeituan, setEditMeituan] = useState('')

  useEffect(() => {
    getStore().then(data => {
      setStore(data)
      onStoreNameChange(data.name)
      setEditName(data.name)
      setEditDianping(data.dianping_id || '')
      setEditMeituan(data.meituan_id || '')
    })
    getStats().then(setStats)
  }, [])

  const handleSave = async () => {
    await updateStore({ name: editName, dianping_id: editDianping, meituan_id: editMeituan })
    setStore({ ...store, name: editName, dianping_id: editDianping, meituan_id: editMeituan })
    onStoreNameChange(editName)
    setEditing(false)
  }

  if (!store || !stats) return <div className="text-center py-12 text-gray-400">加载中...</div>

  return (
    <div>
      {/* Store info card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-800">店铺信息</h2>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="text-sm text-purple-500">编辑</button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="text-sm text-gray-400">取消</button>
              <button onClick={handleSave} className="text-sm text-green-500 font-medium">保存</button>
            </div>
          )}
        </div>
        {editing ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 font-medium">店铺名称</label>
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">大众点评店铺 ID</label>
              <input type="text" value={editDianping} onChange={e => setEditDianping(e.target.value)} placeholder="例：A123456789"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
              <p className="text-[10px] text-gray-400 mt-1">打开你的大众点评店铺页，URL 中的数字就是 ID</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">美团店铺 ID</label>
              <input type="text" value={editMeituan} onChange={e => setEditMeituan(e.target.value)} placeholder="例：B123456789"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
              <p className="text-[10px] text-gray-400 mt-1">打开你的美团店铺页，URL 中的数字就是 ID</p>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-lg font-bold text-gray-800">{store.name}</p>
            <p className="text-xs text-gray-400 mt-1">ID: {store.id}</p>
            {store.dianping_id && <p className="text-xs text-gray-400 mt-0.5">大众点评: {store.dianping_id}</p>}
            {store.meituan_id && <p className="text-xs text-gray-400 mt-0.5">美团: {store.meituan_id}</p>}
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <div className="text-3xl font-bold text-purple-500">{stats.todayScans}</div>
          <div className="text-sm text-gray-500 mt-1">今日扫码</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <div className="text-3xl font-bold text-green-500">{stats.todayCompletes}</div>
          <div className="text-sm text-gray-500 mt-1">今日完成</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <div className="text-3xl font-bold text-gray-700">{stats.totalScans}</div>
          <div className="text-sm text-gray-500 mt-1">累计扫码</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <div className="text-3xl font-bold text-gray-700">{stats.totalCompletes}</div>
          <div className="text-sm text-gray-500 mt-1">累计完成</div>
        </div>
      </div>

      {/* Trend chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <h3 className="font-bold text-gray-800 mb-4">近 7 天趋势</h3>
        <div className="flex items-end gap-2 h-32">
          {stats.trend.map((day, i) => {
            const max = Math.max(...stats.trend.map(d => d.scans), 1)
            const height = Math.max((day.scans / max) * 100, 5)
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400">{day.scans}</span>
                <div className="w-full flex flex-col items-center gap-0.5" style={{ height: '100px', justifyContent: 'flex-end' }}>
                  <div
                    className="w-full bg-purple-200 rounded-t"
                    style={{ height: `${height}%`, maxHeight: '80px', minHeight: '4px' }}
                  />
                </div>
                <span className="text-xs text-gray-400 mt-1">{day.day.slice(5)}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-purple-50 rounded-2xl p-4">
        <p className="text-sm font-medium text-purple-700">💡 使用提示</p>
        <p className="text-xs text-purple-600 mt-1">顾客扫码后选择图片和文案 → 一键复制到剪贴板 → 去平台发布。你可以在「图片」和「文案」标签页管理素材。</p>
      </div>
    </div>
  )
}
