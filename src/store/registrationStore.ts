/**
 * WorkerConnect — Registration Store (Zustand)
 * Manages multi-step registration wizard state with MMKV autosave.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants';
import type {
  RegistrationDraft,
  RegistrationStep,
  PersonalDetails,
  AddressDetails,
  JobPreferences,
  EducationDetails,
  ExperienceDetails,
  DocumentDetails,
} from '../types';

interface RegistrationState {
  draft: RegistrationDraft;
  isSubmitting: boolean;
  lastSavedAt: string | null;

  // Step navigation
  setStep: (step: RegistrationStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Step data setters
  setPersonal: (data: Partial<PersonalDetails>) => void;
  setAddress: (data: Partial<AddressDetails>) => void;
  setJobPreferences: (data: Partial<JobPreferences>) => void;
  setEducation: (data: Partial<EducationDetails>) => void;
  setExperience: (data: Partial<ExperienceDetails>[]) => void;
  setDocuments: (data: Partial<DocumentDetails>) => void;

  // Control
  setSubmitting: (val: boolean) => void;
  resetRegistration: () => void;
  autoSave: () => void;
}

const initialDraft: RegistrationDraft = {
  currentStep: 1,
};

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set, get) => ({
      draft: initialDraft,
      isSubmitting: false,
      lastSavedAt: null,

      setStep: (step) =>
        set((s) => ({ draft: { ...s.draft, currentStep: step } })),

      nextStep: () =>
        set((s) => ({
          draft: {
            ...s.draft,
            currentStep: Math.min(6, s.draft.currentStep + 1) as RegistrationStep,
          },
          lastSavedAt: new Date().toISOString(),
        })),

      prevStep: () =>
        set((s) => ({
          draft: {
            ...s.draft,
            currentStep: Math.max(1, s.draft.currentStep - 1) as RegistrationStep,
          },
        })),

      setPersonal: (data) =>
        set((s) => ({
          draft: { ...s.draft, personal: { ...s.draft.personal, ...data } },
          lastSavedAt: new Date().toISOString(),
        })),

      setAddress: (data) =>
        set((s) => ({
          draft: { ...s.draft, address: { ...s.draft.address, ...data } },
          lastSavedAt: new Date().toISOString(),
        })),

      setJobPreferences: (data) =>
        set((s) => ({
          draft: { ...s.draft, jobPreferences: { ...s.draft.jobPreferences, ...data } },
          lastSavedAt: new Date().toISOString(),
        })),

      setEducation: (data) =>
        set((s) => ({
          draft: { ...s.draft, education: { ...s.draft.education, ...data } },
          lastSavedAt: new Date().toISOString(),
        })),

      setExperience: (data) =>
        set((s) => ({
          draft: { ...s.draft, experience: data },
          lastSavedAt: new Date().toISOString(),
        })),

      setDocuments: (data) =>
        set((s) => ({
          draft: { ...s.draft, documents: { ...s.draft.documents, ...data } },
          lastSavedAt: new Date().toISOString(),
        })),

      setSubmitting: (isSubmitting) => set({ isSubmitting }),

      resetRegistration: () =>
        set({ draft: initialDraft, isSubmitting: false, lastSavedAt: null }),

      autoSave: () =>
        set({ lastSavedAt: new Date().toISOString() }),
    }),
    {
      name: STORAGE_KEYS.REGISTRATION_DRAFT,
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        draft: state.draft,
        lastSavedAt: state.lastSavedAt,
      }),
    }
  )
);
