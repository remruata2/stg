import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface RouteParams {
  params: {
    id: string
  }
}

// Get a specific category
export async function GET(request: Request, { params }: RouteParams) {
  try {
    // In Next.js 15, we need to ensure params is fully resolved
    const resolvedParams = await Promise.resolve(params);
    
    const category = await prisma.category.findUnique({
      where: { id: resolvedParams.id },
      include: {
        guidelines: {
          select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            updatedAt: true
          }
        },
        _count: {
          select: { guidelines: true }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// Update a category
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    // In Next.js 15, we need to ensure params is fully resolved
    const resolvedParams = await Promise.resolve(params);
    
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: You must be logged in' },
        { status: 401 }
      )
    }
    
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }
    
    const { name, description } = await request.json()
    const slug = name.toLowerCase().replace(/\s+/g, '-')

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Update the category
    const updatedCategory = await prisma.category.update({
      where: { id: resolvedParams.id },
      data: {
        name,
        description,
        slug
      }
    })

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// Delete a category
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    // In Next.js 15, we need to ensure params is fully resolved
    const resolvedParams = await Promise.resolve(params);
    
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: You must be logged in' },
        { status: 401 }
      )
    }
    
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: resolvedParams.id },
      include: {
        guidelines: true
      }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Delete all related guidelines
    // This is a cascading delete operation
    await prisma.category.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
