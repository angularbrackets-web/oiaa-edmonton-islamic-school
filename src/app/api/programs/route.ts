import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'src/data/programs.json')

export async function GET() {
  try {
    const data = await fs.readFile(dataPath, 'utf8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load programs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const updatedData = await request.json()
    await fs.writeFile(dataPath, JSON.stringify(updatedData, null, 2), 'utf8')
    return NextResponse.json({ success: true, message: 'Programs updated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update programs' }, { status: 500 })
  }
}