import { Storage } from '@google-cloud/storage'
import { NextRequest, NextResponse } from 'next/server'
const { format } = require('util')
import prisma from '../../../../prisma/index'
import { downloadFromCloud } from '@/utils/gcp-server'

const storage = new Storage({
  projectId: 'clear-radio-398914',
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL,
    private_key: process.env.GCS_PRIVATE_KEY?.split(String.raw`\n`).join('\n'),
  },
})

const bucket = storage.bucket('nyay_bucket_files')

export async function POST(req: NextRequest) {
  const data = await req.formData()
  const file: File | null = (data.get('file') as unknown) as File
  const botname = data.get('botname')
  const botdesc = data.get('botdesc')
  const icon = data.get('icon')
  const tags = data.getAll('tags[]')
  const email = data.get('email')
  const filename = data.get('key')
  const fileSizeInMegabytes = file.size / (1024 * 1024)

  console.log(botname, botdesc, tags, icon, email)

  if (fileSizeInMegabytes > 23) {
    return NextResponse.json(
      { success: false, msg: 'file size exceeded' },
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
      const promise = new Promise<string>(async function (resolve, reject) {
        const namespace = await downloadFromCloud(filename as string)
        resolve(namespace)
      })
  
      promise.then(async (res) => {
        let fileData = await prisma.modelDetails.create({
          data: {
            email: email as string,
            fileURI: publicUrl,
            namespace: res,
            name: botname as string,
            description: botdesc as string,
            icon: icon as string,
            tags: tags as [],
          },
        })
        return NextResponse.json({ fileData }, { status: 200 })
      })
    })
    blobStream.end(buffer)


    return NextResponse.json({success: true, msg:`file uploaded successfully + ${publicUrl}`}, {status:200});

  } catch (error) {
    console.log(error)
  }
}
