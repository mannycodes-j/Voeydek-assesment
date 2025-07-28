'use client'

import type React from 'react'

import { useState } from 'react'
import { Plus, MapPin, X } from 'lucide-react'
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
import type { Activity } from '@/lib/types/travel'

export function AddActivityForm() {
  const [open, setOpen] = useState(false)
  const [activityData, setActivityData] = useState({
    name: '',
    description: '',
    rating: 4.5,
    reviews: 0,
    duration: '',
    price: '',
    note: '',
    included: '',
    category: '',
    location: '',
    date: '',
    time: '',
    highlights: [] as string[],
    image: '',
    notes: '',
  })

  const [highlightInput, setHighlightInput] = useState('')
  const { addActivity } = useItineraryStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (
      !activityData.name ||
      !activityData.description ||
      !activityData.price
    ) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate date if provided
    if (activityData.date) {
      const activityDate = new Date(activityData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (activityDate < today) {
        toast.error('Activity date cannot be in the past')
        return
      }
    }

    const newActivity: Activity = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: activityData.name,
      description: activityData.description,
      rating: activityData.rating,
      reviews: activityData.reviews,
      duration: activityData.duration,
      price: activityData.price,
      note:
        activityData.note ||
        (activityData.date && activityData.time
          ? `${activityData.time} on ${new Date(
              activityData.date
            ).toLocaleDateString()}`
          : 'Time to be confirmed'),
      included: activityData.included,
      category: activityData.category,
      location: activityData.location,
      highlights: activityData.highlights,
      image:
        activityData.image ||
        '/placeholder.svg?height=120&width=120&text=Activity',
      notes: activityData.notes,
    }

    addActivity(newActivity)
    toast.success('Activity added to itinerary!')

    // Reset form
    setActivityData({
      name: '',
      description: '',
      rating: 4.5,
      reviews: 0,
      duration: '',
      price: '',
      note: '',
      included: '',
      category: '',
      location: '',
      date: '',
      time: '',
      highlights: [],
      image: '',
      notes: '',
    })
    setOpen(false)
  }

  const addHighlight = () => {
    if (
      highlightInput.trim() &&
      !activityData.highlights.includes(highlightInput.trim())
    ) {
      setActivityData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, highlightInput.trim()],
      }))
      setHighlightInput('')
    }
  }

  const removeHighlight = (highlight: string) => {
    setActivityData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((h) => h !== highlight),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Activity
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Add Activity to Itinerary
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Activity Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Activity Name *</Label>
                <Input
                  id="name"
                  value={activityData.name}
                  onChange={(e) =>
                    setActivityData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g., City Walking Tour"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={activityData.description}
                  onChange={(e) =>
                    setActivityData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe what this activity includes..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={activityData.category}
                    onValueChange={(value) =>
                      setActivityData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tours">Tours & Sightseeing</SelectItem>
                      <SelectItem value="museums">Museums & Culture</SelectItem>
                      <SelectItem value="outdoor">
                        Outdoor Activities
                      </SelectItem>
                      <SelectItem value="food">Food & Drink</SelectItem>
                      <SelectItem value="entertainment">
                        Entertainment
                      </SelectItem>
                      <SelectItem value="adventure">
                        Adventure Sports
                      </SelectItem>
                      <SelectItem value="wellness">Wellness & Spa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={activityData.location}
                    onChange={(e) =>
                      setActivityData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    placeholder="e.g., Downtown, Central Park"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={activityData.duration}
                    onChange={(e) =>
                      setActivityData((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    placeholder="e.g., 2 hours, Half day"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    value={activityData.price}
                    onChange={(e) =>
                      setActivityData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    placeholder="e.g., $45.00"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scheduling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={activityData.date}
                    onChange={(e) =>
                      setActivityData((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={activityData.time}
                    onChange={(e) =>
                      setActivityData((prev) => ({
                        ...prev,
                        time: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="note">Time Note</Label>
                <Input
                  id="note"
                  value={activityData.note}
                  onChange={(e) =>
                    setActivityData((prev) => ({
                      ...prev,
                      note: e.target.value,
                    }))
                  }
                  placeholder="e.g., 10:30 AM on Mar 19, Flexible timing"
                />
              </div>
            </CardContent>
          </Card>

          {/* Rating & Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rating & Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={activityData.rating}
                    onChange={(e) =>
                      setActivityData((prev) => ({
                        ...prev,
                        rating: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="reviews">Number of Reviews</Label>
                  <Input
                    id="reviews"
                    type="number"
                    value={activityData.reviews}
                    onChange={(e) =>
                      setActivityData((prev) => ({
                        ...prev,
                        reviews: Number(e.target.value),
                      }))
                    }
                    placeholder="e.g., 150"
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Included */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="included">Included in Price</Label>
                <Textarea
                  id="included"
                  value={activityData.included}
                  onChange={(e) =>
                    setActivityData((prev) => ({
                      ...prev,
                      included: e.target.value,
                    }))
                  }
                  placeholder="e.g., Professional guide, entrance fees, refreshments"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Highlights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  placeholder="Add highlight (e.g., Skip-the-line access)"
                  onKeyPress={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), addHighlight())
                  }
                />
                <Button type="button" onClick={addHighlight} variant="outline">
                  Add
                </Button>
              </div>

              {activityData.highlights.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activityData.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm"
                    >
                      {highlight}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-green-600"
                        onClick={() => removeHighlight(highlight)}
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
                  value={activityData.image}
                  onChange={(e) =>
                    setActivityData((prev) => ({
                      ...prev,
                      image: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/activity-image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={activityData.notes}
                  onChange={(e) =>
                    setActivityData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="Any additional notes about this activity..."
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
              Add Activity to Itinerary
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
