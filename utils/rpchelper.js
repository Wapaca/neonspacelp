export const fetchTable = async(rpc, contract, scope, table, params = {}, prevRows = []) => {
  const res = await rpc.get_table_rows({
    code: contract,
    scope: scope,
    table: table,
    limit: params.limit || 1000,
    lower_bound: params.lower_bound || null,
    upper_bound: params.upper_bound || null,
    reverse: false,
    show_payer: false,
    json: true,
  })

  let rows = prevRows.concat(res.rows)
  if(res.more) {
    params.lower_bound = res.next_key
    rows = await fetchTable(rpc, contract, scope, table, params, rows)
    return rows
  }
  else
    return rows
}