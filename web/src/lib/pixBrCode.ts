/**
 * Builds a PIX BR Code (EMV Merchant-Presented Mode) payload suitable for QR encoding.
 * Spec: BACEN Manual de Padrões para Iniciação do PIX — Parte 2 (QR Code).
 *
 * All fields use the TLV structure: <ID(2)><Length(2)><Value>.
 * The final 4-char CRC is CRC16-CCITT (poly 0x1021, init 0xFFFF) over the whole
 * string including the "6304" placeholder (ID+length), excluding the CRC value itself.
 */

function tlv(id: string, value: string): string {
  return `${id}${value.length.toString().padStart(2, '0')}${value}`
}

function crc16ccitt(str: string): string {
  let crc = 0xffff
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0')
}

/**
 * Returns a standards-compliant PIX BR Code payload string.
 *
 * @param pixKey  - The PIX key (email, CPF, CNPJ, phone +55…, or random UUID).
 * @param merchantName - Recipient name shown in banking apps (max 25 chars, ASCII).
 * @param merchantCity - Recipient city shown in banking apps (max 15 chars, ASCII).
 */
export function buildPixPayload(
  pixKey: string,
  merchantName = 'BENEFICIARIO',
  merchantCity = 'BRASIL',
): string {
  const name = merchantName.slice(0, 25).toUpperCase()
  const city = merchantCity.slice(0, 15).toUpperCase()

  const merchantAccount = tlv('26', tlv('00', 'BR.GOV.BCB.PIX') + tlv('01', pixKey))
  const additionalData = tlv('62', tlv('05', '***'))

  const body = [
    tlv('00', '01'),
    tlv('01', '11'),
    merchantAccount,
    tlv('52', '0000'),
    tlv('53', '986'),
    tlv('58', 'BR'),
    tlv('59', name),
    tlv('60', city),
    additionalData,
    '6304',
  ].join('')

  return body + crc16ccitt(body)
}
