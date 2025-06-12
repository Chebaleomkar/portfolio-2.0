"use client"

import { clientReviews } from "@/utils/data"
import { Quote, Star } from "lucide-react"
import { memo } from "react"

export type ClientReview = {
  review: string
  by: string
  profession: string
  rating?: number
}


export const ClientReviewsSection = memo(() => {
  return (
    <section
      id="review"
      aria-labelledby="client-reviews-heading"
      className="py-16 px-4 sm:px-8 lg:px-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2
            id="client-reviews-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4"
          >
            What Clients Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real feedback from businesses I&apos;ve had the pleasure to work with
          </p>
        </div>

        {/* Horizontal scrollable container */ }
        <div className="relative">
          <div
            className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide"
            style={ {
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            } }
            role="region"
            aria-label="Client reviews carousel"
          >
            { clientReviews.map((review, index) => (
              <ReviewCard key={ `${review.by}-${index}` } review={ review } index={ index } />
            )) }
          </div>

          {/* Scroll indicators */ }
          <div className="flex justify-center mt-6 gap-2">
            { clientReviews.map((_, index) => (
              <div key={ index } className="w-2 h-2 rounded-full bg-indigo-300 dark:bg-indigo-600" aria-hidden="true" />
            )) }
          </div>
        </div>
      </div>
    </section>
  )
})

const ReviewCard = memo(({ review, index }: { review: ClientReview; index: number }) => {
  const renderStars = (rating = 5) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={ i }
        className={ `w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"}` }
        aria-hidden="true"
      />
    ))
  }

  return (
    <article
      className="flex-none w-80 sm:w-96 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 snap-start group relative overflow-hidden"
      aria-labelledby={ `review-author-${index}` }
    >

      {/* Quote icon */ }
      <div className="flex justify-between items-start mb-4">
        <Quote className="w-8 h-8 text-indigo-500 dark:text-indigo-400" aria-hidden="true" />
        <div className="flex gap-1" role="img" aria-label={ `${review.rating || 5} out of 5 stars` }>
          { renderStars(review.rating) }
        </div>
      </div>

      {/* Review text */ }
      <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 relative">
        <p className="text-sm sm:text-base line-clamp-6">{ review.review }</p>
      </blockquote>

      {/* Author info */ }
      <footer className="border-t border-gray-100 dark:border-gray-700 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            { review.by
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2) }
          </div>
          <div>
            <h3 id={ `review-author-${index}` } className="font-semibold text-gray-900 dark:text-white">
              { review.by }
            </h3>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{ review.profession }</p>
          </div>
        </div>
      </footer>
    </article>
  )
})

ClientReviewsSection.displayName = "ClientReviewsSection"
ReviewCard.displayName = "ReviewCard"
