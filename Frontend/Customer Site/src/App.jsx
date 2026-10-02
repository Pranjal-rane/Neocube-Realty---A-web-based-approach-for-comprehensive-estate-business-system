import { Navigate, Route, Routes } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import Home from './pages/Home'
import Properties from './pages/Properties'
import PropertyDetails from './pages/PropertyDetails'
import Compare from './pages/Compare'
import Favorites from './pages/Favorites'
import About from './pages/About'
import Services from './pages/Services'
import Developers from './pages/Developers'
import Contact from './pages/Contact'
import CustomerForm from './pages/CustomerForm'
import Auth from './pages/Auth'
import Dashboard from './pages/dashboard/Dashboard'
import ListPage from './pages/dashboard/ListPage'
import Bookings from './pages/dashboard/Bookings'
import { useEffect, useState } from 'react'


export default function App() {
const [favorites, setFavorites] = useState([])
const user = JSON.parse(localStorage.getItem('neoUser') || '{}')
const [compare, setCompare] = useState([])

  useEffect(() => {
  if (!user.id) return

  fetch(`http://localhost:8080/api/favorites/customer/${user.id}`)
    .then(response => response.json())
    .then(data => {
      setFavorites(data.map(favorite => favorite.propertyId))
    })
    .catch(error => {
      console.error('Error fetching favorites:', error)
    })

}, [user.id])


useEffect(() => {
  if (!user.id) return

  fetch(`http://localhost:8080/api/comparisons/customer/${user.id}`)
    .then(response => response.json())
    .then(data => {
      setCompare(data.map(item => item.propertyId))
    })
    .catch(error => {
      console.error('Error fetching comparisons:', error)
    })

}, [user.id])
const toggleFavorite = async (propertyId) => {
  if (!user.id) {
    alert('Please login to save favorites.')
    return
  }
  try {
    if (favorites.includes(propertyId)) {

      await fetch(
        `http://localhost:8080/api/favorites/customer/${user.id}/property/${propertyId}`,
        {
          method: 'DELETE'
        }
      )

      setFavorites(items =>
        items.filter(id => id !== propertyId)
      )

    } else {

  const response = await fetch(
        'http://localhost:8080/api/favorites',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            customerId: user.id,
            propertyId: propertyId
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to save favorite')
      }

      setFavorites(items => [...items, propertyId])
    }

  } catch (error) {
    console.error('Favorite error:', error)
  }
}
const toggleCompare = async (propertyId) => {
  if (!user.id) {
    alert('Please login to compare properties.')
    return
  }

  try {
    if (compare.includes(propertyId)) {

      await fetch(
        `http://localhost:8080/api/comparisons/customer/${user.id}/property/${propertyId}`,
        {
          method: 'DELETE'
        }
      )

      setCompare(items =>
        items.filter(id => id !== propertyId)
      )

    } else {

      if (compare.length >= 3) {
        alert('You can compare up to 3 properties.')
        return
      }

      const response = await fetch(
        'http://localhost:8080/api/comparisons',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            customerId: user.id,
            propertyId: propertyId
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to add comparison')
      }

      setCompare(items => [...items, propertyId])
    }

  } catch (error) {
    console.error('Comparison error:', error)
  }
}
  return <Routes>
    <Route element={<PublicLayout/>}>
      <Route path="/" element={<Home favorites={favorites} toggleFavorite={toggleFavorite} compare={compare} toggleCompare={toggleCompare}/>}/>
      <Route path="/properties" element={<Properties favorites={favorites} toggleFavorite={toggleFavorite} compare={compare} toggleCompare={toggleCompare}/>}/>
      <Route path="/properties/:id" element={<PropertyDetails favorites={favorites} toggleFavorite={toggleFavorite}/>}/>
      <Route path="/compare" element={<Compare compare={compare} toggleCompare={toggleCompare}/>}/>
      <Route path="/favorites" element={<Favorites favorites={favorites} toggleFavorite={toggleFavorite} compare={compare} toggleCompare={toggleCompare}/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/services" element={<Services/>}/>
      <Route path="/developers" element={<Developers/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/inquiry" element={<CustomerForm/>}/>
      <Route path="/schedule-visit" element={<CustomerForm mode="visit"/>}/>
      <Route path="/login" element={<Auth/>}/>
      <Route path="/register" element={<Auth register/>}/>
    </Route>

    <Route element={<DashboardLayout/>}>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/dashboard/inquiries" element={<ListPage type="inquiries"/>}/>
      <Route path="/dashboard/site-visits" element={<ListPage type="visits"/>}/>
      <Route path="/dashboard/bookings" element={<Bookings/>}/>
    </Route>

    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>
}
