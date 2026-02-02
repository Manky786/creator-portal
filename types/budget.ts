export interface BudgetLineItem {
  id: string;
  category: string;
  subCategory: string;
  itemDescription: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
  notes: string;
}

export interface BudgetCategory {
  name: string;
  items: BudgetLineItem[];
  subtotal: number;
  percentage: number;
}

export interface BudgetData {
  categories: BudgetCategory[];
  totalBudget: number;
  completenessScore: number;
  warnings: string[];
}

export interface CastMember {
  id: string;
  artistName: string;
  characterName: string;
  socialMediaLink: string;
  photographUrl: string;
}

export interface CastData {
  primaryCast: CastMember[];
  secondaryCast: CastMember[];
  tertiaryCast: CastMember[];
}

export interface EquipmentItem {
  name: string;
  quantity: number;
}

export interface TechnicalSpecs {
  // Camera
  cameraModel: string;
  cameraSetupType: 'single' | 'double' | 'triple' | '';
  lensTypes: EquipmentItem[];
  cameraOthers: EquipmentItem[];

  // Lighting
  lightingEquipment: EquipmentItem[];
  lightingOthers: EquipmentItem[];

  // Equipment
  cinematicTools: EquipmentItem[];
  cinematicOthers: EquipmentItem[];
  droneModels: EquipmentItem[];
  droneOthers: EquipmentItem[];
  soundEquipment: EquipmentItem[];
  soundOthers: EquipmentItem[];
}

export interface TimelinePhase {
  startDate: string;
  endDate: string;
  duration: string;
  comments: string;
}

export interface ContentTimeline {
  // Development Phase
  detailedScreenplaySubmission: string;
  detailedScreenplayComments: string;
  scriptSubmission: string;
  scriptComments: string;

  // Pre-Production Phase
  preProductionStart: string;
  preProductionEnd: string;
  preProductionDuration: string;
  preProductionComments: string;

  // Production Phase (Shoot)
  shootStartDate: string;
  shootEndDate: string;
  shootDays: string;
  principalPhotographyComments: string;

  // Post-Production Phase
  firstCutDate: string;
  firstCutComments: string;
  postProductionStart: string;
  postProductionEnd: string;
  postProductionDuration: string;
  postProductionComments: string;

  // Final Delivery
  finalCutQCDate: string;
  finalCutComments: string;
  finalDeliveryDate: string;
  finalDeliveryComments: string;
}

export interface BudgetFormData {
  // Project Details
  projectName: string;
  productionCompany: string;
  culture: string;
  format: string;
  estimatedBudget: string;
  totalDuration: string;
  shootDays: string;
  shootStartDate: string;
  shootEndDate: string;

  // Content Classification
  genre: string;
  subGenre: string;
  contentRating: string;

  // Production Type
  productionType: string;
  sourceMaterial: string;
  ipRightsStatus: string;

  // Episode Details (for Series)
  numberOfSeasons: string;
  episodesPerSeason: string;
  episodeDuration: string;

  // Creator Details
  creatorName: string;
  creatorAge: string;
  fatherName: string;
  officialEmail: string;
  phone: string;
  panNumber: string;
  gstNumber: string;
  authorizedSignatory: string;
  permanentAddress: string;
  currentAddress: string;

  // Professional Identity & Experience
  companyType: string;
  registrationNumber: string;
  yearsOfExperience: string;
  previousProjects: string;
  imdbLink: string;
  portfolioLink: string;
  notableWorks: string;

  // Production Capacity
  officeSpaceType: string;
  teamSize: string;
  annualRevenue: string;
  concurrentCapacity: string;

  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  emergencyContactAddress: string;

  // Crew/Team Details with work links
  // Direction Department
  director: string;
  directorLink: string;
  associateDirector: string;
  associateDirectorLink: string;
  assistantDirector1: string;
  assistantDirector1Link: string;
  assistantDirector2: string;
  assistantDirector2Link: string;
  directionOthers: { name: string; link: string }[];

  // Production Department
  headOfProduction: string;
  headOfProductionLink: string;
  executiveProducer: string;
  executiveProducerLink: string;
  productionController: string;
  productionControllerLink: string;
  lineProducer: string;
  lineProducerLink: string;
  unitProductionManager: string;
  unitProductionManagerLink: string;
  locationManager: string;
  locationManagerLink: string;
  productionOthers: { name: string; link: string }[];

