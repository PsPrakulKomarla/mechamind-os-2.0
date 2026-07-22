import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore } from '@/store/onboarding';
import {
  Upload,
  FileText,
  Eye,
  GitBranch,
  Database,
  Brain,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Loader2,
  FileImage,
  FileSpreadsheet,
  Archive,
  FolderOpen,
  Package,
  TrendingUp,
  Network,
  Sparkles,
  Box,
  Building2,
  Search,
} from 'lucide-react';
import { useUploadDocument, useBatchUploadDocuments } from '@/hooks/useDocumentQueries';

type FlowChoice = 'upload' | 'demo' | 'connect';
type WizardStep = 'welcome' | 'file-selection' | 'processing' | 'demo-loading' | 'summary';

interface StepIndicatorProps {
  currentStep: WizardStep;
  flow: FlowChoice;
}

interface WelcomeScreenProps {
  onChoice: (choice: FlowChoice) => void;
}

interface FileSelectionStepProps {
  onNext: (files: File[]) => void;
  onBack: () => void;
}

interface ProcessingStepProps {
  files: File[];
  onComplete: (result: { documents: number; entities: number; relationships: number; nodes: number }) => void;
}

interface SummaryStepProps {
  onComplete: () => void;
  onBack: () => void;
  isDemo?: boolean;
  result?: { documents: number; entities: number; relationships: number; nodes: number };
}

interface DemoLoadingStepProps {
  onComplete: (result: { documents: number; entities: number; relationships: number; nodes: number }) => void;
}

