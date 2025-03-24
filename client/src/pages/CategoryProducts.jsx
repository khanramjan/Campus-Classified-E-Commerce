import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import CardProduct from '../components/CardProduct';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';

const CategoryProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const categoryId = params.category.split('-').slice(-1)[0];
  const categoryName = params.category.split('-').slice(0, -1).join(' ');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: {
          id: categoryId
        }
      });

      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        toast.error(response.data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">{categoryName}</h1>
      
      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No products found in this category
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <CardProduct key={product._id} data={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoryProducts; 