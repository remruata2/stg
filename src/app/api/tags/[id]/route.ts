import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface RouteParams {
  params: {
    id: string
  }
}

// Get a specific tag
export async function GET(request: Request, { params }: RouteParams) {
  try {
    // In Next.js 15, we need to ensure params is fully resolved
    const resolvedParams = await Promise.resolve(params);
    
    const tag = await prisma.tag.findUnique({
      where: { id: resolvedParams.id },
      include: {
        _count: {
          select: { guidelines: true }
        }
      }
    })

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(tag)
  } catch (error) {
    console.error('Error fetching tag:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// Update a tag
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

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    // Update the tag
    const updatedTag = await prisma.tag.update({
      where: { id: resolvedParams.id },
      data: {
        name,
        description,
        slug
      }
    })

    return NextResponse.json(updatedTag)
  } catch (error) {
    console.error('Error updating tag:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// Delete a tag
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

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    // First, disconnect the tag from all guidelines
    // Find all guidelines that have this tag
    const guidelinesWithTag = await prisma.guideline.findMany({
      where: {
        tags: {
          some: {
            id: resolvedParams.id
          }
        }
      },
      select: { id: true }
    })
    
    // Disconnect the tag from each guideline
    if (guidelinesWithTag.length > 0) {
      await prisma.$transaction(
        guidelinesWithTag.map(guideline => 
          prisma.guideline.update({
            where: { id: guideline.id },
            data: {
              tags: {
                disconnect: { id: resolvedParams.id }
              }
            }
          })
        )
      )
    }

    // Then delete the tag
    await prisma.tag.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
