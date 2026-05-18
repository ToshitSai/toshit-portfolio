"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { EditorDevice, GeneratedSite, SiteSection } from "@/types/site";

type EditorState = {
  site: GeneratedSite | null;
  selectedSectionId: string | null;
  device: EditorDevice;
  history: GeneratedSite[];
  future: GeneratedSite[];
  setSite: (site: GeneratedSite) => void;
  selectSection: (sectionId: string | null) => void;
  setDevice: (device: EditorDevice) => void;
  updateSection: (sectionId: string, patch: Partial<SiteSection>) => void;
  reorderSections: (from: number, to: number) => void;
  undo: () => void;
  redo: () => void;
};

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      site: null,
      selectedSectionId: null,
      device: "desktop",
      history: [],
      future: [],
      setSite: (site) => set({ site, history: [], future: [], selectedSectionId: site.sections[1]?.id ?? null }),
      selectSection: (sectionId) => set({ selectedSectionId: sectionId }),
      setDevice: (device) => set({ device }),
      updateSection: (sectionId, patch) => {
        const current = get().site;
        if (!current) return;
        const next = {
          ...current,
          sections: current.sections.map((section) =>
            section.id === sectionId ? { ...section, ...patch } : section,
          ),
        };
        set({ site: next, history: [...get().history, current], future: [] });
      },
      reorderSections: (from, to) => {
        const current = get().site;
        if (!current) return;
        const sections = [...current.sections];
        const [item] = sections.splice(from, 1);
        if (!item) return;
        sections.splice(to, 0, item);
        set({ site: { ...current, sections }, history: [...get().history, current], future: [] });
      },
      undo: () => {
        const history = get().history;
        const current = get().site;
        const previous = history.at(-1);
        if (!previous || !current) return;
        set({ site: previous, history: history.slice(0, -1), future: [current, ...get().future] });
      },
      redo: () => {
        const [next, ...rest] = get().future;
        const current = get().site;
        if (!next || !current) return;
        set({ site: next, history: [...get().history, current], future: rest });
      },
    }),
    { name: "nebula-editor" },
  ),
);
