import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
	try {
		const guidelines = await prisma.guideline.findMany({
			include: {
				category: true,
				tags: true,
			},
			orderBy: {
				id: "desc",
			},
		});

		return NextResponse.json(guidelines);
	} catch (error) {
		console.error("Error fetching guidelines:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		// Check if user is authenticated and is an admin
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{ error: "Unauthorized: You must be logged in" },
				{ status: 401 }
			);
		}

		if (session.user.role !== "ADMIN") {
			return NextResponse.json(
				{ error: "Forbidden: Admin access required" },
				{ status: 403 }
			);
		}

		const body = await request.json();
		const { title, content, categoryId, tags, references } = body;
		console.log('[API POST /api/guidelines] Received references:', JSON.stringify(references, null, 2));
		const slug = title.toLowerCase().replace(/\s+/g, "-");

		const guideline = await prisma.guideline.create({
			data: {
				title,
				content,
				slug,
				category: {
					connect: { id: categoryId },
				},
				revisions: {
					create: {
						content,
					},
				},
				tags: tags
					? {
							connect: tags.map((tagId: string) => ({ id: tagId })),
					  }
					: undefined,
				references:
					references && Array.isArray(references)
						? {
								create: references.map(
									(ref: {
										title: string;
										url?: string;
										description?: string;
									}) => ({
										title: ref.title,
										url: ref.url,
										description: ref.description,
									})
								),
						  }
						: undefined,
			},
			include: {
				category: true,
				revisions: true,
				tags: true,
				references: true,
			},
		});

		return NextResponse.json(guideline, { status: 201 });
	} catch (error) {
		console.error("Error creating guideline:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
