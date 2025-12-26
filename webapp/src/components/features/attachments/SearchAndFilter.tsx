import { useState } from "react";
import { MdSearch, MdFilterList, MdClear } from "react-icons/md";
import Input from "../../common/layout/Input.tsx";

interface SearchAndFilterProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    selectedFileType: string;
    onFileTypeChange: (type: string) => void;
    totalCount: number;
    filteredCount: number;
}

const SearchAndFilter = ({ 
    searchTerm, 
    onSearchChange, 
    selectedFileType, 
    onFileTypeChange, 
    totalCount,
    filteredCount 
}: SearchAndFilterProps) => {
    const [showFilters, setShowFilters] = useState(false);

    const fileTypeOptions = [
        { value: '', label: 'All Files' },
        { value: 'image', label: 'Images' },
        { value: 'pdf', label: 'PDFs' },
        { value: 'other', label: 'Other' }
    ];

    const clearSearch = () => {
        onSearchChange('');
    };

    const clearFilters = () => {
        onSearchChange('');
        onFileTypeChange('');
    };

    const hasActiveFilters = searchTerm || selectedFileType;

    return (
        <div className="bg-white rounded-lg border border-secondary-200 p-4 mb-6">
            {/* Search Bar */}
            <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 relative">
                    <Input
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search attachments by name..."
                        leftIcon={<MdSearch className="w-5 h-5 text-secondary-400" />}
                        rightIcon={
                            searchTerm ? (
                                <button
                                    onClick={clearSearch}
                                    className="p-1 hover:bg-secondary-100 rounded transition-colors"
                                >
                                    <MdClear className="w-4 h-4 text-secondary-400" />
                                </button>
                            ) : undefined
                        }
                        fullWidth
                    />
                </div>
                
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                        showFilters || hasActiveFilters
                            ? 'bg-primary-50 border-primary-200 text-primary-700'
                            : 'bg-white border-secondary-300 text-secondary-700 hover:bg-secondary-50'
                    }`}
                >
                    <MdFilterList className="w-4 h-4" />
                    Filters
                    {hasActiveFilters && (
                        <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {[searchTerm, selectedFileType].filter(Boolean).length}
                        </span>
                    )}
                </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
                <div className="border-t border-secondary-200 pt-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-secondary-700">
                                File Type:
                            </label>
                            <select
                                value={selectedFileType}
                                onChange={(e) => onFileTypeChange(e.target.value)}
                                className="px-3 py-1 border border-secondary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                {fileTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-secondary-600 hover:text-secondary-800 flex items-center gap-1 transition-colors"
                            >
                                <MdClear className="w-4 h-4" />
                                Clear all filters
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Results Summary */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary-100">
                <div className="text-sm text-secondary-600">
                    {hasActiveFilters ? (
                        <span>
                            Showing <span className="font-medium text-secondary-900">{filteredCount}</span> of{' '}
                            <span className="font-medium text-secondary-900">{totalCount}</span> attachments
                        </span>
                    ) : (
                        <span>
                            <span className="font-medium text-secondary-900">{totalCount}</span> attachments
                        </span>
                    )}
                </div>

                {hasActiveFilters && (
                    <div className="text-xs text-secondary-500">
                        {searchTerm && (
                            <span className="bg-secondary-100 px-2 py-1 rounded-full mr-2">
                                Search: "{searchTerm}"
                            </span>
                        )}
                        {selectedFileType && (
                            <span className="bg-secondary-100 px-2 py-1 rounded-full">
                                Type: {fileTypeOptions.find(opt => opt.value === selectedFileType)?.label}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchAndFilter;

