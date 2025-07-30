const Post = require('../../models/posts')
const PostsTags = require('../../models/PostsTags')
const Tag = require('../../models/Tags')
const { buildPostAggregationPipeline } = require('../../utils/aggregationPipelines')

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Post Search Service - Search and filtering operations
 * Handles tag-based search and text-based search functionality
 */

/**
 * Search posts by tags with pagination
 */
const searchPostsByTags = async (tags, limit = 10, offset = 0, currentUserId = null) => {
  if (!tags || tags.length === 0) return []

  // Find tags that match the search terms (case insensitive)
  const matchingTags = await Tag.find({
    name: { $in: tags.map((tag) => {
      const trimmed = tag.trim()
      if (trimmed.length > 100) return null
      return new RegExp(escapeRegex(trimmed), 'i')
    }).filter(Boolean) },
  })

  if (matchingTags.length === 0) return []

  // Find post-tag associations for matching tags
  const postTagRecords = await PostsTags.find({
    tagId: { $in: matchingTags.map((tag) => tag._id) },
  })

  // Get unique post IDs
  const postIds = [...new Set(postTagRecords.map((record) => record.postId))]

  if (postIds.length === 0) return []

  // Use aggregation pipeline with post IDs filter
  const pipeline = buildPostAggregationPipeline(
    { _id: { $in: postIds } },
    currentUserId,
    { limit, offset }
  );

  return await Post.aggregate(pipeline);
}

/**
 * Basic text search across post content with pagination
 */
const basicSearch = async (searchTerm, limit = 10, offset = 0, currentUserId = null) => {
  if (!searchTerm || !searchTerm.trim()) return []

  const trimmed = searchTerm.trim()
  if (trimmed.length > 500) return []

  const escapedTerm = escapeRegex(trimmed)
  
  // Create text search filter
  const searchFilter = {
    $or: [
      { title: { $regex: escapedTerm, $options: 'i' } },
      { content: { $regex: escapedTerm, $options: 'i' } },
      { placeName: { $regex: escapedTerm, $options: 'i' } },
      { location: { $regex: escapedTerm, $options: 'i' } },
    ],
  }

  // Use aggregation pipeline with search filter
  const pipeline = buildPostAggregationPipeline(
    searchFilter,
    currentUserId,
    { limit, offset }
  )

  return await Post.aggregate(pipeline)
}

module.exports = {
  searchPostsByTags,
  basicSearch,
}