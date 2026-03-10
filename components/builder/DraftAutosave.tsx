'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { BuilderFormData, SiteConfig, DraftState } from '@/lib/types';

const DRAFT_STORAGE_KEY = 'keystory_builder_draft';
const AUTOSAVE_DELAY = 2000; // 2 seconds

interface DraftAutosaveProps {
  form: BuilderFormData;
  config: SiteConfig;
  currentStep: number;
  completedSteps: number[];
  onRestore: (draft: DraftState) => void;
  enabled?: boolean;
}

export default function DraftAutosave({
  form,
  config,
  currentStep,
  completedSteps,
  onRestore,
  enabled = true,
}: DraftAutosaveProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for existing draft on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        setHasDraft(true);
      }
    }
  }, []);

  // Save draft function
  const saveDraft = useCallback(() => {
    if (!enabled) return;
    
    setIsSaving(true);
    
    const draft: DraftState = {
      form,
      config,
      currentStep,
      completedSteps,
      lastSaved: new Date().toISOString(),
      isDirty: false,
    };

    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setIsSaving(false);
    }
  }, [form, config, currentStep, completedSteps, enabled]);

  // Debounced autosave on form/config changes
  useEffect(() => {
    if (!enabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveDraft();
    }, AUTOSAVE_DELAY);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [form, config, currentStep, completedSteps, saveDraft, enabled]);

  // Restore draft handler
  const handleRestoreDraft = useCallback(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const draft: DraftState = JSON.parse(savedDraft);
        onRestore(draft);
        setHasDraft(false);
      } catch (error) {
        console.error('Failed to restore draft:', error);
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    }
  }, [onRestore]);

  // Clear draft handler
  const handleClearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setHasDraft(false);
    setLastSaved(null);
  }, []);

  // Save immediately
  const handleSaveNow = useCallback(() => {
    saveDraft();
  }, [saveDraft]);

  return {
    lastSaved,
    isSaving,
    hasDraft,
    handleRestoreDraft,
    handleClearDraft,
    handleSaveNow,
  };
}

// Utility functions for draft management
export const saveDraftToStorage = (draft: DraftState): boolean => {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    return true;
  } catch (error) {
    console.error('Failed to save draft to storage:', error);
    return false;
  }
};

export const loadDraftFromStorage = (): DraftState | null => {
  try {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      return JSON.parse(savedDraft);
    }
    return null;
  } catch (error) {
    console.error('Failed to load draft from storage:', error);
    return null;
  }
};

export const clearDraftFromStorage = (): void => {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear draft from storage:', error);
  }
};

