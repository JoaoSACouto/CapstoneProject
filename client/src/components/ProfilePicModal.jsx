import { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { X, Upload, Loader2 } from 'lucide-react'
import { useUpdateProfilePic } from '../hooks/useUpdateProfilePic'

const ProfilePicModal = ({ isOpen, onClose, onUpdate }) => {
  const user = useSelector((state) => state.user.data)
  const fileInputRef = useRef(null)
  const { updateProfilePicture, isUploading } = useUpdateProfilePic()
  
  const defaultAvatar = "https://img.daisyui.com/images/profile/demo/1@94.webp"
  const currentAvatarUrl = user?.photoURL || defaultAvatar

  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      const newPhotoURL = await updateProfilePicture(file)
      onUpdate?.(newPhotoURL)
      onClose()
    } catch (error) {
      // Error is already handled in the hook
      console.error('Failed to update profile picture:', error)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-[2px] bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Profile Picture
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isUploading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Current Profile Picture */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 shadow-lg border-4 border-gray-200">
                <img
                  src={currentAvatarUrl}
                  alt="Current Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('ProfilePicModal - Image failed to load, using default')
                    e.target.src = defaultAvatar
                  }}
                />
              </div>
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>
            
            <p className="text-gray-600 text-center text-sm">
              Click the button below to change your profile picture
            </p>
          </div>

          {/* File Input (hidden) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Change Profile Picture Button */}
          <div className="mt-6">
            <button
              onClick={handleButtonClick}
              disabled={isUploading}
              className="w-full btn btn-primary flex items-center justify-center space-x-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Change Profile Picture</span>
                </>
              )}
            </button>
          </div>

          {/* File Requirements */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Supported formats:</strong> JPG, PNG, WebP<br />
              <strong>Maximum size:</strong> 5MB
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePicModal 