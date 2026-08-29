import { NextResponse } from 'next/server';

const globalForViewers = global as unknown as { activeUsers: Map<string, number> };
if (!globalForViewers.activeUsers) {
    globalForViewers.activeUsers = new Map<string, number>();
}
const activeUsers = globalForViewers.activeUsers;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, action } = body;

        const now = Date.now();

        if (action === 'leave' && id) {
            activeUsers.delete(id);
        } else if (id) {
            activeUsers.set(id, now);
        }

        // Clean up users inactive for more than 15 seconds
        for (const [key, lastSeen] of activeUsers.entries()) {
            if (now - lastSeen > 15000) {
                activeUsers.delete(key);
            }
        }

        return NextResponse.json({ count: activeUsers.size || 1 });
    } catch (e) {
        return NextResponse.json({ count: 1 });
    }
}
