import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';

const EditProductLine = ({ productLine, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    productLine: '',
    textDescription: '',
    htmlDescription: '',
    image: ''
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with existing data
  useEffect(() => {
    if (productLine) {
      setFormData({
        productLine: productLine.productLine || '',
        textDescription: productLine.textDescription || '',
        htmlDescription: productLine.htmlDescription || '',
        image: productLine.image || ''
      });
      setImagePreview(productLine.image || '');
    }
  }, [productLine]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.productLine.trim()) {
      newErrors.productLine = 'Product line name is required';
    }
    
    if (!formData.textDescription.trim()) {
      newErrors.textDescription = 'Text description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real app, make API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSubmit({
        ...productLine,
        ...formData
      });
    } catch (error) {
      console.error('Error updating product line:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Line Name */}
      <div className="space-y-2">
        <Label htmlFor="edit-productLine">Product Line Name *</Label>
        <Input
          id="edit-productLine"
          name="productLine"
          value={formData.productLine}
          onChange={handleInputChange}
          placeholder="Enter product line name"
          className={errors.productLine ? 'border-red-500' : ''}
        />
        {errors.productLine && (
          <p className="text-sm text-red-500">{errors.productLine}</p>
        )}
      </div>

      {/* Text Description */}
      <div className="space-y-2">
        <Label htmlFor="edit-textDescription">Text Description *</Label>
        <Textarea
          id="edit-textDescription"
          name="textDescription"
          value={formData.textDescription}
          onChange={handleInputChange}
          placeholder="Enter a brief description"
          rows={3}
          className={errors.textDescription ? 'border-red-500' : ''}
        />
        {errors.textDescription && (
          <p className="text-sm text-red-500">{errors.textDescription}</p>
        )}
      </div>

      {/* HTML Description */}
      <div className="space-y-2">
        <Label htmlFor="edit-htmlDescription">HTML Description (Optional)</Label>
        <Textarea
          id="edit-htmlDescription"
          name="htmlDescription"
          value={formData.htmlDescription}
          onChange={handleInputChange}
          placeholder="Enter HTML formatted description"
          rows={4}
        />
        <p className="text-xs text-gray-500">
          You can use HTML tags like &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;br&gt; etc.
        </p>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Product Image (Optional)</Label>
        
        {imagePreview ? (
          <Card className="relative">
            <CardContent className="p-4">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeImage}
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <Label htmlFor="edit-image" className="cursor-pointer">
              <span className="text-sm text-gray-600">
                Click to upload an image or drag and drop
              </span>
            </Label>
            <Input
              id="edit-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? 'Updating...' : 'Update Product Line'}
        </Button>
      </div>
    </div>
  );
};

export default EditProductLine;