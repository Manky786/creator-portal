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
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'analytics' | 'budget' | 'library' | 'projects'>('overview');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterFormat, setFilterFormat] = useState<string>('all');
  const [filterCulture, setFilterCulture] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [detailView, setDetailView] = useState<'project' | 'creator' | 'budget' | 'timeline' | 'crew' | 'cast' | 'technical' | 'cashflow' | 'documents' | 'missing' | 'agreement' | 'activity' | 'sop'>('project');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [showStatusMenu, setShowStatusMenu] = useState<number | null>(null);
  const [submissions, setSubmissions] = useState<any[]>(sampleSubmissions);
  const [localSubmissionsLoaded, setLocalSubmissionsLoaded] = useState(false);
  const [expandedBudgetCulture, setExpandedBudgetCulture] = useState<string | null>(null);
  const [showBudgetBreakdown, setShowBudgetBreakdown] = useState(false);
  const [viewedProjects, setViewedProjects] = useState<Set<number>>(new Set());
  const [editAccessRequests, setEditAccessRequests] = useState<any[]>([]);
  const [showEditRequestsPanel, setShowEditRequestsPanel] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [denyReason, setDenyReason] = useState('');
  const [activityNote, setActivityNote] = useState('');
  const [projectsCultureFilter, setProjectsCultureFilter] = useState<string>('all');
  const [selectedPOC, setSelectedPOC] = useState<string | null>(null);
  const [draggedRowId, setDraggedRowId] = useState<string | null>(null);
  const [projectsOrder, setProjectsOrder] = useState<string[]>([]);
  const [customPOCs, setCustomPOCs] = useState<string[]>([]);
  const [showAddPOCModal, setShowAddPOCModal] = useState(false);
  const [newPOCName, setNewPOCName] = useState('');
  const [expandedBudgetProject, setExpandedBudgetProject] = useState<string | null>(null);
  const [activityNoteType, setActivityNoteType] = useState('note');

  // Status change with comment modal states
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [statusChangeComment, setStatusChangeComment] = useState('');
  const [pendingStatusChange, setPendingStatusChange] = useState<{ submissionId: number; newStatus: string } | null>(null);

  // Search & Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'budget' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showAnalytics, setShowAnalytics] = useState(true); // Show by default

  // Advanced Filter states
  const [dateRangeFrom, setDateRangeFrom] = useState('');
  const [dateRangeTo, setDateRangeTo] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Document Preview state
  const [previewDocument, setPreviewDocument] = useState<{ url: string; name: string; type: string } | null>(null);

  // Admin Notifications (from creators)
  const [adminNotifications, setAdminNotifications] = useState<any[]>([]);
  const [showCreatorUpdatesPanel, setShowCreatorUpdatesPanel] = useState(false);

  // Talent Library states
  const [talentLibrary, setTalentLibrary] = useState<any[]>([]);
  const [selectedTalent, setSelectedTalent] = useState<any>(null);
  const [showAddTalentModal, setShowAddTalentModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [librarySearchQuery, setLibrarySearchQuery] = useState('');
  const [newTalent, setNewTalent] = useState({
    name: '', role: '', department: 'direction', phone: '', email: '', workLink: '', culture: 'Haryanvi', notes: ''
  });
  const [showTalentShareMenu, setShowTalentShareMenu] = useState(false);
  const [showTalentDownloadMenu, setShowTalentDownloadMenu] = useState(false);

  // Share individual talent profile
  const shareTalentProfile = (talent: any, platform: string) => {
    const profileText = `🎬 STAGE Talent: ${talent.name}\n📋 Role: ${talent.role}\n🎭 Department: ${talent.department}\n🌍 Culture: ${talent.culture}\n${talent.phone ? `📱 Phone: ${talent.phone}\n` : ''}${talent.email ? `📧 Email: ${talent.email}\n` : ''}${talent.workLink ? `🔗 Portfolio: ${talent.workLink}\n` : ''}${talent.projects?.length > 0 ? `🎬 Projects: ${talent.projects.map((p: any) => p.name || p).join(', ')}\n` : ''}\n🎯 From STAGE OTT Platform`;

    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(profileText)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(profileText.substring(0, 280))}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://stage.in')}&title=${encodeURIComponent(`STAGE Talent: ${talent.name}`)}&summary=${encodeURIComponent(profileText)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(`STAGE Talent Profile: ${talent.name}`)}&body=${encodeURIComponent(profileText)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(profileText);
        alert('Profile copied to clipboard!');
        break;
    }
    setShowTalentShareMenu(false);
  };

  // Download individual talent profile
  const downloadTalentProfile = (talent: any, format: string) => {
    switch(format) {
      case 'pdf':
        const pdfContent = `
          <html>
            <head>
              <title>${talent.name} - STAGE Talent Profile</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
                .header { background: linear-gradient(135deg, #8B5CF6, #6366F1); color: white; padding: 30px; border-radius: 16px; margin-bottom: 24px; }
                .avatar { width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: bold; margin-bottom: 16px; }
                .name { font-size: 28px; font-weight: bold; margin: 0; }
                .role { font-size: 18px; opacity: 0.9; margin: 4px 0; }
                .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 14px; margin-top: 8px; }
                .section { background: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
                .section-title { font-weight: bold; color: #374151; margin-bottom: 12px; font-size: 16px; }
                .info-row { display: flex; margin-bottom: 8px; }
                .info-label { color: #6b7280; width: 100px; }
                .info-value { color: #1f2937; }
                .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 32px; }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="avatar">${talent.name.charAt(0).toUpperCase()}</div>
                <p class="name">${talent.name}</p>
                <p class="role">${talent.role}</p>
                <span class="badge">${talent.department}</span>
              </div>
              <div class="section">
                <div class="section-title">📞 Contact Information</div>
                <div class="info-row"><span class="info-label">Phone:</span><span class="info-value">${talent.phone || 'Not provided'}</span></div>
                <div class="info-row"><span class="info-label">Email:</span><span class="info-value">${talent.email || 'Not provided'}</span></div>
              </div>
              <div class="section">
                <div class="section-title">🔗 Portfolio</div>
                <p style="color: #3b82f6;">${talent.workLink || 'Not provided'}</p>
              </div>
              <div class="section">
                <div class="section-title">🎭 Culture</div>
                <span style="background: #f3e8ff; color: #7c3aed; padding: 4px 16px; border-radius: 20px; font-weight: bold;">${talent.culture}</span>
              </div>
              ${talent.projects?.length > 0 ? `
              <div class="section">
                <div class="section-title">🎬 STAGE Projects</div>
                ${talent.projects.map((p: any) => `<p style="margin: 4px 0;">• ${p.name || p} ${p.status ? `(${p.status})` : ''}</p>`).join('')}
              </div>
              ` : ''}
              ${talent.notes ? `
              <div class="section">
                <div class="section-title">📝 Notes</div>
                <p>${talent.notes}</p>
              </div>
              ` : ''}
              <div class="footer">Generated from STAGE OTT Platform • ${new Date().toLocaleDateString()}</div>
            </body>
          </html>
        `;
        const pdfWindow = window.open('', '_blank');
        if (pdfWindow) {
          pdfWindow.document.write(pdfContent);
          pdfWindow.document.close();
          pdfWindow.print();
        }
        break;
      case 'vcard':
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${talent.name}
TITLE:${talent.role}
ORG:STAGE OTT - ${talent.department}
TEL:${talent.phone || ''}
EMAIL:${talent.email || ''}
URL:${talent.workLink || ''}
NOTE:Culture: ${talent.culture}${talent.projects?.length > 0 ? ` | Projects: ${talent.projects.map((p: any) => p.name || p).join(', ')}` : ''}
END:VCARD`;
        const vcardBlob = new Blob([vcard], { type: 'text/vcard' });
        const vcardUrl = URL.createObjectURL(vcardBlob);
        const vcardLink = document.createElement('a');
        vcardLink.href = vcardUrl;
        vcardLink.download = `${talent.name.replace(/\s+/g, '_')}_STAGE.vcf`;
        vcardLink.click();
        URL.revokeObjectURL(vcardUrl);
        break;
      case 'json':
        const jsonData = JSON.stringify(talent, null, 2);
        const jsonBlob = new Blob([jsonData], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement('a');
        jsonLink.href = jsonUrl;
        jsonLink.download = `${talent.name.replace(/\s+/g, '_')}_STAGE.json`;
        jsonLink.click();
        URL.revokeObjectURL(jsonUrl);
        break;
    }
    setShowTalentDownloadMenu(false);
  };

  // Load viewed projects from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const viewed = JSON.parse(localStorage.getItem('stage_viewed_projects') || '[]');
      setViewedProjects(new Set(viewed));

      // Load edit access requests
      const editRequests = JSON.parse(localStorage.getItem('stage_edit_requests') || '[]');
      setEditAccessRequests(editRequests);

      // Load talent library
      const savedTalents = JSON.parse(localStorage.getItem('stage_talent_library') || '[]');
      setTalentLibrary(savedTalents);
    }
  }, []);

  // Extract talents from a project and add to library
  const extractTalentsFromProject = (project: any) => {
    const talents: any[] = [];
    const addTalent = (name: string | undefined, role: string, department: string, email?: string, phone?: string, workLink?: string) => {
      if (name && name.trim()) {
        talents.push({
          id: `talent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: name.trim(),
          role,
          department,
          phone: phone || '',
          email: email || '',
          workLink: workLink || '',
          culture: project.culture || 'Not Specified',
          projects: [{ id: project.id, name: project.projectName, status: project.status }],
          addedFrom: project.projectName,
          addedAt: new Date().toISOString(),
          notes: '',
          projectCulture: project.culture,
          previousProjects: project.previousProjects || ''
        });
      }
    };

    // Direction Team
    addTalent(project.director, 'Director', 'direction');
    addTalent(project.associateDirector, 'Associate Director', 'direction');
    addTalent(project.assistantDirector1, 'Assistant Director 1', 'direction');
    addTalent(project.assistantDirector2, 'Assistant Director 2', 'direction');
    addTalent(project.showRunner, 'Show Runner', 'direction');
    addTalent(project.creativeDirector, 'Creative Director', 'direction');
    addTalent(project.castingDirector, 'Casting Director', 'direction');

    // Production Team
    addTalent(project.headOfProduction, 'Head of Production', 'production');
    addTalent(project.executiveProducer, 'Executive Producer', 'production');
    addTalent(project.lineProducer, 'Line Producer', 'production');
    addTalent(project.projectHead, 'Project Head', 'production');
    addTalent(project.productionManager, 'Production Manager', 'production');
    addTalent(project.productionController, 'Production Controller', 'production');
    // Creator/Producer with their contact details
    addTalent(project.creator || project.creatorName, 'Creator/Producer', 'production', project.officialEmail, project.phone);

    // Writing Team
    addTalent(project.writer, 'Writer', 'writing');
    addTalent(project.storyBy, 'Story Writer', 'writing');
    addTalent(project.screenplayBy, 'Screenplay Writer', 'writing');
    addTalent(project.dialoguesBy, 'Dialogue Writer', 'writing');

    // Camera Department
    addTalent(project.dop, 'DOP (Director of Photography)', 'camera');
    addTalent(project.firstCameraOperator, 'Camera Operator', 'camera');
    addTalent(project.steadicamOperator, 'Steadicam Operator', 'camera');
    addTalent(project.stillPhotographer, 'Still Photographer', 'camera');
    addTalent(project.btsVideographer, 'BTS Videographer', 'camera');

    // Editing / Post-Production
    addTalent(project.editor, 'Editor', 'editing');
    addTalent(project.colorist, 'Colorist', 'editing');
    addTalent(project.onLocationEditor, 'On-Location Editor', 'editing');

    // Sound Department
    addTalent(project.soundRecordist, 'Sound Recordist', 'sound');
    addTalent(project.soundDesigner, 'Sound Designer', 'sound');
    addTalent(project.foleyArtist, 'Foley Artist', 'sound');
    addTalent(project.reRecordingMixer, 'Re-Recording Mixer', 'sound');

    // Music Team
    addTalent(project.musicComposer, 'Music Composer', 'music');
    addTalent(project.bgmComposer, 'BGM Composer', 'music');
    addTalent(project.playbackSinger, 'Playback Singer', 'music');
    addTalent(project.lyricist, 'Lyricist', 'music');

    // Art Department
    addTalent(project.productionDesigner, 'Production Designer', 'art');
    addTalent(project.artDirector, 'Art Director', 'art');
    addTalent(project.setDesigner, 'Set Designer', 'art');

    // Costume & Makeup
    addTalent(project.costumeDesigner, 'Costume Designer', 'costume');
    addTalent(project.makeupArtist, 'Makeup Artist', 'costume');
    addTalent(project.hairStylist, 'Hair Stylist', 'costume');

    // VFX & Post
    addTalent(project.vfxSupervisor, 'VFX Supervisor', 'vfx');
    addTalent(project.diArtist, 'DI Artist', 'vfx');

    // Cast from castData (with social media links)
    if (project.castData) {
      // Primary Cast
      if (project.castData.primaryCast && Array.isArray(project.castData.primaryCast)) {
        project.castData.primaryCast.forEach((castMember: any) => {
          if (castMember.artistName) {
            addTalent(
              castMember.artistName,
              `Lead Actor (${castMember.characterName || 'Character'})`,
              'cast',
              '',
              '',
              castMember.socialMediaLink || ''
            );
          }
        });
      }
      // Secondary Cast
      if (project.castData.secondaryCast && Array.isArray(project.castData.secondaryCast)) {
        project.castData.secondaryCast.forEach((castMember: any) => {
          if (castMember.artistName) {
            addTalent(
              castMember.artistName,
              `Supporting Actor (${castMember.characterName || 'Character'})`,
              'cast',
              '',
              '',
              castMember.socialMediaLink || ''
            );
          }
        });
      }
      // Tertiary Cast
      if (project.castData.tertiaryCast && Array.isArray(project.castData.tertiaryCast)) {
        project.castData.tertiaryCast.forEach((castMember: any) => {
          if (castMember.artistName) {
            addTalent(
              castMember.artistName,
              `Actor (${castMember.characterName || 'Character'})`,
              'cast',
              '',
              '',
              castMember.socialMediaLink || ''
            );
          }
        });
      }
    }

    // Legacy cast array support
    if (project.cast && Array.isArray(project.cast)) {
      project.cast.forEach((castMember: any) => {
        addTalent(castMember.name || castMember.artistName, castMember.role || 'Actor', 'cast');
      });
    }

    return talents;
  };

  // Add talents to library (merging duplicates)
  const addTalentsToLibrary = (newTalents: any[]) => {
    setTalentLibrary(prev => {
      const updated = [...prev];
      newTalents.forEach(talent => {
        const existing = updated.find(t =>
          t.name.toLowerCase() === talent.name.toLowerCase() &&
          t.role.toLowerCase() === talent.role.toLowerCase()
        );
        if (existing) {
          // Merge projects
          const projectExists = existing.projects.some((p: any) => p.id === talent.projects[0]?.id);
          if (!projectExists && talent.projects[0]) {
            existing.projects.push(talent.projects[0]);
          }
          // Update contact info if missing
          if (!existing.phone && talent.phone) existing.phone = talent.phone;
          if (!existing.email && talent.email) existing.email = talent.email;
          if (!existing.workLink && talent.workLink) existing.workLink = talent.workLink;
          if (!existing.culture && talent.culture) existing.culture = talent.culture;
          if (!existing.previousProjects && talent.previousProjects) existing.previousProjects = talent.previousProjects;
        } else {
          updated.push(talent);
        }
      });
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('stage_talent_library', JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Add single talent manually
  const handleAddTalent = () => {
    if (!newTalent.name.trim() || !newTalent.role.trim()) {
      alert('Name and Role are required!');
      return;
    }
    const talent = {
      id: `talent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...newTalent,
      projects: [],
      addedFrom: 'Manual Entry',
      addedAt: new Date().toISOString()
    };
    setTalentLibrary(prev => {
      const updated = [...prev, talent];
      if (typeof window !== 'undefined') {
        localStorage.setItem('stage_talent_library', JSON.stringify(updated));
      }
      return updated;
    });
    setNewTalent({ name: '', role: '', department: 'direction', phone: '', email: '', workLink: '', culture: 'Haryanvi', notes: '' });
    setShowAddTalentModal(false);
  };

  // Update talent
  const handleUpdateTalent = (updatedTalent: any) => {
    setTalentLibrary(prev => {
      const updated = prev.map(t => t.id === updatedTalent.id ? updatedTalent : t);
      if (typeof window !== 'undefined') {
        localStorage.setItem('stage_talent_library', JSON.stringify(updated));
      }
      return updated;
    });
    setSelectedTalent(updatedTalent);
  };

  // Delete talent
  const handleDeleteTalent = (talentId: string) => {
    if (!confirm('Are you sure you want to delete this talent from the library?')) return;
    setTalentLibrary(prev => {
      const updated = prev.filter(t => t.id !== talentId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('stage_talent_library', JSON.stringify(updated));
      }
      return updated;
    });
    setSelectedTalent(null);
  };

  // Share functionality
  const handleShare = async (title: string, text: string, url?: string) => {
    const shareData = {
      title: title,
      text: text,
      url: url || window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback - copy to clipboard
      const shareText = `${title}\n\n${text}\n\n${url || window.location.href}`;
      navigator.clipboard.writeText(shareText);
      alert('Link copied to clipboard! Share it anywhere.');
    }
  };

  // Share to specific platforms
  const shareToWhatsApp = (text: string) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToTwitter = (text: string) => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToLinkedIn = (text: string, url: string) => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareToEmail = (subject: string, body: string) => {
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  // Download talents as Excel
  const downloadTalentsExcel = (talents: any[], filename: string) => {
    const data = talents.map(t => ({
      'Name': t.name,
      'Role': t.role,
      'Department': t.department,
      'Phone': t.phone || '',
      'Email': t.email || '',
      'Work Link': t.workLink || '',
      'Culture': t.culture || '',
      'Projects': t.projects?.map((p: any) => p.name || p).join(', ') || '',
      'Notes': t.notes || ''
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Talents');

    // Set column widths
    ws['!cols'] = [
      { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 15 },
      { wch: 25 }, { wch: 30 }, { wch: 12 }, { wch: 40 }, { wch: 30 }
    ];

    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  // Download talents as CSV
  const downloadTalentsCSV = (talents: any[], filename: string) => {
    const headers = ['Name', 'Role', 'Department', 'Phone', 'Email', 'Work Link', 'Culture', 'Projects', 'Notes'];
    const rows = talents.map(t => [
      t.name,
      t.role,
      t.department,
      t.phone || '',
      t.email || '',
      t.workLink || '',
      t.culture || '',
      t.projects?.map((p: any) => p.name || p).join('; ') || '',
      t.notes || ''
    ]);

    const csvContent = [headers, ...rows].map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  // Download talents as PDF (simple text format)
  const downloadTalentsPDF = (talents: any[], title: string) => {
    // Create printable HTML
    const printContent = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #7c3aed; color: white; padding: 10px; text-align: left; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
            tr:nth-child(even) { background: #f9fafb; }
            .header { display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 24px; font-weight: bold; color: #7c3aed; }
            .date { color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">STAGE OTT - Talent Library</div>
            <div class="date">${new Date().toLocaleDateString('en-IN')}</div>
          </div>
          <h1>${title}</h1>
          <table>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Contact</th>
              <th>Culture</th>
              <th>Projects</th>
            </tr>
            ${talents.map(t => `
              <tr>
                <td><strong>${t.name}</strong></td>
                <td>${t.role}</td>
                <td>${t.department}</td>
                <td>${t.phone || t.email || '-'}</td>
                <td>${t.culture || '-'}</td>
                <td>${t.projects?.map((p: any) => p.name || p).join(', ') || '-'}</td>
              </tr>
            `).join('')}
          </table>
          <p style="margin-top: 30px; color: #666; font-size: 12px;">
            Generated by STAGE OTT Creator Portal • Total: ${talents.length} talents
          </p>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Download project as various formats
  const downloadProjectData = (project: any, format: 'excel' | 'pdf' | 'json') => {
    if (format === 'excel') {
      exportToExcel(project);
    } else if (format === 'json') {
      const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${project.projectName || 'project'}_data.json`;
      link.click();
    } else if (format === 'pdf') {
      // Use print for PDF
      const printContent = `
        <html>
          <head>
            <title>${project.projectName} - Project Details</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #dc2626; }
              h2 { color: #7c3aed; margin-top: 20px; }
              .section { background: #f9fafb; padding: 15px; border-radius: 8px; margin: 10px 0; }
              .row { display: flex; margin: 5px 0; }
              .label { font-weight: bold; width: 200px; color: #666; }
              .value { flex: 1; }
            </style>
          </head>
          <body>
            <h1>${project.projectName}</h1>
            <div class="section">
              <div class="row"><span class="label">Culture:</span><span class="value">${project.culture}</span></div>
              <div class="row"><span class="label">Format:</span><span class="value">${project.format}</span></div>
              <div class="row"><span class="label">Genre:</span><span class="value">${project.genre}</span></div>
              <div class="row"><span class="label">Budget:</span><span class="value">₹${(project.totalBudget || 0).toLocaleString('en-IN')}</span></div>
              <div class="row"><span class="label">Status:</span><span class="value">${project.status}</span></div>
            </div>
            <h2>Creator Details</h2>
            <div class="section">
              <div class="row"><span class="label">Creator:</span><span class="value">${project.creator || project.creatorName || '-'}</span></div>
              <div class="row"><span class="label">Email:</span><span class="value">${project.officialEmail || '-'}</span></div>
              <div class="row"><span class="label">Phone:</span><span class="value">${project.phone || '-'}</span></div>
            </div>
            <h2>Key Crew</h2>
            <div class="section">
              <div class="row"><span class="label">Director:</span><span class="value">${project.director || '-'}</span></div>
              <div class="row"><span class="label">DOP:</span><span class="value">${project.dop || '-'}</span></div>
              <div class="row"><span class="label">Editor:</span><span class="value">${project.editor || '-'}</span></div>
              <div class="row"><span class="label">Music:</span><span class="value">${project.musicComposer || '-'}</span></div>
            </div>
          </body>
        </html>
      `;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  // Mark project as viewed
  const markAsViewed = (projectId: number) => {
    setViewedProjects(prev => {
      const newSet = new Set(prev);
      newSet.add(projectId);
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('stage_viewed_projects', JSON.stringify([...newSet]));
      }
      return newSet;
    });
  };

  // Load submissions from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !localSubmissionsLoaded) {
      const localSubmissions = JSON.parse(localStorage.getItem('stage_submissions') || '[]');
      if (localSubmissions.length > 0) {
        // Transform local submissions to match the format
        const transformedSubmissions = localSubmissions.map((sub: any, idx: number) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id: _oldId, ...subWithoutId } = sub; // Remove old id to prevent duplicates
          return {
            ...subWithoutId, // Spread first so our values take precedence
            id: `local-${1000 + idx}`, // Use string ID with prefix to ensure uniqueness
            projectName: sub.projectName || 'Untitled Project',
            creator: sub.creatorName || 'Unknown Creator',
            culture: sub.culture || 'Not Specified',
            format: sub.format || 'Not Specified',
            genre: sub.genre || 'Not Specified',
            subGenre: sub.subGenre || '',
            contentRating: sub.contentRating || 'Not Rated',
            totalBudget: parseFloat(sub.estimatedBudget) || sub.totalBudget || 0,
            completeness: 50, // Placeholder
            warnings: 0,
            status: sub.status || 'pending',
            submittedDate: sub.submitted_at ? sub.submitted_at.split('T')[0] : new Date().toISOString().split('T')[0],
            episodes: sub.episodesPerSeason || 1,
            thumbnail: '/api/placeholder/400/225',
            productionPOC: sub.productionPOC || '',
            contentPOC: sub.contentPOC || '',
            activityLog: sub.activityLog || [
              {
                date: sub.submitted_at ? sub.submitted_at.split('T')[0] : new Date().toISOString().split('T')[0],
                time: sub.submitted_at ? new Date(sub.submitted_at).toLocaleTimeString() : new Date().toLocaleTimeString(),
                action: 'Project Submitted',
                description: 'Creator submitted project for review (via local storage)',
                user: sub.creatorName || 'Creator',
                type: 'submit'
              }
            ],
            isLocalSubmission: true,
          };
        });

        setSubmissions([...transformedSubmissions, ...sampleSubmissions]);
      }
      setLocalSubmissionsLoaded(true);

      // Load admin notifications (from creators)
      const savedAdminNotifs = JSON.parse(localStorage.getItem('stage_admin_notifications') || '[]');
      setAdminNotifications(savedAdminNotifs);
    }
  }, [localSubmissionsLoaded]);

  // Auto-sync talents from approved/in-production projects
  useEffect(() => {
    if (localSubmissionsLoaded && submissions.length > 0) {
      const approvedProjects = submissions.filter(s =>
        s.status === 'approved' || s.status === 'in-production'
      );

      if (approvedProjects.length > 0) {
        // Check which projects are already synced
        const syncedProjectIds = new Set(
          talentLibrary.flatMap(t => t.projects?.map((p: any) => p.id) || [])
        );

        const projectsToSync = approvedProjects.filter(p => !syncedProjectIds.has(p.id));

        if (projectsToSync.length > 0) {
          console.log(`Auto-syncing talents from ${projectsToSync.length} approved projects...`);
          projectsToSync.forEach(project => {
            const talents = extractTalentsFromProject(project);
            if (talents.length > 0) {
              addTalentsToLibrary(talents);
            }
          });
        }
      }
    }
  }, [localSubmissionsLoaded, submissions]);

  const [expandedBudgetStatus, setExpandedBudgetStatus] = useState<string | null>(null);
  const [expandedDepartment, setExpandedDepartment] = useState<string | null>(null);
  const [expandedTranche, setExpandedTranche] = useState<number | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<{[key: string]: boolean}>({
    paymentTranches: true,
    crewDetails: true,
    timeline: true,
    cashFlow: true,
    documents: true,
  });
  const [editingPOC, setEditingPOC] = useState<{ submissionId: number; field: 'productionPOC' | 'contentPOC' } | null>(null);

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
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

  // Check if submission is new (submitted in last 48 hours AND not yet viewed)
  const isNewSubmission = (submittedDate: string, projectId: number) => {
    // If already viewed, not new
    if (viewedProjects.has(projectId)) {
      return false;
    }
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
  const newSubmissionsCount = submissions.filter(s => isNewSubmission(s.submittedDate, s.id)).length;

  // Generate default payment tranches based on project format
  const getDefaultTranches = (format: string, totalBudget: number) => {
    const isMicrodrama = format?.toLowerCase().includes('micro');

    if (isMicrodrama) {
      return [
        { name: 'Tranche 1 - Agreement Signing', description: 'Due upon the signing of the agreement, against a duly approved invoice. Payment will be made within 15 days of the approved invoice date.', percentage: 50, amount: Math.round(totalBudget * 0.5), status: 'pending' },
        { name: 'Tranche 2 - Final Deliverables', description: 'Due after the submission and approval of all final deliverables (TC, QC, and any other agreed-upon items), against a duly approved invoice. Payment will be processed within 15 days of the approved invoice date.', percentage: 50, amount: Math.round(totalBudget * 0.5), status: 'pending' },
      ];
    }

    // Default 4-tranche structure for Feature/Series/Mini
    return [
      { name: 'Tranche 1 - Agreement Signing', description: 'Upon signing of the agreement. Payment released within 15 days of approved invoice.', percentage: 25, amount: Math.round(totalBudget * 0.25), status: 'pending' },
      { name: 'Tranche 2 - Offline Edit Approval', description: 'Following the successful completion and approval of the offline edit. Payment released within 15 days of approved invoice.', percentage: 25, amount: Math.round(totalBudget * 0.25), status: 'pending' },
      { name: 'Tranche 3 - Final Delivery & QC', description: 'After final Technical Check (TC), Quality Check (QC), and approval of all project deliverables. Payment released within 15 days of approved invoice.', percentage: 40, amount: Math.round(totalBudget * 0.40), status: 'pending' },
      { name: 'Tranche 4 - Post-Delivery Payment', description: 'Payable 60 days after the final delivery, contingent upon the receipt of a duly approved invoice. Payment released within 15 days thereafter.', percentage: 10, amount: Math.round(totalBudget * 0.10), status: 'pending' },
    ];
  };

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
      case 'agreement-signed':
        return { color: 'from-teal-500 to-cyan-600', icon: '📄 AGREEMENT', text: 'Agreement Signed', badge: 'bg-teal-100 border-teal-500 text-teal-800' };
      default:
        return { color: 'from-gray-500 to-gray-600', icon: '• ' + status.toUpperCase(), text: status, badge: 'bg-gray-100 border-gray-500 text-gray-800' };
    }
  };

  // Helper function for culture colors - only 4 cultures supported
  const getCultureColor = (culture: string): string => {
    const cultureLower = culture?.toLowerCase() || '';
    switch (cultureLower) {
      case 'haryanvi':
        return 'from-green-600 to-teal-700';
      case 'rajasthani':
        return 'from-pink-600 to-purple-700';
      case 'bhojpuri':
        return 'from-orange-600 to-red-700';
      case 'gujarati':
        return 'from-amber-500 to-yellow-600';
      default:
        return 'from-gray-600 to-slate-700';
    }
  };

  // Activity Log Helper - Save activity for a project
  const addActivityLog = (projectId: number, action: string, description: string, type: string, user: string = 'Admin Team') => {
    const now = new Date();
    const activity = {
      id: `activity_${Date.now()}`,
      projectId,
      action,
      description,
      type, // 'submit' | 'status' | 'assign' | 'feedback' | 'review' | 'edit' | 'access'
      user,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      timestamp: now.toISOString(),
    };

    // Save to localStorage
    if (typeof window !== 'undefined') {
      const existingLogs = JSON.parse(localStorage.getItem('stage_activity_logs') || '{}');
      if (!existingLogs[projectId]) {
        existingLogs[projectId] = [];
      }
      existingLogs[projectId].unshift(activity); // Add to beginning (newest first)
      localStorage.setItem('stage_activity_logs', JSON.stringify(existingLogs));
    }

    // Also update the submission's activityLog in state
    setSubmissions(prev => prev.map(s => {
      if (s.id === projectId) {
        const currentLog = s.activityLog || [];
        return { ...s, activityLog: [activity, ...currentLog] };
      }
      return s;
    }));

    return activity;
  };

  // Get activity logs for a project
  const getActivityLogs = (projectId: number) => {
    if (typeof window !== 'undefined') {
      const allLogs = JSON.parse(localStorage.getItem('stage_activity_logs') || '{}');
      return allLogs[projectId] || [];
    }
    return [];
  };

  // Open status change modal with comment field
  const handleStatusChange = (submissionId: number, newStatus: string) => {
    setPendingStatusChange({ submissionId, newStatus });
    setStatusChangeComment('');
    setShowStatusChangeModal(true);
    setShowStatusMenu(null);
  };

  // Confirm status change with comment
  const confirmStatusChange = () => {
    if (!pendingStatusChange) return;

    const { submissionId, newStatus } = pendingStatusChange;
    const submission = submissions.find(s => s.id === submissionId);
    const oldStatus = submission?.status || 'pending';

    // Update submission status
    setSubmissions(prevSubmissions =>
      prevSubmissions.map(s =>
        s.id === submissionId ? { ...s, status: newStatus, statusChangedDate: new Date().toISOString() } : s
      )
    );

    // Update selectedSubmission if it's the one being changed
    if (selectedSubmission && selectedSubmission.id === submissionId) {
      setSelectedSubmission({ ...selectedSubmission, status: newStatus, statusChangedDate: new Date().toISOString() });
    }

    // Add Activity Log with comment
    if (submission && oldStatus !== newStatus) {
      const statusLabels: Record<string, string> = {
        'approved': 'Approved',
        'in-production': 'In Production',
        'rejected': 'Rejected',
        'scrapped': 'Scrapped',
        'under-review': 'Under Review',
        'revision-requested': 'Revision Requested',
        'on-hold': 'On Hold',
        'pending': 'Pending',
      };

      const description = statusChangeComment.trim()
        ? `Project status updated from "${statusLabels[oldStatus] || oldStatus}" to "${statusLabels[newStatus] || newStatus}".\n\n💬 Admin Comment: ${statusChangeComment}`
        : `Project status updated from "${statusLabels[oldStatus] || oldStatus}" to "${statusLabels[newStatus] || newStatus}"`;

      addActivityLog(
        submissionId,
        `Status Changed: ${statusLabels[oldStatus] || oldStatus} → ${statusLabels[newStatus] || newStatus}`,
        description,
        'status'
      );

      // Create notification for creator with comment
      createCreatorNotification(submission, oldStatus, newStatus, statusChangeComment.trim());
    }

    // Auto-export agreement when moving to production
    if (newStatus === 'in-production' && submission) {
      setTimeout(() => {
        exportToExcel(submission);
        alert(`🎬 Project "${submission.projectName}" moved to Production!\n\nAgreement Excel has been automatically downloaded with all project details.\n\n📧 Creator has been notified via email at ${submission.officialEmail || 'their registered email'}.`);
      }, 300);
    }

    // Auto-add talents to library when approved or in-production
    if ((newStatus === 'approved' || newStatus === 'in-production') && submission) {
      const talents = extractTalentsFromProject(submission);
      if (talents.length > 0) {
        addTalentsToLibrary(talents);
        console.log(`Added ${talents.length} talents to library from project: ${submission.projectName}`);
      }
    }

    // Reset modal state
    setShowStatusChangeModal(false);
    setStatusChangeComment('');
    setPendingStatusChange(null);
    console.log(`Changed submission ${submissionId} to status: ${newStatus}`);
  };

  // Create notification for creator when status changes
  const createCreatorNotification = (submission: any, oldStatus: string, newStatus: string, adminComment?: string) => {
    const statusMessages: Record<string, string> = {
      'approved': `🎉 Congratulations! Your project "${submission.projectName}" has been APPROVED by STAGE!`,
      'in-production': `🎬 Exciting news! Your project "${submission.projectName}" is now IN PRODUCTION!`,
      'rejected': `Your project "${submission.projectName}" was not selected at this time.`,
      'scrapped': `Your project "${submission.projectName}" has been scrapped.`,
      'under-review': `Your project "${submission.projectName}" is now under review by our team.`,
      'revision-requested': `📝 Revisions requested for "${submission.projectName}". Please update and resubmit.`,
      'on-hold': `Your project "${submission.projectName}" has been put on hold.`,
      'pending': `Your project "${submission.projectName}" status has been reset to pending.`,
    };

    const baseMessage = statusMessages[newStatus] || `Status updated for "${submission.projectName}": ${newStatus}`;
    const fullMessage = adminComment
      ? `${baseMessage}\n\n💬 Admin Comment: "${adminComment}"`
      : baseMessage;

    const notification = {
      id: `notif_${Date.now()}_${submission.id}`,
      projectId: submission.id,
      projectName: submission.projectName || 'Untitled Project',
      oldStatus: oldStatus,
      newStatus: newStatus,
      message: fullMessage,
      adminComment: adminComment || '',
      timestamp: new Date().toISOString(),
      read: false,
      creatorEmail: submission.officialEmail || '',
    };

    // Save notification to localStorage
    const existingNotifications = JSON.parse(localStorage.getItem('stage_notifications') || '[]');
    const updatedNotifications = [notification, ...existingNotifications];
    localStorage.setItem('stage_notifications', JSON.stringify(updatedNotifications));

    // Update localStorage submissions with new status and admin comment
    const localSubmissions = JSON.parse(localStorage.getItem('stage_submissions') || '[]');
    const updatedSubmissions = localSubmissions.map((s: any) =>
      s.id === submission.id ? { ...s, status: newStatus, lastAdminComment: adminComment || '' } : s
    );
    localStorage.setItem('stage_submissions', JSON.stringify(updatedSubmissions));

    // Show confirmation with email info
    const emailMessage = submission.officialEmail
      ? `\n\n📧 Notification sent to: ${submission.officialEmail}`
      : '\n\n⚠️ No email on file - Creator will see notification on their dashboard.';

    // Don't show alert for every status change, just for important ones
    if (['approved', 'in-production', 'rejected'].includes(newStatus)) {
      setTimeout(() => {
        alert(`✅ Status Updated: ${newStatus.toUpperCase()}\n\nProject: ${submission.projectName}${emailMessage}`);
      }, 100);
    }

    console.log('Notification created:', notification);
  };

  const handleDeleteProject = (submissionId: number) => {
    // Remove submission from list
    setSubmissions(prevSubmissions =>
      prevSubmissions.filter(s => s.id !== submissionId)
    );

    setShowDeleteConfirm(null);
    console.log(`Deleted submission ${submissionId}`);
  };

  // Handle granting edit access
  const handleGrantEditAccess = (request: any) => {
    // Update request status
    const updatedRequests = editAccessRequests.map(r =>
      r.id === request.id
        ? { ...r, status: 'approved', respondedAt: new Date().toISOString() }
        : r
    );
    setEditAccessRequests(updatedRequests);
    localStorage.setItem('stage_edit_requests', JSON.stringify(updatedRequests));

    // Add project to granted access list
    const grantedAccess = JSON.parse(localStorage.getItem('stage_edit_access_granted') || '[]');
    if (!grantedAccess.includes(request.projectId)) {
      grantedAccess.push(request.projectId);
      localStorage.setItem('stage_edit_access_granted', JSON.stringify(grantedAccess));
    }

    // Create notification for creator
    const notification = {
      id: `notif_${Date.now()}_grant_${request.projectId}`,
      projectId: request.projectId,
      projectName: request.projectName,
      oldStatus: 'locked',
      newStatus: 'edit_granted',
      message: `✅ Edit access GRANTED for "${request.projectName}"! You can now make changes to your project.`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    const existingNotifications = JSON.parse(localStorage.getItem('stage_notifications') || '[]');
    localStorage.setItem('stage_notifications', JSON.stringify([notification, ...existingNotifications]));

    // Add Activity Log
    addActivityLog(
      request.projectId,
      'Edit Access Granted',
      `Edit access granted to ${request.creatorEmail} for project "${request.projectName}"`,
      'access'
    );

    alert(`✅ Edit Access Granted!\n\nProject: ${request.projectName}\nCreator: ${request.creatorEmail}\n\nThe creator can now edit this project.`);
  };

  // Handle denying edit access
  const handleDenyEditAccess = (request: any, reason: string) => {
    // Update request status
    const updatedRequests = editAccessRequests.map(r =>
      r.id === request.id
        ? { ...r, status: 'denied', respondedAt: new Date().toISOString(), adminMessage: reason || 'Request denied by admin.' }
        : r
    );
    setEditAccessRequests(updatedRequests);
    localStorage.setItem('stage_edit_requests', JSON.stringify(updatedRequests));

    // Create notification for creator
    const notification = {
      id: `notif_${Date.now()}_deny_${request.projectId}`,
      projectId: request.projectId,
      projectName: request.projectName,
      oldStatus: 'locked',
      newStatus: 'edit_denied',
      message: `❌ Edit access DENIED for "${request.projectName}". ${reason || 'Contact admin for more details.'}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    const existingNotifications = JSON.parse(localStorage.getItem('stage_notifications') || '[]');
    localStorage.setItem('stage_notifications', JSON.stringify([notification, ...existingNotifications]));

    // Add Activity Log
    addActivityLog(
      request.projectId,
      'Edit Access Denied',
      `Edit access denied for ${request.creatorEmail}. Reason: ${reason || 'Not specified'}`,
      'access'
    );

    setDenyReason('');
    alert(`Edit Access Denied\n\nProject: ${request.projectName}\nReason: ${reason || 'Not specified'}\n\nThe creator has been notified.`);
  };

  // Revoke edit access
  const handleRevokeEditAccess = (projectId: string) => {
    const grantedAccess = JSON.parse(localStorage.getItem('stage_edit_access_granted') || '[]');
    const updatedAccess = grantedAccess.filter((id: string) => id !== projectId);
    localStorage.setItem('stage_edit_access_granted', JSON.stringify(updatedAccess));

    // Update request status back to denied/revoked
    const updatedRequests = editAccessRequests.map(r =>
      r.projectId === projectId && r.status === 'approved'
        ? { ...r, status: 'revoked', respondedAt: new Date().toISOString(), adminMessage: 'Edit access revoked by admin.' }
        : r
    );
    setEditAccessRequests(updatedRequests);
    localStorage.setItem('stage_edit_requests', JSON.stringify(updatedRequests));

    // Create notification for creator
    const request = editAccessRequests.find(r => r.projectId === projectId);
    if (request) {
      const notification = {
        id: `notif_${Date.now()}_revoke_${projectId}`,
        projectId: projectId,
        projectName: request.projectName,
        oldStatus: 'edit_granted',
        newStatus: 'edit_revoked',
        message: `🔒 Edit access REVOKED for "${request.projectName}". The project is now locked again.`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      const existingNotifications = JSON.parse(localStorage.getItem('stage_notifications') || '[]');
      localStorage.setItem('stage_notifications', JSON.stringify([notification, ...existingNotifications]));

      // Add Activity Log
      addActivityLog(
        projectId,
        'Edit Access Revoked',
        `Edit access revoked for project "${request.projectName}". Project is now locked.`,
        'access'
      );
    }

    alert('Edit access has been revoked. The project is now locked again.');
  };

  // Get pending edit requests count
  const pendingEditRequestsCount = editAccessRequests.filter(r => r.status === 'pending').length;

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

        <h2>4.1 Detailed Budget Breakdown (Department-wise)</h2>
        ${submission.budgetCategories && submission.budgetCategories.length > 0 ? `
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 11px;">
            <thead>
              <tr style="background: #1a1a2e; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Department</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Item Description</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Days</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Qty/People</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: right;">Per Day (₹)</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: right;">Lumpsum (₹)</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: right;">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${submission.budgetCategories.map((category: any) => {
                const filledItems = category.items?.filter((item: any) => item.total > 0 || item.description) || [];
                if (filledItems.length === 0) return '';

                return `
                  <tr style="background: #f8f9fa;">
                    <td colspan="6" style="border: 1px solid #ddd; padding: 10px; font-weight: bold; background: #e9ecef;">
                      ${category.icon || '📁'} ${category.name}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold; background: #e9ecef; text-align: right;">
                      ₹${(category.amount || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                  ${filledItems.map((item: any) => `
                    <tr>
                      <td style="border: 1px solid #ddd; padding: 6px;"></td>
                      <td style="border: 1px solid #ddd; padding: 6px;">${item.description || 'N/A'}</td>
                      <td style="border: 1px solid #ddd; padding: 6px; text-align: center;">${item.noOfDays || item.days || '-'}</td>
                      <td style="border: 1px solid #ddd; padding: 6px; text-align: center;">${item.noOfPeople || item.people || item.noOfRooms || '-'}</td>
                      <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${item.perDay ? '₹' + item.perDay.toLocaleString('en-IN') : '-'}</td>
                      <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${(item.lumpsumFixed || item.lumpsum) ? '₹' + (item.lumpsumFixed || item.lumpsum).toLocaleString('en-IN') : '-'}</td>
                      <td style="border: 1px solid #ddd; padding: 6px; text-align: right; font-weight: bold;">₹${(item.total || 0).toLocaleString('en-IN')}</td>
                    </tr>
                  `).join('')}
                `;
              }).join('')}
            </tbody>
            <tfoot>
              <tr style="background: #16a34a; color: white; font-weight: bold;">
                <td colspan="6" style="border: 1px solid #333; padding: 12px; text-align: right; font-size: 14px;">GRAND TOTAL:</td>
                <td style="border: 1px solid #333; padding: 12px; text-align: right; font-size: 14px;">
                  ₹${(submission.budgetCategories.reduce((sum: number, cat: any) => sum + (cat.amount || 0), 0)).toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; border: 1px solid #ddd;">
            <h4 style="margin: 0 0 10px 0; color: #333;">Budget Summary by Department:</h4>
            <table style="width: 100%; border-collapse: collapse;">
              ${submission.budgetCategories.filter((cat: any) => cat.amount > 0).map((cat: any) => `
                <tr>
                  <td style="padding: 5px 10px; border-bottom: 1px solid #eee;">${cat.icon || '📁'} ${cat.name}</td>
                  <td style="padding: 5px 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">₹${(cat.amount || 0).toLocaleString('en-IN')}</td>
                  <td style="padding: 5px 10px; border-bottom: 1px solid #eee; text-align: right; color: #666;">${(cat.yourPercentage || 0).toFixed(1)}%</td>
                </tr>
              `).join('')}
            </table>
          </div>
        ` : `
          <p style="color: #888; font-style: italic;">No detailed budget breakdown available</p>
        `}

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

  // Export individual tab to Excel
  const exportTabToExcel = (submission: any, tabName: string) => {
    const wb = XLSX.utils.book_new();
    const projectName = submission.projectName || 'Project';
    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    let sheetData: any[][] = [];

    switch (tabName) {
      case 'project':
        sheetData = [
          [`PROJECT DETAILS - ${projectName}`],
          [`Generated: ${date}`],
          [''],
          ['PROJECT INFORMATION'],
          ['Project Name', submission.projectName || 'N/A'],
          ['Production Company', submission.productionCompany || 'N/A'],
          ['Culture', submission.culture || 'N/A'],
          ['Format', submission.format || 'N/A'],
          ['Genre', submission.genre || 'N/A'],
          ['Sub-Genre', submission.subGenre || 'N/A'],
          ['Content Rating', submission.contentRating || 'N/A'],
          ['Production Type', submission.productionType || 'N/A'],
          ['Language', submission.language || 'N/A'],
          [''],
          ['CONTENT DETAILS'],
          ['Episodes', submission.episodes || submission.episodesPerSeason || 'N/A'],
          ['Total Duration (mins)', submission.totalDuration || 'N/A'],
          ['Episode Duration (mins)', submission.episodeDuration || 'N/A'],
          ['Logline', submission.logline || 'N/A'],
          ['Synopsis', submission.synopsis || 'N/A'],
          [''],
          ['POINT OF CONTACT'],
          ['Production POC', submission.productionPOC || 'N/A'],
          ['Content POC', submission.contentPOC || 'N/A'],
          [''],
          ['SUBMISSION DETAILS'],
          ['Status', submission.status || 'N/A'],
          ['Submitted At', submission.submitted_at || 'N/A'],
        ];
        break;

      case 'creator':
        sheetData = [
          [`CREATOR DETAILS - ${projectName}`],
          [`Generated: ${date}`],
          [''],
          ['PERSONAL INFORMATION'],
          ['Creator Name', submission.creatorName || submission.creator || 'N/A'],
          ['Father\'s Name', submission.fatherName || 'N/A'],
          ['Date of Birth', submission.dateOfBirth || 'N/A'],
          ['Phone', submission.phone || 'N/A'],
          ['Email', submission.officialEmail || 'N/A'],
          [''],
          ['ADDRESS DETAILS'],
          ['Permanent Address', submission.permanentAddress || 'N/A'],
          ['Current Address', submission.currentAddress || 'N/A'],
          [''],
          ['COMPANY DETAILS'],
          ['Production Company', submission.productionCompany || 'N/A'],
          ['Authorized Signatory', submission.authorizedSignatory || 'N/A'],
          ['PAN Number', submission.panNumber || 'N/A'],
          ['GST Number', submission.gstNumber || 'N/A'],
          [''],
          ['BANK DETAILS'],
          ['Bank Name', submission.bankName || 'N/A'],
          ['Account Number', submission.accountNumber || 'N/A'],
          ['IFSC Code', submission.ifscCode || 'N/A'],
          ['Account Holder Name', submission.accountHolderName || 'N/A'],
        ];
        break;

      case 'budget':
        sheetData = [
          [`BUDGET DETAILS - ${projectName}`],
          [`Generated: ${date}`],
          [''],
          ['BUDGET SUMMARY'],
          ['Total Budget', `₹${(submission.totalBudget || parseFloat(submission.estimatedBudget) || 0).toLocaleString('en-IN')}`],
          ['Production Cost', `₹${(submission.productionCost || 0).toLocaleString('en-IN')}`],
          ['Creator Margin', `₹${(submission.creatorMargin || 0).toLocaleString('en-IN')}`],
          ['Insurance', `₹${(submission.insurance || 0).toLocaleString('en-IN')}`],
          ['Celebrity Fees', `₹${(submission.celebrityFees || 0).toLocaleString('en-IN')}`],
          [''],
          ['BUDGET BREAKDOWN'],
          ['Category', 'Amount (₹)', 'Percentage'],
        ];
        if (submission.budgetBreakdown && submission.budgetBreakdown.length > 0) {
          submission.budgetBreakdown.forEach((item: any) => {
            sheetData.push([item.category || '', `₹${(item.amount || 0).toLocaleString('en-IN')}`, item.percentage ? `${item.percentage}%` : '']);
          });
        }
        break;

      case 'timeline':
        sheetData = [
          [`TIMELINE DETAILS - ${projectName}`],
          [`Generated: ${date}`],
          [''],
          ['DEVELOPMENT PHASE'],
          ['Start Date', submission.contentTimeline?.developmentStart || 'N/A'],
          ['End Date', submission.contentTimeline?.developmentEnd || 'N/A'],
          ['Duration', submission.contentTimeline?.developmentDuration || 'N/A'],
          ['Comments', submission.contentTimeline?.developmentComments || 'N/A'],
          [''],
          ['PRE-PRODUCTION PHASE'],
          ['Start Date', submission.contentTimeline?.preProductionStart || 'N/A'],
          ['End Date', submission.contentTimeline?.preProductionEnd || 'N/A'],
          ['Duration', submission.contentTimeline?.preProductionDuration || 'N/A'],
          ['Comments', submission.contentTimeline?.preProductionComments || 'N/A'],
          [''],
          ['PRODUCTION / SHOOT PHASE'],
          ['Start Date', submission.shootStartDate || submission.contentTimeline?.shootStart || 'N/A'],
          ['End Date', submission.shootEndDate || submission.contentTimeline?.shootEnd || 'N/A'],
          ['Shoot Days', submission.shootDays || submission.contentTimeline?.shootDays || 'N/A'],
          ['Comments', submission.contentTimeline?.shootComments || 'N/A'],
          [''],
          ['POST-PRODUCTION PHASE'],
          ['Start Date', submission.contentTimeline?.postProductionStart || 'N/A'],
          ['End Date', submission.contentTimeline?.postProductionEnd || 'N/A'],
          ['Duration', submission.contentTimeline?.postProductionDuration || 'N/A'],
          ['Comments', submission.contentTimeline?.postProductionComments || 'N/A'],
          [''],
          ['FINAL DELIVERY'],
          ['Delivery Date', submission.contentTimeline?.finalDeliveryDate || 'N/A'],
          ['Comments', submission.contentTimeline?.deliveryComments || 'N/A'],
        ];
        break;

      case 'crew':
        sheetData = [
          [`CREW DETAILS - ${projectName}`],
          [`Generated: ${date}`],
          [''],
          ['Department', 'Role', 'Name'],
          ['Direction', 'Director', submission.director || 'N/A'],
          ['Direction', 'Associate Director', submission.associateDirector || 'N/A'],
          ['Direction', 'Assistant Director 1', submission.assistantDirector1 || 'N/A'],
          ['Direction', 'Assistant Director 2', submission.assistantDirector2 || 'N/A'],
          [''],
          ['Production', 'Head of Production', submission.headOfProduction || 'N/A'],
          ['Production', 'Executive Producer', submission.executiveProducer || 'N/A'],
          ['Production', 'Line Producer', submission.lineProducer || 'N/A'],
          ['Production', 'Production Manager', submission.productionManager || 'N/A'],
          [''],
          ['Writing', 'Story By', submission.storyBy || 'N/A'],
          ['Writing', 'Screenplay By', submission.screenplayBy || 'N/A'],
          ['Writing', 'Dialogues By', submission.dialoguesBy || 'N/A'],
          [''],
          ['Camera', 'DOP', submission.dop || 'N/A'],
          ['Camera', 'Camera Operator', submission.cameraOperator || 'N/A'],
          ['Camera', 'Focus Puller', submission.focusPuller || 'N/A'],
          [''],
          ['Art & Design', 'Production Designer', submission.productionDesigner || 'N/A'],
          ['Art & Design', 'Art Director', submission.artDirector || 'N/A'],
          ['Art & Design', 'Costume Designer', submission.costumeDesigner || 'N/A'],
          ['Art & Design', 'Makeup Artist', submission.makeupArtist || 'N/A'],
          [''],
          ['Sound', 'Sound Designer', submission.soundDesigner || 'N/A'],
          ['Sound', 'Sound Recordist', submission.soundRecordist || 'N/A'],
          ['Sound', 'Music Composer', submission.musicComposer || 'N/A'],
          [''],
          ['Post-Production', 'Editor', submission.editor || 'N/A'],
          ['Post-Production', 'Colorist', submission.colorist || 'N/A'],
          ['Post-Production', 'VFX Supervisor', submission.vfxSupervisor || 'N/A'],
          ['Post-Production', 'DI Colorist', submission.diColorist || 'N/A'],
        ];
        break;

      case 'cast':
        sheetData = [
          [`CAST DETAILS - ${projectName}`],
          [`Generated: ${date}`],
          [''],
          ['#', 'Character Name', 'Actor Name', 'Role Type', 'Profile Link'],
        ];
        if (submission.castMembers && submission.castMembers.length > 0) {
          submission.castMembers.forEach((cast: any, idx: number) => {
            sheetData.push([
              idx + 1,
              cast.characterName || 'N/A',
              cast.actorName || 'N/A',
              cast.roleType || 'N/A',
              cast.profileLink || 'N/A',
            ]);
          });
        } else {
          sheetData.push(['No cast members added']);
        }
        break;

      case 'technical':
        sheetData = [
          [`TECHNICAL SPECIFICATIONS - ${projectName}`],
          [`Generated: ${date}`],
          [''],
          ['CAMERA'],
          ['Camera Model', submission.technicalSpecs?.cameraModel || 'N/A'],
          ['Camera Setup Type', submission.technicalSpecs?.cameraSetupType || 'N/A'],
          ['Resolution', submission.technicalSpecs?.resolution || 'N/A'],
          ['Frame Rate', submission.technicalSpecs?.frameRate || 'N/A'],
          ['Aspect Ratio', submission.technicalSpecs?.aspectRatio || 'N/A'],
          [''],
          ['LENSES'],
          ['Lens Types', (submission.technicalSpecs?.lensTypes || []).join(', ') || 'N/A'],
          [''],
          ['LIGHTING'],
          ['Lighting Equipment', (submission.technicalSpecs?.lightingEquipment || []).join(', ') || 'N/A'],
          [''],
          ['SOUND'],
          ['Sound Equipment', (submission.technicalSpecs?.soundEquipment || []).join(', ') || 'N/A'],
          [''],
          ['SPECIAL EQUIPMENT'],
          ['Stabilizers', (submission.technicalSpecs?.stabilizers || []).join(', ') || 'N/A'],
          ['Drones', (submission.technicalSpecs?.droneModels || []).join(', ') || 'N/A'],
          ['Special Rigs', (submission.technicalSpecs?.specialRigs || []).join(', ') || 'N/A'],
          [''],
          ['POST-PRODUCTION'],
          ['Editing Software', submission.technicalSpecs?.editingSoftware || 'N/A'],
          ['Color Grading', submission.technicalSpecs?.colorGrading || 'N/A'],
          ['VFX Software', submission.technicalSpecs?.vfxSoftware || 'N/A'],
          ['Final Delivery Format', submission.technicalSpecs?.deliveryFormat || 'N/A'],
        ];
        break;

      case 'cashflow':
        sheetData = [
          [`CASH FLOW - PAYMENT TERMS - ${projectName}`],
          [`Generated: ${date}`],
          [''],
          ['Total Budget', `₹${(submission.totalBudget || parseFloat(submission.estimatedBudget) || 0).toLocaleString('en-IN')}`],
          [''],
          ['#', 'Milestone', 'Description', 'Percentage', 'Base Amount', 'GST (18%)', 'Total with GST', 'Expected Date', 'Status'],
        ];
        if (submission.cashFlowTranches && submission.cashFlowTranches.length > 0) {
          submission.cashFlowTranches.forEach((tranche: any, idx: number) => {
            const gst = Math.round((tranche.amount || 0) * 0.18);
            const total = (tranche.amount || 0) + gst;
            sheetData.push([
              idx + 1,
              tranche.name || tranche.milestone || `Tranche ${idx + 1}`,
              tranche.description || '',
              `${tranche.percentage || 0}%`,
              `₹${(tranche.amount || 0).toLocaleString('en-IN')}`,
              `₹${gst.toLocaleString('en-IN')}`,
              `₹${total.toLocaleString('en-IN')}`,
              tranche.expectedDate || 'N/A',
              tranche.status || 'Pending',
            ]);
          });
          const totalBase = submission.cashFlowTranches.reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
          const totalGST = Math.round(totalBase * 0.18);
          sheetData.push(['']);
          sheetData.push(['', 'TOTAL', '', '100%', `₹${totalBase.toLocaleString('en-IN')}`, `₹${totalGST.toLocaleString('en-IN')}`, `₹${(totalBase + totalGST).toLocaleString('en-IN')}`, '', '']);
        }
        break;

      default:
        sheetData = [['No data available for this tab']];
    }

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    ws['!cols'] = Array(10).fill({ wch: 25 });
    XLSX.utils.book_append_sheet(wb, ws, tabName.charAt(0).toUpperCase() + tabName.slice(1));

    const fileName = `${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_${tabName}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Export individual tab to PDF
  const exportTabToPDF = (submission: any, tabName: string) => {
    const projectName = submission.projectName || 'Project';
    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    let content = '';

    const getTabContent = () => {
      switch (tabName) {
        case 'project':
          return `
            <h2>Project Information</h2>
            <div class="row"><span class="label">Project Name:</span><span class="value">${submission.projectName || 'N/A'}</span></div>
            <div class="row"><span class="label">Production Company:</span><span class="value">${submission.productionCompany || 'N/A'}</span></div>
            <div class="row"><span class="label">Culture:</span><span class="value">${submission.culture || 'N/A'}</span></div>
            <div class="row"><span class="label">Format:</span><span class="value">${submission.format || 'N/A'}</span></div>
            <div class="row"><span class="label">Genre:</span><span class="value">${submission.genre || 'N/A'}</span></div>
            <div class="row"><span class="label">Sub-Genre:</span><span class="value">${submission.subGenre || 'N/A'}</span></div>
            <div class="row"><span class="label">Content Rating:</span><span class="value">${submission.contentRating || 'N/A'}</span></div>
            <div class="row"><span class="label">Production Type:</span><span class="value">${submission.productionType || 'N/A'}</span></div>
            <div class="row"><span class="label">Language:</span><span class="value">${submission.language || 'N/A'}</span></div>
            <h2>Content Details</h2>
            <div class="row"><span class="label">Episodes:</span><span class="value">${submission.episodes || submission.episodesPerSeason || 'N/A'}</span></div>
            <div class="row"><span class="label">Total Duration:</span><span class="value">${submission.totalDuration || 'N/A'} mins</span></div>
            <div class="row"><span class="label">Episode Duration:</span><span class="value">${submission.episodeDuration || 'N/A'} mins</span></div>
            <h2>Logline</h2>
            <div class="row"><span class="value" style="text-align:left">${submission.logline || 'N/A'}</span></div>
            <h2>Synopsis</h2>
            <div class="row"><span class="value" style="text-align:left">${submission.synopsis || 'N/A'}</span></div>
            <h2>Point of Contact</h2>
            <div class="row"><span class="label">Production POC:</span><span class="value">${submission.productionPOC || 'N/A'}</span></div>
            <div class="row"><span class="label">Content POC:</span><span class="value">${submission.contentPOC || 'N/A'}</span></div>
          `;
        case 'creator':
          return `
            <h2>Personal Information</h2>
            <div class="row"><span class="label">Creator Name:</span><span class="value">${submission.creatorName || submission.creator || 'N/A'}</span></div>
            <div class="row"><span class="label">Father's Name:</span><span class="value">${submission.fatherName || 'N/A'}</span></div>
            <div class="row"><span class="label">Date of Birth:</span><span class="value">${submission.dateOfBirth || 'N/A'}</span></div>
            <div class="row"><span class="label">Phone:</span><span class="value">${submission.phone || 'N/A'}</span></div>
            <div class="row"><span class="label">Email:</span><span class="value">${submission.officialEmail || 'N/A'}</span></div>
            <h2>Address Details</h2>
            <div class="row"><span class="label">Permanent Address:</span><span class="value">${submission.permanentAddress || 'N/A'}</span></div>
            <div class="row"><span class="label">Current Address:</span><span class="value">${submission.currentAddress || 'N/A'}</span></div>
            <h2>Company Details</h2>
            <div class="row"><span class="label">Production Company:</span><span class="value">${submission.productionCompany || 'N/A'}</span></div>
            <div class="row"><span class="label">Authorized Signatory:</span><span class="value">${submission.authorizedSignatory || 'N/A'}</span></div>
            <div class="row"><span class="label">PAN Number:</span><span class="value">${submission.panNumber || 'N/A'}</span></div>
            <div class="row"><span class="label">GST Number:</span><span class="value">${submission.gstNumber || 'N/A'}</span></div>
            <h2>Bank Details</h2>
            <div class="row"><span class="label">Bank Name:</span><span class="value">${submission.bankName || 'N/A'}</span></div>
            <div class="row"><span class="label">Account Number:</span><span class="value">${submission.accountNumber || 'N/A'}</span></div>
            <div class="row"><span class="label">IFSC Code:</span><span class="value">${submission.ifscCode || 'N/A'}</span></div>
          `;
        case 'budget':
          let budgetRows = '';
          if (submission.budgetBreakdown && submission.budgetBreakdown.length > 0) {
            budgetRows = submission.budgetBreakdown.map((item: any) =>
              `<tr><td>${item.category || ''}</td><td>₹${(item.amount || 0).toLocaleString('en-IN')}</td><td>${item.percentage || ''}%</td></tr>`
            ).join('');
          }
          return `
            <h2>Budget Summary</h2>
            <div class="row highlight-box"><span class="label">Total Budget:</span><span class="value highlight">₹${(submission.totalBudget || parseFloat(submission.estimatedBudget) || 0).toLocaleString('en-IN')}</span></div>
            <div class="row"><span class="label">Production Cost:</span><span class="value">₹${(submission.productionCost || 0).toLocaleString('en-IN')}</span></div>
            <div class="row"><span class="label">Creator Margin:</span><span class="value">₹${(submission.creatorMargin || 0).toLocaleString('en-IN')}</span></div>
            <div class="row"><span class="label">Insurance:</span><span class="value">₹${(submission.insurance || 0).toLocaleString('en-IN')}</span></div>
            <div class="row"><span class="label">Celebrity Fees:</span><span class="value">₹${(submission.celebrityFees || 0).toLocaleString('en-IN')}</span></div>
            <h2>Budget Breakdown</h2>
            <table><thead><tr><th>Category</th><th>Amount</th><th>%</th></tr></thead><tbody>${budgetRows}</tbody></table>
          `;
        case 'timeline':
          return `
            <h2>Development Phase</h2>
            <div class="row"><span class="label">Start Date:</span><span class="value">${submission.contentTimeline?.developmentStart || 'N/A'}</span></div>
            <div class="row"><span class="label">End Date:</span><span class="value">${submission.contentTimeline?.developmentEnd || 'N/A'}</span></div>
            <div class="row"><span class="label">Duration:</span><span class="value">${submission.contentTimeline?.developmentDuration || 'N/A'}</span></div>
            <h2>Pre-Production Phase</h2>
            <div class="row"><span class="label">Start Date:</span><span class="value">${submission.contentTimeline?.preProductionStart || 'N/A'}</span></div>
            <div class="row"><span class="label">End Date:</span><span class="value">${submission.contentTimeline?.preProductionEnd || 'N/A'}</span></div>
            <div class="row"><span class="label">Duration:</span><span class="value">${submission.contentTimeline?.preProductionDuration || 'N/A'}</span></div>
            <h2>Production / Shoot Phase</h2>
            <div class="row"><span class="label">Start Date:</span><span class="value">${submission.shootStartDate || submission.contentTimeline?.shootStart || 'N/A'}</span></div>
            <div class="row"><span class="label">End Date:</span><span class="value">${submission.shootEndDate || submission.contentTimeline?.shootEnd || 'N/A'}</span></div>
            <div class="row"><span class="label">Shoot Days:</span><span class="value">${submission.shootDays || submission.contentTimeline?.shootDays || 'N/A'}</span></div>
            <h2>Post-Production Phase</h2>
            <div class="row"><span class="label">Start Date:</span><span class="value">${submission.contentTimeline?.postProductionStart || 'N/A'}</span></div>
            <div class="row"><span class="label">End Date:</span><span class="value">${submission.contentTimeline?.postProductionEnd || 'N/A'}</span></div>
            <div class="row"><span class="label">Duration:</span><span class="value">${submission.contentTimeline?.postProductionDuration || 'N/A'}</span></div>
            <h2>Final Delivery</h2>
            <div class="row"><span class="label">Delivery Date:</span><span class="value">${submission.contentTimeline?.finalDeliveryDate || 'N/A'}</span></div>
          `;
        case 'crew':
          return `
            <h2>Direction Department</h2>
            <div class="row"><span class="label">Director:</span><span class="value">${submission.director || 'N/A'}</span></div>
            <div class="row"><span class="label">Associate Director:</span><span class="value">${submission.associateDirector || 'N/A'}</span></div>
            <div class="row"><span class="label">Assistant Director:</span><span class="value">${submission.assistantDirector1 || 'N/A'}</span></div>
            <h2>Production Department</h2>
            <div class="row"><span class="label">Head of Production:</span><span class="value">${submission.headOfProduction || 'N/A'}</span></div>
            <div class="row"><span class="label">Executive Producer:</span><span class="value">${submission.executiveProducer || 'N/A'}</span></div>
            <div class="row"><span class="label">Line Producer:</span><span class="value">${submission.lineProducer || 'N/A'}</span></div>
            <h2>Writing Department</h2>
            <div class="row"><span class="label">Story By:</span><span class="value">${submission.storyBy || 'N/A'}</span></div>
            <div class="row"><span class="label">Screenplay By:</span><span class="value">${submission.screenplayBy || 'N/A'}</span></div>
            <div class="row"><span class="label">Dialogues By:</span><span class="value">${submission.dialoguesBy || 'N/A'}</span></div>
            <h2>Camera Department</h2>
            <div class="row"><span class="label">DOP:</span><span class="value">${submission.dop || 'N/A'}</span></div>
            <div class="row"><span class="label">Camera Operator:</span><span class="value">${submission.cameraOperator || 'N/A'}</span></div>
            <h2>Art & Design</h2>
            <div class="row"><span class="label">Production Designer:</span><span class="value">${submission.productionDesigner || 'N/A'}</span></div>
            <div class="row"><span class="label">Costume Designer:</span><span class="value">${submission.costumeDesigner || 'N/A'}</span></div>
            <h2>Sound & Music</h2>
            <div class="row"><span class="label">Sound Designer:</span><span class="value">${submission.soundDesigner || 'N/A'}</span></div>
            <div class="row"><span class="label">Music Composer:</span><span class="value">${submission.musicComposer || 'N/A'}</span></div>
            <h2>Post-Production</h2>
            <div class="row"><span class="label">Editor:</span><span class="value">${submission.editor || 'N/A'}</span></div>
            <div class="row"><span class="label">Colorist:</span><span class="value">${submission.colorist || 'N/A'}</span></div>
            <div class="row"><span class="label">VFX Supervisor:</span><span class="value">${submission.vfxSupervisor || 'N/A'}</span></div>
          `;
        case 'cast':
          let castRows = '';
          if (submission.castMembers && submission.castMembers.length > 0) {
            castRows = submission.castMembers.map((cast: any, idx: number) =>
              `<tr><td>${idx + 1}</td><td>${cast.characterName || 'N/A'}</td><td>${cast.actorName || 'N/A'}</td><td>${cast.roleType || 'N/A'}</td></tr>`
            ).join('');
          } else {
            castRows = '<tr><td colspan="4">No cast members added</td></tr>';
          }
          return `
            <h2>Cast Members</h2>
            <table><thead><tr><th>#</th><th>Character</th><th>Actor</th><th>Role Type</th></tr></thead><tbody>${castRows}</tbody></table>
          `;
        case 'technical':
          return `
            <h2>Camera Specifications</h2>
            <div class="row"><span class="label">Camera Model:</span><span class="value">${submission.technicalSpecs?.cameraModel || 'N/A'}</span></div>
            <div class="row"><span class="label">Setup Type:</span><span class="value">${submission.technicalSpecs?.cameraSetupType || 'N/A'}</span></div>
            <div class="row"><span class="label">Resolution:</span><span class="value">${submission.technicalSpecs?.resolution || 'N/A'}</span></div>
            <div class="row"><span class="label">Frame Rate:</span><span class="value">${submission.technicalSpecs?.frameRate || 'N/A'}</span></div>
            <div class="row"><span class="label">Aspect Ratio:</span><span class="value">${submission.technicalSpecs?.aspectRatio || 'N/A'}</span></div>
            <h2>Lenses</h2>
            <div class="row"><span class="label">Lens Types:</span><span class="value">${(submission.technicalSpecs?.lensTypes || []).join(', ') || 'N/A'}</span></div>
            <h2>Lighting</h2>
            <div class="row"><span class="label">Equipment:</span><span class="value">${(submission.technicalSpecs?.lightingEquipment || []).join(', ') || 'N/A'}</span></div>
            <h2>Sound</h2>
            <div class="row"><span class="label">Equipment:</span><span class="value">${(submission.technicalSpecs?.soundEquipment || []).join(', ') || 'N/A'}</span></div>
            <h2>Special Equipment</h2>
            <div class="row"><span class="label">Stabilizers:</span><span class="value">${(submission.technicalSpecs?.stabilizers || []).join(', ') || 'N/A'}</span></div>
            <div class="row"><span class="label">Drones:</span><span class="value">${(submission.technicalSpecs?.droneModels || []).join(', ') || 'N/A'}</span></div>
            <h2>Post-Production</h2>
            <div class="row"><span class="label">Editing Software:</span><span class="value">${submission.technicalSpecs?.editingSoftware || 'N/A'}</span></div>
            <div class="row"><span class="label">Color Grading:</span><span class="value">${submission.technicalSpecs?.colorGrading || 'N/A'}</span></div>
            <div class="row"><span class="label">Delivery Format:</span><span class="value">${submission.technicalSpecs?.deliveryFormat || 'N/A'}</span></div>
          `;
        case 'cashflow':
          let cashflowRows = '';
          if (submission.cashFlowTranches && submission.cashFlowTranches.length > 0) {
            cashflowRows = submission.cashFlowTranches.map((tranche: any, idx: number) => {
              const gst = Math.round((tranche.amount || 0) * 0.18);
              const total = (tranche.amount || 0) + gst;
              return `<tr>
                <td>${idx + 1}</td>
                <td>${tranche.name || tranche.milestone || `Tranche ${idx + 1}`}</td>
                <td>${tranche.percentage || 0}%</td>
                <td>₹${(tranche.amount || 0).toLocaleString('en-IN')}</td>
                <td>₹${gst.toLocaleString('en-IN')}</td>
                <td>₹${total.toLocaleString('en-IN')}</td>
              </tr>
              <tr class="description-row"><td colspan="6"><strong>Description:</strong> ${tranche.description || 'N/A'}</td></tr>`;
            }).join('');
          }
          return `
            <h2>Payment Schedule</h2>
            <div class="row highlight-box"><span class="label">Total Budget:</span><span class="value highlight">₹${(submission.totalBudget || parseFloat(submission.estimatedBudget) || 0).toLocaleString('en-IN')}</span></div>
            <table>
              <thead><tr><th>#</th><th>Milestone</th><th>%</th><th>Base</th><th>GST</th><th>Total</th></tr></thead>
              <tbody>${cashflowRows}</tbody>
            </table>
          `;
        default:
          return '<p>No data available</p>';
      }
    };

    const tabTitle = tabName.charAt(0).toUpperCase() + tabName.slice(1);
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${tabTitle} - ${projectName}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          h1 { text-align: center; border-bottom: 3px solid #e53e3e; padding-bottom: 10px; color: #333; }
          h2 { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 15px; margin-top: 25px; border-radius: 5px; font-size: 14px; }
          .subtitle { text-align: center; color: #666; margin-bottom: 30px; }
          .row { display: flex; justify-content: space-between; padding: 10px 15px; border-bottom: 1px solid #eee; }
          .row:hover { background: #f9f9f9; }
          .label { font-weight: bold; color: #555; }
          .value { text-align: right; color: #333; }
          .highlight { font-size: 20px; color: #16a34a; font-weight: bold; }
          .highlight-box { background: #f0fdf4; border: 2px solid #16a34a; border-radius: 8px; margin: 10px 0; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 12px; text-align: left; font-size: 12px; }
          td { border: 1px solid #ddd; padding: 10px; font-size: 12px; }
          tr:nth-child(even) { background: #f9f9f9; }
          .description-row { background: #fffbeb !important; }
          .description-row td { font-size: 11px; color: #666; border-top: none; }
          .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
          @media print {
            body { padding: 20px; }
            h2 { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <h1>STAGE OTT - ${tabTitle.toUpperCase()} DETAILS</h1>
        <p class="subtitle">Project: ${projectName} | Generated: ${date}</p>
        ${getTabContent()}
        <div class="footer">
          <p>Generated by STAGE OTT Creator Portal</p>
          <p>© ${new Date().getFullYear()} STAGE OTT Platform. All rights reserved.</p>
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

    const submission = submissions.find(s => s.id === editingPOC.submissionId);
    const oldValue = submission?.[editingPOC.field] || '';
    const pocLabel = editingPOC.field === 'productionPOC' ? 'Production POC' : 'Content POC';

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

    // Add Activity Log for POC assignment
    if (tempPOCValue && tempPOCValue !== oldValue) {
      addActivityLog(
        editingPOC.submissionId,
        oldValue ? `${pocLabel} Changed` : `${pocLabel} Assigned`,
        oldValue
          ? `${pocLabel} changed from "${oldValue}" to "${tempPOCValue}"`
          : `${tempPOCValue} assigned as ${pocLabel}`,
        'assign'
      );
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
      const cultureMatch = filterCulture === 'all' || s.culture?.toLowerCase() === filterCulture.toLowerCase();

      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const searchMatch = searchQuery === '' ||
        s.projectName?.toLowerCase().includes(searchLower) ||
        s.creator?.toLowerCase().includes(searchLower) ||
        s.creatorName?.toLowerCase().includes(searchLower) ||
        s.director?.toLowerCase().includes(searchLower) ||
        s.culture?.toLowerCase().includes(searchLower) ||
        s.format?.toLowerCase().includes(searchLower) ||
        s.genre?.toLowerCase().includes(searchLower) ||
        s.officialEmail?.toLowerCase().includes(searchLower);

      // Date range filter
      let dateMatch = true;
      if (dateRangeFrom) {
        const fromDate = new Date(dateRangeFrom);
        const submitDate = new Date(s.submittedDate || s.submitted_at);
        dateMatch = dateMatch && submitDate >= fromDate;
      }
      if (dateRangeTo) {
        const toDate = new Date(dateRangeTo);
        toDate.setHours(23, 59, 59); // Include the entire day
        const submitDate = new Date(s.submittedDate || s.submitted_at);
        dateMatch = dateMatch && submitDate <= toDate;
      }

      // Budget range filter
      let budgetMatch = true;
      const projectBudget = s.totalBudget || s.estimatedBudget || 0;
      if (budgetMin) {
        budgetMatch = budgetMatch && projectBudget >= parseInt(budgetMin);
      }
      if (budgetMax) {
        budgetMatch = budgetMatch && projectBudget <= parseInt(budgetMax);
      }

      return statusMatch && formatMatch && cultureMatch && searchMatch && dateMatch && budgetMatch;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime();
          break;
        case 'name':
          comparison = (a.projectName || '').localeCompare(b.projectName || '');
          break;
        case 'budget':
          comparison = (a.totalBudget || 0) - (b.totalBudget || 0);
          break;
        case 'status':
          comparison = (a.status || '').localeCompare(b.status || '');
          break;
        default:
          comparison = new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime();
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-red-600/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-600/10 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Header - Mobile Responsive */}
        <header className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-4">
            {/* Top Row - Logo & Actions */}
            <div className="flex items-center justify-between mb-3 md:mb-0">
              <div className="flex items-center gap-2 md:gap-8">
                <Image
                  src="/images/stage-logo-official.png"
                  alt="STAGE OTT"
                  width={150}
                  height={45}
                  className="h-8 md:h-12 w-auto"
                />
                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`relative px-4 py-2 text-sm font-bold transition-all rounded-lg ${
                      activeTab === 'overview'
                        ? 'text-white bg-red-600 shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Overview
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
                  <button
                    onClick={() => setActiveTab('library')}
                    className={`relative px-4 py-2 text-sm font-bold transition-all rounded-lg ${
                      activeTab === 'library'
                        ? 'text-white bg-red-600 shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    📚 Library
                    {activeTab === 'library' && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className={`relative px-4 py-2 text-sm font-bold transition-all rounded-lg ${
                      activeTab === 'projects'
                        ? 'text-white bg-red-600 shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    📊 Projects
                    {activeTab === 'projects' && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </button>
                </nav>
              </div>
              {/* Action Buttons - Mobile Responsive */}
              <div className="flex items-center gap-2 md:gap-4">
                {/* Edit Access Requests Button */}
                <button
                  className="relative p-2 md:p-2.5 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 hover:bg-white/20 transition-all"
                  onClick={() => setShowEditRequestsPanel(!showEditRequestsPanel)}
                >
                  <span className="text-lg md:text-2xl">✏️</span>
                  {pendingEditRequestsCount > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[18px] md:min-w-[24px] h-[18px] md:h-6 px-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <span className="text-[10px] md:text-xs font-black text-white">{pendingEditRequestsCount}</span>
                    </div>
                  )}
                </button>
                {/* Creator Updates Button */}
                <button
                  className="relative p-2 md:p-2.5 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 hover:bg-white/20 transition-all"
                  onClick={() => setShowCreatorUpdatesPanel(!showCreatorUpdatesPanel)}
                  title="Creator Updates & Changes"
                >
                  <span className="text-lg md:text-2xl">📝</span>
                  {adminNotifications.filter(n => !n.read).length > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[18px] md:min-w-[24px] h-[18px] md:h-6 px-1 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <span className="text-[10px] md:text-xs font-black text-white">{adminNotifications.filter(n => !n.read).length}</span>
                    </div>
                  )}
                </button>
                {/* Notification Bell */}
                <button
                  className="relative p-2 md:p-2.5 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 hover:bg-white/20 transition-all"
                  onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
                >
                  <span className="text-lg md:text-2xl">🔔</span>
                  {newSubmissionsCount > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[18px] md:min-w-[24px] h-[18px] md:h-6 px-1 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <span className="text-[10px] md:text-xs font-black text-white">{newSubmissionsCount}</span>
                    </div>
                  )}
                </button>
                {/* Admin Badge - Hidden on mobile */}
                <div className="hidden md:block bg-white/10 backdrop-blur-lg rounded-lg px-4 py-2 border border-white/20">
                  <div className="text-xs text-gray-400">Admin</div>
                  <div className="text-sm font-bold">STAGE Team</div>
                </div>
                <Link href="/" className="text-xs md:text-sm font-bold text-gray-400 hover:text-white">
                  Exit
                </Link>
              </div>
            </div>
            {/* Mobile Navigation Tabs */}
            <nav className="flex md:hidden items-center gap-1 overflow-x-auto pb-1 hide-scrollbar">
              {[
                { id: 'overview', label: '📊 Overview' },
                { id: 'submissions', label: '📋 Submissions', badge: newSubmissionsCount },
                { id: 'analytics', label: '📈 Analytics' },
                { id: 'budget', label: '💰 Budget' },
                { id: 'library', label: '📚 Library' },
                { id: 'projects', label: '📊 Projects' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex-shrink-0 px-3 py-1.5 text-xs font-bold transition-all rounded-lg ${
                    activeTab === tab.id
                      ? 'text-white bg-red-600'
                      : 'text-gray-400 bg-white/5'
                  }`}
                >
                  {tab.label}
                  {tab.badge && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-0.5 bg-pink-500 rounded-full flex items-center justify-center text-[8px] font-black text-white">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-8">
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

          {/* OVERVIEW TAB - Netflix Style */}
          {activeTab === 'overview' && (
            <>
          {/* Netflix-Style Dark Container */}
          <div className="bg-gradient-to-b from-gray-900 via-black to-gray-900 rounded-3xl overflow-hidden -mx-6 -mt-2 px-6 py-8">

            {/* Hero Banner */}
            <div className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-red-900/50 via-black to-purple-900/50 p-8">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-red-600 text-white text-xs font-black rounded">STAGE</span>
                  <span className="text-gray-400 text-sm font-semibold">Admin Dashboard</span>
                </div>
                <h1 className="text-4xl font-black text-white mb-2">Production Team</h1>
                <p className="text-gray-300 text-lg font-medium mb-6">Content Management & Review Platform</p>

                {/* Quick Stats Row - All Clickable */}
                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    onClick={() => {
                      setFilterStatus('all');
                      setFilterCulture('all');
                      setFilterFormat('all');
                      setTimeout(() => document.getElementById('netflix-results')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                  >
                    <span className="text-3xl font-black text-white">{stats.total}</span>
                    <span className="text-gray-400 text-sm">Total</span>
                  </button>
                  <button
                    onClick={() => {
                      setFilterStatus('approved');
                      setFilterCulture('all');
                      setFilterFormat('all');
                      setTimeout(() => document.getElementById('netflix-results')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 transition-all"
                  >
                    <span className="text-3xl font-black text-green-500">{stats.approved}</span>
                    <span className="text-gray-400 text-sm">Approved</span>
                  </button>
                  <button
                    onClick={() => {
                      setFilterStatus('pending');
                      setFilterCulture('all');
                      setFilterFormat('all');
                      setTimeout(() => document.getElementById('netflix-results')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-600/20 hover:bg-yellow-600/40 border border-yellow-500/30 transition-all"
                  >
                    <span className="text-3xl font-black text-yellow-500">{stats.pending}</span>
                    <span className="text-gray-400 text-sm">Pending</span>
                  </button>
                  <button
                    onClick={() => {
                      setFilterStatus('in-production');
                      setFilterCulture('all');
                      setFilterFormat('all');
                      setTimeout(() => document.getElementById('netflix-results')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/30 transition-all"
                  >
                    <span className="text-3xl font-black text-cyan-500">{stats.inProduction}</span>
                    <span className="text-gray-400 text-sm">Production</span>
                  </button>
                  <button
                    onClick={() => setShowBudgetBreakdown(!showBudgetBreakdown)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 transition-all"
                  >
                    <span className="text-2xl font-black text-emerald-400">{formatBudgetInWords(stats.totalBudget)}</span>
                    <span className="text-gray-400 text-sm">Total Value</span>
                    <span className="text-emerald-400 ml-1">{showBudgetBreakdown ? '▲' : '▼'}</span>
                  </button>
                </div>

                {/* Budget Breakdown Panel - Expandable */}
                {showBudgetBreakdown && (
                  <div className="mt-6 bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/30">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <span className="text-emerald-400">💰</span>
                      Approved Projects - Budget Breakdown
                    </h3>

                    {/* Culture-wise Breakdown */}
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">By Culture</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Haryanvi', 'Rajasthani', 'Bhojpuri', 'Gujarati'].map((culture) => {
                          const cultureProjects = approvedProjects.filter(p => p.culture?.toLowerCase() === culture.toLowerCase());
                          const cultureBudget = cultureProjects.reduce((sum, p) => sum + (p.totalBudget || 0), 0);
                          return (
                            <button
                              key={culture}
                              onClick={() => {
                                setFilterCulture(culture);
                                setFilterStatus('approved');
                                setFilterFormat('all');
                                setShowBudgetBreakdown(false);
                                setTimeout(() => document.getElementById('netflix-results')?.scrollIntoView({ behavior: 'smooth' }), 100);
                              }}
                              className={`p-3 rounded-lg bg-gradient-to-br ${getCultureColor(culture)} hover:scale-105 transition-all text-left`}
                            >
                              <div className="text-white font-bold">{culture}</div>
                              <div className="text-white/80 text-sm">{cultureProjects.length} Projects</div>
                              <div className="text-white font-black text-lg mt-1">{formatBudgetInWords(cultureBudget)}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Format-wise Breakdown */}
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">By Format</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {[
                          { name: 'Feature Film', icon: '🎬', color: 'from-red-600 to-rose-700' },
                          { name: 'Mini Film', icon: '🎞️', color: 'from-amber-500 to-orange-600' },
                          { name: 'Long Series', icon: '📺', color: 'from-green-600 to-emerald-700' },
                          { name: 'Limited Series', icon: '🎭', color: 'from-purple-600 to-violet-700' },
                          { name: 'Microdrama', icon: '⚡', color: 'from-cyan-500 to-blue-600' },
                        ].map((format) => {
                          const formatProjects = approvedProjects.filter(p => p.format === format.name);
                          const formatBudget = formatProjects.reduce((sum, p) => sum + (p.totalBudget || 0), 0);
                          return (
                            <button
                              key={format.name}
                              onClick={() => {
                                setFilterFormat(format.name);
                                setFilterStatus('approved');
                                setFilterCulture('all');
                                setShowBudgetBreakdown(false);
                                setTimeout(() => document.getElementById('netflix-results')?.scrollIntoView({ behavior: 'smooth' }), 100);
                              }}
                              className={`p-3 rounded-lg bg-gradient-to-br ${format.color} hover:scale-105 transition-all text-left`}
                            >
                              <div className="text-2xl mb-1">{format.icon}</div>
                              <div className="text-white font-bold text-sm">{format.name}</div>
                              <div className="text-white/80 text-xs">{formatProjects.length} Projects</div>
                              <div className="text-white font-bold text-sm mt-1">{formatBudgetInWords(formatBudget)}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Approved Projects List */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">Approved Projects ({approvedProjects.length})</h4>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {approvedProjects.map((project) => (
                          <div
                            key={project.id}
                            onClick={() => {
                              markAsViewed(project.id);
                              setSelectedSubmission(project);
                              setShowBudgetBreakdown(false);
                            }}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getCultureColor(project.culture)} flex items-center justify-center text-lg`}>
                                {project.format === 'Feature Film' ? '🎬' :
                                 project.format === 'Mini Film' ? '🎞️' :
                                 project.format === 'Long Series' ? '📺' :
                                 project.format === 'Limited Series' ? '🎭' : '⚡'}
                              </div>
                              <div>
                                <div className="text-white font-bold text-sm">{project.projectName}</div>
                                <div className="text-gray-400 text-xs">{project.culture} • {project.format} • {project.creator}</div>
                              </div>
                            </div>
                            <div className="text-emerald-400 font-bold">{formatBudgetInWords(project.totalBudget)}</div>
                          </div>
                        ))}
                        {approvedProjects.length === 0 && (
                          <div className="text-center py-8 text-gray-500">No approved projects yet</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Quick Access Bar */}
            <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 hide-scrollbar">
              {[
                { status: 'all', label: 'All', count: stats.total, color: 'bg-gray-700 hover:bg-gray-600' },
                { status: 'pending', label: 'Pending', count: stats.pending, color: 'bg-yellow-600/20 hover:bg-yellow-600/40 border border-yellow-600/50' },
                { status: 'under-review', label: 'Under Review', count: stats.underReview, color: 'bg-blue-600/20 hover:bg-blue-600/40 border border-blue-600/50' },
                { status: 'approved', label: 'Approved', count: stats.approved, color: 'bg-green-600/20 hover:bg-green-600/40 border border-green-600/50' },
                { status: 'agreement-signed', label: 'Agreement', count: submissions.filter(s => s.status === 'agreement-signed').length, color: 'bg-teal-600/20 hover:bg-teal-600/40 border border-teal-600/50' },
                { status: 'in-production', label: 'In Production', count: stats.inProduction, color: 'bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-600/50' },
                { status: 'revision-requested', label: 'Revision', count: stats.revisionRequested, color: 'bg-purple-600/20 hover:bg-purple-600/40 border border-purple-600/50' },
                { status: 'on-hold', label: 'On Hold', count: stats.onHold, color: 'bg-orange-600/20 hover:bg-orange-600/40 border border-orange-600/50' },
                { status: 'scrapped', label: 'Scrapped', count: stats.scrapped, color: 'bg-gray-600/20 hover:bg-gray-600/40 border border-gray-500/50' },
              ].map((item) => (
                <button
                  key={item.status}
                  onClick={() => {
                    setFilterStatus(item.status);
                    setFilterFormat('all');
                    setFilterCulture('all');
                    setTimeout(() => {
                      document.getElementById('netflix-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    filterStatus === item.status
                      ? 'bg-white text-black'
                      : `${item.color} text-white`
                  }`}
                >
                  {item.label} <span className="ml-1 opacity-70">{item.count}</span>
                </button>
              ))}
            </div>

            {/* Search & Sort Bar */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search projects by name, creator, director, culture, format..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm hidden md:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 appearance-none cursor-pointer"
                >
                  <option value="date">📅 Date</option>
                  <option value="name">📝 Name</option>
                  <option value="budget">💰 Budget</option>
                  <option value="status">🔄 Status</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all"
                  title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    showAdvancedFilters
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                      : 'bg-white/5 border border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  🎛️ Filters
                </button>
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className={`px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    showAnalytics
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                      : 'bg-white/5 border border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  📊 Analytics
                </button>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showAdvancedFilters && (
              <div className="mb-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl border border-purple-500/30 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span>🎛️</span> Advanced Filters
                  </h3>
                  <button
                    onClick={() => {
                      setDateRangeFrom('');
                      setDateRangeTo('');
                      setBudgetMin('');
                      setBudgetMax('');
                      setFilterStatus('all');
                      setFilterFormat('all');
                      setFilterCulture('all');
                    }}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg transition-all"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Date Range From */}
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">📅 From Date</label>
                    <input
                      type="date"
                      value={dateRangeFrom}
                      onChange={(e) => setDateRangeFrom(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* Date Range To */}
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">📅 To Date</label>
                    <input
                      type="date"
                      value={dateRangeTo}
                      onChange={(e) => setDateRangeTo(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* Budget Min */}
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">💰 Min Budget (₹)</label>
                    <input
                      type="number"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                      placeholder="e.g., 1000000"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 placeholder-gray-500"
                    />
                  </div>

                  {/* Budget Max */}
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">💰 Max Budget (₹)</label>
                    <input
                      type="number"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                      placeholder="e.g., 50000000"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 placeholder-gray-500"
                    />
                  </div>

                  {/* Culture Filter */}
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">🌍 Culture</label>
                    <select
                      value={filterCulture}
                      onChange={(e) => setFilterCulture(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
                    >
                      <option value="all">All Cultures</option>
                      <option value="haryanvi">Haryanvi</option>
                      <option value="rajasthani">Rajasthani</option>
                      <option value="bhojpuri">Bhojpuri</option>
                      <option value="gujarati">Gujarati</option>
                    </select>
                  </div>

                  {/* Format Filter */}
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">🎬 Format</label>
                    <select
                      value={filterFormat}
                      onChange={(e) => setFilterFormat(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
                    >
                      <option value="all">All Formats</option>
                      <option value="Feature Film">Feature Film</option>
                      <option value="Mini Film">Mini Film</option>
                      <option value="Long Series">Long Series</option>
                      <option value="Limited Series">Limited Series</option>
                      <option value="Microdrama">Microdrama</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">📋 Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="under-review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="agreement-signed">Agreement Signed</option>
                      <option value="in-production">In Production</option>
                      <option value="revision-requested">Revision Requested</option>
                      <option value="on-hold">On Hold</option>
                      <option value="scrapped">Scrapped</option>
                    </select>
                  </div>

                  {/* Quick Budget Presets */}
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">⚡ Quick Budget</label>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => { setBudgetMin(''); setBudgetMax('5000000'); }}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-all"
                      >
                        Under 50L
                      </button>
                      <button
                        onClick={() => { setBudgetMin('5000000'); setBudgetMax('20000000'); }}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-all"
                      >
                        50L - 2Cr
                      </button>
                      <button
                        onClick={() => { setBudgetMin('20000000'); setBudgetMax(''); }}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-all"
                      >
                        Above 2Cr
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Filters Summary */}
                {(dateRangeFrom || dateRangeTo || budgetMin || budgetMax) && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-gray-400 text-sm">Active filters:</span>
                      {dateRangeFrom && (
                        <span className="px-2 py-1 bg-purple-500/30 text-purple-300 text-xs font-bold rounded-lg flex items-center gap-1">
                          From: {dateRangeFrom}
                          <button onClick={() => setDateRangeFrom('')} className="hover:text-white">×</button>
                        </span>
                      )}
                      {dateRangeTo && (
                        <span className="px-2 py-1 bg-purple-500/30 text-purple-300 text-xs font-bold rounded-lg flex items-center gap-1">
                          To: {dateRangeTo}
                          <button onClick={() => setDateRangeTo('')} className="hover:text-white">×</button>
                        </span>
                      )}
                      {budgetMin && (
                        <span className="px-2 py-1 bg-green-500/30 text-green-300 text-xs font-bold rounded-lg flex items-center gap-1">
                          Min: ₹{parseInt(budgetMin).toLocaleString('en-IN')}
                          <button onClick={() => setBudgetMin('')} className="hover:text-white">×</button>
                        </span>
                      )}
                      {budgetMax && (
                        <span className="px-2 py-1 bg-green-500/30 text-green-300 text-xs font-bold rounded-lg flex items-center gap-1">
                          Max: ₹{parseInt(budgetMax).toLocaleString('en-IN')}
                          <button onClick={() => setBudgetMax('')} className="hover:text-white">×</button>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Stats Summary */}
            {showAnalytics && (
              <div className="mb-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <span>📊</span> Quick Stats
                  </h2>
                  <Link
                    href="/admin/analytics"
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold rounded-lg transition-all text-sm flex items-center gap-2"
                  >
                    <span>View Full Analytics</span>
                    <span>→</span>
                  </Link>
                </div>

                {/* Simple Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <div className="text-3xl font-black text-blue-400">{stats.total}</div>
                    <div className="text-sm text-gray-400">Total</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <div className="text-3xl font-black text-yellow-400">{stats.pending + stats.underReview}</div>
                    <div className="text-sm text-gray-400">Pipeline</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <div className="text-3xl font-black text-green-400">{stats.approved}</div>
                    <div className="text-sm text-gray-400">Approved</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <div className="text-3xl font-black text-purple-400">{stats.inProduction}</div>
                    <div className="text-sm text-gray-400">Production</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <div className="text-xl font-black text-emerald-400">{formatBudgetInWords(stats.totalBudget)}</div>
                    <div className="text-sm text-gray-400">Total Value</div>
                  </div>
                </div>
              </div>
            )}

            {/* CULTURE-WISE ROW - Netflix Style */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Browse by Culture</h2>
                {filterCulture !== 'all' && (
                  <button
                    onClick={() => setFilterCulture('all')}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {[
                  { name: 'Haryanvi', color: 'from-green-600 to-teal-700' },
                  { name: 'Rajasthani', color: 'from-pink-600 to-purple-700' },
                  { name: 'Bhojpuri', color: 'from-orange-600 to-red-700' },
                  { name: 'Gujarati', color: 'from-amber-500 to-yellow-600' },
                ].map((cultureItem) => {
                  const count = submissions.filter(s =>
                    s.culture?.toLowerCase() === cultureItem.name.toLowerCase()
                  ).length;
                  return (
                    <button
                      key={cultureItem.name}
                      onClick={() => {
                        setFilterCulture(filterCulture === cultureItem.name ? 'all' : cultureItem.name);
                        setFilterFormat('all');
                        setFilterStatus('all');
                        setTimeout(() => {
                          document.getElementById('netflix-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }}
                      className={`flex-shrink-0 w-48 group relative rounded-lg overflow-hidden transition-all duration-300 ${
                        filterCulture === cultureItem.name ? 'ring-2 ring-white scale-105' : 'hover:scale-105'
                      }`}
                    >
                      <div className={`h-28 bg-gradient-to-br ${cultureItem.color}`}></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="text-white font-bold text-lg">{cultureItem.name}</div>
                        <div className="text-gray-300 text-xs">{count} Projects</div>
                      </div>
                      {filterCulture === cultureItem.name && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <span className="text-black text-xs font-black">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FORMAT-WISE ROW - Netflix Style */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Browse by Format</h2>
                {filterFormat !== 'all' && (
                  <button
                    onClick={() => setFilterFormat('all')}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {[
                  { key: 'Feature Film', icon: '🎬', color: 'from-red-600 to-rose-700' },
                  { key: 'Mini Film', icon: '🎞️', color: 'from-amber-500 to-orange-600' },
                  { key: 'Long Series', icon: '📺', color: 'from-green-600 to-emerald-700' },
                  { key: 'Limited Series', icon: '🎭', color: 'from-purple-600 to-violet-700' },
                  { key: 'Microdrama', icon: '⚡', color: 'from-cyan-500 to-blue-600' },
                ].map(({ key, icon, color }) => {
                  const count = stats.byFormat[key] || 0;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setFilterFormat(filterFormat === key ? 'all' : key);
                        setFilterCulture('all');
                        setFilterStatus('all');
                        setTimeout(() => {
                          document.getElementById('netflix-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }}
                      className={`flex-shrink-0 w-40 group relative rounded-lg overflow-hidden transition-all duration-300 ${
                        filterFormat === key ? 'ring-2 ring-white scale-105' : 'hover:scale-105'
                      }`}
                    >
                      <div className={`h-24 bg-gradient-to-br ${color} flex items-center justify-center`}>
                        <span className="text-4xl">{icon}</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <div className="text-white font-bold text-sm">{key}</div>
                        <div className="text-gray-300 text-xs">{count} Projects</div>
                      </div>
                      {filterFormat === key && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <span className="text-black text-xs font-black">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RECENT SUBMISSIONS ROW - Netflix Style */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Recent Submissions</h2>
                <span className="text-gray-400 text-sm">{newSubmissionsCount} new</span>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {[...submissions]
                  .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
                  .slice(0, 10)
                  .map((project) => {
                    const statusConfig = getStatusConfig(project.status);
                    const isNew = isNewSubmission(project.submittedDate, project.id);
                    return (
                      <div
                        key={project.id}
                        onClick={() => {
                          markAsViewed(project.id);
                          setSelectedSubmission(project);
                        }}
                        className={`flex-shrink-0 w-56 bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10 relative group ${
                          isNew ? 'ring-2 ring-red-500' : ''
                        }`}
                      >
                        {isNew && (
                          <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded">
                            NEW
                          </div>
                        )}
                        <div className={`h-32 bg-gradient-to-br ${getCultureColor(project.culture)} flex items-center justify-center relative`}>
                          <span className="text-5xl opacity-50">{
                            project.format === 'Feature Film' ? '🎬' :
                            project.format === 'Mini Film' ? '🎞️' :
                            project.format === 'Long Series' ? '📺' :
                            project.format === 'Limited Series' ? '🎭' : '⚡'
                          }</span>
                          <div className="absolute bottom-2 right-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${statusConfig.badge}`}>
                              {statusConfig.text}
                            </span>
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="text-white font-bold text-sm truncate mb-1">{project.projectName}</div>
                          <div className="text-gray-400 text-xs mb-2">{project.culture} • {project.format}</div>
                          <div className="flex items-center justify-between">
                            <span className="text-green-400 text-xs font-bold">{formatBudgetInWords(project.totalBudget)}</span>
                            <span className="text-gray-500 text-xs">{getTimeElapsed(project.submittedDate)}</span>
                          </div>
                        </div>
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                          <button className="w-full py-2 bg-white text-black font-bold rounded text-sm hover:bg-gray-200 transition-colors">
                            Review
                          </button>
                          <div className="text-gray-300 text-xs text-center">
                            <div>{project.creator}</div>
                            <div>{project.genre}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* TOP BUDGET PROJECTS ROW */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Top Budget Projects</h2>
                <span className="text-gray-400 text-sm">By total value</span>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {[...submissions]
                  .sort((a, b) => (b.totalBudget || 0) - (a.totalBudget || 0))
                  .slice(0, 8)
                  .map((project, index) => {
                    const statusConfig = getStatusConfig(project.status);
                    return (
                      <div
                        key={project.id}
                        onClick={() => {
                          markAsViewed(project.id);
                          setSelectedSubmission(project);
                        }}
                        className="flex-shrink-0 w-64 bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10 relative group"
                      >
                        <div className="absolute top-2 left-2 z-10 w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center">
                          <span className="text-black font-black text-sm">#{index + 1}</span>
                        </div>
                        <div className={`h-36 bg-gradient-to-br ${getCultureColor(project.culture)} flex items-center justify-center relative`}>
                          <span className="text-6xl opacity-50">💰</span>
                          <div className="absolute bottom-2 right-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${statusConfig.badge}`}>
                              {statusConfig.text}
                            </span>
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="text-white font-bold text-sm truncate mb-1">{project.projectName}</div>
                          <div className="text-gray-400 text-xs mb-2">{project.culture} • {project.format}</div>
                          <div className="text-emerald-400 text-lg font-black">{formatBudgetInWords(project.totalBudget)}</div>
                        </div>
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                          <button className="w-full py-2 bg-white text-black font-bold rounded text-sm hover:bg-gray-200 transition-colors">
                            Review
                          </button>
                          <div className="text-gray-300 text-xs text-center">
                            <div>{project.creator}</div>
                            <div>Director: {project.director || 'TBD'}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* ACTIVITY LOG ROW */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">Activity Log</h2>
              <div className="bg-gray-800/50 rounded-xl p-4 max-h-80 overflow-y-auto">
                {[...submissions]
                  .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
                  .slice(0, 15)
                  .map((project) => {
                    const statusConfig = getStatusConfig(project.status);
                    return (
                      <div
                        key={project.id}
                        className="flex items-center gap-4 py-3 border-b border-gray-700/50 last:border-0 hover:bg-gray-700/30 rounded px-2 transition-colors cursor-pointer"
                        onClick={() => {
                          markAsViewed(project.id);
                          setSelectedSubmission(project);
                        }}
                      >
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-semibold text-sm">{project.projectName}</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${statusConfig.badge}`}>
                              {statusConfig.text}
                            </span>
                          </div>
                          <div className="text-gray-400 text-xs mt-0.5">
                            Submitted by {project.creator} • {project.culture} • {project.format}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-300 text-xs">{formatDate(project.submittedDate)}</div>
                          <div className="text-gray-500 text-xs">{getTimeElapsed(project.submittedDate)}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Active Filters Bar - Netflix Style */}
            {(filterFormat !== 'all' || filterCulture !== 'all' || filterStatus !== 'all') && (
              <div className="mb-6 flex items-center gap-3 flex-wrap">
                <span className="text-gray-400 text-sm">Active Filters:</span>
                {filterCulture !== 'all' && (
                  <span className="px-3 py-1 bg-blue-600/30 border border-blue-500/50 rounded-full text-blue-300 text-sm flex items-center gap-2">
                    Culture: {filterCulture}
                    <button onClick={() => setFilterCulture('all')} className="hover:text-white">✕</button>
                  </span>
                )}
                {filterFormat !== 'all' && (
                  <span className="px-3 py-1 bg-purple-600/30 border border-purple-500/50 rounded-full text-purple-300 text-sm flex items-center gap-2">
                    Format: {filterFormat}
                    <button onClick={() => setFilterFormat('all')} className="hover:text-white">✕</button>
                  </span>
                )}
                {filterStatus !== 'all' && (
                  <span className="px-3 py-1 bg-red-600/30 border border-red-500/50 rounded-full text-red-300 text-sm flex items-center gap-2">
                    Status: {filterStatus.replace('-', ' ')}
                    <button onClick={() => setFilterStatus('all')} className="hover:text-white">✕</button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setFilterCulture('all');
                    setFilterFormat('all');
                    setFilterStatus('all');
                  }}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 text-sm transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Results Header - Netflix Style */}
            <div id="netflix-results" className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
              <h2 className="text-lg md:text-xl font-bold text-white">
                {searchQuery
                  ? `Search Results for "${searchQuery}" (${filteredSubmissions.length})`
                  : filterCulture !== 'all' || filterFormat !== 'all' || filterStatus !== 'all'
                  ? `Filtered Results (${filteredSubmissions.length})`
                  : `All Projects (${submissions.length})`
                }
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Sorted by: {sortBy === 'date' ? '📅 Date' : sortBy === 'name' ? '📝 Name' : sortBy === 'budget' ? '💰 Budget' : '🔄 Status'}</span>
                <span>({sortOrder === 'desc' ? 'Newest first' : 'Oldest first'})</span>
              </div>
            </div>

            {/* Projects Grid - Netflix Card Style */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
              {filteredSubmissions.map((submission) => {
                const statusConfig = getStatusConfig(submission.status);
                const isNew = isNewSubmission(submission.submittedDate, submission.id);
                return (
                  <div
                    key={submission.id}
                    className={`group bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10 relative ${
                      isNew ? 'ring-2 ring-red-500' : ''
                    }`}
                    onClick={() => {
                      markAsViewed(submission.id);
                      setSelectedSubmission(submission);
                    }}
                  >
                    {/* NEW Badge */}
                    {isNew && (
                      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded animate-pulse">
                        NEW
                      </div>
                    )}

                    {/* Card Visual */}
                    <div className={`h-40 bg-gradient-to-br ${getCultureColor(submission.culture)} flex items-center justify-center relative`}>
                      <span className="text-6xl opacity-40">{
                        submission.format === 'Feature Film' ? '🎬' :
                        submission.format === 'Mini Film' ? '🎞️' :
                        submission.format === 'Long Series' ? '📺' :
                        submission.format === 'Limited Series' ? '🎭' : '⚡'
                      }</span>

                      {/* Status Badge */}
                      <div className="absolute bottom-2 right-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${statusConfig.badge}`}>
                          {statusConfig.text}
                        </span>
                      </div>

                      {/* Budget Badge */}
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 bg-black/60 rounded text-xs font-bold text-emerald-400">
                          {formatBudgetInWords(submission.totalBudget)}
                        </span>
                      </div>
                    </div>

                    {/* Card Info */}
                    <div className="p-3">
                      <div className="text-white font-bold text-sm truncate mb-1">{submission.projectName}</div>
                      <div className="text-gray-400 text-xs mb-2">{submission.culture} • {submission.format}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-xs">{submission.creator}</span>
                        <span className="text-gray-600 text-xs">{getTimeElapsed(submission.submittedDate)}</span>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col p-4">
                      <div className="flex-1">
                        <div className="text-white font-bold mb-1">{submission.projectName}</div>
                        <div className="text-gray-300 text-xs mb-2">{submission.culture} • {submission.format} • {submission.genre}</div>
                        <div className="text-gray-400 text-xs mb-1">Creator: {submission.creator}</div>
                        <div className="text-gray-400 text-xs mb-1">Director: {submission.director || 'TBD'}</div>
                        <div className="text-emerald-400 text-sm font-bold mb-2">{formatBudgetInWords(submission.totalBudget)}</div>

                        {/* Completeness Bar */}
                        <div className="mb-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">Completeness</span>
                            <span className={submission.completeness >= 90 ? 'text-green-400' : 'text-amber-400'}>{submission.completeness}%</span>
                          </div>
                          <div className="h-1 bg-gray-700 rounded-full">
                            <div
                              className={`h-full rounded-full ${submission.completeness >= 90 ? 'bg-green-500' : 'bg-amber-500'}`}
                              style={{ width: `${submission.completeness}%` }}
                            />
                          </div>
                        </div>

                        {submission.warnings > 0 && (
                          <div className="text-amber-400 text-xs">⚠️ {submission.warnings} Warnings</div>
                        )}
                        {submission.sopComments && submission.sopComments.length > 0 && (
                          <div className="text-blue-400 text-xs">💬 {submission.sopComments.length} SOP Questions</div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-auto">
                        <button
                          className="flex-1 py-2 bg-white text-black font-bold rounded text-xs hover:bg-gray-200 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsViewed(submission.id);
                            setSelectedSubmission(submission);
                          }}
                        >
                          Review
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowStatusMenu(submission.id);
                          }}
                          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs transition-colors"
                          title="Change Status"
                        >
                          🔄
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(submission.id);
                          }}
                          className="px-3 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded text-xs transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredSubmissions.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 opacity-50">📭</div>
                <div className="text-xl font-bold text-gray-400">No projects found</div>
                <div className="text-sm text-gray-600 mt-2">Try adjusting your filters</div>
              </div>
            )}

          </div> {/* End of Netflix Dark Container */}

          <style jsx>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
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
                  const isNew = isNewSubmission(submission.submittedDate, submission.id);
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
                            onClick={() => {
                              markAsViewed(submission.id);
                              setSelectedSubmission(submission);
                            }}
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

          {/* ANALYTICS TAB - Redesigned */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                  <span className="text-3xl">📊</span>
                  Analytics Dashboard
                </h2>
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Projects', value: stats.total, icon: '📁', color: 'blue' },
                  { label: 'Approved', value: stats.approved, icon: '✅', color: 'green' },
                  { label: 'In Production', value: stats.inProduction, icon: '🎬', color: 'purple' },
                  { label: 'Under Review', value: stats.underReview, icon: '👁️', color: 'orange' },
                ].map((stat) => (
                  <div key={stat.label} className={`bg-${stat.color}-50 border-2 border-${stat.color}-200 rounded-xl p-4 text-center`}>
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-3xl font-black text-gray-900">{stat.value}</div>
                    <div className={`text-sm font-bold text-${stat.color}-700`}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Projects by Culture - Expandable */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
                <button
                  onClick={() => setExpandedBudgetCulture(expandedBudgetCulture === 'culture-analytics' ? null : 'culture-analytics')}
                  className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌍</span>
                    <div className="text-left">
                      <h3 className="text-lg font-black text-gray-900">Projects by Culture</h3>
                      <p className="text-sm text-gray-500 font-semibold">{Object.keys(stats.budgetByCulture).length} cultures</p>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold transition-transform ${expandedBudgetCulture === 'culture-analytics' ? 'rotate-180' : ''}`}>
                    ▼
                  </div>
                </button>

                {expandedBudgetCulture === 'culture-analytics' && (
                  <div className="border-t-2 border-gray-200 p-5 space-y-4">
                    {Object.entries(
                      submissions.reduce((acc: Record<string, number>, s) => {
                        acc[s.culture] = (acc[s.culture] || 0) + 1;
                        return acc;
                      }, {})
                    ).sort((a, b) => b[1] - a[1]).map(([culture, count]) => {
                      const percentage = ((count as number) / stats.total * 100).toFixed(0);
                      return (
                        <div key={culture} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900">{culture}</span>
                            <span className="font-black text-gray-700">{count} projects ({percentage}%)</span>
                          </div>
                          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Projects by Format - Expandable */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
                <button
                  onClick={() => setExpandedBudgetCulture(expandedBudgetCulture === 'format-analytics' ? null : 'format-analytics')}
                  className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎬</span>
                    <div className="text-left">
                      <h3 className="text-lg font-black text-gray-900">Projects by Format</h3>
                      <p className="text-sm text-gray-500 font-semibold">Content type distribution</p>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold transition-transform ${expandedBudgetCulture === 'format-analytics' ? 'rotate-180' : ''}`}>
                    ▼
                  </div>
                </button>

                {expandedBudgetCulture === 'format-analytics' && (
                  <div className="border-t-2 border-gray-200 p-5 space-y-4">
                    {Object.entries(
                      submissions.reduce((acc: Record<string, number>, s) => {
                        acc[s.format] = (acc[s.format] || 0) + 1;
                        return acc;
                      }, {})
                    ).sort((a, b) => b[1] - a[1]).map(([format, count]) => {
                      const percentage = ((count as number) / stats.total * 100).toFixed(0);
                      const formatIcons: Record<string, string> = {
                        'Feature Film': '🎬', 'Mini Film': '🎞️', 'Long Series': '📺',
                        'Limited Series': '🎭', 'Microdrama': '⚡'
                      };
                      return (
                        <div key={format} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900 flex items-center gap-2">
                              <span>{formatIcons[format] || '📹'}</span> {format}
                            </span>
                            <span className="font-black text-gray-700">{count} projects ({percentage}%)</span>
                          </div>
                          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Projects by Status - Expandable */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
                <button
                  onClick={() => setExpandedBudgetCulture(expandedBudgetCulture === 'status-analytics' ? null : 'status-analytics')}
                  className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📋</span>
                    <div className="text-left">
                      <h3 className="text-lg font-black text-gray-900">Projects by Status</h3>
                      <p className="text-sm text-gray-500 font-semibold">Pipeline overview</p>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold transition-transform ${expandedBudgetCulture === 'status-analytics' ? 'rotate-180' : ''}`}>
                    ▼
                  </div>
                </button>

                {expandedBudgetCulture === 'status-analytics' && (
                  <div className="border-t-2 border-gray-200 p-5 space-y-4">
                    {[
                      { status: 'approved', label: 'Approved', color: 'green', icon: '✅' },
                      { status: 'in-production', label: 'In Production', color: 'purple', icon: '🎬' },
                      { status: 'under-review', label: 'Under Review', color: 'blue', icon: '👁️' },
                      { status: 'pending', label: 'Pending', color: 'yellow', icon: '⏳' },
                      { status: 'revision-requested', label: 'Revision Requested', color: 'orange', icon: '📝' },
                    ].map(({ status, label, color, icon }) => {
                      const count = submissions.filter(s => s.status === status).length;
                      const percentage = stats.total > 0 ? ((count / stats.total) * 100).toFixed(0) : '0';
                      return (
                        <div key={status} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900 flex items-center gap-2">
                              <span>{icon}</span> {label}
                            </span>
                            <span className="font-black text-gray-700">{count} projects ({percentage}%)</span>
                          </div>
                          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                color === 'green' ? 'bg-green-500' :
                                color === 'purple' ? 'bg-purple-500' :
                                color === 'blue' ? 'bg-blue-500' :
                                color === 'yellow' ? 'bg-yellow-500' :
                                'bg-orange-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BUDGET TAB - Redesigned */}
          {activeTab === 'budget' && (
            <div className="space-y-6">
              {/* Header with Total */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold opacity-90 mb-1">Total Budget (All Projects)</h2>
                    <div className="text-4xl font-black">{formatBudgetInWords(submissions.reduce((sum, s) => sum + (s.totalBudget || 0), 0))}</div>
                    <p className="text-sm font-semibold opacity-80 mt-2">{stats.total} total projects</p>
                  </div>
                  <div className="text-6xl">💰</div>
                </div>
              </div>

              {/* Budget Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Approved Budget', value: submissions.filter(s => s.status === 'approved').reduce((sum, s) => sum + (s.totalBudget || 0), 0), icon: '✅', color: 'green' },
                  { label: 'In Production', value: submissions.filter(s => s.status === 'in-production').reduce((sum, s) => sum + (s.totalBudget || 0), 0), icon: '🎬', color: 'purple' },
                  { label: 'Under Review', value: submissions.filter(s => s.status === 'under-review').reduce((sum, s) => sum + (s.totalBudget || 0), 0), icon: '👁️', color: 'blue' },
                  { label: 'Pending', value: submissions.filter(s => s.status === 'pending').reduce((sum, s) => sum + (s.totalBudget || 0), 0), icon: '⏳', color: 'yellow' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-md">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{stat.icon}</span>
                      <span className="text-sm font-bold text-gray-600">{stat.label}</span>
                    </div>
                    <div className="text-xl font-black text-gray-900">{formatBudget(stat.value)}</div>
                  </div>
                ))}
              </div>

              {/* Budget by Culture - Expandable */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
                <button
                  onClick={() => setExpandedBudgetCulture(expandedBudgetCulture === 'budget-culture' ? null : 'budget-culture')}
                  className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌍</span>
                    <div className="text-left">
                      <h3 className="text-lg font-black text-gray-900">Budget by Culture</h3>
                      <p className="text-sm text-gray-500 font-semibold">Click to view breakdown</p>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold transition-transform ${expandedBudgetCulture === 'budget-culture' ? 'rotate-180' : ''}`}>
                    ▼
                  </div>
                </button>

                {expandedBudgetCulture === 'budget-culture' && (
                  <div className="border-t-2 border-gray-200 p-5 space-y-4">
                    {Object.entries(
                      submissions.reduce((acc: Record<string, { count: number; budget: number; projects: any[] }>, s) => {
                        if (!acc[s.culture]) acc[s.culture] = { count: 0, budget: 0, projects: [] };
                        acc[s.culture].count++;
                        acc[s.culture].budget += s.totalBudget || 0;
                        acc[s.culture].projects.push(s);
                        return acc;
                      }, {})
                    ).sort((a, b) => b[1].budget - a[1].budget).map(([culture, data]) => {
                      const totalBudget = submissions.reduce((sum, s) => sum + (s.totalBudget || 0), 0);
                      const percentage = totalBudget > 0 ? ((data.budget / totalBudget) * 100).toFixed(0) : '0';
                      return (
                        <div key={culture} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="font-black text-gray-900 text-lg">{culture}</span>
                              <span className="text-sm text-gray-500 ml-2">({data.count} projects)</span>
                            </div>
                            <span className="font-black text-green-600 text-lg">{formatBudget(data.budget)}</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 font-semibold">{percentage}% of total budget</div>

                          {/* Projects in this culture */}
                          <div className="mt-3 space-y-2">
                            {data.projects.slice(0, 3).map((project: any) => (
                              <div
                                key={project.id}
                                onClick={() => { markAsViewed(project.id); setSelectedSubmission(project); }}
                                className="bg-white rounded-lg p-3 border border-gray-200 cursor-pointer hover:shadow-md transition-all flex items-center justify-between"
                              >
                                <div>
                                  <div className="font-bold text-gray-900 text-sm">{project.projectName}</div>
                                  <div className="text-xs text-gray-500">{project.format}</div>
                                </div>
                                <div className="font-bold text-green-600 text-sm">{formatBudget(project.totalBudget)}</div>
                              </div>
                            ))}
                            {data.projects.length > 3 && (
                              <div className="text-center text-xs text-gray-400 font-semibold">+ {data.projects.length - 3} more</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Budget by Format - Expandable */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
                <button
                  onClick={() => setExpandedBudgetCulture(expandedBudgetCulture === 'budget-format' ? null : 'budget-format')}
                  className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎬</span>
                    <div className="text-left">
                      <h3 className="text-lg font-black text-gray-900">Budget by Format</h3>
                      <p className="text-sm text-gray-500 font-semibold">Click to view breakdown</p>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold transition-transform ${expandedBudgetCulture === 'budget-format' ? 'rotate-180' : ''}`}>
                    ▼
                  </div>
                </button>

                {expandedBudgetCulture === 'budget-format' && (
                  <div className="border-t-2 border-gray-200 p-5 space-y-4">
                    {Object.entries(
                      submissions.reduce((acc: Record<string, { count: number; budget: number; projects: any[] }>, s) => {
                        if (!acc[s.format]) acc[s.format] = { count: 0, budget: 0, projects: [] };
                        acc[s.format].count++;
                        acc[s.format].budget += s.totalBudget || 0;
                        acc[s.format].projects.push(s);
                        return acc;
                      }, {})
                    ).sort((a, b) => b[1].budget - a[1].budget).map(([format, data]) => {
                      const totalBudget = submissions.reduce((sum, s) => sum + (s.totalBudget || 0), 0);
                      const percentage = totalBudget > 0 ? ((data.budget / totalBudget) * 100).toFixed(0) : '0';
                      const formatIcons: Record<string, string> = {
                        'Feature Film': '🎬', 'Mini Film': '🎞️', 'Long Series': '📺',
                        'Limited Series': '🎭', 'Microdrama': '⚡'
                      };
                      return (
                        <div key={format} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{formatIcons[format] || '📹'}</span>
                              <span className="font-black text-gray-900 text-lg">{format}</span>
                              <span className="text-sm text-gray-500">({data.count} projects)</span>
                            </div>
                            <span className="font-black text-purple-600 text-lg">{formatBudget(data.budget)}</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 font-semibold">{percentage}% of total budget</div>

                          {/* Projects in this format */}
                          <div className="mt-3 space-y-2">
                            {data.projects.slice(0, 3).map((project: any) => (
                              <div
                                key={project.id}
                                onClick={() => { markAsViewed(project.id); setSelectedSubmission(project); }}
                                className="bg-white rounded-lg p-3 border border-gray-200 cursor-pointer hover:shadow-md transition-all flex items-center justify-between"
                              >
                                <div>
                                  <div className="font-bold text-gray-900 text-sm">{project.projectName}</div>
                                  <div className="text-xs text-gray-500">{project.culture}</div>
                                </div>
                                <div className="font-bold text-purple-600 text-sm">{formatBudget(project.totalBudget)}</div>
                              </div>
                            ))}
                            {data.projects.length > 3 && (
                              <div className="text-center text-xs text-gray-400 font-semibold">+ {data.projects.length - 3} more</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* All Projects List - Expandable */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
                <button
                  onClick={() => setExpandedBudgetCulture(expandedBudgetCulture === 'all-projects' ? null : 'all-projects')}
                  className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📋</span>
                    <div className="text-left">
                      <h3 className="text-lg font-black text-gray-900">All Projects</h3>
                      <p className="text-sm text-gray-500 font-semibold">Sorted by budget (highest first)</p>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold transition-transform ${expandedBudgetCulture === 'all-projects' ? 'rotate-180' : ''}`}>
                    ▼
                  </div>
                </button>

                {expandedBudgetCulture === 'all-projects' && (
                  <div className="border-t-2 border-gray-200 p-5 space-y-3">
                    {[...submissions].sort((a, b) => (b.totalBudget || 0) - (a.totalBudget || 0)).map((project, index) => (
                      <div
                        key={project.id}
                        onClick={() => { markAsViewed(project.id); setSelectedSubmission(project); }}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200 cursor-pointer hover:shadow-md hover:bg-gray-100 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center font-black text-gray-600 text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900">{project.projectName}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                              <span>{project.culture}</span>
                              <span>•</span>
                              <span>{project.format}</span>
                              <span>•</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusConfig(project.status).badge}`}>
                                {getStatusConfig(project.status).text}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-black text-green-600 text-lg">{formatBudget(project.totalBudget)}</div>
                            <div className="text-xs text-gray-400">{project.creator}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LIBRARY TAB - Talent Database */}
          {activeTab === 'library' && (
            <div className="space-y-6">
              {/* Library Header */}
              <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-6 shadow-lg text-white">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold opacity-90 mb-1">Talent Library</h2>
                    <div className="text-3xl font-black">Crew & Cast Database</div>
                    <p className="text-sm font-semibold opacity-80 mt-2">
                      {talentLibrary.length} talents • Auto-synced from approved projects
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Share Button */}
                    <div className="relative group">
                      <button className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-bold transition-all flex items-center gap-2">
                        <span>📤</span> Share
                      </button>
                      <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        <button onClick={() => shareToWhatsApp(`STAGE Talent Library\n${talentLibrary.length} talents available\n${window.location.href}`)} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 text-sm font-semibold">
                          <span>💬</span> WhatsApp
                        </button>
                        <button onClick={() => shareToTwitter(`Check out STAGE OTT Talent Library - ${talentLibrary.length} industry talents! ${window.location.href}`)} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 text-sm font-semibold">
                          <span>🐦</span> Twitter/X
                        </button>
                        <button onClick={() => shareToLinkedIn('STAGE OTT Talent Library', window.location.href)} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 text-sm font-semibold">
                          <span>💼</span> LinkedIn
                        </button>
                        <button onClick={() => shareToEmail('STAGE Talent Library', `Check out our talent database with ${talentLibrary.length} industry professionals.\n\n${window.location.href}`)} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 text-sm font-semibold">
                          <span>📧</span> Email
                        </button>
                        <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 text-sm font-semibold">
                          <span>🔗</span> Copy Link
                        </button>
                      </div>
                    </div>
                    {/* Download Button */}
                    <div className="relative group">
                      <button className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-bold transition-all flex items-center gap-2">
                        <span>⬇️</span> Download
                      </button>
                      <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">All Talents</div>
                        <button onClick={() => downloadTalentsExcel(talentLibrary, 'STAGE_All_Talents')} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 text-sm font-semibold">
                          <span>📊</span> Excel (.xlsx)
                        </button>
                        <button onClick={() => downloadTalentsCSV(talentLibrary, 'STAGE_All_Talents')} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 text-sm font-semibold">
                          <span>📄</span> CSV
                        </button>
                        <button onClick={() => downloadTalentsPDF(talentLibrary, 'All Talents')} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 text-sm font-semibold">
                          <span>📑</span> PDF (Print)
                        </button>
                        <div className="border-t border-gray-200 my-2"></div>
                        <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">By Department</div>
                        <button onClick={() => downloadTalentsExcel(talentLibrary.filter(t => t.department === 'direction'), 'STAGE_Direction_Team')} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 text-sm font-semibold">
                          <span>🎬</span> Direction Team
                        </button>
                        <button onClick={() => downloadTalentsExcel(talentLibrary.filter(t => t.department === 'production'), 'STAGE_Production_Team')} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 text-sm font-semibold">
                          <span>🎥</span> Production Team
                        </button>
                        <button onClick={() => downloadTalentsExcel(talentLibrary.filter(t => t.department === 'camera'), 'STAGE_Camera_Team')} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 text-sm font-semibold">
                          <span>📷</span> Camera Team
                        </button>
                        <button onClick={() => downloadTalentsExcel(talentLibrary.filter(t => t.department === 'cast'), 'STAGE_Cast_Members')} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 text-sm font-semibold">
                          <span>🎭</span> Cast Members
                        </button>
                      </div>
                    </div>
                    {/* Add Talent Button */}
                    <button
                      onClick={() => setShowAddTalentModal(true)}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-bold transition-all flex items-center gap-2"
                    >
                      <span>➕</span> Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Library Search & Filters */}
              <div className="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-md">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={librarySearchQuery}
                      onChange={(e) => setLibrarySearchQuery(e.target.value)}
                      placeholder="🔍 Search by name, role, culture..."
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">All Departments</option>
                    <option value="direction">Direction</option>
                    <option value="production">Production</option>
                    <option value="writing">Writing</option>
                    <option value="camera">Camera</option>
                    <option value="editing">Editing</option>
                    <option value="sound">Sound</option>
                    <option value="music">Music</option>
                    <option value="art">Art & Design</option>
                    <option value="costume">Costume & Makeup</option>
                    <option value="vfx">VFX & Post</option>
                    <option value="cast">Cast</option>
                  </select>
                </div>
              </div>

              {/* Department Stats - Clickable */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {[
                  { id: 'all', label: 'All', icon: '📚', color: 'bg-gray-600' },
                  { id: 'direction', label: 'Direction', icon: '🎬', color: 'bg-red-500' },
                  { id: 'production', label: 'Production', icon: '🎥', color: 'bg-blue-500' },
                  { id: 'writing', label: 'Writing', icon: '✍️', color: 'bg-green-500' },
                  { id: 'camera', label: 'Camera', icon: '📷', color: 'bg-yellow-500' },
                  { id: 'cast', label: 'Cast', icon: '🎭', color: 'bg-pink-500' },
                ].map((dept) => {
                  const count = dept.id === 'all' ? talentLibrary.length : talentLibrary.filter(t => t.department === dept.id).length;
                  return (
                    <button
                      key={dept.id}
                      onClick={() => setSelectedDepartment(dept.id)}
                      className={`bg-white border-2 rounded-xl p-4 shadow-md text-center transition-all hover:scale-105 ${
                        selectedDepartment === dept.id ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-gray-200'
                      }`}
                    >
                      <div className={`w-10 h-10 ${dept.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                        <span className="text-xl">{dept.icon}</span>
                      </div>
                      <div className="text-2xl font-black text-gray-900">{count}</div>
                      <div className="text-xs font-bold text-gray-500">{dept.label}</div>
                    </button>
                  );
                })}

              </div>

              {/* Talent Grid - From Library */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
                  <h3 className="text-xl font-black">
                    {selectedDepartment === 'all' ? 'All Talents' : selectedDepartment.charAt(0).toUpperCase() + selectedDepartment.slice(1) + ' Team'}
                  </h3>
                  <p className="text-sm opacity-80 font-semibold">
                    {talentLibrary.filter(t =>
                      (selectedDepartment === 'all' || t.department === selectedDepartment) &&
                      (librarySearchQuery === '' ||
                        t.name.toLowerCase().includes(librarySearchQuery.toLowerCase()) ||
                        t.role.toLowerCase().includes(librarySearchQuery.toLowerCase()) ||
                        t.culture?.toLowerCase().includes(librarySearchQuery.toLowerCase()))
                    ).length} members
                  </p>
                </div>
                <div className="p-4">
                  {talentLibrary.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📚</div>
                      <h4 className="text-xl font-black text-gray-700 mb-2">No Talents Yet</h4>
                      <p className="text-gray-500 mb-4">Talents are auto-added when projects are approved or go to production</p>
                      <button
                        onClick={() => setShowAddTalentModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                      >
                        ➕ Add Talent Manually
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {talentLibrary
                        .filter(t =>
                          (selectedDepartment === 'all' || t.department === selectedDepartment) &&
                          (librarySearchQuery === '' ||
                            t.name.toLowerCase().includes(librarySearchQuery.toLowerCase()) ||
                            t.role.toLowerCase().includes(librarySearchQuery.toLowerCase()) ||
                            t.culture?.toLowerCase().includes(librarySearchQuery.toLowerCase()))
                        )
                        .map((talent) => (
                          <div
                            key={talent.id}
                            onClick={() => setSelectedTalent(talent)}
                            className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer group"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-black text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                {talent.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-black text-gray-900 truncate text-lg">{talent.name}</h4>
                                <p className="text-sm text-purple-600 font-bold">{talent.role}</p>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                                    {talent.projects?.length || 0} projects
                                  </span>
                                  <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs font-bold rounded-full">
                                    {talent.culture}
                                  </span>
                                </div>
                                {talent.workLink && (
                                  <div className="mt-2 text-xs text-blue-500 truncate">
                                    🔗 {talent.workLink}
                                  </div>
                                )}
                                {(talent.phone || talent.email) && (
                                  <div className="mt-1 text-xs text-gray-500">
                                    {talent.phone && <span>📱 {talent.phone}</span>}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PROJECTS TAB - Light Pastel Theme like Excel */}
          {activeTab === 'projects' && (() => {
            const filteredProjects = projectsCultureFilter === 'all'
              ? submissions
              : submissions.filter(s => s.culture === projectsCultureFilter);

            // Budget format
            const formatBudget = (amount: number) => {
              if (!amount || amount === 0) return '—';
              const lakhs = amount / 100000;
              if (lakhs >= 100) return `₹${(lakhs / 100).toFixed(2)} Cr`;
              return `₹${lakhs.toFixed(2)} L`;
            };

            const updateProject = (projectId: string | number, field: string, value: string | number) => {
              const updatedSubmissions = submissions.map(s =>
                s.id === projectId ? { ...s, [field]: value } : s
              );
              setSubmissions(updatedSubmissions);
              localStorage.setItem('stage_submissions', JSON.stringify(updatedSubmissions));
            };

            const statusOptions = [
              { value: 'loi_sent', label: 'LOI Sent' },
              { value: 'onboarding_form_sent', label: 'Onboarding Form Sent' },
              { value: 'budget_discussion', label: 'Budget Discussion' },
              { value: 'sent_for_agreement', label: 'Sent for Agreement' },
              { value: 'agreement_done', label: 'Agreement Done' },
              { value: 'insurance_pending', label: 'Insurance Pending' },
              { value: 'insurance_done', label: 'Insurance Done' },
              { value: 'shoot_started', label: 'Shoot Started' },
              { value: 'shoot_completed', label: 'Shoot Completed' },
              { value: 'post_production', label: 'Post Production' },
              { value: 'delivered', label: 'Delivered' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'on_hold', label: 'On Hold' },
            ];

            const allPOCs = [...['Mayank', 'Haidar', 'Sumit'], ...customPOCs];
            const cultureOptions = ['Haryanvi', 'Rajasthani', 'Bhojpuri', 'Gujarati'];
            const formatOptions = ['Feature Film', 'Mini Film', 'Long Series', 'Limited Series', 'Microdrama'];

            // Pastel status colors
            const statusColors: Record<string, string> = {
              'loi_sent': 'bg-blue-100 text-blue-800',
              'onboarding_form_sent': 'bg-indigo-100 text-indigo-800',
              'budget_discussion': 'bg-yellow-100 text-yellow-800',
              'sent_for_agreement': 'bg-orange-100 text-orange-800',
              'agreement_done': 'bg-green-100 text-green-800',
              'insurance_pending': 'bg-red-100 text-red-800',
              'insurance_done': 'bg-teal-100 text-teal-800',
              'shoot_started': 'bg-purple-100 text-purple-800',
              'shoot_completed': 'bg-emerald-100 text-emerald-800',
              'post_production': 'bg-pink-100 text-pink-800',
              'delivered': 'bg-cyan-100 text-cyan-800',
              'approved': 'bg-green-100 text-green-800',
              'rejected': 'bg-red-100 text-red-800',
              'on_hold': 'bg-gray-100 text-gray-800',
              'custom': 'bg-violet-100 text-violet-800',
            };

            // Culture colors
            const cultureColors: Record<string, string> = {
              'Haryanvi': 'bg-amber-100 text-amber-800',
              'Rajasthani': 'bg-orange-100 text-orange-800',
              'Bhojpuri': 'bg-rose-100 text-rose-800',
              'Gujarati': 'bg-emerald-100 text-emerald-800',
            };

            // Format colors
            const formatColors: Record<string, string> = {
              'Feature Film': 'bg-blue-100 text-blue-800',
              'Mini Film': 'bg-purple-100 text-purple-800',
              'Long Series': 'bg-green-100 text-green-800',
              'Limited Series': 'bg-cyan-100 text-cyan-800',
              'Microdrama': 'bg-pink-100 text-pink-800',
            };

            // Delete POC
            const deletePOC = (pocName: string) => {
              const updatedSubmissions = submissions.map(s =>
                s.productionPOC === pocName ? { ...s, productionPOC: '' } : s
              );
              setSubmissions(updatedSubmissions);
              localStorage.setItem('stage_submissions', JSON.stringify(updatedSubmissions));
              if (customPOCs.includes(pocName)) {
                setCustomPOCs(customPOCs.filter(p => p !== pocName));
              }
            };

            // Export function
            const exportData = (format: 'excel' | 'pdf', filterType?: string, filterValue?: string) => {
              let dataToExport = [...submissions];

              if (filterType && filterValue) {
                dataToExport = dataToExport.filter(s => s[filterType] === filterValue);
              }

              const exportRows = dataToExport.map((s, idx) => {
                const budget = parseFloat(s.totalBudget) || 0;
                const overcost = parseFloat(s.overcost) || 0;
                const insurance = parseFloat(s.insurance) || 0;
                const custom = parseFloat(s.customBudget) || 0;
                const total = budget + overcost + insurance + custom;
                return {
                  'S.No': idx + 1,
                  'Project Name': s.projectName || '-',
                  'Creator': s.creatorName || s.creator || '-',
                  'Culture': s.culture || '-',
                  'Format': s.format || '-',
                  'Production POC': s.productionPOC || '-',
                  'Shoot Start Date': s.shootStartDate || '-',
                  'Status': statusOptions.find(o => o.value === s.status)?.label || s.customStatus || s.status || '-',
                  'Budget (L)': (budget / 100000).toFixed(2),
                  'Overcost (L)': (overcost / 100000).toFixed(2),
                  'Insurance (L)': (insurance / 100000).toFixed(2),
                  'Custom (L)': (custom / 100000).toFixed(2),
                  'Total (L)': (total / 100000).toFixed(2),
                };
              });

              if (format === 'excel') {
                const XLSX = require('xlsx');
                const ws = XLSX.utils.json_to_sheet(exportRows);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Projects');
                const fileName = filterType && filterValue
                  ? `STAGE_${filterValue}_Projects.xlsx`
                  : 'STAGE_All_Projects.xlsx';
                XLSX.writeFile(wb, fileName);
              } else if (format === 'pdf') {
                // PDF Export - opens printable HTML in new window
                const grandTotal = dataToExport.reduce((sum, p) => sum + (parseFloat(p.totalBudget) || 0) + (parseFloat(p.overcost) || 0) + (parseFloat(p.insurance) || 0) + (parseFloat(p.customBudget) || 0), 0);
                const filterTitle = filterType && filterValue ? filterValue + ' ' : 'All ';
                const dateStr = new Date().toLocaleDateString('en-IN', { dateStyle: 'full' });
                const rowsHtml = exportRows.map(r =>
                  '<tr><td>' + r['S.No'] + '</td><td>' + r['Project Name'] + '</td><td>' + r['Creator'] + '</td><td>' + r['Culture'] + '</td><td>' + r['Format'] + '</td><td>' + r['Production POC'] + '</td><td>' + r['Status'] + '</td><td class="budget">' + r['Budget (L)'] + '</td><td class="budget">' + r['Overcost (L)'] + '</td><td class="budget">' + r['Insurance (L)'] + '</td><td class="budget total">' + r['Total (L)'] + '</td></tr>'
                ).join('');
                const html = '<!DOCTYPE html><html><head><title>STAGE ' + filterTitle + 'Projects Report</title><style>body{font-family:Arial,sans-serif;padding:20px;color:#333}h1{color:#1e40af;margin-bottom:5px}.subtitle{color:#666;margin-bottom:20px;font-size:14px}table{width:100%;border-collapse:collapse;margin:20px 0;font-size:11px}th{background:#f1f5f9;padding:8px;text-align:left;border:1px solid #e2e8f0;font-weight:600}td{padding:6px 8px;border:1px solid #e2e8f0}tr:nth-child(even){background:#f8fafc}.summary{background:#f0fdf4;padding:15px;border-radius:8px;margin-top:20px}.summary-title{font-weight:bold;color:#166534}.budget{text-align:right;font-weight:500}.total{font-weight:700;color:#166534;background:#f0fdf4}@media print{body{padding:10px}}</style></head><body><h1>STAGE ' + filterTitle + 'Projects Report</h1><p class="subtitle">Generated: ' + dateStr + ' | ' + dataToExport.length + ' Projects</p><table><thead><tr><th>#</th><th>Project</th><th>Creator</th><th>Culture</th><th>Format</th><th>POC</th><th>Status</th><th style="text-align:right">Budget</th><th style="text-align:right">Overcost</th><th style="text-align:right">Insurance</th><th style="text-align:right;background:#f0fdf4">Total</th></tr></thead><tbody>' + rowsHtml + '</tbody></table><div class="summary"><span class="summary-title">Grand Total: </span><span class="budget total">' + formatBudget(grandTotal) + '</span></div><script>window.onload=function(){window.print();}</script></body></html>';
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                  printWindow.document.write(html);
                  printWindow.document.close();
                }
              }
            };

            const totalBudget = filteredProjects.reduce((sum, p) => sum + (parseFloat(p.totalBudget) || 0), 0);

            return (
            <div className="min-h-screen bg-gray-50 -m-6 p-6">
              {/* Header */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">Projects Tracker</h1>
                    <p className="text-gray-500 text-sm">{filteredProjects.length} projects • Total: <span className="text-green-600 font-semibold">{formatBudget(totalBudget)}</span></p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setShowAddPOCModal(true)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700">+ Add POC</button>
                    <button onClick={() => exportData('excel')} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium">📥 Excel</button>
                    <button onClick={() => exportData('pdf')} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium">📄 PDF</button>

                    {/* Export Dropdown */}
                    <div className="relative group">
                      <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium">📊 Export Filter ▼</button>
                      <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-200 py-2 w-64 hidden group-hover:block z-50 max-h-96 overflow-y-auto">
                        <p className="px-4 py-1 text-xs text-gray-400 uppercase font-semibold">By Culture</p>
                        {cultureOptions.map(c => (
                          <div key={c} className="flex">
                            <button onClick={() => exportData('excel', 'culture', c)} className="flex-1 px-4 py-2 text-left text-sm hover:bg-green-50 text-gray-700">📥 {c}</button>
                            <button onClick={() => exportData('pdf', 'culture', c)} className="px-3 py-2 text-sm hover:bg-red-50 text-red-600">PDF</button>
                          </div>
                        ))}
                        <hr className="my-2" />
                        <p className="px-4 py-1 text-xs text-gray-400 uppercase font-semibold">By Format</p>
                        {formatOptions.map(f => (
                          <div key={f} className="flex">
                            <button onClick={() => exportData('excel', 'format', f)} className="flex-1 px-4 py-2 text-left text-sm hover:bg-green-50 text-gray-700">📥 {f}</button>
                            <button onClick={() => exportData('pdf', 'format', f)} className="px-3 py-2 text-sm hover:bg-red-50 text-red-600">PDF</button>
                          </div>
                        ))}
                        <hr className="my-2" />
                        <p className="px-4 py-1 text-xs text-gray-400 uppercase font-semibold">By POC</p>
                        {allPOCs.map(p => (
                          <div key={p} className="flex">
                            <button onClick={() => exportData('excel', 'productionPOC', p)} className="flex-1 px-4 py-2 text-left text-sm hover:bg-green-50 text-gray-700">📥 {p}</button>
                            <button onClick={() => exportData('pdf', 'productionPOC', p)} className="px-3 py-2 text-sm hover:bg-red-50 text-red-600">PDF</button>
                          </div>
                        ))}
                        <hr className="my-2" />
                        <p className="px-4 py-1 text-xs text-gray-400 uppercase font-semibold">By Status</p>
                        {statusOptions.slice(0, 6).map(s => (
                          <div key={s.value} className="flex">
                            <button onClick={() => exportData('excel', 'status', s.value)} className="flex-1 px-4 py-2 text-left text-sm hover:bg-green-50 text-gray-700">📥 {s.label}</button>
                            <button onClick={() => exportData('pdf', 'status', s.value)} className="px-3 py-2 text-sm hover:bg-red-50 text-red-600">PDF</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Culture Filter Pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setProjectsCultureFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    projectsCultureFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >All ({submissions.length})</button>
                {cultureOptions.map(culture => {
                  const count = submissions.filter(s => s.culture === culture).length;
                  return (
                    <button
                      key={culture}
                      onClick={() => setProjectsCultureFilter(culture)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        projectsCultureFilter === culture
                          ? cultureColors[culture]?.replace('100', '500').replace('800', 'white') + ' text-white'
                          : `${cultureColors[culture]} border border-gray-200 hover:shadow-sm`
                      }`}
                    >{culture} ({count})</button>
                  );
                })}
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-3 py-3 text-left text-gray-600 text-xs font-semibold uppercase w-12">#</th>
                      <th className="px-3 py-3 text-left text-gray-600 text-xs font-semibold uppercase min-w-[180px]">Project</th>
                      <th className="px-3 py-3 text-left text-gray-600 text-xs font-semibold uppercase min-w-[140px]">Creator</th>
                      <th className="px-3 py-3 text-left text-gray-600 text-xs font-semibold uppercase min-w-[100px]">Culture</th>
                      <th className="px-3 py-3 text-left text-gray-600 text-xs font-semibold uppercase min-w-[120px]">Format</th>
                      <th className="px-3 py-3 text-left text-gray-600 text-xs font-semibold uppercase min-w-[120px]">POC</th>
                      <th className="px-3 py-3 text-left text-gray-600 text-xs font-semibold uppercase min-w-[130px]">Shoot Start</th>
                      <th className="px-3 py-3 text-left text-gray-600 text-xs font-semibold uppercase min-w-[160px]">Status</th>
                      <th className="px-3 py-3 text-right text-gray-600 text-xs font-semibold uppercase min-w-[90px]">Budget</th>
                      <th className="px-3 py-3 text-right text-gray-600 text-xs font-semibold uppercase min-w-[90px]">Overcost</th>
                      <th className="px-3 py-3 text-right text-gray-600 text-xs font-semibold uppercase min-w-[90px]">Insurance</th>
                      <th className="px-3 py-3 text-right text-gray-600 text-xs font-semibold uppercase min-w-[90px]">Custom</th>
                      <th className="px-3 py-3 text-right text-gray-600 text-xs font-semibold uppercase min-w-[100px] bg-green-50">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {filteredProjects.map((project, index) => (
                        <tr key={project.id} className="hover:bg-blue-50/50 transition-colors">
                          {/* # */}
                          <td className="px-3 py-3 text-gray-500 text-sm font-medium">{index + 1}</td>

                          {/* Project */}
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={project.projectName || ''}
                              onChange={(e) => updateProject(project.id, 'projectName', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm font-semibold bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                              placeholder="Project name..."
                            />
                          </td>

                          {/* Creator */}
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={project.creatorName || project.creator || ''}
                              onChange={(e) => updateProject(project.id, 'creatorName', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                              placeholder="Creator..."
                            />
                          </td>

                          {/* Culture - Colored Badge */}
                          <td className="px-3 py-2">
                            <select
                              value={project.culture || ''}
                              onChange={(e) => updateProject(project.id, 'culture', e.target.value)}
                              className={`w-full px-2 py-1.5 text-xs font-semibold rounded-full cursor-pointer focus:outline-none ${cultureColors[project.culture] || 'bg-gray-100 text-gray-600'}`}
                            >
                              <option value="">Select</option>
                              {cultureOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </td>

                          {/* Format - Colored Badge */}
                          <td className="px-3 py-2">
                            <select
                              value={project.format || ''}
                              onChange={(e) => updateProject(project.id, 'format', e.target.value)}
                              className={`w-full px-2 py-1.5 text-xs font-semibold rounded-full cursor-pointer focus:outline-none ${formatColors[project.format] || 'bg-gray-100 text-gray-600'}`}
                            >
                              <option value="">Select</option>
                              {formatOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </td>

                          {/* POC */}
                          <td className="px-3 py-2">
                            <select
                              value={project.productionPOC || ''}
                              onChange={(e) => updateProject(project.id, 'productionPOC', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-200"
                            >
                              <option value="">Assign</option>
                              {allPOCs.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </td>

                          {/* Shoot Start Date Only */}
                          <td className="px-3 py-2">
                            <input
                              type="date"
                              value={project.shootStartDate || ''}
                              onChange={(e) => updateProject(project.id, 'shootStartDate', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                          </td>

                          {/* Status with Custom Option */}
                          <td className="px-3 py-2">
                            {project.status === 'custom' ? (
                              <input
                                type="text"
                                value={project.customStatus || ''}
                                onChange={(e) => updateProject(project.id, 'customStatus', e.target.value)}
                                placeholder="Enter status..."
                                className="w-full px-2 py-1.5 text-xs font-semibold bg-violet-100 text-violet-800 rounded-full focus:outline-none"
                              />
                            ) : (
                              <select
                                value={project.status || ''}
                                onChange={(e) => updateProject(project.id, 'status', e.target.value)}
                                className={`w-full px-2 py-1.5 text-xs font-semibold rounded-full cursor-pointer focus:outline-none ${statusColors[project.status] || 'bg-gray-100 text-gray-600'}`}
                              >
                                <option value="">Select</option>
                                {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                <option value="custom">+ Custom Status</option>
                              </select>
                            )}
                          </td>

                          {/* Budget */}
                          <td className="px-3 py-2">
                            <div className="flex items-center justify-end gap-1">
                              <input
                                type="number"
                                value={project.totalBudget ? Math.round(parseFloat(project.totalBudget) / 100000) : ''}
                                onChange={(e) => {
                                  const lakhs = parseFloat(e.target.value) || 0;
                                  updateProject(project.id, 'totalBudget', String(lakhs * 100000));
                                }}
                                className="w-16 px-2 py-1.5 text-sm font-semibold text-right bg-blue-50 border border-blue-200 rounded-lg text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                placeholder="0"
                              />
                              <span className="text-gray-400 text-xs">L</span>
                            </div>
                          </td>

                          {/* Overcost */}
                          <td className="px-3 py-2">
                            <div className="flex items-center justify-end gap-1">
                              <input
                                type="number"
                                value={project.overcost ? Math.round(parseFloat(project.overcost) / 100000) : ''}
                                onChange={(e) => {
                                  const lakhs = parseFloat(e.target.value) || 0;
                                  updateProject(project.id, 'overcost', String(lakhs * 100000));
                                }}
                                className="w-16 px-2 py-1.5 text-sm font-semibold text-right bg-orange-50 border border-orange-200 rounded-lg text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
                                placeholder="0"
                              />
                              <span className="text-gray-400 text-xs">L</span>
                            </div>
                          </td>

                          {/* Insurance */}
                          <td className="px-3 py-2">
                            <div className="flex items-center justify-end gap-1">
                              <input
                                type="number"
                                value={project.insurance ? Math.round(parseFloat(project.insurance) / 100000) : ''}
                                onChange={(e) => {
                                  const lakhs = parseFloat(e.target.value) || 0;
                                  updateProject(project.id, 'insurance', String(lakhs * 100000));
                                }}
                                className="w-16 px-2 py-1.5 text-sm font-semibold text-right bg-purple-50 border border-purple-200 rounded-lg text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                placeholder="0"
                              />
                              <span className="text-gray-400 text-xs">L</span>
                            </div>
                          </td>

                          {/* Custom Budget */}
                          <td className="px-3 py-2">
                            <div className="flex items-center justify-end gap-1">
                              <input
                                type="number"
                                value={project.customBudget ? Math.round(parseFloat(project.customBudget) / 100000) : ''}
                                onChange={(e) => {
                                  const lakhs = parseFloat(e.target.value) || 0;
                                  updateProject(project.id, 'customBudget', String(lakhs * 100000));
                                }}
                                className="w-16 px-2 py-1.5 text-sm font-semibold text-right bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                placeholder="0"
                              />
                              <span className="text-gray-400 text-xs">L</span>
                            </div>
                          </td>

                          {/* Total Budget */}
                          <td className="px-3 py-2 bg-green-50">
                            <div className="text-right">
                              <span className="text-lg font-bold text-green-700">
                                {formatBudget(
                                  (parseFloat(project.totalBudget) || 0) +
                                  (parseFloat(project.overcost) || 0) +
                                  (parseFloat(project.insurance) || 0) +
                                  (parseFloat(project.customBudget) || 0)
                                )}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Footer */}
                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-gray-500 text-sm">{filteredProjects.length} projects • Click to edit any field</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-blue-600">Budget: {formatBudget(filteredProjects.reduce((sum, p) => sum + (parseFloat(p.totalBudget) || 0), 0))}</span>
                      <span className="text-orange-600">Overcost: {formatBudget(filteredProjects.reduce((sum, p) => sum + (parseFloat(p.overcost) || 0), 0))}</span>
                      <span className="text-purple-600">Insurance: {formatBudget(filteredProjects.reduce((sum, p) => sum + (parseFloat(p.insurance) || 0), 0))}</span>
                      <span className="text-green-700 font-bold text-lg">Grand Total: {formatBudget(
                        filteredProjects.reduce((sum, p) => sum +
                          (parseFloat(p.totalBudget) || 0) +
                          (parseFloat(p.overcost) || 0) +
                          (parseFloat(p.insurance) || 0) +
                          (parseFloat(p.customBudget) || 0), 0)
                      )}</span>
                    </div>
                  </div>
                </div>

              {/* POC Tracker - Dark Theme */}
              <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Team Overview</h2>
                    <p className="text-sm text-slate-400">POC assignments with culture & format breakdown</p>
                  </div>
                  <button
                    onClick={() => setShowAddPOCModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold text-white transition-all"
                  >
                    + Add POC
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allPOCs.map((poc, pocIndex) => {
                    const pocProjects = submissions.filter(s => s.productionPOC === poc);
                    const bgColors = ['bg-blue-500/20 border-blue-500/40', 'bg-purple-500/20 border-purple-500/40', 'bg-teal-500/20 border-teal-500/40', 'bg-amber-500/20 border-amber-500/40', 'bg-rose-500/20 border-rose-500/40'];
                    const textColors = ['text-blue-400', 'text-purple-400', 'text-teal-400', 'text-amber-400', 'text-rose-400'];
                    const bgColor = bgColors[pocIndex % bgColors.length];
                    const textColor = textColors[pocIndex % textColors.length];
                    const pocBudget = pocProjects.reduce((sum, p) => sum + (parseFloat(p.totalBudget) || 0), 0);

                    return (
                      <div
                        key={poc}
                        onClick={() => setSelectedPOC(selectedPOC === poc ? null : poc)}
                        className={`${bgColor} border rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all ${selectedPOC === poc ? 'ring-2 ring-blue-400' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${textColor} bg-slate-800 flex items-center justify-center text-lg font-bold`}>
                              {poc.charAt(0)}
                            </div>
                            <div>
                              <h3 className={`font-bold ${textColor}`}>{poc}</h3>
                              <p className="text-xs text-slate-500">Production POC</p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Remove ${poc}? ${pocProjects.length} projects will be unassigned.`)) {
                                deletePOC(poc);
                              }
                            }}
                            className="w-6 h-6 bg-red-500/20 hover:bg-red-500 rounded flex items-center justify-center text-red-400 hover:text-white transition-all text-sm"
                          >×</button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                            <div className={`text-2xl font-bold ${textColor}`}>{pocProjects.length}</div>
                            <div className="text-xs text-slate-500">Projects</div>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                            <div className="text-lg font-bold text-emerald-400">{formatBudget(pocBudget)}</div>
                            <div className="text-xs text-slate-500">Budget</div>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-700 grid grid-cols-2 gap-1 text-xs">
                          {cultureOptions.map(c => (
                            <div key={c} className="flex justify-between px-2 py-1 bg-slate-800/50 rounded">
                              <span className="text-slate-400">{c}</span>
                              <span className="font-semibold text-white">{pocProjects.filter(p => p.culture === c).length}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* POC Detail Panel - Dark */}
              {selectedPOC && (() => {
                const pocProjects = submissions.filter(s => s.productionPOC === selectedPOC);
                const pocBudget = pocProjects.reduce((sum, p) => sum + (parseFloat(p.totalBudget) || 0), 0);
                return (
                  <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{selectedPOC}'s Projects</h3>
                        <p className="text-sm text-slate-400">{pocProjects.length} projects • {formatBudget(pocBudget)} total</p>
                      </div>
                      <button onClick={() => setSelectedPOC(null)} className="text-slate-500 hover:text-white text-2xl">×</button>
                    </div>

                    {/* Matrix */}
                    <div className="overflow-x-auto mb-4 bg-slate-800/50 rounded-xl p-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left py-2 px-3 text-slate-400 font-medium">Culture</th>
                            {formatOptions.map(f => <th key={f} className="text-center py-2 px-2 text-slate-400 font-medium text-xs">{f}</th>)}
                            <th className="text-right py-2 px-3 text-slate-400 font-medium">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cultureOptions.map(c => (
                            <tr key={c} className="border-b border-slate-800">
                              <td className="py-2 px-3 font-medium text-white">{c}</td>
                              {formatOptions.map(f => {
                                const cnt = pocProjects.filter(p => p.culture === c && p.format === f).length;
                                return <td key={f} className="text-center py-2 px-2">{cnt > 0 ? <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-xs font-semibold">{cnt}</span> : <span className="text-slate-600">—</span>}</td>;
                              })}
                              <td className="text-right py-2 px-3 font-bold text-white">{pocProjects.filter(p => p.culture === c).length}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* List */}
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {pocProjects.map((p, i) => (
                        <div key={p.id} className="bg-slate-800/50 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-slate-500 font-medium">{i + 1}.</span>
                            <div>
                              <div className="font-semibold text-white">{p.projectName || 'Untitled'}</div>
                              <div className="text-xs text-slate-400">{p.culture} • {p.format}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-emerald-400 font-semibold">{formatBudget(parseFloat(p.totalBudget) || 0)}</div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[p.status] || 'bg-slate-700 text-slate-300'}`}>
                              {statusOptions.find(o => o.value === p.status)?.label || p.status || 'N/A'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Add POC Modal - Dark */}
              {showAddPOCModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowAddPOCModal(false)}>
                  <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-700 p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                    <h3 className="text-xl font-bold text-white mb-4">Add Team Member</h3>
                    <input
                      type="text"
                      value={newPOCName}
                      onChange={(e) => setNewPOCName(e.target.value)}
                      placeholder="Enter name..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                      autoFocus
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowAddPOCModal(false)}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                      >Cancel</button>
                      <button
                        onClick={() => {
                          if (newPOCName.trim() && !allPOCs.includes(newPOCName.trim())) {
                            setCustomPOCs([...customPOCs, newPOCName.trim()]);
                            setNewPOCName('');
                            setShowAddPOCModal(false);
                          }
                        }}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
                      >Add POC</button>
                    </div>
                  </div>
                </div>
              )}

            </div>
            );
          })()}
        </div>

        {/* Add Talent Modal */}
        {showAddTalentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-5 rounded-t-2xl">
                <h3 className="text-2xl font-black">➕ Add New Talent</h3>
                <p className="text-sm opacity-80">Add crew/cast member to library</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={newTalent.name}
                    onChange={(e) => setNewTalent({...newTalent, name: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                    placeholder="Full Name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Role *</label>
                    <input
                      type="text"
                      value={newTalent.role}
                      onChange={(e) => setNewTalent({...newTalent, role: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="Director, DOP, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                    <select
                      value={newTalent.department}
                      onChange={(e) => setNewTalent({...newTalent, department: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                    >
                      <option value="direction">Direction</option>
                      <option value="production">Production</option>
                      <option value="writing">Writing</option>
                      <option value="camera">Camera</option>
                      <option value="editing">Editing</option>
                      <option value="sound">Sound</option>
                      <option value="music">Music</option>
                      <option value="art">Art</option>
                      <option value="costume">Costume & Makeup</option>
                      <option value="vfx">VFX</option>
                      <option value="cast">Cast</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={newTalent.phone}
                      onChange={(e) => setNewTalent({...newTalent, phone: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={newTalent.email}
                      onChange={(e) => setNewTalent({...newTalent, email: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Work Link / Portfolio</label>
                  <input
                    type="url"
                    value={newTalent.workLink}
                    onChange={(e) => setNewTalent({...newTalent, workLink: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                    placeholder="https://portfolio.com or YouTube link"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Culture</label>
                  <select
                    value={newTalent.culture}
                    onChange={(e) => setNewTalent({...newTalent, culture: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Haryanvi">Haryanvi</option>
                    <option value="Rajasthani">Rajasthani</option>
                    <option value="Bhojpuri">Bhojpuri</option>
                    <option value="Gujarati">Gujarati</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newTalent.notes}
                    onChange={(e) => setNewTalent({...newTalent, notes: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                    rows={2}
                    placeholder="Any additional notes..."
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddTalentModal(false)}
                    className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddTalent}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-black rounded-xl transition-all"
                  >
                    Add Talent
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Talent Detail Modal */}
        {selectedTalent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl font-black">
                    {selectedTalent.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">{selectedTalent.name}</h3>
                    <p className="text-lg opacity-90 font-semibold">{selectedTalent.role}</p>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-bold mt-1 inline-block">
                      {selectedTalent.department}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {/* Contact Info */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="font-bold text-gray-700 mb-3">📞 Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">📱 Phone:</span>
                      <input
                        type="text"
                        value={selectedTalent.phone || ''}
                        onChange={(e) => handleUpdateTalent({...selectedTalent, phone: e.target.value})}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                        placeholder="Add phone..."
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">📧 Email:</span>
                      <input
                        type="email"
                        value={selectedTalent.email || ''}
                        onChange={(e) => handleUpdateTalent({...selectedTalent, email: e.target.value})}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                        placeholder="Add email..."
                      />
                    </div>
                  </div>
                </div>

                {/* Work Link */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="font-bold text-gray-700 mb-3">🔗 Work Link / Portfolio</h4>
                  <input
                    type="url"
                    value={selectedTalent.workLink || ''}
                    onChange={(e) => handleUpdateTalent({...selectedTalent, workLink: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="https://portfolio.com or demo reel link"
                  />
                  {selectedTalent.workLink && (
                    <a
                      href={selectedTalent.workLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-blue-500 text-sm hover:underline"
                    >
                      🔗 Open Link →
                    </a>
                  )}
                </div>

                {/* Culture */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="font-bold text-gray-700 mb-3">🎭 Culture</h4>
                  <span className="px-4 py-2 bg-purple-100 text-purple-700 font-bold rounded-full">
                    {selectedTalent.culture}
                  </span>
                </div>

                {/* STAGE Projects */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="font-bold text-gray-700 mb-3">🎬 STAGE Projects</h4>
                  {selectedTalent.projects && selectedTalent.projects.length > 0 ? (
                    <div className="space-y-2">
                      {selectedTalent.projects.map((proj: any, i: number) => (
                        <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                          <span className="font-semibold text-gray-800">{proj.name || proj}</span>
                          {proj.status && (
                            <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                              proj.status === 'approved' ? 'bg-green-100 text-green-700' :
                              proj.status === 'in-production' ? 'bg-purple-100 text-purple-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {proj.status}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No STAGE projects yet</p>
                  )}
                </div>

                {/* Notes */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="font-bold text-gray-700 mb-3">📝 Notes</h4>
                  <textarea
                    value={selectedTalent.notes || ''}
                    onChange={(e) => handleUpdateTalent({...selectedTalent, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                    rows={3}
                    placeholder="Add notes about this talent..."
                  />
                </div>

                {/* Added Info */}
                <div className="text-xs text-gray-400 text-center">
                  Added from: {selectedTalent.addedFrom || 'Manual'} • {selectedTalent.addedAt ? new Date(selectedTalent.addedAt).toLocaleDateString() : ''}
                </div>

                {/* Share & Download Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  {/* Share Button */}
                  <div className="relative">
                    <button
                      onClick={() => { setShowTalentShareMenu(!showTalentShareMenu); setShowTalentDownloadMenu(false); }}
                      className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-lg transition-all flex items-center gap-2 text-sm"
                    >
                      <span>↗</span> Share
                    </button>
                    {showTalentShareMenu && (
                      <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 min-w-[160px] z-50">
                        <button onClick={() => shareTalentProfile(selectedTalent, 'whatsapp')} className="w-full px-4 py-2 text-left hover:bg-green-50 text-gray-700 font-semibold text-sm flex items-center gap-2">
                          <span className="text-green-500">💬</span> WhatsApp
                        </button>
                        <button onClick={() => shareTalentProfile(selectedTalent, 'twitter')} className="w-full px-4 py-2 text-left hover:bg-blue-50 text-gray-700 font-semibold text-sm flex items-center gap-2">
                          <span className="text-blue-400">𝕏</span> Twitter
                        </button>
                        <button onClick={() => shareTalentProfile(selectedTalent, 'linkedin')} className="w-full px-4 py-2 text-left hover:bg-blue-50 text-gray-700 font-semibold text-sm flex items-center gap-2">
                          <span className="text-blue-600">in</span> LinkedIn
                        </button>
                        <button onClick={() => shareTalentProfile(selectedTalent, 'email')} className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700 font-semibold text-sm flex items-center gap-2">
                          <span>📧</span> Email
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button onClick={() => shareTalentProfile(selectedTalent, 'copy')} className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700 font-semibold text-sm flex items-center gap-2">
                          <span>📋</span> Copy
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Download Button */}
                  <div className="relative">
                    <button
                      onClick={() => { setShowTalentDownloadMenu(!showTalentDownloadMenu); setShowTalentShareMenu(false); }}
                      className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg transition-all flex items-center gap-2 text-sm"
                    >
                      <span>↓</span> Download
                    </button>
                    {showTalentDownloadMenu && (
                      <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 min-w-[160px] z-50">
                        <button onClick={() => downloadTalentProfile(selectedTalent, 'pdf')} className="w-full px-4 py-2 text-left hover:bg-red-50 text-gray-700 font-semibold text-sm flex items-center gap-2">
                          <span className="text-red-500">📄</span> PDF Profile
                        </button>
                        <button onClick={() => downloadTalentProfile(selectedTalent, 'vcard')} className="w-full px-4 py-2 text-left hover:bg-blue-50 text-gray-700 font-semibold text-sm flex items-center gap-2">
                          <span className="text-blue-500">👤</span> vCard (.vcf)
                        </button>
                        <button onClick={() => downloadTalentProfile(selectedTalent, 'json')} className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700 font-semibold text-sm flex items-center gap-2">
                          <span className="text-gray-500">{ }</span> JSON Data
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Spacer */}
                  <div className="flex-1"></div>

                  {/* Close Button */}
                  <button
                    onClick={() => { setSelectedTalent(null); setShowTalentShareMenu(false); setShowTalentDownloadMenu(false); }}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-lg transition-all text-sm"
                  >
                    Close
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteTalent(selectedTalent.id)}
                    className="px-4 py-2.5 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-lg transition-all text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-red-500 rounded-2xl shadow-2xl p-6 max-w-md w-full">
              <div className="text-center">
                <div className="text-6xl mb-4">🗑️</div>
                <h3 className="text-2xl font-black text-white mb-2">Delete this project?</h3>
                <p className="text-gray-300 font-semibold mb-6">
                  This action cannot be undone. All project data will be permanently deleted.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      handleDeleteProject(showDeleteConfirm);
                      setShowDeleteConfirm(null);
                    }}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Change Modal */}
        {showStatusMenu && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-blue-500 rounded-2xl shadow-2xl p-6 max-w-md w-full my-4 max-h-[90vh] overflow-y-auto">
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">🔄</div>
                <h3 className="text-xl font-black text-white mb-1">Change Project Status</h3>
                <p className="text-gray-400 text-sm font-semibold">
                  Select a new status for this project
                </p>
              </div>
              {/* Status Flow: Pending → Under Review → Approved → Agreement Signed → In Production */}
              <div className="text-[10px] text-gray-500 mb-3 flex items-center gap-1 flex-wrap justify-center">
                <span className="font-bold">Workflow:</span>
                <span className="px-1.5 py-0.5 bg-yellow-500/20 rounded text-yellow-400">Pending</span>
                <span>→</span>
                <span className="px-1.5 py-0.5 bg-blue-500/20 rounded text-blue-400">Review</span>
                <span>→</span>
                <span className="px-1.5 py-0.5 bg-green-500/20 rounded text-green-400">Approved</span>
                <span>→</span>
                <span className="px-1.5 py-0.5 bg-cyan-500/20 rounded text-cyan-400">Agreement</span>
                <span>→</span>
                <span className="px-1.5 py-0.5 bg-purple-500/20 rounded text-purple-400">Production</span>
              </div>
              <div className="space-y-2 mb-4">
                {[
                  { value: 'pending', label: 'Pending Review', icon: '⏳', color: 'bg-yellow-500/20 border-yellow-500 text-yellow-300', step: 1 },
                  { value: 'under-review', label: 'Under Review', icon: '👁️', color: 'bg-blue-500/20 border-blue-500 text-blue-300', step: 2 },
                  { value: 'approved', label: 'Approved', icon: '✅', color: 'bg-green-500/20 border-green-500 text-green-300', step: 3 },
                  { value: 'agreement-signed', label: 'Agreement Signed', icon: '📄', color: 'bg-cyan-500/20 border-cyan-500 text-cyan-300', step: 4 },
                  { value: 'in-production', label: 'In Production', icon: '🎬', color: 'bg-purple-500/20 border-purple-500 text-purple-300', step: 5 },
                  { value: 'revision-requested', label: 'Revision Needed', icon: '📝', color: 'bg-orange-500/20 border-orange-500 text-orange-300', step: 0 },
                  { value: 'on-hold', label: 'On Hold', icon: '⏸️', color: 'bg-gray-500/20 border-gray-500 text-gray-300', step: 0 },
                  { value: 'scrapped', label: 'Scrapped', icon: '🗑️', color: 'bg-red-500/20 border-red-500 text-red-300', step: 0 },
                ].map((status) => {
                  const currentSubmission = submissions.find(s => s.id === showStatusMenu);
                  const isCurrentStatus = currentSubmission?.status === status.value;
                  return (
                    <button
                      key={status.value}
                      onClick={() => {
                        handleStatusChange(showStatusMenu, status.value);
                        setShowStatusMenu(null);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg border-2 font-bold flex items-center gap-2 transition-all hover:scale-[1.01] text-sm ${
                        isCurrentStatus
                          ? 'bg-white/20 border-white text-white'
                          : `${status.color} hover:bg-white/10`
                      }`}
                    >
                      <span className="text-lg">{status.icon}</span>
                      <span className="flex-1">{status.label}</span>
                      {isCurrentStatus && (
                        <span className="text-green-400 font-black text-xs">✓ Current</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setShowStatusMenu(null)}
                className="w-full py-2.5 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-all text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

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
                  <button onClick={() => { setSelectedSubmission(null); setDetailView('project'); }} className="text-gray-400 hover:text-white text-2xl font-bold transition-colors">×</button>
                </div>

                {/* Tabs - Like Creator Onboarding Steps */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
                  {[
                    { id: 'project', icon: '📋', label: 'Project' },
                    { id: 'creator', icon: '👤', label: 'Creator' },
                    { id: 'budget', icon: '💰', label: 'Budget' },
                    { id: 'timeline', icon: '📅', label: 'Timeline' },
                    { id: 'crew', icon: '🎬', label: 'Crew' },
                    { id: 'cast', icon: '⭐', label: 'Cast' },
                    { id: 'technical', icon: '📹', label: 'Technical' },
                    { id: 'cashflow', icon: '💳', label: 'Cash Flow' },
                    { id: 'documents', icon: '📁', label: 'Documents' },
                    { id: 'missing', icon: '⚠️', label: 'Missing' },
                    { id: 'sop', icon: '💬', label: 'SOP Comments', badge: selectedSubmission?.sopComments?.length || 0 },
                    { id: 'agreement', icon: '📝', label: 'Agreement' },
                    { id: 'activity', icon: '📋', label: 'Activity Log' },
                  ].map((tab: any, index) => (
                    <button
                      key={tab.id}
                      onClick={() => setDetailView(tab.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                        detailView === tab.id
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg scale-105'
                          : tab.id === 'sop' && tab.badge > 0
                            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/50 hover:text-blue-300'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 hover:text-white'
                      }`}
                    >
                      <span className="text-sm">{tab.icon}</span>
                      <span>{tab.label}</span>
                      {tab.badge > 0 && (
                        <span className={`ml-1 px-1.5 py-0.5 text-xs font-black rounded-full ${
                          detailView === tab.id ? 'bg-white text-red-500' : 'bg-blue-500 text-white'
                        }`}>
                          {tab.badge}
                        </span>
                      )}
                      {detailView === tab.id && !tab.badge && <span className="ml-1 w-2 h-2 bg-white rounded-full animate-pulse"></span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                {/* Project Tab */}
                {detailView === 'project' && (
                  <div className="space-y-4">
                    {/* Download Options */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 flex items-center justify-between border border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📋</span>
                        <div>
                          <h3 className="text-white font-black">Project Details</h3>
                          <p className="text-gray-400 text-sm font-semibold">Download project information</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => exportTabToExcel(selectedSubmission, 'project')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition-all flex items-center gap-2"
                        >
                          <span>📊</span> Excel
                        </button>
                        <button
                          onClick={() => exportTabToPDF(selectedSubmission, 'project')}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-all flex items-center gap-2"
                        >
                          <span>📄</span> PDF
                        </button>
                      </div>
                    </div>

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

                    {/* Quick Navigation Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <button
                        onClick={() => setDetailView('timeline')}
                        className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-4 border-2 border-cyan-200 hover:shadow-lg transition-all text-left"
                      >
                        <div className="text-2xl mb-2">📅</div>
                        <div className="text-sm font-black text-gray-900">Timeline</div>
                        <div className="text-xs text-cyan-700 font-semibold">{selectedSubmission.shootDays || 0} Shoot Days</div>
                      </button>
                      <button
                        onClick={() => setDetailView('crew')}
                        className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-4 border-2 border-indigo-200 hover:shadow-lg transition-all text-left"
                      >
                        <div className="text-2xl mb-2">🎬</div>
                        <div className="text-sm font-black text-gray-900">Crew</div>
                        <div className="text-xs text-indigo-700 font-semibold">{[selectedSubmission.director, selectedSubmission.dop, selectedSubmission.editor].filter(Boolean).length}+ Members</div>
                      </button>
                      <button
                        onClick={() => setDetailView('cast')}
                        className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 border-2 border-pink-200 hover:shadow-lg transition-all text-left"
                      >
                        <div className="text-2xl mb-2">⭐</div>
                        <div className="text-sm font-black text-gray-900">Cast</div>
                        <div className="text-xs text-pink-700 font-semibold">{selectedSubmission.castData?.primaryCast?.length || 0} Primary</div>
                      </button>
                      <button
                        onClick={() => setDetailView('cashflow')}
                        className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border-2 border-emerald-200 hover:shadow-lg transition-all text-left"
                      >
                        <div className="text-2xl mb-2">💳</div>
                        <div className="text-sm font-black text-gray-900">Cash Flow</div>
                        <div className="text-xs text-emerald-700 font-semibold">{selectedSubmission.cashFlowTranches?.length || 0} Tranches</div>
                      </button>
                    </div>

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
                    {/* Download Options */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 flex items-center justify-between border border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💰</span>
                        <div>
                          <h3 className="text-white font-black">Budget Details</h3>
                          <p className="text-gray-400 text-sm font-semibold">Download budget breakdown</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => exportTabToExcel(selectedSubmission, 'budget')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition-all flex items-center gap-2"
                        >
                          <span>📊</span> Excel
                        </button>
                        <button
                          onClick={() => exportTabToPDF(selectedSubmission, 'budget')}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-all flex items-center gap-2"
                        >
                          <span>📄</span> PDF
                        </button>
                      </div>
                    </div>

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

                    {/* Budget Breakdown Summary */}
                    <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-lg">
                      <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">📋</span>
                        <span>Budget Breakdown Summary</span>
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Production Cost */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">🎬</span>
                            <span className="text-sm font-bold text-blue-800">Production Cost</span>
                          </div>
                          <div className="text-xl font-black text-blue-900">
                            ₹{(selectedSubmission.budgetCategories?.reduce((sum: number, cat: any) => sum + (cat.amount || 0), 0) || 0).toLocaleString('en-IN')}
                          </div>
                        </div>

                        {/* Creator Margin */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">💼</span>
                            <span className="text-sm font-bold text-purple-800">Creator Margin</span>
                          </div>
                          <div className="text-xl font-black text-purple-900">
                            ₹{(selectedSubmission.budgetCreatorMargin || 0).toLocaleString('en-IN')}
                          </div>
                          <div className="text-xs text-purple-600 font-semibold">
                            {selectedSubmission.budgetCreatorMarginPercent || 0}% of Production
                          </div>
                        </div>

                        {/* Insurance */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">🛡️</span>
                            <span className="text-sm font-bold text-amber-800">Insurance</span>
                          </div>
                          <div className="text-xl font-black text-amber-900">
                            ₹{(selectedSubmission.budgetInsuranceAmount || 0).toLocaleString('en-IN')}
                          </div>
                        </div>

                        {/* Celebrity Fees */}
                        <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-xl p-4 border-2 border-rose-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">⭐</span>
                            <span className="text-sm font-bold text-rose-800">Celebrity Fees</span>
                          </div>
                          <div className="text-xl font-black text-rose-900">
                            ₹{(selectedSubmission.budgetCelebrityFees?.reduce((sum: number, c: any) => sum + (c.amount || 0), 0) || 0).toLocaleString('en-IN')}
                          </div>
                          {selectedSubmission.budgetCelebrityFees?.length > 0 && (
                            <div className="text-xs text-rose-600 font-semibold">
                              {selectedSubmission.budgetCelebrityFees.length} celebrities
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Celebrity Details - if any */}
                      {selectedSubmission.budgetCelebrityFees && selectedSubmission.budgetCelebrityFees.length > 0 && (
                        <div className="mt-4 p-4 bg-rose-50 rounded-xl border-2 border-rose-200">
                          <div className="text-sm font-bold text-rose-800 mb-2">⭐ Celebrity Breakdown</div>
                          <div className="space-y-2">
                            {selectedSubmission.budgetCelebrityFees.map((celeb: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center bg-white rounded-lg p-2 border border-rose-100">
                                <span className="font-semibold text-gray-800">{celeb.name || `Celebrity ${idx + 1}`}</span>
                                <span className="font-bold text-rose-700">₹{(celeb.amount || 0).toLocaleString('en-IN')}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Department-wise Budget Breakdown */}
                    <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-lg">
                      <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">📊</span>
                        <span>Department-wise Budget Allocation</span>
                      </h3>
                      <div className="space-y-3">
                        {selectedSubmission.budgetCategories && selectedSubmission.budgetCategories.length > 0 ? (
                          selectedSubmission.budgetCategories.map((category: any, index: number) => {
                            const isExpanded = expandedDepartment === category.id;
                            const categoryAmount = category.amount || 0;
                            const categoryPercentage = category.yourPercentage || 0;
                            const hasItems = category.items && category.items.length > 0;
                            const filledItems = hasItems ? category.items.filter((item: any) => item.total > 0 || item.description) : [];

                            return (
                              <div key={index} className="border-2 border-blue-200 rounded-xl overflow-hidden">
                                {/* Category Header - Clickable */}
                                <div
                                  className={`bg-gradient-to-r from-blue-50 to-indigo-50 p-4 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all ${isExpanded ? 'border-b-2 border-blue-200' : ''}`}
                                  onClick={() => setExpandedDepartment(isExpanded ? null : category.id)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <span className="text-2xl">{category.icon || '📁'}</span>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-lg font-black text-gray-900">{category.name}</span>
                                          <span className="px-2 py-0.5 bg-blue-100 border border-blue-300 rounded-full text-xs font-bold text-blue-700">
                                            {categoryPercentage.toFixed(1)}%
                                          </span>
                                          {filledItems.length > 0 && (
                                            <span className="px-2 py-0.5 bg-green-100 border border-green-300 rounded-full text-xs font-bold text-green-700">
                                              {filledItems.length} items
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-lg font-bold text-blue-900">
                                          ₹{categoryAmount.toLocaleString('en-IN')}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <div className="w-32 h-2 bg-blue-100 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                                          style={{ width: `${Math.min(categoryPercentage, 100)}%` }}
                                        ></div>
                                      </div>
                                      <svg
                                        className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>

                                {/* Expanded Items Table */}
                                {isExpanded && (
                                  <div className="bg-white p-4">
                                    {filledItems.length > 0 ? (
                                      <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                          <thead>
                                            <tr className="bg-gray-100">
                                              <th className="text-left p-2 font-bold text-gray-700">Item Description</th>
                                              <th className="text-center p-2 font-bold text-gray-700">Days</th>
                                              <th className="text-center p-2 font-bold text-gray-700">People/Qty</th>
                                              <th className="text-right p-2 font-bold text-gray-700">Per Day (₹)</th>
                                              <th className="text-right p-2 font-bold text-gray-700">Lumpsum (₹)</th>
                                              <th className="text-right p-2 font-bold text-gray-700">Total (₹)</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {filledItems.map((item: any, itemIndex: number) => (
                                              <tr key={itemIndex} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="p-2 font-semibold text-gray-900">{item.description || 'N/A'}</td>
                                                <td className="p-2 text-center text-gray-700">{item.noOfDays || item.days || '-'}</td>
                                                <td className="p-2 text-center text-gray-700">{item.noOfPeople || item.people || item.noOfRooms || '-'}</td>
                                                <td className="p-2 text-right text-gray-700">{item.perDay ? `₹${item.perDay.toLocaleString('en-IN')}` : '-'}</td>
                                                <td className="p-2 text-right text-gray-700">{(item.lumpsumFixed || item.lumpsum) ? `₹${(item.lumpsumFixed || item.lumpsum).toLocaleString('en-IN')}` : '-'}</td>
                                                <td className="p-2 text-right font-bold text-blue-900">₹{(item.total || 0).toLocaleString('en-IN')}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                          <tfoot>
                                            <tr className="bg-blue-50 font-bold">
                                              <td colSpan={5} className="p-2 text-right text-gray-900">Category Total:</td>
                                              <td className="p-2 text-right text-blue-900">₹{categoryAmount.toLocaleString('en-IN')}</td>
                                            </tr>
                                          </tfoot>
                                        </table>
                                      </div>
                                    ) : (
                                      <div className="text-center py-4 text-gray-500 font-semibold">
                                        No items added in this category
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-2">📊</div>
                            <div className="font-semibold">No budget breakdown available</div>
                            <div className="text-sm">Creator has not filled budget details yet</div>
                          </div>
                        )}
                      </div>

                      {/* Budget Summary */}
                      {selectedSubmission.budgetCategories && selectedSubmission.budgetCategories.length > 0 && (
                        <div className="mt-4 pt-4 border-t-2 border-gray-200">
                          <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">💰</span>
                              <span className="text-lg font-black text-gray-900">Total Budget Allocated</span>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-black text-green-700">
                                ₹{(selectedSubmission.budgetCategories.reduce((sum: number, cat: any) => sum + (cat.amount || 0), 0)).toLocaleString('en-IN')}
                              </div>
                              <div className="text-sm font-semibold text-green-600">
                                {formatBudgetInWords(selectedSubmission.budgetCategories.reduce((sum: number, cat: any) => sum + (cat.amount || 0), 0))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Payment Tranches - Collapsible */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 shadow-lg overflow-hidden">
                      <div
                        className="p-6 cursor-pointer hover:bg-purple-100/50 transition-all"
                        onClick={() => toggleSection('paymentTranches')}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            <span className="text-2xl">💳</span>
                            <span>Payment Schedule & Tranches</span>
                            <span className="px-2 py-1 bg-purple-100 border border-purple-300 rounded-full text-xs font-bold text-purple-700">4 Tranches</span>
                          </h3>
                          <svg
                            className={`w-6 h-6 text-purple-500 transition-transform ${!collapsedSections.paymentTranches ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        {collapsedSections.paymentTranches && (
                          <div className="mt-2 text-sm font-semibold text-purple-700">
                            Total: {formatBudgetInWords(selectedSubmission.totalBudget)} (Click to expand)
                          </div>
                        )}
                      </div>

                      {!collapsedSections.paymentTranches && (
                        <div className="px-6 pb-6 space-y-4">
                          {/* Tranche 1 */}
                          <div className="bg-white rounded-xl p-6 border-2 border-purple-200 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
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
                            <div className="flex items-center justify-between">
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
                            <div className="flex items-center justify-between">
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
                            <div className="flex items-center justify-between">
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
                      )}
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

                {/* SOP Comments Tab */}
                {detailView === 'sop' && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                            <span className="text-4xl">💬</span>
                          </div>
                          <div>
                            <h2 className="text-2xl font-black">SOP Questions & Comments</h2>
                            <p className="text-blue-100 font-semibold mt-1">
                              Creator's queries about Standard Operating Procedures
                            </p>
                          </div>
                        </div>
                        {selectedSubmission.sopComments && selectedSubmission.sopComments.length > 0 && (
                          <div className="text-right">
                            <div className="text-4xl font-black">{selectedSubmission.sopComments.length}</div>
                            <div className="text-blue-200 text-sm font-bold">Total Comments</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedSubmission.sopComments && selectedSubmission.sopComments.length > 0 ? (
                      <>
                        {/* Comments by Section */}
                        <div className="space-y-4">
                          {(() => {
                            // Group comments by section
                            const groupedComments: { [key: string]: any[] } = {};
                            selectedSubmission.sopComments.forEach((comment: any) => {
                              if (!groupedComments[comment.sectionTitle]) {
                                groupedComments[comment.sectionTitle] = [];
                              }
                              groupedComments[comment.sectionTitle].push(comment);
                            });

                            return Object.entries(groupedComments).map(([sectionTitle, comments], sectionIndex) => (
                              <div key={sectionIndex} className="bg-white rounded-2xl border-2 border-blue-200 shadow-lg overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b-2 border-blue-200">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                      <span className="text-xl">📋</span>
                                      {sectionTitle}
                                    </h3>
                                    <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                                      {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
                                    </span>
                                  </div>
                                </div>
                                <div className="p-4 space-y-3">
                                  {comments.map((comment: any, commentIndex: number) => (
                                    <div key={commentIndex} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-5 border border-blue-100">
                                      <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-100 border-2 border-blue-300 rounded-full flex items-center justify-center flex-shrink-0">
                                          <span className="text-lg">❓</span>
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-gray-800 font-semibold text-base leading-relaxed">
                                            {comment.comment}
                                          </p>
                                          <p className="text-xs text-gray-500 mt-3 flex items-center gap-2">
                                            <span>📅</span>
                                            {new Date(comment.timestamp).toLocaleString('en-IN', {
                                              day: '2-digit',
                                              month: 'short',
                                              year: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit'
                                            })}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ));
                          })()}
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">⚠️</span>
                              <div>
                                <h3 className="text-lg font-black text-amber-900">Action Required</h3>
                                <p className="text-amber-700 font-medium text-sm">Please review and respond to creator's queries</p>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <button className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                                <span>📧</span>
                                Email Creator
                              </button>
                              <button className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                                <span>✅</span>
                                Mark Resolved
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-12 border-2 border-green-200 text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <h3 className="text-2xl font-black text-green-800 mb-2">No SOP Comments</h3>
                        <p className="text-green-700 font-semibold">
                          Creator has not submitted any questions or comments about the Standard Operating Procedures.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Creator Tab */}
                {detailView === 'creator' && (
                  <div className="space-y-6">
                    {/* Download Options */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 flex items-center justify-between border border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">👤</span>
                        <div>
                          <h3 className="text-white font-black">Creator Details</h3>
                          <p className="text-gray-400 text-sm font-semibold">Download creator information</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => exportTabToExcel(selectedSubmission, 'creator')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition-all flex items-center gap-2"
                        >
                          <span>📊</span> Excel
                        </button>
                        <button
                          onClick={() => exportTabToPDF(selectedSubmission, 'creator')}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-all flex items-center gap-2"
                        >
                          <span>📄</span> PDF
                        </button>
                      </div>
                    </div>

                    {/* Creator Profile Card */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
                      <div className="flex items-start gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-4xl font-black shadow-lg">
                          {(selectedSubmission.creator || 'C').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h2 className="text-3xl font-black text-gray-900 mb-2">{selectedSubmission.creator || 'Creator'}</h2>
                          <p className="text-purple-700 font-semibold mb-3">{selectedSubmission.yearsOfExperience} years of experience</p>
                          <div className="flex flex-wrap gap-3">
                            {selectedSubmission.imdbLink && (
                              <a href={selectedSubmission.imdbLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-bold rounded-lg text-sm transition-colors flex items-center gap-2">
                                🎬 IMDB Profile
                              </a>
                            )}
                            {selectedSubmission.portfolioLink && (
                              <a href={selectedSubmission.portfolioLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold rounded-lg text-sm transition-colors flex items-center gap-2">
                                📁 Portfolio
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                      <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-xl">📞</span>
                        <span>Contact Information</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <div className="text-xs font-bold text-blue-700 mb-2 uppercase">Email</div>
                          <div className="text-base font-semibold text-gray-900">{selectedSubmission.officialEmail || 'Not provided'}</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <div className="text-xs font-bold text-green-700 mb-2 uppercase">Phone</div>
                          <div className="text-base font-semibold text-gray-900">{selectedSubmission.phone || 'Not provided'}</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                          <div className="text-xs font-bold text-purple-700 mb-2 uppercase">Age</div>
                          <div className="text-base font-semibold text-gray-900">{selectedSubmission.creatorAge || 'Not provided'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Business Information */}
                    <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                      <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-xl">🏢</span>
                        <span>Business Information</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                          <div className="text-xs font-bold text-amber-700 mb-2 uppercase">PAN Number</div>
                          <div className="text-base font-semibold text-gray-900">{selectedSubmission.panNumber || 'Not provided'}</div>
                        </div>
                        <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                          <div className="text-xs font-bold text-teal-700 mb-2 uppercase">GST Number</div>
                          <div className="text-base font-semibold text-gray-900">{selectedSubmission.gstNumber || 'Not provided'}</div>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                          <div className="text-xs font-bold text-indigo-700 mb-2 uppercase">Company Type</div>
                          <div className="text-base font-semibold text-gray-900">{selectedSubmission.companyType || 'Not provided'}</div>
                        </div>
                        <div className="bg-rose-50 rounded-lg p-4 border border-rose-200">
                          <div className="text-xs font-bold text-rose-700 mb-2 uppercase">Team Size</div>
                          <div className="text-base font-semibold text-gray-900">{selectedSubmission.teamSize || 'Not provided'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                      <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-xl">📍</span>
                        <span>Address Information</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <div className="text-xs font-bold text-slate-700 mb-2 uppercase">Permanent Address</div>
                          <div className="text-base font-semibold text-gray-900">{selectedSubmission.permanentAddress || 'Not provided'}</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <div className="text-xs font-bold text-slate-700 mb-2 uppercase">Current Address</div>
                          <div className="text-base font-semibold text-gray-900">{selectedSubmission.currentAddress || 'Not provided'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    {(selectedSubmission.emergencyContactName || selectedSubmission.emergencyContactPhone) && (
                      <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">🚨</span>
                          <span>Emergency Contact</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white rounded-lg p-4 border border-red-200">
                            <div className="text-xs font-bold text-red-700 mb-2 uppercase">Name</div>
                            <div className="text-base font-semibold text-gray-900">{selectedSubmission.emergencyContactName || 'Not provided'}</div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-red-200">
                            <div className="text-xs font-bold text-red-700 mb-2 uppercase">Relation</div>
                            <div className="text-base font-semibold text-gray-900">{selectedSubmission.emergencyContactRelation || 'Not provided'}</div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-red-200">
                            <div className="text-xs font-bold text-red-700 mb-2 uppercase">Phone</div>
                            <div className="text-base font-semibold text-gray-900">{selectedSubmission.emergencyContactPhone || 'Not provided'}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Previous Work */}
                    {(selectedSubmission.previousProjects || selectedSubmission.notableWorks) && (
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">🏆</span>
                          <span>Previous Work & Portfolio</span>
                        </h3>
                        <div className="space-y-4">
                          {selectedSubmission.previousProjects && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
                              <div className="text-xs font-bold text-blue-700 mb-3 uppercase">Previous Projects</div>
                              <div className="text-base font-semibold text-gray-900">{selectedSubmission.previousProjects}</div>
                            </div>
                          )}
                          {selectedSubmission.notableWorks && (
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-5 border border-purple-200">
                              <div className="text-xs font-bold text-purple-700 mb-3 uppercase">Notable Works</div>
                              <div className="text-base font-semibold text-gray-900">{selectedSubmission.notableWorks}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Crew Tab */}
                {detailView === 'crew' && (
                  <div className="space-y-6">
                    {/* Download Options */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 flex items-center justify-between border border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎬</span>
                        <div>
                          <h3 className="text-white font-black">Crew Details</h3>
                          <p className="text-gray-400 text-sm font-semibold">Download crew information</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => exportTabToExcel(selectedSubmission, 'crew')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition-all flex items-center gap-2"
                        >
                          <span>📊</span> Excel
                        </button>
                        <button
                          onClick={() => exportTabToPDF(selectedSubmission, 'crew')}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-all flex items-center gap-2"
                        >
                          <span>📄</span> PDF
                        </button>
                      </div>
                    </div>

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
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.director}</div>
                                    {selectedSubmission.directorLink && (
                                      <a href={selectedSubmission.directorLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.associateDirector && (
                                <div className="bg-white rounded-lg p-3 border border-red-200">
                                  <div className="text-xs text-red-600 font-bold mb-1">Associate Director</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.associateDirector}</div>
                                    {selectedSubmission.associateDirectorLink && (
                                      <a href={selectedSubmission.associateDirectorLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.assistantDirector1 && (
                                <div className="bg-white rounded-lg p-3 border border-red-200">
                                  <div className="text-xs text-red-600 font-bold mb-1">Assistant Director</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.assistantDirector1}</div>
                                    {selectedSubmission.assistantDirector1Link && (
                                      <a href={selectedSubmission.assistantDirector1Link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.assistantDirector2 && (
                                <div className="bg-white rounded-lg p-3 border border-red-200">
                                  <div className="text-xs text-red-600 font-bold mb-1">Assistant Director 2</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.assistantDirector2}</div>
                                    {selectedSubmission.assistantDirector2Link && (
                                      <a href={selectedSubmission.assistantDirector2Link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Production Department */}
                        {(selectedSubmission.headOfProduction || selectedSubmission.executiveProducer || selectedSubmission.lineProducer || selectedSubmission.productionController || selectedSubmission.unitProductionManager || selectedSubmission.locationManager) && (
                          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-5">
                            <div className="text-xs font-bold text-orange-700 mb-4 flex items-center gap-2 uppercase tracking-wide">
                              <span>🎯</span>
                              <span>PRODUCTION DEPARTMENT</span>
                            </div>
                            <div className="space-y-3">
                              {selectedSubmission.headOfProduction && (
                                <div className="bg-white rounded-lg p-3 border border-orange-200">
                                  <div className="text-xs text-orange-600 font-bold mb-1">Head of Production</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.headOfProduction}</div>
                                    {selectedSubmission.headOfProductionLink && (
                                      <a href={selectedSubmission.headOfProductionLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.executiveProducer && (
                                <div className="bg-white rounded-lg p-3 border border-orange-200">
                                  <div className="text-xs text-orange-600 font-bold mb-1">Executive Producer</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.executiveProducer}</div>
                                    {selectedSubmission.executiveProducerLink && (
                                      <a href={selectedSubmission.executiveProducerLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.lineProducer && (
                                <div className="bg-white rounded-lg p-3 border border-orange-200">
                                  <div className="text-xs text-orange-600 font-bold mb-1">Line Producer</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.lineProducer}</div>
                                    {selectedSubmission.lineProducerLink && (
                                      <a href={selectedSubmission.lineProducerLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.productionController && (
                                <div className="bg-white rounded-lg p-3 border border-orange-200">
                                  <div className="text-xs text-orange-600 font-bold mb-1">Production Controller</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.productionController}</div>
                                    {selectedSubmission.productionControllerLink && (
                                      <a href={selectedSubmission.productionControllerLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.unitProductionManager && (
                                <div className="bg-white rounded-lg p-3 border border-orange-200">
                                  <div className="text-xs text-orange-600 font-bold mb-1">Unit Production Manager</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.unitProductionManager}</div>
                                    {selectedSubmission.unitProductionManagerLink && (
                                      <a href={selectedSubmission.unitProductionManagerLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.locationManager && (
                                <div className="bg-white rounded-lg p-3 border border-orange-200">
                                  <div className="text-xs text-orange-600 font-bold mb-1">Location Manager</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.locationManager}</div>
                                    {selectedSubmission.locationManagerLink && (
                                      <a href={selectedSubmission.locationManagerLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Creative Department */}
                        {(selectedSubmission.showRunner || selectedSubmission.creativeDirector || selectedSubmission.projectHead || selectedSubmission.associateCreativeDirector) && (
                          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-5">
                            <div className="text-xs font-bold text-purple-700 mb-4 flex items-center gap-2 uppercase tracking-wide">
                              <span>💡</span>
                              <span>CREATIVE DEPARTMENT</span>
                            </div>
                            <div className="space-y-3">
                              {selectedSubmission.showRunner && (
                                <div className="bg-white rounded-lg p-3 border border-purple-200">
                                  <div className="text-xs text-purple-600 font-bold mb-1">Show Runner</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.showRunner}</div>
                                    {selectedSubmission.showRunnerLink && (
                                      <a href={selectedSubmission.showRunnerLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.projectHead && (
                                <div className="bg-white rounded-lg p-3 border border-purple-200">
                                  <div className="text-xs text-purple-600 font-bold mb-1">Project Head</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.projectHead}</div>
                                    {selectedSubmission.projectHeadLink && (
                                      <a href={selectedSubmission.projectHeadLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.creativeDirector && (
                                <div className="bg-white rounded-lg p-3 border border-purple-200">
                                  <div className="text-xs text-purple-600 font-bold mb-1">Creative Director</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.creativeDirector}</div>
                                    {selectedSubmission.creativeDirectorLink && (
                                      <a href={selectedSubmission.creativeDirectorLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.associateCreativeDirector && (
                                <div className="bg-white rounded-lg p-3 border border-purple-200">
                                  <div className="text-xs text-purple-600 font-bold mb-1">Associate Creative Director</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.associateCreativeDirector}</div>
                                    {selectedSubmission.associateCreativeDirectorLink && (
                                      <a href={selectedSubmission.associateCreativeDirectorLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
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
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.writer}</div>
                                    {selectedSubmission.writerLink && (
                                      <a href={selectedSubmission.writerLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.storyBy && (
                                <div className="bg-white rounded-lg p-3 border border-yellow-200">
                                  <div className="text-xs text-yellow-600 font-bold mb-1">Story By</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.storyBy}</div>
                                    {selectedSubmission.storyByLink && (
                                      <a href={selectedSubmission.storyByLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.screenplayBy && (
                                <div className="bg-white rounded-lg p-3 border border-yellow-200">
                                  <div className="text-xs text-yellow-600 font-bold mb-1">Screenplay By</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.screenplayBy}</div>
                                    {selectedSubmission.screenplayByLink && (
                                      <a href={selectedSubmission.screenplayByLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
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
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.dop}</div>
                                    {selectedSubmission.dopLink && (
                                      <a href={selectedSubmission.dopLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.firstCameraOperator && (
                                <div className="bg-white rounded-lg p-3 border border-blue-200">
                                  <div className="text-xs text-blue-600 font-bold mb-1">1st Camera Operator</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.firstCameraOperator}</div>
                                    {selectedSubmission.firstCameraOperatorLink && (
                                      <a href={selectedSubmission.firstCameraOperatorLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.steadicamOperator && (
                                <div className="bg-white rounded-lg p-3 border border-blue-200">
                                  <div className="text-xs text-blue-600 font-bold mb-1">Steadicam Operator</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.steadicamOperator}</div>
                                    {selectedSubmission.steadicamOperatorLink && (
                                      <a href={selectedSubmission.steadicamOperatorLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
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
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.editor}</div>
                                    {selectedSubmission.editorLink && (
                                      <a href={selectedSubmission.editorLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.colorist && (
                                <div className="bg-white rounded-lg p-3 border border-green-200">
                                  <div className="text-xs text-green-600 font-bold mb-1">Colorist</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.colorist}</div>
                                    {selectedSubmission.coloristLink && (
                                      <a href={selectedSubmission.coloristLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.onLocationEditor && (
                                <div className="bg-white rounded-lg p-3 border border-green-200">
                                  <div className="text-xs text-green-600 font-bold mb-1">On-Location Editor</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.onLocationEditor}</div>
                                    {selectedSubmission.onLocationEditorLink && (
                                      <a href={selectedSubmission.onLocationEditorLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
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
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.soundRecordist}</div>
                                    {selectedSubmission.soundRecordistLink && (
                                      <a href={selectedSubmission.soundRecordistLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.soundDesigner && (
                                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                                  <div className="text-xs text-indigo-600 font-bold mb-1">Sound Designer</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.soundDesigner}</div>
                                    {selectedSubmission.soundDesignerLink && (
                                      <a href={selectedSubmission.soundDesignerLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.foleyArtist && (
                                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                                  <div className="text-xs text-indigo-600 font-bold mb-1">Foley Artist</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.foleyArtist}</div>
                                    {selectedSubmission.foleyArtistLink && (
                                      <a href={selectedSubmission.foleyArtistLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
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
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.musicComposer}</div>
                                    {selectedSubmission.musicComposerLink && (
                                      <a href={selectedSubmission.musicComposerLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.bgmComposer && (
                                <div className="bg-white rounded-lg p-3 border border-pink-200">
                                  <div className="text-xs text-pink-600 font-bold mb-1">BGM Composer</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.bgmComposer}</div>
                                    {selectedSubmission.bgmComposerLink && (
                                      <a href={selectedSubmission.bgmComposerLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.playbackSinger && (
                                <div className="bg-white rounded-lg p-3 border border-pink-200">
                                  <div className="text-xs text-pink-600 font-bold mb-1">Playback Singer</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.playbackSinger}</div>
                                    {selectedSubmission.playbackSingerLink && (
                                      <a href={selectedSubmission.playbackSingerLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
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
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.productionDesigner}</div>
                                    {selectedSubmission.productionDesignerLink && (
                                      <a href={selectedSubmission.productionDesignerLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.artDirector && (
                                <div className="bg-white rounded-lg p-3 border border-amber-200">
                                  <div className="text-xs text-amber-600 font-bold mb-1">Art Director</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.artDirector}</div>
                                    {selectedSubmission.artDirectorLink && (
                                      <a href={selectedSubmission.artDirectorLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.setDesigner && (
                                <div className="bg-white rounded-lg p-3 border border-amber-200">
                                  <div className="text-xs text-amber-600 font-bold mb-1">Set Designer</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.setDesigner}</div>
                                    {selectedSubmission.setDesignerLink && (
                                      <a href={selectedSubmission.setDesignerLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
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
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.costumeDesigner}</div>
                                    {selectedSubmission.costumeDesignerLink && (
                                      <a href={selectedSubmission.costumeDesignerLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.makeupArtist && (
                                <div className="bg-white rounded-lg p-3 border border-rose-200">
                                  <div className="text-xs text-rose-600 font-bold mb-1">Makeup Artist</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.makeupArtist}</div>
                                    {selectedSubmission.makeupArtistLink && (
                                      <a href={selectedSubmission.makeupArtistLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedSubmission.hairStylist && (
                                <div className="bg-white rounded-lg p-3 border border-rose-200">
                                  <div className="text-xs text-rose-600 font-bold mb-1">Hair Stylist</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-gray-900">{selectedSubmission.hairStylist}</div>
                                    {selectedSubmission.hairStylistLink && (
                                      <a href={selectedSubmission.hairStylistLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold rounded-lg transition-colors">
                                        <span>🔗</span> Profile
                                      </a>
                                    )}
                                  </div>
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
                    {/* Download Options */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 flex items-center justify-between border border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📅</span>
                        <div>
                          <h3 className="text-white font-black">Timeline Details</h3>
                          <p className="text-gray-400 text-sm font-semibold">Download project schedule</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => exportTabToExcel(selectedSubmission, 'timeline')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition-all flex items-center gap-2"
                        >
                          <span>📊</span> Excel
                        </button>
                        <button
                          onClick={() => exportTabToPDF(selectedSubmission, 'timeline')}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-all flex items-center gap-2"
                        >
                          <span>📄</span> PDF
                        </button>
                      </div>
                    </div>

                    {/* Development Phase */}
                    <div className="bg-white rounded-xl p-5 border-2 border-purple-200 shadow-lg">
                      <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">📝</span>
                        <span>Development Phase</span>
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                          <div className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">Detailed Screenplay Submission</div>
                          <div className="text-lg font-bold text-gray-900">
                            {selectedSubmission.contentTimeline?.detailedScreenplaySubmission ? formatDateLong(selectedSubmission.contentTimeline.detailedScreenplaySubmission) : 'Not set'}
                          </div>
                          {selectedSubmission.contentTimeline?.detailedScreenplayComments && (
                            <div className="mt-2 text-sm text-gray-600 bg-white/50 p-2 rounded-lg">
                              💬 {selectedSubmission.contentTimeline.detailedScreenplayComments}
                            </div>
                          )}
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                          <div className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">Final Script Submission</div>
                          <div className="text-lg font-bold text-gray-900">
                            {selectedSubmission.contentTimeline?.scriptSubmission ? formatDateLong(selectedSubmission.contentTimeline.scriptSubmission) : 'Not set'}
                          </div>
                          {selectedSubmission.contentTimeline?.scriptComments && (
                            <div className="mt-2 text-sm text-gray-600 bg-white/50 p-2 rounded-lg">
                              💬 {selectedSubmission.contentTimeline.scriptComments}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pre-Production Phase */}
                    <div className="bg-white rounded-xl p-5 border-2 border-blue-200 shadow-lg">
                      <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🎯</span>
                        <span>Pre-Production Phase</span>
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                          <div className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">Start Date</div>
                          <div className="text-lg font-bold text-gray-900">
                            {selectedSubmission.contentTimeline?.preProductionStart ? formatDateLong(selectedSubmission.contentTimeline.preProductionStart) : 'Not set'}
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                          <div className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">End Date</div>
                          <div className="text-lg font-bold text-gray-900">
                            {selectedSubmission.contentTimeline?.preProductionEnd ? formatDateLong(selectedSubmission.contentTimeline.preProductionEnd) : 'Not set'}
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-4 border-2 border-blue-300">
                          <div className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">Duration</div>
                          <div className="text-lg font-black text-blue-900">
                            {selectedSubmission.contentTimeline?.preProductionDuration || 'Not calculated'}
                          </div>
                        </div>
                      </div>
                      {selectedSubmission.contentTimeline?.preProductionComments && (
                        <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                          💬 {selectedSubmission.contentTimeline.preProductionComments}
                        </div>
                      )}
                    </div>

                    {/* Production Phase (Principal Photography) */}
                    <div className="bg-white rounded-xl p-5 border-2 border-green-200 shadow-lg">
                      <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🎬</span>
                        <span>Production Phase (Principal Photography)</span>
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                          <div className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wide">Shoot Start Date</div>
                          <div className="text-lg font-bold text-gray-900">
                            {(selectedSubmission.contentTimeline?.shootStartDate || selectedSubmission.shootStartDate) ? formatDateLong(selectedSubmission.contentTimeline?.shootStartDate || selectedSubmission.shootStartDate) : 'Not set'}
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                          <div className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wide">Shoot End Date</div>
                          <div className="text-lg font-bold text-gray-900">
                            {(selectedSubmission.contentTimeline?.shootEndDate || selectedSubmission.shootEndDate) ? formatDateLong(selectedSubmission.contentTimeline?.shootEndDate || selectedSubmission.shootEndDate) : 'Not set'}
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 border-2 border-green-300">
                          <div className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wide">Total Shoot Days</div>
                          <div className="text-lg font-black text-green-900">
                            {selectedSubmission.contentTimeline?.shootDays || selectedSubmission.shootDays || 'Not calculated'}
                          </div>
                        </div>
                      </div>
                      {selectedSubmission.contentTimeline?.principalPhotographyComments && (
                        <div className="mt-4 text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-200">
                          💬 {selectedSubmission.contentTimeline.principalPhotographyComments}
                        </div>
                      )}
                    </div>

                    {/* Post-Production Phase */}
                    <div className="bg-white rounded-xl p-5 border-2 border-amber-200 shadow-lg">
                      <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">✂️</span>
                        <span>Post-Production Phase</span>
                      </h3>

                      {/* First Cut */}
                      <div className="mb-4">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
                          <div className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide">First Cut for STAGE QC</div>
                          <div className="text-lg font-bold text-gray-900">
                            {selectedSubmission.contentTimeline?.firstCutDate ? formatDateLong(selectedSubmission.contentTimeline.firstCutDate) : 'Not set'}
                          </div>
                          {selectedSubmission.contentTimeline?.firstCutComments && (
                            <div className="mt-2 text-sm text-gray-600 bg-white/50 p-2 rounded-lg">
                              💬 {selectedSubmission.contentTimeline.firstCutComments}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Post-Production Duration */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
                          <div className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide">Post-Production Start</div>
                          <div className="text-lg font-bold text-gray-900">
                            {selectedSubmission.contentTimeline?.postProductionStart ? formatDateLong(selectedSubmission.contentTimeline.postProductionStart) : 'Not set'}
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
                          <div className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide">Post-Production End</div>
                          <div className="text-lg font-bold text-gray-900">
                            {selectedSubmission.contentTimeline?.postProductionEnd ? formatDateLong(selectedSubmission.contentTimeline.postProductionEnd) : 'Not set'}
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4 border-2 border-amber-300">
                          <div className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide">Duration</div>
                          <div className="text-lg font-black text-amber-900">
                            {selectedSubmission.contentTimeline?.postProductionDuration || 'Not calculated'}
                          </div>
                        </div>
                      </div>
                      {selectedSubmission.contentTimeline?.postProductionComments && (
                        <div className="mt-4 text-sm text-gray-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                          💬 {selectedSubmission.contentTimeline.postProductionComments}
                        </div>
                      )}
                    </div>

                    {/* Final Delivery */}
                    <div className="bg-white rounded-xl p-5 border-2 border-rose-200 shadow-lg">
                      <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🎉</span>
                        <span>Final Delivery</span>
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-4 border-2 border-rose-200">
                          <div className="text-xs font-bold text-rose-700 mb-2 uppercase tracking-wide">Final Cut for QC Date</div>
                          <div className="text-lg font-bold text-gray-900">
                            {selectedSubmission.contentTimeline?.finalCutQCDate ? formatDateLong(selectedSubmission.contentTimeline.finalCutQCDate) : 'Not set'}
                          </div>
                          {selectedSubmission.contentTimeline?.finalCutComments && (
                            <div className="mt-2 text-sm text-gray-600 bg-white/50 p-2 rounded-lg">
                              💬 {selectedSubmission.contentTimeline.finalCutComments}
                            </div>
                          )}
                        </div>
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 border-2 border-green-300">
                          <div className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wide">Final Project Delivery</div>
                          <div className="text-lg font-black text-green-900">
                            {(selectedSubmission.contentTimeline?.finalDeliveryDate || selectedSubmission.finalDeliveryDate) ? formatDateLong(selectedSubmission.contentTimeline?.finalDeliveryDate || selectedSubmission.finalDeliveryDate) : 'Not set'}
                          </div>
                          {selectedSubmission.contentTimeline?.finalDeliveryComments && (
                            <div className="mt-2 text-sm text-gray-600 bg-white/50 p-2 rounded-lg">
                              💬 {selectedSubmission.contentTimeline.finalDeliveryComments}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cast Tab */}
                {detailView === 'cast' && (
                  <div className="space-y-6">
                    {/* Download Options */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 flex items-center justify-between border border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">⭐</span>
                        <div>
                          <h3 className="text-white font-black">Cast Details</h3>
                          <p className="text-gray-400 text-sm font-semibold">Download cast information</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => exportTabToExcel(selectedSubmission, 'cast')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition-all flex items-center gap-2"
                        >
                          <span>📊</span> Excel
                        </button>
                        <button
                          onClick={() => exportTabToPDF(selectedSubmission, 'cast')}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-all flex items-center gap-2"
                        >
                          <span>📄</span> PDF
                        </button>
                      </div>
                    </div>

                    {/* Cast Overview */}
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 border-2 border-pink-200 shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                          <span className="text-3xl">⭐</span>
                          <span>Cast Members</span>
                        </h2>
                        <div className="flex gap-3">
                          <div className="px-4 py-2 bg-pink-100 rounded-lg border border-pink-300">
                            <div className="text-xs font-bold text-pink-700">Primary</div>
                            <div className="text-xl font-black text-pink-900">{selectedSubmission.castData?.primaryCast?.length || 0}</div>
                          </div>
                          <div className="px-4 py-2 bg-purple-100 rounded-lg border border-purple-300">
                            <div className="text-xs font-bold text-purple-700">Secondary</div>
                            <div className="text-xl font-black text-purple-900">{selectedSubmission.castData?.secondaryCast?.length || 0}</div>
                          </div>
                          <div className="px-4 py-2 bg-blue-100 rounded-lg border border-blue-300">
                            <div className="text-xs font-bold text-blue-700">Others</div>
                            <div className="text-xl font-black text-blue-900">{selectedSubmission.castData?.tertiaryCast?.length || 0}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Primary Cast */}
                    {selectedSubmission.castData?.primaryCast && selectedSubmission.castData.primaryCast.length > 0 && (
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">🌟</span>
                          <span>Primary Cast ({selectedSubmission.castData.primaryCast.length})</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedSubmission.castData.primaryCast.map((cast: any, idx: number) => (
                            <div key={idx} className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border-2 border-pink-200 overflow-hidden hover:shadow-lg transition-all">
                              <div className="flex">
                                {/* Photo */}
                                <div className="w-32 h-32 flex-shrink-0 bg-pink-100 flex items-center justify-center">
                                  {cast.photographUrl ? (
                                    <img src={cast.photographUrl} alt={cast.artistName} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-4xl">👤</span>
                                  )}
                                </div>
                                {/* Details */}
                                <div className="flex-1 p-4">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <div className="text-lg font-black text-gray-900">{cast.artistName || 'Unknown Artist'}</div>
                                      <div className="text-sm text-pink-700 font-semibold">as {cast.characterName || 'N/A'}</div>
                                    </div>
                                    <span className="px-2 py-1 bg-pink-200 text-pink-800 text-xs font-bold rounded-full">PRIMARY</span>
                                  </div>

                                  {/* Links & Actions */}
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {cast.socialMediaLink && (
                                      <a href={cast.socialMediaLink} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-lg hover:shadow-md transition-all flex items-center gap-1">
                                        🔗 Profile/Portfolio
                                      </a>
                                    )}
                                    {cast.photographUrl && (
                                      <a href={cast.photographUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold rounded-lg hover:shadow-md transition-all flex items-center gap-1">
                                        📷 View Photo
                                      </a>
                                    )}
                                  </div>

                                  {(cast.days || cast.remuneration) && (
                                    <div className="mt-2 pt-2 border-t border-pink-200 flex gap-4 text-sm">
                                      {cast.days && <span className="text-gray-600 font-semibold">📅 {cast.days} days</span>}
                                      {cast.remuneration && <span className="text-green-600 font-bold">₹{cast.remuneration.toLocaleString('en-IN')}</span>}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Secondary Cast */}
                    {selectedSubmission.castData?.secondaryCast && selectedSubmission.castData.secondaryCast.length > 0 && (
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">✨</span>
                          <span>Secondary Cast ({selectedSubmission.castData.secondaryCast.length})</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {selectedSubmission.castData.secondaryCast.map((cast: any, idx: number) => (
                            <div key={idx} className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200 overflow-hidden hover:shadow-lg transition-all">
                              <div className="flex">
                                {/* Photo */}
                                <div className="w-20 h-20 flex-shrink-0 bg-purple-100 flex items-center justify-center">
                                  {cast.photographUrl ? (
                                    <img src={cast.photographUrl} alt={cast.artistName} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-2xl">👤</span>
                                  )}
                                </div>
                                {/* Details */}
                                <div className="flex-1 p-3">
                                  <div className="text-base font-black text-gray-900">{cast.artistName || 'Unknown'}</div>
                                  <div className="text-sm text-purple-700 font-semibold">as {cast.characterName || 'N/A'}</div>
                                  <div className="mt-2 flex gap-2">
                                    {cast.socialMediaLink && (
                                      <a href={cast.socialMediaLink} target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded hover:shadow-md transition-all">
                                        🔗 Profile
                                      </a>
                                    )}
                                    {cast.photographUrl && (
                                      <a href={cast.photographUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded hover:shadow-md transition-all">
                                        📷
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tertiary Cast */}
                    {selectedSubmission.castData?.tertiaryCast && selectedSubmission.castData.tertiaryCast.length > 0 && (
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">👥</span>
                          <span>Other Cast ({selectedSubmission.castData.tertiaryCast.length})</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {selectedSubmission.castData.tertiaryCast.map((cast: any, idx: number) => (
                            <div key={idx} className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 overflow-hidden hover:shadow-lg transition-all">
                              <div className="flex">
                                {/* Photo */}
                                <div className="w-16 h-16 flex-shrink-0 bg-blue-100 flex items-center justify-center">
                                  {cast.photographUrl ? (
                                    <img src={cast.photographUrl} alt={cast.artistName} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-xl">👤</span>
                                  )}
                                </div>
                                {/* Details */}
                                <div className="flex-1 p-2">
                                  <div className="text-sm font-bold text-gray-900">{cast.artistName || 'Unknown'}</div>
                                  <div className="text-xs text-blue-700">as {cast.characterName || 'N/A'}</div>
                                  {(cast.socialMediaLink || cast.photographUrl) && (
                                    <div className="mt-1 flex gap-1">
                                      {cast.socialMediaLink && (
                                        <a href={cast.socialMediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs font-bold hover:underline">🔗</a>
                                      )}
                                      {cast.photographUrl && (
                                        <a href={cast.photographUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs font-bold hover:underline">📷</a>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {(!selectedSubmission.castData || (!selectedSubmission.castData.primaryCast?.length && !selectedSubmission.castData.secondaryCast?.length && !selectedSubmission.castData.tertiaryCast?.length)) && (
                      <div className="bg-gray-50 rounded-xl p-12 border-2 border-dashed border-gray-300 text-center">
                        <div className="text-6xl mb-4">⭐</div>
                        <div className="text-xl font-bold text-gray-700">No cast members added</div>
                        <div className="text-sm text-gray-500 font-semibold mt-2">Cast details will appear here once submitted</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Technical Tab */}
                {detailView === 'technical' && (
                  <div className="space-y-6">
                    {/* Download Options */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 flex items-center justify-between border border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📹</span>
                        <div>
                          <h3 className="text-white font-black">Technical Specs</h3>
                          <p className="text-gray-400 text-sm font-semibold">Download technical details</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => exportTabToExcel(selectedSubmission, 'technical')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition-all flex items-center gap-2"
                        >
                          <span>📊</span> Excel
                        </button>
                        <button
                          onClick={() => exportTabToPDF(selectedSubmission, 'technical')}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-all flex items-center gap-2"
                        >
                          <span>📄</span> PDF
                        </button>
                      </div>
                    </div>

                    {/* Technical Overview */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200 shadow-lg">
                      <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                        <span className="text-3xl">📹</span>
                        <span>Technical Specifications</span>
                      </h2>

                      {selectedSubmission.technicalSpecs ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Camera */}
                          {selectedSubmission.technicalSpecs.cameraModel && (
                            <div className="bg-white rounded-xl p-5 border-2 border-amber-200">
                              <div className="text-xs font-bold text-amber-700 mb-2 uppercase">Camera Model</div>
                              <div className="text-lg font-black text-gray-900">{selectedSubmission.technicalSpecs.cameraModel}</div>
                              {selectedSubmission.technicalSpecs.cameraSetupType && (
                                <div className="text-sm text-gray-600 font-semibold mt-1 capitalize">{selectedSubmission.technicalSpecs.cameraSetupType} Camera Setup</div>
                              )}
                            </div>
                          )}

                          {/* Camera Setup Type */}
                          {selectedSubmission.technicalSpecs.cameraSetupType && !selectedSubmission.technicalSpecs.cameraModel && (
                            <div className="bg-white rounded-xl p-5 border-2 border-amber-200">
                              <div className="text-xs font-bold text-amber-700 mb-2 uppercase">Camera Setup</div>
                              <div className="text-lg font-black text-gray-900 capitalize">{selectedSubmission.technicalSpecs.cameraSetupType} Camera</div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 font-semibold">No technical specifications provided</div>
                      )}
                    </div>

                    {/* Lenses */}
                    {selectedSubmission.technicalSpecs?.lensTypes?.length > 0 && (
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">🔭</span>
                          <span>Lenses ({selectedSubmission.technicalSpecs.lensTypes.length})</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedSubmission.technicalSpecs.lensTypes.map((lens: any, idx: number) => (
                            <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                              <span className="font-bold text-blue-800">{typeof lens === 'string' ? lens : lens.name || 'Unknown'}</span>
                              {typeof lens !== 'string' && lens.quantity && (
                                <span className="px-2 py-1 bg-blue-200 text-blue-900 text-xs font-bold rounded">x{lens.quantity}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Camera Others */}
                    {selectedSubmission.technicalSpecs?.cameraOthers?.length > 0 && (
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">📷</span>
                          <span>Other Camera Equipment ({selectedSubmission.technicalSpecs.cameraOthers.length})</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedSubmission.technicalSpecs.cameraOthers.map((item: any, idx: number) => (
                            <div key={idx} className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 flex items-center justify-between">
                              <span className="font-bold text-cyan-800">{typeof item === 'string' ? item : item.name || 'Unknown'}</span>
                              {typeof item !== 'string' && item.quantity && (
                                <span className="px-2 py-1 bg-cyan-200 text-cyan-900 text-xs font-bold rounded">x{item.quantity}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Lighting Equipment */}
                    {selectedSubmission.technicalSpecs?.lightingEquipment?.length > 0 && (
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">💡</span>
                          <span>Lighting Equipment ({selectedSubmission.technicalSpecs.lightingEquipment.length})</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedSubmission.technicalSpecs.lightingEquipment.map((item: any, idx: number) => (
                            <div key={idx} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-between">
                              <span className="font-bold text-yellow-800">{typeof item === 'string' ? item : item.name || 'Unknown'}</span>
                              {typeof item !== 'string' && item.quantity && (
                                <span className="px-2 py-1 bg-yellow-200 text-yellow-900 text-xs font-bold rounded">x{item.quantity}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Lighting Others */}
                    {selectedSubmission.technicalSpecs?.lightingOthers?.length > 0 && (
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">🔆</span>
                          <span>Other Lighting Equipment ({selectedSubmission.technicalSpecs.lightingOthers.length})</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedSubmission.technicalSpecs.lightingOthers.map((item: any, idx: number) => (
                            <div key={idx} className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-between">
                              <span className="font-bold text-amber-800">{typeof item === 'string' ? item : item.name || 'Unknown'}</span>
                              {typeof item !== 'string' && item.quantity && (
                                <span className="px-2 py-1 bg-amber-200 text-amber-900 text-xs font-bold rounded">x{item.quantity}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cinematic Tools */}
                    {selectedSubmission.technicalSpecs?.cinematicTools?.length > 0 && (
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">🎬</span>
                          <span>Cinematic Tools ({selectedSubmission.technicalSpecs.cinematicTools.length})</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedSubmission.technicalSpecs.cinematicTools.map((item: any, idx: number) => (
                            <div key={idx} className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center justify-between">
                              <span className="font-bold text-purple-800">{typeof item === 'string' ? item : item.name || 'Unknown'}</span>
                              {typeof item !== 'string' && item.quantity && (
                                <span className="px-2 py-1 bg-purple-200 text-purple-900 text-xs font-bold rounded">x{item.quantity}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cinematic Others */}
                    {selectedSubmission.technicalSpecs?.cinematicOthers?.length > 0 && (
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">🎞️</span>
                          <span>Other Cinematic Equipment ({selectedSubmission.technicalSpecs.cinematicOthers.length})</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedSubmission.technicalSpecs.cinematicOthers.map((item: any, idx: number) => (
                            <div key={idx} className="bg-violet-50 border border-violet-200 rounded-lg p-3 flex items-center justify-between">
                              <span className="font-bold text-violet-800">{typeof item === 'string' ? item : item.name || 'Unknown'}</span>
                              {typeof item !== 'string' && item.quantity && (
                                <span className="px-2 py-1 bg-violet-200 text-violet-900 text-xs font-bold rounded">x{item.quantity}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Drones */}
                    {selectedSubmission.technicalSpecs?.droneModels?.length > 0 && (
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">🚁</span>
                          <span>Drones ({selectedSubmission.technicalSpecs.droneModels.length})</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedSubmission.technicalSpecs.droneModels.map((drone: any, idx: number) => (
                            <div key={idx} className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 flex items-center justify-between">
                              <span className="font-bold text-indigo-800">{typeof drone === 'string' ? drone : drone.name || 'Unknown'}</span>
                              {typeof drone !== 'string' && drone.quantity && (
                                <span className="px-2 py-1 bg-indigo-200 text-indigo-900 text-xs font-bold rounded">x{drone.quantity}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Drone Others */}
                    {selectedSubmission.technicalSpecs?.droneOthers?.length > 0 && (
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">🎮</span>
                          <span>Other Drone Equipment ({selectedSubmission.technicalSpecs.droneOthers.length})</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedSubmission.technicalSpecs.droneOthers.map((item: any, idx: number) => (
                            <div key={idx} className="bg-sky-50 border border-sky-200 rounded-lg p-3 flex items-center justify-between">
                              <span className="font-bold text-sky-800">{typeof item === 'string' ? item : item.name || 'Unknown'}</span>
                              {typeof item !== 'string' && item.quantity && (
                                <span className="px-2 py-1 bg-sky-200 text-sky-900 text-xs font-bold rounded">x{item.quantity}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sound Equipment */}
                    {selectedSubmission.technicalSpecs?.soundEquipment?.length > 0 && (
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">🎤</span>
                          <span>Sound Equipment ({selectedSubmission.technicalSpecs.soundEquipment.length})</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedSubmission.technicalSpecs.soundEquipment.map((item: any, idx: number) => (
                            <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                              <span className="font-bold text-green-800">{typeof item === 'string' ? item : item.name || 'Unknown'}</span>
                              {typeof item !== 'string' && item.quantity && (
                                <span className="px-2 py-1 bg-green-200 text-green-900 text-xs font-bold rounded">x{item.quantity}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sound Others */}
                    {selectedSubmission.technicalSpecs?.soundOthers?.length > 0 && (
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">🔊</span>
                          <span>Other Sound Equipment ({selectedSubmission.technicalSpecs.soundOthers.length})</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedSubmission.technicalSpecs.soundOthers.map((item: any, idx: number) => (
                            <div key={idx} className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between">
                              <span className="font-bold text-emerald-800">{typeof item === 'string' ? item : item.name || 'Unknown'}</span>
                              {typeof item !== 'string' && item.quantity && (
                                <span className="px-2 py-1 bg-emerald-200 text-emerald-900 text-xs font-bold rounded">x{item.quantity}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {(!selectedSubmission.technicalSpecs ||
                      (!selectedSubmission.technicalSpecs.cameraModel &&
                       !selectedSubmission.technicalSpecs.cameraSetupType &&
                       !selectedSubmission.technicalSpecs.lensTypes?.length &&
                       !selectedSubmission.technicalSpecs.lightingEquipment?.length &&
                       !selectedSubmission.technicalSpecs.soundEquipment?.length &&
                       !selectedSubmission.technicalSpecs.droneModels?.length &&
                       !selectedSubmission.technicalSpecs.cinematicTools?.length)) && (
                      <div className="bg-gray-50 rounded-xl p-12 border-2 border-dashed border-gray-300 text-center">
                        <div className="text-6xl mb-4">📹</div>
                        <div className="text-xl font-bold text-gray-700">No technical specifications added</div>
                        <div className="text-sm text-gray-500 font-semibold mt-2">Technical details will appear here once submitted</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Cash Flow Tab */}
                {detailView === 'cashflow' && (
                  <div className="space-y-6">
                    {/* Download Options */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 flex items-center justify-between border border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💳</span>
                        <div>
                          <h3 className="text-white font-black">Cash Flow Details</h3>
                          <p className="text-gray-400 text-sm font-semibold">Download payment schedule</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => exportTabToExcel(selectedSubmission, 'cashflow')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition-all flex items-center gap-2"
                        >
                          <span>📊</span> Excel
                        </button>
                        <button
                          onClick={() => exportTabToPDF(selectedSubmission, 'cashflow')}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-all flex items-center gap-2"
                        >
                          <span>📄</span> PDF
                        </button>
                      </div>
                    </div>

                    {/* Total Budget Overview */}
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border-2 border-emerald-200 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3">
                            <span className="text-3xl">💳</span>
                            <span>Cash Flow & Payment Schedule</span>
                          </h2>
                          <p className="text-emerald-700 font-semibold">Payment tranches, terms, and GST breakdown</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-700 mb-1 uppercase">Total Budget</div>
                          <div className="text-3xl font-black text-emerald-900">₹{(selectedSubmission.totalBudget || 0).toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Tranches */}
                    <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                      {(() => {
                        // Use saved tranches or generate default based on format
                        const displayTranches = (selectedSubmission.cashFlowTranches && selectedSubmission.cashFlowTranches.length > 0)
                          ? selectedSubmission.cashFlowTranches
                          : getDefaultTranches(selectedSubmission.format, selectedSubmission.totalBudget || 0);
                        const isDefaultTranches = !selectedSubmission.cashFlowTranches || selectedSubmission.cashFlowTranches.length === 0;

                        return (
                          <>
                            <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                              <span className="text-xl">📊</span>
                              <span>Payment Tranches</span>
                              <span className="ml-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                                {displayTranches.length} Tranches
                              </span>
                              {isDefaultTranches && (
                                <span className="ml-2 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                                  Default Structure
                                </span>
                              )}
                            </h3>

                            <div className="space-y-3">
                              {displayTranches.map((tranche: any, idx: number) => {
                            const baseAmount = tranche.amount || (selectedSubmission.totalBudget * (tranche.percentage || 0) / 100);
                            const gstAmount = baseAmount * 0.18;
                            const totalWithGst = baseAmount + gstAmount;
                            const isExpanded = expandedTranche === idx;
                            return (
                              <div key={idx} className="border-2 border-emerald-200 rounded-xl overflow-hidden">
                                {/* Tranche Header - Clickable */}
                                <div
                                  className={`bg-gradient-to-r from-emerald-50 to-green-50 p-4 cursor-pointer hover:from-emerald-100 hover:to-green-100 transition-all ${isExpanded ? 'border-b-2 border-emerald-200' : ''}`}
                                  onClick={() => setExpandedTranche(isExpanded ? null : idx)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white font-black text-lg">
                                        {idx + 1}
                                      </div>
                                      <div>
                                        <div className="text-lg font-black text-gray-900">{tranche.name || tranche.milestone || `Tranche ${idx + 1}`}</div>
                                        <div className="flex items-center gap-3 mt-1">
                                          <span className="px-2 py-0.5 bg-blue-100 border border-blue-300 rounded-full text-xs font-bold text-blue-700">
                                            {tranche.percentage || 0}%
                                          </span>
                                          <span className="text-emerald-700 font-bold">₹{baseAmount.toLocaleString('en-IN')}</span>
                                          <span className="text-gray-400">→</span>
                                          <span className="text-emerald-900 font-black">₹{totalWithGst.toLocaleString('en-IN', { maximumFractionDigits: 0 })} (with GST)</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <div className="text-right">
                                        <div className="text-xs text-gray-500 font-semibold">Due Date</div>
                                        <div className="text-sm font-bold text-gray-700">{tranche.date || tranche.dueDate || 'TBD'}</div>
                                      </div>
                                      <svg
                                        className={`w-6 h-6 text-emerald-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                  <div className="bg-white p-5">
                                    {/* Description */}
                                    <div className="mb-4">
                                      <div className="text-xs font-bold text-gray-500 uppercase mb-2">📋 Milestone Description</div>
                                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                        <p className="text-gray-800 font-medium leading-relaxed">
                                          {tranche.description || 'No description provided for this milestone.'}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Payment Breakdown */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                        <div className="text-xs font-bold text-blue-700 uppercase">Percentage</div>
                                        <div className="text-xl font-black text-blue-900">{tranche.percentage || 0}%</div>
                                      </div>
                                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                        <div className="text-xs font-bold text-gray-600 uppercase">Base Amount</div>
                                        <div className="text-xl font-black text-gray-900">₹{baseAmount.toLocaleString('en-IN')}</div>
                                      </div>
                                      <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                                        <div className="text-xs font-bold text-amber-700 uppercase">GST @ 18%</div>
                                        <div className="text-xl font-black text-amber-900">₹{gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                                      </div>
                                      <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                                        <div className="text-xs font-bold text-emerald-700 uppercase">Total with GST</div>
                                        <div className="text-xl font-black text-emerald-900">₹{totalWithGst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                                      </div>
                                    </div>

                                    {/* Status & Terms */}
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            tranche.status === 'paid' ? 'bg-green-100 text-green-800' :
                                            tranche.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-700'
                                          }`}>
                                            {tranche.status === 'paid' ? '✓ Paid' : tranche.status === 'processing' ? '⏳ Processing' : '⏸️ Pending'}
                                          </span>
                                          {tranche.condition && (
                                            <span className="text-xs text-gray-500 font-semibold">Condition: {tranche.condition}</span>
                                          )}
                                        </div>
                                        <div className="text-xs text-gray-500 font-medium">
                                          💡 Payment within 15 days of approved invoice
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}

                              {/* Total Summary */}
                              <div className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-xl p-4 border-2 border-emerald-300">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl">💰</span>
                                    <span className="text-lg font-black text-gray-900">Total</span>
                                    <span className="px-3 py-1 bg-emerald-200 text-emerald-900 rounded-full text-sm font-bold">
                                      {displayTranches.reduce((sum: number, t: any) => sum + (t.percentage || 0), 0)}%
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-6">
                                    <div className="text-right">
                                      <div className="text-xs text-gray-600 font-semibold">Base Total</div>
                                      <div className="font-bold text-gray-900">₹{(selectedSubmission.totalBudget || 0).toLocaleString('en-IN')}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xs text-amber-700 font-semibold">GST Total</div>
                                      <div className="font-bold text-amber-800">₹{((selectedSubmission.totalBudget || 0) * 0.18).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xs text-emerald-700 font-semibold">Grand Total</div>
                                      <div className="text-xl font-black text-emerald-900">₹{((selectedSubmission.totalBudget || 0) * 1.18).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* GST Summary */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200 shadow-lg">
                      <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-xl">📑</span>
                        <span>GST Summary</span>
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-amber-200 text-center">
                          <div className="text-xs font-bold text-amber-700 mb-2">Base Amount</div>
                          <div className="text-xl font-black text-gray-900">₹{(selectedSubmission.totalBudget || 0).toLocaleString('en-IN')}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-amber-200 text-center">
                          <div className="text-xs font-bold text-amber-700 mb-2">CGST @ 9%</div>
                          <div className="text-xl font-black text-gray-900">₹{((selectedSubmission.totalBudget || 0) * 0.09).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-amber-200 text-center">
                          <div className="text-xs font-bold text-amber-700 mb-2">SGST @ 9%</div>
                          <div className="text-xl font-black text-gray-900">₹{((selectedSubmission.totalBudget || 0) * 0.09).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                        </div>
                        <div className="bg-emerald-100 rounded-lg p-4 border border-emerald-300 text-center">
                          <div className="text-xs font-bold text-emerald-700 mb-2">Total with GST</div>
                          <div className="text-xl font-black text-emerald-900">₹{((selectedSubmission.totalBudget || 0) * 1.18).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                        </div>
                      </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
                      <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-xl">📌</span>
                        <span>Important Notes</span>
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-700 font-semibold">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500">✓</span>
                          All payments subject to successful completion of milestones
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500">✓</span>
                          GST invoice to be raised within 7 days of milestone completion
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500">✓</span>
                          TDS certificate to be issued quarterly as per IT Act
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500">✓</span>
                          All payments via NEFT/RTGS to registered bank account only
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Documents Tab */}
                {detailView === 'documents' && (
                  <div className="space-y-6">
                    {/* Uploaded Files */}
                    {selectedSubmission.uploadedFiles && selectedSubmission.uploadedFiles.length > 0 && (
                      <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-2xl">📎</span>
                          <span>Uploaded Files ({selectedSubmission.uploadedFiles.length})</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedSubmission.uploadedFiles.map((file: any, index: number) => {
                            const isPDF = file.name?.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
                            const isImage = file.type?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name || '');
                            const isPreviewable = isPDF || isImage;

                            return (
                              <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-3">
                                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                                    isPDF ? 'bg-red-100' : isImage ? 'bg-green-100' : 'bg-gray-100'
                                  }`}>
                                    {isPDF ? '📕' : isImage ? '🖼️' : '📄'}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-gray-900 truncate" title={file.name}>{file.name}</div>
                                    <div className="text-xs text-gray-600 font-semibold mt-1">
                                      {(file.size / 1024 / 1024).toFixed(2)} MB • {formatDate(file.uploadDate)}
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                      {isPreviewable && (
                                        <button
                                          onClick={() => setPreviewDocument({
                                            url: file.url || file.dataUrl || `#preview-${index}`,
                                            name: file.name,
                                            type: isPDF ? 'pdf' : 'image'
                                          })}
                                          className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs font-bold rounded-lg transition-all shadow-sm"
                                        >
                                          👁️ Preview
                                        </button>
                                      )}
                                      <button className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-all shadow-sm">
                                        ⬇️ Download
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Cloud Links */}
                    {selectedSubmission.cloudLinks && selectedSubmission.cloudLinks.length > 0 && (
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-2xl">☁️</span>
                          <span>Cloud Links ({selectedSubmission.cloudLinks.length})</span>
                        </h3>
                        <div className="space-y-3">
                          {selectedSubmission.cloudLinks.map((link: string, index: number) => {
                            const isGoogleDrive = link.includes('drive.google.com');
                            const isDropbox = link.includes('dropbox.com');
                            const isOneDrive = link.includes('onedrive') || link.includes('sharepoint');

                            return (
                              <div key={index} className="bg-white rounded-xl p-4 flex items-center justify-between border-2 border-purple-200 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                                    isGoogleDrive ? 'bg-blue-100' : isDropbox ? 'bg-blue-50' : isOneDrive ? 'bg-sky-100' : 'bg-gray-100'
                                  }`}>
                                    {isGoogleDrive ? '📁' : isDropbox ? '📦' : isOneDrive ? '☁️' : '🔗'}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-gray-700">
                                      {isGoogleDrive ? 'Google Drive' : isDropbox ? 'Dropbox' : isOneDrive ? 'OneDrive' : 'External Link'}
                                    </div>
                                    <div className="text-xs text-blue-600 truncate">{link}</div>
                                  </div>
                                </div>
                                <a
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-bold rounded-lg transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                                >
                                  🔗 Open
                                </a>
                              </div>
                            );
                          })}
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

                {/* Missing Details Tab */}
                {detailView === 'missing' && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border-2 border-red-200 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3">
                            <span className="text-3xl">⚠️</span>
                            <span>Missing Information</span>
                          </h2>
                          <p className="text-red-700 font-semibold">Fields that need to be filled by the creator</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-red-700 mb-1 uppercase">Completion</div>
                          <div className="text-3xl font-black text-red-900">{selectedSubmission.completeness || 0}%</div>
                        </div>
                      </div>
                    </div>

                    {/* Missing Fields Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Project Information */}
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">📋</span>
                          <span>Project Information</span>
                        </h3>
                        <div className="space-y-2">
                          {!selectedSubmission.projectName && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> Project Name
                            </div>
                          )}
                          {!selectedSubmission.productionCompany && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> Production Company
                            </div>
                          )}
                          {!selectedSubmission.culture && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> Culture
                            </div>
                          )}
                          {!selectedSubmission.format && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> Format
                            </div>
                          )}
                          {!selectedSubmission.genre && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> Genre
                            </div>
                          )}
                          {!selectedSubmission.logline && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> Logline
                            </div>
                          )}
                          {!selectedSubmission.synopsis && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> Synopsis
                            </div>
                          )}
                          {!selectedSubmission.language && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> Language
                            </div>
                          )}
                          {selectedSubmission.projectName && selectedSubmission.productionCompany && selectedSubmission.culture && selectedSubmission.format && selectedSubmission.genre && selectedSubmission.logline && selectedSubmission.synopsis && selectedSubmission.language && (
                            <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 p-3 rounded-lg">
                              <span>✓</span> All project information complete
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Creator Information */}
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">👤</span>
                          <span>Creator Information</span>
                        </h3>
                        <div className="space-y-2">
                          {!selectedSubmission.creator && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> Creator Name
                            </div>
                          )}
                          {!selectedSubmission.officialEmail && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> Official Email
                            </div>
                          )}
                          {!selectedSubmission.phone && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> Phone Number
                            </div>
                          )}
                          {!selectedSubmission.panNumber && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> PAN Number
                            </div>
                          )}
                          {!selectedSubmission.gstNumber && (
                            <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm bg-amber-50 p-2 rounded-lg">
                              <span>⚠</span> GST Number (Optional)
                            </div>
                          )}
                          {!selectedSubmission.permanentAddress && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> Permanent Address
                            </div>
                          )}
                          {selectedSubmission.creator && selectedSubmission.officialEmail && selectedSubmission.phone && selectedSubmission.panNumber && selectedSubmission.permanentAddress && (
                            <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 p-3 rounded-lg">
                              <span>✓</span> All required creator info complete
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Budget Information */}
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">💰</span>
                          <span>Budget Information</span>
                        </h3>
                        <div className="space-y-2">
                          {!selectedSubmission.totalBudget && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> Total Budget
                            </div>
                          )}
                          {(!selectedSubmission.budgetCategories || selectedSubmission.budgetCategories.length === 0) && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> Budget Breakdown
                            </div>
                          )}
                          {(!selectedSubmission.cashFlowTranches || selectedSubmission.cashFlowTranches.length === 0) && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> Cash Flow Tranches
                            </div>
                          )}
                          {selectedSubmission.totalBudget && selectedSubmission.budgetCategories?.length > 0 && selectedSubmission.cashFlowTranches?.length > 0 && (
                            <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 p-3 rounded-lg">
                              <span>✓</span> All budget info complete
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Timeline Information */}
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">📅</span>
                          <span>Timeline Information</span>
                        </h3>
                        <div className="space-y-2">
                          {!selectedSubmission.shootStartDate && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> Shoot Start Date
                            </div>
                          )}
                          {!selectedSubmission.shootEndDate && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> Shoot End Date
                            </div>
                          )}
                          {!selectedSubmission.shootDays && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> Total Shoot Days
                            </div>
                          )}
                          {!selectedSubmission.totalDuration && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> Total Duration
                            </div>
                          )}
                          {selectedSubmission.shootStartDate && selectedSubmission.shootEndDate && selectedSubmission.shootDays && selectedSubmission.totalDuration && (
                            <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 p-3 rounded-lg">
                              <span>✓</span> All timeline info complete
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Crew Information */}
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">🎬</span>
                          <span>Key Crew</span>
                        </h3>
                        <div className="space-y-2">
                          {!selectedSubmission.director && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> Director
                            </div>
                          )}
                          {!selectedSubmission.dop && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> Director of Photography
                            </div>
                          )}
                          {!selectedSubmission.editor && (
                            <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm bg-amber-50 p-2 rounded-lg">
                              <span>⚠</span> Editor (Optional)
                            </div>
                          )}
                          {!selectedSubmission.musicComposer && (
                            <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm bg-amber-50 p-2 rounded-lg">
                              <span>⚠</span> Music Composer (Optional)
                            </div>
                          )}
                          {selectedSubmission.director && selectedSubmission.dop && (
                            <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 p-3 rounded-lg">
                              <span>✓</span> Required crew filled
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Cast Information */}
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">⭐</span>
                          <span>Cast Information</span>
                        </h3>
                        <div className="space-y-2">
                          {(!selectedSubmission.castData || !selectedSubmission.castData.primaryCast || selectedSubmission.castData.primaryCast.length === 0) && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded-lg">
                              <span>✗</span> Primary Cast
                            </div>
                          )}
                          {selectedSubmission.castData?.primaryCast?.length > 0 && (
                            <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 p-3 rounded-lg">
                              <span>✓</span> {selectedSubmission.castData.primaryCast.length} Primary cast added
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Technical Information */}
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">📹</span>
                          <span>Technical Specs</span>
                        </h3>
                        <div className="space-y-2">
                          {(!selectedSubmission.technicalSpecs || !selectedSubmission.technicalSpecs.cameraModel) && (
                            <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm bg-amber-50 p-2 rounded-lg">
                              <span>⚠</span> Camera Model
                            </div>
                          )}
                          {(!selectedSubmission.technicalSpecs || !selectedSubmission.technicalSpecs.cameraSetupType) && (
                            <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm bg-amber-50 p-2 rounded-lg">
                              <span>⚠</span> Camera Setup Type
                            </div>
                          )}
                          {selectedSubmission.technicalSpecs?.cameraModel && selectedSubmission.technicalSpecs?.cameraSetupType && (
                            <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 p-3 rounded-lg">
                              <span>✓</span> Technical specs filled
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Documents */}
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-xl">📁</span>
                          <span>Documents</span>
                        </h3>
                        <div className="space-y-2">
                          {(!selectedSubmission.cloudLinks || selectedSubmission.cloudLinks.length === 0) && (!selectedSubmission.uploadedFiles || selectedSubmission.uploadedFiles.length === 0) && (
                            <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm bg-amber-50 p-2 rounded-lg">
                              <span>⚠</span> No documents uploaded
                            </div>
                          )}
                          {(selectedSubmission.cloudLinks?.length > 0 || selectedSubmission.uploadedFiles?.length > 0) && (
                            <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 p-3 rounded-lg">
                              <span>✓</span> {(selectedSubmission.cloudLinks?.length || 0) + (selectedSubmission.uploadedFiles?.length || 0)} documents attached
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-6 border-2 border-slate-200">
                      <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-xl">📊</span>
                        <span>Submission Summary</span>
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                          <div className="text-xs font-bold text-gray-500 mb-1">Status</div>
                          <div className="text-sm font-black text-gray-900">{getStatusConfig(selectedSubmission.status).text}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                          <div className="text-xs font-bold text-gray-500 mb-1">Submitted</div>
                          <div className="text-sm font-black text-gray-900">{selectedSubmission.submittedDate || selectedSubmission.submitted_at?.split('T')[0] || 'N/A'}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                          <div className="text-xs font-bold text-gray-500 mb-1">Budget</div>
                          <div className="text-sm font-black text-gray-900">{selectedSubmission.totalBudget ? `₹${selectedSubmission.totalBudget.toLocaleString('en-IN')}` : 'Not set'}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                          <div className="text-xs font-bold text-gray-500 mb-1">Shoot Days</div>
                          <div className="text-sm font-black text-gray-900">{selectedSubmission.shootDays || 'Not set'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Agreement Tab */}
                {detailView === 'agreement' && (
                  <div className="space-y-6">
                    {/* Export Header */}
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 text-white shadow-2xl border-2 border-emerald-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">Agreement Export</h2>
                          <p className="text-gray-400 font-semibold">Export all project details for agreement documentation</p>
                        </div>
                        <div className="text-6xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 p-4 rounded-2xl border border-emerald-500/30">📋</div>
                      </div>
                    </div>

                    {/* Export Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => exportToExcel(selectedSubmission)}
                        className="bg-gradient-to-br from-gray-800 to-gray-900 hover:from-emerald-900 hover:to-green-900 border-2 border-emerald-500/50 hover:border-emerald-400 text-white p-6 rounded-2xl font-black text-lg shadow-lg hover:shadow-emerald-500/20 hover:shadow-xl transition-all flex items-center justify-center gap-3"
                      >
                        <span className="text-3xl">📊</span>
                        <div className="text-left">
                          <div className="text-emerald-400">Export to Excel</div>
                          <div className="text-sm font-semibold text-gray-400">Download .xlsx file</div>
                        </div>
                      </button>
                      <button
                        onClick={() => exportToPDF(selectedSubmission)}
                        className="bg-gradient-to-br from-gray-800 to-gray-900 hover:from-red-900 hover:to-pink-900 border-2 border-red-500/50 hover:border-red-400 text-white p-6 rounded-2xl font-black text-lg shadow-lg hover:shadow-red-500/20 hover:shadow-xl transition-all flex items-center justify-center gap-3"
                      >
                        <span className="text-3xl">📄</span>
                        <div className="text-left">
                          <div className="text-red-400">Export to PDF</div>
                          <div className="text-sm font-semibold text-gray-400">Download .pdf file</div>
                        </div>
                      </button>
                    </div>

                    {/* Agreement Preview */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-white/10 shadow-2xl overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-5">
                        <h3 className="text-2xl font-black flex items-center gap-3">
                          <span>📋</span> Agreement Details Preview
                        </h3>
                      </div>
                      <div className="p-6 space-y-6">
                        {/* 1. Agreement Date */}
                        <div className="border-b-2 border-white/10 pb-4">
                          <div className="text-xs font-bold text-emerald-400 uppercase mb-1">1. Agreement Date</div>
                          <div className="text-lg font-bold text-white">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </div>

                        {/* 2. Content Name */}
                        <div className="border-b-2 border-white/10 pb-4">
                          <div className="text-xs font-bold text-emerald-400 uppercase mb-1">2. Content Name</div>
                          <div className="text-lg font-bold text-white">{selectedSubmission.projectName || 'N/A'}</div>
                        </div>

                        {/* 3. Creator/Company Details */}
                        <div className="border-b-2 border-white/10 pb-4">
                          <div className="text-xs font-bold text-emerald-400 uppercase mb-2">3. Creator / Company Details</div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-gray-400">Name:</span> <span className="font-bold text-white">{selectedSubmission.creatorName || selectedSubmission.creator || 'N/A'}</span></div>
                            <div><span className="text-gray-400">Company:</span> <span className="font-bold text-white">{selectedSubmission.productionCompany || 'N/A'}</span></div>
                            <div><span className="text-gray-400">Father's Name:</span> <span className="font-bold text-white">{selectedSubmission.fatherName || 'N/A'}</span></div>
                            <div><span className="text-gray-400">Authorized Signatory:</span> <span className="font-bold text-white">{selectedSubmission.authorizedSignatory || 'N/A'}</span></div>
                            <div className="col-span-2"><span className="text-gray-400">Address:</span> <span className="font-bold text-white">{selectedSubmission.permanentAddress || selectedSubmission.currentAddress || 'N/A'}</span></div>
                            <div><span className="text-gray-400">PAN:</span> <span className="font-bold text-white">{selectedSubmission.panNumber || 'N/A'}</span></div>
                            <div><span className="text-gray-400">GST:</span> <span className="font-bold text-white">{selectedSubmission.gstNumber || 'N/A'}</span></div>
                            <div><span className="text-gray-400">Email:</span> <span className="font-bold text-white">{selectedSubmission.officialEmail || 'N/A'}</span></div>
                            <div><span className="text-gray-400">Phone:</span> <span className="font-bold text-white">{selectedSubmission.phone || 'N/A'}</span></div>
                          </div>
                        </div>

                        {/* 4. Budget */}
                        <div className="border-b-2 border-white/10 pb-4">
                          <div className="text-xs font-bold text-emerald-400 uppercase mb-1">4. Total Budget</div>
                          <div className="text-2xl font-black text-emerald-400">{formatBudget(selectedSubmission.totalBudget || selectedSubmission.estimatedBudget || 0)}</div>
                        </div>

                        {/* 4.1 Detailed Budget Breakdown */}
                        {selectedSubmission.budgetCategories && selectedSubmission.budgetCategories.length > 0 && (
                          <div className="border-b-2 border-white/10 pb-4">
                            <div className="text-xs font-bold text-emerald-400 uppercase mb-3">4.1 Detailed Budget Breakdown (Department-wise)</div>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                              {selectedSubmission.budgetCategories.filter((cat: any) => cat.amount > 0 || (cat.items && cat.items.some((item: any) => item.total > 0))).map((category: any, catIndex: number) => {
                                const filledItems = category.items?.filter((item: any) => item.total > 0 || item.description) || [];
                                return (
                                  <div key={catIndex} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                                    <div className="bg-white/10 px-4 py-2 flex items-center justify-between">
                                      <span className="font-bold text-white flex items-center gap-2">
                                        <span>{category.icon || '📁'}</span>
                                        {category.name}
                                      </span>
                                      <span className="font-black text-emerald-400">₹{(category.amount || 0).toLocaleString('en-IN')}</span>
                                    </div>
                                    {filledItems.length > 0 && (
                                      <div className="p-3">
                                        <table className="w-full text-xs">
                                          <thead>
                                            <tr className="text-gray-400">
                                              <th className="text-left p-1">Item</th>
                                              <th className="text-center p-1">Days</th>
                                              <th className="text-center p-1">Qty</th>
                                              <th className="text-right p-1">Per Day</th>
                                              <th className="text-right p-1">Lumpsum</th>
                                              <th className="text-right p-1">Total</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {filledItems.map((item: any, itemIdx: number) => (
                                              <tr key={itemIdx} className="text-gray-300 border-t border-white/5">
                                                <td className="p-1 text-white">{item.description || 'N/A'}</td>
                                                <td className="p-1 text-center">{item.noOfDays || item.days || '-'}</td>
                                                <td className="p-1 text-center">{item.noOfPeople || item.people || item.noOfRooms || '-'}</td>
                                                <td className="p-1 text-right">{item.perDay ? `₹${item.perDay.toLocaleString('en-IN')}` : '-'}</td>
                                                <td className="p-1 text-right">{(item.lumpsumFixed || item.lumpsum) ? `₹${(item.lumpsumFixed || item.lumpsum).toLocaleString('en-IN')}` : '-'}</td>
                                                <td className="p-1 text-right font-bold text-emerald-400">₹{(item.total || 0).toLocaleString('en-IN')}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            <div className="mt-4 bg-emerald-500/20 border border-emerald-400/30 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white">Grand Total (All Departments)</span>
                                <span className="text-2xl font-black text-emerald-400">
                                  ₹{(selectedSubmission.budgetCategories.reduce((sum: number, cat: any) => sum + (cat.amount || 0), 0)).toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 5. Director & Writer */}
                        <div className="border-b-2 border-white/10 pb-4">
                          <div className="text-xs font-bold text-emerald-400 uppercase mb-2">5. Director & Writer</div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-gray-400">Director:</span> <span className="font-bold text-white">{selectedSubmission.director || 'N/A'}</span></div>
                            <div><span className="text-gray-400">Story By:</span> <span className="font-bold text-white">{selectedSubmission.storyBy || 'N/A'}</span></div>
                            <div><span className="text-gray-400">Screenplay:</span> <span className="font-bold text-white">{selectedSubmission.screenplayBy || 'N/A'}</span></div>
                            <div><span className="text-gray-400">Dialogues:</span> <span className="font-bold text-white">{selectedSubmission.dialoguesBy || 'N/A'}</span></div>
                          </div>
                        </div>

                        {/* 6. Content Duration & Episodes */}
                        <div className="border-b-2 border-white/10 pb-4">
                          <div className="text-xs font-bold text-emerald-400 uppercase mb-2">6. Total Minutes of Content & Episodes</div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div><span className="text-gray-400">Total Duration:</span> <span className="font-bold text-white">{selectedSubmission.totalDuration || 'N/A'} mins</span></div>
                            <div><span className="text-gray-400">Episodes:</span> <span className="font-bold text-white">{selectedSubmission.episodes || selectedSubmission.episodesPerSeason || 'N/A'}</span></div>
                            <div><span className="text-gray-400">Format:</span> <span className="font-bold text-white">{selectedSubmission.format || 'N/A'}</span></div>
                          </div>
                        </div>

                        {/* 7. Project Delivery Date */}
                        <div className="border-b-2 border-white/10 pb-4">
                          <div className="text-xs font-bold text-emerald-400 uppercase mb-2">7. Project Delivery Date</div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div><span className="text-gray-400">Final Delivery:</span> <span className="font-bold text-white">{selectedSubmission.contentTimeline?.finalDeliveryDate || 'N/A'}</span></div>
                            <div><span className="text-gray-400">Shoot Start:</span> <span className="font-bold text-white">{selectedSubmission.shootStartDate || 'N/A'}</span></div>
                            <div><span className="text-gray-400">Shoot End:</span> <span className="font-bold text-white">{selectedSubmission.shootEndDate || 'N/A'}</span></div>
                          </div>
                        </div>

                        {/* 8. Cash Flow / Payment Terms */}
                        <div className="border-b-2 border-white/10 pb-4">
                          <div className="text-xs font-bold text-emerald-400 uppercase mb-3">8. Cash Flow (Payment Terms)</div>
                          {selectedSubmission.cashFlowTranches && selectedSubmission.cashFlowTranches.length > 0 ? (
                            <div className="space-y-3">
                              {selectedSubmission.cashFlowTranches.map((tranche: any, idx: number) => (
                                <div key={idx} className="bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-xl overflow-hidden">
                                  {/* Tranche Header */}
                                  <div className="bg-gradient-to-r from-emerald-600/30 to-green-600/30 px-4 py-3 flex items-center justify-between border-b border-white/10">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-black text-sm">
                                        {idx + 1}
                                      </div>
                                      <span className="font-black text-white">{tranche.name || tranche.milestone || `Tranche ${idx + 1}`}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <span className="bg-emerald-500/20 border border-emerald-400/50 px-3 py-1 rounded-full text-emerald-400 font-black text-sm">
                                        {tranche.percentage}%
                                      </span>
                                      <span className="font-black text-emerald-400 text-lg">
                                        {formatBudget(tranche.amount || 0)}
                                      </span>
                                    </div>
                                  </div>
                                  {/* Tranche Details */}
                                  <div className="p-4 space-y-3">
                                    {/* Description */}
                                    <div>
                                      <div className="text-xs font-bold text-gray-500 uppercase mb-1">Description / Terms</div>
                                      <p className="text-gray-300 text-sm font-semibold leading-relaxed">
                                        {tranche.description || 'No description provided'}
                                      </p>
                                    </div>
                                    {/* Payment Breakdown */}
                                    <div className="grid grid-cols-3 gap-3">
                                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                                        <div className="text-xs font-bold text-gray-500 uppercase">Base Amount</div>
                                        <div className="text-white font-black">{formatBudget(tranche.amount || 0)}</div>
                                      </div>
                                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                                        <div className="text-xs font-bold text-gray-500 uppercase">GST @ 18%</div>
                                        <div className="text-amber-400 font-black">{formatBudget(Math.round((tranche.amount || 0) * 0.18))}</div>
                                      </div>
                                      <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-lg p-3">
                                        <div className="text-xs font-bold text-emerald-400 uppercase">Total with GST</div>
                                        <div className="text-emerald-400 font-black">{formatBudget(Math.round((tranche.amount || 0) * 1.18))}</div>
                                      </div>
                                    </div>
                                    {/* Expected Date & Status */}
                                    <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                                      {tranche.expectedDate && (
                                        <div className="flex items-center gap-2">
                                          <span className="text-gray-500 text-xs font-bold">Expected Date:</span>
                                          <span className="text-white font-bold text-sm">{tranche.expectedDate}</span>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-2">
                                        <span className="text-gray-500 text-xs font-bold">Status:</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                          tranche.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                          tranche.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                                          'bg-gray-500/20 text-gray-400'
                                        }`}>
                                          {tranche.status === 'completed' ? '✅ Completed' :
                                           tranche.status === 'in-progress' ? '🔄 In Progress' :
                                           '⏳ Pending'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {/* Total Summary */}
                              <div className="bg-gradient-to-r from-emerald-600/30 to-green-600/30 border-2 border-emerald-400/50 rounded-xl p-4 mt-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-white font-black text-lg">Total Payment</span>
                                  <div className="text-right">
                                    <div className="text-emerald-400 font-black text-2xl">
                                      {formatBudget(Math.round(selectedSubmission.cashFlowTranches.reduce((sum: number, t: any) => sum + (t.amount || 0), 0) * 1.18))}
                                    </div>
                                    <div className="text-gray-400 text-xs font-bold">Including 18% GST</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-500">No cash flow tranches defined</div>
                          )}
                        </div>

                        {/* 9. Content Creation Schedule */}
                        <div className="border-b-2 border-white/10 pb-4">
                          <div className="text-xs font-bold text-emerald-400 uppercase mb-2">9. Content Creation Schedule</div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-gray-400">Pre-Production:</span> <span className="font-bold text-white">{selectedSubmission.contentTimeline?.preProductionStart || 'N/A'} - {selectedSubmission.contentTimeline?.preProductionEnd || 'N/A'}</span></div>
                            <div><span className="text-gray-400">Principal Photography:</span> <span className="font-bold text-white">{selectedSubmission.shootStartDate || 'N/A'} - {selectedSubmission.shootEndDate || 'N/A'}</span></div>
                            <div><span className="text-gray-400">Post-Production:</span> <span className="font-bold text-white">{selectedSubmission.contentTimeline?.postProductionStart || 'N/A'} - {selectedSubmission.contentTimeline?.postProductionEnd || 'N/A'}</span></div>
                            <div><span className="text-gray-400">Shoot Days:</span> <span className="font-bold text-white">{selectedSubmission.shootDays || 'N/A'} days</span></div>
                          </div>
                        </div>

                        {/* 10. Technical Specifications */}
                        <div className="border-b-2 border-white/10 pb-4">
                          <div className="text-xs font-bold text-emerald-400 uppercase mb-2">10. Technical Specifications</div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-gray-400">Camera:</span> <span className="font-bold text-white">{selectedSubmission.technicalSpecs?.cameraModel || 'N/A'}</span></div>
                            <div><span className="text-gray-400">Setup:</span> <span className="font-bold text-white">{selectedSubmission.technicalSpecs?.cameraSetupType || 'N/A'}</span></div>
                            <div><span className="text-gray-400">Lenses:</span> <span className="font-bold text-white">{selectedSubmission.technicalSpecs?.lensTypes?.length || 0} types</span></div>
                            <div><span className="text-gray-400">Lighting:</span> <span className="font-bold text-white">{selectedSubmission.technicalSpecs?.lightingEquipment?.length || 0} items</span></div>
                          </div>
                        </div>

                        {/* 11. Budget Sheet Summary */}
                        <div>
                          <div className="text-xs font-bold text-emerald-400 uppercase mb-2">11. Budget Sheet (Category-wise)</div>
                          {selectedSubmission.budgetBreakdown && selectedSubmission.budgetBreakdown.length > 0 ? (
                            <div className="space-y-2">
                              {selectedSubmission.budgetBreakdown.slice(0, 5).map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between bg-white/5 border border-white/10 p-3 rounded-lg">
                                  <span className="font-semibold text-gray-300">{item.category}</span>
                                  <span className="font-bold text-cyan-400">{formatBudget(item.amount || 0)}</span>
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

                {/* Activity Log Tab */}
                {detailView === 'activity' && (
                  <div className="space-y-6">
                    {/* Activity Log Header */}
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 text-white shadow-2xl border-2 border-blue-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Activity Log</h2>
                          <p className="text-gray-400 font-semibold">Track all updates, actions & feedback for this project</p>
                        </div>
                        <div className="text-6xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-4 rounded-2xl border border-blue-500/30">📋</div>
                      </div>
                    </div>

                    {/* Project Status Summary */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-white/10 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Current Status</h3>
                        <span className={`px-4 py-2 rounded-full text-sm font-black ${getStatusConfig(selectedSubmission.status).badge}`}>
                          {getStatusConfig(selectedSubmission.status).text}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="text-xs text-gray-500 font-bold uppercase">Submitted</div>
                          <div className="text-white font-bold">{formatDate(selectedSubmission.submittedDate)}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="text-xs text-gray-500 font-bold uppercase">Production POC</div>
                          <div className="text-white font-bold">{selectedSubmission.productionPOC || 'Not Assigned'}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="text-xs text-gray-500 font-bold uppercase">Content POC</div>
                          <div className="text-white font-bold">{selectedSubmission.contentPOC || 'Not Assigned'}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="text-xs text-gray-500 font-bold uppercase">Days Since Submission</div>
                          <div className="text-white font-bold">{Math.floor((new Date().getTime() - new Date(selectedSubmission.submittedDate).getTime()) / (1000 * 60 * 60 * 24))} days</div>
                        </div>
                      </div>
                    </div>

                    {/* Activity Timeline */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-white/10 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-5">
                        <h3 className="text-xl font-black flex items-center gap-3">
                          <span>📜</span> Activity Timeline
                        </h3>
                      </div>
                      <div className="p-6">
                        {/* Activity Items */}
                        <div className="space-y-0">
                          {/* Generate activity from available data */}
                          {(() => {
                            const activities: { date: string; time: string; action: string; description: string; user: string; type: string; timestamp?: string; changes?: any[] }[] = [];

                            // 1. Load real activity logs from localStorage
                            const savedLogs = getActivityLogs(selectedSubmission.id);
                            if (savedLogs && savedLogs.length > 0) {
                              activities.push(...savedLogs);
                            }

                            // 2. Load change history from submission
                            if (selectedSubmission.changeHistory && selectedSubmission.changeHistory.length > 0) {
                              selectedSubmission.changeHistory.forEach((change: any) => {
                                activities.push({
                                  date: formatDate(change.timestamp),
                                  time: new Date(change.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
                                  action: change.changedBy === 'creator' ? 'Creator Updated Project' : 'Project Updated',
                                  description: change.summary || `${change.changes?.length || 0} field(s) changed`,
                                  user: change.changedBy === 'creator' ? (selectedSubmission.creator || 'Creator') : 'Admin',
                                  type: 'edit',
                                  timestamp: change.timestamp,
                                  changes: change.changes
                                });
                              });
                            }

                            // 3. If no activities, add default submission entry
                            if (activities.length === 0) {
                              // Add initial submission entry
                              activities.push({
                                date: formatDate(selectedSubmission.submittedDate),
                                time: new Date(selectedSubmission.submittedDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
                                action: 'Project Submitted',
                                description: `Project "${selectedSubmission.projectName}" submitted for review`,
                                user: selectedSubmission.creator || 'Creator',
                                type: 'submit',
                                timestamp: selectedSubmission.submittedDate
                              });
                            }

                            // 4. Sort by timestamp (newest first)
                            activities.sort((a, b) => {
                              const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                              const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                              return dateB - dateA;
                            });

                            return activities.length > 0 ? activities.map((activity, index) => (
                              <div key={index} className="flex gap-4 relative">
                                {/* Timeline Line */}
                                {index < activities.length - 1 && (
                                  <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-transparent"></div>
                                )}

                                {/* Icon */}
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                                  activity.type === 'submit' ? 'bg-green-500/20 border-2 border-green-500 text-green-400' :
                                  activity.type === 'status' ? 'bg-blue-500/20 border-2 border-blue-500 text-blue-400' :
                                  activity.type === 'edit' ? 'bg-orange-500/20 border-2 border-orange-500 text-orange-400' :
                                  activity.type === 'assign' ? 'bg-purple-500/20 border-2 border-purple-500 text-purple-400' :
                                  activity.type === 'feedback' ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-400' :
                                  activity.type === 'review' ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400' :
                                  activity.type === 'access' ? 'bg-teal-500/20 border-2 border-teal-500 text-teal-400' :
                                  activity.type === 'note' ? 'bg-indigo-500/20 border-2 border-indigo-500 text-indigo-400' :
                                  activity.type === 'issue' ? 'bg-red-500/20 border-2 border-red-500 text-red-400' :
                                  'bg-gray-500/20 border-2 border-gray-500 text-gray-400'
                                }`}>
                                  {activity.type === 'submit' ? '📤' :
                                   activity.type === 'status' ? '🔄' :
                                   activity.type === 'edit' ? '✏️' :
                                   activity.type === 'assign' ? '👤' :
                                   activity.type === 'feedback' ? '💬' :
                                   activity.type === 'review' ? '👁️' :
                                   activity.type === 'access' ? '🔐' :
                                   activity.type === 'note' ? '📌' :
                                   activity.type === 'issue' ? '⚠️' : '📋'}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-6">
                                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-white font-bold">{activity.action}</span>
                                      <span className="text-gray-500 text-xs font-semibold">{activity.date} • {activity.time}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-2">{activity.description}</p>

                                    {/* Show changes if available */}
                                    {activity.changes && activity.changes.length > 0 && (
                                      <div className="mt-3 bg-black/30 rounded-lg p-3 space-y-2 border border-orange-500/30">
                                        <div className="text-xs font-bold text-orange-400 mb-2 flex items-center gap-2">
                                          <span>📝</span> Fields Changed:
                                        </div>
                                        {activity.changes.map((change: any, idx: number) => (
                                          <div key={idx} className="text-xs py-1 border-b border-white/5 last:border-0">
                                            <span className="text-gray-400 font-semibold">{change.label}:</span>
                                            <div className="flex items-center gap-2 mt-1 ml-4">
                                              <span className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded line-through">
                                                {String(change.oldValue).substring(0, 40)}{String(change.oldValue).length > 40 ? '...' : ''}
                                              </span>
                                              <span className="text-gray-500">→</span>
                                              <span className="text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                                                {String(change.newValue).substring(0, 40)}{String(change.newValue).length > 40 ? '...' : ''}
                                              </span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    <div className="flex items-center gap-2 mt-2">
                                      <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-300 font-semibold">
                                        By: {activity.user}
                                      </span>
                                      {activity.type === 'edit' && (
                                        <span className="text-xs px-2 py-1 bg-orange-500/20 rounded-full text-orange-400 font-semibold">
                                          Creator Edit
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )) : (
                              <div className="text-center py-8 text-gray-500">
                                <span className="text-4xl mb-4 block">📋</span>
                                <p className="font-semibold">No activity recorded yet</p>
                                <p className="text-sm">Activities will appear here as actions are taken</p>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Add Activity Note */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-white/10 p-6">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span>📝</span> Add Activity Note
                      </h3>
                      <div className="space-y-4">
                        <textarea
                          value={activityNote}
                          onChange={(e) => setActivityNote(e.target.value)}
                          placeholder="Add a note, feedback, or update about this project..."
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                          rows={3}
                        ></textarea>
                        <div className="flex items-center gap-3">
                          <select
                            value={activityNoteType}
                            onChange={(e) => setActivityNoteType(e.target.value)}
                            className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                          >
                            <option value="note">📌 General Note</option>
                            <option value="feedback">💬 Feedback</option>
                            <option value="review">👁️ Review Update</option>
                            <option value="issue">⚠️ Issue/Concern</option>
                          </select>
                          <button
                            onClick={() => {
                              if (activityNote.trim() && selectedSubmission) {
                                const actionLabels: { [key: string]: string } = {
                                  note: 'Note Added',
                                  feedback: 'Feedback Added',
                                  review: 'Review Update',
                                  issue: 'Issue Reported'
                                };
                                addActivityLog(
                                  selectedSubmission.id,
                                  actionLabels[activityNoteType] || 'Note Added',
                                  activityNote.trim(),
                                  activityNoteType
                                );
                                setActivityNote('');
                                setActivityNoteType('note');
                                // Force re-render by updating selectedSubmission
                                setSelectedSubmission({...selectedSubmission});
                              }
                            }}
                            disabled={!activityNote.trim()}
                            className={`px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold rounded-lg transition-all ${!activityNote.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            Add Note
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="flex-shrink-0 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-xl border-t border-white/10 p-3 md:p-4">
                <div className="flex items-center gap-2 md:gap-3">
                  {/* Close Button */}
                  <button
                    onClick={() => {
                      setSelectedSubmission(null);
                      setDetailView('overview');
                    }}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-lg border border-white/20 transition-all"
                  >
                    Close
                  </button>

                  {/* Current Status Display */}
                  <div className={`px-4 py-2.5 rounded-lg border-2 flex items-center gap-2 ${getStatusConfig(selectedSubmission.status).badge}`}>
                    <span className="text-lg">{getStatusConfig(selectedSubmission.status).icon.split(' ')[0]}</span>
                    <span className="font-black text-sm">{getStatusConfig(selectedSubmission.status).text}</span>
                  </div>

                  {/* Change Status Button - Opens Modal with All Options */}
                  <button
                    onClick={() => setShowStatusMenu(selectedSubmission.id)}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-black rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>🔄</span>
                    <span>Change Status</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Quick Status Actions - Context Aware */}
                  {selectedSubmission.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(selectedSubmission.id, 'under-review')}
                      className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-sm font-black rounded-lg shadow-lg transition-all"
                    >
                      👁️ Start Review
                    </button>
                  )}

                  {selectedSubmission.status === 'under-review' && (
                    <button
                      onClick={() => handleStatusChange(selectedSubmission.id, 'approved')}
                      className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-black rounded-lg shadow-lg transition-all"
                    >
                      ✅ Approve
                    </button>
                  )}

                  {selectedSubmission.status === 'approved' && (
                    <button
                      onClick={() => handleStatusChange(selectedSubmission.id, 'agreement-signed')}
                      className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white text-sm font-black rounded-lg shadow-lg transition-all"
                    >
                      📄 Sign Agreement
                    </button>
                  )}

                  {selectedSubmission.status === 'agreement-signed' && (
                    <button
                      onClick={() => handleStatusChange(selectedSubmission.id, 'in-production')}
                      className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-sm font-black rounded-lg shadow-lg transition-all"
                    >
                      🎬 Start Production
                    </button>
                  )}

                  {/* Delete Button - Always Available */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDeleteConfirm(selectedSubmission.id)}
                      className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-black rounded-lg shadow-lg transition-all border-2 border-red-500"
                      title="Delete Project"
                    >
                      🗑️
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

        {/* Edit Access Requests Slide Panel */}
        {showEditRequestsPanel && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowEditRequestsPanel(false)}
            ></div>

            {/* Panel */}
            <div className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 to-gray-800 h-full overflow-y-auto border-l border-white/10 shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">✏️</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">Edit Access Requests</h3>
                      <p className="text-purple-200 text-sm font-semibold">
                        {pendingEditRequestsCount} pending request{pendingEditRequestsCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowEditRequestsPanel(false)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                  >
                    <span className="text-xl">✕</span>
                  </button>
                </div>
              </div>

              {/* Requests List */}
              <div className="p-6 space-y-4">
                {editAccessRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="text-6xl">📭</span>
                    <p className="text-gray-400 mt-4 font-semibold">No edit access requests</p>
                    <p className="text-gray-500 text-sm">Requests will appear here when creators need to edit locked projects</p>
                  </div>
                ) : (
                  <>
                    {/* Pending Requests */}
                    {editAccessRequests.filter(r => r.status === 'pending').length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-bold text-yellow-400 mb-3 flex items-center gap-2">
                          <span>⏳</span> Pending Requests
                        </h4>
                        {editAccessRequests
                          .filter(r => r.status === 'pending')
                          .map((request) => (
                            <div key={request.id} className="bg-yellow-500/10 border-2 border-yellow-500/50 rounded-xl p-4 mb-3">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h5 className="text-white font-black">{request.projectName}</h5>
                                  <p className="text-gray-400 text-sm">{request.creatorEmail}</p>
                                </div>
                                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full">
                                  PENDING
                                </span>
                              </div>
                              <div className="bg-white/5 rounded-lg p-3 mb-3">
                                <p className="text-sm text-gray-300 font-semibold">Reason for Request:</p>
                                <p className="text-white text-sm mt-1">{request.reason}</p>
                              </div>
                              <div className="text-xs text-gray-500 mb-4">
                                Requested: {new Date(request.requestedAt).toLocaleString('en-IN')}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleGrantEditAccess(request)}
                                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg transition-all"
                                >
                                  ✅ Grant Access
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt('Enter reason for denying (optional):');
                                    handleDenyEditAccess(request, reason || '');
                                  }}
                                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold rounded-lg transition-all border border-red-500/50"
                                >
                                  ❌ Deny
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Approved Requests (with Revoke option) */}
                    {editAccessRequests.filter(r => r.status === 'approved').length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
                          <span>✅</span> Granted Access
                        </h4>
                        {editAccessRequests
                          .filter(r => r.status === 'approved')
                          .map((request) => (
                            <div key={request.id} className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-3">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h5 className="text-white font-bold">{request.projectName}</h5>
                                  <p className="text-gray-400 text-sm">{request.creatorEmail}</p>
                                </div>
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                                  GRANTED
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mb-3">
                                Granted: {request.respondedAt ? new Date(request.respondedAt).toLocaleString('en-IN') : 'N/A'}
                              </div>
                              <button
                                onClick={() => handleRevokeEditAccess(request.projectId)}
                                className="w-full px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-bold rounded-lg transition-all border border-orange-500/50"
                              >
                                🔒 Revoke Access
                              </button>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Denied/Revoked Requests */}
                    {editAccessRequests.filter(r => r.status === 'denied' || r.status === 'revoked').length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
                          <span>📋</span> History
                        </h4>
                        {editAccessRequests
                          .filter(r => r.status === 'denied' || r.status === 'revoked')
                          .slice(0, 5)
                          .map((request) => (
                            <div key={request.id} className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3 opacity-70">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h5 className="text-white font-semibold">{request.projectName}</h5>
                                  <p className="text-gray-500 text-xs">{request.creatorEmail}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                  request.status === 'denied'
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-orange-500/20 text-orange-400'
                                }`}>
                                  {request.status === 'denied' ? 'DENIED' : 'REVOKED'}
                                </span>
                              </div>
                              {request.adminMessage && (
                                <p className="text-gray-400 text-xs mt-1">Reason: {request.adminMessage}</p>
                              )}
                              <div className="text-xs text-gray-600 mt-2">
                                {request.respondedAt ? new Date(request.respondedAt).toLocaleString('en-IN') : 'N/A'}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notifications Slide Panel */}
        {showNotificationsPanel && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowNotificationsPanel(false)}
            ></div>

            {/* Panel */}
            <div className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 to-gray-800 h-full overflow-y-auto border-l border-white/10 shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-red-500 to-pink-600 p-6 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🔔</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">New Submissions</h3>
                      <p className="text-red-200 text-sm font-semibold">
                        {newSubmissionsCount > 0 ? `${newSubmissionsCount} new project${newSubmissionsCount !== 1 ? 's' : ''}` : 'All caught up!'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowNotificationsPanel(false)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                  >
                    <span className="text-xl">✕</span>
                  </button>
                </div>
                {/* Action Buttons - Always visible */}
                <div className="space-y-2 mt-4">
                  <div className="flex gap-2">
                    {newSubmissionsCount > 0 && (
                      <button
                        onClick={() => {
                          // Mark all as viewed at once
                          const newSubmissionIds = submissions
                            .filter(s => isNewSubmission(s.submittedDate, s.id))
                            .map(s => s.id);

                          setViewedProjects(prev => {
                            const newSet = new Set(prev);
                            newSubmissionIds.forEach(id => newSet.add(id));
                            // Save to localStorage
                            if (typeof window !== 'undefined') {
                              localStorage.setItem('stage_viewed_projects', JSON.stringify([...newSet]));
                            }
                            return newSet;
                          });
                        }}
                        className="flex-1 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-bold rounded-lg transition-all"
                      >
                        ✓ Mark all as seen
                      </button>
                    )}
                    <button
                      onClick={() => {
                        // Mark ALL submissions as seen (clear all from notifications)
                        const allIds = submissions.map(s => s.id);
                        setViewedProjects(prev => {
                          const newSet = new Set(prev);
                          allIds.forEach(id => newSet.add(id));
                          if (typeof window !== 'undefined') {
                            localStorage.setItem('stage_viewed_projects', JSON.stringify([...newSet]));
                          }
                          return newSet;
                        });
                      }}
                      className={`${newSubmissionsCount > 0 ? 'flex-1' : 'w-full'} px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 text-sm font-bold rounded-lg transition-all`}
                    >
                      🗑️ Clear all
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      // Reset viewed projects list (will show as new again)
                      setViewedProjects(new Set());
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem('stage_viewed_projects');
                      }
                    }}
                    className="w-full px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-sm font-bold rounded-lg transition-all border border-orange-500/30"
                  >
                    🔄 Reset notifications
                  </button>
                </div>
              </div>

              {/* Submissions List */}
              <div className="p-4">
                {newSubmissionsCount === 0 ? (
                  <div className="text-center py-16">
                    <span className="text-6xl">📭</span>
                    <p className="text-gray-400 mt-4 font-bold text-lg">No new submissions</p>
                    <p className="text-gray-500 text-sm mt-2">New project submissions will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {submissions
                      .filter(s => isNewSubmission(s.submittedDate, s.id))
                      .map((submission) => (
                        <div
                          key={submission.id}
                          onClick={() => {
                            markAsViewed(submission.id);
                            setSelectedSubmission(submission);
                            setShowNotificationsPanel(false);
                            setActiveTab('submissions');
                          }}
                          className="p-4 rounded-xl cursor-pointer transition-all bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-black text-lg">
                                {(submission.projectName || 'U')[0].toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-white font-bold truncate">{submission.projectName}</h4>
                                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">NEW</span>
                              </div>
                              <p className="text-gray-400 text-sm mt-1">
                                {submission.creator} • {submission.culture}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-red-400 font-bold text-sm">{formatBudget(submission.totalBudget)}</span>
                                <span className="text-gray-500 text-xs">{getTimeElapsed(submission.submittedDate)}</span>
                              </div>
                            </div>
                            <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* Recent Submissions Section */}
                <div className="mt-6">
                  <h4 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
                    <span>📋</span> Recent Submissions
                  </h4>
                  <div className="space-y-2">
                    {submissions
                      .filter(s => !isNewSubmission(s.submittedDate, s.id))
                      .slice(0, 5)
                      .map((submission) => (
                        <div
                          key={submission.id}
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowNotificationsPanel(false);
                            setActiveTab('submissions');
                          }}
                          className="p-3 rounded-lg cursor-pointer transition-all bg-white/5 border border-white/10 hover:bg-white/10"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-sm">
                                {(submission.projectName || 'U')[0].toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-gray-300 font-semibold text-sm truncate">{submission.projectName}</h5>
                              <p className="text-gray-500 text-xs">{submission.culture} • {getTimeElapsed(submission.submittedDate)}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                              submission.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                              submission.status === 'in-production' ? 'bg-purple-500/20 text-purple-400' :
                              submission.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                              submission.status === 'under-review' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {submission.status?.replace('-', ' ').toUpperCase() || 'PENDING'}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Change Modal with Comment */}
        {showStatusChangeModal && pendingStatusChange && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-white/10">
              {/* Modal Header */}
              <div className={`p-6 ${
                pendingStatusChange.newStatus === 'approved' ? 'bg-gradient-to-r from-green-600 to-emerald-600' :
                pendingStatusChange.newStatus === 'in-production' ? 'bg-gradient-to-r from-cyan-600 to-blue-600' :
                pendingStatusChange.newStatus === 'revision-requested' ? 'bg-gradient-to-r from-orange-600 to-amber-600' :
                pendingStatusChange.newStatus === 'rejected' || pendingStatusChange.newStatus === 'scrapped' ? 'bg-gradient-to-r from-red-600 to-pink-600' :
                'bg-gradient-to-r from-purple-600 to-pink-600'
              }`}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-3xl">
                      {pendingStatusChange.newStatus === 'approved' ? '✅' :
                       pendingStatusChange.newStatus === 'in-production' ? '🎬' :
                       pendingStatusChange.newStatus === 'revision-requested' ? '📝' :
                       pendingStatusChange.newStatus === 'rejected' || pendingStatusChange.newStatus === 'scrapped' ? '❌' :
                       pendingStatusChange.newStatus === 'on-hold' ? '⏸️' :
                       pendingStatusChange.newStatus === 'under-review' ? '👁️' :
                       '📋'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Change Status</h3>
                    <p className="text-white/80 text-sm font-semibold">
                      {submissions.find(s => s.id === pendingStatusChange.submissionId)?.projectName || 'Project'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* Status Change Info */}
                <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 font-semibold mb-1">Current</div>
                      <div className="px-3 py-1.5 bg-gray-600/50 text-gray-300 font-bold rounded-lg text-sm">
                        {submissions.find(s => s.id === pendingStatusChange.submissionId)?.status?.toUpperCase().replace('-', ' ') || 'PENDING'}
                      </div>
                    </div>
                    <div className="text-2xl text-gray-500">→</div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 font-semibold mb-1">New Status</div>
                      <div className={`px-3 py-1.5 font-bold rounded-lg text-sm ${
                        pendingStatusChange.newStatus === 'approved' ? 'bg-green-500/30 text-green-300' :
                        pendingStatusChange.newStatus === 'in-production' ? 'bg-cyan-500/30 text-cyan-300' :
                        pendingStatusChange.newStatus === 'revision-requested' ? 'bg-orange-500/30 text-orange-300' :
                        pendingStatusChange.newStatus === 'rejected' || pendingStatusChange.newStatus === 'scrapped' ? 'bg-red-500/30 text-red-300' :
                        pendingStatusChange.newStatus === 'on-hold' ? 'bg-gray-500/30 text-gray-300' :
                        'bg-blue-500/30 text-blue-300'
                      }`}>
                        {pendingStatusChange.newStatus.toUpperCase().replace('-', ' ')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comment Field */}
                <div className="mb-6">
                  <label className="block text-white font-bold mb-2">
                    💬 Add Comment for Creator
                    <span className="text-gray-400 font-normal text-sm ml-2">(Optional)</span>
                  </label>
                  <textarea
                    value={statusChangeComment}
                    onChange={(e) => setStatusChangeComment(e.target.value)}
                    placeholder={
                      pendingStatusChange.newStatus === 'revision-requested'
                        ? "Please describe what changes or revisions are needed..."
                        : pendingStatusChange.newStatus === 'approved'
                        ? "Add any feedback or congratulations message..."
                        : pendingStatusChange.newStatus === 'rejected' || pendingStatusChange.newStatus === 'scrapped'
                        ? "Provide reason for rejection (if any)..."
                        : "Add any notes or comments for the creator..."
                    }
                    rows={4}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all resize-none"
                  />
                  <p className="text-gray-500 text-xs mt-2">
                    This comment will be visible to the creator in their activity log and notifications.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowStatusChangeModal(false);
                      setStatusChangeComment('');
                      setPendingStatusChange(null);
                    }}
                    className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmStatusChange}
                    className={`flex-1 px-4 py-3 font-black rounded-xl transition-all shadow-lg hover:shadow-xl ${
                      pendingStatusChange.newStatus === 'approved' ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' :
                      pendingStatusChange.newStatus === 'in-production' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700' :
                      pendingStatusChange.newStatus === 'revision-requested' ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700' :
                      pendingStatusChange.newStatus === 'rejected' || pendingStatusChange.newStatus === 'scrapped' ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700' :
                      'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                    } text-white`}
                  >
                    Confirm Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Creator Updates Panel */}
        {showCreatorUpdatesPanel && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowCreatorUpdatesPanel(false)}
            ></div>

            {/* Panel */}
            <div className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 to-gray-800 h-full overflow-y-auto border-l border-white/10 shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 p-6 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📝</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">Creator Updates</h3>
                      <p className="text-blue-200 text-sm font-semibold">
                        {adminNotifications.filter(n => !n.read).length} unread update{adminNotifications.filter(n => !n.read).length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCreatorUpdatesPanel(false)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                  >
                    <span className="text-xl">✕</span>
                  </button>
                </div>
                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      const updated = adminNotifications.map(n => ({ ...n, read: true }));
                      setAdminNotifications(updated);
                      localStorage.setItem('stage_admin_notifications', JSON.stringify(updated));
                    }}
                    className="flex-1 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-bold rounded-lg transition-all"
                  >
                    ✓ Mark all as read
                  </button>
                  <button
                    onClick={() => {
                      setAdminNotifications([]);
                      localStorage.setItem('stage_admin_notifications', JSON.stringify([]));
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 text-sm font-bold rounded-lg transition-all"
                  >
                    🗑️ Clear
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="p-4 space-y-3">
                {adminNotifications.length === 0 ? (
                  <div className="text-center py-16">
                    <span className="text-6xl">📭</span>
                    <p className="text-gray-400 mt-4 font-bold text-lg">No creator updates</p>
                    <p className="text-gray-500 text-sm mt-2">Updates from creators will appear here</p>
                  </div>
                ) : (
                  adminNotifications.map((notif: any) => (
                    <div
                      key={notif.id}
                      className={`rounded-xl p-4 border-2 transition-all cursor-pointer ${
                        notif.read
                          ? 'bg-white/5 border-white/10'
                          : 'bg-blue-500/10 border-blue-500/50'
                      }`}
                      onClick={() => {
                        // Mark as read
                        const updated = adminNotifications.map(n =>
                          n.id === notif.id ? { ...n, read: true } : n
                        );
                        setAdminNotifications(updated);
                        localStorage.setItem('stage_admin_notifications', JSON.stringify(updated));

                        // Find and select the project
                        const project = submissions.find(s =>
                          s.id === notif.projectId ||
                          s.projectName === notif.projectName
                        );
                        if (project) {
                          setSelectedSubmission(project);
                          setDetailView('activity');
                          setShowCreatorUpdatesPanel(false);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notif.type === 'creator_edit' ? 'bg-blue-500/30' :
                          notif.type === 'new_submission' ? 'bg-green-500/30' :
                          'bg-purple-500/30'
                        }`}>
                          <span className="text-lg">
                            {notif.type === 'creator_edit' ? '✏️' :
                             notif.type === 'new_submission' ? '🆕' : '📋'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-bold text-sm">{notif.projectName}</div>
                          <div className="text-gray-400 text-xs mt-0.5">{notif.creatorEmail}</div>
                          <div className="text-gray-300 text-sm mt-2">{notif.message}</div>

                          {/* Creator Comment */}
                          {notif.creatorComment && (
                            <div className="mt-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-3 border border-blue-500/30">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm">💬</span>
                                <span className="text-xs font-bold text-blue-400">Creator's Note:</span>
                              </div>
                              <p className="text-sm text-white italic">"{notif.creatorComment}"</p>
                            </div>
                          )}

                          {/* Show changes grouped by department */}
                          {notif.changesByDepartment && Object.keys(notif.changesByDepartment).length > 0 && (
                            <div className="mt-3 bg-black/30 rounded-lg p-3 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-blue-400">Changes by Department:</span>
                                <span className="text-xs text-gray-500">{notif.changes?.length || 0} total changes</span>
                              </div>

                              {Object.entries(notif.changesByDepartment).map(([dept, changes]: [string, any]) => (
                                <div key={dept} className="bg-white/5 rounded-lg p-2">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs px-2 py-0.5 bg-purple-500/30 rounded text-purple-300 font-bold">{dept}</span>
                                    <span className="text-xs text-gray-500">({Array.isArray(changes) ? changes.length : changes} change{(Array.isArray(changes) ? changes.length : changes) > 1 ? 's' : ''})</span>
                                  </div>
                                  {Array.isArray(changes) && changes.slice(0, 3).map((change: any, idx: number) => (
                                    <div key={idx} className="text-xs ml-2 py-1 border-l-2 border-gray-700 pl-2">
                                      <span className="text-gray-400 font-medium">{change.label}:</span>
                                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                        <span className="text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded line-through text-[10px]">
                                          {String(change.oldValue).substring(0, 25)}{String(change.oldValue).length > 25 ? '...' : ''}
                                        </span>
                                        <span className="text-gray-500 text-[10px]">→</span>
                                        <span className="text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded text-[10px]">
                                          {String(change.newValue).substring(0, 25)}{String(change.newValue).length > 25 ? '...' : ''}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                  {Array.isArray(changes) && changes.length > 3 && (
                                    <div className="text-[10px] text-gray-500 ml-4 mt-1">+{changes.length - 3} more in this department</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Fallback: Show simple changes if no department grouping */}
                          {(!notif.changesByDepartment || Object.keys(notif.changesByDepartment).length === 0) && notif.changes && notif.changes.length > 0 && (
                            <div className="mt-3 bg-black/30 rounded-lg p-3 space-y-2">
                              <div className="text-xs font-bold text-blue-400 mb-2">Changes Made:</div>
                              {notif.changes.slice(0, 5).map((change: any, idx: number) => (
                                <div key={idx} className="text-xs">
                                  <span className="text-gray-400">{change.label}:</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-red-400 line-through">{String(change.oldValue).substring(0, 30)}{String(change.oldValue).length > 30 ? '...' : ''}</span>
                                    <span className="text-gray-500">→</span>
                                    <span className="text-green-400">{String(change.newValue).substring(0, 30)}{String(change.newValue).length > 30 ? '...' : ''}</span>
                                  </div>
                                </div>
                              ))}
                              {notif.changes.length > 5 && (
                                <div className="text-xs text-gray-500">+{notif.changes.length - 5} more changes</div>
                              )}
                            </div>
                          )}

                          <div className="text-gray-500 text-xs mt-2">
                            {new Date(notif.timestamp).toLocaleString('en-IN')}
                          </div>
                        </div>
                        {!notif.read && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Document Preview Modal */}
        {previewDocument && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <div className="relative w-full max-w-5xl h-[90vh] bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
              {/* Preview Header */}
              <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl">{previewDocument.type === 'pdf' ? '📕' : '🖼️'}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{previewDocument.name}</h3>
                    <p className="text-purple-200 text-sm font-semibold">
                      {previewDocument.type === 'pdf' ? 'PDF Document' : 'Image File'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(previewDocument.url, '_blank')}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg transition-all text-sm"
                  >
                    ↗️ Open in New Tab
                  </button>
                  <button
                    onClick={() => setPreviewDocument(null)}
                    className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"
                  >
                    <span className="text-xl">✕</span>
                  </button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-hidden bg-gray-800">
                {previewDocument.type === 'pdf' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    {previewDocument.url.startsWith('#') ? (
                      <div className="text-center p-8">
                        <div className="text-6xl mb-4">📄</div>
                        <h3 className="text-xl font-bold text-white mb-2">PDF Preview</h3>
                        <p className="text-gray-400 mb-6">
                          PDF preview requires the file to be hosted. For local files, please download to view.
                        </p>
                        <div className="flex gap-3 justify-center">
                          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl">
                            ⬇️ Download PDF
                          </button>
                        </div>
                      </div>
                    ) : (
                      <iframe
                        src={previewDocument.url}
                        className="w-full h-full"
                        title={previewDocument.name}
                      />
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    {previewDocument.url.startsWith('#') ? (
                      <div className="text-center p-8">
                        <div className="text-6xl mb-4">🖼️</div>
                        <h3 className="text-xl font-bold text-white mb-2">Image Preview</h3>
                        <p className="text-gray-400 mb-6">
                          Image preview requires the file URL. For local files, please download to view.
                        </p>
                        <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl">
                          ⬇️ Download Image
                        </button>
                      </div>
                    ) : (
                      <img
                        src={previewDocument.url}
                        alt={previewDocument.name}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Preview Footer */}
              <div className="flex-shrink-0 bg-black/50 p-3 flex items-center justify-between">
                <div className="text-gray-400 text-sm font-semibold">
                  {previewDocument.type === 'pdf' ? '📕 PDF Document' : '🖼️ Image File'}
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-all">
                    ⬇️ Download
                  </button>
                  <button
                    onClick={() => setPreviewDocument(null)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm font-bold rounded-lg transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
