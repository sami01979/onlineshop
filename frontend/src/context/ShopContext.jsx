import React, { useEffect, useState } from 'react'
import { createContext } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const ShopContext = createContext()

const ShopContextProvider = (props) => {
    const currency = "৳ "
    const delivery_fee = 30
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = React.useState('')
    const [showSearch, setShowSearch] = React.useState(false)
    const [cartItems, setCartItems] = useState({})
    const [products, setProducts] = useState([])
    // ✅ NEW — holds backend search results
    const [searchResults, setSearchResults] = useState([])
    const [searchLoading, setSearchLoading] = useState(false)
    const navigate = useNavigate()
    const [token, setToken] = useState(localStorage.getItem('token') || '')

    // ✅ NEW — fetch search results from backend
    const fetchSearch = async (query) => {
        if (!query || query.trim() === '') {
            setSearchResults([])
            return
        }
        try {
            setSearchLoading(true)
            const response = await axios.get(backendUrl + '/api/product/search', {
                params: { query }
            })
            if (response.data.success) {
                setSearchResults(response.data.products)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSearchLoading(false)
        }
    }

    const addToCart = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems)
        cartData[itemId] = (cartData[itemId] || 0) + quantity
        setCartItems(cartData)
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', {itemId, quantity}, {headers:{token}})
            } catch (error) {
                toast.error(error.message)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0
        for (const itemId in cartItems) {
            let itemInfo = products.find((product) => product._id === itemId)
            try {
                if (cartItems[itemId] > 0) {
                    totalAmount += itemInfo.price * cartItems[itemId]
                }
            } catch (error) {}
        }
        return totalAmount
    }

    const getCartCount = () => {
        let totalCount = 0
        for (const itemId in cartItems) {
            try {
                if (cartItems[itemId] > 0) {
                    totalCount += cartItems[itemId]
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
        return totalCount
    }

    const updateQuantity = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems)
        if (quantity === 0) {
            delete cartData[itemId]
        } else {
            cartData[itemId] = quantity
        }
        setCartItems(cartData)
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update',{itemId, quantity},{headers:{token}})
            } catch (error) {
                toast.error(error.message)
            }
        }
    }

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'));
        }
    }, [])

    const value = {
        products, currency, delivery_fee,
        search, setSearch,
        showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity, getCartAmount,
        navigate, backendUrl, token, setToken,
        // ✅ NEW — expose search results and fetch function
        searchResults, searchLoading, fetchSearch
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider