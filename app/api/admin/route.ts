import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(req: NextRequest) {
  try {
    // Read and parse JSON body
    const body = await req.json();
    const { id } = body;

    // Validate that id exists
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID is required' },
        { status: 400 }
      );
    }

    // Delete the order from Supabase "orders" table
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    // Handle deletion error
    if (error) {
      console.error('Failed to delete order:', error);
      return NextResponse.json(
        { success: false, message: error.message || 'Failed to delete website' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Website deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/admin:', error);
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}

