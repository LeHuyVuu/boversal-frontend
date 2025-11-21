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

interface StorageFile {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  uploader: string;
  type: 'document' | 'image' | 'other';
}

const Storage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const filteredFiles = files.filter(
    (file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.uploader.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFiles = filteredFiles.slice(startIndex, startIndex + itemsPerPage);

  const totalSize = files.reduce((acc, file) => {
    const size = parseFloat(file.size);
    const unit = file.size.includes('MB') ? size : size / 1000;
    return acc + unit;
  }, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <HardDrive className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Storage</h1>
              <p className="text-gray-600 mt-1">Manage your uploaded files</p>
            </div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
            <Upload className="w-5 h-5" />
            <span className="font-medium">Upload File</span>
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center gap-10">
            <div>
              <p className="text-sm text-gray-500">Total Files</p>
              <p className="text-2xl font-bold text-gray-900">{files.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Size</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalSize.toFixed(1)} MB
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Storage Used</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-40 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: '48%' }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">2.4 GB / 5 GB</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900 text-sm">
                    File Name
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900 text-sm">
                    Size
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900 text-sm">
                    Upload Date
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900 text-sm">
                    Uploaded By
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900 text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {paginatedFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.type)}
                        <span className="font-medium text-gray-900">
                          {file.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-gray-600">{file.size}</td>
                    <td className="py-3 px-6 text-gray-600">{file.uploadDate}</td>
                    <td className="py-3 px-6 text-gray-600">{file.uploader}</td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <HardDrive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No files found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Upload your first file to get started'}
            </p>
            {!searchTerm && (
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Upload File
              </button>
            )}
          </div>
        )}
      </div>

      {filteredFiles.length > 0 && (
        <div className=" bg-white py-3 mb-15">
          <div className="flex items-center justify-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className={`px-3 py-1.5 text-sm rounded-md border ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-50 text-gray-700'
              }`}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1.5 text-sm rounded-md border ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`px-3 py-1.5 text-sm rounded-md border ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-50 text-gray-700'
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
