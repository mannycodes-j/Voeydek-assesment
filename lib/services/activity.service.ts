import type { ActivitySearchParams, ActivityItem } from "../types/api"
import type { Activity } from "../types/travel"

class ActivityService {
  // For now, using mock data since activities endpoint structure wasn't provided
  

  async searchActivities(params: ActivitySearchParams): Promise<Activity[]> {
    try {

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockActivities: ActivityItem[] = [
        {
          id: "1",
          name: "The Museum of Modern Art",
          description:
            "Works from Van Gogh to Warhol & beyond plus a sculpture garden, 2 cafes & the modern restaurant.",
          location: params.destination,
          rating: 4.5,
          reviews: 430,
          duration: "2-3 hours",
          price: "$25.00",
          category: "Museums & Culture",
          image: "/placeholder.svg?height=200&width=300&text=Modern+Art+Museum",
          highlights: ["Skip-the-line access", "Audio guide included", "Free WiFi"],
          included: "Admission to the museum and audio guide",
        },
        {
          id: "2",
          name: "Central Park Walking Tour",
          description: "Explore the iconic Central Park with a knowledgeable local guide and discover hidden gems.",
          location: params.destination,
          rating: 4.7,
          reviews: 892,
          duration: "2 hours",
          price: "$35.00",
          category: "Tours & Sightseeing",
          image: "/placeholder.svg?height=200&width=300&text=Central+Park",
          highlights: ["Professional guide", "Small group size", "Photo opportunities"],
          included: "Professional guide and photo opportunities",
        },
        {
          id: "3",
          name: "Food Market Tour",
          description: "Taste your way through local markets and discover authentic flavors with a food expert.",
          location: params.destination,
          rating: 4.8,
          reviews: 654,
          duration: "3 hours",
          price: "$65.00",
          category: "Food & Drink",
          image: "/placeholder.svg?height=200&width=300&text=Food+Market",
          highlights: ["Local food tastings", "Market insights", "Recipe cards"],
          included: "Food tastings, market guide, and recipe cards",
        },
      ]

      // Filter by category if specified
      let filteredActivities = mockActivities
      if (params.category && params.category !== "all") {
        filteredActivities = mockActivities.filter((activity) =>
          activity.category.toLowerCase().includes(params.category!.toLowerCase()),
        )
      }

      return filteredActivities.map(this.transformActivityData)
    } catch (error) {
      console.error("Error searching activities:", error)
      throw new Error("Failed to search activities. Please try again.")
    }
  }

  async getActivityDetails(activityId: string): Promise<Activity | null> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mockActivity: ActivityItem = {
        id: activityId,
        name: "Detailed Activity",
        description: "Detailed description of the activity with more information.",
        location: "City Center",
        rating: 4.6,
        reviews: 234,
        duration: "4 hours",
        price: "$85.00",
        category: "Adventure",
        image: "/placeholder.svg?height=200&width=300&text=Activity+Details",
        highlights: ["Expert guide", "Equipment included", "Small groups"],
        included: "All equipment, professional guide, and refreshments",
      }

      return this.transformActivityData(mockActivity)
    } catch (error) {
      console.error("Error getting activity details:", error)
      return null
    }
  }

  private transformActivityData = (apiActivity: ActivityItem): Activity => {
    return {
      id: apiActivity.id,
      name: apiActivity.name,
      description: apiActivity.description,
      rating: apiActivity.rating,
      reviews: apiActivity.reviews,
      duration: apiActivity.duration,
      price: apiActivity.price,
      note: "Time to be confirmed",
      included: apiActivity.included,
      category: apiActivity.category,
      location: apiActivity.location,
      highlights: apiActivity.highlights,
      image: apiActivity.image,
    }
  }

  // Method to get activity categories
  getActivityCategories(): Array<{ value: string; label: string }> {
    return [
      { value: "all", label: "All Categories" },
      { value: "museums", label: "Museums & Culture" },
      { value: "tours", label: "Tours & Sightseeing" },
      { value: "outdoor", label: "Outdoor Activities" },
      { value: "food", label: "Food & Drink" },
      { value: "entertainment", label: "Entertainment" },
      { value: "adventure", label: "Adventure Sports" },
      { value: "wellness", label: "Wellness & Spa" },
    ]
  }
}

export const activityService = new ActivityService()