  // Creative Department
  showRunner: string;
  showRunnerLink: string;
  projectHead: string;
  projectHeadLink: string;
  creativeDirector: string;
  creativeDirectorLink: string;
  associateCreativeDirector: string;
  associateCreativeDirectorLink: string;
  creativeOthers: { name: string; link: string }[];

  // Writing Department
  storyBy: string;
  storyByLink: string;
  screenplayBy: string;
  screenplayByLink: string;
  dialoguesBy: string;
  dialoguesByLink: string;
  writingOthers: { name: string; link: string }[];

  // Camera Department
  dop: string;
  dopLink: string;
  firstCameraOperator: string;
  firstCameraOperatorLink: string;
  cameraOperator: string;
  cameraOperatorLink: string;
  focusPuller: string;
  focusPullerLink: string;
  steadicamOperator: string;
  steadicamOperatorLink: string;
  cameraOthers: { name: string; link: string }[];

  // Editing Department
  editor: string;
  editorLink: string;
  onLocationEditor: string;
  onLocationEditorLink: string;
  colorist: string;
  coloristLink: string;
  editingOthers: { name: string; link: string }[];

  // Sound Department
  soundRecordist: string;
  soundRecordistLink: string;
  soundDesigner: string;
  soundDesignerLink: string;
  foleyArtist: string;
  foleyArtistLink: string;
  reRecordingMixer: string;
  reRecordingMixerLink: string;
  soundOthers: { name: string; link: string }[];

  // Music Department
  musicComposer: string;
  musicComposerLink: string;
  bgmComposer: string;
  bgmComposerLink: string;
  playbackSinger: string;
  playbackSingerLink: string;
  musicOthers: { name: string; link: string }[];

  // Art & Design Department
  productionDesigner: string;
  productionDesignerLink: string;
  artDirector: string;
  artDirectorLink: string;
  setDesigner: string;
  setDesignerLink: string;
  artOthers: { name: string; link: string }[];

  // Costume & Makeup Department
  costumeDesigner: string;
  costumeDesignerLink: string;
  makeupArtist: string;
  makeupArtistLink: string;
  hairStylist: string;
  hairStylistLink: string;
  costumeOthers: { name: string; link: string }[];

  // VFX & Post Production
  vfxSupervisor: string;
  vfxSupervisorLink: string;
  diArtist: string;
  diArtistLink: string;
  vfxOthers: { name: string; link: string }[];

  // Action & Choreography
  actionDirector: string;
  actionDirectorLink: string;
  stuntCoordinator: string;
  stuntCoordinatorLink: string;
  choreographer: string;
  choreographerLink: string;
  actionOthers: { name: string; link: string }[];

  // Casting
  castingDirector: string;
  castingDirectorLink: string;
  castingOthers: { name: string; link: string }[];

  // Photography & Documentation
  stillPhotographer: string;
  stillPhotographerLink: string;
  btsVideographer: string;
  btsVideographerLink: string;
  photographyOthers: { name: string; link: string }[];

  budgetData: { [key: string]: Partial<BudgetLineItem> };

  // Budget Categories Data (for persistence)
  budgetCategories?: any[];
  budgetCreatorMargin?: number;
  budgetInsuranceAmount?: number;
  budgetCelebrityFees?: Array<{name: string, amount: number}>;

  // Cast Data
  castData: CastData;

  // Technical Specifications
  technicalSpecs: TechnicalSpecs;

  // Content Creation Timeline
  contentTimeline: ContentTimeline;

  // Cash Flow Data
  cashFlowProjectType?: 'feature' | 'mini' | 'longSeries' | 'limitedSeries' | 'microdrama';
  cashFlowTotalBudget?: number;
  cashFlowIsLocked?: boolean;
  cashFlowTranches?: Array<{
    id: string;
    name: string;
    description: string;
    percentage: number;
    amount: number;
    expectedDate: string;
    actualDate: string;
    status: 'pending' | 'in-progress' | 'completed';
  }>;

  // Project Documents
  uploadedFiles?: Array<{
    name: string;
    size: number;
    type: string;
    uploadDate: string;
  }>;
  cloudLinks?: string[];
}

export interface BudgetAnalysis {
  totalBudget: number;
  categoryBreakdown: { category: string; amount: number; percentage: number }[];
  completenessScore: number;
  warnings: string[];
  recommendations: string[];
  industryComparison: {
    category: string;
    yourPercentage: number;
    industryAverage: number;
    status: 'normal' | 'high' | 'low';
  }[];
}
