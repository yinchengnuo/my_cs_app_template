export default (scope, PROPS) => {
    if (scope.column.emptyText) return scope.column.emptyText(scope)
    if (PROPS.emptyText) return PROPS.emptyText(scope)
}
