import React, { useState, useEffect } from 'react'
import { fetchStore, logEvent, getStoreId } from './api'
import Landing from './pages/Landing'
import SelectImages from './pages/SelectImages'
import SelectCopy from './pages/SelectCopy'
import Confirm from './pages/Confirm'
import Complete from './pages/Complete'

export default function App() {
  const [step, setStep] = useState(0)
  const [store, setStore] = useState(null)
  const [images, setImages] = useState([])
  const [copies, setCopies] = useState([])
  const [selectedImages, setSelectedImages] = useState([])
  const [selectedCopy, setSelectedCopy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const storeId = getStoreId()

  useEffect(() => {
    fetchStore(storeId)
      .then(data => {
        setStore(data.store)
        setImages(data.images)
        setCopies(data.copies)
        setLoading(false)
        // Log scan
        logEvent(storeId).catch(() => {})
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [storeId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">店铺不存在</h2>
          <p className="text-gray-500 text-sm">请检查二维码是否正确</p>
        </div>
      </div>
    )
  }

  const nextStep = () => setStep(s => Math.min(s + 1, 4))
  const prevStep = () => setStep(s => Math.max(s - 1, 0))

  const pageProps = { store, images, copies, selectedImages, setSelectedImages, selectedCopy, setSelectedCopy, nextStep, prevStep, storeId }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Step indicator */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-1 max-w-xs mx-auto">
          {[0, 1, 2, 3, 4].map(s => (
            <React.Fragment key={s}>
              <div className={`w-2.5 h-2.5 rounded-full transition-colors ${s <= step ? 'bg-purple-500' : 'bg-gray-200'}`} />
              {s < 4 && <div className={`flex-1 h-0.5 transition-colors ${s < step ? 'bg-purple-500' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Page content */}
      <div className="px-4 pb-24">
        {step === 0 && <Landing {...pageProps} />}
        {step === 1 && <SelectImages {...pageProps} />}
        {step === 2 && <SelectCopy {...pageProps} />}
        {step === 3 && <Confirm {...pageProps} />}
        {step === 4 && <Complete {...pageProps} />}
      </div>
    </div>
  )
}
