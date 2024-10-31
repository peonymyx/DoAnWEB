import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { colors } from '@mui/material';

const Favatie = () => {
    const auth = useSelector((state) => state.auth.currentUser);
    const [wishlist, setWishlist] = useState([]);
    const [productWish, setProductWish] = useState([]);

    const fetchProducts = async (productIds) => {
        try {
            const productsResponse = await Promise.all(
                productIds.map(id => axios.get(`http://localhost:3000/api/v1/getProductById/${id}`))
            );
            setProductWish(productsResponse.map(res => res.data.Product));
        } catch (error) {
            console.error('There was an error fetching the products!', error);
        }
    };
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/users/wishListProduct/${auth._id}`);
                
                setWishlist(response.data.wishList);


            } catch (error) {
                console.error('There was an error fetching the wishlist!', error);
            }
        };

        if (auth) {
            fetchWishlist();
        }
    }, [auth]);

    useEffect(() => {
        if (wishlist.length > 0) {
            fetchProducts(wishlist);
        }
    }, [wishlist]);

console.log("productWish", productWish);

    if (!auth) {
        return (
            <div style={{ marginTop: "200px" }}>
                <p>Please log in to see your wishlist.</p>
            </div>
        );
    }

    return (
        <div style={{ marginTop: "200px" }}>
            <h2>Your Wishlist</h2>
            <div>
                {productWish.length > 0 ? (
                    productWish.map(product => (
                        <div key={product._id} className="wishlist-item">
                            <img src={product.image} style={{ width: '100px', height: '100px' }} />
                            <h3 style={{color: 'black'}}>{product.name || "No name available"}</h3>
                            <p>{product.price} VNĐ</p>
                        </div>
                    ))
                ) : (
                    <p>Your wishlist is empty.</p>
                )}
            </div>
        </div>
    );
};

export default Favatie;
