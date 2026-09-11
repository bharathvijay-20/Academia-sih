import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Landmark, 
  Flame, 
  Sparkles, 
  PieChart, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Printer, 
  PlusCircle, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  Award,
  BookOpen,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const InstitutionDashboard = () => {
  const { 
    activeTab, 
    setActiveTab, 
    institutionData, 
    createTrainingProgram, 
    addNotification 
  } = useApp();

  // Bootcamp Creator Modal State
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [selectedGapSkill, setSelectedGapSkill] = useState(institutionData.skillDemandHeatmap[0].skill);
  const [bootcampDuration, setBootcampDuration] = useState('4 Weeks');
  const [trainerPartner, setTrainerPartner] = useState('Apex Digital Labs');

  // Trigger Creation of Campus Training Program
  const handleCreateBootcamp = (e) => {
    e.preventDefault();
    createTrainingProgram(selectedGapSkill, 4, trainerPartner);
    setShowProgramModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Institution Header Banner */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-950/60 via-slate-900/80 to-slate-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  Institutional Administrator Portal
                </span>
                <span className="text-xs text-slate-400">• {institutionData.accreditation}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                {institutionData.institutionName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Campus Executive Dashboard. Monitoring industry demand signals, student skill distributions, internship conversions, and closing curriculum gaps through industry bootcamps.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('skill-heatmap')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-semibold shadow-lg shadow-amber-600/30 hover:scale-105 transition-all"
              >
                <Flame className="w-4 h-4" />
                <span>Skill Demand Heatmap</span>
              </button>
              <button
                onClick={() => setActiveTab('training-programs')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-all"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Launch Bootcamp</span>
              </button>
            </div>
          </div>

          {/* Macro KPI Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-1">
              <span className="text-xs text-slate-400">Total Enrolled Students</span>
              <p className="text-2xl font-bold font-display text-white">{institutionData.totalStudents.toLocaleString()}</p>
              <span className="text-[11px] text-indigo-300 font-medium">186 Full-time Faculty</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-1">
              <span className="text-xs text-slate-400">Placements This Year</span>
              <p className="text-2xl font-bold font-display text-white">{institutionData.placementsThisYear}</p>
              <span className="text-[11px] text-emerald-400 font-medium">Avg: {institutionData.averagePackage} • High: {institutionData.highestPackage}</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-1">
              <span className="text-xs text-slate-400">Active Industry Internships</span>
              <p className="text-2xl font-bold font-display text-white">{institutionData.activeInternships}</p>
              <span className="text-[11px] text-cyan-400 font-medium">Across 74 Corporate Partners</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-1">
              <span className="text-xs text-slate-400">Active MoUs & Live Projects</span>
              <p className="text-2xl font-bold font-display text-white">{institutionData.liveProjects} Projects</p>
              <span className="text-[11px] text-amber-400 font-medium">17 Research Collaborations</span>
            </div>

          </div>

          {/* Closed-Loop Curriculum Architecture Diagram Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-white">⭐ Closed-Loop Institutional Skill Architecture</h3>
                <p className="text-xs text-slate-400">
                  How Academia continuously transforms live industry requirements into campus training interventions
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Continuous Improvement Loop Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
              
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                <span className="text-xs font-bold text-cyan-400">1. Industry Demand Signal</span>
                <p className="text-[11px] text-slate-300">Live job posts & requirements aggregated (e.g. Cloud: 86%)</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                <span className="text-xs font-bold text-rose-400">2. Institutional Gap Alert</span>
                <p className="text-[11px] text-slate-300">Heatmap identifies 52% deficit in Cloud & Docker</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                <span className="text-xs font-bold text-amber-400">3. Campus Training Trigger</span>
                <p className="text-[11px] text-slate-300">1-click bootcamp launched with Apex Labs partner</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                <span className="text-xs font-bold text-emerald-400">4. Measured Readiness</span>
                <p className="text-[11px] text-slate-300">Student availability rises from 34% ➔ 62% with verified evidence</p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 2: SKILL DEMAND HEATMAP (⭐ SIGNATURE 7) */}
      {activeTab === 'skill-heatmap' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-400" />
                  <h2 className="text-xl font-bold text-white font-display">⭐ Institution Skill Demand Heatmap</h2>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Compares aggregate live industry hiring demand % against student skill availability % to pinpoint institutional training gaps.
                </p>
              </div>

              <button
                onClick={() => setShowProgramModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 hover:scale-105 transition-all shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Trigger Campus Bootcamp from Gap</span>
              </button>
            </div>
          </div>

          {/* Heatmap Table Matrix */}
          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="p-4 font-semibold">Technology Discipline</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold text-center">Industry Demand</th>
                    <th className="p-4 font-semibold text-center">Student Readiness</th>
                    <th className="p-4 font-semibold text-center">Deficit Gap</th>
                    <th className="p-4 font-semibold">Severity Status</th>
                    <th className="p-4 font-semibold text-right">Action Loop</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {institutionData.skillDemandHeatmap.map((row, idx) => {
                    const isHigh = row.gapLevel === 'High Gap';
                    const isMedium = row.gapLevel === 'Medium Gap';
                    return (
                      <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-4 font-bold text-white flex items-center gap-2">
                          <span>{row.skill}</span>
                        </td>
                        <td className="p-4 text-slate-400">{row.category}</td>
                        <td className="p-4 text-center font-extrabold text-cyan-400 font-display text-sm">
                          {row.industryDemand}%
                        </td>
                        <td className="p-4 text-center font-extrabold text-indigo-300 font-display text-sm">
                          {row.studentAvailability}%
                        </td>
                        <td className="p-4 text-center font-extrabold font-display text-sm">
                          <span className={isHigh ? 'text-rose-400' : isMedium ? 'text-amber-400' : 'text-emerald-400'}>
                            {row.gapPercentage}%
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            isHigh ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                            isMedium ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {row.gapLevel}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedGapSkill(row.skill);
                              setShowProgramModal(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-all"
                          >
                            Launch Bootcamp
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal to Create Bootcamp from Gap */}
          {showProgramModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
              <div className="relative w-full max-w-lg glass-dropdown rounded-3xl border border-white/15 p-6 space-y-4">
                <h3 className="font-bold text-base text-white font-display">
                  Launch Closed-Loop Training Program ⭐
                </h3>
                <p className="text-xs text-slate-300">
                  Directly target institutional gaps by partnering with industry experts. Submitting will immediately boost student skill readiness.
                </p>

                <form onSubmit={handleCreateBootcamp} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Target Skill Gap</label>
                    <input
                      type="text"
                      readOnly
                      value={selectedGapSkill}
                      className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white border border-white/10 bg-slate-900 cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Bootcamp Duration</label>
                      <select
                        value={bootcampDuration}
                        onChange={e => setBootcampDuration(e.target.value)}
                        className="w-full glass-dropdown rounded-xl px-3 py-2 text-xs text-white border border-white/10"
                      >
                        <option className="bg-slate-900">4 Weeks (Immersion)</option>
                        <option className="bg-slate-900">2 Weeks (Crash Course)</option>
                        <option className="bg-slate-900">8 Weeks (Full Sabbatical)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Industry Trainer Partner</label>
                      <input
                        type="text"
                        value={trainerPartner}
                        onChange={e => setTrainerPartner(e.target.value)}
                        className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white border border-white/10"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300">
                    ✨ Launching this program enrolls 120 students, notifies faculty, and increases campus readiness score by +28%.
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowProgramModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow"
                    >
                      Deploy Training Program
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: PLACEMENT & INTERNSHIP ANALYTICS */}
      {activeTab === 'placement-analytics' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-white font-display">Placement & Internship Conversion Analytics</h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Departmental placement ratios, average compensation tiers, and internship-to-PPO conversions.
              </p>
            </div>
          </div>

          {/* Department Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {institutionData.departmentPlacements.map((dep, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-xs text-white">{dep.department}</h4>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {dep.percentage}% Placed
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${dep.percentage}%` }} />
                </div>

                <div className="flex justify-between text-xs text-slate-400 pt-1">
                  <span>{dep.placed} / {dep.total} Students</span>
                  <span className="text-cyan-300 font-semibold">Avg: ₹{dep.avgLpa} LPA</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 4: INDUSTRY COLLABORATIONS & MOUS */}
      {activeTab === 'collaborations' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white font-display">Industry Partner MoUs & Strategic Innovation Labs</h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Active corporate partnerships spanning joint innovation labs, faculty sabbaticals, and hiring pipelines.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {institutionData.activeMoUs.map((mou, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-white">{mou.partner}</h3>
                    <p className="text-xs text-indigo-300">{mou.type}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Status: {mou.status} (Valid till {mou.validTill})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5">
                    <span className="text-slate-400">Joint Campus Lab:</span>
                    <p className="font-semibold text-white mt-0.5">{mou.jointLabs}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5">
                    <span className="text-slate-400">Active Campus Interns:</span>
                    <p className="font-semibold text-emerald-400 mt-0.5">{mou.activeInterns} Placed Interns</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 5: ACCREDITATION & NAAC / NIRF REPORTS */}
      {activeTab === 'accreditation' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="glass-panel p-6 rounded-3xl border border-white/10 flex items-center justify-between no-print">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-bold text-white font-display">NAAC & NIRF Accreditation Compliance Summary</h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Automated metric compilation for Criterion 3 (Research, Innovations and Extension) and Criterion 5 (Student Support and Progression).
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Compliance Report</span>
            </button>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 bg-slate-900/90 text-slate-100 shadow-2xl">
            <div className="flex justify-between items-center pb-6 border-b border-white/10">
              <div>
                <h1 className="text-2xl font-extrabold text-white font-display">{institutionData.institutionName}</h1>
                <p className="text-xs text-amber-400 font-semibold">{institutionData.accreditation}</p>
              </div>
              <span className="text-xs font-bold text-slate-400">Academic Year: 2026–2027</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5">
                <span className="text-slate-400">Total Industry Partners:</span>
                <p className="text-lg font-bold text-white mt-0.5">74 Strategic MoUs</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5">
                <span className="text-slate-400">Student Internship Rate:</span>
                <p className="text-lg font-bold text-emerald-400 mt-0.5">84.2% of Enrolled</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5">
                <span className="text-slate-400">Faculty Industry Immersions:</span>
                <p className="text-lg font-bold text-indigo-300 mt-0.5">18 Completed</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5">
                <span className="text-slate-400">Problem Bank Projects:</span>
                <p className="text-lg font-bold text-cyan-400 mt-0.5">48 Live Solutions</p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
