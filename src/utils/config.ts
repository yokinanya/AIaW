export const MaxMessageFileSizeMB = parseFloat(process.env.MAX_MESSAGE_FILE_SIZE_MB || '20')
export const DocParseBaseURL = process.env.DOC_PARSE_BASE_URL
export const CorsFetchBaseURL = process.env.CORS_FETCH_BASE_URL
export const SyncServicePrice = process.env.SYNC_SERVICE_PRICE && parseFloat(process.env.SYNC_SERVICE_PRICE)
export const UsdToCnyRate = process.env.USD_TO_CNY_RATE && parseFloat(process.env.USD_TO_CNY_RATE)
export const DexieDBURL = process.env.DEXIE_DB_URL
export const LitellmBaseURL = process.env.LITELLM_BASE_URL
export const BudgetBaseURL = process.env.BUDGET_BASE_URL
