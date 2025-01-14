// Step1.js
import React from 'react';
import { Upload } from 'lucide-react';

const Step1 = ({ formData, handleFileChange }) => {
  const renderFilePreview = (file) => {
    if (!file) return null;
    
    const fileUrl = URL.createObjectURL(file);
    const fileType = file.type.split('/')[0]; // Get the file type (image, application, etc.)
    
    if (fileType === 'image') {
      return <img src={fileUrl} alt="Uploaded" className="mt-2 w-24 h-24 rounded-full object-cover mx-auto" />;
    }

    if (fileType === 'application') {
      return (
        <div className="mt-2 text-center">
          <a href={fileUrl} download={file.name} className="text-blue-600 hover:text-blue-700">
            Download {file.name}
          </a>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'profileImage')}
            className="hidden"
            id="profileImage"
          />
          <label htmlFor="profileImage" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            {formData.profileImage ? (
              <img
                src={URL.createObjectURL(formData.profileImage)}
                alt="Profile"
                className="mt-2 w-24 h-24 rounded-full object-cover mx-auto"
              />
            ) : (
              <span className="mt-2 block text-sm text-gray-600">Click to upload profile image</span>
            )}
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">ID Proof (PDF)</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange(e, 'idProof')}
            className="hidden"
            id="idProof"
          />
          <label htmlFor="idProof" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm text-gray-600">Click to upload ID proof</span>
          </label>
          {renderFilePreview(formData.idProof)}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Degree Proof (PDF)</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange(e, 'degreeProof')}
            className="hidden"
            id="degreeProof"
          />
          <label htmlFor="degreeProof" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm text-gray-600">Click to upload degree proof</span>
          </label>
          {renderFilePreview(formData.degreeProof)}
        </div>
      </div>
    </div>
  );
};

export default Step1;
