export type AllowJustOne<T, Keys extends keyof T = keyof T> = Omit<T, Keys> &
  {
    [K in Keys]-?: Pick<T, K> & Partial<Record<Exclude<Keys, K>, undefined>>
  }[Keys]

export type RequireIfSet<T, Keys extends keyof T> = Omit<T, Keys> &
  (Partial<Record<Keys, undefined>> | Required<Pick<T, Keys>>)

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Pick<T, K> & Pick<T, Exclude<Keys, K>>
  }[Keys] &
  Omit<T, Keys>
