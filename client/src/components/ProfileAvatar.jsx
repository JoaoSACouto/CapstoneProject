import { useSelector } from 'react-redux'

const ProfileAvatar = ({ onClick, className = '' }) => {
  const user = useSelector((state) => state.user.data)
  
  // Use a more reliable default avatar
  const defaultAvatar = "https://img.daisyui.com/images/profile/demo/1@94.webp"
  const avatarUrl = user?.photoURL || defaultAvatar

  return (
    <div 
      className={`relative cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {/* Simple image structure like the working test image */}
      <img
        src={avatarUrl}
        alt="Profile"
        className="w-full h-full rounded-full object-cover shadow-md transition-all duration-200 group-hover:shadow-lg group-hover:scale-105"
        onError={(e) => {
          e.target.src = defaultAvatar
        }}
      />
      
      {/* Overlay on hover - only visible on hover */}
      <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-20 transition-all duration-200 flex items-center justify-center pointer-events-none">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-xs font-medium pointer-events-auto">
          Change
        </div>
      </div>
    </div>
  )
}

export default ProfileAvatar 