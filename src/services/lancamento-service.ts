import { http, CORE_BASE_URL } from '@/lib/http'

export interface OcrRequest {
  texto: string
  campos_parciais?: {
    valor?: number | null
    data?: string | null
    natureza?: number | null
    id_tp_lcto?: number | null
    id_pessoa?: number | null
  }
}

export interface OcrResponse {
  valor: number | null
  data: string | null
  natureza: 1 | 2 | null
  descricao: string | null
  cnpj: string | null
  id_pessoa: number | null
  campos_ausentes: string[]
}

export async function callOcr(req: OcrRequest): Promise<OcrResponse> {
  const axios = http.getAxiosInstance()
  const response = await axios.post<OcrResponse>(`${CORE_BASE_URL}/mobile/ocr`, req)
  return response.data
}

export type TipoDocumento =
  | 'nota_fiscal'
  | 'nota_debito'
  | 'recibo'
  | 'boleto'
  | 'contrato'
  | 'comprovante_pagamento'
  | 'invoice'

export interface UploadAnexoParams {
  lancamentoServerId: number
  fileUri: string
  fileName: string
  mimeType: string
  tipoDocumento?: TipoDocumento
  enviarContabilidade?: boolean
}

export async function uploadAnexo(params: UploadAnexoParams): Promise<void> {
  const axios = http.getAxiosInstance()
  const formData = new FormData()
  formData.append('file', {
    uri: params.fileUri,
    name: params.fileName,
    type: params.mimeType,
  } as any)
  if (params.tipoDocumento) {
    formData.append('tipo_documento', params.tipoDocumento)
  }
  formData.append('enviar_contabilidade', params.enviarContabilidade ? '1' : '0')

  await axios.post(
    `${CORE_BASE_URL}/lancamentos/${params.lancamentoServerId}/anexos`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
}
