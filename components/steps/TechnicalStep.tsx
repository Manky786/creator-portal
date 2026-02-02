'use client';

import { BudgetFormData, EquipmentItem } from '@/types/budget';

interface Props {
  formData: Partial<BudgetFormData>;
  setFormData: (data: Partial<BudgetFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function TechnicalStep({ formData, setFormData, onNext, onBack }: Props) {
  const technicalSpecs = formData.technicalSpecs || {
    cameraModel: '',
    cameraSetupType: '',
    lensTypes: [],
    cameraOthers: [],
    lightingEquipment: [],
    lightingOthers: [],
    cinematicTools: [],
    cinematicOthers: [],
    droneModels: [],
    droneOthers: [],
    soundEquipment: [],
    soundOthers: [],
  };

  const handleChange = (field: keyof typeof technicalSpecs, value: any) => {
    setFormData({
      ...formData,
      technicalSpecs: {
        ...technicalSpecs,
        [field]: value,
      },
    });
  };

  const addArrayItem = (field: keyof typeof technicalSpecs) => {
    if (typeof technicalSpecs[field] === 'object' && Array.isArray(technicalSpecs[field])) {
      handleChange(field, [...(technicalSpecs[field] as EquipmentItem[]), { name: '', quantity: 1 }]);
    }
  };

  const removeArrayItem = (field: keyof typeof technicalSpecs, index: number) => {
    if (typeof technicalSpecs[field] === 'object' && Array.isArray(technicalSpecs[field])) {
      const newArray = (technicalSpecs[field] as EquipmentItem[]).filter((_, i) => i !== index);
      handleChange(field, newArray);
    }
  };

  const updateArrayItem = (
    field: keyof typeof technicalSpecs,
    index: number,
    itemField: 'name' | 'quantity',
    value: string | number
  ) => {
    if (typeof technicalSpecs[field] === 'object' && Array.isArray(technicalSpecs[field])) {
      const newArray = [...(technicalSpecs[field] as EquipmentItem[])];
      newArray[index] = {
        ...newArray[index],
        [itemField]: value,
      };
      handleChange(field, newArray);
    }
  };

  const handleClearContents = () => {
    if (confirm('Are you sure you want to clear all technical specifications? This action cannot be undone.')) {
      setFormData({
        ...formData,
        technicalSpecs: {
          cameraModel: '',
          cameraSetupType: '',
          lensTypes: [],
          cameraOthers: [],
          lightingEquipment: [],
          lightingOthers: [],
          cinematicTools: [],
          cinematicOthers: [],
          droneModels: [],
          droneOthers: [],
          soundEquipment: [],
          soundOthers: [],
        },
      });
    }
  };

  const renderEquipmentList = (
    field: keyof typeof technicalSpecs,
    label: string,
    placeholder: string
  ) => {
    const items = (technicalSpecs[field] as EquipmentItem[]) || [];

    return (
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">{label}</label>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateArrayItem(field, index, 'name', e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60"
              />
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateArrayItem(field, index, 'quantity', parseInt(e.target.value) || 1)}
                placeholder="Qty"
                className="w-24 px-3 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-bold text-center hover:border-purple-400 transition-colors bg-white/60"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(field, index)}
                className="px-4 py-3 text-base border-2 border-red-400 text-red-700 font-bold rounded-lg hover:bg-red-100 transition-all duration-200 hover:scale-105"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem(field)}
            className="w-full px-4 py-3 text-base bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-bold shadow-md hover:shadow-lg hover:scale-105"
          >
            + Add {label}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Filmmaker Quote */}
      <div className="mb-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 rounded-xl p-6 backdrop-blur-lg">
        <div className="flex items-start gap-4">
          <span className="text-4xl">🎥</span>
          <div className="flex-1">
            <p className="text-lg md:text-xl font-bold text-amber-900 italic mb-2">
              "तकनीक और कला का संगम ही सिनेमा है।"
            </p>
            <p className="text-sm font-bold text-amber-800/80">— श्याम बेनेगल (Shyam Benegal)</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-5xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 bg-clip-text text-transparent tracking-tight">
            🎥 Technical Specifications
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
          Specify all equipment and technical details for your production
        </p>
      </div>

      <div className="space-y-6">
        {/* Camera Section */}
        <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-100 border-2 border-cyan-300 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">📹</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-cyan-700 to-blue-600 bg-clip-text text-transparent">
                Camera Equipment
              </h3>
              <p className="text-xs font-semibold text-cyan-700">Camera specs and lenses</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">1. Camera</h3>
          </div>

