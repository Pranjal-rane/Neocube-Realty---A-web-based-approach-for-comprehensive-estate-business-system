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
import { useLocalStorage } from './hooks/useLocalStorage'

export default function App() {
  const [favorites,setFavorites] = useLocalStorage('neoFavorites',[])
  const [compare,setCompare] = useLocalStorage('neoCompare',[])

  const toggleFavorite = (id) => setFavorites((items)=>items.includes(id)?items.filter(x=>x!==id):[...items,id])
  const toggleCompare = (id) => setCompare((items)=>items.includes(id)?items.filter(x=>x!==id):items.length<3?[...items,id]:items)

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
