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

// Helper component for Name + Work Link pair
const CrewMemberField = ({
  label,
  nameField,
  linkField,
  nameValue,
  linkValue,
  onChange,
}: {
  label: string;
  nameField: string;
  linkField: string;
  nameValue: string;
  linkValue: string;
  onChange: (field: string, value: string) => void;
}) => (
  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 hover:bg-white/80 transition-all duration-200">
    <label className="block text-sm font-bold text-gray-900 mb-2">{label}</label>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <input
        type="text"
        value={nameValue}
        onChange={(e) => onChange(nameField, e.target.value)}
        placeholder="Name"
        className="px-3 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors shadow-sm hover:shadow-md"
      />
      <input
        type="url"
        value={linkValue}
        onChange={(e) => onChange(linkField, e.target.value)}
        placeholder="Work link"
        className="px-3 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors shadow-sm hover:shadow-md"
      />
    </div>
  </div>
);

// Dynamic Others field component with Add functionality
const OthersField = ({
  label,
  fieldName,
  values,
  onChange,
}: {
  label: string;
  fieldName: string;
  values: { name: string; link: string }[];
  onChange: (field: string, value: { name: string; link: string }[]) => void;
}) => {
  const addEntry = () => {
    onChange(fieldName, [...values, { name: '', link: '' }]);
  };

  const removeEntry = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(fieldName, newValues);
  };

  const updateEntry = (index: number, field: 'name' | 'link', value: string) => {
    const newValues = [...values];
    newValues[index][field] = value;
    onChange(fieldName, newValues);
  };

  return (
    <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3">
      <label className="block text-sm font-bold text-gray-900 mb-2">{label}</label>
      <div className="space-y-2">
        {values.map((entry, index) => (
          <div key={index} className="flex gap-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">
              <input
                type="text"
                value={entry.name}
                onChange={(e) => updateEntry(index, 'name', e.target.value)}
                placeholder="Name"
                className="px-3 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors shadow-sm hover:shadow-md"
              />
              <input
                type="url"
                value={entry.link}
                onChange={(e) => updateEntry(index, 'link', e.target.value)}
                placeholder="Work link"
                className="px-3 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal hover:border-purple-400 transition-colors shadow-sm hover:shadow-md"
              />
            </div>
            <button
              type="button"
              onClick={() => removeEntry(index)}
              className="px-3 py-2.5 text-sm border-2 border-red-400 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 font-bold hover:scale-105"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addEntry}
          className="px-4 py-2.5 text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-bold shadow-md hover:shadow-lg hover:scale-105"
        >
          + Add {label}
        </button>
      </div>
    </div>
  );
};

export default function CrewStep({ formData, setFormData, onNext, onBack }: Props) {
  const handleChange = (field: string, value: string | { name: string; link: string }[]) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleClearContents = () => {
    if (confirm('Are you sure you want to clear all crew details? This action cannot be undone.')) {
      setFormData({
        ...formData,
        director: '', directorLink: '', associateDirector: '', associateDirectorLink: '',
        assistantDirector1: '', assistantDirector1Link: '', assistantDirector2: '', assistantDirector2Link: '',
        directionOthers: [],
        headOfProduction: '', headOfProductionLink: '', executiveProducer: '', executiveProducerLink: '',
        productionController: '', productionControllerLink: '', lineProducer: '', lineProducerLink: '',
        unitProductionManager: '', unitProductionManagerLink: '', locationManager: '', locationManagerLink: '',
        productionOthers: [],
        showRunner: '', showRunnerLink: '', projectHead: '', projectHeadLink: '',
        creativeDirector: '', creativeDirectorLink: '', associateCreativeDirector: '', associateCreativeDirectorLink: '',
        creativeOthers: [],
        storyBy: '', storyByLink: '', screenplayBy: '', screenplayByLink: '',
        dialoguesBy: '', dialoguesByLink: '', writingOthers: [],
        dop: '', dopLink: '', firstCameraOperator: '', firstCameraOperatorLink: '',
        cameraOperator: '', cameraOperatorLink: '', focusPuller: '', focusPullerLink: '',
        steadicamOperator: '', steadicamOperatorLink: '', cameraOthers: [],
        editor: '', editorLink: '', onLocationEditor: '', onLocationEditorLink: '',
        colorist: '', coloristLink: '', editingOthers: [],
        soundRecordist: '', soundRecordistLink: '', soundDesigner: '', soundDesignerLink: '',
        foleyArtist: '', foleyArtistLink: '', reRecordingMixer: '', reRecordingMixerLink: '',
        soundOthers: [],
        musicComposer: '', musicComposerLink: '', bgmComposer: '', bgmComposerLink: '',
        playbackSinger: '', playbackSingerLink: '', musicOthers: [],
        productionDesigner: '', productionDesignerLink: '', artDirector: '', artDirectorLink: '',
        setDesigner: '', setDesignerLink: '', artOthers: [],
        costumeDesigner: '', costumeDesignerLink: '', makeupArtist: '', makeupArtistLink: '',
        hairStylist: '', hairStylistLink: '', costumeOthers: [],
        vfxSupervisor: '', vfxSupervisorLink: '', diArtist: '', diArtistLink: '',
        vfxOthers: [],
        actionDirector: '', actionDirectorLink: '', stuntCoordinator: '', stuntCoordinatorLink: '',
        choreographer: '', choreographerLink: '', actionOthers: [],
        castingDirector: '', castingDirectorLink: '', castingOthers: [],
        stillPhotographer: '', stillPhotographerLink: '', btsVideographer: '', btsVideographerLink: '',
        photographyOthers: [],
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Filmmaker Quote */}
      <div className="mb-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 rounded-xl p-6 backdrop-blur-lg">
        <div className="flex items-start gap-4">
          <span className="text-4xl">👥</span>
          <div className="flex-1">
            <p className="text-lg md:text-xl font-bold text-amber-900 italic mb-2">
              "फिल्म निर्माण एक टीम का काम है, और हर सदस्य महत्वपूर्ण है।"
            </p>
            <p className="text-sm font-bold text-amber-800/80">— यश चोपड़ा (Yash Chopra)</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-5xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 bg-clip-text text-transparent tracking-tight">
            🎬 Crew & Team Details
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
          Build your dream team - add crew members across all departments
        </p>
      </div>

      <div className="space-y-6">
        {/* Direction Department */}
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 rounded-xl border-2 border-purple-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">🎬</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                Direction Department
              </h3>
              <p className="text-xs font-semibold text-purple-700">Director and assistant directors</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CrewMemberField
              label="Director"
              nameField="director"
              linkField="directorLink"
              nameValue={formData.director || ''}
              linkValue={formData.directorLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Associate Director"
              nameField="associateDirector"
              linkField="associateDirectorLink"
              nameValue={formData.associateDirector || ''}
              linkValue={formData.associateDirectorLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="1st Assistant Director"
              nameField="assistantDirector1"
              linkField="assistantDirector1Link"
              nameValue={formData.assistantDirector1 || ''}
              linkValue={formData.assistantDirector1Link || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="2nd Assistant Director"
              nameField="assistantDirector2"
              linkField="assistantDirector2Link"
              nameValue={formData.assistantDirector2 || ''}
              linkValue={formData.assistantDirector2Link || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <OthersField
              label="Others"
              fieldName="directionOthers"
              values={formData.directionOthers || []}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Production Department */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 rounded-xl border-2 border-blue-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">🎯</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                Production Department
              </h3>
              <p className="text-xs font-semibold text-blue-700">Production team and managers</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CrewMemberField
              label="Head of Production"
              nameField="headOfProduction"
              linkField="headOfProductionLink"
              nameValue={formData.headOfProduction || ''}
              linkValue={formData.headOfProductionLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Executive Producer"
              nameField="executiveProducer"
              linkField="executiveProducerLink"
              nameValue={formData.executiveProducer || ''}
              linkValue={formData.executiveProducerLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Production Controller"
              nameField="productionController"
              linkField="productionControllerLink"
              nameValue={formData.productionController || ''}
              linkValue={formData.productionControllerLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Line Producer"
              nameField="lineProducer"
              linkField="lineProducerLink"
              nameValue={formData.lineProducer || ''}
              linkValue={formData.lineProducerLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Unit Production Manager"
              nameField="unitProductionManager"
              linkField="unitProductionManagerLink"
              nameValue={formData.unitProductionManager || ''}
              linkValue={formData.unitProductionManagerLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Location Manager"
              nameField="locationManager"
              linkField="locationManagerLink"
              nameValue={formData.locationManager || ''}
              linkValue={formData.locationManagerLink || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <OthersField
              label="Others"
              fieldName="productionOthers"
              values={formData.productionOthers || []}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Creative Department */}
        <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 rounded-xl border-2 border-green-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">💡</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                Creative Department
              </h3>
              <p className="text-xs font-semibold text-green-700">Creative leadership team</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CrewMemberField
              label="Show Runner"
              nameField="showRunner"
              linkField="showRunnerLink"
              nameValue={formData.showRunner || ''}
              linkValue={formData.showRunnerLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Project Head"
              nameField="projectHead"
              linkField="projectHeadLink"
              nameValue={formData.projectHead || ''}
              linkValue={formData.projectHeadLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Creative Director"
              nameField="creativeDirector"
              linkField="creativeDirectorLink"
              nameValue={formData.creativeDirector || ''}
              linkValue={formData.creativeDirectorLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Associate Creative Director"
              nameField="associateCreativeDirector"
              linkField="associateCreativeDirectorLink"
              nameValue={formData.associateCreativeDirector || ''}
              linkValue={formData.associateCreativeDirectorLink || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <OthersField
              label="Others"
              fieldName="creativeOthers"
              values={formData.creativeOthers || []}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Writing Department */}
        <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 rounded-xl border-2 border-amber-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">✍️</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-amber-700 to-yellow-600 bg-clip-text text-transparent">
                Writing Department
              </h3>
              <p className="text-xs font-semibold text-amber-700">Writers and screenwriters</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CrewMemberField
              label="Story by"
              nameField="storyBy"
              linkField="storyByLink"
              nameValue={formData.storyBy || ''}
              linkValue={formData.storyByLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Screenplay by"
              nameField="screenplayBy"
              linkField="screenplayByLink"
              nameValue={formData.screenplayBy || ''}
              linkValue={formData.screenplayByLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Dialogues by"
              nameField="dialoguesBy"
              linkField="dialoguesByLink"
              nameValue={formData.dialoguesBy || ''}
              linkValue={formData.dialoguesByLink || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <OthersField
              label="Others"
              fieldName="writingOthers"
              values={formData.writingOthers || []}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Camera Department */}
        <div className="bg-gradient-to-br from-cyan-50 via-sky-50 to-cyan-100 rounded-xl border-2 border-cyan-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-sky-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">📹</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-cyan-700 to-sky-600 bg-clip-text text-transparent">
                Camera Department
              </h3>
              <p className="text-xs font-semibold text-cyan-700">Cinematography crew</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CrewMemberField
              label="Director of Photography (D.O.P)"
              nameField="dop"
              linkField="dopLink"
              nameValue={formData.dop || ''}
              linkValue={formData.dopLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="1st Camera Operator"
              nameField="firstCameraOperator"
              linkField="firstCameraOperatorLink"
              nameValue={formData.firstCameraOperator || ''}
              linkValue={formData.firstCameraOperatorLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Camera Operator"
              nameField="cameraOperator"
              linkField="cameraOperatorLink"
              nameValue={formData.cameraOperator || ''}
              linkValue={formData.cameraOperatorLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Focus Puller"
              nameField="focusPuller"
              linkField="focusPullerLink"
              nameValue={formData.focusPuller || ''}
              linkValue={formData.focusPullerLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Steadicam Operator"
              nameField="steadicamOperator"
              linkField="steadicamOperatorLink"
              nameValue={formData.steadicamOperator || ''}
              linkValue={formData.steadicamOperatorLink || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <OthersField
              label="Others"
              fieldName="cameraOthers"
              values={formData.cameraOthers || []}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Editing Department */}
        <div className="bg-gradient-to-br from-red-50 via-rose-50 to-red-100 rounded-xl border-2 border-red-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">✂️</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-red-700 to-rose-600 bg-clip-text text-transparent">
                Editing Department
              </h3>
              <p className="text-xs font-semibold text-red-700">Post-production editors</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CrewMemberField
              label="Editor"
              nameField="editor"
              linkField="editorLink"
              nameValue={formData.editor || ''}
              linkValue={formData.editorLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="On-location Editor"
              nameField="onLocationEditor"
              linkField="onLocationEditorLink"
              nameValue={formData.onLocationEditor || ''}
              linkValue={formData.onLocationEditorLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Colorist"
              nameField="colorist"
              linkField="coloristLink"
              nameValue={formData.colorist || ''}
              linkValue={formData.coloristLink || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <OthersField
              label="Others"
              fieldName="editingOthers"
              values={formData.editingOthers || []}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Sound Department */}
        <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-violet-100 rounded-xl border-2 border-violet-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">🎧</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">
                Sound Department
              </h3>
              <p className="text-xs font-semibold text-violet-700">Audio recording and design</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CrewMemberField
              label="Sound Recordist"
              nameField="soundRecordist"
              linkField="soundRecordistLink"
              nameValue={formData.soundRecordist || ''}
              linkValue={formData.soundRecordistLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Sound Designer"
              nameField="soundDesigner"
              linkField="soundDesignerLink"
              nameValue={formData.soundDesigner || ''}
              linkValue={formData.soundDesignerLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Foley Artist"
              nameField="foleyArtist"
              linkField="foleyArtistLink"
              nameValue={formData.foleyArtist || ''}
              linkValue={formData.foleyArtistLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Re-Recording Mixer"
              nameField="reRecordingMixer"
              linkField="reRecordingMixerLink"
              nameValue={formData.reRecordingMixer || ''}
              linkValue={formData.reRecordingMixerLink || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <OthersField
              label="Others"
              fieldName="soundOthers"
              values={formData.soundOthers || []}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Music Department */}
        <div className="bg-gradient-to-br from-fuchsia-50 via-pink-50 to-fuchsia-100 rounded-xl border-2 border-fuchsia-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">🎵</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-fuchsia-700 to-pink-600 bg-clip-text text-transparent">
                Music Department
              </h3>
              <p className="text-xs font-semibold text-fuchsia-700">Composers and singers</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CrewMemberField
              label="Music Composer"
              nameField="musicComposer"
              linkField="musicComposerLink"
              nameValue={formData.musicComposer || ''}
              linkValue={formData.musicComposerLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Background Music Composer"
              nameField="bgmComposer"
              linkField="bgmComposerLink"
              nameValue={formData.bgmComposer || ''}
              linkValue={formData.bgmComposerLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Playback Singer"
              nameField="playbackSinger"
              linkField="playbackSingerLink"
              nameValue={formData.playbackSinger || ''}
              linkValue={formData.playbackSingerLink || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <OthersField
              label="Others"
              fieldName="musicOthers"
              values={formData.musicOthers || []}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Art & Design Department */}
        <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-100 rounded-xl border-2 border-teal-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">🎨</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent">
                Art & Design Department
              </h3>
              <p className="text-xs font-semibold text-teal-700">Production design team</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CrewMemberField
              label="Production Designer"
              nameField="productionDesigner"
              linkField="productionDesignerLink"
              nameValue={formData.productionDesigner || ''}
              linkValue={formData.productionDesignerLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Art Director"
              nameField="artDirector"
              linkField="artDirectorLink"
              nameValue={formData.artDirector || ''}
              linkValue={formData.artDirectorLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Set Designer"
              nameField="setDesigner"
              linkField="setDesignerLink"
              nameValue={formData.setDesigner || ''}
              linkValue={formData.setDesignerLink || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <OthersField
              label="Others"
              fieldName="artOthers"
              values={formData.artOthers || []}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Costume & Makeup Department */}
        <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 rounded-xl border-2 border-orange-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">👗</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-orange-700 to-amber-600 bg-clip-text text-transparent">
                Costume & Makeup Department
              </h3>
              <p className="text-xs font-semibold text-orange-700">Wardrobe and makeup artists</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CrewMemberField
              label="Costume Designer"
              nameField="costumeDesigner"
              linkField="costumeDesignerLink"
              nameValue={formData.costumeDesigner || ''}
              linkValue={formData.costumeDesignerLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Makeup Artist"
              nameField="makeupArtist"
              linkField="makeupArtistLink"
              nameValue={formData.makeupArtist || ''}
              linkValue={formData.makeupArtistLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Hair Stylist"
              nameField="hairStylist"
              linkField="hairStylistLink"
              nameValue={formData.hairStylist || ''}
              linkValue={formData.hairStylistLink || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <OthersField
              label="Others"
              fieldName="costumeOthers"
              values={formData.costumeOthers || []}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* VFX & Post Production */}
        <div className="bg-gradient-to-br from-lime-50 via-green-50 to-lime-100 rounded-xl border-2 border-lime-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-lime-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">✨</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-lime-700 to-green-600 bg-clip-text text-transparent">
                VFX & Post Production
              </h3>
              <p className="text-xs font-semibold text-lime-700">Visual effects team</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CrewMemberField
              label="VFX Supervisor"
              nameField="vfxSupervisor"
              linkField="vfxSupervisorLink"
              nameValue={formData.vfxSupervisor || ''}
              linkValue={formData.vfxSupervisorLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Digital Intermediate (D.I.) Artist"
              nameField="diArtist"
              linkField="diArtistLink"
              nameValue={formData.diArtist || ''}
              linkValue={formData.diArtistLink || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <OthersField
              label="Others"
              fieldName="vfxOthers"
              values={formData.vfxOthers || []}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Action & Choreography */}
        <div className="bg-gradient-to-br from-rose-50 via-red-50 to-rose-100 rounded-xl border-2 border-rose-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">🥊</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-rose-700 to-red-600 bg-clip-text text-transparent">
                Action & Choreography
              </h3>
              <p className="text-xs font-semibold text-rose-700">Stunts and dance choreography</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CrewMemberField
              label="Action Director"
              nameField="actionDirector"
              linkField="actionDirectorLink"
              nameValue={formData.actionDirector || ''}
              linkValue={formData.actionDirectorLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Stunt Coordinator"
              nameField="stuntCoordinator"
              linkField="stuntCoordinatorLink"
              nameValue={formData.stuntCoordinator || ''}
              linkValue={formData.stuntCoordinatorLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="Choreographer"
              nameField="choreographer"
              linkField="choreographerLink"
              nameValue={formData.choreographer || ''}
              linkValue={formData.choreographerLink || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <OthersField
              label="Others"
              fieldName="actionOthers"
              values={formData.actionOthers || []}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Casting */}
        <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 rounded-xl border-2 border-indigo-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">🎭</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent">
                Casting
              </h3>
              <p className="text-xs font-semibold text-indigo-700">Casting directors</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CrewMemberField
              label="Casting Director"
              nameField="castingDirector"
              linkField="castingDirectorLink"
              nameValue={formData.castingDirector || ''}
              linkValue={formData.castingDirectorLink || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <OthersField
              label="Others"
              fieldName="castingOthers"
              values={formData.castingOthers || []}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Photography & Documentation */}
        <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 rounded-xl border-2 border-slate-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all">
              <span className="text-3xl">📸</span>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-slate-700 to-gray-600 bg-clip-text text-transparent">
                Photography & Documentation
              </h3>
              <p className="text-xs font-semibold text-slate-700">Stills and BTS coverage</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CrewMemberField
              label="Still Photographer"
              nameField="stillPhotographer"
              linkField="stillPhotographerLink"
              nameValue={formData.stillPhotographer || ''}
              linkValue={formData.stillPhotographerLink || ''}
              onChange={handleChange}
            />
            <CrewMemberField
              label="BTS Videographer"
              nameField="btsVideographer"
              linkField="btsVideographerLink"
              nameValue={formData.btsVideographer || ''}
              linkValue={formData.btsVideographerLink || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <OthersField
              label="Others"
              fieldName="photographyOthers"
              values={formData.photographyOthers || []}
              onChange={handleChange}
            />
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
