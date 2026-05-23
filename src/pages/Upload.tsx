import { useState, useRef } from 'react'
import { Upload as UploadIcon, Camera, Mail, FileText, CheckCircle2, Loader2, X } from 'lucide-react'
import clsx from 'clsx'

type UploadMode = 'file' | 'camera' | 'email'

export default function Upload() {
  const [mode, setMode] = useState<UploadMode>('file')
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    setFile(f)
    setStatus('idle')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleProcess = () => {
    setStatus('processing')
    setTimeout(() => setStatus('done'), 2500)
  }

  const tabs: { id: UploadMode; label: string; icon: typeof UploadIcon }[] = [
    { id: 'file', label: 'Upload File', icon: UploadIcon },
    { id: 'camera', label: 'Take Photo', icon: Camera },
    { id: 'email', label: 'From Email', icon: Mail },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Bill</h1>
        <p className="text-gray-500 text-sm mt-1">Scan or upload a receipt to extract its data automatically.</p>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setMode(id); setFile(null); setStatus('idle') }}
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all',
              mode === id
                ? 'bg-white shadow-sm text-violet-700'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Upload area */}
      {mode === 'file' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={clsx(
            'border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors',
            dragging ? 'border-violet-500 bg-violet-50' : 'border-gray-200 bg-gray-50 hover:border-violet-400 hover:bg-violet-50/40'
          )}
        >
          <div className="w-14 h-14 bg-violet-100 rounded-full flex items-center justify-center mb-4">
            <UploadIcon size={24} className="text-violet-600" />
          </div>
          <p className="font-medium text-gray-700 mb-1">Drop your receipt here</p>
          <p className="text-sm text-gray-400">or click to browse — JPG, PNG, PDF supported</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      )}

      {mode === 'camera' && (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-gray-50">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Camera size={24} className="text-blue-600" />
          </div>
          <p className="font-medium text-gray-700 mb-1">Capture with camera</p>
          <p className="text-sm text-gray-400 mb-4">Works great on mobile — your camera will open</p>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            id="camera-input"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <label
            htmlFor="camera-input"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg cursor-pointer transition-colors"
          >
            Open Camera
          </label>
        </div>
      )}

      {mode === 'email' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
            <Mail size={16} className="mt-0.5 shrink-0" />
            <p>Forward your e-receipts to <span className="font-mono font-semibold">receipts@receipttrack.app</span> and they'll appear here automatically.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Or paste email content</label>
            <textarea
              rows={6}
              placeholder="Paste the email body of your receipt here..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />
          </div>
          <button
            onClick={handleProcess}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            Extract Data from Email
          </button>
        </div>
      )}

      {/* Selected file preview */}
      {file && mode !== 'email' && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
              <FileText size={18} className="text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button onClick={() => { setFile(null); setStatus('idle') }} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Process button */}
      {file && mode !== 'email' && status !== 'done' && (
        <button
          onClick={handleProcess}
          disabled={status === 'processing'}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-70 text-white text-sm font-medium py-3 rounded-xl transition-colors"
        >
          {status === 'processing' ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Extracting data with AI...
            </>
          ) : (
            <>
              <UploadIcon size={16} />
              Process Receipt
            </>
          )}
        </button>
      )}

      {/* Success state */}
      {status === 'done' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
          <CheckCircle2 size={32} className="text-green-500 mx-auto mb-3" />
          <p className="font-semibold text-green-800 mb-1">Bill processed successfully!</p>
          <p className="text-sm text-green-600 mb-4">14 items extracted · Tax: $7.12 · Total: $87.43</p>
          <div className="flex gap-3 justify-center">
            <a href="/bills" className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
              View Bill
            </a>
            <button
              onClick={() => { setFile(null); setStatus('idle') }}
              className="border border-green-300 text-green-700 hover:bg-green-100 text-sm font-medium px-5 py-2 rounded-lg transition-colors"
            >
              Upload Another
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
