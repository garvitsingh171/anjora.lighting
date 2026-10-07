export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

export interface Web3FormsPayload {
  access_key: string
  subject: string
  from_name: string
  name: string
  email: string
  phone: string
  project_type: string
  message: string
  page_url: string
  botcheck: boolean
  source?: string
  interested_project?: string
}

export interface Web3FormsResponse {
  success: boolean
  message?: string
}

function isWeb3FormsResponse(value: unknown): value is Web3FormsResponse {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  return typeof candidate.success === 'boolean'
    && (candidate.message === undefined || typeof candidate.message === 'string')
}

export async function submitWeb3FormsEnquiry(
  payload: Web3FormsPayload,
  signal: AbortSignal,
): Promise<Web3FormsResponse> {
  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  })

  let result: unknown
  try {
    result = await response.json()
  } catch {
    throw new Error('Web3Forms returned an invalid response.')
  }

  if (!response.ok || !isWeb3FormsResponse(result) || !result.success) {
    const serviceMessage = isWeb3FormsResponse(result) ? result.message : undefined
    throw new Error(serviceMessage || `Web3Forms request failed with status ${response.status}.`)
  }

  return result
}
