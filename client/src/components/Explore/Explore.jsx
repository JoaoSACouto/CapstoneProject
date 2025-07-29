import Hero from '../Hero'
import ExploreHeader from './ExploreHeader'
import ExploreResults from './ExploreResults'
import { useExplore } from '../../hooks'
import heroImage from '../../assets/img/explore_hero1.webp'
import { UI_TEXT } from '../../utils/constants/ui'

const Explore = () => {
  const exploreData = useExplore()

  const handleRetry = () => {
    const {
      hasActiveSearch,
      searchType,
      searchPosts,
      searchTerm,
      tags,
      navigate,
    } = exploreData
    if (!hasActiveSearch) return

    if (searchType === 'text') {
      searchPosts(searchTerm)
    } else if (searchType === 'tags' && tags.length > 0) {
      const params = new URLSearchParams()
      params.set('tags', tags.join(','))
      navigate(`/explore?${params.toString()}`, { replace: true })
    }
  }

  // Handle form search with full parameters
  const handleFormSearch = (searchParams) => {
    const params = new URLSearchParams()
    if (searchParams.searchTerm) params.set("q", searchParams.searchTerm)
    if (searchParams.tags.length) params.set("tags", searchParams.tags.join(","))
    if (searchParams.location) params.set("location", searchParams.location)
    
    exploreData.navigate(`/explore?${params.toString()}`)
  }

  // Handle simple text search (for AI suggestions)
  const handleTextSearch = (searchTerm) => {
    if (searchTerm?.trim()) {
      exploreData.navigate(
        `/explore?q=${encodeURIComponent(searchTerm.trim())}`
      )
    }
  }

  return (
    <div className='min-h-screen'>
      <Hero
        heroImage={heroImage}
        showButton={false}
        title={UI_TEXT.exploreHero.title}
        description={UI_TEXT.exploreHero.description}
        className='min-h-[30vh] max-h-[60vh] h-fit'
      />

      <ExploreHeader
        {...exploreData}
        onSearch={handleFormSearch}
      />

      {/*       <ActiveFilters
        {...exploreData}
      /> */}

      <ExploreResults
        {...exploreData}
        onRetry={handleRetry}
        onSearch={handleTextSearch}
        onLoadMore={exploreData.handleLoadMore}
      />
    </div>
  )
}

export default Explore
