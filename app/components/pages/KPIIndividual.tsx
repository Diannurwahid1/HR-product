import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit,
  Download,
  Save,
  Calendar,
  User,
  Building,
  Target,
  TrendingUp,
  MessageSquare,
  Code,
  Users,
  Bug,
  Clock,
  ExternalLink,
  FileText,
  CheckCircle,
  AlertCircle,
  Printer,
  BarChart3,
  Activity,
  Award,
  Star,
  ChevronRight,
  Eye,
  Settings,
  Share2,
  Filter,
  RefreshCw,
} from "lucide-react";
import { showSuccess, showInfo, showConfirm } from "../../utils/alerts";

interface KPIMetric {
  id: string;
  category: string;
  title: string;
  description: string;
  weight: number;
  target: number;
  achievement: number;
  score: number;
  maxScore: number;
  icon: React.ComponentType<any>;
  color: string;
  status: "Excellent" | "Good" | "Fair" | "Poor";
  trend: "up" | "down" | "stable";
  previousScore?: number;
}

interface EmployeeKPI {
  id: string;
  name: string;
  position: string;
  department: string;
  employeeId: string;
  avatar: string;
  joinDate: string;
  manager: string;
  evaluator: string;
  overallScore: number;
  maxScore: number;
  percentage: number;
  grade: string;
  status: "Menunggu Persetujuan" | "Disetujui" | "Perlu Review";
  period: {
    start: string;
    end: string;
    quarter: string;
    year: string;
  };
  evaluationDate: string;
  lastUpdate: string;
  metrics: KPIMetric[];
  notes: string;
  recommendations: string[];
  actionPlan: string;
  nextReviewDate: string;
  competencyVisualization: {
    leadership: number;
    communication: number;
    technical: number;
    creativity: number;
    teamwork: number;
    results: number;
  };
  performanceTrend: Array<{
    month: string;
    score: number;
  }>;
}

