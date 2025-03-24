import React from 'react'
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import {Link, useNavigate} from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectProductListpage = (id,cat)=>{
      const url = `/${valideURLConvert(cat)}-${id}/all-products`
      navigate(url)
  }


  return (
   <section className='bg-white'>
      <div className='container mx-auto'>
          <div className={`w-full h-full min-h-48  rounded ${!banner && "animate-pulse my-2" } `}>
              <img
                src="https://t4.ftcdn.net/jpg/06/22/74/79/360_F_622747997_4s5nw9y2WG3LJyQ5iRF4KRGLbySGRd82.jpg"
                className='w-full h-10% hidden lg:block'
                alt='banner' 
              />
              <img
                src="https://organicmarketdhaka.com/media/slider/slider22.webp"
                className='w-full h-full lg:hidden'
                alt='banner' 
              />
          </div>
      </div>
      <h2 className='my-10 py-0 lg:py-10 text-2xl lg:text-5xl text-center'>ALL Category</h2>
      <div className='container mx-auto px-4 my-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 lg:gap-6'>
          {
            loadingCategory ? (
              new Array(12).fill(null).map((c,index)=>{
                return(
                  <div key={index+"loadingcategory"} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
                    <div className='bg-blue-100 min-h-24 rounded'></div>
                    <div className='bg-blue-100 h-8 rounded'></div>
                  </div>
                )
              })
            ) : (
              categoryData.map((cat,index)=>{
                return(
                  <div key={cat._id+"displayCategory"} className='w-full min-h-[150px] bg-white rounded shadow hover:shadow-md transition-shadow duration-300 cursor-pointer' onClick={()=>handleRedirectProductListpage(cat._id,cat.name)}>
                    <div className='w-full h-[120px] flex items-center justify-center p-2'>
                        <img 
                          src={cat.image}
                          alt={cat.name}
                          className='w-full h-full object-contain'
                        />
                    </div>
                    <div className='p-2 text-center'>
                      <h3 className='text-sm font-medium text-gray-700 truncate'>{cat.name}</h3>
                    </div>
                  </div>
                )
              })
            )
          }
      </div>


      <h2 className='my-10 py-0 lg:py-10 text-2xl lg:text-5xl text-center'>ALL Product</h2>
      {/***display category product */}
      {
        categoryData?.map((c,index)=>{
          return(
            <CategoryWiseProductDisplay 
              key={c?._id+"CategorywiseProduct"} 
              id={c?._id} 
              name={c?.name}
            />
          )
        })
      }



   </section>
  )
}

export default Home
