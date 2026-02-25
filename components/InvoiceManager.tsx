'use client';

import { useState, useEffect } from 'react';

interface Invoice {
  id: string;
  project_id: string;
  creator_id: string;
  tranche_number: number;
  tranche_name?: string;
  amount: number;
  gst_amount: number;
  total_amount: number;
  status: string;
  invoice_number?: string;
  invoice_date?: string;
  due_date?: string;
  invoice_file_url?: string;
  notes?: string;
  milestone?: string;
  submitted_at?: string;
  approved_at?: string;
  paid_at?: string;
  payment_reference?: string;
  rejection_reason?: string;
  created_at: string;
  project?: {
    id: string;
    title: string;
    format: string;
    total_budget: number;
  };
  creator?: {
    id: string;
    full_name: string;
    email: string;
  };
}

const STATUS_INFO: { [key: string]: { label: string; color: string; bgColor: string } } = {
  pending: { label: 'Pending', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  submitted: { label: 'Submitted', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  under_review: { label: 'Under Review', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  approved: { label: 'Approved', color: 'text-green-600', bgColor: 'bg-green-100' },
  rejected: { label: 'Rejected', color: 'text-red-600', bgColor: 'bg-red-100' },
  paid: { label: 'Paid', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
};

export default function InvoiceManager() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [paymentRef, setPaymentRef] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showLogInvoiceModal, setShowLogInvoiceModal] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [logForm, setLogForm] = useState({
    project_id: '',
    tranche_number: 1,
    invoice_number: '',
    amount: '',
    notes: '',
  });

  useEffect(() => {
    fetchInvoices();
    fetchLockedProjects();
  }, [filterStatus]);

  const fetchLockedProjects = async () => {
    try {
      const response = await fetch('/api/projects?status=locked');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (e) {
      console.error('Failed to fetch projects');
    }
  };

  const fetchInvoices = async () => {
    try {
      const url = filterStatus === 'all'
        ? '/api/invoices'
        : `/api/invoices?status=${filterStatus}`;
      const response = await fetch(url);
      const data = await response.json();
      setInvoices(data.invoices || []);
    } catch (e) {
      console.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string, invoiceId: string, extraData?: any) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extraData }),
      });

      if (!response.ok) throw new Error('Action failed');

      setSelectedInvoice(null);
      setPaymentRef('');
      setRejectionReason('');
      fetchInvoices();
    } catch (e) {
      alert('Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const logInvoiceFromEmail = async () => {
    if (!logForm.project_id || !logForm.amount) {
      alert('Please select project and enter amount');
      return;
    }

    setActionLoading(true);
    try {
      const selectedProject = projects.find(p => p.id === logForm.project_id);
      const amount = parseFloat(logForm.amount);
      const gstAmount = amount * 0.18;
      const totalAmount = amount + gstAmount;

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: logForm.project_id,
          creator_id: selectedProject?.assigned_creator_id,
          tranche_number: logForm.tranche_number,
          tranche_name: `Tranche ${logForm.tranche_number}`,
          amount: amount,
          gst_amount: gstAmount,
          total_amount: totalAmount,
          invoice_number: logForm.invoice_number,
          notes: logForm.notes + ' (Received via Email)',
          status: 'submitted',
          submitted_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to log invoice');

      setShowLogInvoiceModal(false);
      setLogForm({ project_id: '', tranche_number: 1, invoice_number: '', amount: '', notes: '' });
      fetchInvoices();
      alert('Invoice logged successfully!');
    } catch (e) {
      alert('Failed to log invoice');
    } finally {
      setActionLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusInfo = (status: string) => {
    return STATUS_INFO[status] || STATUS_INFO.pending;
  };

  // Stats
  const stats = {
    total: invoices.length,
    pending: invoices.filter(i => ['submitted', 'under_review'].includes(i.status)).length,
    approved: invoices.filter(i => i.status === 'approved').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    totalAmount: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total_amount, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-3xl font-black text-gray-800">{stats.total}</div>
          <div className="text-sm font-medium text-gray-500">Total Invoices</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-3xl font-black text-amber-600">{stats.pending}</div>
          <div className="text-sm font-medium text-gray-500">Pending Review</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-3xl font-black text-green-600">{stats.approved}</div>
          <div className="text-sm font-medium text-gray-500">Approved</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-3xl font-black text-emerald-600">{stats.paid}</div>
          <div className="text-sm font-medium text-gray-500">Paid</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-2xl font-black text-purple-600">{formatAmount(stats.totalAmount)}</div>
          <div className="text-sm font-medium text-gray-500">Total Paid</div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {['all', 'submitted', 'under_review', 'approved', 'paid', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : getStatusInfo(status).label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowLogInvoiceModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Log Invoice (Email)
        </button>
      </div>

      {/* Invoices List */}
      {invoices.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📄</span>
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-1">No invoices found</h3>
          <p className="text-gray-500">Invoices will appear here when creators submit them</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
            <div className="col-span-3">Project / Creator</div>
            <div className="col-span-2">Tranche</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Submitted</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-gray-100">
            {invoices.map((invoice) => {
              const statusInfo = getStatusInfo(invoice.status);
              return (
                <div
                  key={invoice.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 items-center"
                >
                  <div className="col-span-3">
                    <div className="font-semibold text-gray-800">{invoice.project?.title || 'Unknown Project'}</div>
                    <div className="text-sm text-gray-500">{invoice.creator?.full_name || 'Unknown Creator'}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="font-medium text-gray-800">Tranche {invoice.tranche_number}</div>
                    <div className="text-sm text-gray-500">{invoice.tranche_name || invoice.milestone}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="font-bold text-gray-800">{formatAmount(invoice.total_amount)}</div>
                    <div className="text-xs text-gray-500">incl. GST ₹{invoice.gst_amount?.toLocaleString()}</div>
                  </div>
                  <div className="col-span-2 text-sm text-gray-500">
                    {invoice.submitted_at ? formatDate(invoice.submitted_at) : '-'}
                  </div>
                  <div className="col-span-1">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusInfo.bgColor} ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedInvoice(invoice)}
                      className="px-3 py-1.5 bg-purple-100 text-purple-700 font-medium rounded-lg text-sm hover:bg-purple-200"
                    >
                      View
                    </button>
                    {invoice.status === 'submitted' && (
                      <button
                        onClick={() => handleAction('approve', invoice.id)}
                        className="px-3 py-1.5 bg-green-100 text-green-700 font-medium rounded-lg text-sm hover:bg-green-200"
                      >
                        Approve
                      </button>
                    )}
                    {invoice.status === 'approved' && (
                      <button
                        onClick={() => setSelectedInvoice(invoice)}
                        className="px-3 py-1.5 bg-emerald-100 text-emerald-700 font-medium rounded-lg text-sm hover:bg-emerald-200"
                      >
                        Mark Paid
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedInvoice(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Invoice Details</h2>
                  <p className="text-green-100">Tranche {selectedInvoice.tranche_number}</p>
                </div>
                <button onClick={() => setSelectedInvoice(null)} className="text-white/80 hover:text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500">Project</div>
                  <div className="font-bold text-gray-800">{selectedInvoice.project?.title}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500">Creator</div>
                  <div className="font-bold text-gray-800">{selectedInvoice.creator?.full_name}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500">Base Amount</div>
                  <div className="font-bold text-blue-600">{formatAmount(selectedInvoice.amount)}</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500">GST (18%)</div>
                  <div className="font-bold text-amber-600">{formatAmount(selectedInvoice.gst_amount)}</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500">Total</div>
                  <div className="font-bold text-green-600">{formatAmount(selectedInvoice.total_amount)}</div>
                </div>
              </div>

              <div className={`rounded-xl p-4 ${getStatusInfo(selectedInvoice.status).bgColor}`}>
                <div className="text-sm text-gray-500">Status</div>
                <div className={`font-bold ${getStatusInfo(selectedInvoice.status).color}`}>
                  {getStatusInfo(selectedInvoice.status).label}
                </div>
              </div>

              {selectedInvoice.invoice_number && (
                <div>
                  <div className="text-sm text-gray-500">Invoice Number</div>
                  <div className="font-mono font-bold">{selectedInvoice.invoice_number}</div>
                </div>
              )}

              {selectedInvoice.invoice_file_url && (
                <a
                  href={selectedInvoice.invoice_file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-blue-100 text-blue-700 font-bold rounded-xl text-center hover:bg-blue-200"
                >
                  View Invoice PDF
                </a>
              )}

              {/* Actions based on status */}
              {selectedInvoice.status === 'submitted' && (
                <div className="space-y-3 pt-4 border-t">
                  <button
                    onClick={() => handleAction('approve', selectedInvoice.id)}
                    disabled={actionLoading}
                    className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Approve Invoice'}
                  </button>
                  <div>
                    <input
                      type="text"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Rejection reason..."
                      className="w-full px-4 py-2 border rounded-xl mb-2"
                    />
                    <button
                      onClick={() => handleAction('reject', selectedInvoice.id, { rejection_reason: rejectionReason })}
                      disabled={actionLoading}
                      className="w-full py-3 bg-red-100 text-red-700 font-bold rounded-xl hover:bg-red-200 disabled:opacity-50"
                    >
                      Reject Invoice
                    </button>
                  </div>
                </div>
              )}

              {selectedInvoice.status === 'approved' && (
                <div className="space-y-3 pt-4 border-t">
                  <input
                    type="text"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    placeholder="Payment reference / UTR number"
                    className="w-full px-4 py-3 border rounded-xl"
                  />
                  <button
                    onClick={() => handleAction('mark_paid', selectedInvoice.id, { payment_reference: paymentRef })}
                    disabled={actionLoading}
                    className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Mark as Paid'}
                  </button>
                </div>
              )}

              {selectedInvoice.status === 'paid' && selectedInvoice.payment_reference && (
                <div className="bg-emerald-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500">Payment Reference</div>
                  <div className="font-mono font-bold text-emerald-700">{selectedInvoice.payment_reference}</div>
                  <div className="text-xs text-gray-500 mt-1">Paid on {formatDate(selectedInvoice.paid_at!)}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Log Invoice from Email Modal */}
      {showLogInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLogInvoiceModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Log Invoice from Email</h2>
                  <p className="text-orange-100 text-sm">Creator ne email pe invoice bheja</p>
                </div>
                <button onClick={() => setShowLogInvoiceModal(false)} className="text-white/80 hover:text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              {/* Select Project */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project (Locked Only)</label>
                <select
                  value={logForm.project_id}
                  onChange={(e) => setLogForm({ ...logForm, project_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-orange-500 outline-none"
                >
                  <option value="">-- Select Project --</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.title} - {project.creator?.full_name || 'No Creator'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tranche Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tranche Number</label>
                <select
                  value={logForm.tranche_number}
                  onChange={(e) => setLogForm({ ...logForm, tranche_number: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-orange-500 outline-none"
                >
                  <option value={1}>Tranche 1 - Signing</option>
                  <option value={2}>Tranche 2 - Pre-Production</option>
                  <option value={3}>Tranche 3 - Production</option>
                  <option value={4}>Tranche 4 - Post-Production</option>
                  <option value={5}>Tranche 5 - Final Delivery</option>
                </select>
              </div>

              {/* Invoice Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number (from email)</label>
                <input
                  type="text"
                  value={logForm.invoice_number}
                  onChange={(e) => setLogForm({ ...logForm, invoice_number: e.target.value })}
                  placeholder="e.g., INV-2024-001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-orange-500 outline-none"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Amount (before GST)</label>
                <input
                  type="number"
                  value={logForm.amount}
                  onChange={(e) => setLogForm({ ...logForm, amount: e.target.value })}
                  placeholder="500000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-orange-500 outline-none"
                />
                {logForm.amount && (
                  <div className="mt-2 text-sm text-gray-500">
                    GST (18%): {formatAmount(parseFloat(logForm.amount) * 0.18)} |
                    Total: <strong className="text-green-600">{formatAmount(parseFloat(logForm.amount) * 1.18)}</strong>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={logForm.notes}
                  onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
                  rows={2}
                  placeholder="Any notes about this invoice..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-orange-500 outline-none resize-none"
                />
              </div>

              {/* Submit */}
              <button
                onClick={logInvoiceFromEmail}
                disabled={actionLoading || !logForm.project_id || !logForm.amount}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl transition-all disabled:opacity-50"
              >
                {actionLoading ? 'Logging...' : 'Log Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
