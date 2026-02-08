'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  projectName: string;
  creatorName: string;
  culture: string;
  format: string;
  genre: string;
  estimatedBudget: string;
  status: string;
  submitted_at: string;
  officialEmail?: string;
  [key: string]: any;
}

interface Notification {
  id: string;
  projectId: string;
  projectName: string;
  oldStatus: string;
  newStatus: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface EditAccessRequest {
  id: string;
  projectId: string;
  projectName: string;
  creatorEmail: string;
  reason: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'denied';
  respondedAt?: string;
  adminMessage?: string;
}

export default function MyProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [previousStatuses, setPreviousStatuses] = useState<Record<string, string>>({});
  const [editAccessRequests, setEditAccessRequests] = useState<EditAccessRequest[]>([]);
  const [showRequestModal, setShowRequestModal] = useState<Project | null>(null);
  const [requestReason, setRequestReason] = useState('');
  const [grantedEditAccess, setGrantedEditAccess] = useState<string[]>([]);

  // Load projects and check for status changes
  useEffect(() => {
    // Load submitted projects from localStorage
    const submissions = JSON.parse(localStorage.getItem('stage_submissions') || '[]');
    const savedNotifications = JSON.parse(localStorage.getItem('stage_notifications') || '[]');
    const savedPreviousStatuses = JSON.parse(localStorage.getItem('stage_previous_statuses') || '{}');
    const savedEditRequests = JSON.parse(localStorage.getItem('stage_edit_requests') || '[]');
    const savedGrantedAccess = JSON.parse(localStorage.getItem('stage_edit_access_granted') || '[]');

    setNotifications(savedNotifications);
    setPreviousStatuses(savedPreviousStatuses);
    setEditAccessRequests(savedEditRequests);
    setGrantedEditAccess(savedGrantedAccess);

    // Check for status changes
    const newNotifications: Notification[] = [];
    const updatedStatuses: Record<string, string> = { ...savedPreviousStatuses };

    submissions.forEach((project: Project) => {
      const previousStatus = savedPreviousStatuses[project.id];

      // If we have a previous status and it's different from current
      if (previousStatus && previousStatus !== project.status) {
        const notification: Notification = {
          id: `notif_${Date.now()}_${project.id}`,
          projectId: project.id,
          projectName: project.projectName || 'Untitled Project',
          oldStatus: previousStatus,
          newStatus: project.status,
          message: getStatusChangeMessage(previousStatus, project.status, project.projectName),
          timestamp: new Date().toISOString(),
          read: false,
        };
        newNotifications.push(notification);
      }

      // Update the tracked status
      updatedStatuses[project.id] = project.status;
    });

    // Save updated statuses
    localStorage.setItem('stage_previous_statuses', JSON.stringify(updatedStatuses));
    setPreviousStatuses(updatedStatuses);

    // Add new notifications
    if (newNotifications.length > 0) {
      const allNotifications = [...newNotifications, ...savedNotifications];
      localStorage.setItem('stage_notifications', JSON.stringify(allNotifications));
      setNotifications(allNotifications);
    }

    setProjects(submissions);
    setLoading(false);
  }, []);

