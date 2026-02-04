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
  [key: string]: any;
}

export default function MyProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    // Load submitted projects from localStorage
    const submissions = JSON.parse(localStorage.getItem('stage_submissions') || '[]');
    setProjects(submissions);
    setLoading(false);
  }, []);

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
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'in_review': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return '✓ Approved';
      case 'rejected': return '✗ Rejected';
      case 'in_review': return '⏳ In Review';
      default: return '📋 Pending Review';
    }
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
            <Link
              href="/creator"
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
            >
              + New Project
            </Link>
            <Link
              href="/profile"
              className="px-6 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-all"
            >
              Dashboard
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
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-black text-white truncate flex-1">
                      {project.projectName || 'Untitled Project'}
                    </h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${getStatusColor(project.status)}`}>
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
