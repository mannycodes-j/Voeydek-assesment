'use client'

import type React from 'react'

import { useState } from 'react'
import { Plus, Building, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useItineraryStore } from '@/lib/store/itinerary-store'
import { toast } from 'sonner'
import type { Hotel } from '@/lib/types/travel'

export function AddHotelForm() {
  const [open, setOpen] = useState(false)
  const [hotelData, setHotelData] = useState({
    name: '',
    address: '',
    rating: 4,
    reviews: 0,
    price: '',
    originalPrice: '',
    nights: '',
    checkIn: '',
    checkOut: '',
    facilities: [] as string[],
    roomType: '',
    image: '',
    notes: '',
  })

  const [facilityInput, setFacilityInput] = useState('')
  const { addHotel } = useItineraryStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (
      !hotelData.name ||
      !hotelData.address ||
      !hotelData.price ||
      !hotelData.checkIn ||
      !hotelData.checkOut
    ) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate dates
    const checkInDate = new Date(hotelData.checkIn)
    const checkOutDate = new Date(hotelData.checkOut)

    if (checkOutDate <= checkInDate) {
      toast.error('Check-out date must be after check-in date')
      return
    }

    const newHotel: Hotel = {
      id: `hotel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: hotelData.name,
      address: hotelData.address,
      rating: hotelData.rating,
      reviews: hotelData.reviews,
      price: hotelData.price,
      originalPrice: hotelData.originalPrice,
      nights:
        hotelData.nights ||
        `${Math.ceil(
          (checkOutDate.getTime() - checkInDate.getTime()) /
            (1000 * 60 * 60 * 24)
        )} nights`,
      checkIn: hotelData.checkIn,
      checkOut: hotelData.checkOut,
      facilities: hotelData.facilities,
      roomType: hotelData.roomType || 'Standard Room',
      image:
        hotelData.image || '/placeholder.svg?height=120&width=120&text=Hotel',
      notes: hotelData.notes,
    }

    addHotel(newHotel)
    toast.success('Hotel added to itinerary!')

    // Reset form
    setHotelData({
      name: '',
      address: '',
      rating: 4,
      reviews: 0,
      price: '',
      originalPrice: '',
      nights: '',
      checkIn: '',
      checkOut: '',
      facilities: [],
      roomType: '',
      image: '',
      notes: '',
    })
    setOpen(false)
  }

  const addFacility = () => {
    if (
      facilityInput.trim() &&
      !hotelData.facilities.includes(facilityInput.trim())
    ) {
      setHotelData((prev) => ({
        ...prev,
        facilities: [...prev.facilities, facilityInput.trim()],
      }))
      setFacilityInput('')
    }
  }

  const removeFacility = (facility: string) => {
    setHotelData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((f) => f !== facility),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Hotel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Add Hotel to Itinerary
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Hotel Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hotel Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Hotel Name *</Label>
                <Input
                  id="name"
                  value={hotelData.name}
                  onChange={(e) =>
                    setHotelData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Grand Plaza Hotel"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={hotelData.address}
                  onChange={(e) =>
                    setHotelData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="e.g., 123 Main Street, City, Country"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">Star Rating</Label>
                  <Select
                    value={hotelData.rating.toString()}
                    onValueChange={(value) =>
                      setHotelData((prev) => ({
                        ...prev,
                        rating: Number(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Star</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="reviews">Number of Reviews</Label>
                  <Input
                    id="reviews"
                    type="number"
                    value={hotelData.reviews}
                    onChange={(e) =>
                      setHotelData((prev) => ({
                        ...prev,
                        reviews: Number(e.target.value),
                      }))
                    }
                    placeholder="e.g., 250"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="roomType">Room Type</Label>
                <Input
                  id="roomType"
                  value={hotelData.roomType}
                  onChange={(e) =>
                    setHotelData((prev) => ({
                      ...prev,
                      roomType: e.target.value,
                    }))
                  }
                  placeholder="e.g., Deluxe King Room"
                />
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkIn">Check-in Date *</Label>
                  <Input
                    id="checkIn"
                    type="date"
                    value={hotelData.checkIn}
                    onChange={(e) =>
                      setHotelData((prev) => ({
                        ...prev,
                        checkIn: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="checkOut">Check-out Date *</Label>
                  <Input
                    id="checkOut"
                    type="date"
                    value={hotelData.checkOut}
                    onChange={(e) =>
                      setHotelData((prev) => ({
                        ...prev,
                        checkOut: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    value={hotelData.price}
                    onChange={(e) =>
                      setHotelData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    placeholder="e.g., $150.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">
                    Original Price (Optional)
                  </Label>
                  <Input
                    id="originalPrice"
                    value={hotelData.originalPrice}
                    onChange={(e) =>
                      setHotelData((prev) => ({
                        ...prev,
                        originalPrice: e.target.value,
                      }))
                    }
                    placeholder="e.g., $200.00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="nights">Nights Description</Label>
                <Input
                  id="nights"
                  value={hotelData.nights}
                  onChange={(e) =>
                    setHotelData((prev) => ({
                      ...prev,
                      nights: e.target.value,
                    }))
                  }
                  placeholder="e.g., 2 nights including taxes"
                />
              </div>
            </CardContent>
          </Card>

          {/* Facilities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hotel Facilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={facilityInput}
                  onChange={(e) => setFacilityInput(e.target.value)}
                  placeholder="Add facility (e.g., Pool, WiFi, Gym)"
                  onKeyPress={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), addFacility())
                  }
                />
                <Button type="button" onClick={addFacility} variant="outline">
                  Add
                </Button>
              </div>

              {hotelData.facilities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {hotelData.facilities.map((facility, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                    >
                      {facility}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-blue-600"
                        onClick={() => removeFacility(facility)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="image">Image URL (Optional)</Label>
                <Input
                  id="image"
                  value={hotelData.image}
                  onChange={(e) =>
                    setHotelData((prev) => ({ ...prev, image: e.target.value }))
                  }
                  placeholder="https://example.com/hotel-image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={hotelData.notes}
                  onChange={(e) =>
                    setHotelData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Any additional notes about this hotel..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 flex-1"
            >
              Add Hotel to Itinerary
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
