export interface BackendErrorEnvelope {
  error?: {
    code?: string;
    message?: string;
    fields?: Record<string, string> | Array<{ field: string; message: string }>;
  };
  requestId?: string;
  // Allow any passthrough for non-standard backends
  [key: string]: any;
}

export interface AdaptedError {
  code?: string;
  message?: string;
  fields: Record<string, string>;
  requestId?: string;
}

/**
 * Adapt various backend error shapes into a uniform structure
 * No string guessing beyond field normalization; prefer error.code and error.fields.
 */
export function adaptBackendError(data: any): AdaptedError {
  const env: BackendErrorEnvelope | undefined = data;
  const code = env?.error?.code;
  const message = env?.error?.message || data?.message;
  const requestId = env?.requestId || data?.requestId;

  const fields: Record<string, string> = {};
  const rawFields = env?.error?.fields ?? data?.fields ?? data?.details;

  if (rawFields && Array.isArray(rawFields)) {
    // Array of { field, message }
    for (const item of rawFields) {
      if (item?.field && item?.message) fields[item.field] = item.message;
    }
  } else if (rawFields && typeof rawFields === 'object') {
    // Map of field -> message
    for (const [k, v] of Object.entries(rawFields)) {
      fields[k] = Array.isArray(v) ? v.join(', ') : String(v);
    }
  }

  // Special cases
  if (code === 'EMAIL_ALREADY_EXISTS' && !fields.email) {
    fields.email = 'Cet email existe déjà. Veuillez utiliser une autre adresse.';
  }

  return {
    code,
    message,
    fields,
    requestId,
  };
}
