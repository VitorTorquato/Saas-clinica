import prisma from "@/lib/prisma";
import { NextRequest , NextResponse} from 'next/server';


export async function GET(request: NextRequest){

    const {searchParams} = request.nextUrl;


    const user_id = searchParams.get("user_id")
    const dateParam = searchParams.get("date")

    if(!user_id || user_id === "null" || !dateParam || dateParam === "null"){
        return NextResponse.json({
            error: "Nenhum agendamento encontrado"
        },
        {
            status: 400
        })
    }

    try{
        //converting the received date in an object date
        const [year,month, day] = dateParam.split("-").map(Number)
        const startDate = new Date(year, month -1 , day, 0,0,0)
        const endDate = new Date(year, month -1 , day, 23,59,59, 999)

        console.log("Start Date" , startDate)
        console.log("end Date" , endDate)


        return NextResponse.json({
            ok:true
        })
    }catch(err){
        console.error("something went wrong" , err)
        return NextResponse.json({
            error: "Nenhum agendamento encontrado"
        },
        {
            status: 400
        })
    }
}