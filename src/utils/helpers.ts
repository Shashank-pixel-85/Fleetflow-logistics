export function initials(name: string) {
  return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-IN').format(value)
}