          <div className="space-y-6">
            {/* Camera Model */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Camera Model Name
              </label>
              <input
                type="text"
                value={technicalSpecs.cameraModel}
                onChange={(e) => handleChange('cameraModel', e.target.value)}
                placeholder="e.g., ARRI ALEXA Mini LF, RED Komodo 6K, Sony FX9"
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors bg-white/60 shadow-sm hover:shadow-md"
              />
            </div>

            {/* Setup Type */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Camera Setup Type
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => handleChange('cameraSetupType', 'single')}
                  className={`px-4 py-3 rounded-lg border-2 font-bold text-base transition-all ${
                    technicalSpecs.cameraSetupType === 'single'
                      ? 'border-purple-600 bg-purple-100 text-purple-900 shadow-md'
                      : 'border-gray-300 bg-white/60 text-gray-700 hover:border-purple-400 hover:bg-purple-50'
                  }`}
                >
                  Single Camera
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('cameraSetupType', 'double')}
                  className={`px-4 py-3 rounded-lg border-2 font-bold text-base transition-all ${
                    technicalSpecs.cameraSetupType === 'double'
                      ? 'border-purple-600 bg-purple-100 text-purple-900 shadow-md'
                      : 'border-gray-300 bg-white/60 text-gray-700 hover:border-purple-400 hover:bg-purple-50'
                  }`}
                >
                  Double Camera
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('cameraSetupType', 'triple')}
                  className={`px-4 py-3 rounded-lg border-2 font-bold text-base transition-all ${
                    technicalSpecs.cameraSetupType === 'triple'
                      ? 'border-purple-600 bg-purple-100 text-purple-900 shadow-md'
                      : 'border-gray-300 bg-white/60 text-gray-700 hover:border-purple-400 hover:bg-purple-50'
                  }`}
                >
                  Triple Camera
                </button>
              </div>
            </div>

            {/* Lens Types */}
            {renderEquipmentList(
              'lensTypes',
              'Lens Types',
              'e.g., Zeiss Supreme Prime 35mm T1.5, Canon CN-E 50mm T1.3'
            )}

            {/* Camera Others */}
            {renderEquipmentList(
              'cameraOthers',
              'Others (Camera Equipment)',
              'e.g., Matte Box, Follow Focus, Filters'
            )}
          </div>
        </div>

        {/* Lighting Section */}
        <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-2 border-amber-300 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">💡</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-amber-700 to-yellow-600 bg-clip-text text-transparent">
                Lighting Equipment
              </h3>
              <p className="text-xs font-semibold text-amber-700">Lights and accessories</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Lighting Equipment */}
            {renderEquipmentList(
              'lightingEquipment',
              'Lighting Equipment Details',
              'e.g., ARRI SkyPanel S60-C, Aputure 600D Pro, Dedolight DLED4'
            )}

            {/* Lighting Others */}
            {renderEquipmentList(
              'lightingOthers',
              'Others (Lighting Equipment)',
              'e.g., Light Stands, Diffusers, Reflectors, C-Stands'
            )}
          </div>
        </div>

        {/* Equipment Section */}
        <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 border-2 border-purple-300 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">🎬</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-purple-700 to-violet-600 bg-clip-text text-transparent">
                Cinematic Equipment & Tools
              </h3>
              <p className="text-xs font-semibold text-purple-700">Gimbals, drones, and sound gear</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Cinematic Tools */}
            <div>
              <p className="text-sm text-gray-700 mb-3 font-medium italic">Gimbals, Sliders, Dollies, Jibs, Cranes, Rigs, etc.</p>
              {renderEquipmentList(
                'cinematicTools',
                'Cinematic Tools and Equipment',
                'e.g., DJI Ronin 4D, Dana Dolly, Chapman PeeWee IV Dolly'
              )}
            </div>

            {/* Cinematic Others */}
            {renderEquipmentList(
              'cinematicOthers',
              'Others (Cinematic Equipment)',
              'e.g., Track System, Sandbags, Apple Boxes'
            )}

            {/* Drones */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-700 mb-3 font-medium italic">Aerial cinematography equipment</p>
              {renderEquipmentList(
                'droneModels',
                'Drone Models',
                'e.g., DJI Inspire 3, DJI Mavic 3 Cine, Freefly Alta X'
              )}
            </div>

            {/* Drone Others */}
            {renderEquipmentList(
              'droneOthers',
              'Others (Drone Equipment)',
              'e.g., Extra Batteries, ND Filters, Landing Pads'
            )}

            {/* Sound Equipment */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-700 mb-3 font-medium italic">Microphones, Recorders, Boom Poles, Wireless Systems, etc.</p>
              {renderEquipmentList(
                'soundEquipment',
                'Sound Equipment',
                'e.g., Sennheiser MKH 416, Sound Devices 833, Rode NTG5'
              )}
            </div>

            {/* Sound Others */}
            {renderEquipmentList(
              'soundOthers',
              'Others (Sound Equipment)',
              'e.g., XLR Cables, Wind Protection, Boom Pole'
            )}
          </div>
        </div>
      </div>

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
          className="px-10 py-4 rounded-xl text-lg font-black transition-all duration-200 flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-2xl hover:scale-105 border-2 border-white/20"
        >
          <span>Continue to Next Step</span>
          <span className="text-xl">→</span>
        </button>
      </div>
    </div>
  );
}
