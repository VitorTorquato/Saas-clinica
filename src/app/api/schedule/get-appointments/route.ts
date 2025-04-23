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

        const user = await prisma.user.findFirst({
            where:{
                id: user_id
            }
        })

        if(!user){
            return NextResponse.json({
                error: "Nenhum agendamento encontrado"
            },
            {
                status: 400
            })
        }

        const appointments = await prisma.appointment.findMany({
            where:{
                user_id: user_id,
                appointmentDate:{
                    gte:startDate,
                    lte: endDate
                }
            },
            include:{
                sevice: true
            }
        
        })

        //slots ocupados
        const blockedSlots = new Set<string>()

        for (const apt of appointments){
            const requiredSlot = Math.ceil(apt.sevice.duration / 30)
            const startIndex = user.time_table.indexOf(apt.time)

            if(startIndex !== 1){
                for(let i = 0; i < requiredSlot; i++){
                    const blockedSlot = user.time_table[startIndex + i]
                    if(blockedSlot){
                        blockedSlots.add(blockedSlot)
                    }
                }
            }
        }

        const blockedTimes = Array.from(blockedSlots)

        return NextResponse.json(blockedTimes)


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