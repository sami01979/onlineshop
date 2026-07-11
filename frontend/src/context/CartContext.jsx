import React, { createContext, useState, useEffect, useRef, useCallback, useContext, useSyncExternalStore } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'

export const CartContext = createContext()         // reactive: cartItems, getCartAmount, getCartCount
export const CartActionsContext = createContext()  // stable: addToCart, updateQuantity, setCartItems

const CartContextProvider = ({ children, backendUrl, token, products }) => {
    const [cartItems, setCartItemsState] = useState({})
    const cartItemsRef = useRef(cartItems)
    const listenersRef = useRef(new Set())
    const productsRef = useRef(products)
    const tokenRef = useRef(token)
    const backendUrlRef = useRef(backendUrl)

    productsRef.current = products
    tokenRef.current = token
    backendUrlRef.current = backendUrl

    useEffect(() => {
        cartItemsRef.current = cartItems
        listenersRef.current.forEach((listener) => listener())
    }, [cartItems])

    const subscribe = useCallback((listener) => {
        listenersRef.current.add(listener)
        return () => listenersRef.current.delete(listener)
    }, [])

    const getQuantitySnapshot = useCallback((id) => cartItemsRef.current[id] || 0, [])

    const setCartItems = useCallback((newCartItems) => {
        cartItemsRef.current = newCartItems
        setCartItemsState(newCartItems)
    }, [])

    const addToCart = useCallback(async (itemId, quantity) => {
        const cartData = structuredClone(cartItemsRef.current)
        cartData[itemId] = (cartData[itemId] || 0) + quantity
        setCartItems(cartData)
        if (tokenRef.current) {
            try {
                await axios.post(backendUrlRef.current + '/api/cart/add', { itemId, quantity }, { headers: { token: tokenRef.current } })
            } catch (error) {
                toast.error(error.message)
            }
        }
    }, [setCartItems])

    const updateQuantity = useCallback(async (itemId, quantity) => {
        const cartData = structuredClone(cartItemsRef.current)
        if (quantity === 0) {
            delete cartData[itemId]
        } else {
            cartData[itemId] = quantity
        }
        setCartItems(cartData)
        if (tokenRef.current) {
            try {
                await axios.post(backendUrlRef.current + '/api/cart/update', { itemId, quantity }, { headers: { token: tokenRef.current } })
            } catch (error) {
                toast.error(error.message)
            }
        }
    }, [setCartItems])

    const getCartAmount = () => {
        let totalAmount = 0
        for (const itemId in cartItems) {
            let itemInfo = productsRef.current.find((product) => product._id === itemId)
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

    const getUserCart = useCallback(async (userToken) => {
        try {
            const response = await axios.post(backendUrlRef.current + '/api/cart/get', {}, { headers: { token: userToken } })
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }, [setCartItems])

    useEffect(() => {
        if (token) {
            getUserCart(token)
        }
    }, [token, getUserCart])

    const dataValue = { cartItems, getCartAmount, getCartCount }
    const actionsValue = useRef({ addToCart, updateQuantity, setCartItems, subscribe, getQuantitySnapshot }).current

    return (
        <CartActionsContext.Provider value={actionsValue}>
            <CartContext.Provider value={dataValue}>
                {children}
            </CartContext.Provider>
        </CartActionsContext.Provider>
    )
}

// Selective hook — a component using this re-renders ONLY when
// THIS item's quantity changes, not on any other cart update.
export const useCartQuantity = (id) => {
    const { subscribe, getQuantitySnapshot } = useContext(CartActionsContext)
    return useSyncExternalStore(subscribe, () => getQuantitySnapshot(id))
}

export default CartContextProvider