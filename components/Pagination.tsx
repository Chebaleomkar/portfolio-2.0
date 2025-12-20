'use client'

import { useMemo } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    windowSize?: number
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    windowSize = 5,
}: PaginationProps) {
    // Calculate the sliding window of page numbers
    const pageNumbers = useMemo(() => {
        if (totalPages <= windowSize) {
            // Show all pages if total is less than window size
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        // Calculate window start based on current page
        const windowIndex = Math.floor((currentPage - 1) / windowSize)
        const start = windowIndex * windowSize + 1
        const end = Math.min(start + windowSize - 1, totalPages)

        return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }, [currentPage, totalPages, windowSize])

    if (totalPages <= 1) return null

    const showPrevWindow = pageNumbers[0] > 1
    const showNextWindow = pageNumbers[pageNumbers.length - 1] < totalPages

    return (
        <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
            {/* Previous page button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 
                   disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Previous page"
            >
                <HiChevronLeft size={20} />
            </button>

            {/* First page + ellipsis if not in first window */}
            {showPrevWindow && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="w-10 h-10 rounded-lg border border-gray-800 text-gray-400 hover:text-white 
                       hover:border-gray-700 transition-all text-sm font-medium"
                    >
                        1
                    </button>
                    <span className="text-gray-600 px-1">...</span>
                </>
            )}

            {/* Page number buttons */}
            {pageNumbers.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-10 h-10 rounded-lg border text-sm font-medium transition-all
            ${page === currentPage
                            ? 'bg-white text-black border-white'
                            : 'border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                        }`}
                    aria-current={page === currentPage ? 'page' : undefined}
                >
                    {page}
                </button>
            ))}

            {/* Ellipsis + last page if not in last window */}
            {showNextWindow && (
                <>
                    <span className="text-gray-600 px-1">...</span>
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="w-10 h-10 rounded-lg border border-gray-800 text-gray-400 hover:text-white 
                       hover:border-gray-700 transition-all text-sm font-medium"
                    >
                        {totalPages}
                    </button>
                </>
            )}

            {/* Next page button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 
                   disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Next page"
            >
                <HiChevronRight size={20} />
            </button>
        </nav>
    )
}
