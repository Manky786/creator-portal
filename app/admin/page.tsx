'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as XLSX from 'xlsx';

// Sample data - in production would come from Supabase with full creator onboarding data
const sampleSubmissions = [
  {
    id: 1,
    projectName: 'Mahapunarjanam',
    creator: 'Ravi Sharma',
    culture: 'Haryanvi',
    format: 'Long Series',
    genre: 'Drama/Mythology',
    subGenre: 'Mythological Drama',
    contentRating: 'U/A 13+',
    totalBudget: 11000000,
    completeness: 92,
    warnings: 1,
    status: 'pending',
    submittedDate: '2026-01-30',
    episodes: 26,
    thumbnail: '/api/placeholder/400/225',

    // POC (Point of Contact)
    productionPOC: '',
    contentPOC: '',


    // Activity Log
    activityLog: [
      { date: '2026-01-30', time: '10:30 AM', action: 'Project Submitted', description: 'Creator submitted project for review', user: 'Ravi Sharma', type: 'submit' },
      { date: '2026-01-30', time: '11:15 AM', action: 'Under Initial Review', description: 'Production team started initial screening', user: 'Admin Team', type: 'review' },
    ],

    // Full creator onboarding data
    logline: 'A modern retelling of ancient Haryanvi folklore through the lens of reincarnation',
    synopsis: 'Mahapunarjanam explores the cyclical nature of life and death through traditional Haryanvi storytelling...',
    targetAudience: 'Adults 18-45, mythology enthusiasts, regional content viewers',
    language: 'Haryanvi with Hindi subtitles',
    productionCompany: 'Ravi Sharma Productions',
    productionType: 'Original',
    sourceMaterial: 'Original Script',
    ipRightsStatus: 'Owned',

    // Creator details
    creatorAge: '42',
    officialEmail: 'ravi@rsproductions.com',
    phone: '+91 98765 43210',
    panNumber: 'ABCDE1234F',
    gstNumber: '07ABCDE1234F1Z5',
    yearsOfExperience: '15',
    previousProjects: 'Haryanvi Nights (Web Series), Folklore Stories (YouTube)',

    // Complete crew details
    director: 'Rajesh Kumar',
    associateDirector: 'Neha Verma',
    assistantDirector1: 'Rahul Mehra',

    showRunner: 'Vikram Singh',
    creativeDirector: 'Anjali Kapoor',
    projectHead: 'Suresh Kumar',

    headOfProduction: 'Ramesh Gupta',
    executiveProducer: 'Manoj Sharma',
    lineProducer: 'Deepak Yadav',

    writer: 'Ravi Sharma',
    storyBy: 'Ravi Sharma',
    screenplayBy: 'Ravi Sharma',
    dialoguesBy: 'Rajesh Talwar',

    dop: 'Amit Singh',
    firstCameraOperator: 'Sameer Khan',
    steadicamOperator: 'Rohit Desai',

    editor: 'Priya Sharma',
    colorist: 'Vishal Mehta',
    onLocationEditor: 'Karan Johar',

    soundRecordist: 'Anil Kumar',
    soundDesigner: 'Resul Pookutty',
    foleyArtist: 'Sudhir Chandra',

    musicComposer: 'Suresh Wadkar',
    bgmComposer: 'Ajay-Atul',
    playbackSinger: 'Shreya Ghoshal',

    productionDesigner: 'Nitin Desai',
    artDirector: 'Sharmishta Roy',
    setDesigner: 'Rajat Poddar',

    costumeDesigner: 'Manish Malhotra',
    makeupArtist: 'Mickey Contractor',
    hairStylist: 'Avan Contractor',

    vfxSupervisor: 'Prasad Sutar',
    diArtist: 'Ashirwad Hadkar',

    castingDirector: 'Mukesh Chhabra',
    stillPhotographer: 'Avinash Gowariker',
    btsVideographer: 'Rohit Kumar',

    // Timeline
    shootStartDate: '2026-03-15',
    shootEndDate: '2026-07-30',
    shootDays: '120',
    finalDeliveryDate: '2026-11-15',

    // Budget breakdown
    budgetBreakdown: [
      { category: 'Cast', amount: 2200000, percentage: 20 },
      { category: 'Crew', amount: 1980000, percentage: 18 },
      { category: 'Production', amount: 2750000, percentage: 25 },
      { category: 'Post-Production', amount: 1650000, percentage: 15 },
      { category: 'Music & Songs', amount: 1320000, percentage: 12 },
      { category: 'Marketing', amount: 1100000, percentage: 10 },
    ],

    // Cast data
    castData: {
      primaryCast: [
        { id: '1', artistName: 'Yogesh Kumar', characterName: 'Vikram Singh', socialMediaLink: 'https://instagram.com/yogeshkumar', photographUrl: '' },
        { id: '2', artistName: 'Neetu Kapoor', characterName: 'Radha Devi', socialMediaLink: '', photographUrl: '' },
        { id: '3', artistName: 'Arjun Yadav', characterName: 'Suresh', socialMediaLink: '', photographUrl: '' },
      ],
      secondaryCast: [
        { id: '4', artistName: 'Rajesh Sharma', characterName: 'Village Chief', socialMediaLink: '', photographUrl: '' },
        { id: '5', artistName: 'Meena Kumari', characterName: 'Dai Maa', socialMediaLink: '', photographUrl: '' },
      ],
      tertiaryCast: [
        { id: '6', artistName: 'Various Local Artists', characterName: 'Village People', socialMediaLink: '', photographUrl: '' },
      ],
    },

    // Technical specs
    technicalSpecs: {
      cameraModel: 'ARRI Alexa Mini LF',
      cameraSetupType: 'double' as const,
      lensTypes: [
        { name: 'Zeiss Master Prime', quantity: 5 },
        { name: 'Cooke S4', quantity: 3 },
      ],
      cameraOthers: [],
      lightingEquipment: [
        { name: 'ARRI SkyPanel S60', quantity: 8 },
        { name: 'Aputure 600d', quantity: 4 },
      ],
      lightingOthers: [],
      cinematicTools: [
        { name: 'DJI Ronin 2', quantity: 2 },
      ],
      cinematicOthers: [],
      droneModels: [
        { name: 'DJI Inspire 2', quantity: 1 },
      ],
      droneOthers: [],
      soundEquipment: [
        { name: 'Sound Devices 888', quantity: 2 },
        { name: 'Sennheiser MKH 416', quantity: 4 },
      ],
      soundOthers: [],
    },

    // Uploaded files
    uploadedFiles: [
      { name: 'Mahapunarjanam_Script_Final.pdf', size: 2458000, type: 'application/pdf', uploadDate: '2026-01-28' },
      { name: 'Episode_Breakdown.xlsx', size: 156000, type: 'application/vnd.ms-excel', uploadDate: '2026-01-29' },
      { name: 'Vision_Deck.pdf', size: 8945000, type: 'application/pdf', uploadDate: '2026-01-29' },
    ],
    cloudLinks: [
      'https://drive.google.com/file/d/1234567890/character-references',
      'https://dropbox.com/s/abcdef/location-scouting',
    ],

    // Additional fields
    companyType: 'Private Limited',
    teamSize: '15-25',
    notableWorks: 'Haryanvi Folk Tales (YouTube Series), Regional Stories Collection',
    imdbLink: 'https://www.imdb.com/name/nm1234567/',
    portfolioLink: 'https://ravisharmaproductions.com/portfolio',
  },
  {
    id: 2,
    projectName: 'Urban Dreams',
    creator: 'Anjali Productions',
    culture: 'Rajasthani',
    format: 'Feature Film',
    genre: 'Romance/Drama',
    subGenre: 'Contemporary Romance',
    contentRating: 'U/A 16+',
    totalBudget: 85000000,
    completeness: 95,
    warnings: 0,
    status: 'approved',
    submittedDate: '2026-01-28',
    episodes: null,
    thumbnail: '/api/placeholder/400/225',

    // POC (Point of Contact)
    productionPOC: '',
    contentPOC: '',

    // Activity Log
    activityLog: [
      { date: '2026-01-28', time: '09:00 AM', action: 'Project Submitted', description: 'Creator submitted project for review', user: 'Anjali Verma', type: 'submit' },
      { date: '2026-01-28', time: '02:30 PM', action: 'Under Review', description: 'Content team reviewing project details', user: 'Content Head', type: 'review' },
      { date: '2026-01-29', time: '11:00 AM', action: 'Approved', description: 'Project approved for production', user: 'Production Head', type: 'approved' },
      { date: '2026-01-29', time: '03:45 PM', action: 'Pre-Production', description: 'Team preparing for production kickoff', user: 'Production Team', type: 'progress' },
    ],

    logline: 'Two aspiring artists navigate love and ambition in modern Rajasthan',
    synopsis: 'Urban Dreams follows the intertwining lives of a musician and a painter as they pursue their dreams in the vibrant city of Jaipur, exploring Rajasthani culture and modern aspirations...',
    targetAudience: 'Youth 18-35, urban audiences, romance fans',
    language: 'Rajasthani with Hindi subtitles',
    productionCompany: 'Anjali Productions Pvt Ltd',
    productionType: 'Original',

    creatorAge: '38',
    officialEmail: 'contact@anjaliproductions.in',
    phone: '+91 99887 76655',
    yearsOfExperience: '12',
    previousProjects: 'City Lights (Feature), Dreams Unfold (Web Series)',

    director: 'Meera Kapoor',
    associateDirector: 'Karan Johar',

    showRunner: 'Farhan Akhtar',
    executiveProducer: 'Ritesh Sidhwani',

    writer: 'Anjali Verma',
    screenplayBy: 'Anjali Verma',
    dialoguesBy: 'Javed Akhtar',

    dop: 'Vikram Malhotra',
    firstCameraOperator: 'Santosh Thundiyil',

    editor: 'Sanjay Leela',
    colorist: 'Navneet Singh',

    soundRecordist: 'Bishwadeep Chatterjee',
    soundDesigner: 'Anish John',

    musicComposer: 'AR Rahman',
    bgmComposer: 'Amit Trivedi',

    productionDesigner: 'Sabu Cyril',
    artDirector: 'Amrita Mahal',

    costumeDesigner: 'Anaita Shroff Adajania',
    makeupArtist: 'Clover Wootton',

    shootStartDate: '2026-04-01',
    shootEndDate: '2026-06-30',
    shootDays: '65',
    finalDeliveryDate: '2026-10-01',

    budgetBreakdown: [
      { category: 'Cast', amount: 25500000, percentage: 30 },
      { category: 'Crew', amount: 17000000, percentage: 20 },
      { category: 'Production', amount: 21250000, percentage: 25 },
      { category: 'Post-Production', amount: 12750000, percentage: 15 },
      { category: 'Music & Songs', amount: 5100000, percentage: 6 },
      { category: 'Marketing', amount: 3400000, percentage: 4 },
    ],

    castData: {
      primaryCast: [
        { id: '1', artistName: 'Rajkummar Rao', characterName: 'Aditya', socialMediaLink: 'https://instagram.com/rajkummar_rao', photographUrl: '' },
        { id: '2', artistName: 'Shraddha Kapoor', characterName: 'Maya', socialMediaLink: 'https://instagram.com/shraddhakapoor', photographUrl: '' },
      ],
      secondaryCast: [
        { id: '3', artistName: 'Pankaj Tripathi', characterName: 'Masterji', socialMediaLink: '', photographUrl: '' },
        { id: '4', artistName: 'Ratna Pathak Shah', characterName: "Aditya's Mother", socialMediaLink: '', photographUrl: '' },
      ],
      tertiaryCast: [],
    },

    technicalSpecs: {
      cameraModel: 'Sony Venice 2',
      cameraSetupType: 'triple' as const,
      lensTypes: [
        { name: 'Cooke Anamorphic/i', quantity: 6 },
      ],
      cameraOthers: [],
      lightingEquipment: [
        { name: 'ARRI M18', quantity: 6 },
        { name: 'Kino Flo', quantity: 10 },
      ],
      lightingOthers: [],
      cinematicTools: [
        { name: 'Chapman Crane', quantity: 1 },
        { name: 'DJI Ronin 4D', quantity: 2 },
      ],
      cinematicOthers: [],
      droneModels: [
        { name: 'DJI Inspire 3', quantity: 1 },
      ],
      droneOthers: [],
      soundEquipment: [
        { name: 'Sound Devices 833', quantity: 1 },
        { name: 'Schoeps CMIT 5U', quantity: 3 },
      ],
      soundOthers: [],
    },

    uploadedFiles: [
      { name: 'Urban_Dreams_Screenplay.pdf', size: 3200000, type: 'application/pdf', uploadDate: '2026-01-25' },
      { name: 'Shot_Division.pdf', size: 890000, type: 'application/pdf', uploadDate: '2026-01-26' },
      { name: 'Music_References.pdf', size: 1240000, type: 'application/pdf', uploadDate: '2026-01-26' },
    ],
    cloudLinks: ['https://drive.google.com/file/d/9876543210/complete-bible'],

    companyType: 'Private Limited Company',
    teamSize: '50+',
    notableWorks: 'City Lights (Feature Film), Dreams Unfold (Web Series), Urban Chronicles (Documentary)',
    imdbLink: 'https://www.imdb.com/name/nm9876543/',
    portfolioLink: 'https://anjaliproductions.in',
  },
  {
    id: 3,
    projectName: 'The Last Stand',
    creator: 'Cinematic Vision',
    culture: 'Haryanvi',
    format: 'Limited Series',
    genre: 'Action/Thriller',
    subGenre: 'Military Action',
    contentRating: 'A (Adults Only)',
    totalBudget: 120000000,
    completeness: 88,
    warnings: 3,
    status: 'under-review',
    submittedDate: '2026-01-27',
    episodes: 8,
    thumbnail: '/api/placeholder/400/225',

    // POC (Point of Contact)
    productionPOC: '',
    contentPOC: '',

    // Activity Log
    activityLog: [
      { date: '2026-01-27', time: '01:15 PM', action: 'Project Submitted', description: 'Creator submitted project for review', user: 'Rohit Mehra', type: 'submit' },
      { date: '2026-01-27', time: '04:00 PM', action: 'Initial Screening', description: 'Quality check completed', user: 'QC Team', type: 'review' },
      { date: '2026-01-28', time: '10:30 AM', action: 'Under Detailed Review', description: 'Content & Budget analysis in progress', user: 'Review Committee', type: 'review' },
      { date: '2026-01-29', time: '09:00 AM', action: 'Pending Clarification', description: 'Waiting for creator response on budget queries', user: 'Finance Team', type: 'pending' },
    ],

    logline: 'An elite military unit faces impossible odds in a high-stakes mission at the Haryana border',
    synopsis: 'The Last Stand is a gripping action thriller that follows a special forces team defending the Haryana border, showcasing the bravery and resilience of Haryanvi soldiers...',
    targetAudience: 'Adults 25-50, action enthusiasts, military drama fans',
    language: 'Haryanvi with Hindi subtitles',
    productionCompany: 'Cinematic Vision Studios',

    creatorAge: '45',
    officialEmail: 'info@cinematicvision.com',
    phone: '+91 98123 45678',
    yearsOfExperience: '20',

    director: 'Rohit Shetty',
    assistantDirector1: 'Amar Kaushik',

    executiveProducer: 'Karan Johar',
    lineProducer: 'Sanjay Routray',

    writer: 'Vijay Kumar',
    screenplayBy: 'Vijay Kumar',
    dialoguesBy: 'Sriram Raghavan',

    dop: 'Santosh Thundiyil',
    firstCameraOperator: 'Ayananka Bose',
    steadicamOperator: 'Sunil Patel',

    editor: 'Bunty Negi',
    colorist: 'Shantanu Kulkarni',

    soundRecordist: 'Nakul Kamte',
    soundDesigner: 'Justin Jose',

    musicComposer: 'Vishal-Shekhar',
    bgmComposer: 'Salim-Sulaiman',

    productionDesigner: 'Rajat Poddar',
    artDirector: 'Subrata Chakraborty',

    costumeDesigner: 'Eka Lakhani',

    vfxSupervisor: 'Red Chillies VFX Team',

    actionDirector: 'Sham Kaushal',
    stuntCoordinator: 'Parvez Shaikh',

    castingDirector: 'Shanoo Sharma',

    shootStartDate: '2026-05-01',
    shootEndDate: '2026-08-15',
    shootDays: '85',

    budgetBreakdown: [
      { category: 'Cast', amount: 36000000, percentage: 30 },
      { category: 'Crew', amount: 24000000, percentage: 20 },
      { category: 'Production', amount: 30000000, percentage: 25 },
      { category: 'Post-Production', amount: 18000000, percentage: 15 },
      { category: 'VFX & Action', amount: 9600000, percentage: 8 },
      { category: 'Marketing', amount: 2400000, percentage: 2 },
    ],

    castData: {
      primaryCast: [
        { id: '1', artistName: 'Vicky Kaushal', characterName: 'Major Arjun Saxena', socialMediaLink: 'https://instagram.com/vickykaushal09', photographUrl: '' },
        { id: '2', artistName: 'Kiara Advani', characterName: 'Captain Priya Nair', socialMediaLink: 'https://instagram.com/kiaraadvani', photographUrl: '' },
        { id: '3', artistName: 'Manoj Bajpayee', characterName: 'Colonel Rathore', socialMediaLink: '', photographUrl: '' },
      ],
      secondaryCast: [
        { id: '4', artistName: 'Kay Kay Menon', characterName: 'General Vikram', socialMediaLink: '', photographUrl: '' },
        { id: '5', artistName: 'Rajit Kapur', characterName: 'Defense Minister', socialMediaLink: '', photographUrl: '' },
      ],
      tertiaryCast: [
        { id: '6', artistName: 'Military Unit Cast', characterName: 'Special Forces Team', socialMediaLink: '', photographUrl: '' },
      ],
    },

    technicalSpecs: {
      cameraModel: 'RED V-Raptor 8K VV',
      cameraSetupType: 'triple' as const,
      lensTypes: [
        { name: 'Panavision G Series', quantity: 8 },
        { name: 'Zeiss Supreme Prime', quantity: 5 },
      ],
      cameraOthers: [],
      lightingEquipment: [
        { name: 'ARRI SkyPanel S360', quantity: 12 },
        { name: 'Aputure 1200d Pro', quantity: 6 },
      ],
      lightingOthers: [],
      cinematicTools: [
        { name: 'Chapman Super Nova Crane', quantity: 1 },
        { name: 'MōVI Pro', quantity: 3 },
      ],
      cinematicOthers: [],
      droneModels: [
        { name: 'DJI Inspire 3', quantity: 2 },
        { name: 'Freefly Alta X', quantity: 1 },
      ],
      droneOthers: [],
      soundEquipment: [
        { name: 'Sound Devices 888', quantity: 2 },
        { name: 'Sennheiser MKH 50', quantity: 6 },
      ],
      soundOthers: [],
    },

    uploadedFiles: [
      { name: 'The_Last_Stand_Script.pdf', size: 4100000, type: 'application/pdf', uploadDate: '2026-01-24' },
      { name: 'Action_Sequences_Breakdown.pdf', size: 2890000, type: 'application/pdf', uploadDate: '2026-01-25' },
      { name: 'VFX_References.pdf', size: 5670000, type: 'application/pdf', uploadDate: '2026-01-25' },
    ],
    cloudLinks: [
      'https://drive.google.com/file/d/action-choreography-videos',
    ],

    companyType: 'Production House',
    teamSize: '100+',
    notableWorks: 'Border 2.0 (Feature), Surgical Strike Series (Web Series)',
    imdbLink: 'https://www.imdb.com/name/nm5555555/',
  },
  {
    id: 4,
    projectName: 'Comedy Nights Special',
    creator: 'Laugh Factory Studios',
    culture: 'Bhojpuri',
    format: 'Microdrama',
    genre: 'Comedy',
    subGenre: 'Situational Comedy',
    contentRating: 'U/A 13+',
    totalBudget: 4500000,
    completeness: 78,
    warnings: 2,
    status: 'revision-requested',
    submittedDate: '2026-01-26',
    episodes: 15,
    thumbnail: '/api/placeholder/400/225',

    // POC (Point of Contact)
    productionPOC: '',
    contentPOC: '',

    // Activity Log
    activityLog: [
      { date: '2026-01-26', time: '11:00 AM', action: 'Project Submitted', description: 'Creator submitted project for review', user: 'Bhojpuri Films Co.', type: 'submit' },
      { date: '2026-01-26', time: '03:30 PM', action: 'Under Review', description: 'Initial review started', user: 'Content Team', type: 'review' },
      { date: '2026-01-27', time: '10:00 AM', action: 'Issues Identified', description: 'Technical specifications need updates', user: 'Technical Head', type: 'issue' },
      { date: '2026-01-27', time: '02:15 PM', action: 'Revision Requested', description: 'Sent back to creator for technical spec revisions and budget realignment', user: 'Admin Team', type: 'revision' },
      { date: '2026-01-28', time: '09:30 AM', action: 'Awaiting Response', description: 'Waiting for creator to resubmit with changes', user: 'System', type: 'pending' },
    ],

    logline: 'Hilarious misadventures of a Bhojpuri family in modern times',
    synopsis: 'Comedy Nights Special brings laughter through relatable family situations...',
    targetAudience: 'Family audiences 13+, comedy lovers, regional content viewers',
    language: 'Bhojpuri',

    creatorAge: '35',
    officialEmail: 'laughs@laughfactory.in',
    phone: '+91 97654 32109',
    yearsOfExperience: '8',

    director: 'Manoj Tiwari',
    writer: 'Ravi Kishan',

    shootStartDate: '2026-02-15',
    shootEndDate: '2026-04-30',
    shootDays: '45',

    budgetBreakdown: [
      { category: 'Cast', amount: 1350000, percentage: 30 },
      { category: 'Crew', amount: 900000, percentage: 20 },
      { category: 'Production', amount: 1125000, percentage: 25 },
      { category: 'Post-Production', amount: 675000, percentage: 15 },
      { category: 'Music', amount: 270000, percentage: 6 },
      { category: 'Marketing', amount: 180000, percentage: 4 },
    ],

    uploadedFiles: [],
    cloudLinks: ['https://drive.google.com/file/d/comedy-scripts-folder'],
  },
  {
    id: 5,
    projectName: 'Mor Bani Thangat Kare',
    creator: 'Gujarat Stories Production',
    culture: 'Gujarati',
    format: 'Long Series',
    genre: 'Family Drama/Romance',
    subGenre: 'Family Saga',
    contentRating: 'U/A 13+',
    totalBudget: 45000000,
    completeness: 85,
    warnings: 2,
    status: 'on-hold',
    submittedDate: '2026-01-25',
    episodes: 100,
    thumbnail: '/api/placeholder/400/225',

    // POC (Point of Contact)
    productionPOC: '',
    contentPOC: '',

    // Activity Log
    activityLog: [
      { date: '2026-01-25', time: '02:00 PM', action: 'Project Submitted', description: 'Creator submitted project for review', user: 'Gujarat Studios', type: 'submit' },
      { date: '2026-01-25', time: '05:30 PM', action: 'Under Review', description: 'Production team reviewing', user: 'Content Head', type: 'review' },
      { date: '2026-01-26', time: '11:00 AM', action: 'Budget Committee Review', description: 'High-value project - special approval needed', user: 'Finance Committee', type: 'review' },
      { date: '2026-01-27', time: '03:00 PM', action: 'Put On Hold', description: 'Temporarily paused pending market research for long series viability', user: 'Strategy Head', type: 'hold' },
      { date: '2026-01-28', time: '10:00 AM', action: 'Market Research', description: 'Conducting audience research for Gujarati long series', user: 'Research Team', type: 'progress' },
    ],

    logline: 'A multi-generational Gujarati family saga exploring love, tradition, and modern values',
    synopsis: 'Mor Bani Thangat Kare follows the lives of the Thakkar family across three generations in Ahmedabad. From traditional joint family values to modern individual aspirations, the story weaves together love, business rivalries, and cultural traditions in contemporary Gujarat.',
    targetAudience: 'Gujarati families, 18-60 age group, regional drama enthusiasts',
    language: 'Gujarati with Hindi subtitles',
    productionCompany: 'Gujarat Stories Production House',
    productionType: 'Original',
    sourceMaterial: 'Original Script',
    ipRightsStatus: 'Owned',

    // Creator details
    creatorAge: '48',
    officialEmail: 'contact@gujaratstories.com',
    phone: '+91 98250 12345',
    panNumber: 'AABCG1234H',
    gstNumber: '24AABCG1234H1Z5',
    yearsOfExperience: '18',
    previousProjects: 'Aapnu Gujarat (Web Series), Dhollywood Dreams (Feature Film), Garba Nights (YouTube Series)',
    companyType: 'Production House',
    teamSize: '25-50',
    notableWorks: 'Award-winning Gujarati content creator, 3 successful web series',
    imdbLink: 'https://www.imdb.com/name/nm3456789/',
    portfolioLink: 'https://gujaratstories.com/portfolio',

    // Complete crew details
    director: 'Vipul Mehta',
    associateDirector: 'Nayan Shah',
    assistantDirector1: 'Kinjal Rajput',

    showRunner: 'Hetal Gada',
    creativeDirector: 'Parthiv Gohil',
    projectHead: 'Manish Munshi',

    headOfProduction: 'Jignesh Mevani',
    executiveProducer: 'Siddharth Randeria',
    lineProducer: 'Bhavesh Bhatia',

    writer: 'Saumya Joshi',
    storyBy: 'Saumya Joshi',
    screenplayBy: 'Saumya Joshi & Vipul Mehta',
    dialoguesBy: 'Bhavesh Patel',

    dop: 'Rajeev Ravi',
    firstCameraOperator: 'Chirag Thakkar',
    steadicamOperator: 'Nirav Patel',

    editor: 'Hemanti Sarkar',
    colorist: 'Jayesh Modi',
    onLocationEditor: 'Pratik Vora',

    soundRecordist: 'Tapan Das',
    soundDesigner: 'Suketu Pandya',

    musicComposer: 'Sachin-Jigar',
    bgmComposer: 'Kedar-Bhargav',
    playbackSinger: 'Kinjal Dave',

    productionDesigner: 'Rupin Suchak',
    artDirector: 'Jayesh Sheth',
    setDesigner: 'Mona Thakkar',

    costumeDesigner: 'Varsha Thakkar',
    makeupArtist: 'Ekta Shah',
    hairStylist: 'Nisha Desai',

    castingDirector: 'Krunal Pandit',
    stillPhotographer: 'Viral Bhayani',
    btsVideographer: 'Mehul Parekh',

    // Timeline
    shootStartDate: '2026-04-15',
    shootEndDate: '2026-12-30',
    shootDays: '180',
    finalDeliveryDate: '2027-03-15',

    // Budget breakdown
    budgetBreakdown: [
      { category: 'Cast', amount: 13500000, percentage: 30 },
      { category: 'Crew', amount: 9000000, percentage: 20 },
      { category: 'Production', amount: 11250000, percentage: 25 },
      { category: 'Post-Production', amount: 6750000, percentage: 15 },
      { category: 'Music & Songs', amount: 2250000, percentage: 5 },
      { category: 'Marketing', amount: 2250000, percentage: 5 },
    ],

    // Cast data
    castData: {
      primaryCast: [
        { id: '1', artistName: 'Malhar Thakar', characterName: 'Karan Thakkar', socialMediaLink: 'https://instagram.com/malhar_thakar', photographUrl: '' },
        { id: '2', artistName: 'Aarohi Patel', characterName: 'Nandini Thakkar', socialMediaLink: 'https://instagram.com/aarohi_patel', photographUrl: '' },
        { id: '3', artistName: 'Siddharth Randeria', characterName: 'Hasmukh Thakkar (Grandfather)', socialMediaLink: '', photographUrl: '' },
        { id: '4', artistName: 'Aarti Patel', characterName: 'Kokila Thakkar (Grandmother)', socialMediaLink: '', photographUrl: '' },
      ],
      secondaryCast: [
        { id: '5', artistName: 'Vyom Thakkar', characterName: 'Harsh Thakkar', socialMediaLink: '', photographUrl: '' },
        { id: '6', artistName: 'Janki Bodiwala', characterName: 'Priya', socialMediaLink: '', photographUrl: '' },
        { id: '7', artistName: 'Pratik Gandhi', characterName: 'Rajesh Uncle', socialMediaLink: '', photographUrl: '' },
      ],
      tertiaryCast: [
        { id: '8', artistName: 'Muni Jha', characterName: 'Family Friend', socialMediaLink: '', photographUrl: '' },
        { id: '9', artistName: 'Raunaq Kamdar', characterName: 'Business Partner', socialMediaLink: '', photographUrl: '' },
      ],
    },

    // Technical specs
    technicalSpecs: {
      cameraModel: 'Sony FX6',
      cameraSetupType: 'double' as const,
      lensTypes: [
        { name: 'Sony G Master', quantity: 4 },
        { name: 'Sigma Art', quantity: 3 },
      ],
      cameraOthers: [],
      lightingEquipment: [
        { name: 'Aputure 300d', quantity: 6 },
        { name: 'LED Panel Lights', quantity: 12 },
      ],
      lightingOthers: [],
      cinematicTools: [
        { name: 'DJI RS 3 Pro', quantity: 2 },
        { name: 'Slider Rail', quantity: 1 },
      ],
      cinematicOthers: [],
      droneModels: [
        { name: 'DJI Mini 3 Pro', quantity: 1 },
      ],
      droneOthers: [],
      soundEquipment: [
        { name: 'Zoom F6', quantity: 1 },
        { name: 'Rode NTG5', quantity: 3 },
      ],
      soundOthers: [],
    },

    // Uploaded files
    uploadedFiles: [
      { name: 'Mor_Bani_Thangat_Kare_Script_Episodes_1-10.pdf', size: 5200000, type: 'application/pdf', uploadDate: '2026-01-23' },
      { name: 'Character_Bible.pdf', size: 1890000, type: 'application/pdf', uploadDate: '2026-01-24' },
      { name: 'Location_References_Gujarat.pdf', size: 3450000, type: 'application/pdf', uploadDate: '2026-01-24' },
    ],
    cloudLinks: [
      'https://drive.google.com/file/d/gujarati-series-complete-scripts',
      'https://drive.google.com/file/d/episode-wise-breakdown',
    ],
  },
  {
    id: 6,
    projectName: 'Rangmanch',
    creator: 'Indie Creators Collective',
    culture: 'Rajasthani',
    format: 'Mini Film',
    genre: 'Social Drama',
    subGenre: 'Experimental',
    contentRating: 'U/A 16+',
    totalBudget: 8500000,
    completeness: 88,
    warnings: 1,
    status: 'approved',
    submittedDate: '2026-01-29',
    episodes: null,
    thumbnail: '/api/placeholder/400/225',

    // POC (Point of Contact)
    productionPOC: '',
    contentPOC: '',

    // Activity Log
    activityLog: [
      { date: '2026-01-29', time: '08:00 AM', action: 'Project Submitted', description: 'Creator submitted project for review', user: 'Rajasthani Creations', type: 'submit' },
      { date: '2026-01-29', time: '12:30 PM', action: 'Fast Track Review', description: 'Mini film - expedited review process', user: 'Content Team', type: 'review' },
      { date: '2026-01-29', time: '04:00 PM', action: 'Quality Check Passed', description: 'All technical specs verified', user: 'QC Team', type: 'progress' },
      { date: '2026-01-30', time: '10:00 AM', action: 'Approved', description: 'Project approved for immediate production', user: 'Production Head', type: 'approved' },
    ],

    logline: 'A poignant exploration of street theater artists fighting for their art in modern Rajasthan',
    synopsis: 'Rangmanch tells the story of a traditional Rajasthani theater troupe struggling to keep their art form alive in the age of digital entertainment. Through three interconnected stories, it explores the passion, sacrifice, and resilience of artists who refuse to let their culture fade away.',
    targetAudience: 'Art lovers, 20-45 age group, indie cinema enthusiasts',
    language: 'Rajasthani with Hindi subtitles',
    productionCompany: 'Indie Creators Collective',
    productionType: 'Original',
    sourceMaterial: 'Original Script',
    ipRightsStatus: 'Owned',

    creatorAge: '32',
    officialEmail: 'hello@indiecreators.in',
    phone: '+91 98201 23456',
    panNumber: 'AABCI1234J',
    gstNumber: '27AABCI1234J1Z5',
    yearsOfExperience: '10',
    previousProjects: 'Zhala Bobhata (Short Film), Aamhi Kahi (Web Series)',
    companyType: 'Independent Production',
    teamSize: '10-15',

    director: 'Nagraj Manjule',
    dop: 'Sudhakar Reddy',
    editor: 'Abhijit Kokate',
    musicComposer: 'Ajay-Atul',
    writer: 'Vaibhav Tatwawaadi',
    screenplayBy: 'Vaibhav Tatwawaadi',

    shootStartDate: '2026-03-01',
    shootEndDate: '2026-03-25',
    shootDays: '20',
    finalDeliveryDate: '2026-05-15',

    budgetBreakdown: [
      { category: 'Cast', amount: 2125000, percentage: 25 },
      { category: 'Crew', amount: 1700000, percentage: 20 },
      { category: 'Production', amount: 2550000, percentage: 30 },
      { category: 'Post-Production', amount: 1275000, percentage: 15 },
      { category: 'Music & Songs', amount: 510000, percentage: 6 },
      { category: 'Marketing', amount: 340000, percentage: 4 },
    ],

    castData: {
      primaryCast: [
        { id: '1', artistName: 'Subodh Bhave', characterName: 'Vishwas Patil', socialMediaLink: '', photographUrl: '' },
        { id: '2', artistName: 'Sonali Kulkarni', characterName: 'Asha Rao', socialMediaLink: '', photographUrl: '' },
      ],
      secondaryCast: [
        { id: '3', artistName: 'Pushkar Jog', characterName: 'Younger Actor', socialMediaLink: '', photographUrl: '' },
      ],
      tertiaryCast: [],
    },

    technicalSpecs: {
      cameraModel: 'Blackmagic Pocket 6K Pro',
      cameraSetupType: 'single' as const,
      lensTypes: [
        { name: 'Canon EF Cinema', quantity: 3 },
      ],
      cameraOthers: [],
      lightingEquipment: [
        { name: 'Godox VL300', quantity: 4 },
      ],
      lightingOthers: [],
      cinematicTools: [
        { name: 'Zhiyun Crane 3S', quantity: 1 },
      ],
      cinematicOthers: [],
      droneModels: [],
      droneOthers: [],
      soundEquipment: [
        { name: 'Zoom F8n', quantity: 1 },
      ],
      soundOthers: [],
    },

    uploadedFiles: [
      { name: 'Rangmanch_Script.pdf', size: 1890000, type: 'application/pdf', uploadDate: '2026-01-27' },
      { name: 'Theater_References.pdf', size: 980000, type: 'application/pdf', uploadDate: '2026-01-28' },
    ],
    cloudLinks: [],
  },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'analytics' | 'budget'>('overview');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterFormat, setFilterFormat] = useState<string>('all');
  const [filterCulture, setFilterCulture] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [detailView, setDetailView] = useState<'overview' | 'budget' | 'crew' | 'timeline' | 'activity' | 'files' | 'agreement'>('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [showStatusMenu, setShowStatusMenu] = useState<number | null>(null);
  const [submissions, setSubmissions] = useState<any[]>(sampleSubmissions);
  const [localSubmissionsLoaded, setLocalSubmissionsLoaded] = useState(false);
  const [expandedBudgetCulture, setExpandedBudgetCulture] = useState<string | null>(null);

  // Load submissions from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !localSubmissionsLoaded) {
      const localSubmissions = JSON.parse(localStorage.getItem('stage_submissions') || '[]');
      if (localSubmissions.length > 0) {
        // Transform local submissions to match the format
        const transformedSubmissions = localSubmissions.map((sub: any, idx: number) => ({
          id: 1000 + idx,
          projectName: sub.projectName || 'Untitled Project',
          creator: sub.creatorName || 'Unknown Creator',
          culture: sub.culture || 'Not Specified',
          format: sub.format || 'Not Specified',
          genre: sub.genre || 'Not Specified',
          subGenre: sub.subGenre || '',
          contentRating: sub.contentRating || 'Not Rated',
          totalBudget: parseFloat(sub.estimatedBudget) || 0,
          completeness: 50, // Placeholder
          warnings: 0,
          status: sub.status || 'pending',
          submittedDate: sub.submitted_at ? sub.submitted_at.split('T')[0] : new Date().toISOString().split('T')[0],
          episodes: sub.episodesPerSeason || 1,
          thumbnail: '/api/placeholder/400/225',
          productionPOC: '',
          contentPOC: '',
          activityLog: [
            {
              date: sub.submitted_at ? sub.submitted_at.split('T')[0] : new Date().toISOString().split('T')[0],
              time: sub.submitted_at ? new Date(sub.submitted_at).toLocaleTimeString() : new Date().toLocaleTimeString(),
              action: 'Project Submitted',
              description: 'Creator submitted project for review (via local storage)',
              user: sub.creatorName || 'Creator',
              type: 'submit'
            }
          ],
          // Include all the original data
          ...sub,
          isLocalSubmission: true,
        }));

        setSubmissions([...transformedSubmissions, ...sampleSubmissions]);
      }
      setLocalSubmissionsLoaded(true);
    }
  }, [localSubmissionsLoaded]);
  const [expandedBudgetStatus, setExpandedBudgetStatus] = useState<string | null>(null);
  const [editingPOC, setEditingPOC] = useState<{ submissionId: number; field: 'productionPOC' | 'contentPOC' } | null>(null);
  const [tempPOCValue, setTempPOCValue] = useState<string>('');

  const formatBudget = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatBudgetInWords = (amount: number) => {
    const crores = Math.floor(amount / 10000000);
    const lakhs = Math.floor((amount % 10000000) / 100000);
    const thousands = Math.floor((amount % 100000) / 1000);

    const parts = [];
    if (crores > 0) parts.push(`${crores} Crore${crores > 1 ? 's' : ''}`);
    if (lakhs > 0) parts.push(`${lakhs} Lakh${lakhs > 1 ? 's' : ''}`);
    if (thousands > 0) parts.push(`${thousands} Thousand`);

    return parts.length > 0 ? `₹${parts.join(' ')}` : '₹0';
  };

  // Check if submission is new (submitted in last 48 hours)
  const isNewSubmission = (submittedDate: string) => {
    const submitted = new Date(submittedDate);
    const now = new Date();
    const hoursDiff = (now.getTime() - submitted.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 48;
  };

  // Format time elapsed since submission
  const getTimeElapsed = (submittedDate: string) => {
    const submitted = new Date(submittedDate);
    const now = new Date();
    const hoursDiff = Math.floor((now.getTime() - submitted.getTime()) / (1000 * 60 * 60));
    const minutesDiff = Math.floor((now.getTime() - submitted.getTime()) / (1000 * 60));

    if (minutesDiff < 60) {
      return `${minutesDiff} minute${minutesDiff !== 1 ? 's' : ''} ago`;
    } else if (hoursDiff < 24) {
      return `${hoursDiff} hour${hoursDiff !== 1 ? 's' : ''} ago`;
    } else {
      const daysDiff = Math.floor(hoursDiff / 24);
      return `${daysDiff} day${daysDiff !== 1 ? 's' : ''} ago`;
    }
  };

  // Format date consistently across server and client
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format date with month name (short)
  const formatDateWithMonth = (dateString: string | Date) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Format date with full month name
  const formatDateLong = (dateString: string | Date) => {
    const date = new Date(dateString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Count new submissions
  const newSubmissionsCount = submissions.filter(s => isNewSubmission(s.submittedDate)).length;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { color: 'from-green-500 to-emerald-600', icon: '✓ APPROVED', text: 'Approved', badge: 'bg-green-100 border-green-500 text-green-800' };
      case 'under-review':
        return { color: 'from-blue-500 to-cyan-600', icon: '👁 REVIEW', text: 'Under Review', badge: 'bg-blue-100 border-blue-500 text-blue-800' };
      case 'pending':
        return { color: 'from-yellow-500 to-orange-600', icon: '⏳ PENDING', text: 'Pending', badge: 'bg-yellow-100 border-yellow-500 text-yellow-800' };
      case 'revision-requested':
        return { color: 'from-purple-500 to-pink-600', icon: '📝 REVISION', text: 'Revision Needed', badge: 'bg-purple-100 border-purple-500 text-purple-800' };
      case 'on-hold':
        return { color: 'from-orange-500 to-amber-600', icon: '⏸ ON HOLD', text: 'On Hold', badge: 'bg-orange-100 border-orange-500 text-orange-800' };
      case 'scrapped':
        return { color: 'from-gray-500 to-gray-600', icon: '🗑 SCRAPPED', text: 'Scrapped', badge: 'bg-gray-100 border-gray-500 text-gray-800' };
      case 'in-production':
        return { color: 'from-cyan-500 to-blue-600', icon: '🎬 PRODUCTION', text: 'In Production', badge: 'bg-cyan-100 border-cyan-500 text-cyan-800' };
      default:
        return { color: 'from-gray-500 to-gray-600', icon: '• ' + status.toUpperCase(), text: status, badge: 'bg-gray-100 border-gray-500 text-gray-800' };
    }
  };

  const handleStatusChange = (submissionId: number, newStatus: string) => {
    // Find the submission for auto-export
    const submission = submissions.find(s => s.id === submissionId);

    // Update submission status
    setSubmissions(prevSubmissions =>
      prevSubmissions.map(s =>
        s.id === submissionId ? { ...s, status: newStatus } : s
      )
    );

    // Update selectedSubmission if it's the one being changed
    if (selectedSubmission && selectedSubmission.id === submissionId) {
      setSelectedSubmission({ ...selectedSubmission, status: newStatus });
    }

    // Auto-export agreement when moving to production
    if (newStatus === 'in-production' && submission) {
      setTimeout(() => {
        exportToExcel(submission);
        alert(`🎬 Project "${submission.projectName}" moved to Production!\n\nAgreement Excel has been automatically downloaded with all project details.`);
      }, 300);
    }

    setShowStatusMenu(null);
    console.log(`Changed submission ${submissionId} to status: ${newStatus}`);
  };

  const handleDeleteProject = (submissionId: number) => {
    // Remove submission from list
    setSubmissions(prevSubmissions =>
      prevSubmissions.filter(s => s.id !== submissionId)
    );

    setShowDeleteConfirm(null);
    console.log(`Deleted submission ${submissionId}`);
  };

  // Export to Excel function
  const exportToExcel = (submission: any) => {
    const agreementDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Sheet 1: Agreement Summary
    const summaryData = [
      ['STAGE OTT - PROJECT AGREEMENT DETAILS'],
      [''],
      ['1. AGREEMENT DATE', agreementDate],
      [''],
      ['2. CONTENT NAME', submission.projectName || 'N/A'],
      ['   Culture', submission.culture || 'N/A'],
      ['   Format', submission.format || 'N/A'],
      ['   Genre', submission.genre || 'N/A'],
      [''],
      ['3. CREATOR / COMPANY DETAILS'],
      ['   Name', submission.creatorName || submission.creator || 'N/A'],
      ['   Company', submission.productionCompany || 'N/A'],
      ['   Father\'s Name', submission.fatherName || 'N/A'],
      ['   Authorized Signatory', submission.authorizedSignatory || 'N/A'],
      ['   Address', submission.permanentAddress || submission.currentAddress || 'N/A'],
      ['   PAN Number', submission.panNumber || 'N/A'],
      ['   GST Number', submission.gstNumber || 'N/A'],
      ['   Email', submission.officialEmail || 'N/A'],
      ['   Phone', submission.phone || 'N/A'],
      [''],
      ['4. TOTAL BUDGET', formatBudgetInWords(submission.totalBudget || parseFloat(submission.estimatedBudget) || 0)],
      ['   In Figures', `₹${(submission.totalBudget || parseFloat(submission.estimatedBudget) || 0).toLocaleString('en-IN')}`],
      [''],
      ['5. DIRECTOR & WRITER'],
      ['   Director', submission.director || 'N/A'],
      ['   Story By', submission.storyBy || 'N/A'],
      ['   Screenplay By', submission.screenplayBy || 'N/A'],
      ['   Dialogues By', submission.dialoguesBy || 'N/A'],
      [''],
      ['6. CONTENT DURATION & EPISODES'],
      ['   Total Duration (mins)', submission.totalDuration || 'N/A'],
      ['   Number of Episodes', submission.episodes || submission.episodesPerSeason || 'N/A'],
      ['   Format', submission.format || 'N/A'],
      [''],
      ['7. PROJECT DELIVERY DATE'],
      ['   Final Delivery', submission.contentTimeline?.finalDeliveryDate || 'N/A'],
      ['   Shoot Start Date', submission.shootStartDate || 'N/A'],
      ['   Shoot End Date', submission.shootEndDate || 'N/A'],
      ['   Total Shoot Days', submission.shootDays || 'N/A'],
      [''],
      ['8. CONTENT CREATION SCHEDULE'],
      ['   Pre-Production Start', submission.contentTimeline?.preProductionStart || 'N/A'],
      ['   Pre-Production End', submission.contentTimeline?.preProductionEnd || 'N/A'],
      ['   Principal Photography', `${submission.shootStartDate || 'N/A'} to ${submission.shootEndDate || 'N/A'}`],
      ['   Post-Production Start', submission.contentTimeline?.postProductionStart || 'N/A'],
      ['   Post-Production End', submission.contentTimeline?.postProductionEnd || 'N/A'],
      [''],
      ['9. TECHNICAL SPECIFICATIONS'],
      ['   Camera Model', submission.technicalSpecs?.cameraModel || 'N/A'],
      ['   Camera Setup', submission.technicalSpecs?.cameraSetupType || 'N/A'],
      ['   Number of Lens Types', submission.technicalSpecs?.lensTypes?.length || 0],
      ['   Lighting Equipment', submission.technicalSpecs?.lightingEquipment?.length || 0],
      ['   Sound Equipment', submission.technicalSpecs?.soundEquipment?.length || 0],
      ['   Drones', submission.technicalSpecs?.droneModels?.length || 0],
    ];

    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    ws1['!cols'] = [{ wch: 30 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Agreement Summary');

    // Sheet 2: Cash Flow / Payment Terms
    const cashFlowData = [
      ['CASH FLOW - PAYMENT TERMS'],
      [''],
      ['Tranche', 'Milestone', 'Percentage', 'Amount', 'Date'],
    ];
    if (submission.cashFlowTranches && submission.cashFlowTranches.length > 0) {
      submission.cashFlowTranches.forEach((tranche: any, idx: number) => {
        cashFlowData.push([
          `Tranche ${idx + 1}`,
          tranche.milestone || '',
          tranche.percentage ? `${tranche.percentage}%` : '',
          tranche.amount ? `₹${tranche.amount.toLocaleString('en-IN')}` : '',
          tranche.date || ''
        ]);
      });
    } else {
      cashFlowData.push(['No cash flow tranches defined', '', '', '', '']);
    }
    const ws2 = XLSX.utils.aoa_to_sheet(cashFlowData);
    ws2['!cols'] = [{ wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Cash Flow');

    // Sheet 3: Budget Breakdown
    const budgetData = [
      ['BUDGET SHEET - CATEGORY WISE BREAKDOWN'],
      [''],
      ['Category', 'Amount (₹)', 'Percentage'],
    ];
    if (submission.budgetBreakdown && submission.budgetBreakdown.length > 0) {
      submission.budgetBreakdown.forEach((item: any) => {
        budgetData.push([
          item.category || '',
          item.amount ? `₹${item.amount.toLocaleString('en-IN')}` : '₹0',
          item.percentage ? `${item.percentage}%` : ''
        ]);
      });
    }
    budgetData.push(['']);
    budgetData.push(['TOTAL BUDGET', formatBudgetInWords(submission.totalBudget || 0), '100%']);
    const ws3 = XLSX.utils.aoa_to_sheet(budgetData);
    ws3['!cols'] = [{ wch: 35 }, { wch: 25 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws3, 'Budget Sheet');

    // Sheet 4: Key Crew
    const crewData = [
      ['KEY CREW DETAILS'],
      [''],
      ['Department', 'Role', 'Name'],
      ['Direction', 'Director', submission.director || 'N/A'],
      ['Direction', 'Associate Director', submission.associateDirector || 'N/A'],
      ['Direction', 'Assistant Director', submission.assistantDirector1 || 'N/A'],
      ['Production', 'Head of Production', submission.headOfProduction || 'N/A'],
      ['Production', 'Executive Producer', submission.executiveProducer || 'N/A'],
      ['Production', 'Line Producer', submission.lineProducer || 'N/A'],
      ['Writing', 'Story', submission.storyBy || 'N/A'],
      ['Writing', 'Screenplay', submission.screenplayBy || 'N/A'],
      ['Writing', 'Dialogues', submission.dialoguesBy || 'N/A'],
      ['Camera', 'DOP', submission.dop || 'N/A'],
      ['Camera', 'Camera Operator', submission.cameraOperator || 'N/A'],
      ['Post-Production', 'Editor', submission.editor || 'N/A'],
      ['Post-Production', 'Colorist', submission.colorist || 'N/A'],
      ['Sound', 'Sound Designer', submission.soundDesigner || 'N/A'],
      ['Sound', 'Sound Recordist', submission.soundRecordist || 'N/A'],
      ['Music', 'Music Composer', submission.musicComposer || 'N/A'],
      ['Art', 'Production Designer', submission.productionDesigner || 'N/A'],
      ['Costume', 'Costume Designer', submission.costumeDesigner || 'N/A'],
      ['VFX', 'VFX Supervisor', submission.vfxSupervisor || 'N/A'],
    ];
    const ws4 = XLSX.utils.aoa_to_sheet(crewData);
    ws4['!cols'] = [{ wch: 20 }, { wch: 25 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws4, 'Key Crew');

    // Download
    const fileName = `Agreement_${submission.projectName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Project'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Export to PDF function (generates printable HTML)
  const exportToPDF = (submission: any) => {
    const agreementDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Agreement - ${submission.projectName || 'Project'}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          h1 { text-align: center; border-bottom: 3px solid #333; padding-bottom: 10px; }
          h2 { background: #f5f5f5; padding: 10px; margin-top: 30px; border-left: 4px solid #e53e3e; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; color: #555; }
          .value { text-align: right; }
          .highlight { font-size: 24px; color: #16a34a; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background: #f5f5f5; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #888; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <h1>STAGE OTT - PROJECT AGREEMENT</h1>

        <h2>1. Agreement Date</h2>
        <div class="row"><span class="label">Date:</span><span class="value">${agreementDate}</span></div>

        <h2>2. Content Name</h2>
        <div class="row"><span class="label">Project Name:</span><span class="value">${submission.projectName || 'N/A'}</span></div>
        <div class="row"><span class="label">Culture:</span><span class="value">${submission.culture || 'N/A'}</span></div>
        <div class="row"><span class="label">Format:</span><span class="value">${submission.format || 'N/A'}</span></div>

        <h2>3. Creator / Company Details</h2>
        <div class="row"><span class="label">Name:</span><span class="value">${submission.creatorName || submission.creator || 'N/A'}</span></div>
        <div class="row"><span class="label">Company:</span><span class="value">${submission.productionCompany || 'N/A'}</span></div>
        <div class="row"><span class="label">Father's Name:</span><span class="value">${submission.fatherName || 'N/A'}</span></div>
        <div class="row"><span class="label">Authorized Signatory:</span><span class="value">${submission.authorizedSignatory || 'N/A'}</span></div>
        <div class="row"><span class="label">Address:</span><span class="value">${submission.permanentAddress || submission.currentAddress || 'N/A'}</span></div>
        <div class="row"><span class="label">PAN Number:</span><span class="value">${submission.panNumber || 'N/A'}</span></div>
        <div class="row"><span class="label">GST Number:</span><span class="value">${submission.gstNumber || 'N/A'}</span></div>
        <div class="row"><span class="label">Email:</span><span class="value">${submission.officialEmail || 'N/A'}</span></div>
        <div class="row"><span class="label">Phone:</span><span class="value">${submission.phone || 'N/A'}</span></div>

        <h2>4. Total Budget</h2>
        <div class="row"><span class="label">Amount:</span><span class="value highlight">${formatBudgetInWords(submission.totalBudget || parseFloat(submission.estimatedBudget) || 0)}</span></div>

        <h2>5. Director & Writer</h2>
        <div class="row"><span class="label">Director:</span><span class="value">${submission.director || 'N/A'}</span></div>
        <div class="row"><span class="label">Story By:</span><span class="value">${submission.storyBy || 'N/A'}</span></div>
        <div class="row"><span class="label">Screenplay:</span><span class="value">${submission.screenplayBy || 'N/A'}</span></div>
        <div class="row"><span class="label">Dialogues:</span><span class="value">${submission.dialoguesBy || 'N/A'}</span></div>

        <h2>6. Content Duration & Episodes</h2>
        <div class="row"><span class="label">Total Duration:</span><span class="value">${submission.totalDuration || 'N/A'} minutes</span></div>
        <div class="row"><span class="label">Episodes:</span><span class="value">${submission.episodes || submission.episodesPerSeason || 'N/A'}</span></div>

        <h2>7. Project Delivery Date</h2>
        <div class="row"><span class="label">Final Delivery:</span><span class="value">${submission.contentTimeline?.finalDeliveryDate || 'N/A'}</span></div>
        <div class="row"><span class="label">Shoot Period:</span><span class="value">${submission.shootStartDate || 'N/A'} to ${submission.shootEndDate || 'N/A'}</span></div>

        <h2>8. Cash Flow (Payment Terms)</h2>
        <table>
          <tr><th>Tranche</th><th>Milestone</th><th>Percentage/Amount</th></tr>
          ${submission.cashFlowTranches?.map((t: any, i: number) => `
            <tr><td>Tranche ${i + 1}</td><td>${t.milestone || '-'}</td><td>${t.percentage ? t.percentage + '%' : formatBudget(t.amount || 0)}</td></tr>
          `).join('') || '<tr><td colspan="3">No tranches defined</td></tr>'}
        </table>

        <h2>9. Content Creation Schedule</h2>
        <div class="row"><span class="label">Pre-Production:</span><span class="value">${submission.contentTimeline?.preProductionStart || 'N/A'} - ${submission.contentTimeline?.preProductionEnd || 'N/A'}</span></div>
        <div class="row"><span class="label">Principal Photography:</span><span class="value">${submission.shootStartDate || 'N/A'} - ${submission.shootEndDate || 'N/A'} (${submission.shootDays || 'N/A'} days)</span></div>
        <div class="row"><span class="label">Post-Production:</span><span class="value">${submission.contentTimeline?.postProductionStart || 'N/A'} - ${submission.contentTimeline?.postProductionEnd || 'N/A'}</span></div>

        <h2>10. Technical Specifications</h2>
        <div class="row"><span class="label">Camera:</span><span class="value">${submission.technicalSpecs?.cameraModel || 'N/A'} (${submission.technicalSpecs?.cameraSetupType || 'N/A'})</span></div>

        <div class="footer">
          <p>Generated on ${agreementDate} | STAGE OTT Creator Portal</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const handleStartEditPOC = (submissionId: number, field: 'productionPOC' | 'contentPOC', currentValue: string) => {
    setEditingPOC({ submissionId, field });
    setTempPOCValue(currentValue || '');
  };

  const handleSavePOC = () => {
    if (!editingPOC) return;

    // Update submission POC
    setSubmissions(prevSubmissions =>
      prevSubmissions.map(s =>
        s.id === editingPOC.submissionId
          ? { ...s, [editingPOC.field]: tempPOCValue }
          : s
      )
    );

    // Update selectedSubmission if it's the one being changed
    if (selectedSubmission && selectedSubmission.id === editingPOC.submissionId) {
      setSelectedSubmission({ ...selectedSubmission, [editingPOC.field]: tempPOCValue });
    }

    setEditingPOC(null);
    setTempPOCValue('');
  };

  const handleCancelEditPOC = () => {
    setEditingPOC(null);
    setTempPOCValue('');
  };

  // Only approved and in-production projects for budget calculation
  const approvedProjects = submissions.filter(s =>
    s.status === 'approved' || s.status === 'in-production'
  );

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    underReview: submissions.filter(s => s.status === 'under-review').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    revisionRequested: submissions.filter(s => s.status === 'revision-requested').length,
    onHold: submissions.filter(s => s.status === 'on-hold').length,
    scrapped: submissions.filter(s => s.status === 'scrapped').length,
    inProduction: submissions.filter(s => s.status === 'in-production').length,

    // Total budget only from approved/in-production projects
    totalBudget: approvedProjects.reduce((sum, s) => sum + s.totalBudget, 0),

    // Format breakdown
    byFormat: submissions.reduce((acc: any, s) => {
      acc[s.format] = (acc[s.format] || 0) + 1;
      return acc;
    }, {}),

    // Culture breakdown with project count
    byCulture: submissions.reduce((acc: any, s) => {
      acc[s.culture] = (acc[s.culture] || 0) + 1;
      return acc;
    }, {}),

    // Budget by Culture - only approved/in-production
    budgetByCulture: approvedProjects.reduce((acc: any, s) => {
      acc[s.culture] = (acc[s.culture] || 0) + s.totalBudget;
      return acc;
    }, {}),

    // Culture with Format subsections
    cultureWithFormats: submissions.reduce((acc: any, s) => {
      if (!acc[s.culture]) {
        acc[s.culture] = {};
      }
      acc[s.culture][s.format] = (acc[s.culture][s.format] || 0) + 1;
      return acc;
    }, {}),
  };

  const filteredSubmissions = submissions
    .filter(s => {
      const statusMatch = filterStatus === 'all' || s.status === filterStatus;
      const formatMatch = filterFormat === 'all' || s.format === filterFormat;
      const cultureMatch = filterCulture === 'all' || s.culture === filterCulture;
      return statusMatch && formatMatch && cultureMatch;
    })
    .sort((a, b) => {
      // Sort by submission date - newest first
      const dateA = new Date(a.submittedDate).getTime();
      const dateB = new Date(b.submittedDate).getTime();
      return dateB - dateA;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-red-600/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-600/10 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl bg-black/20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <Image
                  src="/images/stage-logo-official.png"
                  alt="STAGE OTT"
                  width={150}
                  height={45}
                  className="h-12 w-auto"
                />
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`relative px-4 py-2 text-sm font-bold transition-all rounded-lg ${
                      activeTab === 'overview'
                        ? 'text-white bg-red-600 shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Overview
                    {activeTab === 'overview' && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('submissions')}
                    className={`relative px-4 py-2 text-sm font-bold transition-all rounded-lg ${
                      activeTab === 'submissions'
                        ? 'text-white bg-red-600 shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Submissions
                    {newSubmissionsCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-gray-900">
                        {newSubmissionsCount}
                      </span>
                    )}
                    {activeTab === 'submissions' && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`relative px-4 py-2 text-sm font-bold transition-all rounded-lg ${
                      activeTab === 'analytics'
                        ? 'text-white bg-red-600 shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Analytics
                    {activeTab === 'analytics' && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('budget')}
                    className={`relative px-4 py-2 text-sm font-bold transition-all rounded-lg ${
                      activeTab === 'budget'
                        ? 'text-white bg-red-600 shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Budget
                    {activeTab === 'budget' && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </button>
                </nav>
              </div>
              <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    className="relative p-2.5 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 hover:bg-white/20 transition-all group"
                    onClick={() => {
                      // Scroll to new submissions
                      document.getElementById('project-results')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }}
                  >
                    <span className="text-2xl">🔔</span>
                    {newSubmissionsCount > 0 && (
                      <div className="absolute -top-1 -right-1 min-w-[24px] h-6 px-1.5 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <span className="text-xs font-black text-white">{newSubmissionsCount}</span>
                      </div>
                    )}
                  </button>
                  {newSubmissionsCount > 0 && (
                    <div className="absolute -bottom-8 right-0 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {newSubmissionsCount} New Submission{newSubmissionsCount !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-lg px-4 py-2 border border-white/20">
                  <div className="text-xs text-gray-400">Admin</div>
                  <div className="text-sm font-bold">STAGE Production Team</div>
                </div>
                <Link href="/" className="text-sm font-bold text-gray-400 hover:text-white">
                  Exit →
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Filmmaker Quote */}
          <div className="mb-6 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border-2 border-amber-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🎬</span>
              <div className="flex-1">
                <p className="text-lg md:text-xl font-bold text-amber-900 italic mb-2">
                  "सिनेमा समाज का दर्पण नहीं, बल्कि वह खिड़की है जिससे हम दुनिया को देखते हैं।"
                </p>
                <p className="text-sm font-bold text-amber-800">— सत्यजीत रे (Satyajit Ray)</p>
              </div>
            </div>
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <>
          {/* Welcome Banner */}
          <div className="mb-8 bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide flex items-center gap-2">
                  <span className="text-lg">👤</span>
                  <span>Admin Dashboard</span>
                </div>
                <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  STAGE Production Team
                </h1>
                <p className="text-gray-700 font-bold text-lg">
                  Content Management & Review Platform
                </p>
              </div>
              <div className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
                <div className="text-base font-bold text-green-800 mb-5 flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  <span>Total Project Value</span>
                </div>

                {/* Culture-wise Budget Breakdown - Clickable & Expandable */}
                <div className="space-y-3 mb-4">
                  {Object.entries(stats.budgetByCulture).map(([culture, budget]) => {
                    const cultureApprovedProjects = approvedProjects.filter(p => p.culture === culture);
                    const isExpanded = expandedBudgetCulture === culture;

                    return (
                      <div key={culture} className="bg-white rounded-xl border-2 border-green-200 overflow-hidden shadow-sm">
                        {/* Culture Header - Clickable */}
                        <button
                          onClick={() => setExpandedBudgetCulture(isExpanded ? null : culture)}
                          className="w-full flex items-center justify-between p-4 hover:bg-green-50 transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-green-700">{isExpanded ? '▼' : '▶'}</span>
                            <span className="text-base font-bold text-gray-900">{culture}</span>
                            <span className="text-xs font-bold text-gray-600 bg-green-100 px-2 py-1 rounded-full">
                              {cultureApprovedProjects.length} approved
                            </span>
                          </div>
                          <span className="text-base font-black text-green-700">{formatBudgetInWords(budget as number)}</span>
                        </button>

                        {/* Expanded Project List */}
                        {isExpanded && (
                          <div className="border-t-2 border-green-200 bg-green-50 p-3 space-y-2">
                            {cultureApprovedProjects.map((project) => (
                              <div
                                key={project.id}
                                className="flex items-center justify-between bg-white rounded-xl p-4 hover:shadow-md transition-all cursor-pointer border border-green-200"
                                onClick={() => setSelectedSubmission(project)}
                              >
                                <div className="flex-1">
                                  <div className="text-sm font-bold text-gray-900 mb-1">{project.projectName}</div>
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="px-2 py-1 bg-purple-100 border border-purple-300 rounded-lg text-purple-800 font-bold">{project.format}</span>
                                    <span className={`px-2 py-1 rounded-lg font-bold ${getStatusConfig(project.status).badge}`}>
                                      {getStatusConfig(project.status).text}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-sm font-black text-green-700">
                                  {formatBudgetInWords(project.totalBudget)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Total */}
                <div className="pt-4 border-t-2 border-green-300">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-gray-900 uppercase tracking-wide">GRAND TOTAL</span>
                    <span className="text-3xl font-black text-green-700">
                      {formatBudgetInWords(stats.totalBudget)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid - Clickable Status Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8" id="status-cards">
            <button
              onClick={() => {
                setFilterStatus('all');
                setFilterFormat('all');
                setFilterCulture('all');
                // Scroll to results
                setTimeout(() => {
                  document.getElementById('project-results')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
              }}
              className={`bg-white border-4 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 shadow-lg text-left relative ${
                filterStatus === 'all' ? 'border-red-500 shadow-2xl scale-105 ring-4 ring-red-200' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {filterStatus === 'all' && (
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-black">✓</span>
                </div>
              )}
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">📊</span>
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">TOTAL</span>
              </div>
              <div className="text-4xl font-black mb-1 text-gray-900">{stats.total}</div>
              <div className="text-sm font-bold text-gray-600">Projects</div>
            </button>

            <button
              onClick={() => {
                setFilterStatus('pending');
                setFilterFormat('all');
                setFilterCulture('all');
                // Scroll to results
                setTimeout(() => {
                  document.getElementById('project-results')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
              }}
              className={`bg-gradient-to-br from-yellow-50 to-orange-50 border-4 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 shadow-lg text-left relative ${
                filterStatus === 'pending' ? 'border-yellow-500 shadow-2xl scale-105 ring-4 ring-yellow-200' : 'border-yellow-200 hover:border-yellow-300'
              }`}
            >
              {filterStatus === 'pending' && (
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-black">✓</span>
                </div>
              )}
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">⏳</span>
                <span className="text-xs font-bold text-yellow-700 uppercase tracking-wide">PENDING</span>
              </div>
              <div className="text-4xl font-black mb-1 text-yellow-700">{stats.pending}</div>
              <div className="text-sm font-bold text-yellow-600">Awaiting</div>
            </button>

            <button
              onClick={() => {
                setFilterStatus('under-review');
                setFilterFormat('all');
                setFilterCulture('all');
                // Scroll to results
                setTimeout(() => {
                  document.getElementById('project-results')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
              }}
              className={`bg-gradient-to-br from-blue-50 to-cyan-50 border-4 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 shadow-lg text-left relative ${
                filterStatus === 'under-review' ? 'border-blue-500 shadow-2xl scale-105 ring-4 ring-blue-200' : 'border-blue-200 hover:border-blue-300'
              }`}
            >
              {filterStatus === 'under-review' && (
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-black">✓</span>
                </div>
              )}
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">👁️</span>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">REVIEW</span>
              </div>
              <div className="text-4xl font-black mb-1 text-blue-700">{stats.underReview}</div>
              <div className="text-sm font-bold text-blue-600">Active</div>
            </button>

            <button
              onClick={() => {
                setFilterStatus('approved');
                setFilterFormat('all');
                setFilterCulture('all');
                // Scroll to results
                setTimeout(() => {
                  document.getElementById('project-results')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
              }}
              className={`bg-gradient-to-br from-green-50 to-emerald-50 border-4 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 shadow-lg text-left relative ${
                filterStatus === 'approved' ? 'border-green-500 shadow-2xl scale-105 ring-4 ring-green-200' : 'border-green-200 hover:border-green-300'
              }`}
            >
              {filterStatus === 'approved' && (
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-black">✓</span>
                </div>
              )}
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">✓</span>
                <span className="text-xs font-bold text-green-700 uppercase tracking-wide">APPROVED</span>
              </div>
              <div className="text-4xl font-black mb-1 text-green-700">{stats.approved}</div>
              <div className="text-sm font-bold text-green-600">Ready</div>
            </button>

            <button
              onClick={() => {
                setFilterStatus('revision-requested');
                setFilterFormat('all');
                setFilterCulture('all');
                // Scroll to results
                setTimeout(() => {
                  document.getElementById('project-results')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
              }}
              className={`bg-gradient-to-br from-purple-50 to-pink-50 border-4 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 shadow-lg text-left relative ${
                filterStatus === 'revision-requested' ? 'border-purple-500 shadow-2xl scale-105 ring-4 ring-purple-200' : 'border-purple-200 hover:border-purple-300'
              }`}
            >
              {filterStatus === 'revision-requested' && (
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-black">✓</span>
                </div>
              )}
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">📝</span>
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">REVISION</span>
              </div>
              <div className="text-4xl font-black mb-1 text-purple-700">{stats.revisionRequested}</div>
              <div className="text-sm font-bold text-purple-600">Changes</div>
            </button>

            <button
              onClick={() => {
                setFilterStatus('on-hold');
                setFilterFormat('all');
                setFilterCulture('all');
                // Scroll to results
                setTimeout(() => {
                  document.getElementById('project-results')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
              }}
              className={`bg-gradient-to-br from-orange-50 to-amber-50 border-4 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 shadow-lg text-left relative ${
                filterStatus === 'on-hold' ? 'border-orange-500 shadow-2xl scale-105 ring-4 ring-orange-200' : 'border-orange-200 hover:border-orange-300'
              }`}
            >
              {filterStatus === 'on-hold' && (
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-black">✓</span>
                </div>
              )}
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">⏸️</span>
                <span className="text-xs font-bold text-orange-700 uppercase tracking-wide">ON HOLD</span>
              </div>
              <div className="text-4xl font-black mb-1 text-orange-700">{stats.onHold}</div>
              <div className="text-sm font-bold text-orange-600">Paused</div>
            </button>

            <button
              onClick={() => {
                setFilterStatus('in-production');
                setFilterFormat('all');
                setFilterCulture('all');
                // Scroll to results
                setTimeout(() => {
                  document.getElementById('project-results')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
              }}
              className={`bg-gradient-to-br from-cyan-50 to-blue-50 border-4 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 shadow-lg text-left relative ${
                filterStatus === 'in-production' ? 'border-cyan-500 shadow-2xl scale-105 ring-4 ring-cyan-200' : 'border-cyan-200 hover:border-cyan-300'
              }`}
            >
              {filterStatus === 'in-production' && (
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-black">✓</span>
                </div>
              )}
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🎬</span>
                <span className="text-xs font-bold text-cyan-700 uppercase tracking-wide">PRODUCTION</span>
              </div>
              <div className="text-4xl font-black mb-1 text-cyan-700">{stats.inProduction}</div>
              <div className="text-sm font-bold text-cyan-600">Filming</div>
            </button>

            <button
              onClick={() => {
                setFilterStatus('scrapped');
                setFilterFormat('all');
                setFilterCulture('all');
                // Scroll to results
                setTimeout(() => {
                  document.getElementById('project-results')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
              }}
              className={`bg-gradient-to-br from-gray-50 to-slate-50 border-4 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 shadow-lg text-left relative ${
                filterStatus === 'scrapped' ? 'border-gray-500 shadow-2xl scale-105 ring-4 ring-gray-300' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {filterStatus === 'scrapped' && (
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-gray-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-black">✓</span>
                </div>
              )}
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🗑️</span>
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">SCRAPPED</span>
              </div>
              <div className="text-4xl font-black mb-1 text-gray-600">{stats.scrapped}</div>
              <div className="text-sm font-bold text-gray-500">Rejected</div>
            </button>
          </div>

          {/* Analytics Section - Culture with Format Subsections */}
          <div className="mb-8 bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <span className="text-2xl">🌏</span>
                <span>Content by Culture & Format</span>
              </h3>
              {(filterCulture !== 'all' || filterFormat !== 'all') && (
                <button
                  onClick={() => {
                    setFilterCulture('all');
                    setFilterFormat('all');
                    // Scroll to results
                    setTimeout(() => {
                      document.getElementById('project-results')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 100);
                  }}
                  className="text-sm px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg transition-all font-bold shadow-md hover:shadow-lg"
                >
                  ✕ Clear Filters
                </button>
              )}
            </div>

            {/* Horizontal Scrollable Culture Cards */}
            <div className="relative">
              <div className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory hide-scrollbar">
                {Object.entries(stats.cultureWithFormats).map(([culture, formats]: [string, any]) => (
                  <div
                    key={culture}
                    className={`flex-shrink-0 w-[380px] snap-start bg-gradient-to-br rounded-2xl p-6 transition-all border-2 shadow-lg hover:shadow-xl ${
                      filterCulture === culture
                        ? 'from-blue-50 to-indigo-50 border-blue-400 shadow-blue-200'
                        : 'from-gray-50 to-slate-50 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {/* Culture Header */}
                    <button
                      onClick={() => {
                        setFilterCulture(filterCulture === culture ? 'all' : culture);
                        setFilterFormat('all');
                        setFilterStatus('all');
                        // Scroll to results
                        setTimeout(() => {
                          document.getElementById('project-results')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }, 100);
                      }}
                      className="w-full flex items-center justify-between mb-5 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md ${
                          filterCulture === culture
                            ? 'bg-gradient-to-br from-blue-400 to-indigo-500'
                            : 'bg-gradient-to-br from-gray-300 to-slate-400'
                        }`}>
                          🎭
                        </div>
                        <div className="text-left">
                          <h4 className={`text-xl font-black transition-colors ${
                            filterCulture === culture
                              ? 'text-blue-900'
                              : 'text-gray-900 group-hover:text-blue-700'
                          }`}>
                            {culture}
                          </h4>
                          <div className={`text-xs font-bold uppercase tracking-wide ${
                            filterCulture === culture ? 'text-blue-700' : 'text-gray-600'
                          }`}>
                            {stats.byCulture[culture]} Project{stats.byCulture[culture] > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-black transition-all ${
                        filterCulture === culture
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-500 group-hover:bg-gray-300'
                      }`}>
                        {filterCulture === culture ? '✓' : '→'}
                      </div>
                    </button>

                    {/* Format Subsections */}
                    <div className="space-y-2.5">
                      {[
                        { key: 'Feature Film', icon: '🎬', gradient: 'from-red-50 to-orange-50', border: 'border-red-200', text: 'text-red-700' },
                        { key: 'Mini Film', icon: '🎞️', gradient: 'from-amber-50 to-yellow-50', border: 'border-amber-200', text: 'text-amber-700' },
                        { key: 'Long Series', icon: '📺', gradient: 'from-green-50 to-emerald-50', border: 'border-green-200', text: 'text-green-700' },
                        { key: 'Limited Series', icon: '🎭', gradient: 'from-purple-50 to-pink-50', border: 'border-purple-200', text: 'text-purple-700' },
                        { key: 'Microdrama', icon: '⚡', gradient: 'from-cyan-50 to-blue-50', border: 'border-cyan-200', text: 'text-cyan-700' },
                      ].map(({ key, icon, gradient, border, text }) => {
                        const count = formats[key] || 0;
                        const isActive = filterCulture === culture && filterFormat === key;

                        return (
                          <button
                            key={key}
                            onClick={() => {
                              setFilterCulture(culture);
                              setFilterFormat(key);
                              setFilterStatus('all');
                              // Scroll to results
                              setTimeout(() => {
                                document.getElementById('project-results')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                              }, 100);
                            }}
                            className={`w-full flex items-center justify-between rounded-xl p-3.5 transition-all ${
                              isActive
                                ? `bg-gradient-to-r ${gradient} border-2 ${border} shadow-md`
                                : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{icon}</span>
                              <span className={`text-sm font-bold ${isActive ? text : 'text-gray-700'}`}>
                                {key}
                              </span>
                            </div>
                            <div className={`px-3 py-1 rounded-lg font-black text-sm ${
                              isActive
                                ? `${text} bg-white`
                                : 'text-gray-600 bg-gray-100'
                            }`}>
                              {count}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Scroll Indicator */}
              <div className="flex justify-center gap-2 mt-4">
                {Object.keys(stats.cultureWithFormats).map((culture, index) => (
                  <button
                    key={culture}
                    onClick={() => {
                      const container = document.querySelector('.overflow-x-auto');
                      if (container) {
                        const cardWidth = 380 + 24; // card width + gap
                        container.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
                      }
                    }}
                    className={`h-2 rounded-full transition-all ${
                      filterCulture === culture
                        ? 'w-8 bg-blue-500'
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <style jsx>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            @keyframes pulse-slow {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.8;
              }
            }
            @keyframes bounce-slow {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-4px);
              }
            }
            .animate-pulse-slow {
              animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            .animate-bounce-slow {
              animation: bounce-slow 2s ease-in-out infinite;
            }
          `}</style>

          {/* Active Filters Indicator */}
          {(filterFormat !== 'all' || filterCulture !== 'all' || filterStatus !== 'all') && (
            <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-xl">🔍</span>
                    <span>Active Filters:</span>
                  </span>
                  {filterFormat !== 'all' && (
                    <div className="px-4 py-2 bg-purple-100 border-2 border-purple-300 rounded-lg text-sm font-bold text-purple-800 flex items-center gap-2 shadow-sm">
                      <span>Format: {filterFormat}</span>
                      <button
                        onClick={() => {
                          setFilterFormat('all');
                          // Scroll to results
                          setTimeout(() => {
                            document.getElementById('project-results')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                          }, 100);
                        }}
                        className="hover:text-purple-900 transition-colors font-black"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {filterCulture !== 'all' && (
                    <div className="px-4 py-2 bg-blue-100 border-2 border-blue-300 rounded-lg text-sm font-bold text-blue-800 flex items-center gap-2 shadow-sm">
                      <span>Culture: {filterCulture}</span>
                      <button
                        onClick={() => {
                          setFilterCulture('all');
                          // Scroll to results
                          setTimeout(() => {
                            document.getElementById('project-results')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                          }, 100);
                        }}
                        className="hover:text-blue-900 transition-colors font-black"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {filterStatus !== 'all' && (
                    <div className="px-4 py-2 bg-red-100 border-2 border-red-300 rounded-lg text-sm font-bold text-red-800 flex items-center gap-2 shadow-sm">
                      <span>Status: {filterStatus.replace('-', ' ')}</span>
                      <button
                        onClick={() => {
                          setFilterStatus('all');
                          // Scroll to results
                          setTimeout(() => {
                            document.getElementById('project-results')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                          }, 100);
                        }}
                        className="hover:text-red-900 transition-colors font-black"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setFilterFormat('all');
                    setFilterCulture('all');
                    setFilterStatus('all');
                    // Scroll to results
                    setTimeout(() => {
                      document.getElementById('project-results')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 100);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-sm font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="mb-6 bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <span>Filter by Status:</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { value: 'all', label: 'All Projects', color: 'red' },
                { value: 'pending', label: 'Pending', color: 'yellow' },
                { value: 'under-review', label: 'Under Review', color: 'blue' },
                { value: 'approved', label: 'Approved', color: 'green' },
                { value: 'revision-requested', label: 'Revision Requested', color: 'purple' },
                { value: 'on-hold', label: 'On Hold', color: 'orange' },
                { value: 'scrapped', label: 'Scrapped', color: 'gray' },
                { value: 'in-production', label: 'In Production', color: 'cyan' },
              ].map((status) => (
                <button
                  key={status.value}
                  onClick={() => {
                    setFilterStatus(status.value);
                    // Scroll to results
                    setTimeout(() => {
                      document.getElementById('project-results')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 100);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    filterStatus === status.value
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Counter */}
          <div className="mb-6 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
            <div className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span className="text-xl">📊</span>
              <span>
                Showing <span className="text-blue-600 text-xl">{filteredSubmissions.length}</span> of <span className="text-gray-700">{submissions.length}</span> projects
              </span>
            </div>
          </div>

          {/* Submissions Grid */}
          <div id="project-results" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSubmissions.map((submission) => {
              const statusConfig = getStatusConfig(submission.status);
              const isNew = isNewSubmission(submission.submittedDate);
              return (
                <div
                  key={submission.id}
                  className={`group bg-white backdrop-blur-xl border-2 rounded-2xl hover:shadow-xl transition-all duration-300 shadow-lg relative ${
                    isNew ? 'border-red-400 ring-4 ring-red-100 animate-pulse-slow' : 'border-gray-200'
                  }`}
                >
                  {/* NEW Badge for new submissions */}
                  {isNew && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="relative">
                        <div className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-full shadow-lg flex items-center gap-2 animate-bounce-slow">
                          <span className="text-white text-xs font-black uppercase tracking-wider">✨ NEW</span>
                        </div>
                        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30"></div>
                      </div>
                    </div>
                  )}

                  {/* Project Info */}
                  <div className="p-6">
                    {/* Time Elapsed Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                        <span>⏰</span>
                        <span>{getTimeElapsed(submission.submittedDate)}</span>
                      </div>
                      {isNew && (
                        <div className="px-2 py-1 bg-red-50 border border-red-200 rounded text-xs font-bold text-red-600">
                          Fresh Submission
                        </div>
                      )}
                    </div>

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-black mb-3 text-gray-900">{submission.projectName}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-3 py-1.5 bg-purple-100 border-2 border-purple-300 rounded-lg text-xs font-bold text-purple-800">
                            {submission.format}
                          </span>
                          <span className="px-3 py-1.5 bg-pink-100 border-2 border-pink-300 rounded-lg text-xs font-bold text-pink-800">
                            {submission.culture}
                          </span>
                          <span className="px-3 py-1.5 bg-blue-100 border-2 border-blue-300 rounded-lg text-xs font-bold text-blue-800">
                            {submission.genre}
                          </span>
                        </div>
                      </div>
                      <div className={`px-3 py-2 rounded-lg border-2 ${statusConfig.badge}`}>
                        <div className="text-xs font-black whitespace-nowrap">{statusConfig.icon}</div>
                      </div>
                    </div>

                    {/* Creator, Director & Budget */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border-2 border-blue-200">
                        <div className="text-xs font-bold text-blue-700 mb-1 uppercase tracking-wide">CREATOR</div>
                        <div className="text-sm font-bold text-gray-900">{submission.creator}</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border-2 border-purple-200">
                        <div className="text-xs font-bold text-purple-700 mb-1 uppercase tracking-wide">DIRECTOR</div>
                        <div className="text-sm font-bold text-gray-900">{submission.director || 'N/A'}</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border-2 border-green-200">
                        <div className="text-xs font-bold text-green-700 mb-1 uppercase tracking-wide">BUDGET</div>
                        <div className="text-sm font-black text-gray-900">{formatBudgetInWords(submission.totalBudget)}</div>
                      </div>
                    </div>

                    {/* Production & Content POC - Editable */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {/* Production POC */}
                      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-3 border-2 border-cyan-200">
                        <div className="text-xs font-bold text-cyan-700 mb-1 uppercase tracking-wide flex items-center gap-1">
                          🎬 PRODUCTION POC
                        </div>
                        {editingPOC?.submissionId === submission.id && editingPOC?.field === 'productionPOC' ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={tempPOCValue}
                              onChange={(e) => setTempPOCValue(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSavePOC()}
                              className="flex-1 text-sm font-bold text-gray-900 bg-white border-2 border-cyan-400 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              placeholder="Enter name"
                              autoFocus
                            />
                            <button
                              onClick={handleSavePOC}
                              className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                              title="Save"
                            >
                              ✓
                            </button>
                            <button
                              onClick={handleCancelEditPOC}
                              className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div
                            className="text-sm font-bold text-gray-900 cursor-pointer hover:text-cyan-700 transition-colors group flex items-center gap-2"
                            onClick={() => handleStartEditPOC(submission.id, 'productionPOC', submission.productionPOC || '')}
                          >
                            {submission.productionPOC || <span className="text-gray-400 italic">Click to assign</span>}
                            <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
                          </div>
                        )}
                      </div>

                      {/* Content POC */}
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 border-2 border-orange-200">
                        <div className="text-xs font-bold text-orange-700 mb-1 uppercase tracking-wide flex items-center gap-1">
                          📝 CONTENT POC
                        </div>
                        {editingPOC?.submissionId === submission.id && editingPOC?.field === 'contentPOC' ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={tempPOCValue}
                              onChange={(e) => setTempPOCValue(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSavePOC()}
                              className="flex-1 text-sm font-bold text-gray-900 bg-white border-2 border-orange-400 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="Enter name"
                              autoFocus
                            />
                            <button
                              onClick={handleSavePOC}
                              className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                              title="Save"
                            >
                              ✓
                            </button>
                            <button
                              onClick={handleCancelEditPOC}
                              className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div
                            className="text-sm font-bold text-gray-900 cursor-pointer hover:text-orange-700 transition-colors group flex items-center gap-2"
                            onClick={() => handleStartEditPOC(submission.id, 'contentPOC', submission.contentPOC || '')}
                          >
                            {submission.contentPOC || <span className="text-gray-400 italic">Click to assign</span>}
                            <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress & Warnings */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">COMPLETENESS</span>
                        <span className={`text-sm font-bold ${
                          submission.completeness >= 90 ? 'text-green-600' : 'text-amber-600'
                        }`}>
                          {submission.completeness}%
                        </span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                        <div
                          className={`h-full rounded-full ${
                            submission.completeness >= 90
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                              : 'bg-gradient-to-r from-amber-500 to-orange-600'
                          }`}
                          style={{ width: `${submission.completeness}%` }}
                        />
                      </div>
                    </div>

                    {submission.warnings > 0 && (
                      <div className="bg-amber-100 border-2 border-amber-300 rounded-xl p-3 mb-4">
                        <div className="flex items-center gap-2 text-amber-800 text-sm font-bold">
                          <span>⚠️</span>
                          <span>{submission.warnings} Warning{submission.warnings > 1 ? 's' : ''} Detected</span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        className="flex-1 py-3.5 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition-all text-base"
                      >
                        📋 Review Project
                      </button>

                      {/* Status Change Dropdown */}
                      <div className="relative">
                        <button
                          id={`status-button-${submission.id}`}
                          onClick={(e) => {
                            setShowStatusMenu(showStatusMenu === submission.id ? null : submission.id);
                          }}
                          className="px-3 py-3 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-lg transition-all"
                          title="Change Status"
                        >
                          🔄
                        </button>
                        {showStatusMenu === submission.id && (
                          <div
                            className="fixed bg-gray-900 border-2 border-white/20 rounded-xl shadow-2xl z-[9999] min-w-[220px] max-h-[400px] overflow-y-auto"
                            style={{
                              top: `${(document.getElementById(`status-button-${submission.id}`)?.getBoundingClientRect().bottom || 0) + 8}px`,
                              left: `${(document.getElementById(`status-button-${submission.id}`)?.getBoundingClientRect().right || 0) - 220}px`,
                            }}
                          >
                            <div className="p-3 space-y-1">
                              <div className="text-xs font-bold text-gray-400 px-3 py-2 uppercase tracking-wide">Change Status To:</div>
                              {[
                                { value: 'pending', label: 'Pending', icon: '⏳' },
                                { value: 'under-review', label: 'Under Review', icon: '👁️' },
                                { value: 'approved', label: 'Approved', icon: '✓' },
                                { value: 'revision-requested', label: 'Revision Needed', icon: '📝' },
                                { value: 'on-hold', label: 'On Hold', icon: '⏸️' },
                                { value: 'in-production', label: 'In Production', icon: '🎬' },
                                { value: 'scrapped', label: 'Scrapped', icon: '🗑️' },
                              ].map((status) => (
                                <button
                                  key={status.value}
                                  onClick={() => {
                                    handleStatusChange(submission.id, status.value);
                                    setShowStatusMenu(null);
                                  }}
                                  className={`w-full text-left px-3 py-2.5 hover:bg-white/10 rounded-lg text-sm font-bold text-white flex items-center gap-2 transition-all ${
                                    submission.status === status.value ? 'bg-white/20' : ''
                                  }`}
                                >
                                  <span>{status.icon}</span>
                                  <span>{status.label}</span>
                                  {submission.status === status.value && (
                                    <span className="ml-auto text-green-400">✓</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Delete Button */}
                      <div className="relative">
                        <button
                          onClick={() => setShowDeleteConfirm(submission.id)}
                          className="px-3 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-lg transition-all"
                          title="Delete Project"
                        >
                          🗑️
                        </button>
                        {showDeleteConfirm === submission.id && (
                          <div className="absolute right-0 top-full mt-2 bg-gray-900 border-2 border-red-500 rounded-lg shadow-2xl z-50 p-4 min-w-[280px]">
                            <div className="text-sm font-bold text-white mb-3">⚠️ Delete this project?</div>
                            <div className="text-xs text-gray-300 mb-4">
                              This action cannot be undone. All project data will be permanently deleted.
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDeleteProject(submission.id)}
                                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-black rounded text-xs"
                              >
                                Yes, Delete
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="mt-4 pt-4 border-t-2 border-gray-200 flex items-center justify-between text-sm text-gray-600 font-bold">
                      <span>📅 {formatDate(submission.submittedDate)}</span>
                      {submission.episodes && <span>🎬 {submission.episodes} Episodes</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
              <div className="text-6xl mb-4">📭</div>
              <div className="text-xl font-bold text-gray-700">No submissions found</div>
              <div className="text-sm text-gray-500 mt-2 font-semibold">Try adjusting your filters</div>
            </div>
          )}
            </>
          )}

          {/* SUBMISSIONS TAB */}
          {activeTab === 'submissions' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-lg">
                <h2 className="text-3xl font-black text-gray-900 mb-4 flex items-center gap-3">
                  <span className="text-4xl">📋</span>
                  <span>All Submissions</span>
                </h2>
                <p className="text-gray-700 font-semibold text-lg">
                  Manage and review all creator submissions in detail
                </p>
              </div>

              {/* Submissions Grid - Same as Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {submissions.map((submission) => {
                  const statusConfig = getStatusConfig(submission.status);
                  const isNew = isNewSubmission(submission.submittedDate);
                  return (
                    <div
                      key={submission.id}
                      className={`group bg-white backdrop-blur-xl border-2 rounded-2xl hover:shadow-xl transition-all duration-300 shadow-lg relative ${
                        isNew ? 'border-red-400 ring-4 ring-red-100 animate-pulse-slow' : 'border-gray-200'
                      }`}
                    >
                      {isNew && (
                        <div className="absolute top-4 right-4 z-10">
                          <div className="relative">
                            <div className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-full shadow-lg flex items-center gap-2 animate-bounce-slow">
                              <span className="text-white text-xs font-black uppercase tracking-wider">✨ NEW</span>
                            </div>
                            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30"></div>
                          </div>
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                            <span>⏰</span>
                            <span>{getTimeElapsed(submission.submittedDate)}</span>
                          </div>
                          {isNew && (
                            <div className="px-2 py-1 bg-red-50 border border-red-200 rounded text-xs font-bold text-red-600">
                              Fresh Submission
                            </div>
                          )}
                        </div>

                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-2xl font-black mb-3 text-gray-900">{submission.projectName}</h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-3 py-1.5 bg-purple-100 border-2 border-purple-300 rounded-lg text-xs font-bold text-purple-800">
                                {submission.format}
                              </span>
                              <span className="px-3 py-1.5 bg-pink-100 border-2 border-pink-300 rounded-lg text-xs font-bold text-pink-800">
                                {submission.culture}
                              </span>
                              <span className="px-3 py-1.5 bg-blue-100 border-2 border-blue-300 rounded-lg text-xs font-bold text-blue-800">
                                {submission.genre}
                              </span>
                            </div>
                          </div>
                          <div className={`px-3 py-2 rounded-lg border-2 ${statusConfig.badge}`}>
                            <div className="text-xs font-black whitespace-nowrap">{statusConfig.icon}</div>
                          </div>
                        </div>

                        {/* Creator, Director & Budget */}
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border-2 border-blue-200">
                            <div className="text-xs font-bold text-blue-700 mb-1 uppercase tracking-wide">CREATOR</div>
                            <div className="text-sm font-bold text-gray-900">{submission.creator}</div>
                          </div>
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border-2 border-purple-200">
                            <div className="text-xs font-bold text-purple-700 mb-1 uppercase tracking-wide">DIRECTOR</div>
                            <div className="text-sm font-bold text-gray-900">{submission.director || 'N/A'}</div>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border-2 border-green-200">
                            <div className="text-xs font-bold text-green-700 mb-1 uppercase tracking-wide">BUDGET</div>
                            <div className="text-sm font-black text-gray-900">{formatBudgetInWords(submission.totalBudget)}</div>
                          </div>
                        </div>

                        {/* Production & Content POC - Editable */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {/* Production POC */}
                          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-3 border-2 border-cyan-200">
                            <div className="text-xs font-bold text-cyan-700 mb-1 uppercase tracking-wide flex items-center gap-1">
                              🎬 PRODUCTION POC
                            </div>
                            {editingPOC?.submissionId === submission.id && editingPOC?.field === 'productionPOC' ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  value={tempPOCValue}
                                  onChange={(e) => setTempPOCValue(e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && handleSavePOC()}
                                  className="flex-1 text-sm font-bold text-gray-900 bg-white border-2 border-cyan-400 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                  placeholder="Enter name"
                                  autoFocus
                                />
                                <button
                                  onClick={handleSavePOC}
                                  className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                  title="Save"
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={handleCancelEditPOC}
                                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                  title="Cancel"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div
                                className="text-sm font-bold text-gray-900 cursor-pointer hover:text-cyan-700 transition-colors group flex items-center gap-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartEditPOC(submission.id, 'productionPOC', submission.productionPOC || '');
                                }}
                              >
                                {submission.productionPOC || <span className="text-gray-400 italic">Click to assign</span>}
                                <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
                              </div>
                            )}
                          </div>

                          {/* Content POC */}
                          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 border-2 border-orange-200">
                            <div className="text-xs font-bold text-orange-700 mb-1 uppercase tracking-wide flex items-center gap-1">
                              📝 CONTENT POC
                            </div>
                            {editingPOC?.submissionId === submission.id && editingPOC?.field === 'contentPOC' ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  value={tempPOCValue}
                                  onChange={(e) => setTempPOCValue(e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && handleSavePOC()}
                                  className="flex-1 text-sm font-bold text-gray-900 bg-white border-2 border-orange-400 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  placeholder="Enter name"
                                  autoFocus
                                />
                                <button
                                  onClick={handleSavePOC}
                                  className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                  title="Save"
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={handleCancelEditPOC}
                                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                  title="Cancel"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div
                                className="text-sm font-bold text-gray-900 cursor-pointer hover:text-orange-700 transition-colors group flex items-center gap-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartEditPOC(submission.id, 'contentPOC', submission.contentPOC || '');
                                }}
                              >
                                {submission.contentPOC || <span className="text-gray-400 italic">Click to assign</span>}
                                <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelectedSubmission(submission)}
                            className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-black rounded-xl transition-all shadow-md hover:shadow-lg"
                          >
                            View Details →
                          </button>

                          {/* Status Change Button */}
                          <div className="relative">
                            <button
                              id={`status-button-sub-${submission.id}`}
                              onClick={() => setShowStatusMenu(showStatusMenu === submission.id ? null : submission.id)}
                              className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-xl transition-all shadow-md"
                              title="Change Status"
                            >
                              🔄
                            </button>
                            {showStatusMenu === submission.id && (
                              <div
                                className="fixed bg-gray-900 border-2 border-white/20 rounded-xl shadow-2xl z-[9999] min-w-[220px] max-h-[400px] overflow-y-auto"
                                style={{
                                  top: `${(document.getElementById(`status-button-sub-${submission.id}`)?.getBoundingClientRect().bottom || 0) + 8}px`,
                                  left: `${(document.getElementById(`status-button-sub-${submission.id}`)?.getBoundingClientRect().right || 0) - 220}px`,
                                }}
                              >
                                <div className="p-3 space-y-1">
                                  <div className="text-xs font-bold text-gray-400 px-3 py-2 uppercase tracking-wide">Change Status To:</div>
                                  {[
                                    { value: 'pending', label: 'Pending', icon: '⏳' },
                                    { value: 'under-review', label: 'Under Review', icon: '👁️' },
                                    { value: 'approved', label: 'Approved', icon: '✓' },
                                    { value: 'revision-requested', label: 'Revision Needed', icon: '📝' },
                                    { value: 'on-hold', label: 'On Hold', icon: '⏸️' },
                                    { value: 'in-production', label: 'In Production', icon: '🎬' },
                                    { value: 'scrapped', label: 'Scrapped', icon: '🗑️' },
                                  ].map((status) => (
                                    <button
                                      key={status.value}
                                      onClick={() => {
                                        handleStatusChange(submission.id, status.value);
                                        setShowStatusMenu(null);
                                      }}
                                      className={`w-full text-left px-3 py-2.5 hover:bg-white/10 rounded-lg text-sm font-bold text-white flex items-center gap-2 transition-all ${
                                        submission.status === status.value ? 'bg-white/20' : ''
                                      }`}
                                    >
                                      <span>{status.icon}</span>
                                      <span>{status.label}</span>
                                      {submission.status === status.value && (
                                        <span className="ml-auto text-green-400">✓</span>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-lg">
                <h2 className="text-3xl font-black text-gray-900 mb-4 flex items-center gap-3">
                  <span className="text-4xl">📊</span>
                  <span>Analytics & Insights</span>
                </h2>
                <p className="text-gray-700 font-semibold text-lg">
                  Detailed analytics and performance metrics coming soon
                </p>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
                  <div className="text-blue-700 font-bold text-sm mb-2 uppercase tracking-wide">Total Projects</div>
                  <div className="text-4xl font-black text-gray-900 mb-2">{stats.total}</div>
                  <div className="text-blue-600 text-sm font-bold">All Time</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
                  <div className="text-green-700 font-bold text-sm mb-2 uppercase tracking-wide">Total Budget</div>
                  <div className="text-4xl font-black text-gray-900 mb-2">{formatBudget(stats.totalBudget)}</div>
                  <div className="text-green-600 text-sm font-bold">Approved Projects</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 shadow-lg">
                  <div className="text-purple-700 font-bold text-sm mb-2 uppercase tracking-wide">Active Reviews</div>
                  <div className="text-4xl font-black text-gray-900 mb-2">{stats.underReview}</div>
                  <div className="text-purple-600 text-sm font-bold">In Progress</div>
                </div>
              </div>
            </div>
          )}

          {/* BUDGET TAB */}
          {activeTab === 'budget' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-lg">
                <h2 className="text-3xl font-black text-gray-900 mb-4 flex items-center gap-3">
                  <span className="text-4xl">💰</span>
                  <span>Budget Overview</span>
                </h2>
                <p className="text-gray-700 font-semibold text-lg mb-6">
                  Complete budget breakdown from all creator submissions
                </p>

                {/* Total Budget Summary */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 mb-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-green-700 font-bold text-sm mb-2 uppercase tracking-wide">Grand Total Budget</div>
                      <div className="text-5xl font-black text-gray-900">{formatBudgetInWords(stats.totalBudget)}</div>
                      <div className="text-green-600 text-base font-bold mt-2">
                        Across {stats.approved + stats.inProduction} approved/production projects
                      </div>
                    </div>
                    <div className="text-7xl">💸</div>
                  </div>
                </div>
              </div>

              {/* Budget by Culture */}
              <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-lg">
                <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🌍</span>
                  <span>Budget by Culture</span>
                </h3>

                <div className="space-y-4">
                  {Object.entries(stats.budgetByCulture).map(([culture, budget]) => {
                    const cultureProjects = approvedProjects.filter(p => p.culture === culture);
                    const percentage = ((budget as number) / stats.totalBudget * 100).toFixed(1);

                    return (
                      <div key={culture} className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-md">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-xl font-black text-gray-900 mb-1">{culture}</h4>
                            <div className="text-sm font-bold text-blue-700">
                              {cultureProjects.length} project{cultureProjects.length !== 1 ? 's' : ''} • {percentage}% of total
                            </div>
                          </div>
                          <div className="text-2xl font-black text-green-700">
                            {formatBudgetInWords(budget as number)}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden border border-gray-300 mb-4">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        {/* Project List */}
                        <div className="space-y-2">
                          {cultureProjects.map((project) => (
                            <div
                              key={project.id}
                              className="bg-white rounded-lg p-4 border border-blue-200 hover:shadow-md transition-all cursor-pointer"
                              onClick={() => setSelectedSubmission(project)}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex-1">
                                  <div className="text-sm font-bold text-gray-900 mb-2">{project.projectName}</div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-2 py-1 bg-purple-100 border border-purple-300 rounded text-xs font-bold text-purple-800">
                                      {project.format}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusConfig(project.status).badge}`}>
                                      {getStatusConfig(project.status).text}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-base font-black text-green-700">
                                  {formatBudgetInWords(project.totalBudget)}
                                </div>
                              </div>

                              {/* Director & POCs */}
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="bg-purple-50 rounded px-2 py-1.5 border border-purple-200">
                                  <div className="font-bold text-purple-700 uppercase tracking-wide mb-0.5">Director</div>
                                  <div className="font-semibold text-gray-900">{project.director || 'N/A'}</div>
                                </div>
                                <div className="bg-cyan-50 rounded px-2 py-1.5 border border-cyan-200">
                                  <div className="font-bold text-cyan-700 uppercase tracking-wide mb-0.5">Prod POC</div>
                                  <div className="font-semibold text-gray-900">{project.productionPOC || <span className="text-gray-400">Not set</span>}</div>
                                </div>
                                <div className="bg-orange-50 rounded px-2 py-1.5 border border-orange-200">
                                  <div className="font-bold text-orange-700 uppercase tracking-wide mb-0.5">Content POC</div>
                                  <div className="font-semibold text-gray-900">{project.contentPOC || <span className="text-gray-400">Not set</span>}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Budget by Status */}
              <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-lg">
                <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  <span>Budget by Status</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { status: 'approved', label: 'Approved', gradient: 'from-green-100 to-emerald-200', bgDark: 'bg-green-50', border: 'border-green-400', text: 'text-green-800', icon: '✓' },
                    { status: 'in-production', label: 'In Production', gradient: 'from-cyan-100 to-blue-200', bgDark: 'bg-cyan-50', border: 'border-cyan-400', text: 'text-cyan-800', icon: '🎬' },
                    { status: 'under-review', label: 'Under Review', gradient: 'from-blue-100 to-indigo-200', bgDark: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-800', icon: '👁️' },
                    { status: 'pending', label: 'Pending', gradient: 'from-yellow-100 to-orange-200', bgDark: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-800', icon: '⏳' },
                  ].map(({ status, label, gradient, bgDark, border, text, icon }) => {
                    const statusProjects = submissions.filter(s => s.status === status);
                    const statusBudget = statusProjects.reduce((sum, p) => sum + p.totalBudget, 0);
                    const isExpanded = expandedBudgetStatus === status;

                    return (
                      <div key={status} className={`bg-gradient-to-br ${gradient} border-2 ${border} rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all`}>
                        {/* Status Header - Clickable */}
                        <button
                          onClick={() => setExpandedBudgetStatus(isExpanded ? null : status)}
                          className="w-full p-6 text-left hover:opacity-90 transition-all"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{icon}</span>
                              <div className={`text-base font-black uppercase tracking-wide ${text}`}>{label}</div>
                            </div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-black ${text} bg-white/50`}>
                              {isExpanded ? '−' : '+'}
                            </div>
                          </div>
                          <div className={`text-4xl font-black text-gray-900 mb-2`}>
                            {formatBudgetInWords(statusBudget)}
                          </div>
                          <div className={`text-sm font-bold ${text}`}>
                            {statusProjects.length} project{statusProjects.length !== 1 ? 's' : ''}
                          </div>
                        </button>

                        {/* Expanded Culture → Format → Projects Breakdown */}
                        {isExpanded && statusProjects.length > 0 && (
                          <div className={`border-t-2 ${border} ${bgDark} p-4 space-y-4`}>
                            {/* Group by Culture */}
                            {Object.entries(
                              statusProjects.reduce((acc, project) => {
                                if (!acc[project.culture]) acc[project.culture] = [];
                                acc[project.culture].push(project);
                                return acc;
                              }, {} as Record<string, any[]>)
                            ).map(([culture, cultureProjects]) => {
                              const projects = cultureProjects as any[];
                              const cultureBudget = projects.reduce((sum: number, p: any) => sum + p.totalBudget, 0);

                              return (
                                <div key={culture} className="bg-white rounded-xl border-2 border-gray-300 overflow-hidden shadow-md">
                                  {/* Culture Header */}
                                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-b-2 border-gray-300 p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <span className="text-2xl">🎭</span>
                                        <div>
                                          <div className="text-lg font-black text-gray-900">{culture}</div>
                                          <div className="text-xs font-bold text-gray-600">
                                            {projects.length} project{projects.length !== 1 ? 's' : ''}
                                          </div>
                                        </div>
                                      </div>
                                      <div className={`text-xl font-black ${text}`}>
                                        {formatBudgetInWords(cultureBudget)}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Group by Format within Culture */}
                                  <div className="p-3 space-y-3">
                                    {Object.entries(
                                      projects.reduce((acc, project) => {
                                        if (!acc[project.format]) acc[project.format] = [];
                                        acc[project.format].push(project);
                                        return acc;
                                      }, {} as Record<string, any[]>)
                                    ).map(([format, formatProjects]) => {
                                      const fProjects = formatProjects as any[];
                                      const formatBudget = fProjects.reduce((sum: number, p: any) => sum + p.totalBudget, 0);
                                      const formatIcons: Record<string, string> = {
                                        'Feature Film': '🎬',
                                        'Mini Film': '🎞️',
                                        'Long Series': '📺',
                                        'Limited Series': '🎭',
                                        'Microdrama': '⚡'
                                      };

                                      return (
                                        <div key={format} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200 overflow-hidden">
                                          {/* Format Header */}
                                          <div className="bg-white/50 border-b-2 border-purple-200 p-3">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-2">
                                                <span className="text-lg">{formatIcons[format] || '📹'}</span>
                                                <div>
                                                  <div className="text-sm font-bold text-gray-900">{format}</div>
                                                  <div className="text-xs font-semibold text-purple-700">
                                                    {fProjects.length} project{fProjects.length !== 1 ? 's' : ''}
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="text-base font-black text-purple-800">
                                                {formatBudgetInWords(formatBudget)}
                                              </div>
                                            </div>
                                          </div>

                                          {/* Individual Projects */}
                                          <div className="p-2 space-y-2">
                                            {fProjects.map((project: any) => (
                                              <div
                                                key={project.id}
                                                className="bg-white rounded-lg p-4 hover:shadow-md transition-all cursor-pointer border border-gray-200 hover:border-purple-300"
                                                onClick={() => setSelectedSubmission(project)}
                                              >
                                                <div className="flex items-center justify-between mb-3">
                                                  <div className="flex-1">
                                                    <div className="text-sm font-bold text-gray-900 mb-2">{project.projectName}</div>
                                                    <div className="flex items-center gap-2 text-xs flex-wrap">
                                                      <span className="px-2 py-1 bg-purple-100 border border-purple-300 rounded text-purple-800 font-bold">
                                                        {format}
                                                      </span>
                                                      <span className="px-2 py-1 bg-pink-100 border border-pink-300 rounded text-pink-800 font-bold">
                                                        {culture}
                                                      </span>
                                                      {project.episodes && (
                                                        <span className="px-2 py-1 bg-blue-100 border border-blue-300 rounded text-blue-800 font-bold">
                                                          {project.episodes} Ep
                                                        </span>
                                                      )}
                                                    </div>
                                                  </div>
                                                  <div className={`text-base font-black ${text}`}>
                                                    {formatBudgetInWords(project.totalBudget)}
                                                  </div>
                                                </div>

                                                {/* Director & POCs */}
                                                <div className="grid grid-cols-3 gap-2 text-xs">
                                                  <div className="bg-purple-50 rounded px-2 py-1.5 border border-purple-200">
                                                    <div className="font-bold text-purple-700 uppercase tracking-wide mb-0.5">Director</div>
                                                    <div className="font-semibold text-gray-900">{project.director || 'N/A'}</div>
                                                  </div>
                                                  <div className="bg-cyan-50 rounded px-2 py-1.5 border border-cyan-200">
                                                    <div className="font-bold text-cyan-700 uppercase tracking-wide mb-0.5">Prod POC</div>
                                                    <div className="font-semibold text-gray-900">{project.productionPOC || <span className="text-gray-400">Not set</span>}</div>
                                                  </div>
                                                  <div className="bg-orange-50 rounded px-2 py-1.5 border border-orange-200">
                                                    <div className="font-bold text-orange-700 uppercase tracking-wide mb-0.5">Content POC</div>
                                                    <div className="font-semibold text-gray-900">{project.contentPOC || <span className="text-gray-400">Not set</span>}</div>
                                                  </div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Empty State */}
                        {isExpanded && statusProjects.length === 0 && (
                          <div className={`border-t-2 ${border} ${bgDark} p-6 text-center`}>
                            <div className="text-3xl mb-2">📭</div>
                            <div className={`text-sm font-bold ${text}`}>No projects in this status</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Review Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-7xl h-[96vh] bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
              {/* Modal Header - OPTION 2: Two-Row Horizontal Layout */}
              <div className="flex-shrink-0 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-xl border-b border-white/10 p-3 md:p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 space-y-2">
                    {/* Row 1: Title + Status */}
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl md:text-2xl font-black text-white">{selectedSubmission.projectName}</h2>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black border-2 ${getStatusConfig(selectedSubmission.status).badge}`}>
                        <span>{getStatusConfig(selectedSubmission.status).icon}</span>
                        <span>{getStatusConfig(selectedSubmission.status).text}</span>
                      </span>
                    </div>

                    {/* Row 2: Metadata + POC */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/50 rounded text-xs font-bold text-purple-300">{selectedSubmission.format}</span>
                      <span className="px-2 py-0.5 bg-pink-500/20 border border-pink-500/50 rounded text-xs font-bold text-pink-300">{selectedSubmission.culture}</span>
                      <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/50 rounded text-xs font-bold text-blue-300">{selectedSubmission.genre}</span>
                      <span className="text-gray-500">•</span>
                      {selectedSubmission.productionPOC && (
                        <span className="px-2 py-0.5 bg-indigo-500/30 border border-indigo-400/50 rounded text-xs font-bold text-indigo-200">🎬 {selectedSubmission.productionPOC}</span>
                      )}
                      {selectedSubmission.contentPOC && (
                        <span className="px-2 py-0.5 bg-purple-500/30 border border-purple-400/50 rounded text-xs font-bold text-purple-200">📝 {selectedSubmission.contentPOC}</span>
                      )}
                      {!selectedSubmission.productionPOC && !selectedSubmission.contentPOC && (
                        <span className="text-xs font-bold text-gray-400 italic">No POC assigned</span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => { setSelectedSubmission(null); setDetailView('overview'); }} className="text-gray-400 hover:text-white text-2xl font-bold transition-colors">×</button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {['overview', 'budget', 'crew', 'timeline', 'activity', 'files', 'agreement'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setDetailView(tab as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
                        detailView === tab
                          ? 'bg-red-500 text-white shadow-lg'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {tab === 'overview' && '📊 Overview'}
                      {tab === 'budget' && '💰 Budget'}
                      {tab === 'crew' && '👥 Crew'}
                      {tab === 'timeline' && '📅 Timeline'}
                      {tab === 'activity' && '📜 Activity Log'}
                      {tab === 'files' && '📁 Files'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                {/* Overview Tab */}
                {detailView === 'overview' && (
                  <div className="space-y-4">
                    {/* POC (Point of Contact) Section */}
                    <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-lg">
                      <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">👥</span>
                        <span>Point of Contact (POC)</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Production POC */}
                        <div>
                          <label className="text-sm font-bold text-gray-700 mb-3 block">🎬 PRODUCTION POC</label>
                          <input
                            type="text"
                            value={selectedSubmission.productionPOC || ''}
                            onChange={(e) => {
                              const updatedSubmission = { ...selectedSubmission, productionPOC: e.target.value };
                              setSelectedSubmission(updatedSubmission);
                              setSubmissions(prevSubmissions =>
                                prevSubmissions.map(s =>
                                  s.id === selectedSubmission.id ? updatedSubmission : s
                                )
                              );
                            }}
                            placeholder="Enter Production POC name"
                            className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-semibold"
                          />
                        </div>

                        {/* Content POC */}
                        <div>
                          <label className="text-sm font-bold text-gray-700 mb-3 block">📝 CONTENT POC</label>
                          <input
                            type="text"
                            value={selectedSubmission.contentPOC || ''}
                            onChange={(e) => {
                              const updatedSubmission = { ...selectedSubmission, contentPOC: e.target.value };
                              setSelectedSubmission(updatedSubmission);
                              setSubmissions(prevSubmissions =>
                                prevSubmissions.map(s =>
                                  s.id === selectedSubmission.id ? updatedSubmission : s
                                )
                              );
                            }}
                            placeholder="Enter Content POC name"
                            className="w-full px-4 py-3 bg-purple-50 border-2 border-purple-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-semibold"
                          />
                        </div>
                      </div>

                      {/* POC Display on Cards */}
                      {(selectedSubmission.productionPOC || selectedSubmission.contentPOC) && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                          <div className="text-sm font-bold text-gray-700 mb-3">ASSIGNED POCs:</div>
                          <div className="flex flex-wrap gap-3">
                            {selectedSubmission.productionPOC && (
                              <span className="px-4 py-2 bg-blue-100 border-2 border-blue-300 rounded-lg text-sm font-bold text-blue-900">
                                🎬 {selectedSubmission.productionPOC}
                              </span>
                            )}
                            {selectedSubmission.contentPOC && (
                              <span className="px-4 py-2 bg-purple-100 border-2 border-purple-300 rounded-lg text-sm font-bold text-purple-900">
                                📝 {selectedSubmission.contentPOC}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Project Synopsis */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 shadow-lg">
                      <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">📝</span>
                        <span>Project Synopsis</span>
                      </h3>
                      <div className="space-y-4">
                        {selectedSubmission.logline && (
                          <div className="bg-white rounded-xl p-4 border-2 border-green-200">
                            <div className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wide">LOGLINE</div>
                            <div className="text-base font-semibold text-gray-900">{selectedSubmission.logline}</div>
                          </div>
                        )}
                        {selectedSubmission.synopsis && (
                          <div className="bg-white rounded-xl p-4 border-2 border-green-200">
                            <div className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wide">SYNOPSIS</div>
                            <div className="text-base font-semibold text-gray-900">{selectedSubmission.synopsis}</div>
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedSubmission.targetAudience && (
                            <div className="bg-white rounded-xl p-4 border-2 border-green-200">
                              <div className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wide">TARGET AUDIENCE</div>
                              <div className="text-base font-semibold text-gray-900">{selectedSubmission.targetAudience}</div>
                            </div>
                          )}
                          {selectedSubmission.language && (
                            <div className="bg-white rounded-xl p-4 border-2 border-green-200">
                              <div className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wide">LANGUAGE</div>
                              <div className="text-base font-semibold text-gray-900">{selectedSubmission.language}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Complete Project Details */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
                      <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🎬</span>
                        <span>Complete Project Details</span>
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                          <div className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">PROJECT NAME</div>
                          <div className="text-base font-bold text-gray-900">{selectedSubmission.projectName || 'N/A'}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                          <div className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">PRODUCTION COMPANY</div>
                          <div className="text-base font-bold text-gray-900">{selectedSubmission.productionCompany || 'N/A'}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                          <div className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">CULTURE</div>
                          <div className="text-base font-bold text-gray-900">{selectedSubmission.culture || 'N/A'}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                          <div className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">FORMAT</div>
                          <div className="text-base font-bold text-gray-900">{selectedSubmission.format || 'N/A'}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                          <div className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">GENRE</div>
                          <div className="text-base font-bold text-gray-900">{selectedSubmission.genre || 'N/A'}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                          <div className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">SUB-GENRE</div>
                          <div className="text-base font-bold text-gray-900">{selectedSubmission.subGenre || 'N/A'}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                          <div className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">CONTENT RATING</div>
                          <div className="text-base font-bold text-gray-900">{selectedSubmission.contentRating || 'N/A'}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                          <div className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">PRODUCTION TYPE</div>
                          <div className="text-base font-bold text-gray-900">{selectedSubmission.productionType || 'N/A'}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                          <div className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">SOURCE MATERIAL</div>
                          <div className="text-base font-bold text-gray-900">{selectedSubmission.sourceMaterial || 'N/A'}</div>
                        </div>
                        {selectedSubmission.ipRightsStatus && (
                          <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                            <div className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">IP RIGHTS STATUS</div>
                            <div className="text-base font-bold text-gray-900">{selectedSubmission.ipRightsStatus}</div>
                          </div>
                        )}
                        <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                          <div className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">SHOOT DAYS</div>
                          <div className="text-base font-bold text-gray-900">{selectedSubmission.shootDays || 'N/A'}</div>
                        </div>
                        {selectedSubmission.episodes && (
                          <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                            <div className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">EPISODES</div>
                            <div className="text-base font-bold text-gray-900">{selectedSubmission.episodes}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Creator Information */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
                      <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">👤</span>
                        <span>Creator Information</span>
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                          <div className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">CREATOR NAME</div>
                          <div className="text-base font-bold text-gray-900">{selectedSubmission.creator}</div>
                        </div>
                        {selectedSubmission.creatorAge && (
                          <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                            <div className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">AGE</div>
                            <div className="text-base font-bold text-gray-900">{selectedSubmission.creatorAge}</div>
                          </div>
                        )}
                        <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                          <div className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">EMAIL</div>
                          <div className="text-base font-semibold text-gray-900">{selectedSubmission.officialEmail}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                          <div className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">PHONE</div>
                          <div className="text-base font-semibold text-gray-900">{selectedSubmission.phone}</div>
                        </div>
                        {selectedSubmission.panNumber && (
                          <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                            <div className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">PAN NUMBER</div>
                            <div className="text-base font-semibold text-gray-900">{selectedSubmission.panNumber}</div>
                          </div>
                        )}
                        {selectedSubmission.gstNumber && (
                          <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                            <div className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">GST NUMBER</div>
                            <div className="text-base font-semibold text-gray-900">{selectedSubmission.gstNumber}</div>
                          </div>
                        )}
                        <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                          <div className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">EXPERIENCE</div>
                          <div className="text-base font-semibold text-gray-900">{selectedSubmission.yearsOfExperience} years</div>
                        </div>
                        {selectedSubmission.companyType && (
                          <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                            <div className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">COMPANY TYPE</div>
                            <div className="text-base font-semibold text-gray-900">{selectedSubmission.companyType}</div>
                          </div>
                        )}
                        {selectedSubmission.teamSize && (
                          <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                            <div className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">TEAM SIZE</div>
                            <div className="text-base font-semibold text-gray-900">{selectedSubmission.teamSize}</div>
                          </div>
                        )}
                      </div>
                      {selectedSubmission.previousProjects && (
                        <div className="mt-6 p-5 bg-white rounded-xl border-2 border-purple-200">
                          <div className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">PREVIOUS PROJECTS</div>
                          <div className="text-base font-semibold text-gray-900">{selectedSubmission.previousProjects}</div>
                        </div>
                      )}
                      {selectedSubmission.notableWorks && (
                        <div className="mt-4 p-5 bg-white rounded-xl border-2 border-purple-200">
                          <div className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">NOTABLE WORKS</div>
                          <div className="text-base font-semibold text-gray-900">{selectedSubmission.notableWorks}</div>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {selectedSubmission.imdbLink && (
                          <div className="p-5 bg-blue-100 rounded-xl border-2 border-blue-300">
                            <div className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">IMDB PROFILE</div>
                            <a href={selectedSubmission.imdbLink} target="_blank" rel="noopener noreferrer" className="text-base font-bold text-blue-600 hover:underline">
                              View Profile →
                            </a>
                          </div>
                        )}
                        {selectedSubmission.portfolioLink && (
                          <div className="p-5 bg-purple-100 rounded-xl border-2 border-purple-300">
                            <div className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">PORTFOLIO</div>
                            <a href={selectedSubmission.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-base font-bold text-purple-600 hover:underline">
                              View Portfolio →
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cast Overview */}
                    {selectedSubmission.castData && (selectedSubmission.castData.primaryCast?.length || selectedSubmission.castData.secondaryCast?.length) && (
                      <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 border-2 border-pink-200 shadow-lg">
                        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-2xl">⭐</span>
                          <span>Cast Members</span>
                        </h3>

                        {selectedSubmission.castData.primaryCast && selectedSubmission.castData.primaryCast.length > 0 && (
                          <div className="mb-6">
                            <div className="text-sm font-bold text-pink-700 mb-3 uppercase tracking-wide">Primary Cast ({selectedSubmission.castData.primaryCast.length})</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {selectedSubmission.castData.primaryCast.map((cast: any, idx: number) => (
                                <div key={idx} className="bg-white rounded-lg p-4 border-2 border-pink-200">
                                  <div className="text-base font-bold text-gray-900">{cast.artistName}</div>
                                  <div className="text-sm text-gray-600 mt-1">as {cast.characterName}</div>
                                  {cast.socialMediaLink && (
                                    <a href={cast.socialMediaLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                                      Social Profile →
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedSubmission.castData.secondaryCast && selectedSubmission.castData.secondaryCast.length > 0 && (
                          <div className="mb-6">
                            <div className="text-sm font-bold text-pink-700 mb-3 uppercase tracking-wide">Secondary Cast ({selectedSubmission.castData.secondaryCast.length})</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {selectedSubmission.castData.secondaryCast.map((cast: any, idx: number) => (
                                <div key={idx} className="bg-white rounded-lg p-4 border-2 border-pink-200">
                                  <div className="text-base font-bold text-gray-900">{cast.artistName}</div>
                                  <div className="text-sm text-gray-600 mt-1">as {cast.characterName}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedSubmission.castData.tertiaryCast && selectedSubmission.castData.tertiaryCast.length > 0 && (
                          <div>
                            <div className="text-sm font-bold text-pink-700 mb-3 uppercase tracking-wide">Tertiary Cast ({selectedSubmission.castData.tertiaryCast.length})</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {selectedSubmission.castData.tertiaryCast.slice(0, 4).map((cast: any, idx: number) => (
                                <div key={idx} className="bg-white rounded-lg p-4 border-2 border-pink-200">
                                  <div className="text-base font-bold text-gray-900">{cast.artistName}</div>
                                  <div className="text-sm text-gray-600 mt-1">as {cast.characterName}</div>
                                </div>
                              ))}
                            </div>
                            {selectedSubmission.castData.tertiaryCast.length > 4 && (
                              <div className="text-sm text-gray-600 mt-3 font-semibold">
                                +{selectedSubmission.castData.tertiaryCast.length - 4} more cast members
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Technical Specifications */}
                    {selectedSubmission.technicalSpecs && (
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200 shadow-lg">
                        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-2xl">🎥</span>
                          <span>Technical Specifications</span>
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {selectedSubmission.technicalSpecs.cameraModel && (
                            <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
                              <div className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide">CAMERA MODEL</div>
                              <div className="text-base font-bold text-gray-900">{selectedSubmission.technicalSpecs.cameraModel}</div>
                              {selectedSubmission.technicalSpecs.cameraSetupType && (
                                <div className="text-sm text-gray-600 mt-1">{selectedSubmission.technicalSpecs.cameraSetupType} setup</div>
                              )}
                            </div>
                          )}
                          {selectedSubmission.technicalSpecs.lensTypes?.length > 0 && (
                            <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
                              <div className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide">LENSES</div>
                              <div className="text-base font-bold text-gray-900">{selectedSubmission.technicalSpecs.lensTypes.length} types</div>
                            </div>
                          )}
                          {selectedSubmission.technicalSpecs.lightingEquipment?.length > 0 && (
                            <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
                              <div className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide">LIGHTING</div>
                              <div className="text-base font-bold text-gray-900">{selectedSubmission.technicalSpecs.lightingEquipment.length} items</div>
                            </div>
                          )}
                          {selectedSubmission.technicalSpecs.soundEquipment?.length > 0 && (
                            <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
                              <div className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide">SOUND</div>
                              <div className="text-base font-bold text-gray-900">{selectedSubmission.technicalSpecs.soundEquipment.length} items</div>
                            </div>
                          )}
                          {selectedSubmission.technicalSpecs.droneModels?.length > 0 && (
                            <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
                              <div className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide">DRONES</div>
                              <div className="text-base font-bold text-gray-900">{selectedSubmission.technicalSpecs.droneModels.length} models</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Production Schedule */}
                    {(selectedSubmission.shootStartDate || selectedSubmission.shootEndDate || selectedSubmission.totalDuration) && (
                      <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-8 border-2 border-cyan-200 shadow-lg">
                        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-2xl">📅</span>
                          <span>Production Schedule</span>
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {selectedSubmission.totalDuration && (
                            <div className="bg-white rounded-lg p-4 border-2 border-cyan-200">
                              <div className="text-xs font-bold text-cyan-700 mb-2 uppercase tracking-wide">TOTAL DURATION</div>
                              <div className="text-base font-bold text-gray-900">{selectedSubmission.totalDuration} mins</div>
                            </div>
                          )}
                          {selectedSubmission.shootDays && (
                            <div className="bg-white rounded-lg p-4 border-2 border-cyan-200">
                              <div className="text-xs font-bold text-cyan-700 mb-2 uppercase tracking-wide">SHOOT DAYS</div>
                              <div className="text-base font-bold text-gray-900">{selectedSubmission.shootDays} days</div>
                            </div>
                          )}
                          {selectedSubmission.shootStartDate && (
                            <div className="bg-white rounded-lg p-4 border-2 border-cyan-200">
                              <div className="text-xs font-bold text-cyan-700 mb-2 uppercase tracking-wide">SHOOT START</div>
                              <div className="text-base font-bold text-gray-900">{selectedSubmission.shootStartDate}</div>
                            </div>
                          )}
                          {selectedSubmission.shootEndDate && (
                            <div className="bg-white rounded-lg p-4 border-2 border-cyan-200">
                              <div className="text-xs font-bold text-cyan-700 mb-2 uppercase tracking-wide">SHOOT END</div>
                              <div className="text-base font-bold text-gray-900">{selectedSubmission.shootEndDate}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Address & Contact */}
                    {(selectedSubmission.permanentAddress || selectedSubmission.currentAddress || selectedSubmission.emergencyContactName) && (
                      <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-8 border-2 border-slate-200 shadow-lg">
                        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-2xl">📍</span>
                          <span>Address & Emergency Contact</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedSubmission.permanentAddress && (
                            <div className="bg-white rounded-lg p-4 border-2 border-slate-200">
                              <div className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">PERMANENT ADDRESS</div>
                              <div className="text-base font-semibold text-gray-900">{selectedSubmission.permanentAddress}</div>
                            </div>
                          )}
                          {selectedSubmission.currentAddress && (
                            <div className="bg-white rounded-lg p-4 border-2 border-slate-200">
                              <div className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">CURRENT ADDRESS</div>
                              <div className="text-base font-semibold text-gray-900">{selectedSubmission.currentAddress}</div>
                            </div>
                          )}
                          {selectedSubmission.emergencyContactName && (
                            <div className="bg-white rounded-lg p-4 border-2 border-slate-200">
                              <div className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">EMERGENCY CONTACT</div>
                              <div className="text-base font-bold text-gray-900">{selectedSubmission.emergencyContactName}</div>
                              {selectedSubmission.emergencyContactRelation && (
                                <div className="text-sm text-gray-600">({selectedSubmission.emergencyContactRelation})</div>
                              )}
                              {selectedSubmission.emergencyContactPhone && (
                                <div className="text-sm text-blue-600 font-semibold mt-1">{selectedSubmission.emergencyContactPhone}</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Key Crew Quick View */}
                    {(selectedSubmission.director || selectedSubmission.dop || selectedSubmission.editor || selectedSubmission.musicComposer) && (
                      <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-8 border-2 border-indigo-200 shadow-lg">
                        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-2xl">🎬</span>
                          <span>Key Crew (Quick View)</span>
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {selectedSubmission.director && (
                            <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
                              <div className="text-xs font-bold text-indigo-700 mb-2 uppercase tracking-wide">DIRECTOR</div>
                              <div className="text-base font-bold text-gray-900">{selectedSubmission.director}</div>
                            </div>
                          )}
                          {selectedSubmission.dop && (
                            <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
                              <div className="text-xs font-bold text-indigo-700 mb-2 uppercase tracking-wide">DOP</div>
                              <div className="text-base font-bold text-gray-900">{selectedSubmission.dop}</div>
                            </div>
                          )}
                          {selectedSubmission.editor && (
                            <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
                              <div className="text-xs font-bold text-indigo-700 mb-2 uppercase tracking-wide">EDITOR</div>
                              <div className="text-base font-bold text-gray-900">{selectedSubmission.editor}</div>
                            </div>
                          )}
                          {selectedSubmission.musicComposer && (
                            <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
                              <div className="text-xs font-bold text-indigo-700 mb-2 uppercase tracking-wide">MUSIC</div>
                              <div className="text-base font-bold text-gray-900">{selectedSubmission.musicComposer}</div>
                            </div>
                          )}
                          {selectedSubmission.soundDesigner && (
                            <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
                              <div className="text-xs font-bold text-indigo-700 mb-2 uppercase tracking-wide">SOUND DESIGNER</div>
                              <div className="text-base font-bold text-gray-900">{selectedSubmission.soundDesigner}</div>
                            </div>
                          )}
                          {selectedSubmission.productionDesigner && (
                            <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
                              <div className="text-xs font-bold text-indigo-700 mb-2 uppercase tracking-wide">PRODUCTION DESIGN</div>
                              <div className="text-base font-bold text-gray-900">{selectedSubmission.productionDesigner}</div>
                            </div>
                          )}
                          {selectedSubmission.costumeDesigner && (
                            <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
                              <div className="text-xs font-bold text-indigo-700 mb-2 uppercase tracking-wide">COSTUME</div>
                              <div className="text-base font-bold text-gray-900">{selectedSubmission.costumeDesigner}</div>
                            </div>
                          )}
                          {selectedSubmission.vfxSupervisor && (
                            <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
                              <div className="text-xs font-bold text-indigo-700 mb-2 uppercase tracking-wide">VFX</div>
                              <div className="text-base font-bold text-gray-900">{selectedSubmission.vfxSupervisor}</div>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 text-center">
                          <button
                            onClick={() => setDetailView('crew')}
                            className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
                          >
                            View Full Crew Details →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Cash Flow / Budget Tranches */}
                    {selectedSubmission.cashFlowTranches && selectedSubmission.cashFlowTranches.length > 0 && (
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border-2 border-emerald-200 shadow-lg">
                        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-2xl">💰</span>
                          <span>Cash Flow Tranches</span>
                        </h3>
                        <div className="space-y-3">
                          {selectedSubmission.cashFlowTranches.map((tranche: any, idx: number) => (
                            <div key={idx} className="bg-white rounded-lg p-4 border-2 border-emerald-200 flex justify-between items-center">
                              <div>
                                <div className="text-sm font-bold text-gray-900">{tranche.milestone || `Tranche ${idx + 1}`}</div>
                                {tranche.date && <div className="text-xs text-gray-500">{tranche.date}</div>}
                              </div>
                              <div className="text-lg font-black text-emerald-700">
                                {tranche.percentage ? `${tranche.percentage}%` : formatBudget(tranche.amount || 0)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Documents & Links */}
                    {(selectedSubmission.cloudLinks?.length > 0 || selectedSubmission.uploadedFiles?.length > 0) && (
                      <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 border-2 border-rose-200 shadow-lg">
                        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-2xl">📁</span>
                          <span>Documents & Links</span>
                        </h3>
                        {selectedSubmission.cloudLinks?.length > 0 && (
                          <div className="mb-4">
                            <div className="text-sm font-bold text-rose-700 mb-2 uppercase">Cloud Links</div>
                            <div className="space-y-2">
                              {selectedSubmission.cloudLinks.map((link: string, idx: number) => (
                                <a
                                  key={idx}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block bg-white rounded-lg p-3 border border-rose-200 text-blue-600 hover:text-blue-800 font-semibold truncate"
                                >
                                  🔗 {link}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedSubmission.uploadedFiles?.length > 0 && (
                          <div>
                            <div className="text-sm font-bold text-rose-700 mb-2 uppercase">Uploaded Files ({selectedSubmission.uploadedFiles.length})</div>
                            <div className="grid grid-cols-2 gap-2">
                              {selectedSubmission.uploadedFiles.map((file: any, idx: number) => (
                                <div key={idx} className="bg-white rounded-lg p-3 border border-rose-200">
                                  <div className="text-sm font-semibold text-gray-900 truncate">{file.name}</div>
                                  <div className="text-xs text-gray-500">{file.type}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Submission Info */}
                    <div className="bg-gradient-to-br from-gray-100 to-slate-100 rounded-2xl p-6 border-2 border-gray-300">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-gray-600 font-semibold">Submitted: </span>
                          <span className="text-gray-900 font-bold">{selectedSubmission.submittedDate || selectedSubmission.submitted_at?.split('T')[0]}</span>
                        </div>
                        {selectedSubmission.updated_at && (
                          <div>
                            <span className="text-gray-600 font-semibold">Last Updated: </span>
                            <span className="text-gray-900 font-bold">{selectedSubmission.updated_at.split('T')[0]}</span>
                          </div>
                        )}
                        {selectedSubmission.isLocalSubmission && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                            Local Submission
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Budget Tab - Redesigned */}
                {detailView === 'budget' && (
                  <div className="space-y-6">
                    {/* Total Budget Overview Card */}
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border-2 border-emerald-200 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-emerald-700 mb-2 uppercase tracking-wide">💰 Total Project Budget</div>
                          <div className="text-5xl font-black text-emerald-900 mb-2">
                            {formatBudgetInWords(selectedSubmission.totalBudget)}
                          </div>
                          <div className="text-lg text-emerald-700 font-semibold">
                            ₹{selectedSubmission.totalBudget.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div className="text-6xl">💵</div>
                      </div>
                    </div>

                    {/* Department-wise Budget Breakdown */}
                    <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-lg">
                      <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">📊</span>
                        <span>Department-wise Budget Allocation</span>
                      </h3>
                      <div className="space-y-4">
                        {selectedSubmission.budgetBreakdown?.map((item: any, index: number) => (
                          <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-xl font-black text-gray-900">{item.category}</span>
                                  <span className="px-3 py-1 bg-blue-100 border border-blue-300 rounded-full text-sm font-bold text-blue-700">
                                    {item.percentage}% of Total
                                  </span>
                                </div>
                                <div className="text-2xl font-black text-blue-900">
                                  {formatBudgetInWords(item.amount)}
                                </div>
                                <div className="text-sm text-gray-600 font-semibold mt-1">
                                  ₹{item.amount.toLocaleString('en-IN')}
                                </div>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="relative">
                              <div className="h-3 bg-blue-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all"
                                  style={{ width: `${item.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Tranches */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
                      <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">💳</span>
                        <span>Payment Schedule & Tranches</span>
                      </h3>

                      <div className="space-y-4">
                        {/* Tranche 1 */}
                        <div className="bg-white rounded-xl p-6 border-2 border-purple-200 hover:shadow-md transition-all">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-black">1</span>
                              <div>
                                <div className="text-lg font-black text-gray-900">First Tranche - On Signing</div>
                                <div className="text-sm text-gray-600 font-semibold">Contract Execution</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-black text-purple-900">20%</div>
                              <div className="text-sm text-purple-700 font-bold">{formatBudgetInWords(selectedSubmission.totalBudget * 0.20)}</div>
                            </div>
                          </div>
                        </div>

                        {/* Tranche 2 */}
                        <div className="bg-white rounded-xl p-6 border-2 border-purple-200 hover:shadow-md transition-all">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-black">2</span>
                              <div>
                                <div className="text-lg font-black text-gray-900">Second Tranche - Pre-Production</div>
                                <div className="text-sm text-gray-600 font-semibold">Before Shoot Begins</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-black text-purple-900">30%</div>
                              <div className="text-sm text-purple-700 font-bold">{formatBudgetInWords(selectedSubmission.totalBudget * 0.30)}</div>
                            </div>
                          </div>
                        </div>

                        {/* Tranche 3 */}
                        <div className="bg-white rounded-xl p-6 border-2 border-purple-200 hover:shadow-md transition-all">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-black">3</span>
                              <div>
                                <div className="text-lg font-black text-gray-900">Third Tranche - Mid-Production</div>
                                <div className="text-sm text-gray-600 font-semibold">50% Shoot Completion</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-black text-purple-900">25%</div>
                              <div className="text-sm text-purple-700 font-bold">{formatBudgetInWords(selectedSubmission.totalBudget * 0.25)}</div>
                            </div>
                          </div>
                        </div>

                        {/* Tranche 4 */}
                        <div className="bg-white rounded-xl p-6 border-2 border-purple-200 hover:shadow-md transition-all">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-black">4</span>
                              <div>
                                <div className="text-lg font-black text-gray-900">Final Tranche - Delivery</div>
                                <div className="text-sm text-gray-600 font-semibold">Post Final Delivery</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-black text-purple-900">25%</div>
                              <div className="text-sm text-purple-700 font-bold">{formatBudgetInWords(selectedSubmission.totalBudget * 0.25)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Budget Summary Stats */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200 shadow-lg">
                      <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">📈</span>
                        <span>Budget Health & Analysis</span>
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl p-6 border-2 border-amber-200 text-center">
                          <div className="text-sm font-bold text-amber-700 mb-3 uppercase">Budget Alignment</div>
                          <div className="text-4xl font-black mb-2">
                            {(() => {
                              const breakdown = selectedSubmission.budgetBreakdown || [];
                              const industryStandards: any = {
                                'Cast': { min: 15, max: 35 },
                                'Crew': { min: 15, max: 25 },
                                'Production': { min: 20, max: 30 },
                                'Post-Production': { min: 10, max: 20 },
                                'Music & Songs': { min: 3, max: 12 },
                                'Music': { min: 3, max: 12 },
                              };

                              let normalCount = 0;
                              breakdown.forEach((item: any) => {
                                const standard = industryStandards[item.category];
                                if (standard && item.percentage >= standard.min && item.percentage <= standard.max) {
                                  normalCount++;
                                }
                              });

                              const score = breakdown.length > 0 ? Math.round((normalCount / breakdown.length) * 100) : 0;
                              return (
                                <span className={
                                  score >= 80 ? 'text-green-600' :
                                  score >= 60 ? 'text-yellow-600' :
                                  'text-red-600'
                                }>
                                  {score}%
                                </span>
                              );
                            })()}
                          </div>
                          <div className="text-xs font-bold text-gray-600">Industry Standards</div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border-2 border-amber-200 text-center">
                          <div className="text-sm font-bold text-amber-700 mb-3 uppercase">Completeness</div>
                          <div className="text-4xl font-black text-blue-600 mb-2">
                            {selectedSubmission.completeness}%
                          </div>
                          <div className="text-xs font-bold text-gray-600">Data Filled</div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border-2 border-amber-200 text-center">
                          <div className="text-sm font-bold text-amber-700 mb-3 uppercase">Departments</div>
                          <div className="text-4xl font-black text-purple-600 mb-2">
                            {selectedSubmission.budgetBreakdown?.length || 0}
                          </div>
                          <div className="text-xs font-bold text-gray-600">Budget Categories</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Crew Tab */}
                {detailView === 'crew' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-lg">
                      <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">👥</span>
                        <span>Complete Crew List - All Departments</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Direction Department */}
                        {(selectedSubmission.director || selectedSubmission.associateDirector || selectedSubmission.assistantDirector1) && (
                          <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-5">
                            <div className="text-xs font-bold text-red-700 mb-4 flex items-center gap-2 uppercase tracking-wide">
                              <span>🎬</span>
                              <span>DIRECTION DEPARTMENT</span>
                            </div>
                            <div className="space-y-3">
                              {selectedSubmission.director && (
                                <div className="bg-white rounded-lg p-3 border border-red-200">
                                  <div className="text-xs text-red-600 font-bold mb-1">Director</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.director}</div>
                                </div>
                              )}
                              {selectedSubmission.associateDirector && (
                                <div className="bg-white rounded-lg p-3 border border-red-200">
                                  <div className="text-xs text-red-600 font-bold mb-1">Associate Director</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.associateDirector}</div>
                                </div>
                              )}
                              {selectedSubmission.assistantDirector1 && (
                                <div className="bg-white rounded-lg p-3 border border-red-200">
                                  <div className="text-xs text-red-600 font-bold mb-1">Assistant Director</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.assistantDirector1}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Production Department */}
                        {(selectedSubmission.headOfProduction || selectedSubmission.executiveProducer || selectedSubmission.lineProducer) && (
                          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-5">
                            <div className="text-xs font-bold text-orange-700 mb-4 flex items-center gap-2 uppercase tracking-wide">
                              <span>🎯</span>
                              <span>PRODUCTION DEPARTMENT</span>
                            </div>
                            <div className="space-y-3">
                              {selectedSubmission.headOfProduction && (
                                <div className="bg-white rounded-lg p-3 border border-orange-200">
                                  <div className="text-xs text-orange-600 font-bold mb-1">Head of Production</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.headOfProduction}</div>
                                </div>
                              )}
                              {selectedSubmission.executiveProducer && (
                                <div className="bg-white rounded-lg p-3 border border-orange-200">
                                  <div className="text-xs text-orange-600 font-bold mb-1">Executive Producer</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.executiveProducer}</div>
                                </div>
                              )}
                              {selectedSubmission.lineProducer && (
                                <div className="bg-white rounded-lg p-3 border border-orange-200">
                                  <div className="text-xs text-orange-600 font-bold mb-1">Line Producer</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.lineProducer}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Creative Department */}
                        {(selectedSubmission.showRunner || selectedSubmission.creativeDirector || selectedSubmission.projectHead) && (
                          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-5">
                            <div className="text-xs font-bold text-purple-700 mb-4 flex items-center gap-2 uppercase tracking-wide">
                              <span>💡</span>
                              <span>CREATIVE DEPARTMENT</span>
                            </div>
                            <div className="space-y-3">
                              {selectedSubmission.showRunner && (
                                <div className="bg-white rounded-lg p-3 border border-purple-200">
                                  <div className="text-xs text-purple-600 font-bold mb-1">Show Runner</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.showRunner}</div>
                                </div>
                              )}
                              {selectedSubmission.creativeDirector && (
                                <div className="bg-white rounded-lg p-3 border border-purple-200">
                                  <div className="text-xs text-purple-600 font-bold mb-1">Creative Director</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.creativeDirector}</div>
                                </div>
                              )}
                              {selectedSubmission.projectHead && (
                                <div className="bg-white rounded-lg p-3 border border-purple-200">
                                  <div className="text-xs text-purple-600 font-bold mb-1">Project Head</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.projectHead}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Writing Department */}
                        {(selectedSubmission.writer || selectedSubmission.storyBy || selectedSubmission.screenplayBy || selectedSubmission.dialoguesBy) && (
                          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-xl p-5">
                            <div className="text-xs font-bold text-yellow-700 mb-4 flex items-center gap-2 uppercase tracking-wide">
                              <span>✍️</span>
                              <span>WRITING DEPARTMENT</span>
                            </div>
                            <div className="space-y-3">
                              {selectedSubmission.writer && (
                                <div className="bg-white rounded-lg p-3 border border-yellow-200">
                                  <div className="text-xs text-yellow-600 font-bold mb-1">Writer</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.writer}</div>
                                </div>
                              )}
                              {selectedSubmission.storyBy && (
                                <div className="bg-white rounded-lg p-3 border border-yellow-200">
                                  <div className="text-xs text-yellow-600 font-bold mb-1">Story By</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.storyBy}</div>
                                </div>
                              )}
                              {selectedSubmission.screenplayBy && (
                                <div className="bg-white rounded-lg p-3 border border-yellow-200">
                                  <div className="text-xs text-yellow-600 font-bold mb-1">Screenplay By</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.screenplayBy}</div>
                                </div>
                              )}
                              {selectedSubmission.dialoguesBy && (
                                <div className="bg-white rounded-lg p-3 border border-yellow-200">
                                  <div className="text-xs text-yellow-600 font-bold mb-1">Dialogues By</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.dialoguesBy}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Camera Department */}
                        {(selectedSubmission.dop || selectedSubmission.firstCameraOperator || selectedSubmission.steadicamOperator) && (
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-5">
                            <div className="text-xs font-bold text-blue-700 mb-4 flex items-center gap-2 uppercase tracking-wide">
                              <span>📹</span>
                              <span>CAMERA DEPARTMENT</span>
                            </div>
                            <div className="space-y-3">
                              {selectedSubmission.dop && (
                                <div className="bg-white rounded-lg p-3 border border-blue-200">
                                  <div className="text-xs text-blue-600 font-bold mb-1">Director of Photography</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.dop}</div>
                                </div>
                              )}
                              {selectedSubmission.firstCameraOperator && (
                                <div className="bg-white rounded-lg p-3 border border-blue-200">
                                  <div className="text-xs text-blue-600 font-bold mb-1">1st Camera Operator</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.firstCameraOperator}</div>
                                </div>
                              )}
                              {selectedSubmission.steadicamOperator && (
                                <div className="bg-white rounded-lg p-3 border border-blue-200">
                                  <div className="text-xs text-blue-600 font-bold mb-1">Steadicam Operator</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.steadicamOperator}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Editing Department */}
                        {(selectedSubmission.editor || selectedSubmission.colorist || selectedSubmission.onLocationEditor) && (
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5">
                            <div className="text-xs font-bold text-green-700 mb-4 flex items-center gap-2 uppercase tracking-wide">
                              <span>✂️</span>
                              <span>EDITING DEPARTMENT</span>
                            </div>
                            <div className="space-y-3">
                              {selectedSubmission.editor && (
                                <div className="bg-white rounded-lg p-3 border border-green-200">
                                  <div className="text-xs text-green-600 font-bold mb-1">Editor</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.editor}</div>
                                </div>
                              )}
                              {selectedSubmission.colorist && (
                                <div className="bg-white rounded-lg p-3 border border-green-200">
                                  <div className="text-xs text-green-600 font-bold mb-1">Colorist</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.colorist}</div>
                                </div>
                              )}
                              {selectedSubmission.onLocationEditor && (
                                <div className="bg-white rounded-lg p-3 border border-green-200">
                                  <div className="text-xs text-green-600 font-bold mb-1">On-Location Editor</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.onLocationEditor}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Sound Department */}
                        {(selectedSubmission.soundRecordist || selectedSubmission.soundDesigner || selectedSubmission.foleyArtist) && (
                          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-5">
                            <div className="text-xs font-bold text-indigo-700 mb-4 flex items-center gap-2 uppercase tracking-wide">
                              <span>🎙️</span>
                              <span>SOUND DEPARTMENT</span>
                            </div>
                            <div className="space-y-3">
                              {selectedSubmission.soundRecordist && (
                                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                                  <div className="text-xs text-indigo-600 font-bold mb-1">Sound Recordist</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.soundRecordist}</div>
                                </div>
                              )}
                              {selectedSubmission.soundDesigner && (
                                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                                  <div className="text-xs text-indigo-600 font-bold mb-1">Sound Designer</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.soundDesigner}</div>
                                </div>
                              )}
                              {selectedSubmission.foleyArtist && (
                                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                                  <div className="text-xs text-indigo-600 font-bold mb-1">Foley Artist</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.foleyArtist}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Music Department */}
                        {(selectedSubmission.musicComposer || selectedSubmission.bgmComposer || selectedSubmission.playbackSinger) && (
                          <div className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200 rounded-xl p-5">
                            <div className="text-xs font-bold text-pink-700 mb-4 flex items-center gap-2 uppercase tracking-wide">
                              <span>🎵</span>
                              <span>MUSIC DEPARTMENT</span>
                            </div>
                            <div className="space-y-3">
                              {selectedSubmission.musicComposer && (
                                <div className="bg-white rounded-lg p-3 border border-pink-200">
                                  <div className="text-xs text-pink-600 font-bold mb-1">Music Composer</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.musicComposer}</div>
                                </div>
                              )}
                              {selectedSubmission.bgmComposer && (
                                <div className="bg-white rounded-lg p-3 border border-pink-200">
                                  <div className="text-xs text-pink-600 font-bold mb-1">BGM Composer</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.bgmComposer}</div>
                                </div>
                              )}
                              {selectedSubmission.playbackSinger && (
                                <div className="bg-white rounded-lg p-3 border border-pink-200">
                                  <div className="text-xs text-pink-600 font-bold mb-1">Playback Singer</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.playbackSinger}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Art Department */}
                        {(selectedSubmission.productionDesigner || selectedSubmission.artDirector || selectedSubmission.setDesigner) && (
                          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-5">
                            <div className="text-xs font-bold text-amber-700 mb-4 flex items-center gap-2 uppercase tracking-wide">
                              <span>🎨</span>
                              <span>ART DEPARTMENT</span>
                            </div>
                            <div className="space-y-3">
                              {selectedSubmission.productionDesigner && (
                                <div className="bg-white rounded-lg p-3 border border-amber-200">
                                  <div className="text-xs text-amber-600 font-bold mb-1">Production Designer</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.productionDesigner}</div>
                                </div>
                              )}
                              {selectedSubmission.artDirector && (
                                <div className="bg-white rounded-lg p-3 border border-amber-200">
                                  <div className="text-xs text-amber-600 font-bold mb-1">Art Director</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.artDirector}</div>
                                </div>
                              )}
                              {selectedSubmission.setDesigner && (
                                <div className="bg-white rounded-lg p-3 border border-amber-200">
                                  <div className="text-xs text-amber-600 font-bold mb-1">Set Designer</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.setDesigner}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Costume & Makeup */}
                        {(selectedSubmission.costumeDesigner || selectedSubmission.makeupArtist || selectedSubmission.hairStylist) && (
                          <div className="bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 rounded-xl p-5">
                            <div className="text-xs font-bold text-rose-700 mb-4 flex items-center gap-2 uppercase tracking-wide">
                              <span>👗</span>
                              <span>COSTUME & MAKEUP</span>
                            </div>
                            <div className="space-y-3">
                              {selectedSubmission.costumeDesigner && (
                                <div className="bg-white rounded-lg p-3 border border-rose-200">
                                  <div className="text-xs text-rose-600 font-bold mb-1">Costume Designer</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.costumeDesigner}</div>
                                </div>
                              )}
                              {selectedSubmission.makeupArtist && (
                                <div className="bg-white rounded-lg p-3 border border-rose-200">
                                  <div className="text-xs text-rose-600 font-bold mb-1">Makeup Artist</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.makeupArtist}</div>
                                </div>
                              )}
                              {selectedSubmission.hairStylist && (
                                <div className="bg-white rounded-lg p-3 border border-rose-200">
                                  <div className="text-xs text-rose-600 font-bold mb-1">Hair Stylist</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.hairStylist}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* VFX & Post Production */}
                        {(selectedSubmission.vfxSupervisor || selectedSubmission.diArtist) && (
                          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl p-5">
                            <div className="text-xs font-bold text-cyan-700 mb-4 flex items-center gap-2 uppercase tracking-wide">
                              <span>✨</span>
                              <span>VFX & POST PRODUCTION</span>
                            </div>
                            <div className="space-y-3">
                              {selectedSubmission.vfxSupervisor && (
                                <div className="bg-white rounded-lg p-3 border border-cyan-200">
                                  <div className="text-xs text-cyan-600 font-bold mb-1">VFX Supervisor</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.vfxSupervisor}</div>
                                </div>
                              )}
                              {selectedSubmission.diArtist && (
                                <div className="bg-white rounded-lg p-3 border border-cyan-200">
                                  <div className="text-xs text-cyan-600 font-bold mb-1">DI Artist</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.diArtist}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action & Choreography */}
                        {(selectedSubmission.actionDirector || selectedSubmission.stuntCoordinator || selectedSubmission.choreographer) && (
                          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-5">
                            <div className="text-xs font-bold text-red-700 mb-4 flex items-center gap-2 uppercase tracking-wide">
                              <span>💥</span>
                              <span>ACTION & CHOREOGRAPHY</span>
                            </div>
                            <div className="space-y-3">
                              {selectedSubmission.actionDirector && (
                                <div className="bg-white rounded-lg p-3 border border-red-200">
                                  <div className="text-xs text-red-600 font-bold mb-1">Action Director</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.actionDirector}</div>
                                </div>
                              )}
                              {selectedSubmission.stuntCoordinator && (
                                <div className="bg-white rounded-lg p-3 border border-red-200">
                                  <div className="text-xs text-red-600 font-bold mb-1">Stunt Coordinator</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.stuntCoordinator}</div>
                                </div>
                              )}
                              {selectedSubmission.choreographer && (
                                <div className="bg-white rounded-lg p-3 border border-red-200">
                                  <div className="text-xs text-red-600 font-bold mb-1">Choreographer</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.choreographer}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Casting */}
                        {selectedSubmission.castingDirector && (
                          <div className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 rounded-xl p-5">
                            <div className="text-xs font-bold text-violet-700 mb-4 flex items-center gap-2 uppercase tracking-wide">
                              <span>🎭</span>
                              <span>CASTING</span>
                            </div>
                            <div className="space-y-3">
                              <div className="bg-white rounded-lg p-3 border border-violet-200">
                                <div className="text-xs text-violet-600 font-bold mb-1">Casting Director</div>
                                <div className="text-base font-bold text-gray-900">{selectedSubmission.castingDirector}</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Photography & Documentation */}
                        {(selectedSubmission.stillPhotographer || selectedSubmission.btsVideographer) && (
                          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl p-5">
                            <div className="text-xs font-bold text-teal-700 mb-4 flex items-center gap-2 uppercase tracking-wide">
                              <span>📸</span>
                              <span>PHOTOGRAPHY & DOCUMENTATION</span>
                            </div>
                            <div className="space-y-3">
                              {selectedSubmission.stillPhotographer && (
                                <div className="bg-white rounded-lg p-3 border border-teal-200">
                                  <div className="text-xs text-teal-600 font-bold mb-1">Still Photographer</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.stillPhotographer}</div>
                                </div>
                              )}
                              {selectedSubmission.btsVideographer && (
                                <div className="bg-white rounded-lg p-3 border border-teal-200">
                                  <div className="text-xs text-teal-600 font-bold mb-1">BTS Videographer</div>
                                  <div className="text-base font-bold text-gray-900">{selectedSubmission.btsVideographer}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Empty State */}
                      {!selectedSubmission.director && !selectedSubmission.dop && !selectedSubmission.editor && (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                          <div className="text-6xl mb-4">👥</div>
                          <div className="text-xl font-bold text-gray-700">No crew members added yet</div>
                          <div className="text-sm text-gray-500 mt-2 font-semibold">Crew details will appear here once submitted</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Timeline Tab */}
                {detailView === 'timeline' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-lg">
                      <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">📅</span>
                        <span>Production Timeline</span>
                      </h3>
                      <div className="space-y-4">
                        {selectedSubmission.shootStartDate && (
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">SHOOT START DATE</div>
                                <div className="text-lg font-bold text-gray-900">
                                  {formatDateLong(selectedSubmission.shootStartDate)}
                                </div>
                              </div>
                              <span className="text-4xl">🎬</span>
                            </div>
                          </div>
                        )}

                        {selectedSubmission.shootEndDate && (
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">SHOOT END DATE</div>
                                <div className="text-lg font-bold text-gray-900">
                                  {formatDateLong(selectedSubmission.shootEndDate)}
                                </div>
                              </div>
                              <span className="text-4xl">🎞️</span>
                            </div>
                          </div>
                        )}

                        {selectedSubmission.shootDays && (
                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border-2 border-amber-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide">TOTAL SHOOT DAYS</div>
                                <div className="text-lg font-bold text-gray-900">{selectedSubmission.shootDays} days</div>
                              </div>
                              <span className="text-4xl">📆</span>
                            </div>
                          </div>
                        )}

                        {selectedSubmission.finalDeliveryDate && (
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-300">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wide">FINAL DELIVERY DATE</div>
                                <div className="text-lg font-black text-gray-900">
                                  {formatDateLong(selectedSubmission.finalDeliveryDate)}
                                </div>
                              </div>
                              <span className="text-4xl">✅</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Activity Log Tab */}
                {detailView === 'activity' && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-200 shadow-lg">
                      <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                        <span className="text-2xl">📜</span>
                        <span>Project Activity Timeline</span>
                      </h3>
                      <div className="text-base text-gray-700 mb-6 font-semibold">
                        Complete history of all actions taken on this project - from submission to current status
                      </div>

                      {/* Timeline */}
                      <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-400 via-purple-400 to-pink-400"></div>

                        {/* Activity Items */}
                        <div className="space-y-6">
                          {selectedSubmission.activityLog && selectedSubmission.activityLog.map((activity: any, index: number) => {
                            const typeColors: any = {
                              submit: 'bg-blue-500 border-blue-400',
                              review: 'bg-yellow-500 border-yellow-400',
                              approved: 'bg-green-500 border-green-400',
                              revision: 'bg-orange-500 border-orange-400',
                              hold: 'bg-gray-500 border-gray-400',
                              pending: 'bg-amber-500 border-amber-400',
                              progress: 'bg-purple-500 border-purple-400',
                              issue: 'bg-red-500 border-red-400',
                            };

                            return (
                              <div key={index} className="relative pl-16">
                                {/* Timeline Dot */}
                                <div className={`absolute left-3 top-2 w-6 h-6 rounded-full border-4 ${typeColors[activity.type] || 'bg-gray-500 border-gray-400'} shadow-md`}></div>

                                {/* Activity Card */}
                                <div className="bg-white rounded-xl p-5 border-2 border-indigo-200 hover:shadow-md transition-shadow">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <h4 className="text-lg font-black text-gray-900 mb-2">{activity.action}</h4>
                                      <p className="text-base text-gray-700 font-semibold">{activity.description}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-600 font-bold mt-3">
                                    <span className="flex items-center gap-1">
                                      <span>📅</span>
                                      <span>{formatDateWithMonth(activity.date)}</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <span>⏰</span>
                                      <span>{activity.time}</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <span>👤</span>
                                      <span>{activity.user}</span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Status Info */}
                      <div className="mt-8 p-6 bg-white rounded-xl border-2 border-indigo-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-indigo-700 mb-2 uppercase tracking-wide">CURRENT STATUS</div>
                            <div className="text-lg font-black text-gray-900">{getStatusConfig(selectedSubmission.status).text}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold text-indigo-700 mb-2 uppercase tracking-wide">DAYS IN SYSTEM</div>
                            <div className="text-lg font-black text-gray-900">
                              {Math.floor((new Date().getTime() - new Date(selectedSubmission.submittedDate).getTime()) / (1000 * 60 * 60 * 24))} days
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Files Tab */}
                {detailView === 'files' && (
                  <div className="space-y-6">
                    {/* Uploaded Files */}
                    {selectedSubmission.uploadedFiles && selectedSubmission.uploadedFiles.length > 0 && (
                      <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-2xl">📎</span>
                          <span>Uploaded Files</span>
                        </h3>
                        <div className="space-y-4">
                          {selectedSubmission.uploadedFiles.map((file: any, index: number) => (
                            <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 flex items-center justify-between border-2 border-blue-200 hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-4">
                                <span className="text-2xl">📄</span>
                                <div>
                                  <div className="text-base font-bold text-gray-900">{file.name}</div>
                                  <div className="text-sm text-gray-600 font-semibold">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB • Uploaded{' '}
                                    {formatDate(file.uploadDate)}
                                  </div>
                                </div>
                              </div>
                              <button className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-all shadow-md hover:shadow-lg">
                                Download
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cloud Links */}
                    {selectedSubmission.cloudLinks && selectedSubmission.cloudLinks.length > 0 && (
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
                        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-2xl">☁️</span>
                          <span>Cloud Links</span>
                        </h3>
                        <div className="space-y-4">
                          {selectedSubmission.cloudLinks.map((link: string, index: number) => (
                            <div key={index} className="bg-white rounded-xl p-5 flex items-center justify-between border-2 border-purple-200 hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <span className="text-2xl">🔗</span>
                                <div className="text-base font-semibold text-blue-600 truncate">{link}</div>
                              </div>
                              <button className="ml-3 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-all shadow-md hover:shadow-lg whitespace-nowrap">
                                Open Link
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(!selectedSubmission.uploadedFiles || selectedSubmission.uploadedFiles.length === 0) &&
                      (!selectedSubmission.cloudLinks || selectedSubmission.cloudLinks.length === 0) && (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                          <div className="text-6xl mb-4">📭</div>
                          <div className="text-xl font-bold text-gray-700">No files uploaded yet</div>
                          <div className="text-sm text-gray-500 mt-2 font-semibold">Files will appear here once uploaded</div>
                        </div>
                      )}
                  </div>
                )}

                {/* Agreement Tab */}
                {detailView === 'agreement' && (
                  <div className="space-y-6">
                    {/* Export Header */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white shadow-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-3xl font-black mb-2">Agreement Export</h2>
                          <p className="text-green-100 font-semibold">Export all project details for agreement documentation</p>
                        </div>
                        <div className="text-6xl">📋</div>
                      </div>
                    </div>

                    {/* Export Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => exportToExcel(selectedSubmission)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                      >
                        <span className="text-3xl">📊</span>
                        <div className="text-left">
                          <div>Export to Excel</div>
                          <div className="text-sm font-semibold text-green-100">Download .xlsx file</div>
                        </div>
                      </button>
                      <button
                        onClick={() => exportToPDF(selectedSubmission)}
                        className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white p-6 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                      >
                        <span className="text-3xl">📄</span>
                        <div className="text-left">
                          <div>Export to PDF</div>
                          <div className="text-sm font-semibold text-red-100">Download .pdf file</div>
                        </div>
                      </button>
                    </div>

                    {/* Agreement Preview */}
                    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
                      <div className="bg-gray-900 text-white p-4">
                        <h3 className="text-xl font-black">Agreement Details Preview</h3>
                      </div>
                      <div className="p-6 space-y-6">
                        {/* 1. Agreement Date */}
                        <div className="border-b-2 border-gray-100 pb-4">
                          <div className="text-xs font-bold text-gray-500 uppercase mb-1">1. Agreement Date</div>
                          <div className="text-lg font-bold text-gray-900">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </div>

                        {/* 2. Content Name */}
                        <div className="border-b-2 border-gray-100 pb-4">
                          <div className="text-xs font-bold text-gray-500 uppercase mb-1">2. Content Name</div>
                          <div className="text-lg font-bold text-gray-900">{selectedSubmission.projectName || 'N/A'}</div>
                        </div>

                        {/* 3. Creator/Company Details */}
                        <div className="border-b-2 border-gray-100 pb-4">
                          <div className="text-xs font-bold text-gray-500 uppercase mb-2">3. Creator / Company Details</div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-gray-500">Name:</span> <span className="font-bold">{selectedSubmission.creatorName || selectedSubmission.creator || 'N/A'}</span></div>
                            <div><span className="text-gray-500">Company:</span> <span className="font-bold">{selectedSubmission.productionCompany || 'N/A'}</span></div>
                            <div><span className="text-gray-500">Father's Name:</span> <span className="font-bold">{selectedSubmission.fatherName || 'N/A'}</span></div>
                            <div><span className="text-gray-500">Authorized Signatory:</span> <span className="font-bold">{selectedSubmission.authorizedSignatory || 'N/A'}</span></div>
                            <div className="col-span-2"><span className="text-gray-500">Address:</span> <span className="font-bold">{selectedSubmission.permanentAddress || selectedSubmission.currentAddress || 'N/A'}</span></div>
                            <div><span className="text-gray-500">PAN:</span> <span className="font-bold">{selectedSubmission.panNumber || 'N/A'}</span></div>
                            <div><span className="text-gray-500">GST:</span> <span className="font-bold">{selectedSubmission.gstNumber || 'N/A'}</span></div>
                            <div><span className="text-gray-500">Email:</span> <span className="font-bold">{selectedSubmission.officialEmail || 'N/A'}</span></div>
                            <div><span className="text-gray-500">Phone:</span> <span className="font-bold">{selectedSubmission.phone || 'N/A'}</span></div>
                          </div>
                        </div>

                        {/* 4. Budget */}
                        <div className="border-b-2 border-gray-100 pb-4">
                          <div className="text-xs font-bold text-gray-500 uppercase mb-1">4. Total Budget</div>
                          <div className="text-2xl font-black text-green-600">{formatBudget(selectedSubmission.totalBudget || selectedSubmission.estimatedBudget || 0)}</div>
                        </div>

                        {/* 5. Director & Writer */}
                        <div className="border-b-2 border-gray-100 pb-4">
                          <div className="text-xs font-bold text-gray-500 uppercase mb-2">5. Director & Writer</div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-gray-500">Director:</span> <span className="font-bold">{selectedSubmission.director || 'N/A'}</span></div>
                            <div><span className="text-gray-500">Story By:</span> <span className="font-bold">{selectedSubmission.storyBy || 'N/A'}</span></div>
                            <div><span className="text-gray-500">Screenplay:</span> <span className="font-bold">{selectedSubmission.screenplayBy || 'N/A'}</span></div>
                            <div><span className="text-gray-500">Dialogues:</span> <span className="font-bold">{selectedSubmission.dialoguesBy || 'N/A'}</span></div>
                          </div>
                        </div>

                        {/* 6. Content Duration & Episodes */}
                        <div className="border-b-2 border-gray-100 pb-4">
                          <div className="text-xs font-bold text-gray-500 uppercase mb-2">6. Total Minutes of Content & Episodes</div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div><span className="text-gray-500">Total Duration:</span> <span className="font-bold">{selectedSubmission.totalDuration || 'N/A'} mins</span></div>
                            <div><span className="text-gray-500">Episodes:</span> <span className="font-bold">{selectedSubmission.episodes || selectedSubmission.episodesPerSeason || 'N/A'}</span></div>
                            <div><span className="text-gray-500">Format:</span> <span className="font-bold">{selectedSubmission.format || 'N/A'}</span></div>
                          </div>
                        </div>

                        {/* 7. Project Delivery Date */}
                        <div className="border-b-2 border-gray-100 pb-4">
                          <div className="text-xs font-bold text-gray-500 uppercase mb-2">7. Project Delivery Date</div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div><span className="text-gray-500">Final Delivery:</span> <span className="font-bold">{selectedSubmission.contentTimeline?.finalDeliveryDate || 'N/A'}</span></div>
                            <div><span className="text-gray-500">Shoot Start:</span> <span className="font-bold">{selectedSubmission.shootStartDate || 'N/A'}</span></div>
                            <div><span className="text-gray-500">Shoot End:</span> <span className="font-bold">{selectedSubmission.shootEndDate || 'N/A'}</span></div>
                          </div>
                        </div>

                        {/* 8. Cash Flow / Payment Terms */}
                        <div className="border-b-2 border-gray-100 pb-4">
                          <div className="text-xs font-bold text-gray-500 uppercase mb-2">8. Cash Flow (Payment Terms)</div>
                          {selectedSubmission.cashFlowTranches && selectedSubmission.cashFlowTranches.length > 0 ? (
                            <div className="space-y-2">
                              {selectedSubmission.cashFlowTranches.map((tranche: any, idx: number) => (
                                <div key={idx} className="flex justify-between bg-gray-50 p-3 rounded-lg">
                                  <span className="font-semibold">{tranche.milestone || `Tranche ${idx + 1}`}</span>
                                  <span className="font-bold text-green-600">{tranche.percentage ? `${tranche.percentage}%` : formatBudget(tranche.amount || 0)}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-500">No cash flow tranches defined</div>
                          )}
                        </div>

                        {/* 9. Content Creation Schedule */}
                        <div className="border-b-2 border-gray-100 pb-4">
                          <div className="text-xs font-bold text-gray-500 uppercase mb-2">9. Content Creation Schedule</div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-gray-500">Pre-Production:</span> <span className="font-bold">{selectedSubmission.contentTimeline?.preProductionStart || 'N/A'} - {selectedSubmission.contentTimeline?.preProductionEnd || 'N/A'}</span></div>
                            <div><span className="text-gray-500">Principal Photography:</span> <span className="font-bold">{selectedSubmission.shootStartDate || 'N/A'} - {selectedSubmission.shootEndDate || 'N/A'}</span></div>
                            <div><span className="text-gray-500">Post-Production:</span> <span className="font-bold">{selectedSubmission.contentTimeline?.postProductionStart || 'N/A'} - {selectedSubmission.contentTimeline?.postProductionEnd || 'N/A'}</span></div>
                            <div><span className="text-gray-500">Shoot Days:</span> <span className="font-bold">{selectedSubmission.shootDays || 'N/A'} days</span></div>
                          </div>
                        </div>

                        {/* 10. Technical Specifications */}
                        <div className="border-b-2 border-gray-100 pb-4">
                          <div className="text-xs font-bold text-gray-500 uppercase mb-2">10. Technical Specifications</div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-gray-500">Camera:</span> <span className="font-bold">{selectedSubmission.technicalSpecs?.cameraModel || 'N/A'}</span></div>
                            <div><span className="text-gray-500">Setup:</span> <span className="font-bold">{selectedSubmission.technicalSpecs?.cameraSetupType || 'N/A'}</span></div>
                            <div><span className="text-gray-500">Lenses:</span> <span className="font-bold">{selectedSubmission.technicalSpecs?.lensTypes?.length || 0} types</span></div>
                            <div><span className="text-gray-500">Lighting:</span> <span className="font-bold">{selectedSubmission.technicalSpecs?.lightingEquipment?.length || 0} items</span></div>
                          </div>
                        </div>

                        {/* 11. Budget Sheet Summary */}
                        <div>
                          <div className="text-xs font-bold text-gray-500 uppercase mb-2">11. Budget Sheet (Category-wise)</div>
                          {selectedSubmission.budgetBreakdown && selectedSubmission.budgetBreakdown.length > 0 ? (
                            <div className="space-y-2">
                              {selectedSubmission.budgetBreakdown.slice(0, 5).map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between bg-gray-50 p-3 rounded-lg">
                                  <span className="font-semibold">{item.category}</span>
                                  <span className="font-bold text-blue-600">{formatBudget(item.amount || 0)}</span>
                                </div>
                              ))}
                              {selectedSubmission.budgetBreakdown.length > 5 && (
                                <div className="text-sm text-gray-500 text-center">+{selectedSubmission.budgetBreakdown.length - 5} more categories in Excel export</div>
                              )}
                            </div>
                          ) : (
                            <div className="text-gray-500">Budget breakdown will be included in full export</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="flex-shrink-0 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-xl border-t border-white/10 p-3 md:p-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <button
                    onClick={() => {
                      setSelectedSubmission(null);
                      setDetailView('overview');
                    }}
                    className="px-4 py-2 md:px-5 md:py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-lg border border-white/20 transition-all"
                  >
                    Close
                  </button>

                  {/* Quick Action Buttons Based on Status */}
                  {selectedSubmission.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(selectedSubmission.id, 'approved')}
                        className="flex-1 px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-black rounded-lg shadow-lg transition-all"
                      >
                        ✓ Approve Project
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedSubmission.id, 'revision-requested')}
                        className="px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-sm font-black rounded-lg shadow-lg transition-all"
                      >
                        📝 Request Revision
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedSubmission.id, 'on-hold')}
                        className="px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-sm font-black rounded-lg shadow-lg transition-all"
                      >
                        ⏸️ Put On Hold
                      </button>
                    </>
                  )}

                  {selectedSubmission.status === 'under-review' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(selectedSubmission.id, 'approved')}
                        className="flex-1 px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-black rounded-lg shadow-lg transition-all"
                      >
                        ✓ Approve Project
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedSubmission.id, 'revision-requested')}
                        className="px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-sm font-black rounded-lg shadow-lg transition-all"
                      >
                        📝 Revision Needed
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedSubmission.id, 'scrapped')}
                        className="px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white text-sm font-black rounded-lg shadow-lg transition-all"
                      >
                        🗑️ Scrap
                      </button>
                    </>
                  )}

                  {selectedSubmission.status === 'approved' && (
                    <>
                      <div className="flex-1 text-center">
                        <span className="text-green-400 font-black text-sm md:text-base">✓ Project Approved</span>
                      </div>
                      <button
                        onClick={() => handleStatusChange(selectedSubmission.id, 'in-production')}
                        className="px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-black rounded-lg shadow-lg transition-all"
                      >
                        🎬 Move to Production
                      </button>
                    </>
                  )}

                  {selectedSubmission.status === 'revision-requested' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(selectedSubmission.id, 'under-review')}
                        className="flex-1 px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-sm font-black rounded-lg shadow-lg transition-all"
                      >
                        👁️ Move to Review
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedSubmission.id, 'on-hold')}
                        className="px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-sm font-black rounded-lg shadow-lg transition-all"
                      >
                        ⏸️ Put On Hold
                      </button>
                    </>
                  )}

                  {selectedSubmission.status === 'on-hold' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(selectedSubmission.id, 'under-review')}
                        className="flex-1 px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-sm font-black rounded-lg shadow-lg transition-all"
                      >
                        👁️ Resume Review
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedSubmission.id, 'scrapped')}
                        className="px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white text-sm font-black rounded-lg shadow-lg transition-all"
                      >
                        🗑️ Scrap Project
                      </button>
                    </>
                  )}

                  {selectedSubmission.status === 'in-production' && (
                    <div className="flex-1 text-center">
                      <span className="text-cyan-400 font-black text-sm md:text-base">🎬 In Production</span>
                    </div>
                  )}

                  {selectedSubmission.status === 'scrapped' && (
                    <>
                      <div className="flex-1 text-center">
                        <span className="text-gray-400 font-black text-sm md:text-base">🗑️ Project Scrapped</span>
                      </div>
                      <button
                        onClick={() => handleStatusChange(selectedSubmission.id, 'pending')}
                        className="px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white text-sm font-black rounded-lg shadow-lg transition-all"
                      >
                        ↩️ Restore to Pending
                      </button>
                    </>
                  )}

                  {/* Delete Button - Always Available */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDeleteConfirm(selectedSubmission.id)}
                      className="px-4 py-2 md:px-5 md:py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-black rounded-lg shadow-lg transition-all border-2 border-red-500"
                      title="Delete Project"
                    >
                      🗑️ Delete
                    </button>
                    {showDeleteConfirm === selectedSubmission.id && (
                      <div className="absolute right-0 bottom-full mb-2 bg-gray-900 border-2 border-red-500 rounded-lg shadow-2xl z-50 p-4 min-w-[300px]">
                        <div className="text-sm font-bold text-white mb-3">⚠️ Permanently Delete "{selectedSubmission.projectName}"?</div>
                        <div className="text-xs text-gray-300 mb-4">
                          This action cannot be undone. All project data, files, and history will be permanently deleted.
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              handleDeleteProject(selectedSubmission.id);
                              setSelectedSubmission(null);
                            }}
                            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-black rounded text-sm"
                          >
                            Yes, Delete Forever
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
