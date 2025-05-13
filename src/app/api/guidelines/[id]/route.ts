import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface RouteParams {
  params: {
    id: string
  }
}

// Get a specific guideline
export async function GET(request: Request, { params }: RouteParams) {
  try {
    // In Next.js 15, we need to ensure params is fully resolved
    const resolvedParams = await Promise.resolve(params);
    
    const guideline = await prisma.guideline.findUnique({
      where: { id: resolvedParams.id },
      include: {
        category: true,
        tags: true
      }
    })

    if (!guideline) {
      return NextResponse.json(
        { error: 'Guideline not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(guideline)
  } catch (error) {
    console.error('Error fetching guideline:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// Update a guideline
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
    
    const { title, content, categoryId, tagIds } = await request.json()
    const slug = title.toLowerCase().replace(/\s+/g, '-')

    // Check if guideline exists
    const existingGuideline = await prisma.guideline.findUnique({
      where: { id: resolvedParams.id },
      include: {
        tags: true
      }
    })

    if (!existingGuideline) {
      return NextResponse.json(
        { error: 'Guideline not found' },
        { status: 404 }
      )
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Get current tag IDs
    const currentTagIds = existingGuideline.tags.map((tag: { id: string }) => tag.id)
    
    // Determine which tags to connect and disconnect
    const tagsToConnect = tagIds.filter((id: string) => !currentTagIds.includes(id))
    const tagsToDisconnect = currentTagIds.filter((id: string) => !tagIds.includes(id))

    // Update the guideline
    const updatedGuideline = await prisma.guideline.update({
      where: { id: resolvedParams.id },
      data: {
        title,
        content,
        slug,
        categoryId,
        tags: {
          connect: tagsToConnect.map((id: string) => ({ id })),
          disconnect: tagsToDisconnect.map((id: string) => ({ id }))
        }
      },
      include: {
        category: true,
        tags: true
      }
    })

    return NextResponse.json(updatedGuideline)
  } catch (error) {
    console.error('Error updating guideline:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// Delete a guideline
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

    // Check if guideline exists
    const existingGuideline = await prisma.guideline.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!existingGuideline) {
      return NextResponse.json(
        { error: 'Guideline not found' },
        { status: 404 }
      )
    }

    // Delete the guideline
    await prisma.guideline.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting guideline:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
