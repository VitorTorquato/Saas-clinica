export function isToday(date: Date){
        const now = new Date();

        return (
            date.getFullYear() === now.getFullYear()&&
            date.getMonth() === now.getMonth()&&
            date.getDate() === now.getDate()
        )

}


/**
 * Verify if the seleceted slot is in the past.
 */
export function isSlotInThePast(slotTime : string){
        const [slotHour , slotMinute] = slotTime.split(":").map(Number)

        const now = new Date()
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        if(slotHour < currentHour){
            return true; //It measn the the hour is in the past
        }else if(slotHour === currentHour && slotMinute <= currentMinute){
            return true;
        }

        return false;
}