import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

// Define slugify function directly to avoid import issues
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')
  
  try {
    // Clean up existing data
    console.log('Cleaning up existing data...')
    
    // Delete in the correct order to respect foreign key constraints
    await prisma.reference.deleteMany()
    await prisma.revision.deleteMany()
    await prisma.guideline.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()
    await prisma.tag.deleteMany()
    
    // Create admin user
    console.log('Creating admin user...')
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123'
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    
    await prisma.user.create({
      data: {
        email: 'admin@stgwiki.com',
        name: 'Admin User',
        hashedPassword,
        role: 'ADMIN',
      },
    })
    console.log('Admin user created successfully')
    
    // Create common tags
    console.log('Creating common tags...')
    const tags = await Promise.all([
      prisma.tag.create({ data: { name: 'Urgent', slug: 'urgent' } }),
      prisma.tag.create({ data: { name: 'Pediatric', slug: 'pediatric' } }),
      prisma.tag.create({ data: { name: 'Chronic', slug: 'chronic' } }),
      prisma.tag.create({ data: { name: 'Acute', slug: 'acute' } }),
      prisma.tag.create({ data: { name: 'Preventive', slug: 'preventive' } }),
      prisma.tag.create({ data: { name: 'Emergency', slug: 'emergency' } }),
      prisma.tag.create({ data: { name: 'Surgical', slug: 'surgical' } }),
      prisma.tag.create({ data: { name: 'Medication', slug: 'medication' } }),
      prisma.tag.create({ data: { name: 'Diagnostic', slug: 'diagnostic' } }),
      prisma.tag.create({ data: { name: 'Infectious', slug: 'infectious' } })
    ])
    console.log('Common tags created successfully')
    
    // Parse Guidelines.md file
    console.log('Parsing Guidelines.md file...')
    let guidelinesPath = path.join(__dirname, '..', '..', 'standard-treatment-guideline', 'data', 'Guidelines.md')
    
    // Check if the file exists at the path, if not try an alternative path
    if (!fs.existsSync(guidelinesPath)) {
      guidelinesPath = path.join(__dirname, '..', 'standard-treatment-guideline', 'data', 'Guidelines.md')
      
      // If still not found, try another path
      if (!fs.existsSync(guidelinesPath)) {
        console.error('Guidelines.md file not found. Please check the path.')
        return
      }
    }
    
    const guidelinesContent = fs.readFileSync(guidelinesPath, 'utf8')
    
    // Parse categories and guidelines
    const categories: { name: string; guidelines: string[] }[] = []
    
    const lines = guidelinesContent.split('\n')
    let currentCategory: { name: string; guidelines: string[] } | null = null
    
    for (const line of lines) {
      if (line.startsWith('## ')) {
        // New category
        const categoryName = line.replace('## ', '').trim()
        currentCategory = { name: categoryName, guidelines: [] }
        categories.push(currentCategory)
      } else if (line.startsWith('- ') && currentCategory) {
        // New guideline
        const guidelineName = line.replace('- ', '').trim()
        currentCategory.guidelines.push(guidelineName)
      }
    }
    
    // Create categories and guidelines in the database
    for (const category of categories) {
      const categorySlug = slugify(category.name)
      
      const createdCategory = await prisma.category.create({
        data: {
          name: category.name,
          slug: categorySlug,
          description: `Guidelines for ${category.name}`,
        },
      })
      
      console.log(`Created category: ${category.name}`)
      
      // Create guidelines for this category
      // Keep track of slugs to handle duplicates
      const slugCounts: Record<string, number> = {};
      
      for (const guidelineName of category.guidelines) {
        let guidelineSlug = slugify(guidelineName)
        
        // Check if this slug already exists in this category
        if (slugCounts[guidelineSlug]) {
          // Increment the count and append it to the slug
          slugCounts[guidelineSlug]++
          guidelineSlug = `${guidelineSlug}-${slugCounts[guidelineSlug]}`
        } else {
          // First occurrence of this slug
          slugCounts[guidelineSlug] = 1
        }
        
        try {
          // Assign 1-3 random tags to each guideline
          const randomTagCount = Math.floor(Math.random() * 3) + 1
          const randomTags = tags
            .sort(() => 0.5 - Math.random()) // Shuffle array
            .slice(0, randomTagCount)       // Take random number of tags
          
          await prisma.guideline.create({
            data: {
              title: guidelineName,
              slug: guidelineSlug,
              content: `# ${guidelineName}\n\nContent for ${guidelineName} will be added later.`,
              categoryId: createdCategory.id,
              tags: {
                connect: randomTags.map(tag => ({ id: tag.id }))
              }
            },
          })
          console.log(`Created guideline: ${guidelineName} with ${randomTagCount} tags`)
        } catch (error) {
          console.error(`Error creating guideline ${guidelineName}:`, error)
        }
      }
    }
    
    console.log('Database seeding completed successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
