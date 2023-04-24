import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as qActions from '../../reducer/portal/query/actions'

interface Item {
  id: string,
  title?: string,
  created?: EpochTimeStamp,
  tags?: string[],
}

interface ItemProps {
  userItems: Item[],
  userTags: string[],
  addItemTags: Function,
  deleteItemTags: Function,
}

export class QueryTable extends React.Component <ItemProps, any> {
  constructor(props:any) {
    super(props)
  }
  public static defaultProps = { userItems: [{id:'',}], userTags: ['',]}
  addTags() { console.log("'add tag(s)' button clicked")
    this.props.addItemTags()
  }
  deleteTags(id:string) { console.log("'delete tag(s)' button clicked")
    document.getElementById(id)!.className = 'deleteMe'
    this.props.deleteItemTags()
  }

  render() { console.log("component: query-table")
    return (
        <table className="center">
          <thead>
            <tr>
              <th>title</th><th>created</th><th>tags</th>
              <th><button className="addTagButton" onClick={() => this.addTags()}>add tag(s)</button></th>
            </tr>
          </thead>
          <tbody>
            {this.props.userItems.map((userItems,index) => (
            <tr key={index} id={userItems.id}>
              <td>{userItems.title}</td>
              <td>{(new Date(userItems.created!)).toDateString()},<br/>Unix:{userItems.created!}</td> 
              <td> 
                {userItems.tags!.map((tag,index) => (
                  <span key={index}>
                    <span className="tagButton">
                      {tag}
                      <button className="xButton" value={tag} id={'delete' + tag + userItems.id} onClick={() => this.deleteTags('delete' + tag + userItems.id)}>x</button>
                    </span>
                  </span>
                ))}
              </td>
              <td>
                <select className="selectTags" name={'select'+userItems.id} id={'select'+userItems.id} >
                  <option></option>
                  {(this.props.userTags!
                    .filter(e => !userItems.tags!.includes(e)))
                    .map((tag) => (
                      <option key={tag} value={tag} id={tag+userItems.id}>{tag}</option>  
                    )
                  )}
                </select>
                <input type="text" className="inputTags" name={'input'+userItems.id} id={'input'+userItems.id} placeholder="Custom Tag"/>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
    )
  }
}

const mapStateToProps = ({ query: { userItems, userTags }}:any) => ({
  userItems,
  userTags,
})
function mapDispatchToProps(dispatch:any) {
  return {
    addItemTags: bindActionCreators(qActions.addItemTags, dispatch),
    deleteItemTags: bindActionCreators(qActions.deleteItemTags, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QueryTable)