export interface StateHandler<S> {
  new_state?: S
  state: Readonly<S>
}

export function setState<S, P, K extends keyof S>(
  state_handler: StateHandler<S>,
  props: P,
  update:
    | ((prevState: S, props: P) => Partial<S> | Pick<S, K> | S | {})
    | (Partial<S> | Pick<S, K>),
  callback?: () => void
): void {
  if (!state_handler.new_state) {
    state_handler.new_state = Object.assign({}, state_handler.state)
  }

  if (typeof update !== 'function') {
    Object.assign(state_handler.new_state, update)
  } else {
    let u = update(state_handler.state, props)
    if (typeof u !== 'object') {
      state_handler.new_state = state_handler.state
    } else {
      Object.assign(state_handler.new_state, u)
    }
  }
  if (callback) {
    callback()
  }
}
