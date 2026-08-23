import p1 from '../assets/property-1.png'
import p2 from '../assets/property-2.png'
import p3 from '../assets/property-3.png'
import p4 from '../assets/property-4.png'
import p5 from '../assets/property-5.png'
import p6 from '../assets/property-6.png'
import p7 from '../assets/property-7.png'
import p8 from '../assets/property-8.png'

export const properties = [
  { id: 1, name: 'Luxury 3 BHK Apartment', location: 'Amravati, Maharashtra', price: 6500000, priceText: '₹65.00 Lakh', type: 'Apartment', bhk: 3, baths: 2, area: 1450, status: 'Ready to Move', featured: true, image: p1, description: 'A premium family apartment with modern interiors, generous living spaces and excellent connectivity.' },
  { id: 2, name: 'Premium 2 BHK Apartment', location: 'Nagpur, Maharashtra', price: 4800000, priceText: '₹48.00 Lakh', type: 'Apartment', bhk: 2, baths: 2, area: 1100, status: 'Under Construction', featured: true, image: p2, description: 'A smartly planned 2 BHK residence designed for comfortable city living.' },
  { id: 3, name: 'Modern Villa', location: 'Wardha Road, Nagpur', price: 12500000, priceText: '₹1.25 Cr', type: 'Villa', bhk: 4, baths: 4, area: 2500, status: 'Ready to Move', featured: true, image: p3, description: 'A contemporary villa with large windows, landscaped surroundings and premium finishes.' },
  { id: 4, name: 'Commercial Office Space', location: 'Amravati, Maharashtra', price: 7500000, priceText: '₹75.00 Lakh', type: 'Office', bhk: 0, baths: 1, area: 1200, status: 'Ready to Move', featured: true, image: p4, description: 'Professional office space suitable for growing businesses, consultants and service companies.' },
  { id: 5, name: 'Elegant 2 BHK Residence', location: 'Camp, Amravati', price: 4200000, priceText: '₹42.00 Lakh', type: 'Apartment', bhk: 2, baths: 2, area: 980, status: 'Ready to Move', featured: false, image: p5, description: 'A comfortable 2 BHK home in a convenient residential location.' },
  { id: 6, name: 'Greenview 3 BHK Villa', location: 'Nagpur, Maharashtra', price: 9800000, priceText: '₹98.00 Lakh', type: 'Villa', bhk: 3, baths: 3, area: 2100, status: 'Under Construction', featured: false, image: p6, description: 'Spacious villa living with a peaceful neighbourhood feel and modern amenities.' },
  { id: 7, name: 'Prime Retail Shop', location: 'Main Market, Amravati', price: 5500000, priceText: '₹55.00 Lakh', type: 'Shop', bhk: 0, baths: 1, area: 760, status: 'Ready to Move', featured: false, image: p7, description: 'A strategically located retail space for customer-facing businesses.' },
  { id: 8, name: 'Skyline 4 BHK Penthouse', location: 'Central Nagpur', price: 15000000, priceText: '₹1.50 Cr', type: 'Penthouse', bhk: 4, baths: 4, area: 2800, status: 'Ready to Move', featured: false, image: p8, description: 'A high-end penthouse concept with expansive rooms and a premium city lifestyle.' },
]

export const propertyTypes = ['Apartment', 'Villa', 'Office', 'Shop', 'Penthouse']
