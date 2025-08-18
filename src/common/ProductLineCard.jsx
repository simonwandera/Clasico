import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Image as ImageIcon } from 'lucide-react';
import { truncateText, getPlaceholderImage } from '../lib/utils';

const ProductLineCard = ({ 
  productLine, 
  onEdit, 
  onDelete, 
  onView,
  className = '' 
}) => {
  const handleImageError = (e) => {
    // e.target.src = getPlaceholderImage(300, 200, productLine.productLine);
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 group ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {productLine.productLine}
          </CardTitle>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(productLine)}
              className="h-8 w-8 p-0 hover:bg-blue-100"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(productLine)}
              className="h-8 w-8 p-0 hover:bg-yellow-100"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(productLine.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Image Section */}
        {/* <div className="relative">
          {productLine.image ? (
            <img
              src={productLine.image}
              alt={productLine.productLine}
              onError={handleImageError}
              className="w-full h-32 object-cover rounded-md border"
            />
          ) : (
            <div className="w-full h-32 bg-gray-100 rounded-md border border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                <span className="text-xs">No Image</span>
              </div>
            </div>
          )}
        </div> */}

        {/* Description */}
        <div>
          <p className="text-gray-600 text-sm leading-relaxed">
            {truncateText(productLine.textDescription, 120)}
          </p>
        </div>

        {/* HTML Description Badge */}
        {productLine.htmlDescription && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              HTML Content Available
            </Badge>
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <span>ID: {productLine.id}</span>
          {productLine.createdAt && (
            <span>Created: {new Date(productLine.createdAt).toLocaleDateString()}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductLineCard;