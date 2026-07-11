import React, { useEffect, useState } from 'react'
import { createContext } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import CartContextProvider from './CartContext'

export const ShopContext = createContext()

const ShopContextProvider = (props) => {
    const currency = "৳ "
    const delivery_fee = 30
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = React.useState('')
    const [showSearch, setShowSearch] = React.useState(false)
    const [products, setProducts] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [searchLoading, setSearchLoading] = useState(false)
    const navigate = useNavigate()
    const [token, setToken] = useState(localStorage.getItem('token') || '')

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

    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
        }
    }, [])

    const value = {
        products, currency, delivery_fee,
        search, setSearch,
        showSearch, setShowSearch,
        navigate, backendUrl, token, setToken,
        searchResults, searchLoading, fetchSearch
    }

    return (
        <ShopContext.Provider value={value}>
            <CartContextProvider backendUrl={backendUrl} token={token} products={products}>
                {props.children}
            </CartContextProvider>
        </ShopContext.Provider>
    )
}

export default ShopContextProvider