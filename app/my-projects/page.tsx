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
  const [expandedNotification, setExpandedNotification] = useState<string | null>(null);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [previousStatuses, setPreviousStatuses] = useState<Record<string, string>>({});
  const [editAccessRequests, setEditAccessRequests] = useState<EditAccessRequest[]>([]);
  const [showRequestModal, setShowRequestModal] = useState<Project | null>(null);
  const [requestReason, setRequestReason] = useState('');
  const [grantedEditAccess, setGrantedEditAccess] = useState<string[]>([]);

  // Demo projects to pre-populate if localStorage is empty
  const demoProjects = [
    {
      id: 'demo-gujarati-garba-queen',
      projectName: 'Gujarati Garba Queen',
      creatorName: 'Falguni Pathak Productions',
      productionCompany: 'Navratri Films Pvt Ltd',
      culture: 'Gujarati',
      format: 'Binge Series',
      genre: 'Musical Drama',
      subGenre: 'Romance',
      contentRating: 'U/A 13+',
      estimatedBudget: 120000000,
      totalDuration: '400',
      episodes: 10,
      shootDays: '90',
      shootStartDate: '2026-04-15',
      shootEndDate: '2026-07-15',
      status: 'approved',
      submitted_at: '2026-02-15T10:30:00.000Z',
      // KYC Details
      officialEmail: 'falguni@navratrifilms.com',
      phone: '+91 98765 43210',
      panNumber: 'BQZPP4521A',
      gstNumber: '24BQZPP4521A1ZW',
      bankName: 'HDFC Bank',
      accountNumber: '50100123456789',
      ifscCode: 'HDFC0001234',
      yearsOfExperience: '25',
      // Full Crew
      director: 'Jignesh Patel',
      dop: 'Chirantan Das',
      editor: 'Shreya Mehta',
      musicComposer: 'Sachin-Jigar',
      soundDesigner: 'Kunal Sharma',
      productionDesigner: 'Pooja Shetty',
      costumeDesigner: 'Manish Malhotra',
      vfxSupervisor: 'RedChillies VFX',
      // Cast Data
      castData: {
        primaryCast: [
          { artistName: 'Rashami Desai', characterName: 'Radha - Lead Protagonist', fee: 15000000 },
          { artistName: 'Paras Kalnawat', characterName: 'Karan - Male Lead', fee: 8000000 },
          { artistName: 'Rupal Patel', characterName: 'Maa - Supporting', fee: 5000000 },
          { artistName: 'Jamnadas Majethia', characterName: 'Papa - Supporting', fee: 5000000 },
        ],
        supportingCast: [
          { artistName: 'Aashika Bhatia', characterName: 'Meera - Best Friend' },
          { artistName: 'Helly Shah', characterName: 'Rival - Antagonist' },
        ]
      },
      // Budget Categories
      budgetCategories: [
        {
          id: 'prod',
          name: 'Production',
          amount: 25000000,
          items: [
            { name: 'Location & Sets', amount: 10000000 },
            { name: 'Equipment Rental', amount: 8000000 },
            { name: 'Travel & Logistics', amount: 7000000 },
          ]
        },
        {
          id: 'crew',
          name: 'Crew & Technicians',
          amount: 18000000,
          items: [
            { name: 'Director Fee', amount: 5000000 },
            { name: 'DOP Fee', amount: 3000000 },
            { name: 'Technical Crew', amount: 10000000 },
          ]
        },
        {
          id: 'post',
          name: 'Post Production',
          amount: 15000000,
          items: [
            { name: 'Editing', amount: 4000000 },
            { name: 'VFX & Graphics', amount: 8000000 },
            { name: 'Color Grading', amount: 3000000 },
          ]
        },
        {
          id: 'music',
          name: 'Music & Sound',
          amount: 12000000,
          items: [
            { name: 'Music Composition', amount: 6000000 },
            { name: 'Sound Design', amount: 3000000 },
            { name: 'Playback Singers', amount: 3000000 },
          ]
        },
        {
          id: 'marketing',
          name: 'Marketing',
          amount: 10000000,
          items: [
            { name: 'Digital Marketing', amount: 5000000 },
            { name: 'PR & Events', amount: 3000000 },
            { name: 'Promotions', amount: 2000000 },
          ]
        },
        {
          id: 'misc',
          name: 'Miscellaneous',
          amount: 7000000,
          items: [
            { name: 'Insurance', amount: 3000000 },
            { name: 'Contingency', amount: 4000000 },
          ]
        },
      ],
      budgetCelebrityFees: [
        { name: 'Rashami Desai (Lead Actress)', amount: 15000000 },
        { name: 'Sachin-Jigar (Music Directors)', amount: 8000000 },
        { name: 'Paras Kalnawat (Male Lead)', amount: 8000000 },
        { name: 'Supporting Cast', amount: 10000000 },
        { name: 'Cameo Appearances', amount: 3000000 },
      ],
      // Cash Flow Tranches
      cashFlowTranches: [
        { name: 'Tranche 1 - Signing', percentage: 25, amount: 30000000, status: 'paid', gst: 5400000, tds: 3000000, netAmount: 31800000, paidDate: '2026-02-20' },
        { name: 'Tranche 2 - Pre-Production', percentage: 25, amount: 30000000, status: 'paid', gst: 5400000, tds: 3000000, netAmount: 31800000, paidDate: '2026-03-15' },
        { name: 'Tranche 3 - Production', percentage: 40, amount: 48000000, status: 'pending', gst: 8640000, tds: 4800000, netAmount: 50880000 },
        { name: 'Tranche 4 - Delivery', percentage: 10, amount: 12000000, status: 'pending', gst: 2160000, tds: 1200000, netAmount: 12720000 },
      ],
      // Technical Specs
      technicalSpecs: {
        cameraModel: 'ARRI Alexa Mini LF',
        cameraSetupType: 'Multi-Camera (4K)',
        aspectRatio: '16:9',
        resolution: '4K HDR',
        audioFormat: 'Dolby Atmos 7.1',
      },
      // Timeline
      contentTimeline: {
        preProductionDuration: '8 weeks',
        productionDuration: '12 weeks',
        postProductionDuration: '10 weeks',
        finalDeliveryDate: '2026-10-01',
      },
      // Activity Log
      activityLog: [
        { id: 'act1', action: 'Project Submitted', description: 'Initial submission for review', type: 'submit', user: 'Falguni Pathak Productions', source: 'creator', date: '15 Feb 2026', time: '10:30 AM', timestamp: '2026-02-15T10:30:00.000Z' },
        { id: 'act2', action: 'Assigned for Review', description: 'Assigned to Mayank for initial review', type: 'assign', user: 'System', source: 'admin', date: '16 Feb 2026', time: '09:00 AM', timestamp: '2026-02-16T09:00:00.000Z' },
        { id: 'act3', action: 'Documents Verified', description: 'All KYC documents verified', type: 'status', user: 'Mayank', source: 'admin', date: '18 Feb 2026', time: '02:30 PM', timestamp: '2026-02-18T14:30:00.000Z' },
        { id: 'act4', action: 'Budget Approved', description: 'Budget breakdown approved by finance team', type: 'status', user: 'Finance Team', source: 'admin', date: '20 Feb 2026', time: '11:00 AM', timestamp: '2026-02-20T11:00:00.000Z' },
        { id: 'act5', action: 'Project Approved', description: 'Project greenlit for production', type: 'status', user: 'Haidar', source: 'admin', date: '22 Feb 2026', time: '04:00 PM', timestamp: '2026-02-22T16:00:00.000Z' },
      ],
      lastAdminComment: 'Excellent project! All documentation complete. Approved for production. Tranche 1 & 2 released.',
    },
    {
      id: 'demo-marathi-mulgi',
      projectName: 'Marathi Mulgi',
      creatorName: 'Marathi Manoos Productions',
      productionCompany: 'Sahyadri Films',
      culture: 'Marathi',
      format: 'Feature Film',
      genre: 'Social Drama',
      subGenre: 'Women Empowerment',
      contentRating: 'U/A 16+',
      estimatedBudget: 85000000,
      totalDuration: '150',
      episodes: null,
      shootDays: '60',
      shootStartDate: '2026-05-01',
      shootEndDate: '2026-07-01',
      status: 'in-production',
      submitted_at: '2026-02-10T14:00:00.000Z',
      // KYC Details
      officialEmail: 'production@sahyadrifilms.com',
      phone: '+91 98765 12345',
      panNumber: 'CYZPM9876B',
      gstNumber: '27CYZPM9876B1ZX',
      bankName: 'Bank of Maharashtra',
      accountNumber: '60200098765432',
      ifscCode: 'MAHB0001234',
      yearsOfExperience: '18',
      // Full Crew
      director: 'Nagraj Manjule',
      dop: 'Sudhakar Reddy Yakkanti',
      editor: 'Sanjay Shrimali',
      musicComposer: 'Ajay-Atul',
      soundDesigner: 'Ganesh Gangadharan',
      productionDesigner: 'Nitin Desai',
      costumeDesigner: 'Sachin Lovalekar',
      vfxSupervisor: 'Prasad Sutar VFX',
      choreographer: 'Ganesh Acharya',
      lineProducer: 'Rajesh Mapuskar',
      executiveProducer: 'Zee Studios',
      // Cast Data
      castData: {
        primaryCast: [
          { artistName: 'Rinku Rajguru', characterName: 'Archana - Lead Protagonist', fee: 12000000 },
          { artistName: 'Akash Thosar', characterName: 'Vikram - Male Lead', fee: 8000000 },
          { artistName: 'Sachin Pilgaonkar', characterName: 'Father', fee: 6000000 },
          { artistName: 'Supriya Pilgaonkar', characterName: 'Mother', fee: 5000000 },
        ],
        supportingCast: [
          { artistName: 'Siddharth Jadhav', characterName: 'Comic Relief' },
          { artistName: 'Amruta Khanvilkar', characterName: 'Elder Sister' },
          { artistName: 'Chinmay Mandlekar', characterName: 'Villain' },
        ]
      },
      // Budget Categories
      budgetCategories: [
        {
          id: 'prod',
          name: 'Production',
          amount: 18000000,
          items: [
            { name: 'Location Permits', amount: 5000000 },
            { name: 'Set Construction', amount: 8000000 },
            { name: 'Equipment', amount: 5000000 },
          ]
        },
        {
          id: 'talent',
          name: 'Talent',
          amount: 31000000,
          items: [
            { name: 'Lead Cast', amount: 20000000 },
            { name: 'Supporting Cast', amount: 8000000 },
            { name: 'Extras', amount: 3000000 },
          ]
        },
        {
          id: 'crew',
          name: 'Crew',
          amount: 12000000,
          items: [
            { name: 'Director', amount: 4000000 },
            { name: 'DOP & Camera', amount: 3000000 },
            { name: 'Other Crew', amount: 5000000 },
          ]
        },
        {
          id: 'post',
          name: 'Post Production',
          amount: 10000000,
          items: [
            { name: 'Editing', amount: 3000000 },
            { name: 'VFX', amount: 4000000 },
            { name: 'DI & Color', amount: 3000000 },
          ]
        },
        {
          id: 'music',
          name: 'Music',
          amount: 8000000,
          items: [
            { name: 'Ajay-Atul Composition', amount: 5000000 },
            { name: 'Playback & Recording', amount: 3000000 },
          ]
        },
        {
          id: 'misc',
          name: 'Miscellaneous',
          amount: 6000000,
          items: [
            { name: 'Insurance', amount: 2000000 },
            { name: 'Contingency', amount: 4000000 },
          ]
        },
      ],
      budgetCelebrityFees: [
        { name: 'Rinku Rajguru (Lead)', amount: 12000000 },
        { name: 'Ajay-Atul (Music)', amount: 5000000 },
        { name: 'Akash Thosar (Male Lead)', amount: 8000000 },
        { name: 'Senior Artists', amount: 11000000 },
      ],
      // Cash Flow Tranches
      cashFlowTranches: [
        { name: 'Tranche 1 - Signing', percentage: 30, amount: 25500000, status: 'paid', gst: 4590000, tds: 2550000, netAmount: 27030000, paidDate: '2026-02-15' },
        { name: 'Tranche 2 - Start of Production', percentage: 30, amount: 25500000, status: 'paid', gst: 4590000, tds: 2550000, netAmount: 27030000, paidDate: '2026-05-01' },
        { name: 'Tranche 3 - Mid Production', percentage: 25, amount: 21250000, status: 'processing', gst: 3825000, tds: 2125000, netAmount: 22525000 },
        { name: 'Tranche 4 - Final Delivery', percentage: 15, amount: 12750000, status: 'pending', gst: 2295000, tds: 1275000, netAmount: 13515000 },
      ],
      // Technical Specs
      technicalSpecs: {
        cameraModel: 'RED Komodo 6K',
        cameraSetupType: 'Single Camera (6K)',
        aspectRatio: '2.39:1 Cinemascope',
        resolution: '6K',
        audioFormat: 'Dolby 5.1',
      },
      // Timeline
      contentTimeline: {
        preProductionDuration: '6 weeks',
        productionDuration: '8 weeks',
        postProductionDuration: '8 weeks',
        finalDeliveryDate: '2026-09-15',
      },
      // Activity Log
      activityLog: [
        { id: 'act1', action: 'Project Submitted', description: 'Initial submission', type: 'submit', user: 'Marathi Manoos Productions', source: 'creator', date: '10 Feb 2026', time: '02:00 PM', timestamp: '2026-02-10T14:00:00.000Z' },
        { id: 'act2', action: 'Under Review', description: 'Assigned to review team', type: 'assign', user: 'System', source: 'admin', date: '11 Feb 2026', time: '10:00 AM', timestamp: '2026-02-11T10:00:00.000Z' },
        { id: 'act3', action: 'Script Approved', description: 'Script cleared by content team', type: 'status', user: 'Sumeet', source: 'admin', date: '13 Feb 2026', time: '03:00 PM', timestamp: '2026-02-13T15:00:00.000Z' },
        { id: 'act4', action: 'Project Approved', description: 'Project approved for production', type: 'status', user: 'Haidar', source: 'admin', date: '15 Feb 2026', time: '11:00 AM', timestamp: '2026-02-15T11:00:00.000Z' },
        { id: 'act5', action: 'Agreement Signed', description: 'Legal agreement executed', type: 'status', user: 'Legal Team', source: 'admin', date: '18 Feb 2026', time: '04:00 PM', timestamp: '2026-02-18T16:00:00.000Z' },
        { id: 'act6', action: 'Production Started', description: 'Shoot commenced in Pune', type: 'status', user: 'Production Team', source: 'admin', date: '01 May 2026', time: '09:00 AM', timestamp: '2026-05-01T09:00:00.000Z' },
        { id: 'act7', action: 'Tranche 3 Requested', description: 'Mid-production payment requested', type: 'status', user: 'Finance', source: 'creator', date: '25 Jun 2026', time: '02:00 PM', timestamp: '2026-06-25T14:00:00.000Z' },
      ],
      lastAdminComment: 'Production going well. 60% shoot completed. Tranche 3 processing. Dailies looking excellent!',
    },
  ];

  // Load projects and check for status changes
  useEffect(() => {
    // Load submitted projects from localStorage - initialize with demo data if empty
    let submissions = JSON.parse(localStorage.getItem('stage_submissions') || '[]');

    // If no projects exist, initialize with demo projects
    if (submissions.length === 0) {
      localStorage.setItem('stage_submissions', JSON.stringify(demoProjects));
      submissions = demoProjects;

      // Also initialize activity logs for demo projects
      const activityLogs: Record<string, any[]> = {};
      demoProjects.forEach(project => {
        if (project.activityLog) {
          activityLogs[project.id] = project.activityLog;
        }
      });
      localStorage.setItem('stage_activity_logs', JSON.stringify(activityLogs));
    }
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
      case 'agreement-signed': return 'bg-teal-100 text-teal-800 border-teal-300';
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
      case 'agreement-signed': return '📄 Agreement Signed';
      case 'in-production': return '🎬 In Production';
      case 'rejected': return '✗ Rejected';
      case 'in_review':
      case 'under-review': return '⏳ In Review';
      case 'revision-requested': return '📝 Revision Requested';
      case 'on-hold': return '⏸️ On Hold';
      default: return '📋 Pending Review';
    }
  };

  // Check if project is locked (approved, agreement-signed or in-production) and no edit access granted
  const isProjectLocked = (projectId: string, status: string) => {
    const hasEditAccess = grantedEditAccess.includes(projectId);
    const lockedStatuses = ['approved', 'agreement-signed', 'in-production'];
    return lockedStatuses.includes(status) && !hasEditAccess;
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

                    {/* Full Activity Log from localStorage */}
                    <div>
                      <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                        📋 Complete Activity Timeline
                        <span className="text-xs bg-blue-500/30 text-blue-400 px-2 py-1 rounded-full">Live</span>
                      </h3>
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {(() => {
                          // Get activity logs from localStorage
                          const allLogs = typeof window !== 'undefined'
                            ? JSON.parse(localStorage.getItem('stage_activity_logs') || '{}')
                            : {};
                          const projectLogs = allLogs[selectedProject.id] || [];

                          // Also include change history
                          const changeHistoryLogs = (selectedProject.changeHistory || []).map((change: any) => ({
                            id: change.id,
                            action: change.changedBy === 'creator' ? 'Project Updated' : 'Admin Update',
                            description: change.summary,
                            type: 'edit',
                            user: change.changedBy === 'creator' ? (selectedProject.creatorName || 'Creator') : 'Admin',
                            source: change.changedBy,
                            date: new Date(change.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                            time: new Date(change.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
                            timestamp: change.timestamp,
                            changes: change.changes,
                          }));

                          // Combine and sort
                          const allActivities = [...projectLogs, ...changeHistoryLogs]
                            .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                          // Add submission as last entry if no activities
                          if (allActivities.length === 0 && selectedProject.submitted_at) {
                            allActivities.push({
                              id: 'submission',
                              action: 'Project Submitted',
                              description: `Project "${selectedProject.projectName}" submitted for review`,
                              type: 'submit',
                              user: selectedProject.creatorName || 'Creator',
                              source: 'creator',
                              date: new Date(selectedProject.submitted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                              time: new Date(selectedProject.submitted_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
                              timestamp: selectedProject.submitted_at,
                            });
                          }

                          const totalLogs = allActivities.length;

                          return allActivities.length > 0 ? allActivities.map((activity: any, idx: number) => (
                            <div key={activity.id || idx} className={`rounded-xl p-4 border-2 transition-all ${
                              activity.source === 'creator'
                                ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/5 border-green-500/30'
                                : 'bg-gradient-to-r from-blue-500/10 to-cyan-500/5 border-blue-500/30'
                            }`}>
                              <div className="flex items-start gap-3">
                                {/* Serial Number */}
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg flex-shrink-0">
                                  {totalLogs - idx}
                                </div>
                                {/* Icon */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  activity.type === 'submit' ? 'bg-green-500/20 text-green-400' :
                                  activity.type === 'status' ? 'bg-blue-500/20 text-blue-400' :
                                  activity.type === 'edit' ? 'bg-orange-500/20 text-orange-400' :
                                  activity.type === 'feedback' ? 'bg-amber-500/20 text-amber-400' :
                                  activity.type === 'assign' ? 'bg-purple-500/20 text-purple-400' :
                                  'bg-gray-500/20 text-gray-400'
                                }`}>
                                  <span className="text-lg">
                                    {activity.type === 'submit' ? '📤' :
                                     activity.type === 'status' ? '🔄' :
                                     activity.type === 'edit' ? '✏️' :
                                     activity.type === 'feedback' ? '💬' :
                                     activity.type === 'assign' ? '👤' : '📋'}
                                  </span>
                                </div>
                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-white font-bold">{activity.action}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                      activity.source === 'creator'
                                        ? 'bg-green-500/30 text-green-400 border border-green-500/50'
                                        : 'bg-blue-500/30 text-blue-400 border border-blue-500/50'
                                    }`}>
                                      {activity.source === 'creator' ? '👤 You' : '🏢 STAGE'}
                                    </span>
                                  </div>
                                  <p className="text-gray-400 text-sm">{activity.description}</p>
                                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                    <span>{activity.date}</span>
                                    <span>•</span>
                                    <span>{activity.time}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )) : (
                            <div className="text-center py-8 text-gray-500">
                              <span className="text-4xl mb-2 block">📋</span>
                              <p>No activity yet</p>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Status Update History & Admin Comments */}
                    <div>
                      <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                        💬 Admin Comments & Notifications
                      </h3>
                      <div className="space-y-3">
                        {/* Current Status */}
                        <div className={`rounded-xl p-4 border-2 ${
                          selectedProject.status === 'approved' ? 'bg-green-500/10 border-green-500/50' :
                          selectedProject.status === 'agreement-signed' ? 'bg-teal-500/10 border-teal-500/50' :
                          selectedProject.status === 'in-production' ? 'bg-purple-500/10 border-purple-500/50' :
                          selectedProject.status === 'rejected' ? 'bg-red-500/10 border-red-500/50' :
                          selectedProject.status === 'revision-requested' ? 'bg-orange-500/10 border-orange-500/50' :
                          'bg-blue-500/10 border-blue-500/50'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              selectedProject.status === 'approved' ? 'bg-green-500/30' :
                              selectedProject.status === 'agreement-signed' ? 'bg-teal-500/30' :
                              selectedProject.status === 'in-production' ? 'bg-purple-500/30' :
                              selectedProject.status === 'rejected' ? 'bg-red-500/30' :
                              selectedProject.status === 'revision-requested' ? 'bg-orange-500/30' :
                              'bg-blue-500/30'
                            }`}>
                              <span className="text-lg">
                                {selectedProject.status === 'approved' ? '✅' :
                                 selectedProject.status === 'agreement-signed' ? '📄' :
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

                        {/* Status History from Notifications - Expandable */}
                        {notifications
                          .filter(n => n.projectId === selectedProject.id || n.projectName === selectedProject.projectName)
                          .slice(0, 15)
                          .map((notif: any, idx) => {
                            const isExpanded = expandedActivity === notif.id;
                            const hasAdminComment = notif.adminComment && notif.adminComment.trim().length > 0;

                            return (
                              <div key={notif.id} className={`rounded-xl overflow-hidden border transition-all ${
                                hasAdminComment ? 'border-blue-500/30 bg-blue-500/5' : 'border-white/10 bg-white/5'
                              }`}>
                                {/* Activity Header - Clickable */}
                                <div
                                  onClick={() => setExpandedActivity(isExpanded ? null : notif.id)}
                                  className="p-4 cursor-pointer hover:bg-white/5 transition-all"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                      notif.newStatus === 'approved' ? 'bg-green-500/20' :
                                      notif.newStatus === 'agreement-signed' ? 'bg-teal-500/20' :
                                      notif.newStatus === 'in-production' ? 'bg-purple-500/20' :
                                      notif.newStatus === 'rejected' ? 'bg-red-500/20' :
                                      notif.newStatus === 'revision-requested' ? 'bg-orange-500/20' :
                                      notif.newStatus === 'edit_granted' ? 'bg-green-500/20' :
                                      notif.newStatus === 'edit_denied' ? 'bg-red-500/20' :
                                      'bg-blue-500/20'
                                    }`}>
                                      <span className="text-lg">
                                        {notif.newStatus === 'approved' ? '✅' :
                                         notif.newStatus === 'agreement-signed' ? '📄' :
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
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                          notif.newStatus === 'approved' ? 'bg-green-500/30 text-green-400' :
                                          notif.newStatus === 'agreement-signed' ? 'bg-teal-500/30 text-teal-400' :
                                          notif.newStatus === 'in-production' ? 'bg-purple-500/30 text-purple-400' :
                                          notif.newStatus === 'rejected' ? 'bg-red-500/30 text-red-400' :
                                          notif.newStatus === 'revision-requested' ? 'bg-orange-500/30 text-orange-400' :
                                          'bg-blue-500/30 text-blue-400'
                                        }`}>
                                          {notif.newStatus?.replace('-', ' ').replace('_', ' ').toUpperCase()}
                                        </span>
                                        {hasAdminComment && (
                                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-bold">
                                            💬 Feedback
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-white font-semibold text-sm">
                                        Status changed to {notif.newStatus?.replace('-', ' ').replace('_', ' ')}
                                      </div>
                                      <div className="text-gray-500 text-xs mt-1">
                                        {new Date(notif.timestamp).toLocaleString('en-IN')}
                                      </div>
                                    </div>
                                    <svg
                                      className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                  <div className="px-4 pb-4 border-t border-white/10">
                                    {/* Status Change Details */}
                                    <div className="bg-white/5 rounded-lg p-3 mt-3">
                                      <div className="text-xs text-gray-500 font-semibold mb-2">STATUS TRANSITION</div>
                                      <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-gray-600/50 text-gray-300 rounded-lg text-sm font-bold">
                                          {notif.oldStatus?.replace('-', ' ').replace('_', ' ').toUpperCase() || 'PREVIOUS'}
                                        </span>
                                        <span className="text-gray-500">→</span>
                                        <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                                          notif.newStatus === 'approved' ? 'bg-green-500/30 text-green-400' :
                                          notif.newStatus === 'agreement-signed' ? 'bg-teal-500/30 text-teal-400' :
                                          notif.newStatus === 'in-production' ? 'bg-purple-500/30 text-purple-400' :
                                          notif.newStatus === 'rejected' ? 'bg-red-500/30 text-red-400' :
                                          notif.newStatus === 'revision-requested' ? 'bg-orange-500/30 text-orange-400' :
                                          'bg-blue-500/30 text-blue-400'
                                        }`}>
                                          {notif.newStatus?.replace('-', ' ').replace('_', ' ').toUpperCase()}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Admin Feedback - Highlighted */}
                                    {hasAdminComment && (
                                      <div className="mt-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                          <div className="w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center">
                                            <span className="text-lg">💬</span>
                                          </div>
                                          <span className="text-lg font-black text-blue-400">Admin Feedback</span>
                                        </div>
                                        <div className="bg-black/30 rounded-lg p-4">
                                          <p className="text-white font-semibold leading-relaxed whitespace-pre-wrap">
                                            {notif.adminComment}
                                          </p>
                                        </div>
                                        {notif.newStatus === 'revision-requested' && (
                                          <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                                            <div className="flex items-center gap-2 text-orange-400 text-sm font-bold">
                                              <span>⚠️</span>
                                              <span>Action Required: Please address the feedback and resubmit</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Full Timestamp */}
                                    <div className="mt-3 text-xs text-gray-500 text-center">
                                      {new Date(notif.timestamp).toLocaleString('en-IN', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}

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
                  {notifications.map((notif: any) => {
                    const isExpanded = expandedNotification === notif.id;
                    const hasAdminComment = notif.adminComment && notif.adminComment.trim().length > 0;

                    return (
                      <div
                        key={notif.id}
                        className={`rounded-xl overflow-hidden transition-all border ${
                          !notif.read
                            ? 'bg-blue-500/10 border-blue-500/30'
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        {/* Notification Header - Clickable */}
                        <div
                          onClick={() => {
                            markAsRead(notif.id);
                            setExpandedNotification(isExpanded ? null : notif.id);
                          }}
                          className="p-4 cursor-pointer hover:bg-white/5 transition-all"
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
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-sm font-black ${!notif.read ? 'text-white' : 'text-gray-300'}`}>
                                  {notif.projectName}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                  notif.newStatus === 'approved' ? 'bg-green-500/30 text-green-400' :
                                  notif.newStatus === 'in-production' ? 'bg-purple-500/30 text-purple-400' :
                                  notif.newStatus === 'rejected' ? 'bg-red-500/30 text-red-400' :
                                  notif.newStatus === 'revision-requested' ? 'bg-orange-500/30 text-orange-400' :
                                  'bg-blue-500/30 text-blue-400'
                                }`}>
                                  {notif.newStatus?.replace('-', ' ').replace('_', ' ').toUpperCase()}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400">
                                {new Date(notif.timestamp).toLocaleString('en-IN')}
                              </p>
                              {hasAdminComment && !isExpanded && (
                                <div className="mt-2 text-xs text-blue-400 flex items-center gap-1">
                                  <span>💬</span>
                                  <span>Admin feedback available - Click to expand</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {!notif.read && (
                                <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 animate-pulse"></div>
                              )}
                              <svg
                                className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-white/10">
                            {/* Status Change Info */}
                            <div className="bg-white/5 rounded-lg p-3 mt-3">
                              <div className="text-xs text-gray-500 font-semibold mb-2">STATUS CHANGE</div>
                              <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-gray-600/50 text-gray-300 rounded-lg text-sm font-bold">
                                  {notif.oldStatus?.replace('-', ' ').replace('_', ' ').toUpperCase() || 'PREVIOUS'}
                                </span>
                                <span className="text-gray-500">→</span>
                                <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                                  notif.newStatus === 'approved' ? 'bg-green-500/30 text-green-400' :
                                  notif.newStatus === 'in-production' ? 'bg-purple-500/30 text-purple-400' :
                                  notif.newStatus === 'rejected' ? 'bg-red-500/30 text-red-400' :
                                  notif.newStatus === 'revision-requested' ? 'bg-orange-500/30 text-orange-400' :
                                  'bg-blue-500/30 text-blue-400'
                                }`}>
                                  {notif.newStatus?.replace('-', ' ').replace('_', ' ').toUpperCase()}
                                </span>
                              </div>
                            </div>

                            {/* Admin Comment/Feedback */}
                            {hasAdminComment && (
                              <div className="mt-3 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-blue-400">💬</span>
                                  <span className="text-sm font-black text-blue-400">Admin Feedback</span>
                                </div>
                                <p className="text-white font-semibold text-sm leading-relaxed whitespace-pre-wrap">
                                  {notif.adminComment}
                                </p>
                              </div>
                            )}

                            {/* Action Required for Revision */}
                            {notif.newStatus === 'revision-requested' && (
                              <div className="mt-3 bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-orange-400">⚠️</span>
                                  <span className="text-sm font-black text-orange-400">Action Required</span>
                                </div>
                                <p className="text-gray-300 text-sm mb-3">
                                  Please review the feedback above and update your project accordingly.
                                </p>
                                <button
                                  onClick={() => {
                                    const project = projects.find(p => p.id === notif.projectId || p.projectName === notif.projectName);
                                    if (project) {
                                      setSelectedProject(project);
                                      setShowNotifications(false);
                                    }
                                  }}
                                  className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-lg transition-all text-sm"
                                >
                                  ✏️ Edit Project & Resubmit
                                </button>
                              </div>
                            )}

                            {/* Timestamp */}
                            <div className="mt-3 text-xs text-gray-500 text-center">
                              Updated: {new Date(notif.timestamp).toLocaleString('en-IN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
