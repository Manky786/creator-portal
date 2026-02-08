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
  // ============== PRE-PRODUCTION ==============
  {
    id: 'pre-production',
    title: '📌 PRE-PRODUCTION Guidelines',
    itemCount: 3,
    emoji: '📋',
    gradient: 'from-orange-50 via-amber-50 to-orange-100 border-orange-400',
    items: [
      'Creator MUST give a brief outline of the project in the format of the pitch deck requirement provided by STAGE',
      'Creator MUST list down shot division and production requirements of every film or show before going into the process of production',
      'Creators MUST conduct workshops with the crew members and the cast before the shoot so everyone is aware of their roles on set'
    ]
  },
  {
    id: 'pre-production-instructions',
    title: 'Pre-Production Instructions (Mandatory)',
    itemCount: 6,
    emoji: '📝',
    gradient: 'from-yellow-50 via-amber-50 to-yellow-100 border-yellow-400',
    items: [
      'Location Permits: Secure shooting permissions or NOC for all locations and submit them to STAGE Content/Legal Team TWO WEEKS in advance',
      'Artist Agreements and NDAs: Sign agreements with all artists and HODs and submit them to STAGE',
      'Pre-Production Meeting: Attend a meeting with all HODs and STAGE officials ONE WEEK before shoot date. Director must present finalized cast details, look references, and location deck with all interior/exterior locations and permission letters',
      'Shooting Schedule: Provide shooting schedule in advance and share daily shoot reports with STAGE Team',
      'Hiring Guidelines: Hire experienced personnel for all HOD positions. Interns are NOT allowed to handle HOD roles',
      'Clapboard and Log Sheet: Assign a skilled assistant director to manage the clapboard and log sheet'
    ]
  },
  {
    id: 'budget-breakdown',
    title: 'Budget Breakdown Requirements',
    itemCount: 2,
    emoji: '💰',
    gradient: 'from-green-50 via-emerald-50 to-green-100 border-green-400',
    items: [
      'Creator MUST provide a detailed budget sheet that discloses and lists down exactly how and where the budget will be used',
      'The budget will be allocated only after discussion with and approval by the STAGE team'
    ]
  },
  {
    id: 'technical-equipment',
    title: 'Technical Equipment Requirements',
    itemCount: 3,
    emoji: '🎥',
    gradient: 'from-blue-50 via-cyan-50 to-blue-100 border-blue-400',
    items: [
      'CAMERA - Creator must list down the camera model and lenses being used for the production',
      'SOUND EQUIPMENT - Creator must list down the sound equipment to be used in the production',
      'LIGHT EQUIPMENT - Creator must list down the light equipment to be used in the production'
    ]
  },
  {
    id: 'look-references',
    title: 'Look References Requirements',
    itemCount: 2,
    emoji: '🎨',
    gradient: 'from-purple-50 via-pink-50 to-purple-100 border-purple-400',
    items: [
      'ART DIRECTION - Creator must share reference images of other films/shows that have similar art direction to their production ideas',
      'MAKE-UP & COSTUME - Creator must share reference images of other films/shows that have similar make-up & costume to their production ideas'
    ]
  },
  {
    id: 'work-links',
    title: 'Work Links for Technical Onboarding',
    itemCount: 10,
    emoji: '🔗',
    gradient: 'from-indigo-50 via-violet-50 to-indigo-100 border-indigo-400',
    items: [
      'Director - Work links required (minimum 4 links)',
      'Director of Photography - Work links required (minimum 4 links)',
      'Editor - Work links required (minimum 4 links)',
      'Sound Designer - Work links required (minimum 4 links)',
      'BGM Artist - Work links required (minimum 4 links)',
      'Colorist - Work links required (minimum 4 links)',
      'Art Director/Production Designer - Work links required (minimum 4 links)',
      'Make-Up and Costume - Work links required (minimum 4 links)',
      'VFX Artist (If any) - Work links required (minimum 4 links)',
      'NOTE: Only work links are acceptable, do not share IMDB pages or written profiles'
    ]
  },

  // ============== PRODUCTION - CINEMATOGRAPHY ==============
  {
    id: 'cinematography-equipment',
    title: '📌 CINEMATOGRAPHY - Equipment & Settings',
    itemCount: 8,
    emoji: '📷',
    gradient: 'from-red-50 via-orange-50 to-red-100 border-red-400',
    items: [
      'All footage MUST be shot in landscape, i.e., 16:9, 2:1 aspect ratios',
      'All footage MUST be shot at 25 fps frame rate',
      'Use only full frame cameras that can shoot 4K footage at least',
      'Use the same company and model of cameras in multi cam shoots',
      'Acceptable cameras include SONY FX6, FX9, SONY VENICE, ARRI ALEXA MINI',
      'All footage must be shot in RAW and Log mode as is required for Digital Intermediate (DI) and Color Grading',
      'Prime Cine lenses and a standard kit must be used. If lenses vary according to requirements, it must be discussed with and approved by STAGE',
      'Use stabilizers like Tripod, Gimbal and Trolley wherever required'
    ]
  },
  {
    id: 'shot-division',
    title: 'Shot Division and Shoot Guidelines',
    itemCount: 8,
    emoji: '🎬',
    gradient: 'from-rose-50 via-pink-50 to-rose-100 border-rose-400',
    items: [
      'Enough footage must be filmed to make the post production process hassle free',
      'Filler shots MUST be taken for every scene, specially for shows and series as they are necessary for the trailer',
      'Make sure that all shots are well lit and lighting is done according to location and mood',
      'Sync all camera settings with each other throughout a scene, specially during multi cam shoots',
      'Use appropriate lenses for different kinds of shots and make sure they are well composed and shot with stable focus and no movement jerks',
      'Shoot Behind the Scene videos for every scene if it is stated that they are required by the STAGE team',
      'A Log Sheet MUST be maintained throughout the shoot',
      'Creator MUST share some footage and sounds every day of production for quality assurance'
    ]
  },

  // ============== PRODUCTION - SOUND RECORDING ==============
  {
    id: 'sound-recording',
    title: '📌 SOUND RECORDING Guidelines',
    itemCount: 10,
    emoji: '🎙️',
    gradient: 'from-violet-50 via-purple-50 to-violet-100 border-violet-400',
    items: [
      'Use good quality mics, stands and recording devices. Acceptable: Sound Device 888, 664, MixPre 10; Mics: Sennheiser 8060, MKH60, MKH50, MKH416; Wireless: Sennheiser G4 500/100 series with Sanken COS11D or Sennheiser ME',
      'Make sure all devices are working properly and all sounds are clean before each shot',
      'In case of sync sound, make sure there is no echo or muffle in the audio',
      'Make sure that dialogues are recorded without disturbance',
      'Make sure to record ambience and foley sounds in each scene',
      'Make sure to use appropriate settings according to the location and distance of actors',
      'Make sure to check the audio recording after every shot and re-record it if it does not match guidelines',
      'Do not forget to back up the audio while recording sound during shoot',
      'It must be discussed before the shoot if the sound recording would be sync sound or dubbing',
      'NOTE: The audio quality will be checked by STAGE team and if the project requires full dubbing or any changes, it will be done by the creator\'s team without any extra budget'
    ]
  },

  // ============== PRODUCTION - ART DIRECTION ==============
  {
    id: 'art-direction',
    title: 'Art Direction Guidelines',
    itemCount: 4,
    emoji: '🎭',
    gradient: 'from-fuchsia-50 via-pink-50 to-fuchsia-100 border-fuchsia-400',
    items: [
      'Artist costumes MUST be chosen according to their place of belonging and mood of the story. All elements of the costume must be true to the fictional identity of the character',
      'The set must be designed according to the story with research on real life references',
      'The actors must be sharp in their senses, relaxed and well rested before the shoot for their best performance',
      'DO NOT show any brands/brand symbols in costumes, set design or props. Brands can appear ONLY IF there is planned brand integration'
    ]
  },
  {
    id: 'filming-guidelines-mandatory',
    title: 'Filming Guidelines (Mandatory)',
    itemCount: 18,
    emoji: '🎯',
    gradient: 'from-red-50 via-rose-50 to-red-100 border-red-400',
    items: [
      'Use only STAGE-approved clapboards and log sheets',
      'Film the ENTIRE approved shoot script as per agreed production values. Any omitted scene must either be filmed later or will attract a PENALTY',
      'Animal Welfare: Ensure no harm to animals during filming. If animals are involved, a veterinarian must be present with fitness certificates',
      'Share daily shoot schedule and shooting reports with the STAGE team',
      'Do NOT change primary artists without immediate notification to the content team',
      'Only approved dialects can be used. For any deviations, prior permission from STAGE Content team is required',
      'Avoid on-set script improvisation unless necessary for comedic effect',
      'Creator is fully responsible for managing the shoot location, including any cost overruns',
      'Confidentiality: NO sharing or posting of plot-revealing images or clips from the set. Plot discussions during media engagements are NOT allowed',
      'Scene Leak Prevention: Script bundles from each day\'s shoot should be destroyed to avoid scene leakage',
      'Set Security: Provide ID cards to all team members to prevent outsider intrusion',
      'Safety & Security: Creator must ensure safety of cast/crew. No visual/audio presence of brands & institutions without approval',
      'Language: Avoid using foul language in scripts without prior WRITTEN consent from Content Team',
      'On-Set Conduct: Smoking, drinking alcohol, or using prohibited substances on set is STRICTLY PROHIBITED',
      'Transportation: Ensure all drivers are licensed. Extra precautions for post-night shots, exterior shoots, or uncontrollable environments',
      'Meals: Provide timely and healthy meals for cast & crew. ONLY VEGETARIAN food is allowed on set',
      'Character Promos and Poster Photoshoot: Conducting on-set character promo shoots and poster photoshoots is MANDATORY',
      'Mobile Experience: Avoid excessive use of extreme wide shots and aerial shots. Prioritize close-up shots and master shots for mobile viewing'
    ]
  },

  // ============== PRODUCTION - PROMOTIONAL CONTENT ==============
  {
    id: 'promotional-content',
    title: 'Promotional Content Guidelines',
    itemCount: 4,
    emoji: '📢',
    gradient: 'from-cyan-50 via-teal-50 to-cyan-100 border-cyan-400',
    items: [
      'Photos of all important characters MUST be clicked during shoot for cover posters and thumbnails with concept photoshoots for official poster designs',
      'CHARACTER VIDEOS: Videos of all characters appealing for downloading STAGE app must be shot in landscape and portrait. Script will be provided by STAGE team',
      'ACTOR VIDEOS: Film/web series/show announcement videos MUST be shot of every actor in landscape and portrait. Script will be provided by STAGE team',
      'These marketing assets must be treated as an integral part of the shoot schedule and included in the sanctioned budget'
    ]
  },

  // ============== POST-PRODUCTION ==============
  {
    id: 'format-technicalities',
    title: '📌 POST-PRODUCTION - Format Technicalities',
    itemCount: 4,
    emoji: '📐',
    gradient: 'from-blue-50 via-sky-50 to-blue-100 border-blue-400',
    items: [
      'Frame ratio MUST be 16:9 (3840x2160 / 1920x1080)',
      'Frame rate MUST be 25 fps',
      'Pixel aspect ratio must be Square pixel',
      'Display format must be Progressive Scan'
    ]
  },
  {
    id: 'video-guidelines',
    title: 'Post-Production Video Guidelines',
    itemCount: 6,
    emoji: '🎞️',
    gradient: 'from-red-50 via-orange-50 to-red-100 border-red-400',
    items: [
      'Each and every video MUST have STAGE intro and outro which will be provided by the STAGE team. These will be added ONLY after final approval',
      'There can be NO logo on any video that is released on STAGE',
      'The end credits must be in a certain format provided by STAGE team',
      'Credits for the STAGE team must be added in end credits',
      'In any credit/mention of STAGE, it must be typed out in all capital letters only',
      'Make sure that all audio video cuts are smooth and there are no abrupt frames or jerks'
    ]
  },
  {
    id: 'sound-mixing',
    title: 'Sound Mixing and Mastering',
    itemCount: 5,
    emoji: '🔊',
    gradient: 'from-purple-50 via-violet-50 to-purple-100 border-purple-400',
    items: [
      'Make sure every dialogue is lip synced',
      'Use foley and ambience according to the scene',
      'Make sure there are no gaps, sharp cuts or jerks in audio',
      'All audio levels MUST be between -12db to -6db',
      'Make sure that audios are clean and do not have any noise or noise inconsistencies'
    ]
  },
  {
    id: 'bgm-design',
    title: 'Background Music Design',
    itemCount: 4,
    emoji: '🎵',
    gradient: 'from-indigo-50 via-blue-50 to-indigo-100 border-indigo-400',
    items: [
      'All music that is used MUST be created originally. Do not copy music that is not original',
      'Sync BGM according to the requirement of the content',
      'Make sure that BGM does not overpower dialogues and they are clearly audible',
      'All music that is used must be recorded in a music cue sheet (template will be provided by STAGE)'
    ]
  },
  {
    id: 'epidemic-music',
    title: 'Epidemic Music Bank Guidelines',
    itemCount: 4,
    emoji: '🎧',
    gradient: 'from-teal-50 via-emerald-50 to-teal-100 border-teal-400',
    items: [
      'STAGE team has licensed the Epidemic Music Bank - a large collection of music tracks apt for almost all genres and scenes',
      'Epidemic Music Bank can be used only in STAGE projects and shall be provided where deemed necessary',
      'Project should still use 80% of original music',
      'Creators would have to provide a cue sheet of each and every music piece utilized in the project. Access will be provided along with confidentiality notice'
    ]
  },
  {
    id: 'color-guidelines',
    title: 'Color Grading Guidelines',
    itemCount: 5,
    emoji: '🌈',
    gradient: 'from-rose-50 via-pink-50 to-rose-100 border-rose-400',
    items: [
      'The color grading of a project must be done according to the genre, feel and theme of the project',
      'Make sure the color is consistent throughout the scene',
      'Make sure the color does not mismatch in any shot, especially in multi-cam footages',
      'CC and DI must be done in dedicated softwares like DaVinci Resolve, do not use Adobe Premiere Pro or any other editing software',
      'The look and feel should match what was promised by the creator during pitching and pre production discussions'
    ]
  },
  {
    id: 'branding-packaging',
    title: 'STAGE Branding and Packaging',
    itemCount: 5,
    emoji: '✨',
    gradient: 'from-fuchsia-50 via-purple-50 to-fuchsia-100 border-fuchsia-400',
    items: [
      'The film/episode should begin with STAGE Intro and disclaimer that will be provided by us',
      'After Intro and Disclaimer, there will be no other credit plate. Film/Episode will begin directly after STAGE Intro',
      'There must be a cold open before any Intro graphics in the web series',
      'Web Series Intro Graphics must be under 40 seconds',
      'Statutory Warning overlay must be used at bottom right whenever smoking/drinking is on screen (overlay will be provided by STAGE)'
    ]
  },

  // ============== FINAL DELIVERY ==============
  {
    id: 'final-delivery-video',
    title: '📌 FINAL DELIVERY - Video Requirements',
    itemCount: 5,
    emoji: '📦',
    gradient: 'from-lime-50 via-green-50 to-lime-100 border-lime-400',
    items: [
      '4K DPX 12 Bit (Clean)',
      '422/HQ (.Mov)',
      '4K MP4 (H.264)',
      'DI Project File',
      'EDIT Project File'
    ]
  },
  {
    id: 'final-delivery-audio',
    title: 'Final Delivery - Audio Requirements',
    itemCount: 8,
    emoji: '🔉',
    gradient: 'from-sky-50 via-blue-50 to-sky-100 border-sky-400',
    items: [
      'Final-Mix: Stereo and 5.1 Mix',
      'Un-Mix: Stereo Dialogue',
      'Un-Mix: Stereo Music',
      'Un-Mix: Stereo Foley',
      'Un-Mix: Stereo SFX',
      'Un-Mix: 5.1 Music and Effects',
      'Foley must be recorded separately',
      'Final project must be delivered in LTO tape'
    ]
  },

  // ============== QUALITY CONTROL ==============
  {
    id: 'qc-overview',
    title: '📌 QUALITY CONTROL Overview',
    itemCount: 3,
    emoji: '✅',
    gradient: 'from-emerald-50 via-green-50 to-emerald-100 border-emerald-400',
    items: [
      'Quality Control ensures a smooth and enriching viewer experience from scripting, shooting, post production to final delivery',
      'QC is performed primarily on frame.io software where feedback is delivered with time stamps',
      'STAGE will share frame.io links with delivered content and feedback where creators can read and reply to discuss'
    ]
  },
  {
    id: 'qc-round1',
    title: 'QC Round 1: Content QC',
    itemCount: 4,
    emoji: '1️⃣',
    gradient: 'from-blue-50 via-indigo-50 to-blue-100 border-blue-400',
    items: [
      'Creators are required to share a line up to the content team for review',
      'Content team will check and finalize structure, dialect, episodic or dramatic flow to ensure shoot went according to script',
      'After feedback, creator will share an offline edit with reference BGM',
      'After content team approval, finalized content cut will be transferred for technical editing quality check before sound and DI'
    ]
  },
  {
    id: 'qc-round2',
    title: 'QC Round 2: Offline Edit QC',
    itemCount: 3,
    emoji: '2️⃣',
    gradient: 'from-violet-50 via-purple-50 to-violet-100 border-violet-400',
    items: [
      'Technical QC team will check the edit and give feedback within 7-10 business days',
      'Creator is required to make necessary changes in edit and share final edit with STAGE team',
      'After STAGE approval, the final edit can go for Sound and DI'
    ]
  },
  {
    id: 'qc-round3',
    title: 'QC Round 3: Sound and BGM QC',
    itemCount: 4,
    emoji: '3️⃣',
    gradient: 'from-amber-50 via-yellow-50 to-amber-100 border-amber-400',
    items: [
      'After edit approval, creator shares content with sound mixing mastering (dialogue, dubbing sync, foley) and BGM',
      'STAGE team will check the BGM and sound design and share feedback',
      'Creator is required to make changes and share with team within 4-5 business days',
      'After approval for sound and BGM, move on to color'
    ]
  },
  {
    id: 'qc-round4',
    title: 'QC Round 4: Color QC',
    itemCount: 4,
    emoji: '4️⃣',
    gradient: 'from-rose-50 via-red-50 to-rose-100 border-rose-400',
    items: [
      'After sound approval, creator shares film/show with DI and color',
      'STAGE team will review DI and color grading and provide feedback',
      'Creator will share final corrected content',
      'After final approval from STAGE team, STAGE intro-outro would be added to the content'
    ]
  },
  {
    id: 'qc-notes',
    title: 'Important QC Notes',
    itemCount: 4,
    emoji: '⚠️',
    gradient: 'from-orange-50 via-amber-50 to-orange-100 border-orange-400',
    items: [
      'ALL FILES SHARED FOR QC MUST HAVE A "FOR STAGE PREVIEW" WATERMARK in bottom right corner. Only final delivery would be watermark free',
      'STAGE Intro, Outro and post credits to be added after final approval of film/show',
      'After every QC round, a deadline will be defined for delivery of next cut. This deadline must be strictly followed',
      'If deadlines need to be revised, it can be done ONLY after discussion with STAGE team'
    ]
  },

  // ============== DATA STORAGE ==============
  {
    id: 'data-storage',
    title: '📌 DATA STORAGE - Required Folders',
    itemCount: 14,
    emoji: '💾',
    gradient: 'from-slate-50 via-gray-50 to-slate-100 border-slate-400',
    items: [
      'Raw footage/clips - All raw data in day-wise folders or easily understandable format',
      'Project files - All project files (episode prproj, Teaser/Trailer prproj, After Effects, PSD files, sound files, DaVinci DI project files)',
      'XML files - XML files of all project files and versions',
      'Graphics/VFX data - Any VFX or animation used along with editable files',
      'Proxy - Proxy files of all versions pertaining to the project',
      'Songs - All songs used in the project',
      'IT Tracks - All BGM files (scoring, mixing, foley) with mixed and open IT tracks, 16 Track of Songs',
      'Sync Audio - All recorded voices/sounds of camera and sound recorders with project files',
      'BGM - All BGM tracks used in the project',
      'Final Export - All final exports (4K/H.264, Clean mov, HD, ProRes.mov Apple ProRes 422 HQ) with dialogue track and BGM IT tracks',
      'Unmixed Tracks Stereo - Unmix tracks (Dialogue, Music, Foley+SFX layers) for Film/Show, Trailer and Teaser',
      'Unmix Tracks 5.1 - Unmix M&E and Separate channels unmix',
      'Teaser and trailer final exports - Final exports with raw data, VFX data, Music data and editable files',
      'Character Promos and photoshoots - All data, project files and exports'
    ]
  },
  {
    id: 'data-documents',
    title: 'Documents Folder Requirements',
    itemCount: 1,
    emoji: '📄',
    gradient: 'from-zinc-50 via-stone-50 to-zinc-100 border-zinc-400',
    items: [
      'Documents folder should contain: Script, Screenplay, and all Contracts signed by artists for the movie or web-series'
    ]
  },
  {
    id: 'data-delivery-notes',
    title: 'Data Delivery Instructions',
    itemCount: 4,
    emoji: '📬',
    gradient: 'from-cyan-50 via-sky-50 to-cyan-100 border-cyan-400',
    items: [
      'All project files should work in Hard Disk by locating the media files in respective data folders',
      'Once all data is uploaded in harddisks, arrange a video call with STAGE authority to check and confirm the data',
      'After confirmation, courier the harddisks to: Tower A, 7th Floor, Club 125, Sector 125, Noida, U.P. Pin. 201301',
      'Contact: Anushka - 9425360822'
    ]
  }
];

