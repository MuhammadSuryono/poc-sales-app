export interface DropdownActionItems {
    label: string,
    icon?: any,
    action?: (row: any) => void
}

export interface ColumnsData {
  field: string,
  headerName: string,
  numberFormat?: boolean,
  renderCell?: (data: RenderCellData) => RenderCellCallback
}

export interface RenderCellData {
  row: any,
  field: string,
  value: any,
  column: ColumnsData
}

export interface RenderCellCallback {
  component: any,
  props: any
}

export const TABLE_USER = 'users'
export const TABLE_TIKET = 'tickets'
export const TABLE_VISIT_HISTORY = 'visit_history'
export const TABLE_REIMBURSEMENT_GENERAL = 'reimbursements_general'
export const TABLE_REIMBURSEMENT_STORE = 'reimbursements_store'
export const TABLE_USER_POSITION_HISTORY = 'user_position_history'
export const V_TABLE_REIMBURSEMENT = 'v_reimbursements_summary'
export const TABLE_USER_ACTIVITY = 'user_activities'
export const V_TABLE_USER_POSITION_HISTORY = 'v_user_position'
export const V_TABLE_REIMBURSEMENT_LIST = 'v_reimbursements'
export const TABLE_VISIT_IMAGE = 'visit_images'
export const TABLE_PRODUCT = 'products'
export const TABLE_CART = 'carts'
export const TABLE_ORDER = 'orders'
export const TABLE_ORDER_PRODUCT = 'order_items'
