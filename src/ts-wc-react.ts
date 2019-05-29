import * as React from 'jsx-dom'
import { setState, UpdateFunction } from './state'

export { bind } from 'bind-decorator'
export { React }

export interface SimpleReact<S = any, P = {}> {
  shouldComponentUpdate?(new_state: S, new_props: P): boolean
  componentWillUnmount?(): void
  render?(state?: S, props?: P): JSX.Element
}

export class SimpleReact<S, P> extends HTMLElement {
  private observer = new MutationObserver(() => {
    this.handleRender()
  })
  public state: S = {} as S
  public new_state: S = {} as S
  private props: P = {} as P
  private shadow: ShadowRoot

  setState<K extends keyof S>(update: UpdateFunction<S, P, K>, callback?: () => void): void {
    setState<S, P, K>(this, this.props, update, () => {
      this.handleRender()
      if (callback) {
        callback()
      }
    })
  }

  private static mapAttributes<S, P>(ele: SimpleReact<S, P>): P {
    let obj: P = {} as P
    for (let i of ele.attributes) {
      ;(obj as any)[i.name] = i.value
    }
    return obj
  }

  constructor() {
    super()
    this.observer.observe(this, {
      attributes: true
    })
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  private handleRender() {
    if (this.render) {
      let new_props = SimpleReact.mapAttributes(this)
      let shouldUpdate =
        this.shouldComponentUpdate && this.new_state
          ? this.shouldComponentUpdate(this.new_state, new_props)
          : true
      if (shouldUpdate) {
        this.state = Object.assign(this.state, this.new_state)
        this.props = Object.assign(this.props, new_props)
        let renderOutput = this.render(this.state, this.props)
        if (renderOutput) {
          this.shadow.innerHTML = ''
          this.shadow.appendChild(renderOutput)
        }
      }
    }
  }

  connectedCallback() {
    // this._attr = [...this.attributes];
    this.handleRender()
  }

  disconnectedCallback() {
    this.observer.disconnect()
    if (this.componentWillUnmount) {
      this.componentWillUnmount()
    }
  }
}
