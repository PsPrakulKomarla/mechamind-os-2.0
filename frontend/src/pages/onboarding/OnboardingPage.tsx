const FileUploader = () => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadConfig, setUploadConfig] = useState<FileUploadConfig>(DEFAULT_CONFIG);
  const [showUploadQueue, setShowUploadQueue] = useState(true);
  const [statistics, setStatistics] = useState<UploadStatistics>({
    totalFiles: 0,
    uploadedFiles: 0,
    totalSize: 0,
    uploadedSize: 0,
    uploadSpeed: 0,
    estimatedTimeRemaining: 0,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queueRef = useRef<HTMLDivElement>(null);
  const uploadStartTime = useRef<number>(Date.now());
  const uploadTimerRef = useRef<NodeJS.Timeout>();
  
  const uploadMutation = useUploadDocument();
  
  // Fetch upload config from backend
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // This would ideally hit an endpoint like /api/upload/config
        // For now, we'll use the default config
        setUploadConfig(DEFAULT_CONFIG);
      } catch (error) {
        console.error('Failed to fetch upload config:', error);
        toast.error('Failed to load upload configuration');
      }
    };
    
    fetchConfig();
  }, []);
  
  // Calculate statistics
  useEffect(() => {
    const totalUploaded = files.filter(f => f.status === 'completed').length;
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    const uploadedSize = files.reduce((sum, f) => f.status === 'completed' ? sum + f.size : sum, 0);
    
    setStatistics({
      totalFiles: files.length,
      uploadedFiles: totalUploaded,
      totalSize,
      uploadedSize,
      uploadSpeed: calculateUploadSpeed(),
      estimatedTimeRemaining: calculateEstimatedTimeRemaining(),
    });
  }, [files]);
  
  const calculateUploadSpeed = () => {
    const elapsed = Date.now() - uploadStartTime.current;
    const uploadedBytes = statistics.uploadedSize;
    return elapsed > 0 ? (uploadedBytes / elapsed) * 1000 : 0; // bytes per second
  };
  
  const calculateEstimatedTimeRemaining = () => {
    const remainingBytes = statistics.totalSize - statistics.uploadedSize;
    const speed = statistics.uploadSpeed;
    return speed > 0 ? (remainingBytes / speed) / 1000 : 0; // seconds
  };
  
  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > uploadConfig.maxSizeBytes) {
      return `File exceeds maximum size of ${formatFileSize(uploadConfig.maxSizeBytes)}`;
    }
    
    // Check file type
    if (!uploadConfig.allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported`;
    }
    
    return null;
  };
  
  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    
    // Check total files limit
    if (files.length + fileArray.length > uploadConfig.maxFiles) {
      toast.error(`Maximum ${uploadConfig.maxFiles} files allowed`);
      return;
    }
    
    const validFiles: UploadFile[] = [];
    const errors: string[] = [];
    
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push({
          ...file,
          id: Math.random().toString(36).substring(2, 9),
          progress: 0,
          status: 'pending',
          retryCount: 0,
        });
      }
    }
    
    if (errors.length > 0) {
      toast.error(errors.join('\n'));
    }
    
    setFiles(prev => [...prev, ...validFiles]);
    
    // Auto-start upload for new files
    setTimeout(() => {
      uploadPendingFiles();
    }, 100);
  }, [files, uploadConfig]);
  
  const uploadPendingFiles = useCallback(async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    if (pendingFiles.length === 0) return;
    
    // Upload files in batches (max 5 concurrent)
    const batchSize = 5;
    const batches = [];
    
    for (let i = 0; i < pendingFiles.length; i += batchSize) {
      batches.push(pendingFiles.slice(i, i + batchSize));
    }
    
    // Process each batch
    for (const batch of batches) {
      await Promise.all(
        batch.map(async (file) => {
          await uploadFile(file);
        })
      );
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }, [files]);
  
  const uploadFile = async (file: UploadFile) => {
    setFiles(prev => prev.map(f => 
      f.id === file.id ? { ...f, status: 'uploading' as const, progress: 0 } : f
    ));
    
    uploadStartTime.current = Date.now();
    
    try {
      // Use the existing upload mutation
      uploadMutation.mutate(
        { file },
        {
          onSuccess: () => {
            setFiles(prev => prev.map(f => 
              f.id === file.id 
                ? { 
                    ...f, 
                    status: 'completed' as const, 
                    progress: 100,
                  }
                : f
            ));
            toast.success(`${file.name} uploaded successfully`);
          },
          onError: (error) => {
            const errorMessage = error instanceof Error ? error.message : 'Upload failed';
            setFiles(prev => prev.map(f =>
              f.id === file.id
                ? { 
                    ...f, 
                    status: 'error' as const, 
                    error: errorMessage,
                  }
                : f
            ));
            toast.error(`${file.name}: ${errorMessage}`);
          },
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setFiles(prev => prev.map(f =>
        f.id === file.id
          ? { 
              ...f, 
              status: 'error' as const, 
              error: errorMessage,
            }
          : f
      ));
      toast.error(`${file.name}: ${errorMessage}`);
    }
  };
  
  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };
  
  const retryFile = async (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;
    
    setFiles(prev => prev.map(f =>
      f.id === fileId
        ? { ...f, status: 'pending' as const, progress: 0, error: undefined }
        : f
    ));
    
    await uploadFile(file);
  };
  
  const clearCompletedFiles = () => {
    setFiles(prev => prev.filter(f => f.status !== 'completed'));
  };
  
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
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);
  
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="min-h-screen bg-[#0B1220] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Enterprise File Upload</h1>
          <p className="text-gray-400">Upload up to {uploadConfig.maxFiles} files (max {formatFileSize(uploadConfig.maxSizeBytes)})</p>
          <div className="mt-4 p-3 bg-[#1E293B] border border-gray-800 rounded-lg">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Upload Progress</span>
              <span>
                {statistics.uploadedFiles} of {statistics.totalFiles} files
                ({formatFileSize(statistics.uploadedSize)} of {formatFileSize(statistics.totalSize)})
              </span>
            </div>
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#3B82F6] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: statistics.totalSize > 0 ? (statistics.uploadedSize / statistics.totalSize) * 100 : 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            {statistics.estimatedTimeRemaining > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                Estimated time remaining: {Math.round(statistics.estimatedTimeRemaining / 1000)}s
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Upload Area */}
          <div className="lg:col-span-3">
            {/* Upload Zone */}
            <motion.div
              className={clsx(
                "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300",
                isDragging
                  ? "border-[#3B82F6] bg-[#3B82F6]/10"
                  : "border-gray-700 bg-[#111827] hover:border-gray-600 hover:bg-[#1E293B]"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={openFilePicker}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={{ scale: isDragging ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <Upload size={64} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-white mb-2">Drop files here or click to browse</h3>
                <p className="text-gray-500 mb-4">
                  Maximum {uploadConfig.maxFiles} files, up to {formatFileSize(uploadConfig.maxSizeBytes)} each
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
                  <span className="bg-gray-800 px-2 py-1 rounded">PDF</span>
                  <span className="bg-gray-800 px-2 py-1 rounded">DOCX</span>
                  <span className="bg-gray-800 px-2 py-1 rounded">XLSX</span>
                  <span className="bg-gray-800 px-2 py-1 rounded">PNG</span>
                  <span className="bg-gray-800 px-2 py-1 rounded">MP4</span>
                  <span className="bg-gray-800 px-2 py-1 rounded">ZIP</span>
                  <span>and more...</span>
                </div>
              </motion.div>
              
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                onChange={(e) => handleFiles(e.target.files || [])}
                accept={uploadConfig.allowedTypes.join(',')}
              />
            </motion.div>
            
            {/* Upload Queue */}
            {files.length > 0 && (
              <div className="mt-6" ref={queueRef}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Upload Queue ({files.length})</h3>
                  <button
                    onClick={clearCompletedFiles}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Clear completed
                  </button>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {files.map((file) => (
                      <motion.div
                        key={file.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={clsx(
                          "bg-[#1E293B] border rounded-lg p-4 transition-all",
                          file.status === 'completed' && "border-green-500/30 bg-green-500/5",
                          file.status === 'error' && "border-red-500/30 bg-red-500/5",
                          file.status === 'uploading' && "border-blue-500/30 bg-blue-500/5",
                        )}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="p-2 bg-gray-800 rounded">
                              {React.createElement(getFileIcon(file), { size: 20, className: "text-gray-400" })}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {file.status === 'uploading' && (
                              <Clock size={16} className="text-blue-400 animate-spin" />
                            )}
                            {file.status === 'completed' && (
                              <CheckCircle2 size={16} className="text-green-400" />
                            )}
                            {file.status === 'error' && (
                              <AlertCircle size={16} className="text-red-400" />
                            )}
                            
                            <button
                              onClick={() => removeFile(file.id)}
                              className="p-1 text-gray-500 hover:text-white transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                        
                        {(file.status === 'uploading' || file.status === 'pending') && (
                          <div className="mb-2">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>{file.status === 'uploading' ? 'Uploading...' : 'Waiting...'}</span>
                              <span>{file.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-[#3B82F6] rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: file.progress }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {file.status === 'error' && file.error && (
                          <div className="mb-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">
                            {file.error}
                          </div>
                        )}
                        
                        {file.status === 'error' && (
                          <button
                            onClick={() => retryFile(file.id)}
                            className="text-xs bg-[#3B82F6] hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
                          >
                            Retry
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#1E293B] border border-gray-800 rounded-lg p-4 sticky top-6">
              <h3 className="text-lg font-semibold text-white mb-4">Upload Info</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Max File Size:</span>
                  <span className="text-white">{formatFileSize(uploadConfig.maxSizeBytes)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Files:</span>
                  <span className="text-white">{uploadConfig.maxFiles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Allowed Types:</span>
                  <span className="text-white">{uploadConfig.allowedTypes.length} types</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Retry Attempts:</span>
                  <span className="text-white">{uploadConfig.retryAttempts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Chunk Size:</span>
                  <span className="text-white">{formatFileSize(uploadConfig.chunkSize)}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-800">
                <h4 className="text-sm font-semibold text-white mb-2">Upload Status</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pending:</span>
                    <span className="text-white">{files.filter(f => f.status === 'pending').length}</span>
                  </div>
                  <div classwise justify-between">
                    <span className="text-gray-500">Uploading:</span>
                    <span className="text-blue-400">{files.filter(f => f.status === 'uploading').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Completed:</span>
                    <span className="text-green-400">{files.filter(f => f.status === 'completed').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Errors:</span>
                    <span className="text-red-400">{files.filter(f => f.status === 'error').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OnboardingPage() {
  return <FileUploader />;
}
