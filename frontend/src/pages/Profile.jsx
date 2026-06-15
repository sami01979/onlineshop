import React, { useContext, useEffect, useState, useRef } from 'react'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import Title from '../components/Title'

const Profile = () => {
  const { backendUrl, token, currency } = useContext(ShopContext)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    areaName: '',
    buildingName: '',
    roadName: ''
  })
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [topItems, setTopItems] = useState([])
  const [totalSpent, setTotalSpent] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [profilePic, setProfilePic] = useState(null)
  const [profilePicPreview, setProfilePicPreview] = useState(null)
  const [uploadingPic, setUploadingPic] = useState(false)
  const fileInputRef = useRef(null)

  const loadProfile = async () => {
    try {
      const response = await axios.post(
        backendUrl + '/api/user/profile/get',
        {},
        { headers: { token } }
      )
      if (response.data.success) {
        setName(response.data.name)
        setEmail(response.data.email)
        if (response.data.address) {
          setFormData(response.data.address)
        }
        if (response.data.profilePic) {
          setProfilePicPreview(response.data.profilePic)
        }
        setIsEditing(response.data.address?.firstName ? false : true)
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to load profile')
    }
    setLoading(false)
  }

  const loadOrderStats = async () => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { token } }
      )
      if (response.data.success) {
        const orders = response.data.orders
        setTotalSpent(orders.reduce((sum, order) => sum + order.amount, 0))
        setTotalOrders(orders.length)

        const itemMap = {}
        orders.forEach(order => {
          order.items.forEach(item => {
            if (itemMap[item._id]) {
              itemMap[item._id].quantity += item.quantity
            } else {
              itemMap[item._id] = { ...item, quantity: item.quantity }
            }
          })
        })

        setTopItems(
          Object.values(itemMap)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 3)
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (token) {
      loadProfile()
      loadOrderStats()
    }
  }, [token])

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setFormData(data => ({ ...data, [name]: value }))
  }

  // FIX: Immediately upload pic when file is selected (not on save)
  const onProfilePicChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      return
    }

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file)
    setProfilePicPreview(localPreview)
    setProfilePic(file)

    // Upload immediately
    setUploadingPic(true)
    try {
      const picForm = new FormData()
      picForm.append('profilePic', file)

      const picRes = await axios.post(
        backendUrl + '/api/user/profile/uploadpic',
        picForm,
        {
          headers: {
            token,
            'Content-Type': 'multipart/form-data'  // FIX: explicit multipart header
          }
        }
      )

      if (picRes.data.success) {
        setProfilePicPreview(picRes.data.url)
        setProfilePic(null) // clear since already uploaded
        toast.success('Profile picture updated!')
      } else {
        toast.error(picRes.data.message || 'Failed to upload picture')
        setProfilePicPreview(null) // revert preview
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to upload picture')
      setProfilePicPreview(null)
    }
    setUploadingPic(false)

    // Reset file input so same file can be re-selected
    e.target.value = ''
  }

  const handlePicButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const onSaveHandler = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await axios.post(
        backendUrl + '/api/user/profile/update',
        { address: formData },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success('Profile saved!')
        setIsEditing(false)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <div className='flex flex-col items-center gap-3'>
          <div className='w-8 h-8 border-2 border-blue-950 border-t-transparent rounded-full animate-spin' />
          <p className='text-sm text-gray-400'>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='border-t pt-8 pb-24 sm:pb-10 px-4 sm:px-0'>
      <div className='text-2xl mb-6'>
        <Title text1={'MY'} text2={'PROFILE'} />
      </div>

      {/* Responsive container: single col on mobile, max-w on larger screens */}
      <div className='w-full max-w-2xl mx-auto lg:mx-0 flex flex-col gap-4'>

        {/* ── Account Info Card ── */}
        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5'>
          <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-4'>
            👤 Account Info
          </p>

          <div className='flex items-center gap-4'>
            {/* Profile Picture */}
            {/* <div className='relative shrink-0'>
              {uploadingPic ? (
                <div className='w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center'>
                  <div className='w-6 h-6 border-2 border-blue-950 border-t-transparent rounded-full animate-spin' />
                </div>
              ) : profilePicPreview ? (
                <img
                  src={profilePicPreview}
                  alt='Profile'
                  className='w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200'
                />
              ) : (
                <div className='w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-8 h-8 sm:w-10 sm:h-10 text-gray-400'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                </div>
              )}

            
              <button
                type='button'
                onClick={handlePicButtonClick}
                disabled={uploadingPic}
                aria-label='Change profile picture'
                className='absolute -bottom-1 -right-1 w-7 h-7 bg-blue-950 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors disabled:opacity-50 shadow-md z-10 cursor-pointer'
              >
                
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-3.5 h-3.5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
              </button>

             
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={onProfilePicChange}
                className='hidden'
              />
            </div>
 */}
            {/* Name & Email */}
            <div className='flex flex-col gap-1 min-w-0'>
              <span className='font-semibold text-gray-800 text-sm sm:text-base truncate'>
                {name}
              </span>
              <span className='text-gray-500 text-xs sm:text-sm truncate'>{email}</span>
              {/* <span className='text-xs text-blue-400 mt-0.5'>
                Tap the camera to change photo
              </span> */}
            </div>
          </div>
        </div>

        {/* ── Order Stats ── */}
        <div className='grid grid-cols-2 gap-3'>
          <div className='bg-pink-50 border border-pink-100 rounded-2xl p-4 sm:p-5 text-center'>
            <p className='text-2xl sm:text-3xl font-bold text-blue-950'>{totalOrders}</p>
            <p className='text-xs sm:text-sm text-gray-500 mt-1'>Total Orders</p>
          </div>
          <div className='bg-pink-50 border border-pink-100 rounded-2xl p-4 sm:p-5 text-center'>
            <p className='text-2xl sm:text-3xl font-bold text-blue-950'>
              {currency}{totalSpent.toLocaleString()}
            </p>
            <p className='text-xs sm:text-sm text-gray-500 mt-1'>Lifetime Spending</p>
          </div>
        </div>

        {/* ── Top 3 Most Purchased ── */}
        {topItems.length > 0 && (
          <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5'>
            <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-3'>
              🏆 Most Purchased
            </p>
            <div className='flex flex-col divide-y divide-gray-100'>
              {topItems.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center gap-3 py-3 first:pt-0 last:pb-0'
                >
                  <span className='text-base sm:text-lg font-bold text-blue-950 w-6 shrink-0'>
                    #{index + 1}
                  </span>
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className='w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-xl border border-gray-100 shrink-0'
                  />
                  <div className='flex-1 min-w-0'>
                    <p className='text-xs sm:text-sm font-semibold text-gray-800 truncate'>
                      {item.name}
                    </p>
                    <p className='text-xs text-gray-400 mt-0.5'>
                      Ordered {item.quantity}×
                    </p>
                  </div>
                  <p className='text-xs sm:text-sm font-bold text-gray-800 shrink-0'>
                    {currency}{item.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Delivery Address ── */}
        {isEditing ? (
          <form onSubmit={onSaveHandler}>
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 mb-4'>
              <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-4'>
                📦 Delivery Address
              </p>
              <div className='flex flex-col gap-3'>
                {/* First / Last name — stack on mobile, side-by-side on sm+ */}
                <div className='flex flex-col sm:flex-row gap-3'>
                  <input
                    name='firstName'
                    value={formData.firstName}
                    onChange={onChangeHandler}
                    className='border border-gray-300 rounded-xl py-2.5 px-3 w-full text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 transition'
                    type='text'
                    placeholder='First Name'
                    required
                  />
                  <input
                    name='lastName'
                    value={formData.lastName}
                    onChange={onChangeHandler}
                    className='border border-gray-300 rounded-xl py-2.5 px-3 w-full text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 transition'
                    type='text'
                    placeholder='Last Name'
                    required
                  />
                </div>
                <input
                  name='mobileNumber'
                  value={formData.mobileNumber}
                  onChange={onChangeHandler}
                  className='border border-gray-300 rounded-xl py-2.5 px-3 w-full text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 transition'
                  type='tel'
                  placeholder='Mobile Number'
                  required
                />
                <input
                  name='areaName'
                  value={formData.areaName}
                  onChange={onChangeHandler}
                  className='border border-gray-300 rounded-xl py-2.5 px-3 w-full text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 transition'
                  type='text'
                  placeholder='Area Name'
                  required
                />
                <div className='flex flex-col sm:flex-row gap-3'>
                  <input
                    name='buildingName'
                    value={formData.buildingName}
                    onChange={onChangeHandler}
                    className='border border-gray-300 rounded-xl py-2.5 px-3 w-full text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 transition'
                    type='text'
                    placeholder='Building Name'
                  />
                  <input
                    name='roadName'
                    value={formData.roadName}
                    onChange={onChangeHandler}
                    className='border border-gray-300 rounded-xl py-2.5 px-3 w-full text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 transition'
                    type='text'
                    placeholder='Road Name'
                  />
                </div>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-3'>
              <button
                type='button'
                onClick={() => setIsEditing(false)}
                className='w-full border border-gray-300 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={saving}
                className='w-full bg-blue-950 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 text-sm sm:text-base'
              >
                {saving ? (
                  <span className='flex items-center justify-center gap-2'>
                    <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    Saving...
                  </span>
                ) : 'Save Profile'}
              </button>
            </div>
          </form>
        ) : (
          <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5'>
            <div className='flex justify-between items-center mb-3'>
              <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>
                📦 Delivery Address
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className='text-xs text-blue-950 font-semibold border border-blue-950 px-3 py-1.5 rounded-lg hover:bg-blue-950 hover:text-white transition-colors'
              >
                ✏️ Edit
              </button>
            </div>

            {formData.firstName ? (
              <div className='flex flex-col gap-1.5 text-sm text-gray-600'>
                <p className='font-medium text-gray-800'>
                  {formData.firstName} {formData.lastName}
                </p>
                <p>{formData.mobileNumber}</p>
                <p>{formData.areaName}</p>
                <p>
                  {[formData.buildingName, formData.roadName]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            ) : (
              <p className='text-sm text-gray-400 italic'>
                No address saved yet. Tap Edit to add one.
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default Profile