import { useLazyQuery } from '@apollo/client'
import { useState } from 'react'
import { SEARCH_POSTS_BY_TAGS } from '../../utils/graphql/post'
import { POST_QUERY_CONFIG } from '../../utils/constants/posts'

export const useSearchPostsByTags = () => {
  const [searchResults, setSearchResults] = useState(null)
  const [
    executeSearch,
    { data, loading, error, called, fetchMore, networkStatus },
  ] = useLazyQuery(SEARCH_POSTS_BY_TAGS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.error('SEARCH_POSTS_BY_TAGS error:', error)
    },
    onCompleted: (data) => {
      setSearchResults(data)
    },
  })

  const searchByTags = (tags, options = {}) => {
    const { limit = POST_QUERY_CONFIG.DEFAULT_LIMIT, offset = 0 } = options

    if (!tags || tags.length === 0) {
      setSearchResults(null)
      return
    }

    const variables = {
      tags: tags.map((tag) => tag.trim()).filter(Boolean),
      limit,
      offset,
    }

    return executeSearch({ variables })
  }

  const loadMoreResults = (currentTags, currentOptions = {}) => {
    if (!data?.searchPostsByTags) return

    const currentLength = data.searchPostsByTags.length
    const { limit = POST_QUERY_CONFIG.DEFAULT_LIMIT } = currentOptions

    return fetchMore({
      variables: {
        tags: currentTags.map((tag) => tag.trim()).filter(Boolean),
        limit,
        offset: currentLength,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousResult

        return {
          searchPostsByTags: [
            ...(previousResult.searchPostsByTags || []),
            ...(fetchMoreResult.searchPostsByTags || []),
          ],
        }
      },
    })
  }

  const posts = searchResults?.searchPostsByTags || []
  const isLoadingMore = networkStatus === 3
  const hasMoreResults = posts.length > 0 && posts.length % POST_QUERY_CONFIG.DEFAULT_LIMIT === 0

  return {
    searchByTags,
    loadMoreResults,
    posts,
    loading,
    error,
    called,
    hasSearched: called,
    isLoadingMore,
    hasMoreResults,
    showLoadMoreButton: posts.length > 0 && hasMoreResults,
  }
}
