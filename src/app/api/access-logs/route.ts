import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';

export async function GET() {
  try {
    const logs = await database.getAccessLogs();
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch access logs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id, type, password } = await request.json();
    await database.logAccess(id, type, password);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log access' }, { status: 500 });
  }
}

