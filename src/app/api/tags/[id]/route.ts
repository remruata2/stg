import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ id: string }>; // params is now a Promise
}

// Get a specific tag
export async function GET(request: Request, { params: paramsPromise }: RouteParams) {
  try {
    const { id } = await paramsPromise; // Await the promise to get id
    
    const tag = await prisma.tag.findUnique({
      where: { id },
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
export async function PUT(request: Request, { params: paramsPromise }: RouteParams) {
  try {
    const { id } = await paramsPromise; // Await the promise to get id
    
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
      where: { id }
    })

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    // Update the tag
    const updatedTag = await prisma.tag.update({
      where: { id },
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
export async function DELETE(request: Request, { params: paramsPromise }: RouteParams) {
  try {
    const { id } = await paramsPromise; // Await the promise to get id
    
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
      where: { id }
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
            id: id
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
                disconnect: { id: id }
              }
            }
          })
        )
      )
    }

    // Then delete the tag
    await prisma.tag.delete({
      where: { id }
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
