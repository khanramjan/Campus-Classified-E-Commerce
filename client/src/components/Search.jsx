import { useState, useEffect } from 'react';
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from "react-icons/fa";
import useMobile from '../hooks/useMobile';

const Search = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isSearchPage, setIsSearchPage] = useState(false)
    const [isMobile] = useMobile()
    const searchParams = new URLSearchParams(location.search)
    const searchText = searchParams.get('q') || ''

    useEffect(() => {
        const isSearch = location.pathname === "/search"
        setIsSearchPage(isSearch)
    }, [location])

    const redirectToSearchPage = () => {
        navigate("/search")
    }

    const handleOnChange = (e) => {
        const value = e.target.value.trim()
        if (value) {
            navigate(`/search?q=${encodeURIComponent(value)}`)
        } else {
            navigate('/search')
        }
    }

    return (
        <div className='w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border overflow-hidden flex items-center text-neutral-500 bg-slate-50 group focus-within:border-primary-200'>
            <div>
                {
                    (isMobile && isSearchPage) ? (
                        <Link to={"/"} className='flex justify-center items-center h-full p-2 m-1 group-focus-within:text-primary-200 bg-white rounded-full shadow-md'>
                            <FaArrowLeft size={20}/>
                        </Link>
                    ) : (
                        <button className='flex justify-center items-center h-full p-3 group-focus-within:text-primary-200'>
                            <IoSearch size={22}/>
                        </button>
                    )
                }
            </div>
            <div className='w-full h-full'>
                {
                    !isSearchPage ? (
                        <div onClick={redirectToSearchPage} className='w-full h-full flex items-center px-2'>
                            <TypeAnimation
                                sequence={[
                                    'Search for fresh vegetables...',
                                    1000,
                                    'Search for organic fruits...',
                                    1000,
                                    'Search for dairy products...',
                                    1000,
                                    'Search for groceries...',
                                    1000,
                                    'Search for household items...',
                                    1000
                                ]}
                                wrapper="span"
                                speed={50}
                                repeat={Infinity}
                                className="text-gray-500"
                            />
                        </div>
                    ) : (
                        <div className='w-full h-full'>
                            <input
                                type='text'
                                placeholder='Search for products, brands and more...'
                                autoFocus
                                value={searchText}
                                className='bg-transparent w-full h-full outline-none px-2'
                                onChange={handleOnChange}
                            />
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Search
