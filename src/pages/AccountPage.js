import { Component } from 'react'


class AccountPage extends Component{

  constructor(props) {
    super(props);

    this.state = {
    }
  }


  render() {
    return(
      <div>
      <p>{this.props.location.state.username}</p>
      <p>{this.props.location.state.password}</p>
    </div>
    )
  }

}

export default AccountPage;
