"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Star, StarIcon, User, Calendar } from "lucide-react"
import { reviewService, ProductReview, ReviewStats } from "@/lib/review-service"
import { createClient } from "@/lib/supabase/client"

interface ReviewSectionProps {
  productId: string
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<ProductReview[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [userReview, setUserReview] = useState<ProductReview | null>(null)
  const [hasPurchased, setHasPurchased] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [productId])

  const fetchData = async () => {
    try {
      const supabase = createClient()
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)

      const [reviewsData, statsData, userReviewData, hasPurchasedData] = await Promise.all([
        reviewService.getProductReviews(productId),
        reviewService.getReviewStats(productId),
        currentUser ? reviewService.getUserReview(productId) : Promise.resolve(null),
        currentUser ? reviewService.hasUserPurchasedProduct(productId) : Promise.resolve(false)
      ])

      setReviews(reviewsData)
      setStats(statsData)
      setUserReview(userReviewData)
      setHasPurchased(hasPurchasedData)
    } catch (error) {
      console.error("Error fetching review data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading reviews...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Review Stats */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{stats.average_rating}</div>
                <div className="flex items-center justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(stats.average_rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Based on {stats.total_reviews} review{stats.total_reviews !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <span className="text-sm w-8">{rating}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: `${stats.total_reviews > 0 ? (stats.rating_distribution[rating as keyof typeof stats.rating_distribution] / stats.total_reviews) * 100 : 0}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">
                      {stats.rating_distribution[rating as keyof typeof stats.rating_distribution]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Write Review Button */}
      {user && hasPurchased && !userReview && (
        <WriteReviewDialog productId={productId} onReviewAdded={fetchData} />
      )}

      {/* User's Review */}
      {userReview && (
        <Card>
          <CardHeader>
            <CardTitle>Your Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= userReview.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(userReview.created_at).toLocaleDateString()}
                </span>
              </div>
              {userReview.title && (
                <h4 className="font-semibold">{userReview.title}</h4>
              )}
              {userReview.comment && (
                <p className="text-muted-foreground">{userReview.comment}</p>
              )}
              <div className="flex space-x-2">
                <EditReviewDialog 
                  review={userReview} 
                  onReviewUpdated={fetchData}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this review?")) {
                      await reviewService.deleteReview(userReview.id)
                      fetchData()
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-6 last:border-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">
                          {review.user_profiles?.first_name 
                            ? `${review.user_profiles.first_name} ${review.user_profiles.last_name || ''}`.trim()
                            : 'Anonymous User'
                          }
                        </span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                      {review.title && (
                        <h4 className="font-semibold mb-2">{review.title}</h4>
                      )}
                      {review.comment && (
                        <p className="text-muted-foreground">{review.comment}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function WriteReviewDialog({ productId, onReviewAdded }: { productId: string; onReviewAdded: () => void }) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return

    setLoading(true)
    try {
      await reviewService.addReview(productId, rating, title || undefined, comment || undefined)
      setOpen(false)
      setRating(0)
      setTitle("")
      setComment("")
      onReviewAdded()
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Write a Review</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Rating *</Label>
            <div className="flex space-x-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
            />
          </div>
          
          <div>
            <Label htmlFor="comment">Review (Optional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience with this product"
              rows={4}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={rating === 0 || loading}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EditReviewDialog({ review, onReviewUpdated }: { review: ProductReview; onReviewUpdated: () => void }) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(review.rating)
  const [title, setTitle] = useState(review.title || "")
  const [comment, setComment] = useState(review.comment || "")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return

    setLoading(true)
    try {
      await reviewService.updateReview(review.id, rating, title || undefined, comment || undefined)
      setOpen(false)
      onReviewUpdated()
    } catch (error) {
      console.error("Error updating review:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Rating *</Label>
            <div className="flex space-x-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
            />
          </div>
          
          <div>
            <Label htmlFor="edit-comment">Review</Label>
            <Textarea
              id="edit-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience with this product"
              rows={4}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={rating === 0 || loading}
            >
              {loading ? "Updating..." : "Update Review"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
