import { useEffect, useState } from 'react'
import CardLoading from '../components/CardLoading'
import Axios from '../utils/Axios'
import CardProduct from '../components/CardProduct'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import noDataImage from '../assets/nothing here yet.webp'
import toast from 'react-hot-toast'

const SearchPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const params = useLocation()
  const searchText = new URLSearchParams(params.search).get('q') || ''

  const fetchData = async (isNewSearch = false) => {
    try {
      if (isNewSearch) {
        setPage(1)
        setData([])
      }
      
      setLoading(true)
      console.log('Making search request with:', {
        search: searchText,
        page: isNewSearch ? 1 : page,
        limit: 10
      })

      // Use Axios instance with baseURL
      const response = await Axios({
        method: 'POST',
        url: '/product/search-product',
        data: {
          search: searchText,
          page: isNewSearch ? 1 : page,
          limit: 10
        }
      })

      console.log('Search response:', response.data)

      if (response?.data?.success) {
        const { data: newData, totalPage: total } = response.data
        setTotalPage(total || 1)
        setHasMore((isNewSearch ? 1 : page) < (total || 1))
        
        if (isNewSearch || page === 1) {
          setData(newData || [])
        } else {
          setData(prev => [...prev, ...(newData || [])])
        }
      } else {
        console.error('Search failed:', response.data)
        toast.error(response?.data?.message || 'No products found')
      }
    } catch (error) {
      console.error('Search error:', {
        error: error,
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      })
      
      // Check for specific error types
      if (error.response?.status === 404) {
        toast.error('Search service not available')
      } else if (error.response?.status === 401) {
        toast.error('Please log in to search products')
      } else if (!navigator.onLine) {
        toast.error('Please check your internet connection')
      } else {
        toast.error('Failed to fetch products. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchText.trim()) {
        console.log('Searching for:', searchText)
        fetchData(true)
      } else {
        setData([])
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(delaySearch)
  }, [searchText])

  const handleFetchMore = () => {
    if (page < totalPage) {
      setPage(prev => prev + 1)
      fetchData()
    }
  }

  return (
    <section className='bg-white min-h-screen'>
      <div className='container mx-auto p-4'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold'>Search Results</h2>
          <p className='text-gray-600'>{data.length} items found</p>
        </div>

        {loading && data.length === 0 && (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
            {Array(10).fill(null).map((_, index) => (
              <CardLoading key={`initial-loading-${index}`} />
            ))}
          </div>
        )}

        {!loading && data.length > 0 && (
          <InfiniteScroll
            dataLength={data.length}
            next={handleFetchMore}
            hasMore={hasMore}
            loader={
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                {Array(5).fill(null).map((_, index) => (
                  <CardLoading key={`loading-${index}`} />
                ))}
              </div>
            }
          >
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
              {data.map((product, index) => (
                <CardProduct 
                  data={product} 
                  key={`${product._id}-${index}`}
                />
              ))}
            </div>
          </InfiniteScroll>
        )}

        {!loading && data.length === 0 && (
          <div className='flex flex-col items-center justify-center py-10'>
            <img
              src={noDataImage}
              alt="No results found"
              className='w-full max-w-xs h-auto mb-4'
            />
            <p className='text-lg text-gray-600 font-semibold'>
              {searchText ? 'No products found' : 'Search products you need'}
            </p>
            {searchText && (
              <p className='text-gray-500 mt-2'>
                Try searching with different keywords
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default SearchPage
