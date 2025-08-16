import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';

export async function GET() {
  try {
    const contacts = await database.getContacts();
    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const contact = await request.json();
    await database.addContact(contact);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add contact' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { oldId, ...contact } = await request.json();
    await database.updateContact(oldId, contact);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    await database.deleteContact(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}

