'use client';

import { useState, useEffect, useRef } from 'react';
import { BudgetFormData } from '@/types/budget';
import { amountInWords } from '@/utils/numberToWords';
import * as XLSX from 'xlsx';
import FilmmakerQuote from '@/components/FilmmakerQuote';

interface Props {
  formData: Partial<BudgetFormData>;
  setFormData: (data: Partial<BudgetFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  industryBenchmark: number;
  yourPercentage: number;
  amount: number;
  items: BudgetLineItem[];
}

interface BudgetLineItem {
  id: string;
  description: string;
  characterName?: string;
  actorName?: string;
  noOfDays: number;
  noOfPeople: number;
  noOfRooms?: number;
  perDay: number;
  lumpsumFixed: number;
  total: number;
  section?: string;
}

const createEmptyItem = (description: string): BudgetLineItem => ({
  id: Date.now().toString() + Math.random(),
  description,
  characterName: '',
  actorName: '',
  noOfDays: 0,
  noOfPeople: 0,
  noOfRooms: 0,
  perDay: 0,
  lumpsumFixed: 0,
  total: 0,
});

const initialCategories: BudgetCategory[] = [
  {
    id: 'preproduction',
    name: 'Pre-Production',
    icon: '📝',
    industryBenchmark: 10,
    yourPercentage: 0,
    amount: 0,
    items: [
      createEmptyItem('Concept and Idea'),
      createEmptyItem('Story'),
      createEmptyItem('Screenplay'),
      createEmptyItem('Dialogues'),
      createEmptyItem('Script Consultant/Doctor'),
      createEmptyItem('Research & Development'),
      createEmptyItem('Storyboarding Artist'),
      createEmptyItem('Artist Workshop & Look Test'),
      createEmptyItem('Location Recce/Scouting'),
    ],
  },
  {
    id: 'cast',
    name: 'Cast',
    icon: '🎭',
    industryBenchmark: 15,
    yourPercentage: 15,
    amount: 0,
    items: [
      { ...createEmptyItem('Primary Artist 01'), section: 'primary' },
      { ...createEmptyItem('Primary Artist 02'), section: 'primary' },
      { ...createEmptyItem('Secondary Artist 01'), section: 'secondary' },
      { ...createEmptyItem('Secondary Artist 02'), section: 'secondary' },
      { ...createEmptyItem('Tertiary Artist 01'), section: 'tertiary' },
      { ...createEmptyItem('Tertiary Artist 02'), section: 'tertiary' },
      { ...createEmptyItem('Junior Artist 01'), section: 'juniors' },
      { ...createEmptyItem('Junior Artist 02'), section: 'juniors' },
      { ...createEmptyItem('Cast Travel & Transportation'), section: 'travel' },
      { ...createEmptyItem('Celebrity Manager Fees'), section: 'fees' },
      { ...createEmptyItem('Per Diem Allowance'), section: 'fees' },
    ],
  },
  {
    id: 'direction',
    name: 'Direction Team',
    icon: '🎬',
    industryBenchmark: 8,
    yourPercentage: 0,
    amount: 0,
    items: [
      createEmptyItem('Director'),
      createEmptyItem('Associate Director'),
      createEmptyItem('1st Assistant Director (Properties)'),
      createEmptyItem('2nd Assistant Director (Costume)'),
      createEmptyItem('Script Supervisor'),
      createEmptyItem('Direction Intern'),
    ],
  },
  {
    id: 'creative',
    name: 'Creative Team',
    icon: '💡',
    industryBenchmark: 5,
    yourPercentage: 0,
    amount: 0,
    items: [
      createEmptyItem('Show Runner'),
      createEmptyItem('Project Head'),
      createEmptyItem('Creative Director'),
      createEmptyItem('Associate Creative Director'),
      createEmptyItem('Creative Producer'),
      createEmptyItem('Content Head'),
    ],
  },
  {
    id: 'writing',
    name: 'Writing Team',
    icon: '✍️',
    industryBenchmark: 4,
    yourPercentage: 0,
    amount: 0,
    items: [
      createEmptyItem('Story Writer'),
      createEmptyItem('Screenplay Writer'),
      createEmptyItem('Dialogue Writer'),
      createEmptyItem('Additional Writer'),
      createEmptyItem('Script Consultant'),
    ],
  },
  {
    id: 'camera',
    name: 'Cinematographer Team',
    icon: '📹',
    industryBenchmark: 9,
    yourPercentage: 0,
    amount: 0,
    items: [
      createEmptyItem('Director of Photography (DOP)'),
      createEmptyItem('Camera Operator - 1st'),
      createEmptyItem('Camera Operator - 2nd'),
      createEmptyItem('Assistant Cinematographer'),
      createEmptyItem('2nd Assistant Cinematographer'),
      createEmptyItem('Focus Puller'),
    ],
  },
  {
    id: 'production',
    name: 'Production Team',
    icon: '🎥',
    industryBenchmark: 15,
    yourPercentage: 0,
    amount: 0,
    items: [
      createEmptyItem('Head of Production'),
      createEmptyItem('Production Manager'),
      createEmptyItem('Executive Producer'),
      createEmptyItem('Production Assistants'),
      createEmptyItem('Spot Team'),
    ],
  },
  {
    id: 'art',
    name: 'Art Team',
    icon: '🎨',
    industryBenchmark: 6,
    yourPercentage: 0,
    amount: 0,
    items: [
      createEmptyItem('Art Director'),
      createEmptyItem('Assistant Art Director'),
      createEmptyItem('Setting Boys Team'),
      createEmptyItem('Artist Painter'),
    ],
  },
  {
    id: 'location',
    name: 'Location & Sets',
    icon: '🏢',
    industryBenchmark: 8,
    yourPercentage: 0,
    amount: 0,
    items: [
      // Studio & Rental
      { ...createEmptyItem('Studio Rental'), section: 'rental' },
      { ...createEmptyItem('Location Rental Fees'), section: 'rental' },

      // Construction
      { ...createEmptyItem('Set Construction Material'), section: 'construction' },
      { ...createEmptyItem('Set Building Labor'), section: 'construction' },
      { ...createEmptyItem('Set Dismantling'), section: 'construction' },

      // Props
      { ...createEmptyItem('Props Purchase'), section: 'props' },
      { ...createEmptyItem('Props Rental'), section: 'props' },
      { ...createEmptyItem('Props Transportation'), section: 'props' },
    ],
  },
  {
    id: 'costume',
    name: 'Costume & Wardrobe',
    icon: '👗',
    industryBenchmark: 3,
    yourPercentage: 0,
    amount: 0,
    items: [
      createEmptyItem('Costume Stylist/Designer'),
      createEmptyItem('Assistant Costume Stylist'),
      createEmptyItem('Tailor'),
      createEmptyItem('Dressman'),
    ],
  },
  {
    id: 'makeup',
    name: 'Hair & Makeup',
    icon: '💄',
    industryBenchmark: 2,
    yourPercentage: 0,
    amount: 0,
    items: [
      createEmptyItem('Make Up Man & Team'),
      createEmptyItem('Hair Dresser & Team'),
    ],
  },
  {
    id: 'action',
    name: 'Action & Choreography',
    icon: '🥊',
    industryBenchmark: 4,
    yourPercentage: 0,
    amount: 0,
    items: [
      createEmptyItem('Action Director / Fight Master with Team'),
      createEmptyItem('Choreographer'),
      createEmptyItem('Assistant Choreographer'),
    ],
  },
  {
    id: 'casting',
    name: 'Casting Department',
    icon: '🎯',
    industryBenchmark: 2,
    yourPercentage: 0,
    amount: 0,
    items: [
      createEmptyItem('Casting Director'),
      createEmptyItem('Assistant Casting Director'),
    ],
  },
  {
    id: 'photography',
    name: 'Photography & Documentation',
    icon: '📸',
    industryBenchmark: 2,
    yourPercentage: 0,
    amount: 0,
    items: [
      createEmptyItem('Still Photographer (BTS)'),
      createEmptyItem('BTS Videographer'),
      createEmptyItem('Materials & D&P Charges'),
    ],
  },
  {
    id: 'sound',
    name: 'Sound Department',
    icon: '🎤',
    industryBenchmark: 3,
    yourPercentage: 0,
    amount: 0,
    items: [
      createEmptyItem('Sound Recordist'),
      createEmptyItem('Boom Operator'),
      createEmptyItem('Assistant Sound'),
    ],
  },
  {
    id: 'lighting',
    name: 'Lighting Department',
    icon: '💡',
    industryBenchmark: 4,
    yourPercentage: 0,
    amount: 0,
    items: [
      createEmptyItem('Gaffer / Chief Lighting'),
      createEmptyItem('Best Boy Electric'),
      createEmptyItem('Lightmen / Lighting Assistants'),
      createEmptyItem('Generator Operator'),
    ],
  },
  {
    id: 'grip',
    name: 'Grip & Camera Support',
    icon: '🎬',
    industryBenchmark: 3,
    yourPercentage: 0,
    amount: 0,
    items: [
      createEmptyItem('DIT (Digital Imaging Technician)'),
      createEmptyItem('Camera Attendants'),
      createEmptyItem('Key Grip'),
      createEmptyItem('Dolly Grip'),
    ],
  },
  {
    id: 'equipment',
    name: 'Equipment',
    icon: '📷',
    industryBenchmark: 12,
    yourPercentage: 0,
    amount: 0,
    items: [
      createEmptyItem('Camera + Lenses + Gimble [with all equipment]'),
      createEmptyItem('Sound Equipments (Sync Sound)'),
      createEmptyItem('Drone'),
      createEmptyItem('Track Trolley'),
      createEmptyItem('Jimmy Jib'),
      createEmptyItem('Crane'),
      createEmptyItem('Dolly Panther'),
      createEmptyItem('Steadicam'),
      createEmptyItem('Camera Car'),
      createEmptyItem('Camera Monitor'),
      createEmptyItem('Lights with Stands with All Equipment'),
      createEmptyItem('Generator & Fuel'),
      createEmptyItem('Rostrum'),
    ],
  },
  {
    id: 'postproduction',
    name: 'Post-Production',
    icon: '✂️',
    industryBenchmark: 12,
    yourPercentage: 12,
    amount: 0,
    items: [
      createEmptyItem('Editor'),
      createEmptyItem('Color Grading (DI)'),
      createEmptyItem('VFX & Graphics'),
      createEmptyItem('Sound Design'),
      createEmptyItem('Re-recording & Mixing'),
      createEmptyItem('Dubbing Studio'),
      createEmptyItem('Background Music'),
    ],
  },
  {
    id: 'music',
    name: 'Music',
    icon: '🎵',
    industryBenchmark: 6,
    yourPercentage: 0,
    amount: 0,
    items: [
      createEmptyItem('Lyricist'),
      createEmptyItem('Singers'),
      createEmptyItem('Title Track Composition'),
      createEmptyItem('Music Director / Composer (Songs)'),
    ],
  },
  {
    id: 'food',
    name: 'Food & Catering',
    icon: '🍽️',
    industryBenchmark: 4,
    yourPercentage: 0,
    amount: 0,
    items: [
      createEmptyItem('Breakfast (Per Day)'),
      createEmptyItem('Lunch (Per Day)'),
      createEmptyItem('Dinner (Per Day)'),
      createEmptyItem('Snacks & Tea/Coffee'),
    ],
  },
  {
    id: 'travel',
    name: 'Travel & Accommodation',
    icon: '🚗',
    industryBenchmark: 5,
    yourPercentage: 0,
    amount: 0,
    items: [
      createEmptyItem('Local Transportation'),
      createEmptyItem('Outstation Travel (Flights/Train)'),
      createEmptyItem('Budget Hotels/Lodges (No. of Rooms)'),
    ],
  },
  {
    id: 'other',
    name: 'Other Costs',
    icon: '💼',
    industryBenchmark: 2,
    yourPercentage: 0,
    amount: 0,
    items: [
      createEmptyItem('Permissions & Permits'),
      createEmptyItem('Legal & Documentation'),
    ],
  },
];

export default function BudgetStep({ formData, setFormData, onNext, onBack }: Props) {
  const [totalBudget, setTotalBudget] = useState<number>(formData.estimatedBudget ? parseFloat(formData.estimatedBudget) : 0);
  const [categories, setCategories] = useState<BudgetCategory[]>(initialCategories);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [creatorMarginPercent, setCreatorMarginPercent] = useState<number>(10);
  const [insuranceAmount, setInsuranceAmount] = useState<number>(0);
  const [celebrityFees, setCelebrityFees] = useState<Array<{name: string, amount: number}>>([
    {name: '', amount: 0}
  ]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  const [unmatchedItems, setUnmatchedItems] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle budget file upload and parse Excel
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('File selected:', file);

    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['xlsx', 'xls'];

      console.log('File extension:', fileExtension);
      console.log('File name:', file.name);
      console.log('File size:', file.size);

      if (allowedExtensions.includes(fileExtension || '')) {
        setUploadedFile(file);
        setIsFileProcessing(true);
        setUnmatchedItems([]);

        try {
          // Read Excel file
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];

          console.log('=== EXCEL PARSING START ===');
          console.log('Excel data parsed:', jsonData);
          console.log('Current categories before update:', categories);

          // Parse Excel data and match with budget categories
          // Deep clone to ensure React detects state changes
          const updatedCategories = categories.map(cat => ({
            ...cat,
            items: cat.items.map(item => ({ ...item }))
          }));
          const unmatched: string[] = [];
          let matchedCount = 0;

          // Expected Excel format: Column A = Category/Item Name, Column B = Amount
          // Start from row 0 or 1 depending on whether there's a header
          const startRow = jsonData[0] && typeof jsonData[0][1] === 'string' && isNaN(parseFloat(String(jsonData[0][1]).replace(/[₹$,\s]/g, ''))) ? 1 : 0;

          console.log(`Starting from row ${startRow}`);

          for (let i = startRow; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (!row || row.length < 2) continue;

            const itemName = String(row[0] || '').trim().toLowerCase();
            // Parse amount - remove currency symbols, commas, spaces
            const amountStr = String(row[1] || '').replace(/[₹$,\s]/g, '');
            const amount = parseFloat(amountStr) || 0;

            console.log(`Row ${i}: "${row[0]}" = "${row[1]}" (cleaned: "${amountStr}", parsed: ${amount})`);

            if (!itemName || amount === 0) {
              console.log(`Skipping row ${i}: empty name or zero amount`);
              continue;
            }

            let matched = false;

            // Try to match with category names
            for (let catIndex = 0; catIndex < updatedCategories.length; catIndex++) {
              const category = updatedCategories[catIndex];
              const categoryNameLower = category.name.toLowerCase();

              // Check if row matches category name
              if (itemName.includes(categoryNameLower) || categoryNameLower.includes(itemName)) {
                updatedCategories[catIndex].amount = amount;
                matched = true;
                matchedCount++;
                console.log(`✓ Matched category: ${category.name} = ₹${amount.toLocaleString('en-IN')}`);
                break;
              }

              // Check if row matches any item in the category
              for (let itemIndex = 0; itemIndex < category.items.length; itemIndex++) {
                const item = category.items[itemIndex];
                const itemDescLower = item.description.toLowerCase();

                if (itemName.includes(itemDescLower) || itemDescLower.includes(itemName)) {
                  updatedCategories[catIndex].items[itemIndex].lumpsumFixed = amount;
                  updatedCategories[catIndex].items[itemIndex].total = amount;
                  matched = true;
                  matchedCount++;
                  console.log(`✓ Matched item: ${item.description} = ₹${amount.toLocaleString('en-IN')}`);
                  break;
                }
              }

              if (matched) break;
            }

            if (!matched) {
              unmatched.push(`${row[0]} (₹${amount.toLocaleString('en-IN')})`);
              console.log(`✗ Not matched: ${row[0]} = ₹${amount.toLocaleString('en-IN')}`);
            }
          }

          // Recalculate category amounts from their items
          updatedCategories.forEach(cat => {
            const itemsTotal = cat.items.reduce((sum, item) => sum + item.total, 0);
            if (itemsTotal > 0) {
              cat.amount = itemsTotal;
            }
          });

          // Calculate total budget
          const totalBudget = updatedCategories.reduce((sum, cat) => sum + cat.amount, 0);

          // Recalculate percentages based on total
          if (totalBudget > 0) {
            updatedCategories.forEach(cat => {
              if (cat.amount > 0) {
                cat.yourPercentage = Math.round((cat.amount / totalBudget) * 100);
              }
            });
          }

          console.log('Total Budget:', totalBudget);
          console.log('Updated Categories:', updatedCategories);
          console.log('Budget auto-filled successfully');
          console.log('Unmatched items:', unmatched);

          // Log each category amount for debugging
          updatedCategories.forEach(cat => {
            console.log(`${cat.name}: ₹${cat.amount.toLocaleString('en-IN')} (${cat.yourPercentage}%)`);
          });
          console.log('=== EXCEL PARSING END ===');

          // Update state and formData
          setCategories(updatedCategories);
          setFormData({
            ...formData,
            budgetCategories: updatedCategories,
          });
          setUnmatchedItems(unmatched);
          setIsFileProcessing(false);

          // Show summary
          const totalRows = jsonData.length - startRow;
          setTimeout(() => {
            alert(`Budget Import Summary:\n\n✓ Matched: ${matchedCount} items\n✗ Unmatched: ${unmatched.length} items\n\nTotal Budget: ₹${totalBudget.toLocaleString('en-IN')}\n\n${unmatched.length > 0 ? 'Please scroll down to see unmatched items that need manual entry.' : 'All items imported successfully!'}`);
          }, 100);

        } catch (error) {
          console.error('Error parsing Excel file:', error);
          alert('Error reading Excel file. Please ensure it has the correct format: Column A = Item Name, Column B = Amount');
          setIsFileProcessing(false);
        }
      } else {
        alert('Please upload a valid Excel file format: .xlsx or .xls');
      }
    } else {
      console.log('No file selected');
    }

