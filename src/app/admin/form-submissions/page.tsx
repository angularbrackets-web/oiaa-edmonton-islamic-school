'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import toast from 'react-hot-toast'
import {
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface FormSubmission {
  id: string
  form_name: string
  data: Record<string, any>
  email?: string
  name?: string
  phone?: string
  status: 'new' | 'reviewed' | 'resolved'
  email_sent: boolean
  created_at: string
}

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-800',
  reviewed: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800'
}

const STATUS_ICONS = {
  new: ClockIcon,
  reviewed: EyeIcon,
  resolved: CheckCircleIcon
}

export default function AdminFormSubmissionsPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [filterForm, setFilterForm] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [viewingSubmission, setViewingSubmission] = useState<FormSubmission | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formNames, setFormNames] = useState<string[]>([])

  useEffect(() => {
    loadSubmissions()
  }, [filterForm, filterStatus])

  const loadSubmissions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterForm) params.append('form_name', filterForm)
      if (filterStatus) params.append('status', filterStatus)

      const response = await fetch(`/api/form-submissions?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setSubmissions(data.data || [])

        // Extract unique form names
        const names = [...new Set((data.data || []).map((s: FormSubmission) => s.form_name))]
        setFormNames(names as string[])
      } else {
        toast.error('Failed to load submissions')
      }
    } catch (error) {
      console.error('Error loading submissions:', error)
      toast.error('Error loading submissions')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: 'new' | 'reviewed' | 'resolved') => {
    const toastId = toast.loading('Updating status...')

    try {
      const response = await fetch(`/api/form-submissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        setSubmissions(submissions.map(s =>
          s.id === id ? { ...s, status } : s
        ))
        toast.success(`Status updated to ${status}`, { id: toastId })
      } else {
        toast.error('Failed to update status', { id: toastId })
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Error updating status', { id: toastId })
    }
  }

  const deleteSubmission = async (id: string) => {
    const toastId = toast.loading('Deleting submission...')

    try {
      const response = await fetch(`/api/form-submissions/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSubmissions(submissions.filter(s => s.id !== id))
        toast.success('Submission deleted', { id: toastId })
        setDeleteConfirm(null)
      } else {
        toast.error('Failed to delete submission', { id: toastId })
      }
    } catch (error) {
      console.error('Error deleting submission:', error)
      toast.error('Error deleting submission', { id: toastId })
    }
  }

  const exportToCSV = () => {
    if (submissions.length === 0) {
      toast.error('No submissions to export')
      return
    }

    // Get all unique field keys
    const allKeys = new Set<string>()
    submissions.forEach(s => {
      Object.keys(s.data).forEach(key => allKeys.add(key))
    })

    // Create CSV header
    const headers = ['Date', 'Form', 'Status', 'Name', 'Email', 'Phone', ...Array.from(allKeys)]
    const rows = submissions.map(s => {
      const row = [
        new Date(s.created_at).toLocaleString(),
        s.form_name,
        s.status,
        s.name || '',
        s.email || '',
        s.phone || '',
        ...Array.from(allKeys).map(key => String(s.data[key] || ''))
      ]
      return row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
    })

    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `form-submissions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)

    toast.success('Exported to CSV')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta-red mx-auto mb-4"></div>
            <p className="text-gray-600">Loading submissions...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-deep-teal mb-2">
              Form Submissions
            </h1>
            <p className="text-gray-600">
              {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
              {filterForm && ` for "${filterForm}"`}
              {filterStatus && ` (${filterStatus})`}
            </p>
          </div>
          <button
            onClick={exportToCSV}
            disabled={submissions.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-deep-teal text-white rounded-lg hover:bg-deep-teal-dark transition-colors disabled:opacity-50"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Filters:</span>
            </div>

            <select
              value={filterForm}
              onChange={(e) => setFilterForm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-deep-teal focus:border-transparent"
            >
              <option value="">All Forms</option>
              {formNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-deep-teal focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
            </select>

            {(filterForm || filterStatus) && (
              <button
                onClick={() => { setFilterForm(''); setFilterStatus('') }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {submissions.length === 0 ? (
            <div className="p-8 text-center">
              <EnvelopeIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No form submissions yet</p>
              {(filterForm || filterStatus) && (
                <button
                  onClick={() => { setFilterForm(''); setFilterStatus('') }}
                  className="mt-4 text-deep-teal hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Form</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {submissions.map((submission) => {
                    const StatusIcon = STATUS_ICONS[submission.status]
                    return (
                      <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(submission.created_at)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-deep-teal">
                            {submission.form_name}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            {submission.name && (
                              <div className="flex items-center gap-1 text-sm text-gray-900">
                                <UserIcon className="w-4 h-4 text-gray-400" />
                                {submission.name}
                              </div>
                            )}
                            {submission.email && (
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                                <a href={`mailto:${submission.email}`} className="hover:text-deep-teal">
                                  {submission.email}
                                </a>
                              </div>
                            )}
                            {submission.phone && (
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <PhoneIcon className="w-4 h-4 text-gray-400" />
                                <a href={`tel:${submission.phone}`} className="hover:text-deep-teal">
                                  {submission.phone}
                                </a>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <select
                            value={submission.status}
                            onChange={(e) => updateStatus(submission.id, e.target.value as any)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${STATUS_COLORS[submission.status]}`}
                          >
                            <option value="new">New</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setViewingSubmission(submission)}
                              className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                              title="View details"
                            >
                              <EyeIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(submission.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {viewingSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-deep-teal">Submission Details</h2>
              <button
                onClick={() => setViewingSubmission(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Meta info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 pb-4 border-b border-gray-200">
                <div>
                  <span className="font-semibold">Form:</span> {viewingSubmission.form_name}
                </div>
                <div>
                  <span className="font-semibold">Date:</span> {new Date(viewingSubmission.created_at).toLocaleString()}
                </div>
                <div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[viewingSubmission.status]}`}>
                    {viewingSubmission.status}
                  </span>
                </div>
              </div>

              {/* Contact info */}
              {(viewingSubmission.name || viewingSubmission.email || viewingSubmission.phone) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    {viewingSubmission.name && (
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-gray-400" />
                        <span>{viewingSubmission.name}</span>
                      </div>
                    )}
                    {viewingSubmission.email && (
                      <div className="flex items-center gap-2">
                        <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                        <a href={`mailto:${viewingSubmission.email}`} className="text-deep-teal hover:underline">
                          {viewingSubmission.email}
                        </a>
                      </div>
                    )}
                    {viewingSubmission.phone && (
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-5 h-5 text-gray-400" />
                        <a href={`tel:${viewingSubmission.phone}`} className="text-deep-teal hover:underline">
                          {viewingSubmission.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Form data */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Form Data</h3>
                <div className="space-y-3">
                  {Object.entries(viewingSubmission.data).map(([key, value]) => (
                    <div key={key} className="border-b border-gray-100 pb-2">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                        {key.replace(/_/g, ' ')}
                      </div>
                      <div className="text-gray-900 whitespace-pre-wrap">
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end p-4 border-t border-gray-200">
              <button
                onClick={() => setViewingSubmission(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <a
                href={`mailto:${viewingSubmission.email}`}
                className="px-4 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors"
              >
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-deep-teal mb-4">Delete Submission?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this submission? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteSubmission(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