const KPIIndividual: React.FC = () => {
  const [activeTab, setActiveTab] = useState("detail");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Enhanced KPI data
  const employeeKPI: EmployeeKPI = {
    id: "KPI-2024-001",
    name: "Budi Santoso",
    position: "UI/UX Designer",
    department: "Design",
    employeeId: "EMP-2022-001",
    avatar:
      "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    joinDate: "15 Jan 2022",
    manager: "Rina Wijaya",
    evaluator: "Ahmad Fauzi",
    overallScore: 4.0,
    maxScore: 5.0,
    percentage: 80,
    grade: "B+",
    status: "Menunggu Persetujuan",
    period: {
      start: "01 Januari 2024",
      end: "31 Maret 2024",
      quarter: "Kuartal 1",
      year: "2024",
    },
    evaluationDate: "15 April 2024",
    lastUpdate: "15 Apr 2024",
    nextReviewDate: "15 Juli 2024",
    metrics: [
      {
        id: "task_completion",
        category: "Produktivitas",
        title: "Penyelesaian Task",
        description: "Ketepatan waktu terhadap dan penyelesaian tugas",
        weight: 20,
        target: 95,
        achievement: 90,
        score: 4.5,
        maxScore: 5.0,
        icon: Target,
        color: "bg-blue-500 dark:bg-blue-600",
        status: "Excellent",
        trend: "up",
        previousScore: 4.2,
      },
      {
        id: "code_quality",
        category: "Kualitas Kerja",
        title: "Kualitas Kode",
        description: "Efisiensi dalam menyelesaikan pekerjaan",
        weight: 25,
        target: 90,
        achievement: 85,
        score: 3.8,
        maxScore: 5.0,
        icon: Code,
        color: "bg-green-500 dark:bg-green-600",
        status: "Good",
        trend: "stable",
        previousScore: 3.8,
      },
      {
        id: "standard_compliance",
        category: "Standar",
        title: "Kepatuhan Standar",
        description: "Aturan dan kualitas output pekerjaan",
        weight: 25,
        target: 85,
        achievement: 88,
        score: 4.2,
        maxScore: 5.0,
        icon: CheckCircle,
        color: "bg-purple-500 dark:bg-purple-600",
        status: "Excellent",
        trend: "up",
        previousScore: 3.9,
      },
      {
        id: "bug_handling",
        category: "Problem Solving",
        title: "Penanganan Bug",
        description: "Kemampuan menangani inisiatif dan inovasi",
        weight: 15,
        target: 80,
        achievement: 75,
        score: 3.5,
        maxScore: 5.0,
        icon: Bug,
        color: "bg-red-500 dark:bg-red-600",
        status: "Fair",
        trend: "down",
        previousScore: 3.8,
      },
      {
        id: "teamwork",
        category: "Kolaborasi",
        title: "Kerja Tim",
        description: "Kolaborasi dan kontribusi dalam tim",
        weight: 10,
        target: 85,
        achievement: 80,
        score: 4.0,
        maxScore: 5.0,
        icon: Users,
        color: "bg-indigo-500 dark:bg-indigo-600",
        status: "Good",
        trend: "stable",
        previousScore: 4.0,
      },
      {
        id: "communication",
        category: "Komunikasi",
        title: "Komunikasi",
        description: "Kemampuan berkomunikasi secara efektif",
        weight: 10,
        target: 85,
        achievement: 74,
        score: 3.7,
        maxScore: 5.0,
        icon: MessageSquare,
        color: "bg-pink-500 dark:bg-pink-600",
        status: "Fair",
        trend: "up",
        previousScore: 3.5,
      },
    ],
    notes:
      "Budi menunjukkan performa yang baik dalam hal kedisiplinan dan kualitas hasil kerja. Perlu peningkatan dalam hal inisiatif dan kecepatan kerja untuk mencapai target yang lebih tinggi di kuartal berikutnya.",
    recommendations: [
      "Mengikuti pelatihan komunikasi dan presentasi",
      "Lebih aktif dalam meeting tim dan diskusi proyek",
      "Mengembangkan kemampuan leadership dalam proyek kecil",
      "Meningkatkan dokumentasi proses desain",
    ],
    actionPlan:
      "Akan mengikuti workshop komunikasi efektif pada bulan Mei 2024 dan mulai memimpin satu proyek desain kecil sebagai practice leadership.",
    nextReviewDate: "15 Juli 2024",
    competencyVisualization: {
      leadership: 75,
      communication: 65,
      technical: 85,
      creativity: 90,
      teamwork: 80,
      results: 75,
    },
    performanceTrend: [
      { month: "Jan", score: 3.8 },
      { month: "Feb", score: 3.9 },
      { month: "Mar", score: 4.1 },
      { month: "Apr", score: 4.0 },
      { month: "Mei", score: 4.2 },
      { month: "Jun", score: 4.0 },
    ],
  };

  // Enhanced utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disetujui":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800";
      case "Menunggu Persetujuan":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      case "Perlu Review":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600";
    }
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-blue-600 dark:text-blue-400";
    if (percentage >= 70) return "text-green-600 dark:text-green-400";
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getProgressColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "bg-blue-500 dark:bg-blue-400";
    if (percentage >= 70) return "bg-green-500 dark:bg-green-400";
    if (percentage >= 60) return "bg-yellow-500 dark:bg-yellow-400";
    return "bg-red-500 dark:bg-red-400";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return (
          <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400" />
        );
      case "down":
        return (
          <TrendingUp className="w-4 h-4 text-red-500 dark:text-red-400 rotate-180" />
        );
      default:
        return (
          <Activity className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        );
    }
  };

  // Enhanced event handlers with loading states
  const handleBack = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate navigation delay
    window.history.back();
    setIsLoading(false);
  };

  const handleEdit = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsEditing(true);
    setIsLoading(false);
    showSuccess("Mode edit diaktifkan");
  };

  const handleDownload = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    showSuccess("Laporan KPI berhasil diunduh dalam format PDF");
  };

  const handlePrint = () => {
    window.print();
    showSuccess("Mencetak dokumen KPI...");
  };

  const handleSaveAssessment = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsEditing(false);
    setIsLoading(false);
    showSuccess("Penilaian KPI berhasil disimpan");
  };

  const handleApprove = async () => {
    const confirmed = await showConfirm(
      "Apakah Anda yakin ingin menyetujui penilaian KPI ini?"
    );
    if (confirmed) {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      showSuccess("Penilaian KPI telah disetujui");
    }
  };

  const handleTabChange = (tabId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setIsLoading(false);
    }, 200);
  };

  // Enhanced competency radar chart
  const renderCompetencyRadar = () => {
    const competencies = [
      {
        label: "Kepemimpinan",
        value: employeeKPI.competencyVisualization.leadership,
        angle: 0,
      },
      {
        label: "Komunikasi",
        value: employeeKPI.competencyVisualization.communication,
        angle: 60,
      },
      {
        label: "Teknis",
        value: employeeKPI.competencyVisualization.technical,
        angle: 120,
      },
      {
        label: "Kreativitas",
        value: employeeKPI.competencyVisualization.creativity,
        angle: 180,
      },
      {
        label: "Kerja Tim",
        value: employeeKPI.competencyVisualization.teamwork,
        angle: 240,
      },
      {
        label: "Hasil",
        value: employeeKPI.competencyVisualization.results,
        angle: 300,
      },
    ];

    return (
      <div className="relative w-64 h-64 mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Grid circles */}
          {[20, 40, 60, 80, 100].map((radius, index) => (
            <circle
              key={index}
              cx="100"
              cy="100"
              r={radius * 0.8}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-gray-200 dark:text-dark-600"
              opacity="0.3"
            />
          ))}

          {/* Grid lines */}
          {competencies.map((comp, index) => {
            const angle = (comp.angle * Math.PI) / 180;
            const x2 = 100 + Math.cos(angle) * 80;
            const y2 = 100 + Math.sin(angle) * 80;
            return (
              <line
                key={index}
                x1="100"
                y1="100"
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="1"
                className="text-gray-200 dark:text-dark-600"
                opacity="0.3"
              />
            );
          })}

          {/* Data polygon */}
          <polygon
            points={competencies
              .map((comp) => {
                const angle = (comp.angle * Math.PI) / 180;
                const radius = (comp.value / 100) * 80;
                const x = 100 + Math.cos(angle) * radius;
                const y = 100 + Math.sin(angle) * radius;
                return `${x},${y}`;
              })
              .join(" ")}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#3b82f6"
            strokeWidth="2"
            className="transition-all duration-300"
          />

          {/* Data points */}
          {competencies.map((comp, index) => {
            const angle = (comp.angle * Math.PI) / 180;
            const radius = (comp.value / 100) * 80;
            const x = 100 + Math.cos(angle) * radius;
            const y = 100 + Math.sin(angle) * radius;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#3b82f6"
                className="transition-all duration-300 hover:r-6"
              />
            );
          })}
        </svg>

        {/* Labels */}
        {competencies.map((comp, index) => {
          const angle = (comp.angle * Math.PI) / 180;
          const labelRadius = 95;
          const x = 100 + Math.cos(angle) * labelRadius;
          const y = 100 + Math.sin(angle) * labelRadius;

          return (
            <div
              key={index}
              className="absolute text-xs font-medium text-gray-600 dark:text-dark-300 transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-300"
              style={{
                left: `${(x / 200) * 100}%`,
                top: `${(y / 200) * 100}%`,
              }}
            >
              {comp.label}
            </div>
          );
        })}
      </div>
    );
  };

  // Enhanced performance trend chart
  const renderPerformanceTrend = () => {
    const maxScore = Math.max(
      ...employeeKPI.performanceTrend.map((p) => p.score)
    );
    const minScore = Math.min(
      ...employeeKPI.performanceTrend.map((p) => p.score)
    );
    const range = maxScore - minScore || 1;

    return (
      <div className="h-32 flex items-end justify-between space-x-2">
        {employeeKPI.performanceTrend.map((point, index) => {
          const height = ((point.score - minScore) / range) * 80 + 20;
          const isLast = index === employeeKPI.performanceTrend.length - 1;

          return (
            <div
              key={index}
              className="flex flex-col items-center flex-1 group"
            >
              <div className="relative flex-1 flex items-end">
                <div className="w-full flex items-end justify-center">
                  <div
                    className={`w-8 rounded-t transition-all duration-300 hover:scale-110 ${
                      isLast
                        ? "bg-blue-500 dark:bg-blue-400"
                        : "bg-gray-300 dark:bg-dark-600"
                    }`}
                    style={{ height: `${height}px` }}
                  />
                </div>
                {index < employeeKPI.performanceTrend.length - 1 && (
                  <svg
                    className="absolute top-0 left-full w-full h-full"
                    style={{ transform: "translateX(-50%)" }}
                  >
                    <line
                      x1="0"
                      y1={`${100 - height}%`}
                      x2="100%"
                      y2={`${
                        100 -
                        ((employeeKPI.performanceTrend[index + 1].score -
                          minScore) /
                          range) *
                          80 -
                        20
                      }%`}
                      stroke="#3b82f6"
                      strokeWidth="2"
                      className="opacity-60 dark:opacity-80"
                    />
                  </svg>
                )}
              </div>
              <span className="text-xs text-gray-500 dark:text-dark-400 mt-2 transition-colors duration-300">
                {point.month}
              </span>
              {/* Tooltip on hover */}
              <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 dark:bg-dark-700 text-white text-xs px-2 py-1 rounded pointer-events-none">
                {point.score}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <RefreshCw className="w-4 h-4 animate-spin" />
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
      {/* Enhanced Header */}
      <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4 transition-colors duration-300 print:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              disabled={isLoading}
              className="p-2 text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <ArrowLeft className="w-5 h-5" />
              )}
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-100">
                KPI Individu
              </h1>
              <p className="text-gray-600 dark:text-dark-400">
                Penilaian kinerja karyawan berdasarkan indikator personal
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-dark-700 rounded-lg px-4 py-2 transition-colors duration-300">
              <Calendar className="w-4 h-4 text-gray-500 dark:text-dark-400" />
              <span className="text-sm text-gray-900 dark:text-dark-200">
                {employeeKPI.period.quarter} - {employeeKPI.period.year}
              </span>
            </div>
            <button
              onClick={() => showInfo("Membuka filter penilaian")}
              className="p-2 text-gray-500 dark:text-dark-400 hover:text-gray-700 dark:hover:text-dark-200 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-all duration-200"
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              onClick={() => showInfo("Membuka penilaian baru")}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <LoadingSpinner /> : <span>Penilaian Baru</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-600 p-6 animate-pulse">
                  <div className="flex items-start space-x-6">
                    <div className="w-20 h-20 bg-gray-200 dark:bg-dark-700 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-6 bg-gray-200 dark:bg-dark-700 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/3" />
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/4" />
                    </div>
                  </div>
                </div>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-600 p-6 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-1/3 mb-2" />
                    <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded w-full mb-4" />
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-600 p-6 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-1/3 mb-2" />
                    <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded w-full mb-4" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Employee Info & KPI Summary */}
              <div className="lg:col-span-2 space-y-6">
                {/* Enhanced Employee Profile Card */}
                <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-600 p-6 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img
                          src={employeeKPI.avatar}
                          alt={employeeKPI.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 dark:border-dark-600 transition-all duration-300"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-dark-800 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="mt-3 text-center">
                        <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800 transition-colors duration-300">
                          {employeeKPI.department}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-dark-100 mb-1">
                            {employeeKPI.name}
                          </h2>
                          <p className="text-gray-600 dark:text-dark-400 mb-3">
                            {employeeKPI.position}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500 dark:text-dark-400">
                                ID Karyawan:
                              </span>
                              <p className="font-medium text-gray-900 dark:text-dark-100">
                                {employeeKPI.employeeId}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-dark-400">
                                Bergabung:
                              </span>
                              <p className="font-medium text-gray-900 dark:text-dark-100">
                                {employeeKPI.joinDate}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-dark-400">
                                Manager:
                              </span>
                              <p className="font-medium text-gray-900 dark:text-dark-100">
                                {employeeKPI.manager}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-dark-400">
                                Evaluator:
                              </span>
                              <p className="font-medium text-gray-900 dark:text-dark-100">
                                {employeeKPI.evaluator}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-300 ${getStatusColor(
                              employeeKPI.status
                            )}`}
                          >
                            {employeeKPI.status}
                          </span>
                          <p className="text-sm text-gray-500 dark:text-dark-400 mt-2">
                            Update: {employeeKPI.lastUpdate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced KPI Summary Card */}
                <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-600 p-6 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                      Ringkasan KPI
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-3xl font-bold transition-colors duration-300 ${getScoreColor(
                          employeeKPI.overallScore,
                          employeeKPI.maxScore
                        )}`}
                      >
                        {employeeKPI.overallScore}
                      </span>
                      <span className="text-gray-500 dark:text-dark-400">
                        dari {employeeKPI.maxScore}
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Circular Progress */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-32 h-32">
                      <svg
                        className="w-32 h-32 transform -rotate-90"
                        viewBox="0 0 120 120"
                      >
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200 dark:text-dark-600 transition-colors duration-300"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${
                            (employeeKPI.percentage / 100) * 314
                          } 314`}
                          className="text-blue-500 dark:text-blue-400 transition-all duration-500"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-dark-100 transition-colors duration-300">
                            {employeeKPI.percentage}%
                          </div>
                          <div className="text-sm text-gray-500 dark:text-dark-400 transition-colors duration-300">
                            Grade: {employeeKPI.grade}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg transition-colors duration-300">
                      <p className="text-sm text-gray-500 dark:text-dark-400">
                        Status:
                      </p>
                      <p className="font-medium text-yellow-600 dark:text-yellow-400">
                        Menunggu
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg transition-colors duration-300">
                      <p className="text-sm text-gray-500 dark:text-dark-400">
                        Periode:
                      </p>
                      <p className="font-medium text-gray-900 dark:text-dark-100">
                        Q1 2024
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg transition-colors duration-300">
                      <p className="text-sm text-gray-500 dark:text-dark-400">
                        Review:
                      </p>
                      <p className="font-medium text-gray-900 dark:text-dark-100">
                        15 Jul
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Tab Navigation */}
                <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-600 transition-all duration-300 hover:shadow-xl">
                  <div className="border-b border-gray-200 dark:border-dark-600">
                    <nav className="flex space-x-8 px-6">
                      {[
                        {
                          id: "detail",
                          label: "Detail Penilaian",
                          icon: FileText,
                        },
                        { id: "history", label: "Riwayat KPI", icon: Clock },
                        {
                          id: "integration",
                          label: "Integrasi Logbook",
                          icon: ExternalLink,
                        },
                      ].map((tab) => {
                        const IconComponent = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            disabled={isLoading}
                            className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                              activeTab === tab.id
                                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                : "border-transparent text-gray-500 dark:text-dark-400 hover:text-gray-700 dark:hover:text-dark-200 hover:border-gray-300 dark:hover:border-dark-500"
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                            <span>{tab.label}</span>
                            {isLoading && activeTab === tab.id && (
                              <LoadingSpinner />
                            )}
                          </button>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Enhanced Tab Content */}
                  <div className="p-6">
                    {activeTab === "detail" && (
                      <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                            Penilaian Indikator KPI
                          </h4>
                          <div className="flex items-center space-x-2">
                            {isEditing && (
                              <button
                                onClick={handleSaveAssessment}
                                disabled={isLoading}
                                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                              >
                                {isLoading ? (
                                  <LoadingSpinner />
                                ) : (
                                  <Save className="w-4 h-4" />
                                )}
                                <span>Simpan</span>
                              </button>
                            )}
                            <button
                              onClick={handleEdit}
                              disabled={isLoading}
                              className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200 disabled:opacity-50"
                            >
                              {isLoading ? (
                                <LoadingSpinner />
                              ) : (
                                <Edit className="w-4 h-4" />
                              )}
                              <span>{isEditing ? "Mode Edit" : "Edit"}</span>
                            </button>
                          </div>
                        </div>

                        {/* Enhanced KPI Metrics */}
                        <div className="space-y-4">
                          {employeeKPI.metrics.map((metric, index) => {
                            const IconComponent = metric.icon;
                            const percentage =
                              (metric.score / metric.maxScore) * 100;

                            return (
                              <div
                                key={metric.id}
                                className="border border-gray-200 dark:border-dark-600 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600 animate-in slide-in-from-left duration-300"
                                style={{ animationDelay: `${index * 100}ms` }}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-start space-x-3">
                                    <div
                                      className={`w-10 h-10 rounded-lg ${metric.color} flex items-center justify-center text-white transition-transform duration-200 hover:scale-110`}
                                    >
                                      <IconComponent className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-medium text-gray-900 dark:text-dark-100 transition-colors duration-300">
                                        {metric.title}
                                      </h5>
                                      <p className="text-sm text-gray-500 dark:text-dark-400 transition-colors duration-300">
                                        {metric.description}
                                      </p>
                                      <span className="inline-flex px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-dark-300 text-xs rounded-full mt-1 transition-colors duration-300">
                                        {metric.category}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="text-sm text-gray-500 dark:text-dark-400">
                                        Bobot: {metric.weight}%
                                      </span>
                                      {getTrendIcon(metric.trend)}
                                    </div>
                                    <div
                                      className={`text-lg font-bold transition-colors duration-300 ${getScoreColor(
                                        metric.score,
                                        metric.maxScore
                                      )}`}
                                    >
                                      {metric.score}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-dark-400">
                                      dari {metric.maxScore}
                                    </div>
                                  </div>
                                </div>

                                {/* Enhanced Progress Bar */}
                                <div className="mb-2">
                                  <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2 transition-colors duration-300">
                                    <div
                                      className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(
                                        metric.score,
                                        metric.maxScore
                                      )}`}
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-dark-400 transition-colors duration-300">
                                  <span>Target: {metric.target}%</span>
                                  <span>Pencapaian: {metric.achievement}%</span>
                                  <span
                                    className={`font-medium ${
                                      metric.status === "Excellent"
                                        ? "text-blue-600 dark:text-blue-400"
                                        : metric.status === "Good"
                                        ? "text-green-600 dark:text-green-400"
                                        : metric.status === "Fair"
                                        ? "text-yellow-600 dark:text-yellow-400"
                                        : "text-red-600 dark:text-red-400"
                                    }`}
                                  >
                                    {metric.status}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Enhanced Notes Section */}
                        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 transition-colors duration-300">
                          <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-2 flex items-center space-x-2">
                            <MessageSquare className="w-4 h-4" />
                            <span>Catatan & Rekomendasi</span>
                          </h5>
                          <p className="text-gray-700 dark:text-dark-300 text-sm leading-relaxed mb-4 transition-colors duration-300">
                            {employeeKPI.notes}
                          </p>

                          <div className="space-y-2">
                            <h6 className="font-medium text-gray-900 dark:text-dark-100 text-sm">
                              Rekomendasi:
                            </h6>
                            <ul className="space-y-1">
                              {employeeKPI.recommendations.map((rec, index) => (
                                <li
                                  key={index}
                                  className="flex items-start space-x-2 text-sm text-gray-600 dark:text-dark-400"
                                >
                                  <ChevronRight className="w-3 h-3 mt-0.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "history" && (
                      <div className="text-center py-8 animate-in fade-in duration-300">
                        <Clock className="w-12 h-12 text-gray-300 dark:text-dark-500 mx-auto mb-4 transition-colors duration-300" />
                        <h4 className="text-lg font-medium text-gray-900 dark:text-dark-100 mb-2">
                          Riwayat KPI
                        </h4>
                        <p className="text-gray-500 dark:text-dark-400 mb-4">
                          Fitur riwayat KPI akan segera tersedia
                        </p>
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200">
                          Lihat Riwayat Lengkap
                        </button>
                      </div>
                    )}

                    {activeTab === "integration" && (
                      <div className="text-center py-8 animate-in fade-in duration-300">
                        <ExternalLink className="w-12 h-12 text-gray-300 dark:text-dark-500 mx-auto mb-4 transition-colors duration-300" />
                        <h4 className="text-lg font-medium text-gray-900 dark:text-dark-100 mb-2">
                          Integrasi Richzspot
                        </h4>
                        <p className="text-gray-500 dark:text-dark-400 mb-4">
                          Hubungkan dengan Richzspot untuk melihat assignment
                          dan logbook karyawan
                        </p>
                        <div className="flex items-center justify-center space-x-3">
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200">
                            Lihat Assignment
                          </button>
                          <span className="text-gray-300 dark:text-dark-600">
                            •
                          </span>
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200">
                            Sync Data
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Enhanced Visualizations */}
              <div className="space-y-6">
                {/* Enhanced Competency Visualization */}
                <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-600 p-6 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                      Visualisasi Kompetensi
                    </h4>
                    <button className="text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-300 transition-colors duration-200">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                  {renderCompetencyRadar()}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(employeeKPI.competencyVisualization).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-dark-700 rounded transition-colors duration-300"
                        >
                          <span className="text-gray-600 dark:text-dark-400 capitalize">
                            {key}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-dark-100">
                            {value}%
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Enhanced Performance Trend */}
                <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-600 p-6 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                      Tren Performa
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-dark-400">
                        6 bulan terakhir
                      </span>
                      <button className="text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-300 transition-colors duration-200">
                        <BarChart3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {renderPerformanceTrend()}
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                      <span className="text-gray-600 dark:text-dark-400">
                        Skor KPI
                      </span>
                    </div>
                    <div className="text-gray-500 dark:text-dark-400">
                      Rata-rata:{" "}
                      {(
                        employeeKPI.performanceTrend.reduce(
                          (sum, p) => sum + p.score,
                          0
                        ) / employeeKPI.performanceTrend.length
                      ).toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* Enhanced Integration Card */}
                <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-600 p-6 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                      Integrasi Richzspot
                    </h4>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 dark:text-green-400">
                        Terhubung
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-dark-400 text-sm mb-4 transition-colors duration-300">
                    Hubungkan dengan Richzspot untuk melihat assignment dan
                    logbook karyawan
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => showInfo("Membuka integrasi Richzspot")}
                      className="w-full bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-dark-200 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-dark-600 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Lihat Assignment</span>
                    </button>
                    <button
                      onClick={() => showInfo("Sinkronisasi data")}
                      className="w-full border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Sync Data</span>
                    </button>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-600 p-6 transition-all duration-300 hover:shadow-xl print:hidden">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
                    Aksi Cepat
                  </h4>
                  <div className="space-y-3">
                    <button
                      onClick={handleDownload}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center space-x-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-dark-200 py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-dark-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <LoadingSpinner />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      <span>Unduh Laporan</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="w-full flex items-center justify-center space-x-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-200"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Cetak</span>
                    </button>
                    <button
                      onClick={() => showInfo("Membagikan laporan")}
                      className="w-full flex items-center justify-center space-x-2 border border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 py-3 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Bagikan</span>
                    </button>
                    <button
                      onClick={handleApprove}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <LoadingSpinner />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span>Setujui Penilaian</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default KPIIndividual;
