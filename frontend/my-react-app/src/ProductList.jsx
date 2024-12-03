import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [addedProducts, setAddedProducts] = useState({});
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/products');
        console.log('API Response:', response.data);
        setProducts(response.data);
      } catch (err) {
        console.error('Error details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    console.log('Adding to cart:', product);
    
    e.preventDefault();
    addToCart(product);
    setAddedProducts(prev => ({
      ...prev,
      [product._id]: true
    }));

    setTimeout(() => {
      setAddedProducts(prev => ({
        ...prev,
        [product._id]: false
      }));
    }, 2000);
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Our Products</h1>
      <div className="product-list">
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          products.map(product => (
            <Link 
                to={`/products/${product._id}`} 
                key={product._id}
                className="product-card"
            >
                <div className="product-image">
                    <div className="placeholder-image">
                        {product.name[0]}
                    </div>
                </div>
                <div className="product-info">
                    <h2>{product.name}</h2>
                    <p className="product-description">{product.description}</p>
                    <p className="product-price">${product.price}</p>
                </div>
                <button 
                    className={`quick-add-to-cart ${addedProducts[product._id] ? 'added' : ''}`}
                    onClick={(e) => handleAddToCart(e, product)}
                >
                    {addedProducts[product._id] ? (
                        'Added! ✓'
                    ) : (
                        <>
                            <ShoppingCartIcon className="cart-icon-small" />
                            Add to Cart
                        </>
                    )}
                </button>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductList;