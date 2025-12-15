import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const { email } = await request.json()
        const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY

        const response = await fetch(`https://connect.mailerlite.com/api/subscribers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
            },
            body: JSON.stringify({
                email: email,
            }),
        })

        if (response.ok) {
            return NextResponse.json({ message: 'Subscribed successfully' }, { status: 200 })
        } else {
            const errorData = await response.json()
            return NextResponse.json({ message: 'Subscription failed', error: errorData }, { status: 400 })
        }
    } catch (error) {
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 })
    }
}