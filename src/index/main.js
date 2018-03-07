/**
 * Created by qcc 2018-03-01
 */
import React from 'react'
import ReactDOM from 'react-dom'

import { Button } from 'antd'

import { DatePicker } from 'antd'

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            date: +new Date(),
            list: []
        }
    }

    componentDidMount() {
        console.log('componentDidMount')
        const that = this
        /* that.timeId = setInterval(() => {
            that.tick()
        }, 1000) */
        that.ulProcess()
    }

    componentWillUnmount() {
        console.log('componentWillUnmount')
        clearInterval(this.timeId)
    }

    tick() {
        const that = this
        /* that.setState({
            date: new Date()
        }) */
        /* that.setState((prevState, props) => ({
            date: prevState.date+'test'
        })) */
    }

    goLink(e) {
        e.preventDefault()
        console.log('The link was clicked.')
    }

    onChange(date, dateString) {
        console.log(date, dateString);
    }

    ulProcess() {
        const numbers = [1, 2, 3, 4, 5]
        const listItems = numbers.map((number, index) =>
            <li key={index}>{number}</li>
        )
        return (
            <ul>{listItems}</ul>
        )
    }

    render() {
        return (
            <div>
                <div style={{ padding: '50px'}}>
                    <DatePicker onChange={this.onChange} />&nbsp;
                <Button type="primary">原始按钮</Button>&nbsp;
                <Button>Default</Button>&nbsp;
                <Button type="dashed">Dashed</Button>&nbsp;
                <Button type="danger">Danger</Button>
            </div>
            <ul>{this.ulProcess()}</ul>
            <div>It is { this.state.date }</div>
            <div><a href="#" onClick={this.goLink}>goLink</a></div>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))