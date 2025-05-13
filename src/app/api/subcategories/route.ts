import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Redirect to categories API
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const categoryId = url.searchParams.get('categoryId')
    
    if (categoryId) {
      // Get the specific category
      const category = await prisma.category.findUnique({
        where: {
          id: categoryId
        },
        include: {
          _count: {
            select: {
              guidelines: true
            }
          }
        }
      })
      
      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json([category])
    } else {
      // Redirect to all categories
      return NextResponse.redirect(new URL('/api/categories', request.url))
    }
  } catch (error) {
    console.error('Error handling subcategories redirect:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Subcategories have been deprecated. Please use categories API instead.' },
      { status: 500 }
    )
  }
}

// Redirect POST requests to categories API
export async function POST(request: Request) {
  return NextResponse.json(
    { error: 'Not Found', message: 'Subcategories have been deprecated. Please use categories API instead.' },
    { status: 410 }
  )
}
