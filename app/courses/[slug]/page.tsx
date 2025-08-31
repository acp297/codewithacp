'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PaymentForm } from '@/components/payment/payment-form'
import { Video, Star, Clock, User, CheckCircle, Play } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { useSession } from 'next-auth/react'

interface Chapter {
  id: string
  title: string
  description?: string
  duration: number
  isFree: boolean
  position: number
}

interface Course {
  id: string
  title: string
  description: string
  slug: string
  thumbnail?: string
  price: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  duration: number
  instructor: string
  category: string
  rating: number
  reviewCount: number
  isFree: boolean
  chapters: Chapter[]
  createdAt: string
  updatedAt: string
}

export default function CourseDetailPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [course, setCourse] = useState<Course | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockCourse: Course = {
      id: '1',
      title: 'Complete Web Development Bootcamp',
      description: 'Master HTML, CSS, JavaScript, React, and Node.js from scratch. This comprehensive course will take you from beginner to advanced web developer with hands-on projects and real-world examples.',
      slug: 'web-development-bootcamp',
      price: 49,
      level: 'BEGINNER',
      duration: 1440, // 24 hours in minutes
      instructor: 'John Doe',
      category: 'Web Development',
      rating: 4.8,
      reviewCount: 2100,
      isFree: false,
      chapters: [
        {
          id: '1',
          title: 'Introduction to Web Development',
          description: 'Learn the basics of web development and set up your development environment',
          duration: 45,
          isFree: true,
          position: 1,
        },
        {
          id: '2',
          title: 'HTML Fundamentals',
          description: 'Master HTML structure, elements, and semantic markup',
          duration: 120,
          isFree: false,
          position: 2,
        },
        {
          id: '3',
          title: 'CSS Styling and Layout',
          description: 'Learn CSS styling, flexbox, grid, and responsive design',
          duration: 180,
          isFree: false,
          position: 3,
        },
        {
          id: '4',
          title: 'JavaScript Basics',
          description: 'Understand JavaScript fundamentals, variables, functions, and DOM manipulation',
          duration: 240,
          isFree: false,
          position: 4,
        },
        {
          id: '5',
          title: 'React.js Framework',
          description: 'Build modern user interfaces with React components and hooks',
          duration: 300,
          isFree: false,
          position: 5,
        },
        {
          id: '6',
          title: 'Node.js Backend Development',
          description: 'Create server-side applications with Node.js and Express',
          duration: 240,
          isFree: false,
          position: 6,
        },
        {
          id: '7',
          title: 'Database Integration',
          description: 'Connect your applications to databases and handle data',
          duration: 180,
          isFree: false,
          position: 7,
        },
        {
          id: '8',
          title: 'Deployment and Hosting',
          description: 'Deploy your applications to production and learn about hosting options',
          duration: 135,
          isFree: false,
          position: 8,
        },
      ],
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    }

    setCourse(mockCourse)
  }, [params.slug])

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const handleEnroll = () => {
    if (!session) {
      // Redirect to sign in
      window.location.href = '/auth/signin'
      return
    }

    if (course?.isFree) {
      // Handle free enrollment
      setIsEnrolled(true)
    } else {
      // Show payment form
      setShowPayment(true)
    }
  }

  const handlePaymentSuccess = () => {
    setIsEnrolled(true)
    setShowPayment(false)
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Badge className={getLevelColor(course.level)}>
                  {course.level}
                </Badge>
                <Badge variant="secondary">{course.category}</Badge>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{course.description}</p>
              
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {course.instructor}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDuration(course.duration)}
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                  {course.rating} ({course.reviewCount} reviews)
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Last updated: {formatDate(course.updatedAt)}
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      {course.isFree ? 'Free' : formatPrice(course.price)}
                    </div>
                    {!course.isFree && (
                      <div className="text-sm text-gray-500 line-through">
                        {formatPrice(course.price * 1.5)}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEnrolled ? (
                    <Button className="w-full" disabled>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Enrolled
                    </Button>
                  ) : (
                    <Button onClick={handleEnroll} className="w-full" size="lg">
                      {course.isFree ? 'Enroll Free' : 'Enroll Now'}
                    </Button>
                  )}
                  
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Full lifetime access
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Access on mobile and TV
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Certificate of completion
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      30-day money-back guarantee
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {course.chapters.length} chapters • {formatDuration(course.duration)} total length
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {course.chapters.map((chapter, index) => (
                    <div
                      key={chapter.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium">{chapter.title}</h3>
                          {chapter.description && (
                            <p className="text-sm text-gray-600">{chapter.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {formatDuration(chapter.duration)}
                        </span>
                        {chapter.isFree ? (
                          <Badge variant="secondary">Free</Badge>
                        ) : (
                          <Play className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          {showPayment && (
            <div className="lg:col-span-1">
              <PaymentForm
                amount={course.price}
                courseId={course.id}
                onSuccess={handlePaymentSuccess}
                onError={(error) => {
                  console.error('Payment error:', error)
                  setShowPayment(false)
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
