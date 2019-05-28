/**
 * Dummy test
 */
import { setState, StateHandler } from '../src/state'

describe('setState with undefined new_state', () => {
  let statehandler: StateHandler<{ x: number }> = {
    state: { x: 0 },
    new_state: undefined
  }
  let props = {}

  afterEach(() => {
    statehandler.state = { x: 0 }
    statehandler.new_state = undefined
    props = {}
  })

  it('set state with function inline mutation', () => {
    setState(statehandler, props, (s: { x: number }) => s.x++)
    expect(statehandler.new_state).toEqual({ x: 1 })
  })

  it('set state with function object', () => {
    setState(statehandler, props, (s: { x: number }) => {
      return {
        x: s.x + 1
      }
    })
    expect(statehandler.new_state).toEqual({ x: 1 })
  })

  it('set state with object', () => {
    setState(statehandler, props, {
      x: statehandler.state.x + 1
    })
    expect(statehandler.new_state).toEqual({ x: 1 })
  })

  it('check callback', done => {
    setState(
      statehandler,
      props,
      (s: { x: number }) => s.x++,
      () => {
        expect(statehandler.new_state).toEqual({ x: 1 })
        done()
      }
    )
  })
})

describe('setState without undefined new_state', () => {
  let statehandler: StateHandler<{ x: number }> = {
    state: { x: 0 },
    new_state: { x: 5 }
  }
  let props = {}

  afterEach(() => {
    statehandler.state = { x: 0 }
    statehandler.new_state = { x: 0 }
    props = {}
  })

  it('set state with function inline mutation', () => {
    setState(statehandler, props, (s: { x: number }) => s.x++)
    expect(statehandler.new_state).toEqual({ x: 1 })
  })

  it('set state with function object', () => {
    setState(statehandler, props, (s: { x: number }) => {
      return {
        x: s.x + 1
      }
    })
    expect(statehandler.new_state).toEqual({ x: 1 })
  })

  it('set state with object', () => {
    setState(statehandler, props, {
      x: statehandler.state.x + 1
    })
    expect(statehandler.new_state).toEqual({ x: 1 })
  })

  it('check callback', done => {
    setState(
      statehandler,
      props,
      (s: { x: number }) => s.x++,
      () => {
        expect(statehandler.new_state).toEqual({ x: 1 })
        done()
      }
    )
  })
})
