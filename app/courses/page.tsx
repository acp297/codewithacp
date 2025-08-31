'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Video, Star, Clock, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

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
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [priceFilter, setPriceFilter] = useState<string>('all')

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Complete Web Development Bootcamp',
        description: 'Master HTML, CSS, JavaScript, React, and Node.js from scratch',
        slug: 'web-development-bootcamp',
        price: 49,
        level: 'BEGINNER',
        duration: 1440, // 24 hours in minutes
        instructor: 'John Doe',
        category: 'Web Development',
        rating: 4.8,
        reviewCount: 2100,
        isFree: false,
      },
      {
        id: '2',
        title: 'Advanced JavaScript & TypeScript',
        description: 'Deep dive into modern JavaScript features and TypeScript',
        slug: 'advanced-javascript-typescript',
        price: 79,
        level: 'INTERMEDIATE',
        duration: 1080, // 18 hours in minutes
        instructor: 'Jane Smith',
        category: 'Programming',
        rating: 4.9,
        reviewCount: 1800,
        isFree: false,
      },
      {
        id: '3',
        title: 'Full-Stack Development with Next.js',
        description: 'Build modern web applications with Next.js, Prisma, and Stripe',
        slug: 'fullstack-nextjs',
        price: 99,
        level: 'ADVANCED',
        duration: 1920, // 32 hours in minutes
        instructor: 'Mike Johnson',
        category: 'Web Development',
        rating: 4.7,
        reviewCount: 1500,
        isFree: false,
      },
      {
        id: '4',
        title: 'Python for Data Science',
        description: 'Learn Python programming for data analysis and machine learning',
        slug: 'python-data-science',
        price: 0,
        level: 'BEGINNER',
        duration: 900, // 15 hours in minutes
        instructor: 'Sarah Wilson',
        category: 'Data Science',
        rating: 4.6,
        reviewCount: 1200,
        isFree: true,
      },
    ]
    setCourses(mockCourses)
    setFilteredCourses(mockCourses)
  }, [])

  // Filter courses based on search and filters
  useEffect(() => {
    let filtered = courses

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === selectedLevel)
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory)
    }

    // Price filter
    if (priceFilter === 'free') {
      filtered = filtered.filter(course => course.isFree)
    } else if (priceFilter === 'paid') {
      filtered = filtered.filter(course => !course.isFree)
    }

    setFilteredCourses(filtered)
  }, [courses, searchTerm, selectedLevel, selectedCategory, priceFilter])

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Courses</h1>
          <p className="text-xl text-gray-600">
            Discover the perfect course to advance your skills
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Level Filter */}
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="BEGINNER">Beginner</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                <SelectItem value="ADVANCED">Advanced</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Web Development">Web Development</SelectItem>
                <SelectItem value="Programming">Programming</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Mobile Development">Mobile Development</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Filter */}
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-600"></div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getLevelColor(course.level)}>
                    {course.level}
                  </Badge>
                  <span className="text-2xl font-bold text-primary-600">
                    {course.isFree ? 'Free' : formatPrice(course.price)}
                  </span>
                </div>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Video className="h-4 w-4 mr-1" />
                      {formatDuration(course.duration)}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                      {course.rating} ({course.reviewCount})
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    By {course.instructor}
                  </div>
                  <Link href={`/courses/${course.slug}`}>
                    <Button className="w-full">
                      {course.isFree ? 'Enroll Free' : 'Enroll Now'}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
