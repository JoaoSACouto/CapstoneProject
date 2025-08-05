import { useState } from 'react'
import { updateProfile } from 'firebase/auth'
import { auth } from '../utils/firebase'
import { showSuccessToast, showErrorToast } from '../utils/toast'
import { getApiUrl } from '../utils/config'
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice'

export const useUpdateProfilePic = () => {
  const [isUploading, setIsUploading] = useState(false)
  const dispatch = useDispatch()

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Please select a valid image file (JPG, PNG, or WebP)')
    }

    if (file.size > maxSize) {
      throw new Error('Image size must be less than 5MB')
    }

    return true
  }

  const updateProfilePicture = async (file) => {
    if (!auth.currentUser) {
      throw new Error('User not authenticated')
    }

    setIsUploading(true)

    try {
      // Validate file
      validateFile(file)

      // Upload to server (Cloudinary) - using existing image upload route
      const formData = new FormData()
      formData.append('image', file)
      
      const response = await fetch(getApiUrl('/api/upload-image'), {
        method: 'POST',
        body: formData,
      })

      console.log('Upload response status:', response.status);
      console.log('Upload response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json()
      console.log('Upload response data:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Upload failed')
      }

      // Use the desktop URL from the image upload response
      const photoURL = data.urls.desktop

      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        photoURL: photoURL
      })

      // Immediately update Redux store with new photoURL
      const currentUser = auth.currentUser
      dispatch(addUser({
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL, // This should now be the new URL
      }))

      // The useAuthChange hook will also sync this to the database
      // but we've already updated the UI immediately

      showSuccessToast('Profile picture updated successfully!')
      
      return photoURL
    } catch (error) {
      console.error('Error updating profile picture:', error)
      showErrorToast(error.message || 'Failed to update profile picture')
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  return {
    updateProfilePicture,
    isUploading
  }
} 