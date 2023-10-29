import {NextResponse } from "next/server";
import prisma  from "../../../../prisma/index";

export async function GET(req:Request) {
    try {
        const models = await prisma.modelDetails.findMany()
        return NextResponse.json(models, {status: 200});   
    } catch (error) {
        return NextResponse.json({error: error});
    }
  }