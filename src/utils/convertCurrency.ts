/**
 * Converte um valor monetario em reais (BRL) para centavos.
 * @param {string} amount - O valor monetario em reais (BRL) a ser convertido
 * @returns {number} O valor convertido em centavos
 * 
 * @example
 * convertRealtToCents("1.300,50"); // Retona 12345 cents
 */
export function convertRealToCents(amount: string){
        const numericPrice = parseFloat(amount.replace(/\./g, '').replace(',' , '.'));
        const priceInCents = Math.round(numericPrice * 100);

        return priceInCents;

}

// - valor em centavos = valor em reais * 100
// - valor em reais = valor em centavos / 100