import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Main extends Component {

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              <h2>Add Details of ride</h2>
              <form onSubmit={(event) => {
                event.preventDefault()
                const name = this.name.value
                const pno = this.pno.value
                const cityst = this.cityst.value
                const cityend = this.cityend.value
                const amount = this.amount.value
                this.props.uploadImage(name, pno, cityst, cityend, amount)
              }} >
                <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
                <div className="form-group mr-sm-2">
                  <br></br>
                  <input
                    id="name"
                    type="text"
                    ref={(input) => { this.name = input }}
                    className="form-control"
                    placeholder="Full Name..."
                    required />
                  <input
                    id="pno"
                    type="tel"
                    ref={(input) => { this.pno = input }}
                    className="form-control"
                    placeholder="Phone number" pattern="[0-9]{10}"
                    required />
                  <form class="form-inline">
                    <input
                      id="cityst"
                      type="text"
                      ref={(input) => { this.cityst = input }}
                      className="form-control"
                      placeholder="Starting City"
                      required />
                    <input
                      id="cityend"
                      type="text"
                      ref={(input) => { this.cityend = input }}
                      className="form-control"
                      placeholder="Destination City"
                      required />
                    <input
                      id="amount"
                      type="number"
                      ref={(input) => { this.amount = input }}
                      className="form-control"
                      placeholder="Amount"
                      required />
                  </form>
                </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">Upload!</button>
              </form>
              <p>&nbsp;</p>
              {this.props.images.map((image, key) => {
                return (
                  <div className="card mb-4" key={key} >
                    <div className="card-header">
                      <img
                        className='mr-2'
                        width='30'
                        height='30'
                        src={`data:image/png;base64,${new Identicon(image.author, 30).toString()}`}
                      />
                      <small className="text-muted">{image.author}</small>
                    </div>
                    <ul id="imageList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p className="text-center"><img src={`https://ipfs.infura.io/ipfs/${image.hash}`} style={{ maxWidth: '420px' }} /></p>
                        <p>{image.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{image.pno}</p>
                        <p>{image.cityst}&nbsp;&nbsp;&nbsp;&nbsp;------{'>'}&nbsp;&nbsp;&nbsp;&nbsp;{image.cityend}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          TIPS: {window.web3.utils.fromWei(image.tipAmount.toString(), 'Ether')} ETH
                        </small>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={image.id}
                          onClick={(event) => {
                            let tipAmount = window.web3.utils.toWei('1.0', 'Ether')
                            console.log(event.target.name, tipAmount)
                            this.props.tipImageOwner(event.target.name, tipAmount)
                          }}
                        >
                          TIP 1.0 ETH
                        </button>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={image.id}
                          onClick={(event) => {
                            let payAmount = window.web3.utils.toWei(image.amount, 'Ether')
                            console.log(event.target.name, payAmount)
                            this.props.payImageOwner(event.target.name, payAmount)
                          }}
                        >
                          PAY {image.amount}.0 ETH
                        </button>
                      </li>
                    </ul>
                  </div>
                )
              })}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;