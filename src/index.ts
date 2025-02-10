import { render, setRender } from './mini-react';
import { App } from './App'

const container = document.getElementById("root") as HTMLElement

const reRender = () => {
    render(App(), container)
}

setRender(reRender)

reRender()
