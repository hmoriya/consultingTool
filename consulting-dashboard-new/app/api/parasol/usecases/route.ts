import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { parasolDb } from '@/lib/db';

const createUseCaseSchema = z.object({
  operationId: z.string().min(1, 'Operation ID is required'),
  name: z.string().min(1, 'Use case name is required'),
  displayName: z.string().min(1, 'Display name is required'),
  description: z.string().optional(),
  definition: z.string().min(1, 'Use case definition is required'),
  order: z.number().int().positive().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received usecase data:', JSON.stringify(body, null, 2));
    const validatedData = createUseCaseSchema.parse(body);

    // Check if use case with same name already exists for this operation
    const existing = await parasolDb.useCase.findFirst({
      where: {
        operationId: validatedData.operationId,
        name: validatedData.name
      }
    });

    if (existing) {
      // Update existing use case
      const updated = await parasolDb.useCase.update({
        where: { id: existing.id },
        data: {
          displayName: validatedData.displayName,
          description: validatedData.description,
          definition: validatedData.definition,
          order: validatedData.order,
          updatedAt: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        data: updated,
        message: 'Use case updated successfully'
      });
    }

    // Create new use case
    const useCase = await parasolDb.useCase.create({
      data: {
        operationId: validatedData.operationId,
        name: validatedData.name,
        displayName: validatedData.displayName,
        description: validatedData.description,
        definition: validatedData.definition,
        order: validatedData.order,
      }
    });

    return NextResponse.json({
      success: true,
      data: useCase,
      message: 'Use case created successfully'
    }, { status: 201 });

  } catch (_error) {
    console.error('Error creating use case:', error);

    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.issues);
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
    const operationId = searchParams.get('operationId');

    if (operationId) {
      // Get use cases for specific operation
      const useCases = await parasolDb.useCase.findMany({
        where: { operationId },
        include: {
          robustnessDiagram: true,
          pageDefinitions: true,
          testDefinitions: true
        },
        orderBy: {
          order: 'asc'
        }
      });

      return NextResponse.json({
        success: true,
        data: useCases
      });
    }

    // Get all use cases
    const useCases = await parasolDb.useCase.findMany({
      include: {
        operation: {
          select: {
            name: true,
            displayName: true
          }
        },
        robustnessDiagram: true,
        pageDefinitions: true,
        testDefinitions: true
      },
      orderBy: [
        { operationId: 'asc' },
        { order: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: useCases
    });

  } catch (_error) {
    console.error('Error fetching use cases:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}
