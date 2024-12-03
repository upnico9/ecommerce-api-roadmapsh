import React, { useEffect, useState }  from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import axios from 'axios';

function ProductDetail() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addedToCart, setAddedToCart] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        setAddedToCart(true);
        setTimeout(() => {
            setAddedToCart(false);
        }, 3000);
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!product) return <div>No product found</div>;
    
    return (
        <div className="product-detail">
            <button onClick={() => navigate(-1)} className="back-button">← Back</button>
            <div className="product-detail-content">
                <div className="product-detail-image">

                    <div className="placeholder-image">
                        {product.name[0]}
                    </div>
                </div>
                <div className="product-detail-info">
                    <h1>{product.name}</h1>
                    <p className="description">{product.description}</p>
                    <p className="price">${product.price}</p>
                    <p className="category">{product.category}</p>
                    <button 
                        onClick={handleAddToCart}
                        className={`add-to-cart-button ${addedToCart ? 'added' : ''}`}
                        disabled={addedToCart}
                    >
                        {addedToCart ? 'Added to Cart! ✓' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}


export default ProductDetail;