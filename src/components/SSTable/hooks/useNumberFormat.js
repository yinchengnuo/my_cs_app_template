import { numberToLocaleString } from '..'

export default (scope) => {
    return scope.column.separate && !isNaN(Number(scope.value)) && numberToLocaleString(Number(scope.value))
}
