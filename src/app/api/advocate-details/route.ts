import {NextResponse } from "next/server";
import prisma  from "../../../../prisma/index";

export async function GET(req:Request) {
    try {
        const data = await prisma.advocateDetails.findMany()
        return NextResponse.json(data, {status: 200});   
    } catch (error) {
        return NextResponse.json({error: error});
    }
  }