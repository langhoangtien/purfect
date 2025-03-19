/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { REVIEWS } from "@/assets/reviews";

const INITIAL_COUNT = 10;

export default function ReviewList() {
  const [sortBy, setSortBy] = useState("helpful");
  const [filterStar, setFilterStar] = useState("0");
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [visibleReviews, setVisibleReviews] = useState(INITIAL_COUNT);

  useEffect(() => {
    const likedIds = JSON.parse(localStorage.getItem("likedIds") || "[]");
    setLikedIds(likedIds);
  }, []);

  const handleLike = (id: number) => {
    if (likedIds.includes(id)) {
      const newLikedIds = likedIds.filter((likedId) => likedId !== id);
      setLikedIds(newLikedIds);
      localStorage.setItem("likedIds", JSON.stringify(newLikedIds));
    } else {
      const newLikedIds = [...likedIds, id];
      setLikedIds(newLikedIds);
      localStorage.setItem("likedIds", JSON.stringify(newLikedIds));
    }
  };

  const filteredReviews = REVIEWS.filter(
    (review) => filterStar === "0" || review.rating === Number(filterStar)
  );

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return (b.liked || 0) - (a.liked || 0);
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-center">
        Hear from Those Who Know Us Best
      </h2>
      <p className="text-sm text-center mb-4">
        {filteredReviews.length} reviews
      </p>

      {/* Filter & Sort */}
      <div className="flex flex-col md:flex-row md:justify-between space-y-3 md:space-y-0 mb-6">
        <select
          className="border px-4 py-1 h-10 rounded w-full md:w-auto"
          value={filterStar}
          onChange={(e) => setFilterStar(e.target.value)}
        >
          <option value="0">Filter By All</option>
          {[1, 2, 3, 4, 5].map((star) => (
            <option key={star} value={star}>
              Filter By {star} Star
            </option>
          ))}
        </select>
        <select
          className="border px-4 py-1 h-10 rounded w-full md:w-auto"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="latest">Sort By Latest</option>
          <option value="helpful">Sort By Helpful</option>
        </select>
      </div>

      {/* Review List */}
      <div className="space-y-8">
        {sortedReviews.slice(0, visibleReviews).map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <p className="font-bold text-lg">{review.customer}</p>
                <div className="flex text-yellow-400">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
              </div>
              <span className="text-gray-800 text-sm mt-1 md:mt-0">
                {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                }).format(new Date(review.createdAt))}
              </span>
            </div>

            <p className="font-bold mt-2 text-base">{review.title}</p>
            <p className="text-gray-700">{review.body}</p>

            {/* Media */}
            {(review.images?.length || review.videos?.length) && (
              <div className="flex flex-wrap gap-2 mt-3">
                {review.images?.map((url, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 md:w-24 md:h-24 border border-gray-300 rounded-md"
                  >
                    <img
                      src={url}
                      alt="review image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {review.videos?.map((url, i) => (
                  <video
                    key={i}
                    className="relative w-20 h-20 md:w-24 md:h-24 border border-gray-300 rounded-md"
                    controls
                  >
                    <source src={url} type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ video.
                  </video>
                ))}
              </div>
            )}

            {/* Helpful */}
            <div className="flex items-center space-x-2 mt-3">
              <button onClick={() => handleLike(review.id)}>
                {likedIds.includes(review.id) ? (
                  <ThumbsUp className="w-4 h-4 text-blue-500" />
                ) : (
                  <ThumbsUp className="w-4 h-4 text-gray-700" />
                )}
              </button>
              <span className="text-gray-400">
                {likedIds.includes(review.id)
                  ? (review.liked || 0) + 1
                  : review.liked || "Helpful?"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {visibleReviews < sortedReviews.length && (
        <div className="text-center mt-6">
          <button
            onClick={() => setVisibleReviews((prev) => prev + 15)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
