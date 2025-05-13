import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: {
    id: string
  }
}

// Redirect to categories API
export async function GET(request: Request, { params }: RouteParams) {
  try {
    // Return a message indicating that subcategories have been deprecated
    return NextResponse.json(
      { error: 'Not Found', message: 'Subcategories have been deprecated. Please use categories API instead.' },
      { status: 410 }
    )
  } catch (error) {
    console.error('Error handling subcategory redirect:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// Redirect PUT requests to categories API
export async function PUT(request: Request, { params }: RouteParams) {
  return NextResponse.json(
    { error: 'Not Found', message: 'Subcategories have been deprecated. Please use categories API instead.' },
    { status: 410 }
  )
}

// Redirect DELETE requests to categories API
export async function DELETE(request: Request, { params }: RouteParams) {
  return NextResponse.json(
    { error: 'Not Found', message: 'Subcategories have been deprecated. Please use categories API instead.' },
    { status: 410 }
  )
}
