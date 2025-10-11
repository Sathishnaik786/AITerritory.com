import React, { useState, useRef } from 'react';
import { Card, CardContent } from '../../../src/components/ui/card';
import { Button } from '../../../src/components/ui/button';
import { useToast } from '../../../src/hooks/use-toast';
import { uploadImageToSupabase } from '../../../src/lib/supabaseClient';

export default function ImageUploadTest() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImageToSupabase(file);
      if (url) {
        setImageUrl(url);
        toast({
          title: 'Success',
          description: 'Image uploaded successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to upload image',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6">Image Upload Test</h2>
          
          <div className="space-y-4">
            <div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </Button>
            </div>
            
            {imageUrl && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Uploaded Image Preview:</h3>
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-64 h-64 object-cover rounded-lg border"
                />
                <p className="mt-2 text-sm text-gray-600 break-all">{imageUrl}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}