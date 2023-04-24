import React from 'react'
import { connect } from 'react-redux'
import * as qActions from '../../reducer/portal/query/actions'

interface ViewProps {
  submitForm: Function,
}

export class Query extends React.Component <ViewProps, any> {
  constructor(props:any) {
    super(props)
  }
  render() { console.log("component: query")
    return (
      <div className="queryForm center">
        <form method="GET" id="qForm" onSubmit={this.props.submitForm()}>
          <label className="center" htmlFor="qTitle">Select Title:</label>
          <input className=".input-search input-minimal center" type="text" id="qTitle" name="title" placeholder="Title" />
          <div className="dateInput">
            <input className="radio-group-input" type="radio" id="qRCreatedBefore" name="rcreated" value="before" defaultChecked/>
            <label className="radio-group-label" htmlFor="qRCreatedBefore">Before</label>
            <input className="radio-group-input" type="radio" id="qRCreatedAfter" value="after" name="rcreated"/>
            <label className="radio-group-label" htmlFor="qRCreatedAfter">After</label>
          </div>
          <div>
            <label className="center" htmlFor="qDCreated">Select Date:</label>
            <input className=".input-search input-minimal center" type="date" id="qDCreated" name="dcreated" placeholder="mm/dd/yyyy" />
          </div>
          <input type="submit" className="center" value="Query" id="queryInputButton" onSubmit={this.props.submitForm()} />
          <input type="hidden" id="qCreated" name="created" />
        </form>
        <br/>
      </div>
    )
  }
}

const mapStateToProps = ({ query: { userItems }}:any) => ({
  userItems,
})
const mapDispatchToProps = (dispatch:any) => ({
  submitForm() { 
    return () => {
      dispatch(qActions.getUserItems)
    }
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Query)