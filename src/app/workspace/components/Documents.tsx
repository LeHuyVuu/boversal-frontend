'use client';
import React, { useState } from 'react';
import {
    FileText,
    Plus,
    Search,
    Filter,
    Calendar,
    File,
    FileImage,
    Presentation,
} from 'lucide-react';

interface Document {
    id: string;
    title: string;
    description: string;
    type: 'doc' | 'pdf' | 'ppt' | 'txt';
    lastUpdated: string;
    author: string;
}

const Documents: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [documents] = useState<Document[]>([
        {
            id: '1',
            title: 'Project Requirements Document',
            description: 'Detailed requirements and specifications for the Alpha project',
            type: 'doc',
            lastUpdated: '2024-12-18',
            author: 'John Doe',
        },
        {
            id: '2',
            title: 'Technical Architecture',
            description: 'System architecture and technical design overview',
            type: 'pdf',
            lastUpdated: '2024-12-17',
            author: 'Jane Smith',
        },
        {
            id: '3',
            title: 'Marketing Presentation',
            description: 'Q4 marketing strategy and campaign presentation',
            type: 'ppt',
            lastUpdated: '2024-12-16',
            author: 'Mike Johnson',
        },
        {
            id: '4',
            title: 'User Manual',
            description: 'Complete user guide and documentation',
            type: 'doc',
            lastUpdated: '2024-12-15',
            author: 'Sarah Wilson',
        },
        {
            id: '5',
            title: 'API Documentation',
            description: 'RESTful API endpoints and integration guide',
            type: 'pdf',
            lastUpdated: '2024-12-14',
            author: 'Tech Team',
        },
        {
            id: '6',
            title: 'Meeting Notes',
            description: 'Weekly standup meeting notes and action items',
            type: 'txt',
            lastUpdated: '2024-12-13',
            author: 'Project Manager',
        },
        {
            id: '7',
            title: 'Meeting Notes',
            description: 'Weekly standup meeting notes and action items',
            type: 'txt',
            lastUpdated: '2024-12-13',
            author: 'Project Manager',
        },
        {
            id: '8',
            title: 'Meeting Notes',
            description: 'Weekly standup meeting notes and action items',
            type: 'txt',
            lastUpdated: '2024-12-13',
            author: 'Project Manager',
        },
        {
            id: '9',
            title: 'Meeting Notes',
            description: 'Weekly standup meeting notes and action items',
            type: 'txt',
            lastUpdated: '2024-12-13',
            author: 'Project Manager',
        },
        {
            id: '10',
            title: 'Meeting Notes',
            description: 'Weekly standup meeting notes and action items',
            type: 'txt',
            lastUpdated: '2024-12-13',
            author: 'Project Manager',
        },
        {
            id: '11',
            title: 'Meeting Notes',
            description: 'Weekly standup meeting notes and action items',
            type: 'txt',
            lastUpdated: '2024-12-13',
            author: 'Project Manager',
        },
    ]);

    const getDocumentIcon = (type: string) => {
        switch (type) {
            case 'doc':
                return <File className="w-7 h-7 text-blue-500" />;
            case 'pdf':
                return <FileText className="w-7 h-7 text-red-500" />;
            case 'ppt':
                return <Presentation className="w-7 h-7 text-orange-500" />;
            case 'txt':
                return <FileImage className="w-7 h-7 text-gray-500" />;
            default:
                return <File className="w-7 h-7 text-gray-500" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'doc':
                return 'bg-blue-100 text-blue-800';
            case 'pdf':
                return 'bg-red-100 text-red-800';
            case 'ppt':
                return 'bg-orange-100 text-orange-800';
            case 'txt':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredDocuments = documents.filter((doc) => {
        const matchesSearch =
            doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || doc.type === filterType;
        return matchesSearch && matchesFilter;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDocs = filteredDocuments.slice(startIndex, startIndex + itemsPerPage);

    const documentTypes = ['all', 'doc', 'pdf', 'ppt', 'txt'];

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-blue-500 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
                            <p className="text-gray-600 text-sm">Manage your document library</p>
                        </div>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium">
                        <Plus className="w-4 h-4" />
                        New Document
                    </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search documents..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-56 text-sm"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                                value={filterType}
                                onChange={(e) => {
                                    setFilterType(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm"
                            >
                                {documentTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type === 'all' ? 'All Types' : type.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="text-xs text-gray-600">
                        {filteredDocuments.length} of {documents.length} documents
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {paginatedDocs.map((document) => (
                        <div
                            key={document.id}
                            className="bg-white rounded-lg p-5 shadow border border-gray-200 hover:shadow-md transition cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                {getDocumentIcon(document.type)}
                                <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                                        document.type
                                    )}`}
                                >
                                    {document.type.toUpperCase()}
                                </span>
                            </div>

                            <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                {document.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {document.description}
                            </p>

                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{document.lastUpdated}</span>
                                </div>
                                <span className="font-medium">{document.author}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredDocuments.length === 0 && (
                    <div className="text-center ">
                        <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-base font-medium text-gray-900 mb-1">No documents found</h3>
                        <p className="text-gray-500 text-sm mb-5">
                            {searchTerm || filterType !== 'all'
                                ? 'Try adjusting your search or filter criteria'
                                : 'Create your first document to get started'}
                        </p>
                    </div>
                )}
            </div>

            {filteredDocuments.length > 0 && (
                    <div className=" bg-white py-3 mb-25">
                        <div className="flex items-center justify-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                                className={`px-3 py-1.5 text-sm rounded-md border ${currentPage === 1
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
                                    className={`px-3 py-1.5 text-sm rounded-md border ${currentPage === i + 1
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
                                className={`px-3 py-1.5 text-sm rounded-md border ${currentPage === totalPages
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

export default Documents;
