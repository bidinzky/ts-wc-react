export interface StateHandler<S> {
  state: S
  new_state?: S
}

export type UpdateFunction<S, P, K extends keyof S> = (
  prevState: S,
  props: P
) => Pick<S, K> | S | S[K]
export function UpdateFunctionGuardPick<S, P, K extends keyof S>(
  u: Pick<S, K> | S | S[K],
  s: S
): u is Pick<S, K> {
  let k = Object.keys(s)
  let is_key_in_u = false
  // tslint:disable-next-line:strict-type-predicates
  if (typeof u === 'object') {
    for (let k of Object.keys(s)) {
      if (k in u) {
        is_key_in_u = true
        break
      }
    }
  }

  return false || is_key_in_u
}
export function UpdateFunctionGuardS<S, P, K extends keyof S>(
  u: Pick<S, K> | S | S[K],
  s: S
): u is S {
  let k = Object.keys(s)
  // tslint:disable-next-line:strict-type-predicates
  let is_key_in_u = typeof u === 'object'
  if (is_key_in_u) {
    for (let k of Object.keys(s)) {
      if (!(k in u)) {
        is_key_in_u = false
      }
    }
  }

  return false || is_key_in_u
}

export function UpdateFunctionGuardOther<S, P, K extends keyof S>(
  u: Pick<S, K> | S | S[K],
  s: S
): u is S {
  return !UpdateFunctionGuardPick(u, s)
}

export function setState<S, P, K extends keyof S>(
  state_handler: StateHandler<S>,
  props: P,
  update: UpdateFunction<S, P, K> | (Pick<S, K> | S | null),
  callback?: () => void
): void {
  if (!state_handler.new_state) {
    state_handler.new_state = Object.assign({}, state_handler.state)
  }

  if (typeof update !== 'function') {
    Object.assign(state_handler.new_state, update)
  } else {
    let u = (update as UpdateFunction<S, P, K>)(state_handler.state, props)
    if (UpdateFunctionGuardS(u, state_handler.state)) {
      state_handler.new_state = u
    } else if (UpdateFunctionGuardPick(u, state_handler.state)) {
      Object.assign(state_handler.new_state, u)
    } else {
      state_handler.new_state = state_handler.state
    }
  }
  if (callback) {
    callback()
  }
}
