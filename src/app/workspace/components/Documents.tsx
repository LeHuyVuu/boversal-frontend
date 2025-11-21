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
import { useTheme } from '@/contexts/ThemeContext';

// ==================== TYPES ====================
interface Document {
    id: string;
    title: string;
    description: string;
    type: 'doc' | 'pdf' | 'ppt' | 'txt';
    lastUpdated: string;
    author: string;
}

// ==================== CONSTANTS ====================
const ITEMS_PER_PAGE = 6;
const DOCUMENT_TYPES = ['all', 'doc', 'pdf', 'ppt', 'txt'] as const;

const Documents: React.FC = () => {
    // ==================== HOOKS ====================
    const { theme } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);

    // ==================== DATA ====================
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

    // ==================== UTILITY FUNCTIONS ====================
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

    // ==================== COMPUTED VALUES ====================
    const filteredDocuments = documents.filter((doc) => {
        const matchesSearch =
            doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || doc.type === filterType;
        return matchesSearch && matchesFilter;
    });

    const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedDocs = filteredDocuments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // ==================== EVENT HANDLERS ====================
    const handleFilterChange = (type: string) => {
        setFilterType(type);
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
        searchIcon: theme === 'dark' ? 'text-cyan-400' : 'text-gray-400',
        input: theme === 'dark'
            ? 'bg-slate-900/60 border-blue-500/20 text-cyan-100 placeholder-cyan-400/50 focus:ring-cyan-500 focus:border-cyan-500'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
        inputBg: theme === 'dark' ? '' : 'bg-white',
        counter: theme === 'dark' ? 'text-cyan-300' : 'text-gray-600',
        card: theme === 'dark'
            ? 'bg-slate-900/60 border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/20 backdrop-blur-sm'
            : 'bg-white border-gray-200 hover:shadow-md',
        typeBadge: theme === 'dark'
            ? 'bg-blue-500/20 text-cyan-300 border border-blue-500/30'
            : '',
        cardTitle: theme === 'dark'
            ? 'text-cyan-100 group-hover:text-cyan-400'
            : 'text-gray-900 group-hover:text-blue-600',
        cardDescription: theme === 'dark' ? 'text-cyan-300' : 'text-gray-600',
        cardMeta: theme === 'dark' ? 'text-cyan-400' : 'text-gray-500',
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
            <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
                
                {/* ----- Header Section ----- */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${styles.headerIcon}`}>
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className={`text-2xl font-bold ${styles.headerTitle}`}>Documents</h1>
                            <p className={`text-sm ${styles.headerSubtitle}`}>Manage your document library</p>
                        </div>
                    </div>
                    <button className={`px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all text-sm font-medium ${styles.button}`}>
                        <Plus className="w-4 h-4" />
                        New Document
                    </button>
                </div>

                {/* ----- Search and Filter Bar ----- */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${styles.searchIcon}`} />
                            <input
                                type="text"
                                placeholder="Search documents..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`pl-9 pr-3 py-2 border rounded-lg focus:ring-2 outline-none w-56 text-sm ${styles.input}`}
                            />
                        </div>
                        <div className="relative">
                            <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${styles.searchIcon}`} />
                            <select
                                value={filterType}
                                onChange={(e) => handleFilterChange(e.target.value)}
                                className={`pl-9 pr-8 py-2 border rounded-lg focus:ring-2 outline-none text-sm ${styles.input} ${styles.inputBg}`}
                            >
                                {DOCUMENT_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type === 'all' ? 'All Types' : type.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={`text-xs ${styles.counter}`}>
                        {filteredDocuments.length} of {documents.length} documents
                    </div>
                </div>

                {/* ----- Document Cards Grid ----- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {paginatedDocs.map((document) => (
                        <div
                            key={document.id}
                            className={`rounded-lg p-5 shadow border transition cursor-pointer group ${styles.card}`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                {getDocumentIcon(document.type)}
                                <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                        theme === 'dark' ? styles.typeBadge : getTypeColor(document.type)
                                    }`}
                                >
                                    {document.type.toUpperCase()}
                                </span>
                            </div>

                            <h3 className={`text-base font-semibold mb-1 transition-colors ${styles.cardTitle}`}>
                                {document.title}
                            </h3>
                            <p className={`text-sm mb-3 line-clamp-2 ${styles.cardDescription}`}>
                                {document.description}
                            </p>

                            <div className={`flex items-center justify-between text-xs ${styles.cardMeta}`}>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{document.lastUpdated}</span>
                                </div>
                                <span className="font-medium">{document.author}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ----- Empty State ----- */}
                {filteredDocuments.length === 0 && (
                    <div className="text-center py-8">
                        <FileText className={`w-10 h-10 mx-auto mb-3 ${styles.emptyIcon}`} />
                        <h3 className={`text-base font-medium mb-1 ${styles.emptyTitle}`}>No documents found</h3>
                        <p className={`text-sm mb-5 ${styles.emptyText}`}>
                            {searchTerm || filterType !== 'all'
                                ? 'Try adjusting your search or filter criteria'
                                : 'Create your first document to get started'}
                        </p>
                    </div>
                )}
            </div>

            {/* ===== PAGINATION FOOTER ===== */}
            {filteredDocuments.length > 0 && (
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

export default Documents;
export { Documents };
