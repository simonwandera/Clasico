import React from 'react';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Edit, Eye, Image as ImageIcon, Trash2} from 'lucide-react';
import {truncateText} from '../lib/utils';

const ProductLineCard = ({
                             productLine,
                             onEdit,
                             onDelete,
                             onView,
                             className = ''
                         }) => {

    // Build the complete image URL
    const getImageUrl = (filename) => {
        if (!filename)
            return null;
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

        return `${API_BASE_URL}/images/${filename}`;
    };

    const imageUrl = getImageUrl(productLine.image);

    return (
        <Card className={`
      relative overflow-hidden 
      transition-all duration-300 
      hover:shadow-xl hover:-translate-y-1 
      group ${className}
      bg-white dark:bg-gray-800 
      border border-gray-200 dark:border-gray-700
      rounded-xl
    `}>
            {/* Image Section with Gradient Overlay */}
            <div className="relative h-40 w-full overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={productLine.productLine}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                        }}
                    />
                ) : null}

                {/* Fallback/No Image Placeholder */}
                <div
                    className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center ${imageUrl ? 'hidden' : 'flex'}`}>
                    <div className="text-center text-gray-400 dark:text-gray-500">
                        <ImageIcon className="w-10 h-10 mx-auto mb-2"/>
                        <span className="text-sm font-medium">No Image</span>
                    </div>
                </div>

                <div
                    className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-80 dark:opacity-60"/>
            </div>

            {/* Floating Action Buttons */}
            <div
                className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(productLine)}
                    className="h-9 w-9 p-0 rounded-full backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/50 border-gray-300 dark:border-gray-600"
                    title="View Details"
                >
                    <Eye className="w-4 h-4 text-gray-700 dark:text-gray-300"/>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(productLine)}
                    className="h-9 w-9 p-0 rounded-full backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 hover:bg-yellow-50 dark:hover:bg-yellow-900/50 border-gray-300 dark:border-gray-600"
                    title="Edit"
                >
                    <Edit className="w-4 h-4 text-gray-700 dark:text-gray-300"/>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(productLine.id)}
                    className="h-9 w-9 p-0 rounded-full backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 hover:bg-red-50 dark:hover:bg-red-900/50 border-gray-300 dark:border-gray-600 text-red-600 dark:text-red-400"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4"/>
                </Button>
            </div>

            <CardContent className="p-4 space-y-3">
                {/* Title with subtle animation */}
                <CardHeader className="p-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {productLine.productLine}
                    </h3>
                </CardHeader>

                {/* Description with fade effect */}
                <div className="relative">
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2 transition-opacity group-hover:opacity-90">
                        {truncateText(productLine.textDescription, 120)}
                    </p>
                    <div
                        className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white dark:from-gray-800 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
                </div>

                {/* Tags and Metadata */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                    {productLine.htmlDescription && (
                        <Badge
                            variant="outline"
                            className="text-xs px-2 py-1 rounded-full bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                        >
                            HTML Content
                        </Badge>
                    )}

                    <div className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                        {productLine.createdAt && (
                            <span>{new Date(productLine.createdAt).toLocaleDateString()}</span>
                        )}
                    </div>
                </div>
            </CardContent>

            {/* Subtle hover effect border */}
            <div
                className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-900/30 rounded-xl pointer-events-none transition-all duration-300"/>
        </Card>
    );
};

export default ProductLineCard;