import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent} from '@/components/ui/card';
import {Upload, X} from 'lucide-react';

const AddProductLine = ({onSubmit, onCancel}) => {
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
        const {name, value} = e.target;
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();

            // Create a productLine object
            const productLineData = {
                productLine: formData.productLine,
                textDescription: formData.textDescription,
                htmlDescription: formData.htmlDescription || ''
            };

            // Add as JSON blob for the 'data' part
            formDataToSend.append('data', new Blob([JSON.stringify(productLineData)], {
                type: 'application/json'
            }));

            // Add image if present
            if (formData.image) {
                if (formData.image instanceof File) {
                    formDataToSend.append('image', formData.image);
                } else if (typeof formData.image === 'string') {
                    const blob = await fetch(formData.image).then(res => res.blob());
                    formDataToSend.append('image', blob, 'product-image.jpg');
                }
            }

            await onSubmit(formDataToSend);

            // Reset form
            setFormData({
                productLine: '',
                textDescription: '',
                htmlDescription: '',
                image: null
            });
            setImagePreview('');
        } catch (error) {
            console.error('Error adding product line:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Product Line Name */}
            <div className="space-y-2">
                <Label htmlFor="productLine" className="text-gray-900 dark:text-gray-100">Product Line Name *</Label>
                <Input
                    id="productLine"
                    name="productLine"
                    value={formData.productLine}
                    onChange={handleInputChange}
                    placeholder="Enter product line name"
                    className={`${errors.productLine ? 'border-red-500' : ''} bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white`}
                />
                {errors.productLine && (
                    <p className="text-sm text-red-500 dark:text-red-400">{errors.productLine}</p>
                )}
            </div>

            {/* Text Description */}
            <div className="space-y-2">
                <Label htmlFor="textDescription" className="text-gray-900 dark:text-gray-100">Text Description *</Label>
                <Textarea
                    id="textDescription"
                    name="textDescription"
                    value={formData.textDescription}
                    onChange={handleInputChange}
                    placeholder="Enter a brief description"
                    rows={3}
                    className={`${errors.textDescription ? 'border-red-500' : ''} bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white`}
                />
                {errors.textDescription && (
                    <p className="text-sm text-red-500 dark:text-red-400">{errors.textDescription}</p>
                )}
            </div>

            {/* HTML Description */}
            <div className="space-y-2">
                <Label htmlFor="htmlDescription" className="text-gray-900 dark:text-gray-100">HTML Description
                    (Optional)</Label>
                <Textarea
                    id="htmlDescription"
                    name="htmlDescription"
                    value={formData.htmlDescription}
                    onChange={handleInputChange}
                    placeholder="Enter HTML formatted description (e.g., <p>Description with <strong>bold</strong> text</p>)"
                    rows={4}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
                <Label className="text-gray-900 dark:text-gray-100">Product Image (Optional)</Label>

                {imagePreview ? (
                    <Card className="relative bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
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
                                    <X className="w-4 h-4"/>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors bg-white dark:bg-gray-800">
                        <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2"/>
                        <Label htmlFor="image" className="cursor-pointer">
              <span className="text-sm text-gray-600 dark:text-gray-400">
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
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                    {isSubmitting ? 'Adding...' : 'Add Product Line'}
                </Button>
            </div>
        </div>
    );
};

export default AddProductLine;