  // Get status change message
  const getStatusChangeMessage = (oldStatus: string, newStatus: string, projectName: string) => {
    const statusMessages: Record<string, string> = {
      'approved': `🎉 Congratulations! Your project "${projectName}" has been APPROVED by STAGE!`,
      'in-production': `🎬 Exciting news! Your project "${projectName}" is now IN PRODUCTION!`,
      'rejected': `Your project "${projectName}" was not selected at this time.`,
      'under-review': `Your project "${projectName}" is now under review by our team.`,
      'revision-requested': `📝 Revisions requested for "${projectName}". Please update and resubmit.`,
      'on-hold': `Your project "${projectName}" has been put on hold.`,
    };
    return statusMessages[newStatus] || `Status updated for "${projectName}": ${newStatus}`;
  };

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    const updated = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('stage_notifications', JSON.stringify(updated));
  };

  // Mark all as read
  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('stage_notifications', JSON.stringify(updated));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem('stage_notifications', JSON.stringify([]));
  };

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleEdit = (project: Project) => {
    // Save project to draft for editing
    const draftData = {
      ...project,
      _lastSaved: new Date().toISOString(),
      _started: true,
      _editingProjectId: project.id,
    };
    localStorage.setItem('stage_creator_draft', JSON.stringify(draftData));
    router.push('/creator');
  };

  const handleDelete = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      localStorage.setItem('stage_submissions', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
      setSelectedProject(null);
    }
  };

  const formatBudget = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (!num || isNaN(num)) return '₹0';
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'in-production': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'in_review':
      case 'under-review': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'revision-requested': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'on-hold': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return '✓ Approved';
      case 'in-production': return '🎬 In Production';
      case 'rejected': return '✗ Rejected';
      case 'in_review':
      case 'under-review': return '⏳ In Review';
      case 'revision-requested': return '📝 Revision Requested';
      case 'on-hold': return '⏸️ On Hold';
      default: return '📋 Pending Review';
    }
  };

  // Check if project is locked (approved or in-production) and no edit access granted
  const isProjectLocked = (projectId: string, status: string) => {
    const hasEditAccess = grantedEditAccess.includes(projectId);
    return (status === 'approved' || status === 'in-production') && !hasEditAccess;
  };

  // Check if edit access request is pending for a project
  const hasPendingRequest = (projectId: string) => {
    return editAccessRequests.some(r => r.projectId === projectId && r.status === 'pending');
  };

  // Check if edit access was denied
  const wasRequestDenied = (projectId: string) => {
    const request = editAccessRequests.find(r => r.projectId === projectId);
    return request?.status === 'denied';
  };

  // Submit edit access request
  const submitEditAccessRequest = (project: Project) => {
    if (!requestReason.trim()) {
      alert('Please provide a reason for requesting edit access.');
      return;
    }

    const request: EditAccessRequest = {
      id: `edit_req_${Date.now()}_${project.id}`,
      projectId: project.id,
      projectName: project.projectName || 'Untitled Project',
      creatorEmail: project.officialEmail || '',
      reason: requestReason,
      requestedAt: new Date().toISOString(),
      status: 'pending',
    };

    // Save to localStorage
    const existingRequests = JSON.parse(localStorage.getItem('stage_edit_requests') || '[]');
    // Remove any previous request for this project
    const filteredRequests = existingRequests.filter((r: EditAccessRequest) => r.projectId !== project.id);
    const updatedRequests = [request, ...filteredRequests];
    localStorage.setItem('stage_edit_requests', JSON.stringify(updatedRequests));
    setEditAccessRequests(updatedRequests);

    // Add notification for creator
    const notification: Notification = {
      id: `notif_${Date.now()}`,
      projectId: project.id,
      projectName: project.projectName || 'Untitled Project',
      oldStatus: 'locked',
      newStatus: 'request_sent',
      message: `📝 Edit access request sent for "${project.projectName}". Waiting for admin approval.`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    const existingNotifications = JSON.parse(localStorage.getItem('stage_notifications') || '[]');
    localStorage.setItem('stage_notifications', JSON.stringify([notification, ...existingNotifications]));
    setNotifications([notification, ...notifications]);

    setShowRequestModal(null);
    setRequestReason('');
    alert(`✅ Edit Access Request Submitted!\n\nYour request for "${project.projectName}" has been sent to the admin team.\n\nYou'll be notified when they respond.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-red-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-600/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 pt-8 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image
              src="/images/stage-logo-official.png"
              alt="STAGE OTT"
              width={200}
              height={60}
              className="h-14 w-auto"
            />
          </Link>
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
            >
              <span className="text-xl">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            <Link
              href="/creator?new=true"
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
            >
              + New Project
            </Link>
            <Link
              href="/welcome"
              className="px-6 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-all"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">My Projects</h1>
          <p className="text-gray-400 font-semibold">View, edit, and manage your submitted projects</p>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📂</div>
            <h2 className="text-2xl font-black text-white mb-2">No Projects Yet</h2>
            <p className="text-gray-400 font-semibold mb-6">You haven't submitted any projects yet.</p>
            <Link
              href="/creator"
              className="inline-block px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              Submit Your First Project
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Projects List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="text-sm font-bold text-gray-400 mb-2">
                {projects.length} Project{projects.length > 1 ? 's' : ''} Submitted
              </div>
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`bg-white/5 backdrop-blur-xl border rounded-xl p-4 cursor-pointer transition-all hover:bg-white/10 ${
                    selectedProject?.id === project.id ? 'border-red-500 bg-white/10' : 'border-white/10'
                  } ${isProjectLocked(project.id, project.status) ? 'ring-2 ring-purple-500/30' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {isProjectLocked(project.id, project.status) && (
                        <span className="text-purple-400" title="View Only - Editing Locked">🔒</span>
                      )}
                      <h3 className="text-lg font-black text-white truncate">
                        {project.projectName || 'Untitled Project'}
                      </h3>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ml-2 flex-shrink-0 ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Culture:</span>
                      <span className="text-white font-semibold">{project.culture || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="text-white font-semibold">{project.format || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Budget:</span>
                      <span className="text-red-400 font-bold">{formatBudget(project.estimatedBudget)}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-500">
                    Submitted: {project.submitted_at ? new Date(project.submitted_at).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              ))}
            </div>

            {/* Project Details */}
            <div className="lg:col-span-2">
              {selectedProject ? (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  {/* Locked Banner */}
                  {isProjectLocked(selectedProject.id, selectedProject.status) && (
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-500/30 rounded-full flex items-center justify-center">
                          <span className="text-2xl">🔒</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-black text-lg">Project Locked - View Only Mode</h4>
                          <p className="text-purple-200 text-sm font-semibold">
                            This project has been {selectedProject.status === 'approved' ? 'approved' : 'moved to production'} by STAGE.
                            Editing is disabled to maintain agreement integrity.
                          </p>
                        </div>
                        <div className={`px-4 py-2 rounded-full font-bold text-sm ${getStatusColor(selectedProject.status)}`}>
                          {getStatusLabel(selectedProject.status)}
                        </div>
                      </div>

                      {/* Request Edit Access Section */}
                      <div className="mt-4 pt-4 border-t border-purple-500/30">
                        {hasPendingRequest(selectedProject.id) ? (
                          <div className="flex items-center gap-3 bg-amber-500/20 border border-amber-500/50 rounded-lg p-3">
                            <span className="text-xl">⏳</span>
                            <div className="flex-1">
                              <p className="text-amber-300 font-bold text-sm">Edit Access Request Pending</p>
                              <p className="text-amber-200/70 text-xs">Waiting for admin approval...</p>
                            </div>
                          </div>
                        ) : wasRequestDenied(selectedProject.id) ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex-1 mr-3">
                              <span className="text-xl">❌</span>
                              <div>
                                <p className="text-red-300 font-bold text-sm">Edit Access Request Denied</p>
                                <p className="text-red-200/70 text-xs">
                                  {editAccessRequests.find(r => r.projectId === selectedProject.id)?.adminMessage || 'Contact admin for more details'}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setShowRequestModal(selectedProject)}
                              className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold rounded-lg transition-all text-sm"
                            >
                              Request Again
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <p className="text-purple-200/70 text-sm">
                              Need to make changes? Request edit access from admin.
                            </p>
                            <button
                              onClick={() => setShowRequestModal(selectedProject)}
                              className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                            >
                              <span>✏️</span>
                              <span>Request Edit Access</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Edit Access Granted Banner */}
                  {grantedEditAccess.includes(selectedProject.id) && (selectedProject.status === 'approved' || selectedProject.status === 'in-production') && (
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-xl p-4 mb-6 flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500/30 rounded-full flex items-center justify-center">
                        <span className="text-2xl">✅</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-black text-lg">Edit Access Granted!</h4>
                        <p className="text-green-200 text-sm font-semibold">
                          Admin has granted you temporary edit access. Make your changes and resubmit.
                        </p>
                      </div>
                      <div className="px-4 py-2 bg-green-500/30 rounded-full font-bold text-sm text-green-300">
                        Can Edit
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-start justify-between mb-6 pb-6 border-b border-white/10">
                    <div>
                      <h2 className="text-3xl font-black text-white mb-1">
                        {selectedProject.projectName || 'Untitled Project'}
                      </h2>
                      <p className="text-gray-400">
                        {selectedProject.format} • {selectedProject.culture} • {selectedProject.genre}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {isProjectLocked(selectedProject.id, selectedProject.status) ? (
                        <div className="px-4 py-2 bg-gray-500/20 text-gray-400 font-bold rounded-lg flex items-center gap-2 cursor-not-allowed">
                          🔒 View Only
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(selectedProject)}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all flex items-center gap-2"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(selectedProject.id)}
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold rounded-lg transition-all"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="space-y-6">
                    {/* Project Info */}
                    <div>
                      <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                        🎬 Project Information
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <DetailItem label="Project Name" value={selectedProject.projectName} />
                        <DetailItem label="Production Company" value={selectedProject.productionCompany} />
                        <DetailItem label="Culture" value={selectedProject.culture} />
                        <DetailItem label="Format" value={selectedProject.format} />
                        <DetailItem label="Genre" value={selectedProject.genre} />
                        <DetailItem label="Sub-Genre" value={selectedProject.subGenre} />
                        <DetailItem label="Content Rating" value={selectedProject.contentRating} />
                        <DetailItem label="Total Budget" value={formatBudget(selectedProject.estimatedBudget)} highlight />
                        <DetailItem label="Duration" value={selectedProject.totalDuration ? `${selectedProject.totalDuration} mins` : 'N/A'} />
                        <DetailItem label="Shoot Days" value={selectedProject.shootDays} />
                        <DetailItem label="Shoot Start" value={selectedProject.shootStartDate} />
                        <DetailItem label="Shoot End" value={selectedProject.shootEndDate} />
                      </div>
                    </div>

                    {/* Creator Info */}
                    <div>
                      <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                        👤 Creator Information
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <DetailItem label="Creator Name" value={selectedProject.creatorName} />
                        <DetailItem label="Email" value={selectedProject.officialEmail} />
                        <DetailItem label="Phone" value={selectedProject.phone} />
                        <DetailItem label="PAN Number" value={selectedProject.panNumber} />
                        <DetailItem label="GST Number" value={selectedProject.gstNumber} />
                        <DetailItem label="Experience" value={selectedProject.yearsOfExperience ? `${selectedProject.yearsOfExperience} years` : 'N/A'} />
                      </div>
                    </div>

                    {/* Key Crew */}
                    <div>
                      <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                        🎥 Key Crew
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <DetailItem label="Director" value={selectedProject.director} />
                        <DetailItem label="DOP" value={selectedProject.dop} />
                        <DetailItem label="Editor" value={selectedProject.editor} />
                        <DetailItem label="Music Composer" value={selectedProject.musicComposer} />
                        <DetailItem label="Sound Designer" value={selectedProject.soundDesigner} />
                        <DetailItem label="Production Designer" value={selectedProject.productionDesigner} />
                        <DetailItem label="Costume Designer" value={selectedProject.costumeDesigner} />
                        <DetailItem label="VFX Supervisor" value={selectedProject.vfxSupervisor} />
                      </div>
                    </div>

                    {/* Cast */}
                    {selectedProject.castData && (
                      <div>
                        <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                          ⭐ Cast
                        </h3>
                        <div className="space-y-2">
                          {selectedProject.castData.primaryCast?.map((cast: any, idx: number) => (
                            <div key={idx} className="bg-white/5 rounded-lg p-3 flex justify-between">
                              <span className="text-white font-semibold">{cast.artistName}</span>
                              <span className="text-gray-400">as {cast.characterName}</span>
                            </div>
                          ))}
                          {(!selectedProject.castData.primaryCast || selectedProject.castData.primaryCast.length === 0) && (
                            <p className="text-gray-500 text-sm">No cast added</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Technical Specs */}
                    {selectedProject.technicalSpecs && (
                      <div>
                        <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                          📹 Technical Specifications
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <DetailItem label="Camera Model" value={selectedProject.technicalSpecs.cameraModel} />
                          <DetailItem label="Camera Setup" value={selectedProject.technicalSpecs.cameraSetupType} />
                        </div>
                      </div>
                    )}

                    {/* Timeline */}
                    {selectedProject.contentTimeline && (
                      <div>
                        <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                          📅 Timeline
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <DetailItem label="Pre-Production" value={selectedProject.contentTimeline.preProductionDuration} />
                          <DetailItem label="Post-Production" value={selectedProject.contentTimeline.postProductionDuration} />
                          <DetailItem label="Final Delivery" value={selectedProject.contentTimeline.finalDeliveryDate} />
                        </div>
                      </div>
                    )}

                    {/* Status Update History & Activity Log */}
                    <div>
                      <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                        📋 Activity Log & Admin Comments
                      </h3>
                      <div className="space-y-3">
                        {/* Current Status */}
                        <div className={`rounded-xl p-4 border-2 ${
                          selectedProject.status === 'approved' ? 'bg-green-500/10 border-green-500/50' :
                          selectedProject.status === 'in-production' ? 'bg-purple-500/10 border-purple-500/50' :
                          selectedProject.status === 'rejected' ? 'bg-red-500/10 border-red-500/50' :
                          selectedProject.status === 'revision-requested' ? 'bg-orange-500/10 border-orange-500/50' :
                          'bg-blue-500/10 border-blue-500/50'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              selectedProject.status === 'approved' ? 'bg-green-500/30' :
                              selectedProject.status === 'in-production' ? 'bg-purple-500/30' :
                              selectedProject.status === 'rejected' ? 'bg-red-500/30' :
                              selectedProject.status === 'revision-requested' ? 'bg-orange-500/30' :
                              'bg-blue-500/30'
                            }`}>
                              <span className="text-lg">
                                {selectedProject.status === 'approved' ? '✅' :
                                 selectedProject.status === 'in-production' ? '🎬' :
                                 selectedProject.status === 'rejected' ? '❌' :
                                 selectedProject.status === 'revision-requested' ? '📝' :
                                 selectedProject.status === 'under-review' ? '⏳' :
                                 '📋'}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-black">Current Status: {getStatusLabel(selectedProject.status)}</div>
                              <div className="text-gray-400 text-sm">Last updated</div>
                            </div>
                          </div>
                          {/* Show last admin comment if exists */}
                          {selectedProject.lastAdminComment && (
                            <div className="mt-3 pt-3 border-t border-white/10">
                              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <span className="text-blue-400">💬</span>
                                  <div>
                                    <div className="text-xs text-blue-400 font-bold mb-1">Admin Comment:</div>
                                    <div className="text-white text-sm font-semibold">{selectedProject.lastAdminComment}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Status History from Notifications */}
                        {notifications
                          .filter(n => n.projectId === selectedProject.id)
                          .slice(0, 10)
                          .map((notif: any, idx) => (
                            <div key={notif.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                              <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  notif.newStatus === 'approved' ? 'bg-green-500/20' :
                                  notif.newStatus === 'in-production' ? 'bg-purple-500/20' :
                                  notif.newStatus === 'rejected' ? 'bg-red-500/20' :
                                  notif.newStatus === 'revision-requested' ? 'bg-orange-500/20' :
                                  notif.newStatus === 'edit_granted' ? 'bg-green-500/20' :
                                  notif.newStatus === 'edit_denied' ? 'bg-red-500/20' :
                                  'bg-blue-500/20'
                                }`}>
                                  <span className="text-lg">
                                    {notif.newStatus === 'approved' ? '✅' :
                                     notif.newStatus === 'in-production' ? '🎬' :
                                     notif.newStatus === 'rejected' ? '❌' :
                                     notif.newStatus === 'revision-requested' ? '📝' :
                                     notif.newStatus === 'edit_granted' ? '✏️' :
                                     notif.newStatus === 'edit_denied' ? '🚫' :
                                     notif.newStatus === 'request_sent' ? '📤' :
                                     '📋'}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="text-white font-semibold">
                                    {notif.message.split('\n\n')[0]}
                                  </div>
                                  {/* Show admin comment if present */}
                                  {notif.adminComment && (
                                    <div className="mt-2 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                      <div className="flex items-start gap-2">
                                        <span className="text-blue-400 text-sm">💬</span>
                                        <div>
                                          <div className="text-xs text-blue-400 font-bold mb-1">Admin Comment:</div>
                                          <div className="text-white text-sm">{notif.adminComment}</div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  <div className="text-gray-500 text-xs mt-2">
                                    {new Date(notif.timestamp).toLocaleString('en-IN')}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                        {/* Submission Date */}
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-500/20 rounded-full flex items-center justify-center">
                              <span className="text-lg">📤</span>
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-semibold">Project Submitted</div>
                              <div className="text-gray-500 text-xs mt-1">
                                {selectedProject.submitted_at
                                  ? new Date(selectedProject.submitted_at).toLocaleString('en-IN')
                                  : 'Date not available'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
                  <div className="text-6xl mb-4">👈</div>
                  <h3 className="text-xl font-black text-white mb-2">Select a Project</h3>
                  <p className="text-gray-400">Click on a project to view details and edit</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Request Edit Access Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-white/10">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">✏️</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Request Edit Access</h3>
                  <p className="text-purple-200 text-sm font-semibold">{showRequestModal.projectName}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <p className="text-amber-200 text-sm font-semibold">
                    This project has been {showRequestModal.status === 'approved' ? 'approved' : 'moved to production'} by STAGE.
                    Editing requires admin approval to maintain agreement integrity.
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-white font-bold mb-2">
                  Reason for Edit Request <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  placeholder="Please explain what changes you need to make and why..."
                  rows={4}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all resize-none"
                />
                <p className="text-gray-500 text-xs mt-2">
                  Provide a clear reason to help admin approve your request faster.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRequestModal(null);
                    setRequestReason('');
                  }}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => submitEditAccessRequest(showRequestModal)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-black rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Slide Panel */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNotifications(false)}
          ></div>

          {/* Panel */}
          <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 h-full overflow-y-auto border-l border-white/10 shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-red-500 to-pink-600 p-6 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🔔</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Notifications</h3>
                    <p className="text-red-200 text-sm font-semibold">
                      {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                >
                  <span className="text-xl">✕</span>
                </button>
              </div>
              {/* Action Buttons */}
              {notifications.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="flex-1 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-bold rounded-lg transition-all"
                    >
                      ✓ Mark all read
                    </button>
                  )}
                  <button
                    onClick={clearAllNotifications}
                    className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 text-sm font-bold rounded-lg transition-all"
                  >
                    🗑️ Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="p-4">
              {notifications.length === 0 ? (
                <div className="text-center py-16">
                  <span className="text-6xl">🔕</span>
                  <p className="text-gray-400 mt-4 font-bold text-lg">No notifications yet</p>
                  <p className="text-gray-500 text-sm mt-2">You'll be notified when your project status changes</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-4 rounded-xl cursor-pointer transition-all border ${
                        !notif.read
                          ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          notif.newStatus === 'approved' ? 'bg-green-500/20' :
                          notif.newStatus === 'in-production' ? 'bg-purple-500/20' :
                          notif.newStatus === 'rejected' ? 'bg-red-500/20' :
                          notif.newStatus === 'revision-requested' ? 'bg-orange-500/20' :
                          notif.newStatus === 'edit_granted' ? 'bg-green-500/20' :
                          notif.newStatus === 'edit_denied' ? 'bg-red-500/20' :
                          notif.newStatus === 'edit_revoked' ? 'bg-orange-500/20' :
                          'bg-blue-500/20'
                        }`}>
                          <span className="text-2xl">
                            {notif.newStatus === 'approved' ? '✅' :
                             notif.newStatus === 'in-production' ? '🎬' :
                             notif.newStatus === 'rejected' ? '❌' :
                             notif.newStatus === 'revision-requested' ? '📝' :
                             notif.newStatus === 'edit_granted' ? '✏️' :
                             notif.newStatus === 'edit_denied' ? '🚫' :
                             notif.newStatus === 'edit_revoked' ? '🔒' :
                             notif.newStatus === 'request_sent' ? '📤' :
                             '📋'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold leading-relaxed ${!notif.read ? 'text-white' : 'text-gray-300'}`}>
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notif.timestamp).toLocaleString('en-IN')}
                          </p>
                        </div>
                        {!notif.read && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value, highlight = false }: { label: string; value: any; highlight?: boolean }) {
  return (
    <div className="bg-white/5 rounded-lg p-3">
      <div className="text-xs font-bold text-gray-500 mb-1">{label}</div>
      <div className={`text-sm font-semibold ${highlight ? 'text-red-400' : 'text-white'}`}>
        {value || 'Not provided'}
      </div>
    </div>
  );
}
