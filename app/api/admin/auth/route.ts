import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Simple token-based auth (in production, use proper JWT/sessions)
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Get credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
   
    // Validate credentials
    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { success: false, message: 'Admin not configured' },
        { status: 500 }
      );
    }

    if (email === adminEmail && password === adminPassword) {
      // Generate a simple token
      const token = uuidv4();
      
      return NextResponse.json({
        success: true,
        token,
        message: 'Login successful',
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}

