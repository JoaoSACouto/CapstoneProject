// Import necessary libraries and components
import { useSelector } from "react-redux";
import { useMyPosts } from "../hooks/useMyPosts";
import { useMyWantToGoPosts } from "../hooks/useMyWantToGoPosts";
import Hero from "./Hero";
import heroImage from "../assets/img/profile_hero1.webp";
import { useNavbar } from "../hooks/useNavbar";
import ErrorMessage from "./ErrorMessage";
import { useNavigate } from "react-router-dom";
import { useDeletePost } from "../hooks/useDeletePost";
import { useWantToGoPost } from "../hooks/postActions/useWantToGoPost";

const Profile = () => {
    const { wantToGoPost, loading: toggleLoading } = useWantToGoPost();
    const { handleSignOut } = useNavbar();
    const user = useSelector((state) => state.user.data);
    const authInitialized = useSelector((state) => state.user.authInitialized);

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
    } = useMyWantToGoPosts();

    const { deletePost } = useDeletePost();
    const navigate = useNavigate();

    const handlePostCreated = () => {
        navigate("/create", { state: { from: "profile" } });
    };

    const handleRemove = async (postId) => {
        try {
            await wantToGoPost({ variables: { postId } });
            await refetchMyPosts({ fetchPolicy: "network-only" }); 
        } catch (error) {
            console.error("Failed to remove from want-to-go list:", error);
        }
    };

    const handleDelete = async (postId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this post?"
        );
        if (!confirmed) return;

        try {
            await deletePost(postId);
            alert("Post deleted successfully!");
            refetchMyPosts({ fetchPolicy: "network-only" });
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete the post.");
        }
    };

    if (!authInitialized) {
        return <div>Loading authentication...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
            <main className="flex-1">
                {/* Hero Section */}
                <Hero
                    heroImage={heroImage}
                    title="Rest Jam Profile"
                    description=""
                    showButton={false}
                    className="h-[200px] md:h-[240px] lg:h-[280px]"
                />

                {/* Profile Stats */}
                <div className="mt-6 mb-10 bg-white shadow-md rounded-xl p-6 text-center">
                    <h2 className="text-xl md:text-2xl font-bold mb-6">
                        Hello, {user?.displayName || "Guest"}!
                    </h2>

                    <div className="flex flex-col md:flex-row justify-center items-center w-full text-center gap-6">
                        {/* Total Posts */}
                        <div className="min-w-[100px]">
                            <div className="text-gray-500 text-sm">
                                Total posts
                            </div>
                            <div className="text-3xl md:text-4xl font-bold">
                                {myPosts.length}
                            </div>
                        </div>

                        {/* Avatar */}
                        <div>
                            <img
                                src={
                                    user?.photoURL ||
                                    "https://img.daisyui.com/images/profile/demo/2@94.webp"
                                }
                                alt="Profile"
                                className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md"
                            />
                        </div>

                        {/* Total Want to Go */}
                        <div className="min-w-[100px]">
                            <div className="text-gray-500 text-sm">
                                Total want to go
                            </div>
                            <div className="text-3xl md:text-4xl font-bold">
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
                                                <td className="px-4 py-3 font-bold">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-3 font-bold">
                                                    {post.title}
                                                </td>
                                                <td className="px-4 py-3 font-bold hidden md:table-cell">
                                                    {post.location}
                                                </td>
                                                <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">
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
                                                        className="bg-purple-700 hover:bg-purple-800 text-white text-sm px-4 py-2 rounded-xl"
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
                                <table className="table-auto bg-white  rounded-xl text-sm w-7/8 mx-auto border-gray-200 shadow-md overflow-x-auto">
                                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                                        <tr>
                                            <th className="px-3 py-2 text-center">
                                                ID
                                            </th>
                                            <th className="px-3 py-2 text-left">
                                                User
                                            </th>
                                            <th className="px-3 py-2  text-left">
                                                Title
                                            </th>
                                            <th className="px-3 py-2  text-left">
                                                Address
                                            </th>
                                            <th className="px-3 py-2 text-right">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {goingList.map((item, index) => (
                                            <tr
                                                key={item.id}
                                                onClick={() =>
                                                    navigate(item.url)
                                                }
                                                className="cursor-pointer odd:bg-gray-50 even:bg-gray-100 hover:bg-gray-200 transition"
                                            >
                                                <td className="px-3 py-2 text-center">
                                                    {index + 1}
                                                </td>

                                                {/* User Column */}
                                                <td className="px-3 py-2 flex items-center gap-3">
                                                    <img
                                                        src={
                                                            item.author
                                                                ?.photoURL ||
                                                            "https://img.daisyui.com/images/profile/demo/1@94.webp"
                                                        }
                                                        alt={
                                                            item.author
                                                                ?.displayName ||
                                                            "User"
                                                        }
                                                        className="h-8 w-8 rounded-full object-cover"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-medium truncate">
                                                            {item.author
                                                                ?.displayName ||
                                                                "Unknown User"}
                                                        </span>
                                                    </div>
                                                </td>
                                                {console.log(
                                                    item.author.firstName,
                                                    item.author.lastName
                                                )}
                                                {/* Title */}
                                                <td className="px-3 py-2 font-semibold truncate">
                                                    {item.title}
                                                </td>

                                                {/* Address */}
                                                <td className="px-3 py-2 text-gray-600 truncate">
                                                    {item.location}
                                                </td>

                                                {/* Action */}
                                                <td className="px-3 py-2 text-right">
                                                    <button
                                                        onClick={() =>
                                                            handleRemove(
                                                                item.id
                                                            )
                                                        }
                                                        disabled={toggleLoading}
                                                        className={`cursor-pointer bg-red-700 hover:bg-red-800${
                                                            toggleLoading
                                                                ? "bg-gray-400 cursor-not-allowed"
                                                                : "bg-red-600 hover:bg-red-700"
                                                        } text-white text-xs px-3 py-1 rounded-full`}
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
                            <div className="md:hidden rounded-lg bg-white shadow-md w-7/8 mx-auto">
                                {/* Header for mobile */}
                                <div className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold px-4 py-2 flex justify-between">
                                    <span className="w-1/4">ID</span>
                                    <span className="w-2/4 text-center">
                                        Title
                                    </span>
                                    <span className="w-1/4 text-right">
                                        Action
                                    </span>
                                </div>

                                {/* Card rows */}
                                {goingList.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-center p-4 odd:bg-gray-50 even:bg-gray-200"
                                        onClick={() => navigate(item.url)}
                                    >
                                        <div className="w-3/4">
                                            <p className="text-sm font-bold">
                                                {index + 1}
                                            </p>
                                        </div>
                                        <div className="w-3/4">
                                            <p className="text-sm font-semibold truncate">
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-gray-600 truncate">
                                                {item.location}
                                            </p>
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
