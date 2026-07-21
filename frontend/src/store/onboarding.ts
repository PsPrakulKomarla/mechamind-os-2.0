import { create } from "zustand";

interface OnboardingState {
  isOnboarded: boolean;
  hasDocuments: boolean;
  currentStep: number;
  uploadProgress: number;
  processingStage: string;
  completedSteps: string[];
  setOnboarded: (value: boolean) => void;
  setHasDocuments: (value: boolean) => void;
  setCurrentStep: (step: number) => void;
  setUploadProgress: (progress: number) => void;
  setProcessingStage: (stage: string) => void;
  addCompletedStep: (step: string) => void;
  reset: () => void;
}

const getStoredOnboardingState = () => {
  try {
    return localStorage.getItem("mechamind_onboarded") === "true";
  } catch {
    return false;
  }
};

const getStoredHasDocuments = () => {
  try {
    return localStorage.getItem("mechamind_has_documents") === "true";
  } catch {
    return false;
  }
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  isOnboarded: getStoredOnboardingState(),
  hasDocuments: getStoredHasDocuments(),
  currentStep: 0,
  uploadProgress: 0,
  processingStage: "",
  completedSteps: [],
  setOnboarded: (value) => {
    localStorage.setItem("mechamind_onboarded", String(value));
    set({ isOnboarded: value });
  },
  setHasDocuments: (value) => {
    localStorage.setItem("mechamind_has_documents", String(value));
    set({ hasDocuments: value });
  },
  setCurrentStep: (step) => set({ currentStep: step }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  setProcessingStage: (stage) => set({ processingStage: stage }),
  addCompletedStep: (step) => set((s) => ({ completedSteps: [...s.completedSteps, step] })),
  reset: () => {
    localStorage.removeItem("mechamind_onboarded");
    localStorage.removeItem("mechamind_has_documents");
    set({ isOnboarded: false, hasDocuments: false, currentStep: 0, uploadProgress: 0, processingStage: "", completedSteps: [] });
  },
}));