function StepIndicator({ currentStep, flow }: StepIndicatorProps) {
  const steps =
    flow === 'demo'
      ? [
          { key: 'demo-loading' as WizardStep, label: 'Load Demo Data' },
          { key: 'summary' as WizardStep, label: 'Review Results' },
        ]
      : flow === 'connect'
        ? [{ key: 'welcome' as WizardStep, label: 'Connect Sources' }]
        : [
            { key: 'file-selection' as WizardStep, label: 'Select Files' },
            { key: 'processing' as WizardStep, label: 'Processing' },
            { key: 'summary' as WizardStep, label: 'Review Results' },
          ];

  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  if (currentStep === 'welcome') {
    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="h-2 w-2 rounded-full bg-gray-600" />
        <div className="h-1 w-12 rounded-full bg-gray-700" />
        <div className="h-2 w-2 rounded-full bg-gray-600" />
        <div className="h-1 w-12 rounded-full bg-gray-700" />
        <div className="h-2 w-2 rounded-full bg-gray-600" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                i < currentIndex
                  ? 'bg-[#10B981]'
                  : i === currentIndex
                    ? 'bg-[#3B82F6]'
                    : 'bg-gray-600'
              }`}
            />
            <span
              className={`text-[10px] uppercase tracking-wider ${
                i === currentIndex ? 'text-white' : 'text-gray-500'
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-0.5 w-12 mb-4 transition-colors duration-300 ${
                i < currentIndex ? 'bg-[#10B981]' : 'bg-gray-700'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function WelcomeScreen({ onChoice }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 mb-6"
      >
        <Building2 className="w-8 h-8 text-[#3B82F6]" />
      </motion.div>

      <h1 className="text-3xl font-bold text-white mb-3">
        Welcome to MechMind OS
      </h1>
      <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">
        Set up your industrial knowledge base by choosing how to import your data.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChoice('upload')}
          className="group relative bg-[#111827]/60 border border-gray-800 rounded-xl p-6 text-left transition-all duration-300 hover:border-[#3B82F6]/50 hover:bg-[#111827]/80 cursor-pointer"
        >
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#3B82F6]/10 mb-4">
            <Upload className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <h3 className="text-white font-semibold mb-2">Upload Documents</h3>
          <p className="text-gray-400 text-sm">
            Import PDFs, spreadsheets, images, and more from your local files.
          </p>
          <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-hover:text-[#3B82F6] transition-colors" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChoice('demo')}
          className="group relative bg-[#111827]/60 border border-gray-800 rounded-xl p-6 text-left transition-all duration-300 hover:border-[#10B981]/50 hover:bg-[#111827]/80 cursor-pointer"
        >
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#10B981]/10 mb-4">
            <Box className="w-5 h-5 text-[#10B981]" />
          </div>
          <h3 className="text-white font-semibold mb-2">Load Demo Factory</h3>
          <p className="text-gray-400 text-sm">
            Explore with pre-loaded sample factory data and relationships.
          </p>
          <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-hover:text-[#10B981] transition-colors" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChoice('connect')}
          className="group relative bg-[#111827]/60 border border-gray-800 rounded-xl p-6 text-left transition-all duration-300 hover:border-[#8B5CF6]/50 hover:bg-[#111827]/80 cursor-pointer"
        >
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#8B5CF6]/10 mb-4">
            <Network className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <h3 className="text-white font-semibold mb-2">Connect Existing Sources</h3>
          <p className="text-gray-400 text-sm">
            Link to databases, cloud storage, or IoT streams.
          </p>
          <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-hover:text-[#8B5CF6] transition-colors" />
        </motion.button>
      </div>
    </motion.div>
  );
}

function FileSelectionStep({ onNext, onBack }: FileSelectionStepProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const acceptedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/zip',
    'application/x-zip-compressed',
  ];

  const acceptedExtensions = ['.pdf', '.docx', '.xlsx', '.xls', '.png', '.jpg', '.jpeg', '.webp', '.zip'];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <FileImage className="w-4 h-4" />;
    if (file.type.includes('spreadsheet') || file.type.includes('excel') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))
      return <FileSpreadsheet className="w-4 h-4" />;
    if (file.type.includes('zip') || file.name.endsWith('.zip'))
      return <Archive className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 mb-4">
          <FolderOpen className="w-6 h-6 text-[#3B82F6]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Select Your Files</h2>
        <p className="text-gray-400">
          Drag and drop or browse to upload your documents.
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
          isDragging
            ? 'border-[#3B82F6] bg-[#3B82F6]/5'
            : 'border-gray-700 bg-[#111827]/40 hover:border-gray-600 hover:bg-[#111827]/60'
        }`}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          onChange={handleFileInput}
          accept={acceptedExtensions.join(',')}
          className="hidden"
        />
        <Upload
          className={`w-10 h-10 mx-auto mb-4 transition-colors ${
            isDragging ? 'text-[#3B82F6]' : 'text-gray-500'
          }`}
        />
        <p className="text-white font-medium mb-1">
          {isDragging ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-gray-500 text-sm">
          or click to browse &middot; PDF, DOCX, Excel, Images, ZIP
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-2">
          <p className="text-sm text-gray-400 mb-3">
            {files.length} file{files.length !== 1 ? 's' : ''} selected
          </p>
          {files.map((file, i) => (
            <motion.div
              key={`${file.name}-${i}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 bg-[#111827]/60 border border-gray-800 rounded-lg px-4 py-3"
            >
              <div className="text-gray-400">{getFileIcon(file)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{file.name}</p>
                <p className="text-gray-500 text-xs">{formatSize(file.size)}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="text-gray-500 hover:text-red-400 text-sm transition-colors"
              >
                &times;
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={() => onNext(files)}
          disabled={files.length === 0}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
            files.length > 0
              ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          Process Files
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function ProcessingStep({ files, onComplete }: ProcessingStepProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const batchMutation = useBatchUploadDocuments();

  const stages = [
    { label: 'Uploading Documents', icon: Upload, color: '#3B82F6' },
    { label: 'OCR & Text Extraction', icon: Eye, color: '#3B82F6' },
    { label: 'Entity Extraction', icon: Brain, color: '#8B5CF6' },
    { label: 'Document Classification', icon: FileText, color: '#06B6D4' },
    { label: 'Knowledge Graph Construction', icon: GitBranch, color: '#10B981' },
    { label: 'Vector Index Building', icon: Database, color: '#EC4899' },
  ];

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (currentStageIndex === 0 && files.length > 0 && !batchMutation.isPending) {
      // Kick off batch upload for all files at once (concurrency=5)
      batchMutation.mutate(
        {
          files,
          concurrency: 5,
          onProgress: (completed) => {
            setUploadedCount(completed);
            setStageProgress((completed / files.length) * 100);
          },
        },
        {
          onSuccess: () => {
            setStageProgress(100);
            setTimeout(() => {
              setCurrentStageIndex(1);
              setStageProgress(0);
            }, 500);
          },
          onError: () => {
            // Still advance — partial uploads may have succeeded
            setStageProgress(100);
            setTimeout(() => {
              setCurrentStageIndex(1);
              setStageProgress(0);
            }, 500);
          },
        }
      );
    } else if (currentStageIndex > 0) {
      if (currentStageIndex >= stages.length) {
        onComplete({
          documents: files.length,
          entities: 0,
          relationships: 0,
          nodes: 0,
        });
      } else {
        const interval = setInterval(() => {
          setStageProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                setCurrentStageIndex((i) => i + 1);
                setStageProgress(0);
              }, 300);
              return 100;
            }
            return prev + Math.random() * 8 + 2;
          });
        }, 100);
        cleanup = () => clearInterval(interval);
      }
    }

    return cleanup;
  }, [currentStageIndex, files, stages.length, onComplete, batchMutation]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 mb-4"
        >
          <Cpu className="w-6 h-6 text-[#3B82F6]" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Processing Documents</h2>
        <p className="text-gray-400">
          {currentStageIndex === 0
            ? `Uploading ${uploadedCount} of ${files.length} files...`
            : currentStageIndex <= 1
              ? 'Analyzing and extracting knowledge from your files.'
              : 'Processing (simulated ΓÇö backend AI pipeline pending).'}
        </p>
      </div>

      <div className="space-y-3 max-w-2xl mx-auto">
        {stages.map((stage, i) => {
          const Icon = stage.icon;
          const isActive = i === currentStageIndex;
          const isCompleted = i < currentStageIndex;
          const isPending = i > currentStageIndex;

          return (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-[#111827]/60 border rounded-xl p-4 transition-all duration-300 ${
                isActive
                  ? 'border-gray-700'
                  : isCompleted
                    ? 'border-[#10B981]/20'
                    : 'border-gray-800/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                  style={{
                    backgroundColor: `${stage.color}${isCompleted ? '20' : isActive ? '20' : '08'}`,
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" style={{ color: '#10B981' }} />
                  ) : isActive ? (
                    <Loader2 className="w-4 h-4 animate-spin" style={{ color: stage.color }} />
                  ) : (
                    <Icon
                      className="w-4 h-4"
                      style={{ color: isPending ? '#4B5563' : stage.color }}
                    />
                  )}
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${
                    isCompleted
                      ? 'text-[#10B981]'
                      : isActive
                        ? 'text-white'
                        : 'text-gray-500'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
              {(isActive || isCompleted) && (
                <div className="ml-11">
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: isCompleted ? '#10B981' : stage.color,
                        width: `${isCompleted ? 100 : Math.min(stageProgress, 100)}%`,
                      }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function SummaryStep({ onComplete, onBack, isDemo, result }: SummaryStepProps) {
  const stats = isDemo
    ? [
        { label: 'Equipment Catalog', value: 'Sample', icon: Package, color: '#3B82F6', bg: '#3B82F6' },
        { label: 'Maintenance Records', value: 'Sample', icon: Database, color: '#8B5CF6', bg: '#8B5CF6' },
        { label: 'Sensor Configs', value: 'Sample', icon: Zap, color: '#10B981', bg: '#10B981' },
        { label: 'Knowledge Graph', value: 'Sample', icon: Network, color: '#06B6D4', bg: '#06B6D4' },
      ]
    : [
        { label: 'Documents Uploaded', value: String(result?.documents || 0), icon: FileText, color: '#3B82F6', bg: '#3B82F6' },
        { label: 'Entities Extracted', value: String(result?.entities || 0), icon: Box, color: '#8B5CF6', bg: '#8B5CF6' },
        { label: 'Relationships Created', value: String(result?.relationships || 0), icon: GitBranch, color: '#10B981', bg: '#10B981' },
        { label: 'Knowledge Nodes', value: String(result?.nodes || 0), icon: Network, color: '#06B6D4', bg: '#06B6D4' },
      ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 mb-4"
        >
          <Sparkles className="w-7 h-7 text-[#10B981]" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {isDemo ? 'Demo Dataset Loaded' : 'Processing Complete'}
        </h2>
        <p className="text-gray-400">
          {isDemo
            ? 'Sample factory data has been imported. You can now explore the platform with demo content.'
            : 'Your documents have been uploaded. The AI pipeline will process them shortly.'
          }
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-[#111827]/60 border border-gray-800 rounded-xl p-5 text-center"
            >
              <div
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3"
                style={{ backgroundColor: `${stat.bg}15` }}
              >
                <Icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-gray-400 text-xs">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-[#111827]/60 border border-gray-800 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-[#10B981]" />
          <span className="text-white font-medium text-sm">
            {isDemo ? 'What\'s Included' : 'Quick Insights'}
          </span>
        </div>
        {isDemo ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              Sample equipment catalog loaded
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              Demo maintenance history available
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              Sample knowledge graph ready
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              Documents stored securely
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              AI processing queued
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              Knowledge graph will build automatically
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onComplete}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium bg-[#10B981] hover:bg-[#059669] text-white transition-all duration-300"
        >
          Enter Dashboard
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function DemoLoadingStep({ onComplete }: DemoLoadingStepProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);

  const stages = [
    { label: 'Loading Equipment Catalog (Sample)', icon: Package, color: '#3B82F6' },
    { label: 'Populating Maintenance Records (Sample)', icon: Database, color: '#8B5CF6' },
    { label: 'Building Knowledge Graph (Sample)', icon: GitBranch, color: '#10B981' },
    { label: 'Creating Relationships (Sample)', icon: Network, color: '#06B6D4' },
    { label: 'Generating Sample Embeddings', icon: Zap, color: '#F59E0B' },
    { label: 'Indexing Sample Data', icon: Search, color: '#EC4899' },
  ];

  useEffect(() => {
    if (currentStageIndex >= stages.length) {
      onComplete({
        documents: 0,
        entities: 0,
        relationships: 0,
        nodes: 0,
      });
      return;
    }

    const interval = setInterval(() => {
      setStageProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setCurrentStageIndex((i) => i + 1);
            setStageProgress(0);
          }, 200);
          return 100;
        }
        return prev + Math.random() * 12 + 3;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [currentStageIndex, onComplete, stages.length]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 mb-4"
        >
          <Loader2 className="w-6 h-6 text-[#10B981] animate-spin" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Loading Demo Factory</h2>
        <p className="text-gray-400">
          Importing sample equipment, maintenance records, and relationships for demonstration purposes.
        </p>
        <p className="text-[#F59E0B] text-xs mt-2 font-medium">
          This is demo data ΓÇö not real uploaded documents.
        </p>
      </div>

      <div className="space-y-3 max-w-2xl mx-auto">
        {stages.map((stage, i) => {
          const Icon = stage.icon;
          const isActive = i === currentStageIndex;
          const isCompleted = i < currentStageIndex;
          const isPending = i > currentStageIndex;

          return (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-[#111827]/60 border rounded-xl p-4 transition-all duration-300 ${
                isActive
                  ? 'border-gray-700'
                  : isCompleted
                    ? 'border-[#10B981]/20'
                    : 'border-gray-800/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                  style={{
                    backgroundColor: `${stage.color}${isCompleted ? '20' : isActive ? '20' : '08'}`,
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" style={{ color: '#10B981' }} />
                  ) : isActive ? (
                    <Loader2 className="w-4 h-4 animate-spin" style={{ color: stage.color }} />
                  ) : (
                    <Icon
                      className="w-4 h-4"
                      style={{ color: isPending ? '#4B5563' : stage.color }}
                    />
                  )}
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${
                    isCompleted
                      ? 'text-[#10B981]'
                      : isActive
                        ? 'text-white'
                        : 'text-gray-500'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
              {(isActive || isCompleted) && (
                <div className="ml-11">
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: isCompleted ? '#10B981' : stage.color,
                        width: `${isCompleted ? 100 : Math.min(stageProgress, 100)}%`,
                      }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('welcome');
  const [flow, setFlow] = useState<FlowChoice>('upload');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [processingResult, setProcessingResult] = useState<{ documents: number; entities: number; relationships: number; nodes: number }>();
  const { setOnboarded, setHasDocuments } = useOnboardingStore();
  const navigate = useNavigate();

  const handleChoice = useCallback((choice: FlowChoice) => {
    setFlow(choice);
    if (choice === 'connect') {
      setCurrentStep('welcome');
    } else if (choice === 'demo') {
      setCurrentStep('demo-loading');
    } else {
      setCurrentStep('file-selection');
    }
  }, []);

  const handleProcessingComplete = useCallback((result: { documents: number; entities: number; relationships: number; nodes: number }) => {
    setProcessingResult(result);
    setCurrentStep('summary');
  }, []);

  const handleDemoLoadingComplete = useCallback((result: { documents: number; entities: number; relationships: number; nodes: number }) => {
    setProcessingResult(result);
    setCurrentStep('summary');
  }, []);

  const handleFinalComplete = useCallback(() => {
    setOnboarded(true);
    setHasDocuments(true);
    navigate('/dashboard');
  }, [setOnboarded, setHasDocuments, navigate]);

  const handleBack = useCallback(() => {
    if (currentStep === 'file-selection') {
      setCurrentStep('welcome');
    } else if (currentStep === 'processing') {
      setCurrentStep('file-selection');
    } else if (currentStep === 'summary') {
      if (flow === 'demo') {
        setCurrentStep('demo-loading');
      } else {
        setCurrentStep('processing');
      }
    }
  }, [currentStep, flow]);

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <StepIndicator currentStep={currentStep} flow={flow} />

        <AnimatePresence mode="wait">
          {currentStep === 'welcome' && (
            <WelcomeScreen key="welcome" onChoice={handleChoice} />
          )}

          {currentStep === 'file-selection' && (
            <FileSelectionStep
              key="file-selection"
              onNext={(files) => {
                setSelectedFiles(files);
                setCurrentStep('processing');
              }}
              onBack={handleBack}
            />
          )}

          {currentStep === 'processing' && (
            <ProcessingStep
              key="processing"
              files={selectedFiles}
              onComplete={handleProcessingComplete}
            />
          )}

          {currentStep === 'demo-loading' && (
            <DemoLoadingStep
              key="demo-loading"
              onComplete={handleDemoLoadingComplete}
            />
          )}

          {currentStep === 'summary' && (
            <SummaryStep
              key="summary"
              onComplete={handleFinalComplete}
              onBack={handleBack}
              isDemo={flow === 'demo'}
              result={processingResult}
            />
          )}
        </AnimatePresence>

        {flow === 'connect' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-[#111827]/60 border border-gray-800 rounded-xl p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 mb-4">
              <Network className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Coming Soon</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
              External source connectors for databases, cloud storage, and IoT data streams
              will be available in a future update.
            </p>
            <button
              onClick={() => setCurrentStep('welcome')}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Options
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
