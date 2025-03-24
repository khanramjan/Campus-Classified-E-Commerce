import  { useEffect, useState, useMemo } from 'react';
import Axios from '../utils/Axios';
import { Link, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import CardProduct from '../components/CardProduct';
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/valideURLConvert';
import toast from 'react-hot-toast';

const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [page] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const params = useParams();
  const AllSubCategory = useSelector((state) => state.product.allSubCategory);

  const categoryId = params.category.split('-').slice(-1)[0];
  const subCategoryId = params.subCategory.split('-').slice(-1)[0];
  const subCategoryName = useMemo(() => {
    const subCategory = params?.subCategory?.split('-');
    return subCategory?.slice(0, subCategory?.length - 1)?.join(' ');
  }, [params]);

  // Filter subcategories for the current category
  const DisplaySubCategory = useMemo(() => {
    return AllSubCategory.filter((s) =>
      s.category.some((el) => el._id === categoryId)
    );
  }, [AllSubCategory, categoryId]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await Axios({
        method: 'POST',
        url: '/api/product/get-product-by-category-and-subcategory',
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 8,
        },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      } else {
        setError(responseData.message || 'Failed to load products');
        toast.error(responseData.message || 'Failed to load products');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to load products';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [params, page]);

  return (
    <section className="sticky top-24 lg:top-20">
      <div className="container mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]">
        {/** Subcategory Navigation **/}
        <div className="min-h-[88vh] max-h-[88vh] overflow-y-scroll grid gap-1 shadow-md scrollbarCustom bg-white py-2">
          {DisplaySubCategory.map((s) => {
            const link = `/${valideURLConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${valideURLConvert(s.name)}-${s._id}`;
            return (
              <Link
                to={link}
                key={s._id}
                className={`w-full p-2 lg:flex items-center lg:w-full lg:h-16 box-border lg:gap-4 border-b 
                hover:bg-green-100 cursor-pointer
                ${subCategoryId === s._id ? 'bg-green-100' : ''}`}
                aria-label={`Navigate to ${s.name}`}
              >
                <div className="w-fit max-w-28 mx-auto lg:mx-0 bg-white rounded box-border">
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    className="w-14 lg:h-14 lg:w-12 h-full object-scale-down"
                  />
                </div>
                <p className="-mt-6 lg:mt-0 text-xs text-center lg:text-left lg:text-base">
                  {s.name}
                </p>
              </Link>
            );
          })}
        </div>

        {/** Product List **/}
        <div className="sticky top-20">
          <div className="bg-white shadow-md p-4 z-10">
            <h3 className="font-semibold">{subCategoryName}</h3>
          </div>
          <div className="min-h-[80vh] max-h-[80vh] overflow-y-auto relative">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4">
              {data.map((p) => (
                <CardProduct
                  data={p}
                  key={p._id}
                />
              ))}
            </div>
            {loading && <Loading />}
            {error && (
              <div className="text-red-500 text-center p-4">{error}</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;
