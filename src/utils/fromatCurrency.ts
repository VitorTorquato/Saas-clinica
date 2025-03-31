const CURENCY_FORMATTER = new Intl.NumberFormat("pt-BR" , {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits:0
})

export function formatCurrency(number:number){
    return CURENCY_FORMATTER.format(number);
}