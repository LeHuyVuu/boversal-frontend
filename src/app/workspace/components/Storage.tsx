'use client';
import React, { useState } from 'react';
import {
  HardDrive,
  Upload,
  Search,
  Download,
  Trash2,
  File,
  Image,
  FileText,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

// ==================== TYPES ====================
interface StorageFile {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  uploader: string;
  type: 'document' | 'image' | 'other';
}

// ==================== CONSTANTS ====================
const ITEMS_PER_PAGE = 5;

const Storage: React.FC = () => {
  // ==================== HOOKS ====================
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // ==================== DATA ====================
  const [files] = useState<StorageFile[]>([
    {
      id: '1',
      name: 'Project_Requirements.pdf',
      size: '2.4 MB',
      uploadDate: '2024-12-18',
      uploader: 'John Doe',
      type: 'document',
    },
    {
      id: '2',
      name: 'UI_Mockups.png',
      size: '1.8 MB',
      uploadDate: '2024-12-17',
      uploader: 'Jane Smith',
      type: 'image',
    },
    {
      id: '3',
      name: 'Meeting_Notes.docx',
      size: '856 KB',
      uploadDate: '2024-12-16',
      uploader: 'Mike Johnson',
      type: 'document',
    },
    {
      id: '4',
      name: 'Budget_Spreadsheet.xlsx',
      size: '1.2 MB',
      uploadDate: '2024-12-15',
      uploader: 'Sarah Wilson',
      type: 'document',
    },
    {
      id: '5',
      name: 'Logo_Draft.svg',
      size: '342 KB',
      uploadDate: '2024-12-14',
      uploader: 'Design Team',
      type: 'image',
    },
    {
      id: '6',
      name: 'Release_Plan.pdf',
      size: '3.1 MB',
      uploadDate: '2024-12-13',
      uploader: 'PMO',
      type: 'document',
    },
  ]);

  // ==================== UTILITY FUNCTIONS ====================
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'image':
        return <Image className="w-5 h-5 text-green-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const calculateTotalSize = () => {
    return files.reduce((acc, file) => {
      const size = parseFloat(file.size);
      const unit = file.size.includes('MB') ? size : size / 1000;
      return acc + unit;
    }, 0);
  };

  // ==================== COMPUTED VALUES ====================
  const filteredFiles = files.filter(
    (file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.uploader.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFiles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedFiles = filteredFiles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalSize = calculateTotalSize();

  // ==================== EVENT HANDLERS ====================
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // ==================== THEME STYLES ====================
  const styles = {
    headerIcon: theme === 'dark' 
      ? 'bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/50' 
      : 'bg-blue-500',
    headerTitle: theme === 'dark' ? 'text-cyan-100' : 'text-gray-900',
    headerSubtitle: theme === 'dark' ? 'text-cyan-300' : 'text-gray-600',
    button: theme === 'dark'
      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/50'
      : 'bg-blue-600 hover:bg-blue-700 text-white',
    card: theme === 'dark'
      ? 'bg-slate-900/60 border-blue-500/20 backdrop-blur-sm'
      : 'bg-white border-gray-200',
    statLabel: theme === 'dark' ? 'text-cyan-400' : 'text-gray-500',
    statValue: theme === 'dark' ? 'text-cyan-100' : 'text-gray-900',
    progressBar: theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-200',
    progressFill: theme === 'dark' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-blue-500',
    searchIcon: theme === 'dark' ? 'text-cyan-400' : 'text-gray-400',
    input: theme === 'dark'
      ? 'bg-slate-900/60 border-blue-500/20 text-cyan-100 placeholder-cyan-400/50 focus:ring-cyan-500 focus:border-cyan-500'
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
    tableHeader: theme === 'dark'
      ? 'bg-slate-800/60 border-blue-500/20'
      : 'bg-gray-50 border-gray-200',
    tableHeaderText: theme === 'dark' ? 'text-cyan-200' : 'text-gray-900',
    tableDivider: theme === 'dark' ? 'divide-blue-500/10' : 'divide-gray-200',
    tableRow: theme === 'dark' ? 'hover:bg-blue-900/20' : 'hover:bg-gray-50',
    tableText: theme === 'dark' ? 'text-cyan-100' : 'text-gray-900',
    tableSecondary: theme === 'dark' ? 'text-cyan-300' : 'text-gray-600',
    actionButton: {
      download: theme === 'dark'
        ? 'text-cyan-400 hover:bg-blue-900/30'
        : 'text-blue-600 hover:bg-blue-50',
      delete: theme === 'dark'
        ? 'text-red-400 hover:bg-red-900/30'
        : 'text-red-600 hover:bg-red-50',
    },
    emptyIcon: theme === 'dark' ? 'text-cyan-400/50' : 'text-gray-400',
    emptyTitle: theme === 'dark' ? 'text-cyan-100' : 'text-gray-900',
    emptyText: theme === 'dark' ? 'text-cyan-300' : 'text-gray-500',
    pagination: {
      container: theme === 'dark' ? 'bg-black/30 border-blue-500/20' : 'bg-white border-gray-200',
      disabled: theme === 'dark'
        ? 'bg-slate-800/50 text-cyan-400/30 border-blue-500/10 cursor-not-allowed'
        : 'bg-gray-100 text-gray-400 cursor-not-allowed',
      normal: theme === 'dark'
        ? 'bg-slate-900/60 hover:bg-blue-900/30 text-cyan-300 border-blue-500/20'
        : 'bg-white hover:bg-gray-50 text-gray-700',
      active: theme === 'dark'
        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-transparent shadow-lg shadow-blue-500/50'
        : 'bg-blue-600 text-white border-blue-600',
    },
  };

  // ==================== RENDER ====================
  return (
    <div className="flex flex-col min-h-screen">
      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
        
        {/* ----- Header Section ----- */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${styles.headerIcon}`}>
              <HardDrive className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${styles.headerTitle}`}>Storage</h1>
              <p className={`mt-1 ${styles.headerSubtitle}`}>Manage your uploaded files</p>
            </div>
          </div>
          <button className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${styles.button}`}>
            <Upload className="w-5 h-5" />
            <span className="font-medium">Upload File</span>
          </button>
        </div>

        {/* ----- Storage Stats Card ----- */}
        <div className={`rounded-xl p-6 shadow-sm border mb-6 ${styles.card}`}>
          <div className="flex items-center gap-10">
            <div>
              <p className={`text-sm ${styles.statLabel}`}>Total Files</p>
              <p className={`text-2xl font-bold ${styles.statValue}`}>{files.length}</p>
            </div>
            <div>
              <p className={`text-sm ${styles.statLabel}`}>Total Size</p>
              <p className={`text-2xl font-bold ${styles.statValue}`}>
                {totalSize.toFixed(1)} MB
              </p>
            </div>
            <div>
              <p className={`text-sm ${styles.statLabel}`}>Storage Used</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-40 rounded-full h-2 ${styles.progressBar}`}>
                  <div
                    className={`h-2 rounded-full ${styles.progressFill}`}
                    style={{ width: '48%' }}
                  ></div>
                </div>
                <span className={`text-sm ${styles.tableSecondary}`}>2.4 GB / 5 GB</span>
              </div>
            </div>
          </div>
        </div>

        {/* ----- Search Section ----- */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${styles.searchIcon}`} />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 outline-none ${styles.input}`}
            />
          </div>
        </div>

        {/* ----- Files Table ----- */}
        <div className={`rounded-xl shadow-sm border overflow-hidden ${styles.card}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`border-b ${styles.tableHeader}`}>
                <tr>
                  <th className={`text-left py-3 px-6 font-medium text-sm ${styles.tableHeaderText}`}>
                    File Name
                  </th>
                  <th className={`text-left py-3 px-6 font-medium text-sm ${styles.tableHeaderText}`}>
                    Size
                  </th>
                  <th className={`text-left py-3 px-6 font-medium text-sm ${styles.tableHeaderText}`}>
                    Upload Date
                  </th>
                  <th className={`text-left py-3 px-6 font-medium text-sm ${styles.tableHeaderText}`}>
                    Uploaded By
                  </th>
                  <th className={`text-left py-3 px-6 font-medium text-sm ${styles.tableHeaderText}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y text-sm ${styles.tableDivider}`}>
                {paginatedFiles.map((file) => (
                  <tr key={file.id} className={`transition-colors ${styles.tableRow}`}>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.type)}
                        <span className={`font-medium ${styles.tableText}`}>
                          {file.name}
                        </span>
                      </div>
                    </td>
                    <td className={`py-3 px-6 ${styles.tableSecondary}`}>{file.size}</td>
                    <td className={`py-3 px-6 ${styles.tableSecondary}`}>{file.uploadDate}</td>
                    <td className={`py-3 px-6 ${styles.tableSecondary}`}>{file.uploader}</td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <button className={`p-1.5 rounded-lg transition-colors ${styles.actionButton.download}`}>
                          <Download className="w-4 h-4" />
                        </button>
                        <button className={`p-1.5 rounded-lg transition-colors ${styles.actionButton.delete}`}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ----- Empty State ----- */}
        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <HardDrive className={`w-12 h-12 mx-auto mb-4 ${styles.emptyIcon}`} />
            <h3 className={`text-lg font-medium mb-2 ${styles.emptyTitle}`}>
              No files found
            </h3>
            <p className={`mb-6 ${styles.emptyText}`}>
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Upload your first file to get started'}
            </p>
            {!searchTerm && (
              <button className={`px-6 py-3 rounded-lg font-medium transition-all ${styles.button}`}>
                Upload File
              </button>
            )}
          </div>
        )}
      </div>

      {/* ===== PAGINATION FOOTER ===== */}
      {filteredFiles.length > 0 && (
        <div className={`py-4 border-t ${styles.pagination.container}`}>
          <div className="flex items-center justify-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                currentPage === 1 ? styles.pagination.disabled : styles.pagination.normal
              }`}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                  currentPage === i + 1 ? styles.pagination.active : styles.pagination.normal
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                currentPage === totalPages ? styles.pagination.disabled : styles.pagination.normal
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Storage;
export { Storage };