    // Reset input value to allow same file upload again
    if (event.target) {
      event.target.value = '';
    }
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setIsFileProcessing(false);
    setUnmatchedItems([]);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Load saved budget data from formData on component mount
  useEffect(() => {
    if (formData.budgetCategories) {
      setCategories(formData.budgetCategories as any);
    }
    if (formData.budgetCreatorMargin !== undefined) {
      setCreatorMarginPercent(formData.budgetCreatorMargin);
    }
    if (formData.budgetInsuranceAmount !== undefined) {
      setInsuranceAmount(formData.budgetInsuranceAmount);
    }
    if (formData.budgetCelebrityFees && formData.budgetCelebrityFees.length > 0) {
      setCelebrityFees(formData.budgetCelebrityFees);
    }
  }, []); // Empty dependency array - run only once on mount

  // Development mode: Hot reload support - automatically update categories when structure changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Only reset if the number of categories has changed (structure update)
      if (categories.length !== initialCategories.length) {
        setCategories(initialCategories);
      }
    }
  }, [initialCategories.length]);

  const calculatePercentages = () => {
    if (totalBudget === 0) return;

    const newCategories = categories.map((cat) => {
      const percentage = (cat.amount / totalBudget) * 100;
      return { ...cat, yourPercentage: parseFloat(percentage.toFixed(1)) };
    });
    setCategories(newCategories);
  };

  const handleTotalBudgetChange = (value: number) => {
    setTotalBudget(value);

    // Recalculate all percentages when total budget changes
    const newCategories = categories.map((cat) => {
      const percentage = value > 0 ? (cat.amount / value) * 100 : 0;
      return { ...cat, yourPercentage: parseFloat(percentage.toFixed(1)) };
    });
    setCategories(newCategories);

    // Save to formData
    const budgetData = newCategories.reduce((acc, cat) => {
      acc[cat.id] = {
        amount: cat.amount,
        percentage: cat.yourPercentage,
        items: cat.items,
      };
      return acc;
    }, {} as any);
    setFormData({
      ...formData,
      estimatedBudget: value.toString(),
      budgetData,
      budgetCategories: newCategories as any,
    });
  };

  const handleCategoryAmountChange = (categoryId: string, amount: number) => {
    // Step 1: Update the category amount
    const newCategories = categories.map((cat) => {
      if (cat.id === categoryId) {
        return { ...cat, amount };
      }
      return cat;
    });

    // Step 2: Recalculate ALL percentages based on total of all categories (Excel-like automation)
    const totalAllocated = newCategories.reduce((sum, cat) => sum + cat.amount, 0);
    const categoriesWithPercentages = newCategories.map(cat => ({
      ...cat,
      yourPercentage: totalAllocated > 0 ? parseFloat(((cat.amount / totalAllocated) * 100).toFixed(1)) : 0,
    }));

    setCategories(categoriesWithPercentages);

    // Save to formData for persistence
    setFormData({
      ...formData,
      budgetCategories: categoriesWithPercentages as any,
    });
  };

  // ============================================
  // EXCEL-LIKE AUTO-CALCULATION SYSTEM
  // ============================================
  // When any field changes, the system automatically:
  // 1. Calculates item total: (Days × People/Rooms × Per Day) + Lumpsum
  // 2. Calculates category total: Sum of all items in category
  // 3. Calculates percentages: Each category % = (Category Amount / Total Budget) × 100
  // All categories update automatically like Excel formulas!
  // ============================================

  const handleLineItemChange = (
    categoryId: string,
    itemId: string,
    field: keyof BudgetLineItem,
    value: string | number
  ) => {
    // Step 1: Update the item and recalculate category totals
    const newCategories = categories.map((cat) => {
      if (cat.id === categoryId) {
        const newItems = cat.items.map((item) => {
          if (item.id === itemId) {
            const updatedItem = { ...item, [field]: value };

            // Auto-calculate total: Total = (Days × People × Per Day) + Lumpsum
            // For travel category: Total = (Days × Rooms × Per Day) + Lumpsum
            let daysTotal;
            if (categoryId === 'travel' && updatedItem.noOfRooms !== undefined) {
              daysTotal = updatedItem.noOfDays * updatedItem.noOfRooms * updatedItem.perDay;
            } else {
              daysTotal = updatedItem.noOfDays * updatedItem.noOfPeople * updatedItem.perDay;
            }
            updatedItem.total = daysTotal + updatedItem.lumpsumFixed;

            return updatedItem;
          }
          return item;
        });
        const totalAmount = newItems.reduce((sum, item) => sum + item.total, 0);
        return {
          ...cat,
          items: newItems,
          amount: totalAmount,
        };
      }
      return cat;
    });

    // Step 2: Recalculate ALL percentages based on total of all categories (Excel-like automation)
    const totalAllocated = newCategories.reduce((sum, cat) => sum + cat.amount, 0);
    const categoriesWithPercentages = newCategories.map(cat => ({
      ...cat,
      yourPercentage: totalAllocated > 0 ? parseFloat(((cat.amount / totalAllocated) * 100).toFixed(1)) : 0,
    }));

    setCategories(categoriesWithPercentages);

    // Save to formData for persistence
    const budgetData = categoriesWithPercentages.reduce((acc, cat) => {
      acc[cat.id] = {
        amount: cat.amount,
        percentage: cat.yourPercentage,
        items: cat.items,
      };
      return acc;
    }, {} as any);
    setFormData({
      ...formData,
      budgetData,
      budgetCategories: categoriesWithPercentages as any,
    });
  };

  const addLineItem = (categoryId: string, section?: string) => {
    const newCategories = categories.map((cat) => {
      if (cat.id === categoryId) {
        const newItem = section
          ? { ...createEmptyItem(''), section }
          : createEmptyItem('');
        return {
          ...cat,
          items: [...cat.items, newItem],
        };
      }
      return cat;
    });
    setCategories(newCategories);

    // Save to formData
    const budgetData = newCategories.reduce((acc, cat) => {
      acc[cat.id] = {
        amount: cat.amount,
        percentage: cat.yourPercentage,
        items: cat.items,
      };
      return acc;
    }, {} as any);
    setFormData({
      ...formData,
      budgetData,
      budgetCategories: newCategories as any,
    });
  };

  const removeLineItem = (categoryId: string, itemId: string) => {
    // Step 1: Remove item and recalculate category total
    const newCategories = categories.map((cat) => {
      if (cat.id === categoryId) {
        const newItems = cat.items.filter((item) => item.id !== itemId);
        const totalAmount = newItems.reduce((sum, item) => sum + item.total, 0);
        return {
          ...cat,
          items: newItems,
          amount: totalAmount,
        };
      }
      return cat;
    });

    // Step 2: Recalculate ALL percentages based on total of all categories (Excel-like automation)
    const totalAllocated = newCategories.reduce((sum, cat) => sum + cat.amount, 0);
    const categoriesWithPercentages = newCategories.map(cat => ({
      ...cat,
      yourPercentage: totalAllocated > 0 ? parseFloat(((cat.amount / totalAllocated) * 100).toFixed(1)) : 0,
    }));

    setCategories(categoriesWithPercentages);

    // Save to formData
    const budgetData = categoriesWithPercentages.reduce((acc, cat) => {
      acc[cat.id] = {
        amount: cat.amount,
        percentage: cat.yourPercentage,
        items: cat.items,
      };
      return acc;
    }, {} as any);
    setFormData({
      ...formData,
      budgetData,
      budgetCategories: categoriesWithPercentages as any,
    });
  };

  const getTotalAllocated = () => {
    return categories.reduce((sum, cat) => sum + cat.amount, 0);
  };

  const getBaseProductionCost = () => {
    // Get production cost excluding cast and post-production (they are calculated percentages)
    return categories
      .filter(cat => cat.id !== 'cast' && cat.id !== 'postproduction')
      .reduce((sum, cat) => sum + cat.amount, 0);
  };

  const getRemainingBudget = () => {
    return totalBudget - getTotalAllocated();
  };

  // Cast and Post-Production are manually editable - Industry standards are minimum benchmarks

  // Auto-sync Total Project Cost to estimatedBudget (for First Page and Cash Flow)
  useEffect(() => {
    const totalAllocated = getTotalAllocated();

    // Only sync if there's actual budget data filled (not empty budget page)
    if (totalAllocated > 0) {
      const totalProjectCost = totalAllocated +
        Math.round(totalAllocated * (creatorMarginPercent / 100)) +
        insuranceAmount +
        celebrityFees.reduce((sum, c) => sum + c.amount, 0);

      // Update estimatedBudget in formData for sync with First Page and Cash Flow
      if (totalProjectCost !== parseFloat(formData.estimatedBudget || '0')) {
        setFormData({
          ...formData,
          estimatedBudget: totalProjectCost.toString(),
          cashFlowTotalBudget: totalProjectCost
        });
      }
    } else if (totalAllocated === 0) {
      // If budget is empty, clear the synced values
      if (formData.estimatedBudget && parseFloat(formData.estimatedBudget) > 0) {
        setFormData({
          ...formData,
          estimatedBudget: '0',
          cashFlowTotalBudget: 0
        });
      }
    }
  }, [getTotalAllocated(), creatorMarginPercent, insuranceAmount, celebrityFees]);

  const getStatusColor = (categoryPercentage: number, benchmark: number) => {
    const diff = Math.abs(categoryPercentage - benchmark);
    if (diff <= 3) return 'text-green-600 bg-green-50 border-green-200';
    if (diff <= 7) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleClearContents = () => {
    if (confirm('Are you sure you want to clear all budget data? This action cannot be undone.')) {
      setCategories(initialCategories);
      setTotalBudget(0);
      setCreatorMarginPercent(10);
      setInsuranceAmount(0);
      setCelebrityFees([{name: '', amount: 0}]);
      setFormData({
        ...formData,
        budgetCategories: initialCategories as any,
        budgetCreatorMargin: 10,
        budgetInsuranceAmount: 0,
        budgetCelebrityFees: [{name: '', amount: 0}],
        estimatedBudget: '0',
        cashFlowTotalBudget: 0,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-5xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 bg-clip-text text-transparent tracking-tight">
            💰 Budget Breakdown
          </h2>
          <button
            onClick={handleClearContents}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-200 flex items-center gap-2 border-2 border-red-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Contents
          </button>
        </div>
        <p className="text-gray-700 text-lg font-semibold">
          Enter your total budget and allocate amounts to each category. Industry minimum standards are shown for OTT production.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border-2 border-blue-300 rounded-lg">
          <span className="text-blue-600 text-lg">💡</span>
          <span className="text-sm font-bold text-blue-800">
            Budget details are optional - you can skip and fill later
          </span>
        </div>

        {/* Filmmaker Quotes */}
        <div className="grid md:grid-cols-2 gap-6 my-8">
          <FilmmakerQuote
            quote="बजट सिर्फ पैसा नहीं, आपकी कहानी की नींव है।"
            filmmaker="Shyam Benegal"
            title="Pioneer of Parallel Cinema"
            imageUrl="/images/filmmakers/shyam-benegal.webp"
            language="hindi"
            theme="light"
          />
          <FilmmakerQuote
            quote="To make a great film you need three things - the script, the script and the script."
            filmmaker="Alfred Hitchcock"
            title="Master of Suspense"
            imageUrl="/images/filmmakers/alfred-hitchcock-new.avif"
            language="english"
            theme="light"
          />
        </div>

        {/* File Upload Section */}
        <div className="mt-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border-2 border-indigo-300 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📎</span>
            <div>
              <h3 className="text-lg font-bold text-indigo-900">Upload Budget File (Optional)</h3>
              <p className="text-sm text-indigo-700">Upload Excel, Word, or PDF file to auto-fill budget data</p>
            </div>
          </div>

          {!uploadedFile ? (
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.docx,.doc,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="budget-file-upload"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-200 cursor-pointer flex items-center gap-2"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Choose File
              </button>
              <span className="text-sm text-gray-600 font-semibold">
                Supported: Excel (.xlsx, .xls), Word (.docx, .doc), PDF
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              {isFileProcessing ? (
                <div className="flex items-center gap-3 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                  <div className="animate-spin">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-yellow-900">Processing file...</p>
                    <p className="text-sm text-yellow-700">{uploadedFile.name}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✅</span>
                      <div>
                        <p className="font-bold text-green-900">File uploaded successfully!</p>
                        <p className="text-sm text-green-700">{uploadedFile.name}</p>
                        <p className="text-xs text-green-600 mt-1">Budget data auto-filled. You can manually adjust any fields below.</p>
                      </div>
                    </div>
                    <button
                      onClick={removeUploadedFile}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </div>

                  {/* Unmatched items warning */}
                  {unmatchedItems.length > 0 && (
                    <div className="p-4 bg-orange-50 border-2 border-orange-300 rounded-lg">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div className="flex-1">
                          <p className="font-bold text-orange-900 mb-2">
                            {unmatchedItems.length} item(s) could not be automatically matched
                          </p>
                          <p className="text-sm text-orange-700 mb-3">
                            Please add these items manually to the appropriate categories:
                          </p>
                          <div className="bg-white rounded-lg p-3 border border-orange-200 max-h-40 overflow-y-auto">
                            <ul className="space-y-1">
                              {unmatchedItems.map((item, index) => (
                                <li key={index} className="text-sm text-gray-800 flex items-start gap-2">
                                  <span className="text-orange-500 font-bold">•</span>
                                  <span className="font-semibold">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Budget Breakdown Section */}
      <div className="mb-8 bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 rounded-xl border-2 border-purple-300 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
            <span className="text-3xl">💰</span>
          </div>
          <div>
            <h3 className="text-2xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Budget Breakdown & Project Cost
            </h3>
            <p className="text-xs font-semibold text-purple-700">Total production cost and margins</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Production Cost Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border-3 border-blue-500 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide">
                🎬 Total Production Cost
              </h4>
            </div>
            <div className="text-3xl font-black text-blue-900 mb-2">
              {formatCurrency(getTotalAllocated())}
            </div>
            {getTotalAllocated() > 0 && (
              <div className="text-xs font-semibold text-blue-600 mb-2 italic">
                ({amountInWords(getTotalAllocated())})
              </div>
            )}
            <div className="text-xs font-semibold text-blue-700 bg-blue-200 px-3 py-1.5 rounded-lg inline-block">
              Base Budget
            </div>
          </div>

          {/* Creator Margin Card - Editable */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border-3 border-green-500 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-green-900 uppercase tracking-wide">
                💼 Creator Margin
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={creatorMarginPercent}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value) || 0;
                    setCreatorMarginPercent(newValue);
                    setFormData({
                      ...formData,
                      budgetCreatorMargin: newValue,
                    });
                  }}
                  className="w-16 px-2 py-1 text-sm font-bold border-2 border-green-600 rounded-lg text-center text-green-900 focus:ring-2 focus:ring-green-500 outline-none"
                />
                <span className="text-sm font-bold text-green-900">%</span>
              </div>
            </div>
            <div className="text-3xl font-black text-green-900 mb-2">
              {formatCurrency(Math.round(getTotalAllocated() * (creatorMarginPercent / 100)))}
            </div>
            {getTotalAllocated() > 0 && (
              <div className="text-xs font-semibold text-green-600 mb-2 italic">
                ({amountInWords(Math.round(getTotalAllocated() * (creatorMarginPercent / 100)))})
              </div>
            )}
            <div className="text-xs font-semibold text-green-700 bg-green-200 px-3 py-1.5 rounded-lg inline-block">
              {creatorMarginPercent}% of Production Cost
            </div>
          </div>

          {/* Insurance Card - Editable Amount */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl border-3 border-orange-500 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-orange-900 uppercase tracking-wide">
                🛡️ Insurance Amount
              </h4>
            </div>
            <div className="mb-2">
              <input
                type="number"
                value={insuranceAmount}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value) || 0;
                  setInsuranceAmount(newValue);
                  setFormData({
                    ...formData,
                    budgetInsuranceAmount: newValue,
                  });
                }}
                placeholder="Enter insurance amount"
                className="w-full px-4 py-3 text-2xl font-black border-2 border-orange-600 rounded-lg text-orange-900 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            {insuranceAmount > 0 && (
              <div className="text-xs font-semibold text-orange-600 mb-2 italic">
                ({amountInWords(insuranceAmount)})
              </div>
            )}
            <div className="text-xs font-semibold text-orange-700 bg-orange-200 px-3 py-1.5 rounded-lg inline-block">
              Separate from Production Budget
            </div>
          </div>

          {/* Celebrity Fees Card - Editable with Names */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-xl border-3 border-rose-500 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-rose-900 uppercase tracking-wide">
                ⭐ Celebrity Fees
              </h4>
              <button
                onClick={() => {
                  const newFees = [...celebrityFees, {name: '', amount: 0}];
                  setCelebrityFees(newFees);
                  setFormData({
                    ...formData,
                    budgetCelebrityFees: newFees,
                  });
                }}
                className="px-2 py-1 text-xs font-bold bg-rose-200 text-rose-900 rounded-lg hover:bg-rose-300 transition-colors"
              >
                + Add
              </button>
            </div>
            <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
              {celebrityFees.map((celeb, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={celeb.name}
                    onChange={(e) => {
                      const updated = [...celebrityFees];
                      updated[index].name = e.target.value;
                      setCelebrityFees(updated);
                      setFormData({
                        ...formData,
                        budgetCelebrityFees: updated,
                      });
                    }}
                    placeholder="Celebrity name"
                    className="flex-1 px-2 py-1.5 text-sm font-semibold border-2 border-rose-400 rounded-lg text-rose-900 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                  <input
                    type="number"
                    value={celeb.amount || ''}
                    onChange={(e) => {
                      const updated = [...celebrityFees];
                      updated[index].amount = parseFloat(e.target.value) || 0;
                      setCelebrityFees(updated);
                      setFormData({
                        ...formData,
                        budgetCelebrityFees: updated,
                      });
                    }}
                    placeholder="₹"
                    className="w-24 px-2 py-1.5 text-sm font-bold border-2 border-rose-400 rounded-lg text-rose-900 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                  {celebrityFees.length > 1 && (
                    <button
                      onClick={() => {
                        const newFees = celebrityFees.filter((_, i) => i !== index);
                        setCelebrityFees(newFees);
                        setFormData({
                          ...formData,
                          budgetCelebrityFees: newFees,
                        });
                      }}
                      className="px-2 text-rose-600 hover:bg-rose-200 rounded-lg transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="text-2xl font-black text-rose-900 mb-2">
              {formatCurrency(celebrityFees.reduce((sum, c) => sum + c.amount, 0))}
            </div>
            {celebrityFees.reduce((sum, c) => sum + c.amount, 0) > 0 && (
              <div className="text-xs font-semibold text-rose-600 mb-2 italic">
                ({amountInWords(celebrityFees.reduce((sum, c) => sum + c.amount, 0))})
              </div>
            )}
            <div className="text-xs font-semibold text-rose-700 bg-rose-200 px-3 py-1.5 rounded-lg inline-block">
              Direct to Project Cost
            </div>
          </div>

          {/* Total Project Cost Card */}
          <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 rounded-xl border-3 border-purple-600 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-purple-900 uppercase tracking-wide">
                🎯 Total Project Cost
              </h4>
            </div>
            <div className="text-3xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
              {formatCurrency(
                getTotalAllocated() +
                Math.round(getTotalAllocated() * (creatorMarginPercent / 100)) +
                insuranceAmount +
                celebrityFees.reduce((sum, c) => sum + c.amount, 0)
              )}
            </div>
            {(getTotalAllocated() + Math.round(getTotalAllocated() * (creatorMarginPercent / 100)) + insuranceAmount + celebrityFees.reduce((sum, c) => sum + c.amount, 0)) > 0 && (
              <div className="text-xs font-semibold text-purple-600 mb-2 italic">
                ({amountInWords(getTotalAllocated() + Math.round(getTotalAllocated() * (creatorMarginPercent / 100)) + insuranceAmount + celebrityFees.reduce((sum, c) => sum + c.amount, 0))})
              </div>
            )}
            <div className="text-xs font-semibold text-purple-700 bg-purple-200 px-3 py-1.5 rounded-lg inline-block mb-3">
              Production + Margin + Insurance + Celebrity
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t-2 border-purple-300">
              <svg className="w-4 h-4 text-green-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-bold text-green-700">
                Auto-syncing to First Page & Cash Flow
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Analysis Visualization */}
      {getTotalAllocated() > 0 && (
        <div className="mb-8 bg-white border-2 border-purple-300 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">📊</span>
            <h3 className="text-2xl font-black bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
              Budget Analysis by Department
            </h3>
          </div>

          <div className="space-y-3">
            {categories
              .filter(cat => cat.amount > 0)
              .sort((a, b) => b.amount - a.amount)
              .map((category) => {
                const totalProduction = getTotalAllocated();
                const percentage = totalProduction > 0
                  ? ((category.amount / totalProduction) * 100).toFixed(1)
                  : 0;

                return (
                  <div key={category.id} className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-200 hover:border-purple-400 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{category.icon}</span>
                        <span className="font-bold text-gray-900">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-black text-purple-700">
                          {formatCurrency(category.amount)}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 font-black rounded-lg text-sm">
                          {percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>

                    {/* Min OTT Standard Comparison */}
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-gray-600">
                        Min OTT Standard: {category.industryBenchmark}%
                      </span>
                      <span className={`font-bold ${
                        Math.abs(parseFloat(percentage as string) - category.industryBenchmark) <= 3
                          ? 'text-green-600'
                          : Math.abs(parseFloat(percentage as string) - category.industryBenchmark) <= 7
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        {parseFloat(percentage as string) > category.industryBenchmark
                          ? `+${(parseFloat(percentage as string) - category.industryBenchmark).toFixed(1)}%`
                          : parseFloat(percentage as string) < category.industryBenchmark
                          ? `${(parseFloat(percentage as string) - category.industryBenchmark).toFixed(1)}%`
                          : 'On Target'}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Total Production Cost Summary */}
          <div className="mt-6 pt-6 border-t-2 border-purple-200">
            <div className="flex items-center justify-between bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
              <span className="text-lg font-black text-purple-900">Total Production Budget</span>
              <span className="text-2xl font-black text-purple-700">{formatCurrency(getTotalAllocated())}</span>
            </div>
          </div>
        </div>
      )}

      {/* Budget Categories */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-red-300 transition-colors"
          >
            {/* Category Header */}
            <div
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() =>
                setActiveCategory(activeCategory === category.id ? null : category.id)
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{category.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-500">
                        Min OTT Standard: {category.industryBenchmark}%
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(
                          category.yourPercentage,
                          category.industryBenchmark
                        )}`}
                      >
                        Your: {category.yourPercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right mr-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(category.amount)}
                  </div>
                </div>

                <button className="text-gray-400 hover:text-gray-600">
                  <svg
                    className={`w-6 h-6 transform transition-transform ${
                      activeCategory === category.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Category Details (Expandable) */}
            {activeCategory === category.id && (
              <div className="border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white p-6">
                <div className="overflow-x-auto shadow-sm rounded-lg">
                  <table className="w-full border-collapse bg-white">
                    <thead>
                      {category.id === 'cast' ? (
                        <tr className="bg-gradient-to-r from-gray-800 to-gray-700">
                          <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wider border-r border-gray-600">
                            Character Name
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wider border-r border-gray-600">
                            Actor Name
                          </th>
                          <th className="text-center px-4 py-3 text-xs font-bold text-white uppercase tracking-wider border-r border-gray-600">
                            Days
                          </th>
                          <th className="text-center px-4 py-3 text-xs font-bold text-white uppercase tracking-wider border-r border-gray-600">
                            People
                          </th>
                          <th className="text-right px-4 py-3 text-xs font-bold text-white uppercase tracking-wider border-r border-gray-600">
                            Per Day (₹)
                          </th>
                          <th className="text-right px-4 py-3 text-xs font-bold text-white uppercase tracking-wider border-r border-gray-600">
                            Lumpsum (₹)
                          </th>
                          <th className="text-right px-4 py-3 text-xs font-bold text-white uppercase tracking-wider bg-gradient-to-r from-blue-600 to-blue-500">
                            Total (₹)
                          </th>
                          <th className="px-3 py-3 bg-gradient-to-r from-gray-800 to-gray-700"></th>
                        </tr>
                      ) : (
                        <tr className="bg-gradient-to-r from-gray-800 to-gray-700">
                          <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wider border-r border-gray-600">
                            Item Description
                          </th>
                          <th className="text-center px-4 py-3 text-xs font-bold text-white uppercase tracking-wider border-r border-gray-600">
                            Days
                          </th>
                          <th className="text-center px-4 py-3 text-xs font-bold text-white uppercase tracking-wider border-r border-gray-600">
                            People
                          </th>
                          {category.id === 'travel' && (
                            <th className="text-center px-4 py-3 text-xs font-bold text-white uppercase tracking-wider border-r border-gray-600">
                              Rooms
                            </th>
                          )}
                          <th className="text-right px-4 py-3 text-xs font-bold text-white uppercase tracking-wider border-r border-gray-600">
                            Per Day (₹)
                          </th>
                          <th className="text-right px-4 py-3 text-xs font-bold text-white uppercase tracking-wider border-r border-gray-600">
                            Lumpsum (₹)
                          </th>
                          <th className="text-right px-4 py-3 text-xs font-bold text-white uppercase tracking-wider bg-gradient-to-r from-blue-600 to-blue-500">
                            Total (₹)
                          </th>
                          <th className="px-3 py-3 bg-gradient-to-r from-gray-800 to-gray-700"></th>
                        </tr>
                      )}
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {category.id === 'cast' ? (
                        <>
                          {/* Primary Section */}
                          <tr className="bg-gradient-to-r from-purple-100 to-purple-50">
                            <td colSpan={8} className="px-4 py-2 font-bold text-purple-900 text-sm uppercase tracking-wide">
                              Primary Casting
                            </td>
                          </tr>
                          {category.items.filter(item => item.section === 'primary').map((item, index) => (
                            <tr key={item.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="text"
                                  value={item.characterName || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'characterName', e.target.value)
                                  }
                                  placeholder="Character name"
                                  className="w-full px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none font-medium text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="text"
                                  value={item.actorName || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'actorName', e.target.value)
                                  }
                                  placeholder="Actor name"
                                  className="w-full px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none font-medium text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.noOfDays || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'noOfDays', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-20 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-center font-semibold text-gray-900 mx-auto block"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.noOfPeople || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'noOfPeople', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-20 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-center font-semibold text-gray-900 mx-auto block"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.perDay || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'perDay', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-28 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-right font-semibold text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.lumpsumFixed || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(
                                      category.id,
                                      item.id,
                                      'lumpsumFixed',
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  placeholder="0"
                                  className="w-28 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-right font-semibold text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-r border-blue-200">
                                <div className="text-sm font-bold text-blue-900 text-right pr-2">
                                  {formatCurrency(item.total)}
                                </div>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <button
                                  onClick={() => removeLineItem(category.id, item.id)}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-all duration-200 hover:scale-110"
                                  title="Remove"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-purple-50">
                            <td colSpan={8} className="px-3 py-2">
                              <button
                                onClick={() => addLineItem(category.id, 'primary')}
                                className="w-full px-3 py-2 text-sm bg-white border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium"
                              >
                                + Add Primary
                              </button>
                            </td>
                          </tr>

                          {/* Secondary Section */}
                          <tr className="bg-gradient-to-r from-blue-100 to-blue-50">
                            <td colSpan={8} className="px-4 py-2 font-bold text-blue-900 text-sm uppercase tracking-wide">
                              Secondary Casting
                            </td>
                          </tr>
                          {category.items.filter(item => item.section === 'secondary').map((item, index) => (
                            <tr key={item.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="text"
                                  value={item.characterName || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'characterName', e.target.value)
                                  }
                                  placeholder="Character name"
                                  className="w-full px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none font-medium text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="text"
                                  value={item.actorName || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'actorName', e.target.value)
                                  }
                                  placeholder="Actor name"
                                  className="w-full px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none font-medium text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.noOfDays || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'noOfDays', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-20 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-center font-semibold text-gray-900 mx-auto block"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.noOfPeople || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'noOfPeople', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-20 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-center font-semibold text-gray-900 mx-auto block"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.perDay || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'perDay', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-28 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-right font-semibold text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.lumpsumFixed || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(
                                      category.id,
                                      item.id,
                                      'lumpsumFixed',
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  placeholder="0"
                                  className="w-28 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-right font-semibold text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-r border-blue-200">
                                <div className="text-sm font-bold text-blue-900 text-right pr-2">
                                  {formatCurrency(item.total)}
                                </div>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <button
                                  onClick={() => removeLineItem(category.id, item.id)}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-all duration-200 hover:scale-110"
                                  title="Remove"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-blue-50">
                            <td colSpan={8} className="px-3 py-2">
                              <button
                                onClick={() => addLineItem(category.id, 'secondary')}
                                className="w-full px-3 py-2 text-sm bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                              >
                                + Add Secondary
                              </button>
                            </td>
                          </tr>

                          {/* Tertiary Section */}
                          <tr className="bg-gradient-to-r from-green-100 to-green-50">
                            <td colSpan={8} className="px-4 py-2 font-bold text-green-900 text-sm uppercase tracking-wide">
                              Tertiary Casting
                            </td>
                          </tr>
                          {category.items.filter(item => item.section === 'tertiary').map((item, index) => (
                            <tr key={item.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="text"
                                  value={item.characterName || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'characterName', e.target.value)
                                  }
                                  placeholder="Character name"
                                  className="w-full px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none font-medium text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="text"
                                  value={item.actorName || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'actorName', e.target.value)
                                  }
                                  placeholder="Actor name"
                                  className="w-full px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none font-medium text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.noOfDays || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'noOfDays', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-20 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-center font-semibold text-gray-900 mx-auto block"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.noOfPeople || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'noOfPeople', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-20 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-center font-semibold text-gray-900 mx-auto block"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.perDay || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'perDay', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-28 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-right font-semibold text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.lumpsumFixed || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(
                                      category.id,
                                      item.id,
                                      'lumpsumFixed',
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  placeholder="0"
                                  className="w-28 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-right font-semibold text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-r border-blue-200">
                                <div className="text-sm font-bold text-blue-900 text-right pr-2">
                                  {formatCurrency(item.total)}
                                </div>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <button
                                  onClick={() => removeLineItem(category.id, item.id)}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-all duration-200 hover:scale-110"
                                  title="Remove"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-green-50">
                            <td colSpan={8} className="px-3 py-2">
                              <button
                                onClick={() => addLineItem(category.id, 'tertiary')}
                                className="w-full px-3 py-2 text-sm bg-white border border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium"
                              >
                                + Add Tertiary
                              </button>
                            </td>
                          </tr>

                          {/* Juniors Section */}
                          <tr className="bg-gradient-to-r from-orange-100 to-orange-50">
                            <td colSpan={8} className="px-4 py-2 font-bold text-orange-900 text-sm uppercase tracking-wide">
                              Juniors
                            </td>
                          </tr>
                          {category.items.filter(item => item.section === 'juniors').map((item, index) => (
                            <tr key={item.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="text"
                                  value={item.characterName || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'characterName', e.target.value)
                                  }
                                  placeholder="Character name"
                                  className="w-full px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none font-medium text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="text"
                                  value={item.actorName || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'actorName', e.target.value)
                                  }
                                  placeholder="Actor name"
                                  className="w-full px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none font-medium text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.noOfDays || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'noOfDays', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-20 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-center font-semibold text-gray-900 mx-auto block"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.noOfPeople || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'noOfPeople', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-20 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-center font-semibold text-gray-900 mx-auto block"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.perDay || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'perDay', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-28 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-right font-semibold text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.lumpsumFixed || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(
                                      category.id,
                                      item.id,
                                      'lumpsumFixed',
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  placeholder="0"
                                  className="w-28 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-right font-semibold text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-r border-blue-200">
                                <div className="text-sm font-bold text-blue-900 text-right pr-2">
                                  {formatCurrency(item.total)}
                                </div>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <button
                                  onClick={() => removeLineItem(category.id, item.id)}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-all duration-200 hover:scale-110"
                                  title="Remove"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-orange-50">
                            <td colSpan={8} className="px-3 py-2">
                              <button
                                onClick={() => addLineItem(category.id, 'juniors')}
                                className="w-full px-3 py-2 text-sm bg-white border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors font-medium"
                              >
                                + Add Juniors
                              </button>
                            </td>
                          </tr>

                          {/* Cast Travel Section */}
                          <tr className="bg-gradient-to-r from-cyan-100 to-cyan-50">
                            <td colSpan={8} className="px-4 py-2 font-bold text-cyan-900 text-sm uppercase tracking-wide">
                              Cast Travel & Transportation
                            </td>
                          </tr>
                          {category.items.filter(item => item.section === 'travel').map((item, index) => (
                            <tr key={item.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="text"
                                  value={item.characterName || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'characterName', e.target.value)
                                  }
                                  placeholder="Character name"
                                  className="w-full px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none font-medium text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="text"
                                  value={item.actorName || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'actorName', e.target.value)
                                  }
                                  placeholder="Actor name"
                                  className="w-full px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none font-medium text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.noOfDays || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'noOfDays', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-20 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-center font-semibold text-gray-900 mx-auto block"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.noOfPeople || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'noOfPeople', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-20 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-center font-semibold text-gray-900 mx-auto block"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.perDay || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'perDay', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-28 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-right font-semibold text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.lumpsumFixed || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(
                                      category.id,
                                      item.id,
                                      'lumpsumFixed',
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  placeholder="0"
                                  className="w-28 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-right font-semibold text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-r border-blue-200">
                                <div className="text-sm font-bold text-blue-900 text-right pr-2">
                                  {formatCurrency(item.total)}
                                </div>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <button
                                  onClick={() => removeLineItem(category.id, item.id)}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-all duration-200 hover:scale-110"
                                  title="Remove"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-cyan-50">
                            <td colSpan={8} className="px-3 py-2">
                              <button
                                onClick={() => addLineItem(category.id, 'travel')}
                                className="w-full px-3 py-2 text-sm bg-white border border-cyan-300 text-cyan-700 rounded-lg hover:bg-cyan-100 transition-colors font-medium"
                              >
                                + Add Travel
                              </button>
                            </td>
                          </tr>

                          {/* Separate Fees Section */}
                          <tr className="bg-gradient-to-r from-teal-100 to-teal-50">
                            <td colSpan={8} className="px-4 py-2 font-bold text-teal-900 text-sm uppercase tracking-wide">
                              Separate Fees
                            </td>
                          </tr>
                          {category.items.filter(item => item.section === 'fees').map((item, index) => (
                            <tr key={item.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="text"
                                  value={item.characterName || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'characterName', e.target.value)
                                  }
                                  placeholder="Character name"
                                  className="w-full px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none font-medium text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="text"
                                  value={item.actorName || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'actorName', e.target.value)
                                  }
                                  placeholder="Actor name"
                                  className="w-full px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none font-medium text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.noOfDays || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'noOfDays', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-20 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-center font-semibold text-gray-900 mx-auto block"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.noOfPeople || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'noOfPeople', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-20 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-center font-semibold text-gray-900 mx-auto block"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.perDay || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'perDay', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-28 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-right font-semibold text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.lumpsumFixed || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(
                                      category.id,
                                      item.id,
                                      'lumpsumFixed',
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  placeholder="0"
                                  className="w-28 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-right font-semibold text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-r border-blue-200">
                                <div className="text-sm font-bold text-blue-900 text-right pr-2">
                                  {formatCurrency(item.total)}
                                </div>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <button
                                  onClick={() => removeLineItem(category.id, item.id)}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-all duration-200 hover:scale-110"
                                  title="Remove"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-teal-50">
                            <td colSpan={8} className="px-3 py-2">
                              <button
                                onClick={() => addLineItem(category.id, 'fees')}
                                className="w-full px-3 py-2 text-sm bg-white border border-teal-300 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors font-medium"
                              >
                                + Add Fees
                              </button>
                            </td>
                          </tr>
                        </>
                      ) : category.id === 'location' ? (
                        <>
                          {/* Studio & Rental Section */}
                          <tr className="bg-gradient-to-r from-blue-100 to-blue-50">
                            <td colSpan={7} className="px-4 py-2 font-bold text-blue-900 text-sm uppercase tracking-wide">
                              Studio & Location Rental
                            </td>
                          </tr>
                          {category.items.filter(item => item.section === 'rental').map((item, index) => (
                            <tr key={item.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'description', e.target.value)
                                  }
                                  placeholder="Enter item description"
                                  className="w-full px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none font-medium text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.noOfDays || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'noOfDays', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-20 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-center font-semibold text-gray-900 mx-auto block"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.noOfPeople || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'noOfPeople', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-20 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-center font-semibold text-gray-900 mx-auto block"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.perDay || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'perDay', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-28 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-right font-semibold text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.lumpsumFixed || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(
                                      category.id,
                                      item.id,
                                      'lumpsumFixed',
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  placeholder="0"
                                  className="w-28 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-right font-semibold text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-r border-blue-200">
                                <div className="text-sm font-bold text-blue-900 text-right pr-2">
                                  {formatCurrency(item.total)}
                                </div>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <button
                                  onClick={() => removeLineItem(category.id, item.id)}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-all duration-200 hover:scale-110"
                                  title="Remove"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-blue-50">
                            <td colSpan={7} className="px-3 py-2">
                              <button
                                onClick={() => addLineItem(category.id, 'rental')}
                                className="w-full px-3 py-2 text-sm bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                              >
                                + Add Rental
                              </button>
                            </td>
                          </tr>

                          {/* Construction Section */}
                          <tr className="bg-gradient-to-r from-orange-100 to-orange-50">
                            <td colSpan={7} className="px-4 py-2 font-bold text-orange-900 text-sm uppercase tracking-wide">
                              Set Construction
                            </td>
                          </tr>
                          {category.items.filter(item => item.section === 'construction').map((item, index) => (
                            <tr key={item.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'description', e.target.value)
                                  }
                                  placeholder="Enter item description"
                                  className="w-full px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none font-medium text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.noOfDays || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'noOfDays', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-20 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-center font-semibold text-gray-900 mx-auto block"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.noOfPeople || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'noOfPeople', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-20 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-center font-semibold text-gray-900 mx-auto block"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.perDay || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'perDay', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-28 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-right font-semibold text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.lumpsumFixed || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(
                                      category.id,
                                      item.id,
                                      'lumpsumFixed',
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  placeholder="0"
                                  className="w-28 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-right font-semibold text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-r border-blue-200">
                                <div className="text-sm font-bold text-blue-900 text-right pr-2">
                                  {formatCurrency(item.total)}
                                </div>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <button
                                  onClick={() => removeLineItem(category.id, item.id)}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-all duration-200 hover:scale-110"
                                  title="Remove"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-orange-50">
                            <td colSpan={7} className="px-3 py-2">
                              <button
                                onClick={() => addLineItem(category.id, 'construction')}
                                className="w-full px-3 py-2 text-sm bg-white border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors font-medium"
                              >
                                + Add Construction
                              </button>
                            </td>
                          </tr>

                          {/* Props Section */}
                          <tr className="bg-gradient-to-r from-green-100 to-green-50">
                            <td colSpan={7} className="px-4 py-2 font-bold text-green-900 text-sm uppercase tracking-wide">
                              Props
                            </td>
                          </tr>
                          {category.items.filter(item => item.section === 'props').map((item, index) => (
                            <tr key={item.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'description', e.target.value)
                                  }
                                  placeholder="Enter item description"
                                  className="w-full px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none font-medium text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.noOfDays || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'noOfDays', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-20 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-center font-semibold text-gray-900 mx-auto block"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.noOfPeople || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'noOfPeople', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-20 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-center font-semibold text-gray-900 mx-auto block"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.perDay || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'perDay', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-28 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-right font-semibold text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.lumpsumFixed || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(
                                      category.id,
                                      item.id,
                                      'lumpsumFixed',
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  placeholder="0"
                                  className="w-28 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-right font-semibold text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-r border-blue-200">
                                <div className="text-sm font-bold text-blue-900 text-right pr-2">
                                  {formatCurrency(item.total)}
                                </div>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <button
                                  onClick={() => removeLineItem(category.id, item.id)}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-all duration-200 hover:scale-110"
                                  title="Remove"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-green-50">
                            <td colSpan={7} className="px-3 py-2">
                              <button
                                onClick={() => addLineItem(category.id, 'props')}
                                className="w-full px-3 py-2 text-sm bg-white border border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium"
                              >
                                + Add Props
                              </button>
                            </td>
                          </tr>
                        </>
                      ) : (
                        category.items.map((item, index) => (
                        <tr key={item.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'description', e.target.value)
                                  }
                                  placeholder="Enter item description"
                                  className="w-full px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none font-medium text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.noOfDays || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'noOfDays', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-20 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-center font-semibold text-gray-900 mx-auto block"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.noOfPeople || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'noOfPeople', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-20 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-center font-semibold text-gray-900 mx-auto block"
                                />
                              </td>
                              {category.id === 'travel' && (
                                <td className="px-3 py-3 border-r border-gray-200">
                                  <input
                                    type="number"
                                    value={item.noOfRooms || ''}
                                    onChange={(e) =>
                                      handleLineItemChange(category.id, item.id, 'noOfRooms', parseFloat(e.target.value) || 0)
                                    }
                                    placeholder="0"
                                    className="w-20 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-center font-semibold text-gray-900 mx-auto block"
                                  />
                                </td>
                              )}
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.perDay || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(category.id, item.id, 'perDay', parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                  className="w-28 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-right font-semibold text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 border-r border-gray-200">
                                <input
                                  type="number"
                                  value={item.lumpsumFixed || ''}
                                  onChange={(e) =>
                                    handleLineItemChange(
                                      category.id,
                                      item.id,
                                      'lumpsumFixed',
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  placeholder="0"
                                  className="w-28 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-red-500 rounded outline-none text-right font-semibold text-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-r border-blue-200">
                                <div className="text-sm font-bold text-blue-900 text-right pr-2">
                                  {formatCurrency(item.total)}
                                </div>
                              </td>
                              <td className="px-3 py-3 text-center">
                                {category.items.length > 1 && (
                                  <button
                                    onClick={() => removeLineItem(category.id, item.id)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-all duration-200 hover:scale-110"
                                    title="Remove"
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                )}
                              </td>
                        </tr>
                      ))
                      )}
                      <tr className="bg-gradient-to-r from-yellow-100 to-amber-100 border-t-4 border-yellow-500">
                        <td
                          colSpan={category.id === 'cast' ? 7 : category.id === 'travel' ? 7 : 6}
                          className="px-4 py-3 text-sm font-bold text-gray-900 uppercase tracking-wide"
                        >
                          CATEGORY TOTAL
                        </td>
                        <td className="px-4 py-3 text-base font-bold text-gray-900 text-right bg-gradient-to-r from-yellow-200 to-amber-200 border-l-2 border-yellow-500">
                          {formatCurrency(category.amount)}
                        </td>
                        <td className="bg-gradient-to-r from-yellow-100 to-amber-100"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {category.id !== 'cast' && (
                  <button
                    onClick={() => addLineItem(category.id)}
                    className="mt-4 w-full px-4 py-3 text-sm bg-gradient-to-r from-gray-100 to-gray-50 border-2 border-dashed border-gray-300 text-gray-700 rounded-lg hover:border-red-400 hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
                  >
                    + Add Line Item
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Warning Messages */}
      {totalBudget > 0 && getRemainingBudget() < 0 && (
        <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
          <svg
            className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <h4 className="font-bold text-red-900">Budget Exceeded!</h4>
            <p className="text-sm text-red-700">
              You've allocated {formatCurrency(Math.abs(getRemainingBudget()))} more than your total
              budget. Please adjust your allocations.
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-10 flex justify-between">
        <button
          onClick={onBack}
          className="px-8 py-4 rounded-xl text-lg font-black transition-all duration-200 flex items-center gap-3 bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-600 text-white hover:from-purple-600 hover:via-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-2xl hover:scale-105 border-2 border-white/20"
        >
          <span className="text-xl">←</span>
          <span>Previous Step</span>
        </button>
        <button
          onClick={onNext}
          className="px-10 py-4 rounded-xl text-lg font-black transition-all duration-200 flex items-center gap-3 border-2 border-white/20 bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-2xl hover:scale-105"
        >
          <span>Continue to Next Step</span>
          <span className="text-xl">→</span>
        </button>
      </div>
    </div>
  );
}
