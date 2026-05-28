import React, { useState } from 'react'
import { login } from '../api'

export default function Login({ onLogin }) {
  const [storeId, setStoreId] = useState('demo001')
  const [password, setPassword] = useState('123456')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(storeId, password)
      onLogin()
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg">
            ⭐
          </div>
          <h1 className="text-2xl font-bold text-gray-800">管理后台</h1>
          <p className="text-gray-500 text-sm mt-1">评价素材助手</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">店铺 ID</label>
            <input
              type="text"
              value={storeId}
              onChange={e => setStoreId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="输入店铺 ID"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="输入密码"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-200 active:scale-95 transition-all disabled:opacity-70"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          演示账号：demo001 / 123456
        </p>
      </div>
    </div>
  )
}
