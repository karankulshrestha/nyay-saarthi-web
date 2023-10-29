import { Storage } from '@google-cloud/storage'
import { NextRequest, NextResponse } from 'next/server'
const { format } = require('util')
import prisma from '../../../../prisma/index'

const storage = new Storage({
  projectId: 'clear-radio-398914',
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL,
    private_key: process.env.GCS_PRIVATE_KEY?.split(String.raw`\n`).join('\n'),
  },
})

const bucket = storage.bucket('advocate_bucket_profiles')

export async function POST(req: NextRequest) {
  const data = await req.formData()
  const file: File | null = (data.get('file') as unknown) as File
  const name = data.get('name')
  const bio = data.get('bio')
  const phone = data.get('phone')
  const email = data.get('email')
  const profile = data.get('key')
  const fileSizeInMegabytes = file.size / (1024 * 1024)

  console.log(name, bio, phone, email, profile)

  if (fileSizeInMegabytes > 23) {
    return NextResponse.json(
      { success: false, msg: 'profile size exceeded' },
      { status: 413 },
    )
  }

  if (!file) {
    return NextResponse.json({ success: false })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  try {
    const blob = bucket.file(file.name)
    const blobStream = blob.createWriteStream()
    const publicUrl = format(
      `https://storage.cloud.google.com/${bucket.name}/${blob.name}`,
    )

    blobStream.on('finish', async () => {
      console.log(publicUrl)

      let advocateProfile = await prisma.advocateDetails.create({
        data: {
          name: name as string,
          bio: bio as string,
          fileURI: publicUrl,
          email: email as string,
          phone: phone as string,
        },
      })
      return NextResponse.json({ advocateProfile }, { status: 200 })
    })
    blobStream.end(buffer)

    return NextResponse.json(
      { success: true, msg: `file uploaded successfully + ${publicUrl}` },
      { status: 200 },
    )
  } catch (error) {
    console.log(error)
  }
}
