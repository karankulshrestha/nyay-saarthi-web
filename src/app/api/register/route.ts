import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "../../../../prisma/index";

export async function POST(req: Request, res: Response) {
  try {
    const { email, password } = await req.json();
    console.log(email, password);

    const existedUser = await prisma.credentials.findUnique({
        where: {
            email
        }
    });

    if(existedUser) {
        return NextResponse.json({msg:"user already exists"}, {status:403});
    }

    const hashedPassword = await bcrypt.hashSync(password, 8);
    
    let user = await prisma.credentials.create({
      data: { email, password: hashedPassword },
    });

    return NextResponse.json({ msg: user}, {status: 200});
  } catch (e: any) {
    console.log(e.message);
    return NextResponse.json({ msg: e.message}, {status: 500});
  }
}
