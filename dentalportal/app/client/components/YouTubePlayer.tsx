'use client'

import { useEffect, useState } from 'react'
import { PlayCircle, ExternalLink } from 'lucide-react'

interface YouTubePlayerProps {
  url: string
  title: string
  className?: string
}

export default function YouTubePlayer({ url, title, className = '' }: YouTubePlayerProps) {
  const [videoId, setVideoId] = useState<string | null>(null)
  const [showEmbed, setShowEmbed] = useState(false)

  useEffect(() => {
    // Extract video ID from YouTube URL
    const extractVideoId = (youtubeUrl: string): string | null => {
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
        /youtu\.be\/([^&\n?#]+)/
      ]
      
      for (const pattern of patterns) {
        const match = youtubeUrl.match(pattern)
        if (match && match[1]) {
          return match[1]
        }
      }
      return null
    }

    const id = extractVideoId(url)
    setVideoId(id)
  }, [url])

  if (!videoId) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 bg-gray-100 rounded-xl border border-gray-200 ${className}`}>
        <ExternalLink className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-600 mb-4">Video link available</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <PlayCircle className="w-4 h-4 mr-2" />
          Open Video Link
        </a>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <div className="bg-black rounded-xl overflow-hidden shadow-lg">
        {showEmbed ? (
          <div className="relative pt-[56.25%] h-0">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
              title={title}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div 
            className="relative pt-[56.25%] h-0 cursor-pointer group"
            onClick={() => setShowEmbed(true)}
          >
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                onError={(e) => {
                  e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                }}
              />
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-8 h-8 text-white" />
                </div>
                <p className="text-white font-medium">Click to load YouTube video</p>
                <p className="text-white/70 text-sm mt-2">Video will be embedded in this page</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {showEmbed && (
        <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-sm text-emerald-700 flex items-center">
            <span className="mr-2">⚠️</span>
            Video is playing directly from YouTube. For best experience, use fullscreen mode.
          </p>
        </div>
      )}
    </div>
  )
}