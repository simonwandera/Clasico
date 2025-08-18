import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';

const AddProductLine = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    productLine: '',
    textDescription: '',
    htmlDescription: '',
    image: ''
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // In a real app, you'd upload to a server or cloud storage
      // For now, we'll use a URL or base64 representation
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          image: reader.result // In real app, this would be the uploaded file URL
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

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  setIsSubmitting(true);
  
  try {
    // Create FormData object
    const formDataToSend = new FormData();
    
    // Append all form fields
    Object.entries(formData).forEach(([key, value]) => {
      // For file inputs, append the file directly
      if (key === 'image' && value instanceof File) {
        formDataToSend.append(key, value);
      } 
      // For other fields, append as strings
      else if (value !== null && value !== undefined) {
        formDataToSend.append(key, String(value));
      }
    });

    // Call your API with the FormData
    await onSubmit(formDataToSend); // This will call addProductLine
    
    // Reset form
    setFormData({
      productLine: '',
      textDescription: '',
      htmlDescription: '',
      image: null // Changed to null for file reset
    });
    setImagePreview('');
  } catch (error) {
    console.error('Error adding product line:', error);
    // You might want to set an error state here
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div className="space-y-6">
      {/* Product Line Name */}
      <div className="space-y-2">
        <Label htmlFor="productLine">Product Line Name *</Label>
        <Input
          id="productLine"
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
        <Label htmlFor="textDescription">Text Description *</Label>
        <Textarea
          id="textDescription"
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
        <Label htmlFor="htmlDescription">HTML Description (Optional)</Label>
        <Textarea
          id="htmlDescription"
          name="htmlDescription"
          value={formData.htmlDescription}
          onChange={handleInputChange}
          placeholder="Enter HTML formatted description (e.g., <p>Description with <strong>bold</strong> text</p>)"
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
            <Label htmlFor="image" className="cursor-pointer">
              <span className="text-sm text-gray-600">
                Click to upload an image or drag and drop
              </span>
            </Label>
            <Input
              id="image"
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
          {isSubmitting ? 'Adding...' : 'Add Product Line'}
        </Button>
      </div>
    </div>
  );
};

export default AddProductLine;