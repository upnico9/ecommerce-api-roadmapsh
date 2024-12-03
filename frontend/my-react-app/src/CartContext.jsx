import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([])
    const [loading, setLoading] = useState(true)

    const getApi = () => {
        const token = localStorage.getItem('token');
        return axios.create({
            baseURL: 'http://localhost:3000/api/cart',
            headers: token ? {
                'Authorization': `Bearer ${token}`
            } : {}
        });
    };

    const isAuthenticated = () => !!localStorage.getItem('token');

    useEffect(() => {
        const initializeCart = async () => {
            try {
                if (isAuthenticated()) {
                    const api = getApi();
                    const response = await api.get('/');
                    setCart(Array.isArray(response.data.items) ? response.data.items : []);
                } else {
                    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
                    setCart(savedCart);
                }
            } catch (error) {
                console.error('Error initializing cart:', error);
                const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
                setCart(savedCart);
            } finally {
                setLoading(false);
            }
        };

        initializeCart();

        if (!loading && !isAuthenticated()) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [loading]);

    const addToCart = async (product) => {
        try {
            if (isAuthenticated()) {
                const api = getApi();
                console.log('Adding to cart:', product);
                const response = await api.post('/', { productId: product._id, quantity: 1 });
                console.log('Response:', response.data);
                setCart(response.data.items);
            } else {
                setCart(prevItems => {
                    const existingProduct = prevItems.find(item => item._id === product._id);
                    if (existingProduct) {
                        return prevItems.map(item => item._id === product._id ? {...item, quantity: item.quantity + 1} : item);
                    }
                    return [...prevItems, {...product, quantity: 1}];
                })
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            if (isAuthenticated()) {
                const api = getApi();
                await api.delete('/', { data: { productId } });
                const response = await api.get('/');
                setCart(response.data);
            } else {
                setCart(prevItems => prevItems.filter(item => item._id !== productId));
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const updateCartQuantity = async (productId, newQuantity) => {
        try {
            if (newQuantity <=  0) {
                return removeFromCart(productId)
            }
            
            if (isAuthenticated()) {
                const api = getApi();
                const response = await api.put('/', { productId, newQuantity });
                setCart(Array.isArray(response.data) ? response.data : []);
            } else {
                setCart(prevItems => prevItems.map(item => item._id === productId ? {...item, quantity: newQuantity} : item));
            }
        } catch (error) {
            console.error('Error updating cart quantity:', error);
        }
    };

    const syncCartWithServer = async () => {
        try {
            console.log('Starting cart sync...');
            const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
            console.log('Local cart:', localCart);
    
            const api = getApi();
            const response = await api.get('/');
            const serverCart = Array.isArray(response.data.items) ? response.data.items : [];
            console.log('Server cart:', serverCart);
    
            const serverCartMap = new Map(
                serverCart.map(item => [item.product._id, item.product.quantity])
            );

            for (const localItem of localCart) {
                const serverQuantity = serverCartMap.get(localItem.productId);
                console.log(`Processing local item ${localItem.productId}:`, {
                    localQuantity: localItem.quantity,
                    serverQuantity: serverQuantity || 0
                });
    
                if (serverQuantity === undefined) {
                    console.log(`Adding new item ${localItem.productId} to server`);
                    await api.post('/', {
                        productId: localItem.productId,
                        quantity: localItem.quantity
                    });
                } else {
                    const newQuantity = localItem.quantity + serverQuantity;
                    console.log(`Updating quantity for item ${localItem.productId} to ${newQuantity}`);
                    await api.put('/', {
                        productId: localItem.productId,
                        quantity: newQuantity
                    });
                }
            }
    
            const finalResponse = await api.get('/');
            const finalCart = Array.isArray(finalResponse.data.items) ? finalResponse.data.items : [];
            console.log('Final cart after sync:', finalCart);
            
            setCart(finalCart);
            localStorage.removeItem('cart'); 
            console.log('Sync completed successfully');
    
        } catch (error) {
            console.error('Error during cart sync:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
        }
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartQuantity, clearCart, syncCartWithServer, loading }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}