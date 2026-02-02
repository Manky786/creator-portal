'use client';

import { useState } from 'react';
import { BudgetFormData } from '@/types/budget';

interface Props {
  formData: Partial<BudgetFormData>;
  setFormData: (data: Partial<BudgetFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface SOPSection {
  id: string;
  title: string;
  itemCount: number;
  items: string[];
  emoji: string;
  gradient: string;
}

const initialSOPSections: SOPSection[] = [
  {
    id: 'sound-recording',
    title: 'Sound Recording Guidelines',
    itemCount: 12,
    emoji: '🎙️',
    gradient: 'from-blue-50 via-cyan-50 to-blue-100 border-blue-300',
    items: [
      'Professional boom microphone required for all dialogue recording',
      'Wireless lavalier mics for backup and wide shots',
      'Minimum -12dB to -6dB recording levels to prevent clipping',
      'Room tone recording (30 seconds minimum) for each location',
      'Separate track recording for dialogue, ambience, and effects',
      'Wind protection and deadcat for outdoor recording',
      'Headphone monitoring mandatory during all takes',
      'Sync sound with timecode or slate for post-production',
      'Background noise check before each take',
      'ADR requirements to be noted during production',
      'Sound report sheet for each shooting day',
      'Backup recording device mandatory for critical scenes'
    ]
  },
  {
    id: 'art-costume',
    title: 'Art Direction & Costume Guidelines',
    itemCount: 6,
    emoji: '🎨',
    gradient: 'from-purple-50 via-pink-50 to-purple-100 border-purple-300',
    items: [
      'Detailed production design brief with mood boards and references',
      'Color palette approval for sets and costumes before shoot',
      'Props and set dressing inventory with photographs',
      'Costume continuity photographs for each character and scene',
      'Period accuracy verification for historical content',
      'Brand clearances and legal approvals for visible products'
    ]
  },
  {
    id: 'filming',
    title: 'Filming Guidelines',
    itemCount: 19,
    emoji: '🎬',
    gradient: 'from-red-50 via-orange-50 to-red-100 border-red-300',
    items: [
      'Minimum 4K resolution (3840x2160) for all principal photography',
      'Log profile or RAW capture mandatory for narrative content',
      'Frame rate: 24fps for cinematic, 25fps for PAL, 30fps for documentary',
      'Aspect ratio: 16:9 standard, 2.39:1 for premium cinematic content',
      'White balance locked per scene to maintain color consistency',
      'Exposure monitoring with waveform, histogram, or false color',
      'Focus peaking and focus assist tools to ensure sharp imagery',
      'Camera movement to be motivated and purposeful, avoid unnecessary shaky footage',
      'Master shot and adequate coverage for editing flexibility',
      'Proper headroom and lead room for character framing',
      'Lighting setup to ensure proper exposure and mood',
      'Natural light continuity maintained throughout scene',
      'Shot list and storyboard adherence for complex sequences',
      'Call sheet distribution 24 hours before shoot day',
      'Weather contingency plans for outdoor shoots',
      'Safety protocols and risk assessment on set',
      'Continuity notes for wardrobe, props, and actor positions',
      'Daily rushes review for quality control',
      'Backup equipment plan for all critical gear'
    ]
  },
  {
    id: 'promotional',
    title: 'Promotional Content Requirements',
    itemCount: 5,
    emoji: '📢',
    gradient: 'from-green-50 via-emerald-50 to-green-100 border-green-300',
    items: [
      'Behind-the-scenes footage and photographs during production',
      'Cast and crew interviews for promotional use',
      'Key art assets: high-resolution stills, posters, character shots',
      'Teaser and trailer-ready footage with variety of shots',
      'Social media content: vertical videos (9:16), square format (1:1)'
    ]
  },
  {
    id: 'data-management',
    title: 'Data Management Guidelines',
    itemCount: 3,
    emoji: '💾',
    gradient: 'from-slate-50 via-gray-50 to-slate-100 border-slate-300',
    items: [
      'Triple backup strategy: on-set storage, primary backup, cloud/offsite backup',
      'File naming convention: ProjectName_SceneNo_TakeNo_Date_CameraID',
      'Data verification and checksum validation after each transfer'
    ]
  },
  {
    id: 'post-format',
    title: 'Post-Production Format Requirements',
    itemCount: 4,
    emoji: '⚙️',
    gradient: 'from-indigo-50 via-violet-50 to-indigo-100 border-indigo-300',
    items: [
      'Editing software: Adobe Premiere Pro, DaVinci Resolve, or Avid Media Composer',
      'Project timeline settings: 24fps for film, 25fps for PAL broadcast',
      'Sequence resolution: 4K (3840x2160) for master, 1080p for deliverables',
      'Audio configuration: Stereo or 5.1 surround sound mix'
    ]
  },
  {
    id: 'post-video',
    title: 'Post-Production Video Guidelines',
    itemCount: 6,
    emoji: '🎞️',
    gradient: 'from-teal-50 via-cyan-50 to-teal-100 border-teal-300',
    items: [
      'First cut assembly within 2 weeks of shoot completion',
      'Rough cut for review with temp music and basic color',
      'Fine cut with locked picture before final color grading',
      'VFX shots integration with proper tracking and compositing',
      'Title sequence and graphics integration as per brand guidelines',
      'Final master in ProRes 422 HQ or DNxHR HQX codec'
    ]
  },
  {
    id: 'post-sound',
    title: 'Post-Production Sound Guidelines',
    itemCount: 12,
    emoji: '🔊',
    gradient: 'from-amber-50 via-yellow-50 to-amber-100 border-amber-300',
    items: [
      'Dialogue editing and cleanup to remove background noise',
      'ADR recording for unclear or noisy dialogue',
      'Foley recording for footsteps, cloth movement, and object handling',
      'Sound effects design and library integration',
      'Ambience and room tone layering for natural sound',
      'Music composition and background score integration',
      'Sound mixing to balance dialogue, music, and effects',
      'Loudness normalization to -16 LUFS for OTT platform standards',
      'Dynamic range control for consistent playback across devices',
      '5.1 surround mix for premium content, stereo for standard',
      'Final mix delivery in WAV format (24-bit, 48kHz)',
      'Separate M&E (Music & Effects) track for international dubbing'
    ]
  },
  {
    id: 'post-color',
    title: 'Post-Production Color Guidelines',
    itemCount: 5,
    emoji: '🌈',
    gradient: 'from-rose-50 via-pink-50 to-rose-100 border-rose-300',
    items: [
      'Color grading in DaVinci Resolve or professional grading suite',
      'Rec.709 color space for HD/SDR delivery, Rec.2020 for HDR if required',
      'Shot matching for continuity across scenes',
      'Creative grade as per director\'s vision and approved LUT',
      'Final export with proper color space tagging and metadata'
    ]
  },
  {
    id: 'branding',
    title: 'STAGE Branding & Packaging',
    itemCount: 5,
    emoji: '✨',
    gradient: 'from-fuchsia-50 via-purple-50 to-fuchsia-100 border-fuchsia-300',
    items: [
      'STAGE logo placement as per brand guidelines (intro/outro)',
      'End credits format with proper hierarchy and legal disclaimers',
      'Content rating card (U, U/A, A) at the beginning',
      'Copyright notice and production company credits',
      'Promotional end card with social media handles and website'
    ]
  },
  {
    id: 'final-delivery',
    title: 'Final Export & Delivery Requirements',
    itemCount: 5,
    emoji: '📦',
    gradient: 'from-lime-50 via-green-50 to-lime-100 border-lime-300',
    items: [
      'Master file: ProRes 422 HQ or H.264 high bitrate (4K or 1080p)',
      'Platform delivery: MP4 (H.264 video, AAC audio) for streaming',
      'Resolution options: 4K (3840x2160), 1080p (1920x1080), 720p (1280x720)',
      'Audio: Stereo AAC at 320kbps or 5.1 surround as separate stems',
      'Subtitle files: SRT or VTT format with proper timecodes and translations'
    ]
  },
  {
    id: 'quality-control',
    title: 'Quality Control Process',
    itemCount: 11,
    emoji: '✅',
    gradient: 'from-sky-50 via-blue-50 to-sky-100 border-sky-300',
    items: [
      'Technical QC check for video artifacts, audio sync, and file integrity',
      'Content review for continuity errors and production quality',
      'Audio QC for levels, balance, and clarity across all scenes',
      'Color consistency check across entire program',
      'Subtitle accuracy and synchronization verification',
      'Compliance check for content rating and censorship guidelines',
      'Legal clearance verification for music, brands, and copyrighted material',
      'Metadata validation: title, description, episode number, runtime',
      'Test playback on multiple devices and platforms',
      'Final approval sign-off from director and production head',
      'Archive master files with proper labeling and documentation'
    ]
  }
];

export default function BudgetEntryStep({ formData, setFormData, onNext, onBack }: Props) {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [acknowledged, setAcknowledged] = useState(false);
  const [sopSections, setSOPSections] = useState<SOPSection[]>(initialSOPSections);

  // Force console log to verify version
  console.log('BudgetEntryStep v2.0 loaded - sections:', sopSections.length);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const expandAll = () => {
    const allExpanded = sopSections.reduce((acc, section) => ({
      ...acc,
      [section.id]: true
    }), {});
    setExpandedSections(allExpanded);
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  const addNewSOP = () => {
    const newSOP: SOPSection = {
      id: `custom-sop-${Date.now()}`,
      title: 'New SOP Section',
      itemCount: 1,
      emoji: '📝',
      gradient: 'from-indigo-50 via-blue-50 to-indigo-100 border-indigo-300',
      items: ['New guideline - click to edit']
    };
    setSOPSections([...sopSections, newSOP]);
    setExpandedSections({ ...expandedSections, [newSOP.id]: true });
  };

  const deleteSOPSection = (sectionId: string) => {
    if (confirm('Are you sure you want to delete this SOP section?')) {
      setSOPSections(sopSections.filter(section => section.id !== sectionId));
      const newExpanded = { ...expandedSections };
      delete newExpanded[sectionId];
      setExpandedSections(newExpanded);
    }
  };

  const updateSOPSection = (sectionId: string, field: keyof SOPSection, value: any) => {
    setSOPSections(sopSections.map(section =>
      section.id === sectionId ? { ...section, [field]: value, itemCount: field === 'items' ? value.length : section.itemCount } : section
    ));
  };

  const addSOPItem = (sectionId: string) => {
    setSOPSections(sopSections.map(section =>
      section.id === sectionId ? { ...section, items: [...section.items, 'New guideline'], itemCount: section.items.length + 1 } : section
    ));
  };

  const deleteSOPItem = (sectionId: string, itemIndex: number) => {
    setSOPSections(sopSections.map(section =>
      section.id === sectionId ? {
        ...section,
        items: section.items.filter((_, index) => index !== itemIndex),
        itemCount: section.items.length - 1
      } : section
    ));
  };

  const updateSOPItem = (sectionId: string, itemIndex: number, value: string) => {
    setSOPSections(sopSections.map(section =>
      section.id === sectionId ? {
        ...section,
        items: section.items.map((item, index) => index === itemIndex ? value : item)
      } : section
    ));
  };

  return (
    <div className="max-w-6xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }} key="sop-v2-2026">
      {/* Filmmaker Quote */}
      <div className="mb-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 rounded-xl p-6 backdrop-blur-lg">
        <div className="flex items-start gap-4">
          <span className="text-4xl">📋</span>
          <div className="flex-1">
            <p className="text-lg md:text-xl font-bold text-amber-900 italic mb-2">
              "अनुशासन और योजना के बिना महानता नहीं मिलती।"
            </p>
            <p className="text-sm font-bold text-amber-800/80">— अडूर गोपालकृष्णन (Adoor Gopalakrishnan)</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-5xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4 tracking-tight">
          📋 Standard Operating Procedures
        </h2>
        <p className="text-gray-700 text-lg mb-2 font-semibold">
          Please review all SOPs carefully before proceeding to the next step.
        </p>
        <p className="text-gray-600 text-base font-medium">
          You must acknowledge that you have read and understood all requirements.
        </p>
      </div>

      {/* Important Warning Box */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 p-6 rounded-xl mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-start gap-4">
          <span className="text-4xl animate-pulse">⚠️</span>
          <div>
            <h3 className="text-xl font-black text-amber-900 mb-2 uppercase tracking-wide">Important Notice</h3>
            <p className="text-amber-800 font-bold text-base leading-relaxed">
              Failure to comply with these Standard Operating Procedures may result in payment delays, content rejection, penalties, or termination of the agreement. All requirements are mandatory.
            </p>
          </div>
        </div>
      </div>

      {/* Expand/Collapse Controls */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={addNewSOP}
          className="px-6 py-3 text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add New SOP
        </button>

        <div className="flex gap-3">
          <button
            onClick={expandAll}
            className="px-6 py-3 text-sm font-bold border-2 border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 hover:scale-105"
          >
            📂 Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-6 py-3 text-sm font-bold border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105"
          >
            📁 Collapse All
          </button>
        </div>
      </div>

      {/* SOP Sections */}
      <div className="space-y-5 mb-8">
        {sopSections.map((section) => (
          <div
            key={section.id}
            className={`bg-gradient-to-br ${section.gradient} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 hover:scale-[1.01]`}
          >
            {/* Section Header */}
            <div className="px-7 py-6 flex items-center justify-between hover:bg-white/30 transition-all duration-200 gap-4">
              <button
                onClick={() => toggleSection(section.id)}
                className="flex-1 flex items-center gap-5 min-w-0"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all flex-shrink-0">
                  <span className="text-3xl">{section.emoji}</span>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateSOPSection(section.id, 'title', e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full text-xl md:text-2xl font-black text-gray-900 tracking-tight bg-transparent border-b-2 border-transparent hover:border-purple-400 focus:border-purple-600 focus:outline-none transition-all"
                  />
                  <p className="text-sm text-gray-600 font-bold mt-1">
                    {section.itemCount} {section.itemCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </button>
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Delete button removed as per requirements */}
                <button onClick={() => toggleSection(section.id)}>
                  <svg
                    className={`w-7 h-7 text-gray-700 transition-transform duration-300 ${
                      expandedSections[section.id] ? 'rotate-90' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Section Content */}
            {expandedSections[section.id] && (
              <div className="px-7 py-6 bg-white/50 backdrop-blur-sm border-t-2 border-gray-200">
                <ul className="space-y-4">
                  {section.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-4 group">
                      <span className="text-purple-600 font-black text-2xl mt-0.5 flex-shrink-0">•</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateSOPItem(section.id, index, e.target.value)}
                        className="flex-1 text-gray-900 font-semibold text-base leading-relaxed bg-transparent border-b-2 border-transparent hover:border-purple-300 focus:border-purple-600 focus:outline-none transition-all py-1"
                      />
                      {/* Delete button removed as per requirements */}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => addSOPItem(section.id)}
                  className="mt-4 w-full px-4 py-2 text-sm font-bold border-2 border-dashed border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 hover:border-purple-400 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Item
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Acknowledgment Checkbox */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 border-2 border-blue-400 rounded-2xl p-7 mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
        <label className="flex items-start gap-5 cursor-pointer group">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="w-7 h-7 text-purple-600 border-3 border-gray-400 rounded-md focus:ring-3 focus:ring-purple-500 mt-1 cursor-pointer"
          />
          <div>
            <p className="text-base font-bold text-gray-900 leading-relaxed mb-2">
              I confirm that I have read and understood all the Standard Operating Procedures (SOPs) listed above.
            </p>
            <p className="text-base font-semibold text-gray-800 leading-relaxed">
              I agree to comply with all requirements including Pre-Production, Production, Post-Production, and Quality Control guidelines. I understand that non-compliance may result in penalties, payment delays, or content rejection.
            </p>
          </div>
        </label>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onBack}
          className="px-8 py-4 rounded-xl text-lg font-black transition-all duration-200 flex items-center gap-3 bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-600 text-white hover:from-purple-600 hover:via-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-2xl hover:scale-105 border-2 border-white/20"
        >
          <span className="text-xl">←</span>
          <span>Previous Step</span>
        </button>
        <button
          onClick={onNext}
          disabled={!acknowledged}
          className={`px-10 py-4 rounded-xl text-lg font-black transition-all duration-200 flex items-center gap-3 ${
            acknowledged
              ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-2xl hover:scale-105 border-2 border-white/20'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
          }`}
        >
          {acknowledged ? (
            <>
              <span>Continue to Next Step</span>
              <span className="text-xl">→</span>
            </>
          ) : (
            <span>⚠️ Please Acknowledge to Continue</span>
          )}
        </button>
      </div>
    </div>
  );
}
