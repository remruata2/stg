import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    // Search for guidelines
    const guidelines = await prisma.guideline.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        category: true
      },
      take: 5,
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Search for categories
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 3,
      orderBy: {
        name: 'asc'
      }
    })

    // Format results
    const results = [
      ...guidelines.map(guideline => ({
        id: guideline.id,
        title: guideline.title,
        slug: guideline.slug,
        type: 'guideline' as const,
        path: `/guidelines/${guideline.slug}`,
        categoryName: guideline.category.name
      })),
      ...categories.map(category => ({
        id: category.id,
        title: category.name,
        slug: category.slug,
        type: 'category' as const,
        path: `/categories/${category.slug}`
      }))
    ]

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 })
  }
}
