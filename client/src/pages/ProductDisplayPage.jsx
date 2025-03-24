import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import { FaAngleRight,FaAngleLeft } from "react-icons/fa6";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import image3 from '../assets/Wide_Assortment.png'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'
import BiddingSection from '../components/BiddingSection'
import toast from 'react-hot-toast'
import MessageSeller from '../components/MessageSeller'

const ProductDisplayPage = () => {
  const params = useParams()
  const navigate = useNavigate()
  let productId = params?.product?.split("-")?.pop()
  const [data, setData] = useState({
    name: "",
    image: []
  })
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const imageContainer = useRef()

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
      } else {
        setError(responseData.message || 'Failed to fetch product details')
        toast.error(responseData.message || 'Failed to fetch product details')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error fetching product details'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!productId) {
      toast.error('Invalid product ID')
      navigate('/')
      return
    }
    fetchProductDetails()
  }, [productId, navigate])

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Go to Home
        </button>
      </div>
    )
  }

  const handleScrollRight = () => {
    if (imageContainer.current) {
      imageContainer.current.scrollLeft += 100
    }
  }

  const handleScrollLeft = () => {
    if (imageContainer.current) {
      imageContainer.current.scrollLeft -= 100
    }
  }

  return (
    <section className='container mx-auto p-4 grid lg:grid-cols-2'>
      <div className=''>
        <div className='bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full'>
          <img
            src={data.image[image]}
            alt={`${data.name} - Main Image`}
            className='w-full h-full object-scale-down'
          /> 
        </div>
        <div className='flex items-center justify-center gap-3 my-2'>
          {
            data.image.map((_, idx) => (
              <div key={`dot-${idx}`} className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${idx === image && "bg-slate-300"}`}></div>
            ))
          }
        </div>
        <div className='grid relative'>
          <div ref={imageContainer} className='flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none'>
            {
              data.image.map((img, idx) => (
                <div key={`thumbnail-${idx}`} className='w-20 h-20 min-h-20 min-w-20 scr cursor-pointer shadow-md'>
                  <img
                    src={img}
                    alt={`${data.name} - Thumbnail ${idx + 1}`}
                    onClick={() => setImage(idx)}
                    className='w-full h-full object-scale-down' 
                  />
                </div>
              ))
            }
          </div>
          <div className='w-full -ml-3 h-full hidden lg:flex justify-between absolute  items-center'>
            <button onClick={handleScrollLeft} className='z-10 bg-white relative p-1 rounded-full shadow-lg'>
              <FaAngleLeft/>
            </button>
            <button onClick={handleScrollRight} className='z-10 bg-white relative p-1 rounded-full shadow-lg'>
              <FaAngleRight/>
            </button>
          </div>
        </div>
        <div>
        </div>

        <div className='my-4  hidden lg:grid gap-3 '>
          <div>
            <p className='font-semibold'>Description</p>
            <p className='text-base'>{data.description}</p>
          </div>
          <div>
            <p className='font-semibold'>Unit</p>
            <p className='text-base'>{data.unit}</p>
          </div>
          {
            data?.more_details && Object.keys(data?.more_details).map((element, idx) => (
              <div key={`detail-${idx}`}>
                <p className='font-semibold'>{element}</p>
                <p className='text-base'>{data?.more_details[element]}</p>
              </div>
            ))
          }
        </div>
      </div>

      <div className='p-4 lg:pl-7 text-base lg:text-lg'>
        <h2 className='text-lg font-semibold lg:text-3xl'>{data.name}</h2>  
        <p className=''>{data.unit}</p> 
        <Divider/>
        <div>
          <p className=''>Price</p> 
          <div className='flex items-center gap-2 lg:gap-4'>
            <div className='border border-green-600 px-4 py-2 rounded bg-green-50 w-fit'>
              <p className='font-semibold text-lg lg:text-xl'>{DisplayPriceInRupees(pricewithDiscount(data.price,data.discount))}</p>
            </div>
            {
              data.discount && (
                <p className='line-through'>{DisplayPriceInRupees(data.price)}</p>
              )
            }
            {
              data.discount && (
                <p className="font-bold text-green-600 lg:text-2xl">{data.discount}% <span className='text-base text-neutral-500'>Discount</span></p>
              )
            }
          </div>
        </div> 
        {
          data.stock === 0 ? (
            <p className='text-lg text-red-500 my-2'>Out of Stock</p>
          ) 
          : (
            <div className='my-4'>
              <AddToCartButton data={data}/>
            </div>
          )
        }

        <BiddingSection product={data} />
        <div className="mt-4">
          <MessageSeller product={data} />
        </div>

        <h2 className='font-semibold'>Why shop from JUST Commerce? </h2>
        <div>
          <div className='flex  items-center gap-4 my-4'>
            <img
              src={image1}
              alt='Superfast Delivery'
              className='w-20 h-20'
            />
            <div className='text-sm'>
              <div className='font-semibold'>Superfast Delivery</div>
              <p>Get your order delivered to your doorstep at the earliest from dark stores near you.</p>
            </div>
          </div>
          <div className='flex  items-center gap-4 my-4'>
            <img
              src={image2}
              alt='Best Prices & Offers'
              className='w-20 h-20'
            />
            <div className='text-sm'>
              <div className='font-semibold'>Best Prices & Offers</div>
              <p>Best price destination with offers directly from the manufacturers.</p>
            </div>
          </div>
          <div className='flex  items-center gap-4 my-4'>
            <img
              src={image3}
              alt='Wide Assortment'
              className='w-20 h-20'
            />
            <div className='text-sm'>
              <div className='font-semibold'>Wide Assortment</div>
              <p>Choose from 5000+ products across food, personal care, household & other categories.</p>
            </div>
          </div>
        </div>

        {/****only mobile */}
        <div className='my-4 grid gap-3 '>
          <div>
            <p className='font-semibold'>Description</p>
            <p className='text-base'>{data.description}</p>
          </div>
          <div>
            <p className='font-semibold'>Unit</p>
            <p className='text-base'>{data.unit}</p>
          </div>
          {
            data?.more_details && Object.keys(data?.more_details).map((element, idx) => (
              <div key={`mobile-detail-${idx}`}>
                <p className='font-semibold'>{element}</p>
                <p className='text-base'>{data?.more_details[element]}</p>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  )
}

export default ProductDisplayPage
