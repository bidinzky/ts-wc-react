/**
 * Dummy test
 */
import {
  setState,
  StateHandler,
  UpdateFunctionGuardPick,
  UpdateFunctionGuardS,
  UpdateFunctionGuardOther
} from '../src/state'

describe('check updateFunction Guards', () => {
  let statehandler: StateHandler<{ x: number; y: number }> = {
    state: { x: 0, y: 1 },
    new_state: undefined
  }
  let props = {}

  afterEach(() => {
    statehandler.state = { x: 0, y: 1 }
    statehandler.new_state = undefined
    props = {}
  })

  let u1 = (s: { x: number; y: number }) => {
    return {
      x: s.x + 1
    }
  }
  let u2 = (s: { x: number; y: number }) => s.x++
  let u3 = (s: { x: number; y: number }) => {
    return {
      x: s.x + 1,
      y: 1
    }
  }

  it('check guard test partial without inline mutation on ', () => {
    let res = u1(statehandler.state)
    expect(UpdateFunctionGuardPick(res, statehandler.state)).toBe(true)
    let res2 = u2(statehandler.state)
    expect(UpdateFunctionGuardPick(res2, statehandler.state)).toBe(false)
    let res3 = u3(statehandler.state)
    expect(UpdateFunctionGuardPick(res3, statehandler.state)).toBe(true)
  })

  it('check guard test inline mutation', () => {
    let res = u1(statehandler.state)
    expect(UpdateFunctionGuardOther(res, statehandler.state)).toBe(false)
    let res2 = u2(statehandler.state)
    expect(UpdateFunctionGuardOther(res2, statehandler.state)).toBe(true)
    let res3 = u3(statehandler.state)
    expect(UpdateFunctionGuardOther(res3, statehandler.state)).toBe(false)
  })

  it('check guard test full without mutation', () => {
    let res = u1(statehandler.state)
    expect(UpdateFunctionGuardS(res, statehandler.state)).toBe(false)
    let res2 = u2(statehandler.state)
    expect(UpdateFunctionGuardS(res2, statehandler.state)).toBe(false)
    let res3 = u3(statehandler.state)
    expect(UpdateFunctionGuardS(res3, statehandler.state)).toBe(true)
  })

  it('test partial without inline mutation', () => {
    setState(statehandler, props, u1)
    expect(statehandler.new_state).toEqual({ x: 1, y: 1 })
  })

  it('test inline mutation', () => {
    setState(statehandler, props, u2)
    expect(statehandler.new_state).toEqual({ x: 1, y: 1 })
  })

  it('test full without mutation', () => {
    setState(statehandler, props, u3)
    expect(statehandler.new_state).toEqual({ x: 1, y: 1 })
  })
})

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
