import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { parasolDb } from '@/lib/db';

const createRobustnessSchema = z.object({
  useCaseId: z.string().min(1, 'Use case ID is required'),
  content: z.string().min(1, 'Robustness diagram content is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createRobustnessSchema.parse(body);

    // Check if robustness diagram already exists for this use case
    const existing = await parasolDb.robustnessDiagram.findUnique({
      where: { useCaseId: validatedData.useCaseId }
    });

    if (existing) {
      // Update existing robustness diagram
      const updated = await parasolDb.robustnessDiagram.update({
        where: { useCaseId: validatedData.useCaseId },
        data: {
          content: validatedData.content,
          updatedAt: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        data: updated,
        message: 'Robustness diagram updated successfully'
      });
    }

    // Create new robustness diagram
    const robustness = await parasolDb.robustnessDiagram.create({
      data: {
        useCaseId: validatedData.useCaseId,
        content: validatedData.content,
      }
    });

    return NextResponse.json({
      success: true,
      data: robustness,
      message: 'Robustness diagram created successfully'
    }, { status: 201 });

  } catch (_error) {
    console.error('Error creating robustness diagram:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: error.issues
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const useCaseId = searchParams.get('useCaseId');

    if (useCaseId) {
      // Get robustness diagram for specific use case
      const robustness = await parasolDb.robustnessDiagram.findUnique({
        where: { useCaseId }
      });

      if (!robustness) {
        return NextResponse.json({
          success: false,
          error: 'Robustness diagram not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: robustness
      });
    }

    // Get all robustness diagrams
    const robustnessDiagrams = await parasolDb.robustnessDiagram.findMany({
      include: {
        useCase: {
          select: {
            name: true,
            displayName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: robustnessDiagrams
    });

  } catch (_error) {
    console.error('Error fetching robustness diagrams:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}
