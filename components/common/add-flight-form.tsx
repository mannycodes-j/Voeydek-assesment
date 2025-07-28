'use client'

import type React from 'react'

import { useState } from 'react'
import { Plus, Plane, X } from 'lucide-react'
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
import type { Flight } from '@/lib/types/travel'

export function AddFlightForm() {
  const [open, setOpen] = useState(false)
  const [flightData, setFlightData] = useState({
    airline: '',
    flightNumber: '',
    departureTime: '',
    departureDate: '',
    departureCode: '',
    departureCity: '',
    arrivalTime: '',
    arrivalDate: '',
    arrivalCode: '',
    arrivalCity: '',
    duration: '',
    type: 'Direct',
    price: '',
    facilities: [] as string[],
    notes: '',
  })

  const [facilityInput, setFacilityInput] = useState('')
  const { addFlight } = useItineraryStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (
      !flightData.airline ||
      !flightData.flightNumber ||
      !flightData.departureTime ||
      !flightData.arrivalTime ||
      !flightData.price
    ) {
      toast.error('Please fill in all required fields')
      return
    }

    const newFlight: Flight = {
      id: `flight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      airline: flightData.airline,
      flightNumber: flightData.flightNumber,
      departure: {
        time: flightData.departureTime,
        date: flightData.departureDate || new Date().toLocaleDateString(),
        code: flightData.departureCode,
        city: flightData.departureCity,
      },
      arrival: {
        time: flightData.arrivalTime,
        date: flightData.arrivalDate || new Date().toLocaleDateString(),
        code: flightData.arrivalCode,
        city: flightData.arrivalCity,
      },
      duration: flightData.duration,
      type: flightData.type,
      price: flightData.price,
      facilities: flightData.facilities,
      notes: flightData.notes,
    }

    addFlight(newFlight)
    toast.success('Flight added to itinerary!')

    // Reset form
    setFlightData({
      airline: '',
      flightNumber: '',
      departureTime: '',
      departureDate: '',
      departureCode: '',
      departureCity: '',
      arrivalTime: '',
      arrivalDate: '',
      arrivalCode: '',
      arrivalCity: '',
      duration: '',
      type: 'Direct',
      price: '',
      facilities: [],
      notes: '',
    })
    setOpen(false)
  }

  const addFacility = () => {
    if (
      facilityInput.trim() &&
      !flightData.facilities.includes(facilityInput.trim())
    ) {
      setFlightData((prev) => ({
        ...prev,
        facilities: [...prev.facilities, facilityInput.trim()],
      }))
      setFacilityInput('')
    }
  }

  const removeFacility = (facility: string) => {
    setFlightData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((f) => f !== facility),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Flight
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5" />
            Add Flight to Itinerary
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Flight Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Flight Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="airline">Airline *</Label>
                  <Input
                    id="airline"
                    value={flightData.airline}
                    onChange={(e) =>
                      setFlightData((prev) => ({
                        ...prev,
                        airline: e.target.value,
                      }))
                    }
                    placeholder="e.g., American Airlines"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="flightNumber">Flight Number *</Label>
                  <Input
                    id="flightNumber"
                    value={flightData.flightNumber}
                    onChange={(e) =>
                      setFlightData((prev) => ({
                        ...prev,
                        flightNumber: e.target.value,
                      }))
                    }
                    placeholder="e.g., AA-924"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Flight Type</Label>
                  <Select
                    value={flightData.type}
                    onValueChange={(value) =>
                      setFlightData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Direct">Direct</SelectItem>
                      <SelectItem value="1 Stop">1 Stop</SelectItem>
                      <SelectItem value="2+ Stops">2+ Stops</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={flightData.duration}
                    onChange={(e) =>
                      setFlightData((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    placeholder="e.g., 1h 20m"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  value={flightData.price}
                  onChange={(e) =>
                    setFlightData((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  placeholder="e.g., $450.00"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Departure Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Departure Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departureTime">Departure Time *</Label>
                  <Input
                    id="departureTime"
                    type="time"
                    value={flightData.departureTime}
                    onChange={(e) =>
                      setFlightData((prev) => ({
                        ...prev,
                        departureTime: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="departureDate">Departure Date</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    value={flightData.departureDate}
                    onChange={(e) =>
                      setFlightData((prev) => ({
                        ...prev,
                        departureDate: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departureCode">Airport Code</Label>
                  <Input
                    id="departureCode"
                    value={flightData.departureCode}
                    onChange={(e) =>
                      setFlightData((prev) => ({
                        ...prev,
                        departureCode: e.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="e.g., JFK"
                    maxLength={3}
                  />
                </div>
                <div>
                  <Label htmlFor="departureCity">City</Label>
                  <Input
                    id="departureCity"
                    value={flightData.departureCity}
                    onChange={(e) =>
                      setFlightData((prev) => ({
                        ...prev,
                        departureCity: e.target.value,
                      }))
                    }
                    placeholder="e.g., New York"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Arrival Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Arrival Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="arrivalTime">Arrival Time *</Label>
                  <Input
                    id="arrivalTime"
                    type="time"
                    value={flightData.arrivalTime}
                    onChange={(e) =>
                      setFlightData((prev) => ({
                        ...prev,
                        arrivalTime: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="arrivalDate">Arrival Date</Label>
                  <Input
                    id="arrivalDate"
                    type="date"
                    value={flightData.arrivalDate}
                    onChange={(e) =>
                      setFlightData((prev) => ({
                        ...prev,
                        arrivalDate: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="arrivalCode">Airport Code</Label>
                  <Input
                    id="arrivalCode"
                    value={flightData.arrivalCode}
                    onChange={(e) =>
                      setFlightData((prev) => ({
                        ...prev,
                        arrivalCode: e.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="e.g., LAX"
                    maxLength={3}
                  />
                </div>
                <div>
                  <Label htmlFor="arrivalCity">City</Label>
                  <Input
                    id="arrivalCity"
                    value={flightData.arrivalCity}
                    onChange={(e) =>
                      setFlightData((prev) => ({
                        ...prev,
                        arrivalCity: e.target.value,
                      }))
                    }
                    placeholder="e.g., Los Angeles"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Facilities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Facilities & Amenities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={facilityInput}
                  onChange={(e) => setFacilityInput(e.target.value)}
                  placeholder="Add facility (e.g., WiFi, Meals)"
                  onKeyPress={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), addFacility())
                  }
                />
                <Button type="button" onClick={addFacility} variant="outline">
                  Add
                </Button>
              </div>

              {flightData.facilities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {flightData.facilities.map((facility, index) => (
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

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={flightData.notes}
                onChange={(e) =>
                  setFlightData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Any additional notes about this flight..."
                rows={3}
              />
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 flex-1"
            >
              Add Flight to Itinerary
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
