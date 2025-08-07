// Import necessary libraries and components
import { useSelector } from "react-redux";
import { useState } from "react";
import { useMyPosts } from "../hooks/useMyPosts";
import { useMyWantToGoPosts } from "../hooks/useMyWantToGoPosts";
import Hero from "./Hero";
import heroImage from "../assets/img/profile_hero1.webp";
import { useNavbar } from "../hooks/useNavbar";
import ErrorMessage from "./ErrorMessage";
import { useNavigate } from "react-router-dom";
import { useDeletePost } from "../hooks/useDeletePost";
import { useWantToGoPost } from "../hooks/postActions/useWantToGoPost";
import { Edit, Trash, Loader2 } from "lucide-react";
import ConfirmDialog from "../components/ConfirmDialog";
import { useConfirmDialog } from "../hooks/useConfirmDialog";
import ProfileAvatar from "./ProfileAvatar";
import ProfilePicModal from "./ProfilePicModal";

const Profile = () => {
    const { wantToGoPost, loading: toggleLoading } = useWantToGoPost();
    const { handleSignOut } = useNavbar();
    const user = useSelector((state) => state.user.data);
    const authInitialized = useSelector((state) => state.user.authInitialized);
    const { confirmDelete, dialogProps } = useConfirmDialog();

    // Profile picture modal state
    const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);

    // My posts
    const {
        posts: myPosts,
        loading: myPostsLoading,
        error: myPostsError,
        refetch: refetchMyPosts,
    } = useMyPosts();

    // Going list
    const {
        goingList,
        loading: goingLoading,
        error: goingError,
        refetch: refetchGoingList,
    } = useMyWantToGoPosts();

    const { deletePost } = useDeletePost();
    const navigate = useNavigate();

    const handlePostCreated = () => {
        navigate("/create", { state: { from: "profile" } });
    };

    const handleAvatarClick = () => {
        setIsProfilePicModalOpen(true);
    };

    const handleProfilePicModalClose = () => {
        setIsProfilePicModalOpen(false);
    };

    const handleProfilePicUpdate = (newPhotoURL) => {
        // The profile picture will be automatically updated in the UI
        // through the Redux store when Firebase Auth updates
    };

    const handleRemove = async (postId) => {
        const confirmed = await confirmDelete(
            "Do you want to remove this post from your Want to Go list?",
            {
                type: "remove",
                title: "Remove Post",
                confirmText: "Remove",
                cancelText: "Keep Post",
            }
        );
        if (!confirmed) return;

        try {
            await wantToGoPost({ variables: { postId } });
            await refetchGoingList({ fetchPolicy: "network-only" });
        } catch (error) {
            console.error("Failed to remove from Want to Go list:", error);
        }
    };

    const handleDelete = async (postId) => {
        const confirmed = await confirmDelete(
            "Are you sure you want to delete this post?",
            {
                type: "delete",
                title: "Delete Post",
                confirmText: "Delete",
                cancelText: "Cancel",
            }
        );
        if (!confirmed) return;

        try {
            await deletePost(postId);
            await refetchMyPosts({ fetchPolicy: "network-only" });
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    if (!authInitialized) {
        return <div>Loading authentication...</div>;
    }

    return (
        <div className="min-h-screen">
            <ConfirmDialog {...dialogProps} loading={toggleLoading} />
            <ProfilePicModal
                isOpen={isProfilePicModalOpen}
                onClose={handleProfilePicModalClose}
                onUpdate={handleProfilePicUpdate}
            />
            <main className="flex-1">
                {/* Hero Section */}
                <Hero
                    heroImage={heroImage}
                    title="Rest JAM Profile"
                    description=""
                    showButton={false}
                    className="h-[200px] md:h-[240px] lg:h-[280px]"
                />

                {/* Profile Stats */}
                <div className="mt-6 mb-10 bg-white shadow-md rounded-xl p-6 text-center">
                    <h2 className="text-xl md:text-2xl font-semibold mb-6">
                        Hello, {user?.displayName || "Guest"}!
                    </h2>

                    <div className="flex flex-col md:flex-row justify-center items-center w-full text-center gap-6">
                        {/* Total Posts */}
                        <div className="min-w-[100px]">
                            <div className="text-gray-500 text-sm">
                                Total posts
                            </div>
                            <div className="text-3xl md:text-4xl font-semibold">
                                {myPosts.length}
                            </div>
                        </div>

                        {/* Avatar */}
                        <div>
                            <ProfileAvatar
                                onClick={handleAvatarClick}
                                className="h-24 w-24 md:h-32 md:w-32"
                            />
                        </div>

                        {/* Total Want to Go */}
                        <div className="min-w-[100px]">
                            <div className="text-gray-500 text-sm">
                                Total want to go
                            </div>
                            <div className="text-3xl md:text-4xl font-semibold">
                                {goingList.length}
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="mt-6 flex flex-col items-center space-y-2">
                        <button
                            onClick={handleSignOut}
                            className="text-purple-600 cursor-pointer font-medium underline flex items-center space-x-1"
                        >
                            <span>👤</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Post List */}
                <section className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">My Posts</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                        Here are the lists of all the recommendations you
                        posted.
                    </p>

                    {myPostsLoading ? (
                        <div className="text-gray-500">Loading posts...</div>
                    ) : myPostsError ? (
                        <ErrorMessage
                            error={myPostsError}
                            onRetry={refetchMyPosts}
                        />
                    ) : (
                        <div className="overflow-x-auto w-full">
                            <table className="w-7/8 mx-auto text-xs sm:text-sm text-left bg-white shadow-md rounded-xl">
                                <thead className="text-gray-700 uppercase bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3">ID</th>
                                        <th className="px-4 py-3">
                                            Restaurant
                                        </th>
                                        <th className="px-4 py-3 hidden md:table-cell">
                                            Address
                                        </th>
                                        <th className="px-4 py-3 hidden lg:table-cell">
                                            Date
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myPosts.length > 0 ? (
                                        myPosts.map((post, index) => (
                                            <tr
                                                key={post.id}
                                                onClick={() =>
                                                    navigate(post.url)
                                                }
                                                className="cursor-pointer odd:bg-gray-50 even:bg-gray-100 hover:bg-gray-200 transition"
                                            >
                                                <td className="px-4 py-3 font-semibold">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-3 font-semibold">
                                                    {post.title}
                                                </td>
                                                <td className="px-4 py-3 font-semibold hidden md:table-cell">
                                                    {post.location}
                                                </td>
                                                <td className="px-4 py-3 text-gray-500 font-semibold hidden lg:table-cell">
                                                    {
                                                        new Date(post.createdAt)
                                                            .toISOString()
                                                            .split("T")[0]
                                                    }
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex flex-wrap gap-2 justify-end">
                                                        <button
                                                            className="cursor-pointer bg-gray-700 hover:bg-gray-800 text-white text-xs px-3 py-1 rounded-2xl"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(
                                                                    `/edit/${post.id}`
                                                                );
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="cursor-pointer bg-red-700 hover:bg-red-800 text-white text-xs px-3 py-1 rounded-2xl hidden md:inline-block"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(
                                                                    post.id
                                                                );
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-4 py-8 text-center text-gray-500"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <p>
                                                        You haven’t posted
                                                        anything yet.
                                                    </p>
                                                    <button
                                                        onClick={
                                                            handlePostCreated
                                                        }
                                                        className="cursor-pointer bg-primary text-white text-sm px-4 py-2 rounded-xl"
                                                    >
                                                        Share Your Experience
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* Going List */}
                <section className="mt-10">
                    <h3 className="text-lg font-semibold">Going List</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                        Here are the lists of all the restaurants or places you
                        marked as want to go.
                    </p>

                    {goingLoading ? (
                        <div className="text-gray-500">Loading...</div>
                    ) : goingError ? (
                        <ErrorMessage error={goingError} />
                    ) : goingList.length === 0 ? (
                        <p className="text-gray-500">
                            No items in your going list.
                        </p>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-7/8 mx-auto text-xs sm:text-sm text-left bg-white shadow-md rounded-xl">
                                <thead className="text-gray-700 uppercase bg-gray-100">
  <tr>
    {/* ID - hidden below xl */}
    <th className="px-2 py-2 text-center hidden xl:table-cell">ID</th>

    {/* User info - hidden below xl */}
    <th className="px-2 py-2 text-left hidden xl:table-cell">User</th>

    {/* Title - always visible */}
    <th className="px-2 py-2 text-left text-xs sm:text-sm">Title</th>

    {/* Address - hidden below 1060px */}
    <th className="px-2 py-2 text-left hidden xl:table-cell max-[1060px]:hidden">
      Address
    </th>

    {/* Action */}
    <th className="px-2 py-2 text-right text-xs sm:text-sm">Action</th>
  </tr>
</thead>

<tbody>
  {goingList.map((item, index) => (
    <tr
      key={item.id}
      onClick={() => navigate(item.url)}
      className="cursor-pointer odd:bg-gray-50 even:bg-gray-100 hover:bg-gray-200 transition"
    >
      {/* ID */}
      <td className="px-2 py-2 text-center hidden xl:table-cell text-xs">
        {index + 1}
      </td>

      {/* User */}
      <td className="px-2 py-2 hidden xl:table-cell text-xs">
        <div className="flex items-center gap-2">
          <img
            src={
              item.author?.photoURL ||
              "https://img.daisyui.com/images/profile/demo/1@94.webp"
            }
            alt="User"
            className="h-6 w-6 rounded-full object-cover"
          />
          <span className="truncate">{item.author?.displayName || "User"}</span>
        </div>
      </td>

      {/* Title */}
      <td className="px-2 py-2 truncate text-xs sm:text-sm">{item.title}</td>

      {/* Address */}
      <td className="px-2 py-2 text-gray-600 truncate hidden xl:table-cell max-[1060px]:hidden text-xs">
        {item.location}
      </td>

      {/* Action */}
      <td className="px-2 py-2 text-right">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRemove(item.id);
          }}
          className="bg-yellow-600 hover:bg-yellow-700 text-white text-[10px] px-3 py-1 rounded-full"
        >
          Remove
        </button>
      </td>
    </tr>
  ))}
</tbody>

                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden w-11/12 mx-auto rounded-lg bg-white shadow-md overflow-hidden">
                                <div className="bg-gray-100 text-gray-700 uppercase text-xs px-4 py-2 font-semibold">
                                    Going List
                                </div>

                                {goingList.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col p-3 odd:bg-gray-50 even:bg-gray-100 text-xs gap-y-1"
                                        onClick={() => navigate(item.url)}
                                    >
                                        {/* Row 1 */}
                                        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-y-1">
                                            <span className="font-bold text-[11px]">
                                                #{index + 1}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemove(item.id);
                                                }}
                                                className="bg-yellow-600 hover:bg-yellow-700 text-white text-[10px] px-3 py-1 rounded-full"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        {/* Row 2: Title and Location */}
                                        <div className="flex flex-col">
                                            <p className="text-[11px] font-semibold truncate break-words">
                                                {item.title}
                                            </p>
                                            <p className="text-[10px] text-gray-600 truncate break-words">
                                                {item.location}
                                            </p>
                                        </div>

                                        {/* Row 3: User */}
                                        <div className="flex items-center gap-2 mt-1">
                                            <img
                                                src={
                                                    item.author?.photoURL ||
                                                    "https://img.daisyui.com/images/profile/demo/1@94.webp"
                                                }
                                                alt="User"
                                                className="h-5 w-5 rounded-full object-cover shrink-0"
                                            />
                                            <span className="text-[10px] text-gray-700 truncate break-words">
                                                {item.author?.displayName ||
                                                    "User"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Profile;
