import { isAdmin } from '@/lib/auth/admin'
import { redirect } from 'next/navigation'
import { AiManagementClient } from './AiManagementClient'

export default async function AdminAiPage() {
  const adminCheck = await isAdmin()
  
  if (!adminCheck) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 p-5">
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="text-gray-600 hover:text-gray-900 text-xl">←</a>
          <div>
            <h1 className="text-xl font-bold text-gray-900">🤖 AI Manager</h1>
            <p className="text-sm text-gray-600">Base de connaissances & Indexation</p>
          </div>
        </div>
      </div>

      <div className="p-5 max-w-4xl mx-auto">
        <AiManagementClient />
      </div>
    </div>
  )
}
