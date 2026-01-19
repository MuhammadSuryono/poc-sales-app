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