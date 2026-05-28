import React, { useState, useEffect } from 'react'
import { isLoggedIn, logout } from './api'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Images from './pages/Images'
import Copies from './pages/Copies'
import QRCode from './pages/QRCode'

const TABS = [
  { key: 'dashboard', label: '📊 仪表盘' },
  { key: 'images', label: '🖼️ 图片' },
  { key: 'copies', label: '✍️ 文案' },
  { key: 'qrcode', label: '📱 二维码' },
]

export default function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn())
  const [activeTab, setActiveTab] = useState('dashboard')
  const [storeName, setStoreName] = useState('')

  const handleLogin = () => setLoggedIn(true)
  const handleLogout = () => { logout(); setLoggedIn(false) }

  if (!loggedIn) return <Login onLogin={handleLogin} />

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-bold text-gray-800">评价素材助手</h1>
          <p className="text-xs text-gray-400">{storeName || '管理后台'}</p>
        </div>
        <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
          退出
        </button>
      </header>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-200 px-2 flex overflow-x-auto sticky top-[57px] z-10">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 max-w-3xl mx-auto">
        {activeTab === 'dashboard' && <Dashboard onStoreNameChange={setStoreName} />}
        {activeTab === 'images' && <Images />}
        {activeTab === 'copies' && <Copies />}
        {activeTab === 'qrcode' && <QRCode />}
      </div>
    </div>
  )
}
