import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { AIAssistantModal } from '../components/ai/AIAssistantModal';

export const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Global Authenticated Navigation Header */}
      <Navbar />

      {/* Main Authenticated Layout Body */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Sidebar />
          <section className="flex-1 min-w-0">
            {children}
          </section>
        </div>
      </main>

      {/* AI Assistant Modal */}
      <AIAssistantModal />

      {/* Global Authenticated Footer */}
      <footer className="border-t border-white/5 py-6 mt-12 text-center text-xs text-slate-500 space-y-1 no-print">
        <p className="font-semibold text-slate-400">
          Academia AI Ecosystem • Tech Vaders (SIH26044)
        </p>
        <p className="text-[11px] text-slate-500">
          Role-Based Access Control • Evidence-Based Skill Passports • Closed-Loop Analytics
        </p>
      </footer>

    </div>
  );
};
