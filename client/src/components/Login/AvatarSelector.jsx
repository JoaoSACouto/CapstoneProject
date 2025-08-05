import { useState, useEffect } from 'react'
import { AUTH_CONFIG } from '../../utils/constants/auth'

const AvatarSelector = ({ selectedAvatar, onAvatarSelect, className = '' }) => {
  const [loadedImages, setLoadedImages] = useState(new Set())
  const [imageErrors, setImageErrors] = useState(new Set())

  // Generate avatar options (using first 20 from the available 70)
  const avatarOptions = Array.from({ length: 20 }, (_, i) => i + 1)

  const getAvatarUrl = (id) => `${AUTH_CONFIG.avatarBaseUrl}${id}`

  const handleImageLoad = (id) => {
    setLoadedImages(prev => new Set([...prev, id]))
  }

  const handleImageError = (id) => {
    setImageErrors(prev => new Set([...prev, id]))
  }

  const handleAvatarClick = (id) => {
    const avatarUrl = getAvatarUrl(id)
    onAvatarSelect(avatarUrl)
  }

  // Set default avatar if none selected
  useEffect(() => {
    if (!selectedAvatar && avatarOptions.length > 0) {
      onAvatarSelect(getAvatarUrl(1))
    }
  }, [selectedAvatar, onAvatarSelect])

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-900 mb-3">
        Choose Your Avatar
        <span className="text-pink-600" aria-label="required">
          *
        </span>
      </label>
      
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {avatarOptions.map((id) => {
          const avatarUrl = getAvatarUrl(id)
          const isSelected = selectedAvatar === avatarUrl
          const isLoaded = loadedImages.has(id)
          const hasError = imageErrors.has(id)
          
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleAvatarClick(id)}
              className={`
                relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                ${isSelected 
                  ? 'border-indigo-600 ring-2 ring-indigo-600 ring-offset-2' 
                  : 'border-gray-300 hover:border-indigo-400'
                }
                ${!isLoaded && !hasError ? 'bg-gray-100' : ''}
                ${hasError ? 'bg-gray-200' : ''}
              `}
              disabled={hasError}
              aria-label={`Select avatar ${id}`}
              aria-pressed={isSelected}
            >
              {!hasError && (
                <img
                  src={avatarUrl}
                  alt={`Avatar option ${id}`}
                  className={`w-full h-full object-cover transition-opacity duration-200 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => handleImageLoad(id)}
                  onError={() => handleImageError(id)}
                  loading="lazy"
                />
              )}
              
              {/* Loading indicator */}
              {!isLoaded && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {/* Error indicator */}
              {hasError && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              )}
              
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute inset-0 bg-indigo-600 bg-opacity-20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>
      
      {/* Selected avatar preview */}
      {selectedAvatar && (
        <div className="mt-4 flex items-center space-x-3">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-indigo-600">
            <img
              src={selectedAvatar}
              alt="Selected avatar preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium">Selected Avatar</p>
            <p className="text-xs">This will be your profile picture</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AvatarSelector