interface SOPComment {
  sectionId: string;
  sectionTitle: string;
  comment: string;
  timestamp: string;
}

export default function BudgetEntryStep({ formData, setFormData, onNext, onBack }: Props) {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [acknowledged, setAcknowledged] = useState(false);
  const [commentingSectionId, setCommentingSectionId] = useState<string | null>(null);
  const [currentComment, setCurrentComment] = useState('');
  const [sopComments, setSopComments] = useState<SOPComment[]>(
    (formData as any).sopComments || []
  );
  const sopSections = initialSOPSections;

  // Force console log to verify version
  console.log('BudgetEntryStep v4.0 loaded - sections:', sopSections.length);

  // Save comments to formData whenever they change
  const saveComments = (comments: SOPComment[]) => {
    setSopComments(comments);
    setFormData({ ...formData, sopComments: comments } as any);
  };

  const addComment = (sectionId: string, sectionTitle: string) => {
    if (!currentComment.trim()) return;

    const newComment: SOPComment = {
      sectionId,
      sectionTitle,
      comment: currentComment.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedComments = [...sopComments, newComment];
    saveComments(updatedComments);
    setCurrentComment('');
    setCommentingSectionId(null);
  };

  const deleteComment = (index: number) => {
    const updatedComments = sopComments.filter((_, i) => i !== index);
    saveComments(updatedComments);
  };

  const getCommentsForSection = (sectionId: string) => {
    return sopComments.filter(c => c.sectionId === sectionId);
  };

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
          📋 STAGE Standard Operating Procedures
        </h2>
        <p className="text-gray-700 text-lg mb-2 font-semibold">
          Complete guidelines for Pre-Production, Production, Post-Production, Quality Control & Data Delivery
        </p>
        <p className="text-gray-600 text-base font-medium">
          You must acknowledge that you have read and understood ALL requirements before submitting your project.
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
      <div className="flex justify-end items-center mb-6">
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
                  <h3 className="w-full text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                    {section.title}
                  </h3>
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
                    <li key={index} className="flex items-start gap-4">
                      <span className="text-purple-600 font-black text-2xl mt-0.5 flex-shrink-0">•</span>
                      <span className="flex-1 text-gray-900 font-semibold text-base leading-relaxed py-1">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Existing Comments for this section */}
                {getCommentsForSection(section.id).length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="text-sm font-black text-purple-700 uppercase tracking-wide">Your Comments/Questions:</h4>
                    {getCommentsForSection(section.id).map((comment, idx) => {
                      const globalIdx = sopComments.findIndex(c => c === comment);
                      return (
                        <div key={idx} className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 relative">
                          <p className="text-gray-800 font-medium pr-8">{comment.comment}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(comment.timestamp).toLocaleString('en-IN')}
                          </p>
                          <button
                            onClick={() => deleteComment(globalIdx)}
                            className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors"
                            title="Delete comment"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add Comment Section */}
                {commentingSectionId === section.id ? (
                  <div className="mt-6 bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
                    <h4 className="text-sm font-black text-blue-700 mb-3 flex items-center gap-2">
                      💬 Add Comment or Question
                    </h4>
                    <textarea
                      value={currentComment}
                      onChange={(e) => setCurrentComment(e.target.value)}
                      placeholder="Type your question or comment about this SOP section... (e.g., 'Can we use different camera if approved?')"
                      className="w-full p-4 border-2 border-blue-300 rounded-xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={3}
                    />
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => addComment(section.id, section.title)}
                        disabled={!currentComment.trim()}
                        className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${
                          currentComment.trim()
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Submit Comment
                      </button>
                      <button
                        onClick={() => {
                          setCommentingSectionId(null);
                          setCurrentComment('');
                        }}
                        className="px-5 py-2 rounded-lg font-bold text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setCommentingSectionId(section.id)}
                    className="mt-6 w-full px-4 py-3 text-sm font-bold border-2 border-dashed border-blue-400 text-blue-600 rounded-xl hover:bg-blue-50 hover:border-blue-500 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Have a Question? Add Comment
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* SOP Comments Summary */}
      {sopComments.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-300 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-blue-800 flex items-center gap-2">
              💬 Your Comments & Questions ({sopComments.length})
            </h3>
            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
              Will be sent to STAGE Team
            </span>
          </div>
          <p className="text-sm text-blue-700 font-medium mb-4">
            These comments will be visible to the STAGE admin team after you submit your project.
          </p>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {sopComments.map((comment, index) => (
              <div key={index} className="bg-white border border-blue-200 rounded-xl p-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs font-bold text-purple-600 mb-1">{comment.sectionTitle}</p>
                  <p className="text-gray-800 font-medium text-sm">{comment.comment}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(comment.timestamp).toLocaleString('en-IN')}
                  </p>
                </div>
                <button
                  onClick={() => deleteComment(index)}
                  className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                  title="Delete comment"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MANDATORY Acknowledgment Section */}
      <div className={`rounded-2xl p-7 mb-8 shadow-xl transition-all duration-300 border-4 ${
        acknowledged
          ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 border-green-500'
          : 'bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 border-red-500 animate-pulse'
      }`}>
        {/* Mandatory Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{acknowledged ? '✅' : '🚨'}</span>
            <div>
              <h3 className="text-2xl font-black text-gray-900">Creator Acknowledgment</h3>
              <p className="text-sm font-bold text-gray-600">You must accept to submit your project</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full font-black text-sm ${
            acknowledged
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white animate-bounce'
          }`}>
            {acknowledged ? '✓ ACKNOWLEDGED' : '⚠️ MANDATORY'}
          </div>
        </div>

        {/* Important Notice */}
        <div className={`p-4 rounded-xl mb-6 ${
          acknowledged
            ? 'bg-green-100 border-2 border-green-300'
            : 'bg-red-100 border-2 border-red-300'
        }`}>
          <p className={`text-sm font-bold ${acknowledged ? 'text-green-800' : 'text-red-800'}`}>
            {acknowledged
              ? '✅ Thank you! You have acknowledged all Terms & Conditions. You can now proceed to submit your project.'
              : '⚠️ IMPORTANT: You cannot submit your project without acknowledging that you have read and understood all the Standard Operating Procedures (SOPs) and Terms & Conditions listed above.'
            }
          </p>
        </div>

        {/* Checkbox Area */}
        <label className={`flex items-start gap-5 cursor-pointer p-5 rounded-xl transition-all duration-200 ${
          acknowledged
            ? 'bg-green-100 border-2 border-green-400'
            : 'bg-white border-2 border-gray-300 hover:border-purple-400 hover:bg-purple-50'
        }`}>
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="w-8 h-8 text-green-600 border-3 border-gray-400 rounded-lg focus:ring-4 focus:ring-green-500 mt-1 cursor-pointer accent-green-600"
          />
          <div className="flex-1">
            <p className="text-lg font-black text-gray-900 leading-relaxed mb-3">
              📋 I, the Creator, hereby confirm and acknowledge that:
            </p>
            <ul className="space-y-2 text-base font-semibold text-gray-800">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">1.</span>
                <span>I have carefully read and understood ALL the Standard Operating Procedures (SOPs) listed above.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">2.</span>
                <span>I agree to comply with all Pre-Production, Production, Post-Production, and Quality Control guidelines.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">3.</span>
                <span>I understand that non-compliance may result in penalties, payment delays, content rejection, or termination of agreement.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">4.</span>
                <span>I accept all Terms & Conditions of STAGE OTT Platform for content creation and delivery.</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-amber-100 rounded-lg border border-amber-300">
              <p className="text-sm font-bold text-amber-800">
                💡 By checking this box, you are legally bound to follow all guidelines. Please ensure you have read everything carefully.
              </p>
            </div>
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
