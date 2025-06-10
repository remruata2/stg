import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ slug: string }>; // params is now a Promise in Next.js 15
}

export async function GET(
  request: Request,
  { params: paramsPromise }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    
    // For admin views, we require authentication
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await paramsPromise
    
    console.log('Fetching guideline with slug:', slug)
    
    const guideline = await prisma.guideline.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: true,
        references: true,
        revisions: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    })
    
    console.log('Guideline found:', guideline ? 'Yes' : 'No')

    if (!guideline) {
      return NextResponse.json({ error: 'Guideline not found' }, { status: 404 })
    }

    return NextResponse.json(guideline)
  } catch (error) {
    console.error('Error fetching guideline by slug:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
